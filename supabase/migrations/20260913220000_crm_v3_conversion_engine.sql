-- CRM v3 Conversion Engine
-- Safe additive migration. Existing CRM tables remain untouched.

alter table public.crm_v3_leads
  add column if not exists stage text not null default 'new',
  add column if not exists lead_score integer not null default 0,
  add column if not exists score_band text not null default 'cold',
  add column if not exists intent text,
  add column if not exists requirement text,
  add column if not exists duration_days integer,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists last_activity_at timestamptz,
  add column if not exists next_action text,
  add column if not exists next_action_at timestamptz,
  add column if not exists loss_reason text,
  add column if not exists customer_id uuid;

alter table public.crm_v3_leads
  add constraint crm_v3_leads_score_range check (lead_score between 0 and 100);

create index if not exists idx_crm_v3_leads_next_action
  on public.crm_v3_leads (next_action_at) where status not in ('booked','lost');
create index if not exists idx_crm_v3_leads_score
  on public.crm_v3_leads (lead_score desc) where status not in ('booked','lost');
create index if not exists idx_crm_v3_leads_assigned_stage
  on public.crm_v3_leads (assigned_to, stage);
create index if not exists idx_crm_v3_leads_phone
  on public.crm_v3_leads (phone) where phone is not null;
create index if not exists idx_crm_v3_leads_travel_date
  on public.crm_v3_leads (travel_date) where travel_date is not null;

create table if not exists public.crm_v3_lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_v3_leads(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  activity_type text not null,
  channel text,
  direction text,
  subject text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint crm_v3_activity_type_check check (activity_type in ('created','call','whatsapp','email','meeting','note','quote_sent','quote_viewed','payment_request','payment_received','status_changed','assignment_changed','follow_up_completed','system'))
);

create index if not exists idx_crm_v3_activities_lead_time
  on public.crm_v3_lead_activities (lead_id, occurred_at desc);
create index if not exists idx_crm_v3_activities_actor_time
  on public.crm_v3_lead_activities (actor_id, occurred_at desc);

create table if not exists public.crm_v3_next_actions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_v3_leads(id) on delete cascade,
  assigned_to uuid,
  action_type text not null default 'follow_up',
  title text not null,
  notes text,
  due_at timestamptz not null,
  status text not null default 'pending',
  completed_at timestamptz,
  completed_by uuid references auth.users(id),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_v3_next_action_status_check check (status in ('pending','completed','cancelled','snoozed'))
);

create index if not exists idx_crm_v3_next_actions_due
  on public.crm_v3_next_actions (due_at, status) where status = 'pending';
create index if not exists idx_crm_v3_next_actions_owner
  on public.crm_v3_next_actions (assigned_to, due_at) where status = 'pending';
create index if not exists idx_crm_v3_next_actions_lead
  on public.crm_v3_next_actions (lead_id, due_at desc);

create table if not exists public.crm_v3_quote_events (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.crm_quotations(id) on delete cascade,
  lead_id uuid references public.crm_v3_leads(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint crm_v3_quote_event_type_check check (event_type in ('sent','opened','reopened','clicked','payment_clicked','accepted','rejected','expired'))
);

create index if not exists idx_crm_v3_quote_events_quote_time
  on public.crm_v3_quote_events (quotation_id, occurred_at desc);
create index if not exists idx_crm_v3_quote_events_lead_time
  on public.crm_v3_quote_events (lead_id, occurred_at desc);

create table if not exists public.crm_v3_assignment_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  priority integer not null default 100,
  is_active boolean not null default true,
  branch text,
  source text,
  destinations text[] not null default '{}',
  language text,
  max_open_leads integer,
  strategy text not null default 'workload_round_robin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_v3_assignment_strategy_check check (strategy in ('destination_expertise','workload_round_robin','round_robin'))
);

create index if not exists idx_crm_v3_assignment_rules_active
  on public.crm_v3_assignment_rules (is_active, priority);

create table if not exists public.crm_v3_import_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id),
  file_name text not null,
  file_type text not null,
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  duplicate_rows integer not null default 0,
  invalid_rows integer not null default 0,
  imported_rows integer not null default 0,
  assignment_mode text not null default 'auto',
  status text not null default 'preview',
  error_report jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint crm_v3_import_file_type_check check (file_type in ('csv','xlsx')),
  constraint crm_v3_import_assignment_check check (assignment_mode in ('auto','selected','from_file')),
  constraint crm_v3_import_status_check check (status in ('preview','processing','completed','failed'))
);

create index if not exists idx_crm_v3_import_jobs_creator
  on public.crm_v3_import_jobs (created_by, created_at desc);

-- RLS: all new exposed tables are protected. Access follows CRM user/admin model.
alter table public.crm_v3_lead_activities enable row level security;
alter table public.crm_v3_next_actions enable row level security;
alter table public.crm_v3_quote_events enable row level security;
alter table public.crm_v3_assignment_rules enable row level security;
alter table public.crm_v3_import_jobs enable row level security;

create policy crm_v3_activities_select on public.crm_v3_lead_activities
  for select to authenticated
  using (private.crm_is_admin() or actor_id = auth.uid() or exists (
    select 1 from public.crm_v3_leads l
    where l.id = crm_v3_lead_activities.lead_id
      and (l.assigned_to = auth.uid() or l.created_by = auth.uid())
  ));

create policy crm_v3_activities_insert on public.crm_v3_lead_activities
  for insert to authenticated
  with check (private.crm_is_user() and actor_id = auth.uid() and exists (
    select 1 from public.crm_v3_leads l
    where l.id = crm_v3_lead_activities.lead_id
      and (private.crm_is_admin() or l.assigned_to = auth.uid() or l.created_by = auth.uid())
  ));

create policy crm_v3_next_actions_select on public.crm_v3_next_actions
  for select to authenticated
  using (private.crm_is_admin() or assigned_to = auth.uid() or created_by = auth.uid());

create policy crm_v3_next_actions_insert on public.crm_v3_next_actions
  for insert to authenticated
  with check (private.crm_is_user() and created_by = auth.uid() and (assigned_to is null or assigned_to = auth.uid() or private.crm_is_admin()));

create policy crm_v3_next_actions_update on public.crm_v3_next_actions
  for update to authenticated
  using (private.crm_is_admin() or assigned_to = auth.uid() or created_by = auth.uid())
  with check (private.crm_is_admin() or assigned_to = auth.uid() or created_by = auth.uid());

create policy crm_v3_quote_events_select on public.crm_v3_quote_events
  for select to authenticated
  using (private.crm_is_admin() or exists (
    select 1 from public.crm_v3_leads l
    where l.id = crm_v3_quote_events.lead_id
      and (l.assigned_to = auth.uid() or l.created_by = auth.uid())
  ));

create policy crm_v3_quote_events_insert on public.crm_v3_quote_events
  for insert to authenticated
  with check (private.crm_is_user());

create policy crm_v3_assignment_rules_admin on public.crm_v3_assignment_rules
  for all to authenticated
  using (private.crm_is_admin())
  with check (private.crm_is_admin());

create policy crm_v3_import_jobs_select on public.crm_v3_import_jobs
  for select to authenticated
  using (private.crm_is_admin() or created_by = auth.uid());

create policy crm_v3_import_jobs_insert on public.crm_v3_import_jobs
  for insert to authenticated
  with check (private.crm_is_user() and created_by = auth.uid());

-- Keep the lead's denormalized next-action fields synchronized by application code.
comment on column public.crm_v3_leads.lead_score is '0-100 conversion score; application recalculates from travel date, engagement, budget, quote behavior and follow-up history.';
comment on column public.crm_v3_leads.next_action is 'Human-readable next action for the salesperson; active leads should never be left without one.';
