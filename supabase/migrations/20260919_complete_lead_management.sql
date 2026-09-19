-- CRM complete lead/query management schema
-- Apply before deploying the complete lead management workspace.
alter table public.enquiries
  add column if not exists query_text text,
  add column if not exists customer_type text default 'Client',
  add column if not exists company_name text,
  add column if not exists whatsapp text,
  add column if not exists service_type text default 'Full Package',
  add column if not exists from_destination text,
  add column if not exists to_destination text,
  add column if not exists return_date date,
  add column if not exists adults integer default 1,
  add column if not exists children integer default 0,
  add column if not exists infants integer default 0,
  add column if not exists budget numeric,
  add column if not exists stage_group text,
  add column if not exists owner_user_id uuid;

update public.enquiries
set
  customer_type = coalesce(customer_type, 'Client'),
  service_type = coalesce(service_type, 'Full Package'),
  adults = coalesce(adults, greatest(coalesce(travellers,1),1)),
  children = coalesce(children,0),
  infants = coalesce(infants,0),
  stage_group = coalesce(stage_group, case
    when status in ('Booked','Confirmed') then 'Converted'
    when status = 'Lost' then 'Lost'
    when status in ('Hot','Quote Sent','Follow-up','Qualified','Contacted') then 'Open'
    else 'Open'
  end);

create table if not exists public.crm_lead_saved_views (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid not null,
  filters jsonb not null default '{}'::jsonb,
  displayed_columns jsonb not null default '[]'::jsonb,
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_phone_idx on public.enquiries(phone);
create index if not exists enquiries_travel_date_idx on public.enquiries(travel_date);
create index if not exists enquiries_follow_up_idx on public.enquiries(follow_up);
create index if not exists enquiries_status_idx on public.enquiries(status);
create index if not exists enquiries_assigned_to_idx on public.enquiries(assigned_to);
create index if not exists crm_lead_saved_views_user_idx on public.crm_lead_saved_views(user_id);

alter table public.crm_lead_saved_views enable row level security;
