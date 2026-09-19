-- Compatibility layer for the existing On A Trip CRM schema.
-- Extends the existing supplier ledger and quotation master without replacing live data.

create table if not exists public.crm_trips (
  id uuid primary key default gen_random_uuid(), trip_code text not null unique,
  enquiry_id bigint references public.enquiries(id) on delete set null, customer_id uuid, package_id uuid,
  status text not null default 'draft' check (status in ('draft','confirmed','in_progress','completed','cancelled')),
  destination text, start_date date, end_date date, pax integer not null default 1,
  selling_amount numeric(14,2) not null default 0, cost_amount numeric(14,2) not null default 0,
  collected_amount numeric(14,2) not null default 0, outstanding_amount numeric(14,2) not null default 0,
  profit_amount numeric(14,2) not null default 0, salesperson_user_id uuid, operations_user_id uuid,
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.crm_trip_travellers (
  id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.crm_trips(id) on delete cascade,
  full_name text not null, traveller_type text not null default 'adult' check (traveller_type in ('adult','child','infant')),
  phone text,email text,dob date,gender text,id_type text,id_number text,passport_number text,passport_expiry date,
  special_requirements text,created_at timestamptz not null default now()
);

create table if not exists public.crm_trip_services (
  id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.crm_trips(id) on delete cascade,
  service_type text not null,service_name text not null,supplier_id uuid,start_at timestamptz,end_at timestamptz,
  quantity numeric(12,2) not null default 1,unit_cost numeric(14,2) not null default 0,sell_amount numeric(14,2) not null default 0,
  confirmation_no text,status text not null default 'pending',notes text,created_at timestamptz not null default now()
);

create table if not exists public.crm_trip_vouchers (
  id uuid primary key default gen_random_uuid(),trip_id uuid not null references public.crm_trips(id) on delete cascade,
  service_id uuid references public.crm_trip_services(id) on delete set null,voucher_no text not null unique,
  voucher_type text not null,status text not null default 'draft' check (status in ('draft','issued','used','cancelled')),
  issued_at timestamptz,payload jsonb not null default '{}'::jsonb,created_at timestamptz not null default now()
);

alter table public.crm_supplier_ledger add column if not exists trip_id uuid references public.crm_trips(id) on delete set null;
alter table public.crm_supplier_ledger add column if not exists reference_type text;
alter table public.crm_supplier_ledger add column if not exists due_date date;
alter table public.crm_supplier_ledger add column if not exists paid_at timestamptz;
alter table public.crm_supplier_ledger add column if not exists status text default 'pending';
update public.crm_supplier_ledger set reference_type=coalesce(reference_type,entry_type), status=coalesce(status,'pending') where reference_type is null or status is null;

create table if not exists public.crm_customer_ledger (
  id uuid primary key default gen_random_uuid(),trip_id uuid references public.crm_trips(id) on delete set null,
  customer_id uuid,reference_type text not null,reference_no text,debit numeric(14,2) not null default 0,
  credit numeric(14,2) not null default 0,due_date date,paid_at timestamptz,status text not null default 'pending',
  notes text,created_at timestamptz not null default now()
);

create table if not exists public.crm_lead_scores (
  enquiry_id bigint primary key references public.enquiries(id) on delete cascade,score integer not null default 0 check (score between 0 and 100),
  temperature text not null default 'cold' check (temperature in ('hot','warm','cold')),factors jsonb not null default '{}'::jsonb,calculated_at timestamptz not null default now()
);

alter table public.crm_quotations add column if not exists trip_id uuid references public.crm_trips(id) on delete set null;
alter table public.crm_quotations add column if not exists customer_name text;

create table if not exists public.crm_quotation_lines (
  id uuid primary key default gen_random_uuid(),quotation_id uuid not null references public.crm_quotations(id) on delete cascade,
  category text not null,description text not null,quantity numeric(12,2) not null default 1,
  cost_price numeric(14,2) not null default 0,sell_price numeric(14,2) not null default 0,tax_rate numeric(6,2) not null default 0,sort_order integer not null default 0
);

create table if not exists public.crm_customer_documents (
  id uuid primary key default gen_random_uuid(),customer_id uuid,trip_id uuid references public.crm_trips(id) on delete cascade,
  traveller_id uuid references public.crm_trip_travellers(id) on delete cascade,document_type text not null,file_path text not null,
  file_name text,expires_on date,status text not null default 'active',uploaded_by uuid,created_at timestamptz not null default now()
);

create table if not exists public.crm_campaigns (
  id uuid primary key default gen_random_uuid(),name text not null,channel text not null,source text,campaign_code text unique,
  start_date date,end_date date,budget numeric(14,2) not null default 0,spend numeric(14,2) not null default 0,leads integer not null default 0,
  bookings integer not null default 0,revenue numeric(14,2) not null default 0,status text not null default 'draft',
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);

create table if not exists public.crm_sales_targets (
  id uuid primary key default gen_random_uuid(),user_id uuid not null,period_start date not null,period_end date not null,
  target_amount numeric(14,2) not null default 0,achieved_amount numeric(14,2) not null default 0,bookings_target integer not null default 0,
  bookings_achieved integer not null default 0,created_at timestamptz not null default now(),unique(user_id,period_start,period_end)
);

create table if not exists public.crm_incentive_rules (
  id uuid primary key default gen_random_uuid(),name text not null,min_amount numeric(14,2) not null default 0,max_amount numeric(14,2),
  rate_percent numeric(6,2) not null default 0,fixed_amount numeric(14,2) not null default 0,is_active boolean not null default true,created_at timestamptz not null default now()
);

create table if not exists public.crm_incentive_payouts (
  id uuid primary key default gen_random_uuid(),user_id uuid not null,period_start date not null,period_end date not null,
  achievement_amount numeric(14,2) not null default 0,incentive_amount numeric(14,2) not null default 0,status text not null default 'calculated',
  created_at timestamptz not null default now(),unique(user_id,period_start,period_end)
);

create table if not exists public.crm_automation_rules (
  id uuid primary key default gen_random_uuid(),name text not null,trigger_type text not null,conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,is_active boolean not null default true,created_by uuid,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);

create table if not exists public.crm_customer_portal_tokens (
  id uuid primary key default gen_random_uuid(),trip_id uuid not null references public.crm_trips(id) on delete cascade,
  token_hash text not null unique,expires_at timestamptz,last_accessed_at timestamptz,revoked_at timestamptz,created_at timestamptz not null default now()
);

create table if not exists public.crm_feedback (
  id uuid primary key default gen_random_uuid(),trip_id uuid references public.crm_trips(id) on delete cascade,rating integer check (rating between 1 and 5),
  review text,source text,review_requested_at timestamptz,submitted_at timestamptz,created_at timestamptz not null default now()
);

create index if not exists idx_crm_trips_enquiry on public.crm_trips(enquiry_id);
create index if not exists idx_crm_trips_dates on public.crm_trips(start_date,end_date);
create index if not exists idx_crm_trip_services_trip on public.crm_trip_services(trip_id);
create index if not exists idx_crm_supplier_ledger_due on public.crm_supplier_ledger(due_date,status);
create index if not exists idx_crm_customer_ledger_trip on public.crm_customer_ledger(trip_id);
create index if not exists idx_crm_quotations_enquiry on public.crm_quotations(enquiry_id);
create index if not exists idx_crm_campaigns_dates on public.crm_campaigns(start_date,end_date);
create index if not exists idx_crm_automation_active on public.crm_automation_rules(is_active);

alter table public.crm_trips enable row level security;
alter table public.crm_trip_travellers enable row level security;
alter table public.crm_trip_services enable row level security;
alter table public.crm_trip_vouchers enable row level security;
alter table public.crm_supplier_ledger enable row level security;
alter table public.crm_customer_ledger enable row level security;
alter table public.crm_lead_scores enable row level security;
alter table public.crm_quotation_lines enable row level security;
alter table public.crm_customer_documents enable row level security;
alter table public.crm_campaigns enable row level security;
alter table public.crm_sales_targets enable row level security;
alter table public.crm_incentive_rules enable row level security;
alter table public.crm_incentive_payouts enable row level security;
alter table public.crm_automation_rules enable row level security;
alter table public.crm_customer_portal_tokens enable row level security;
alter table public.crm_feedback enable row level security;

create or replace view public.crm_trip_profitability as
select t.id,t.trip_code,t.destination,t.start_date,t.end_date,t.selling_amount,t.cost_amount,t.collected_amount,
greatest(t.selling_amount-t.collected_amount,0) as outstanding_amount,t.selling_amount-t.cost_amount as gross_profit,
case when t.selling_amount>0 then round(((t.selling_amount-t.cost_amount)/t.selling_amount)*100,2) else 0 end as gross_margin_percent
from public.crm_trips t;
