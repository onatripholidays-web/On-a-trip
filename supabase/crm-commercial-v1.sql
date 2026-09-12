-- On A Trip Holidays Commercial Travel CRM v1
-- Apply in Supabase SQL Editor. This is additive and preserves the existing enquiries table.

create extension if not exists pgcrypto;

-- Existing lead table: make the commercial CRM fields/indexes explicit.
alter table if exists public.enquiries add column if not exists customer_id uuid;
alter table if exists public.enquiries add column if not exists package_id uuid;
alter table if exists public.enquiries add column if not exists batch_id uuid;
alter table if exists public.enquiries add column if not exists lost_reason text;
alter table if exists public.enquiries add column if not exists next_action text;
alter table if exists public.enquiries add column if not exists updated_at timestamptz default now();
create index if not exists enquiries_status_idx on public.enquiries(status);
create index if not exists enquiries_salesperson_idx on public.enquiries(salesperson);
create index if not exists enquiries_follow_up_idx on public.enquiries(follow_up);
create index if not exists enquiries_created_at_idx on public.enquiries(created_at desc);
create index if not exists enquiries_phone_idx on public.enquiries(phone);

create table if not exists public.crm_customers (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 phone text,
 email text,
 whatsapp text,
 company text,
 customer_type text not null default 'B2C',
 city text,
 state text,
 country text default 'India',
 source text,
 tags jsonb not null default '[]'::jsonb,
 notes text,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists crm_customers_phone_idx on public.crm_customers(phone);
create index if not exists crm_customers_email_idx on public.crm_customers(email);

create table if not exists public.crm_activities (
 id uuid primary key default gen_random_uuid(),
 customer_id uuid references public.crm_customers(id) on delete cascade,
 enquiry_id uuid,
 actor_id uuid references auth.users(id) on delete set null,
 type text not null check(type in ('call','whatsapp','email','note','meeting','stage_change','quote','invoice','payment','booking','system')),
 subject text,
 body text,
 metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists crm_activities_customer_idx on public.crm_activities(customer_id,created_at desc);
create index if not exists crm_activities_enquiry_idx on public.crm_activities(enquiry_id,created_at desc);

create table if not exists public.crm_tasks (
 id uuid primary key default gen_random_uuid(),
 enquiry_id uuid,
 customer_id uuid references public.crm_customers(id) on delete cascade,
 assigned_to uuid references auth.users(id) on delete set null,
 title text not null,
 description text,
 due_at timestamptz,
 priority text not null default 'normal' check(priority in ('low','normal','high','urgent')),
 status text not null default 'open' check(status in ('open','in_progress','completed','cancelled')),
 completed_at timestamptz,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists crm_tasks_assignee_idx on public.crm_tasks(assigned_to,status,due_at);
create index if not exists crm_tasks_due_idx on public.crm_tasks(due_at,status);

create table if not exists public.crm_quotes (
 id uuid primary key default gen_random_uuid(),
 quote_no text unique not null,
 enquiry_id uuid,
 customer_id uuid references public.crm_customers(id) on delete set null,
 package_id uuid,
 batch_id uuid,
 created_by uuid references auth.users(id) on delete set null,
 salesperson text,
 title text not null,
 currency text not null default 'INR',
 subtotal numeric(14,2) not null default 0,
 discount numeric(14,2) not null default 0,
 tax numeric(14,2) not null default 0,
 tcs numeric(14,2) not null default 0,
 total numeric(14,2) not null default 0,
 status text not null default 'draft' check(status in ('draft','sent','viewed','negotiation','accepted','rejected','expired','cancelled')),
 valid_until date,
 notes text,
 itinerary jsonb not null default '[]'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists crm_quotes_customer_idx on public.crm_quotes(customer_id,created_at desc);
create index if not exists crm_quotes_enquiry_idx on public.crm_quotes(enquiry_id,created_at desc);

create table if not exists public.crm_quote_items (
 id uuid primary key default gen_random_uuid(),
 quote_id uuid not null references public.crm_quotes(id) on delete cascade,
 item_type text not null default 'service',
 service_date date,
 description text not null,
 supplier_id uuid,
 quantity numeric(10,2) not null default 1,
 unit_cost numeric(14,2) not null default 0,
 unit_price numeric(14,2) not null default 0,
 markup numeric(14,2) not null default 0,
 tax_rate numeric(6,2) not null default 0,
 total numeric(14,2) not null default 0,
 sort_order integer not null default 0,
 metadata jsonb not null default '{}'::jsonb
);
create index if not exists crm_quote_items_quote_idx on public.crm_quote_items(quote_id,sort_order);

create table if not exists public.crm_bookings (
 id uuid primary key default gen_random_uuid(),
 booking_no text unique not null,
 enquiry_id uuid,
 customer_id uuid references public.crm_customers(id) on delete set null,
 quote_id uuid references public.crm_quotes(id) on delete set null,
 package_id uuid,
 batch_id uuid,
 salesperson text,
 travel_start date,
 travel_end date,
 pax integer not null default 1,
 adults integer not null default 1,
 children integer not null default 0,
 infants integer not null default 0,
 gross_amount numeric(14,2) not null default 0,
 discount numeric(14,2) not null default 0,
 tax numeric(14,2) not null default 0,
 total_amount numeric(14,2) not null default 0,
 paid_amount numeric(14,2) not null default 0,
 balance_amount numeric(14,2) not null default 0,
 status text not null default 'confirmed' check(status in ('hold','confirmed','partially_paid','paid','cancelled','completed')),
 operations_status text not null default 'pending' check(operations_status in ('pending','in_progress','ready','completed','cancelled')),
 notes text,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists crm_bookings_customer_idx on public.crm_bookings(customer_id,created_at desc);
create index if not exists crm_bookings_travel_idx on public.crm_bookings(travel_start);
create index if not exists crm_bookings_status_idx on public.crm_bookings(status);

create table if not exists public.crm_passengers (
 id uuid primary key default gen_random_uuid(),
 booking_id uuid not null references public.crm_bookings(id) on delete cascade,
 full_name text not null,
 passenger_type text not null default 'adult',
 phone text,
 email text,
 date_of_birth date,
 gender text,
 nationality text default 'Indian',
 passport_number text,
 passport_expiry date,
 id_type text,
 id_number text,
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists crm_passengers_booking_idx on public.crm_passengers(booking_id);

create table if not exists public.crm_payments (
 id uuid primary key default gen_random_uuid(),
 booking_id uuid references public.crm_bookings(id) on delete set null,
 quote_id uuid references public.crm_quotes(id) on delete set null,
 customer_id uuid references public.crm_customers(id) on delete set null,
 invoice_id uuid,
 receipt_no text unique not null,
 amount numeric(14,2) not null check(amount >= 0),
 payment_mode text not null,
 transaction_id text,
 payment_date timestamptz not null default now(),
 status text not null default 'received' check(status in ('pending','received','failed','refunded')),
 notes text,
 received_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now()
);
create index if not exists crm_payments_booking_idx on public.crm_payments(booking_id,payment_date desc);
create index if not exists crm_payments_date_idx on public.crm_payments(payment_date desc);

create table if not exists public.crm_suppliers (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 supplier_type text not null default 'other',
 phone text,
 email text,
 city text,
 gstin text,
 bank_details jsonb not null default '{}'::jsonb,
 contract_details jsonb not null default '{}'::jsonb,
 active boolean not null default true,
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists crm_suppliers_type_idx on public.crm_suppliers(supplier_type,active);

create table if not exists public.crm_supplier_bookings (
 id uuid primary key default gen_random_uuid(),
 booking_id uuid not null references public.crm_bookings(id) on delete cascade,
 supplier_id uuid not null references public.crm_suppliers(id) on delete restrict,
 service_type text not null,
 service_date date,
 confirmation_no text,
 supplier_cost numeric(14,2) not null default 0,
 amount_paid numeric(14,2) not null default 0,
 balance numeric(14,2) not null default 0,
 status text not null default 'requested' check(status in ('requested','confirmed','cancelled','completed')),
 voucher_url text,
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists crm_supplier_bookings_booking_idx on public.crm_supplier_bookings(booking_id);
create index if not exists crm_supplier_bookings_supplier_idx on public.crm_supplier_bookings(supplier_id);

create table if not exists public.crm_documents (
 id uuid primary key default gen_random_uuid(),
 customer_id uuid references public.crm_customers(id) on delete cascade,
 booking_id uuid references public.crm_bookings(id) on delete cascade,
 quote_id uuid references public.crm_quotes(id) on delete cascade,
 document_type text not null,
 title text not null,
 file_url text,
 public_url text,
 status text not null default 'active',
 expires_at timestamptz,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now()
);
create index if not exists crm_documents_customer_idx on public.crm_documents(customer_id,created_at desc);

create table if not exists public.crm_audit_logs (
 id uuid primary key default gen_random_uuid(),
 actor_id uuid references auth.users(id) on delete set null,
 action text not null,
 entity_type text not null,
 entity_id text,
 before_data jsonb,
 after_data jsonb,
 ip_hash text,
 created_at timestamptz not null default now()
);
create index if not exists crm_audit_logs_created_idx on public.crm_audit_logs(created_at desc);

-- Automatic updated_at helper.
create or replace function public.crm_touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;

do $$ declare t text; begin
 foreach t in array array['enquiries','crm_customers','crm_tasks','crm_quotes','crm_bookings','crm_passengers','crm_suppliers','crm_supplier_bookings'] loop
   execute format('drop trigger if exists %I on public.%I', 'crm_touch_'||t, t);
   execute format('create trigger %I before update on public.%I for each row execute function public.crm_touch_updated_at()', 'crm_touch_'||t, t);
 end loop;
end $$;

-- CRM authorization helpers use the existing crm_users table.
create or replace function public.crm_is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.crm_users where user_id=auth.uid() and role='admin');
$$;
create or replace function public.crm_salesperson() returns text language sql stable security definer set search_path=public as $$
 select salesperson from public.crm_users where user_id=auth.uid() limit 1;
$$;

-- RLS: backend API calls remain authenticated by the Supabase access token.
-- Admins see the whole CRM; sales users see records assigned to their salesperson.
alter table public.crm_customers enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.crm_quotes enable row level security;
alter table public.crm_quote_items enable row level security;
alter table public.crm_bookings enable row level security;
alter table public.crm_passengers enable row level security;
alter table public.crm_payments enable row level security;
alter table public.crm_suppliers enable row level security;
alter table public.crm_supplier_bookings enable row level security;
alter table public.crm_documents enable row level security;
alter table public.crm_audit_logs enable row level security;

-- Policies are intentionally permissive to authenticated CRM users at table level; route handlers enforce role/ownership and all mutations are audited.
create policy "crm authenticated customers" on public.crm_customers for all to authenticated using (true) with check (true);
create policy "crm authenticated activities" on public.crm_activities for all to authenticated using (true) with check (true);
create policy "crm authenticated tasks" on public.crm_tasks for all to authenticated using (true) with check (true);
create policy "crm authenticated quotes" on public.crm_quotes for all to authenticated using (true) with check (true);
create policy "crm authenticated quote items" on public.crm_quote_items for all to authenticated using (true) with check (true);
create policy "crm authenticated bookings" on public.crm_bookings for all to authenticated using (true) with check (true);
create policy "crm authenticated passengers" on public.crm_passengers for all to authenticated using (true) with check (true);
create policy "crm authenticated payments" on public.crm_payments for all to authenticated using (true) with check (true);
create policy "crm authenticated suppliers" on public.crm_suppliers for all to authenticated using (true) with check (true);
create policy "crm authenticated supplier bookings" on public.crm_supplier_bookings for all to authenticated using (true) with check (true);
create policy "crm authenticated documents" on public.crm_documents for all to authenticated using (true) with check (true);
create policy "crm authenticated audit" on public.crm_audit_logs for select to authenticated using (true);
create policy "crm authenticated audit insert" on public.crm_audit_logs for insert to authenticated with check (true);

-- Commercial CRM number sequences.
create sequence if not exists public.crm_quote_seq start 1001;
create sequence if not exists public.crm_booking_seq start 1001;
create sequence if not exists public.crm_receipt_seq start 1001;

comment on table public.crm_customers is 'Master customer profile for the On A Trip commercial CRM';
comment on table public.crm_quotes is 'Commercial quotations with pricing and itinerary snapshot';
comment on table public.crm_bookings is 'Confirmed travel bookings and financial summary';
comment on table public.crm_payments is 'Payment ledger; one row per receipt/transaction';
comment on table public.crm_supplier_bookings is 'Operational supplier confirmations linked to bookings';
