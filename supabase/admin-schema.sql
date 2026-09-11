-- On A Trip Holidays Admin CMS
-- Run this in Supabase SQL Editor before using the admin panel.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'super_admin' check (role in ('super_admin','content_manager','sales_manager','operations_manager','finance_manager','developer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Pilgrimage','Domestic','International')),
  duration text not null default '',
  route text not null default '',
  from_location text not null default '',
  price text not null default '',
  description text not null default '',
  image text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  meals text,
  batch text,
  visible boolean not null default true,
  parent_slug text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  itinerary_pdf_url text,
  itinerary jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists packages_category_idx on public.packages(category);
create index if not exists packages_status_idx on public.packages(status);
create index if not exists packages_parent_slug_idx on public.packages(parent_slug);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_logs_created_at_idx on public.admin_audit_logs(created_at desc);

alter table public.admin_profiles enable row level security;
alter table public.packages enable row level security;
alter table public.admin_audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_profiles where id = auth.uid() and active = true); $$;

create or replace function public.has_admin_role(required_role text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_profiles where id = auth.uid() and active = true and (role = 'super_admin' or role = required_role)); $$;

create policy "admins can read own profile" on public.admin_profiles for select using (id = auth.uid() or is_admin());
create policy "super admins manage profiles" on public.admin_profiles for all using (has_admin_role('super_admin')) with check (has_admin_role('super_admin'));

create policy "admins can read packages" on public.packages for select using (is_admin());
create policy "content roles can insert packages" on public.packages for insert with check (has_admin_role('content_manager'));
create policy "content roles can update packages" on public.packages for update using (has_admin_role('content_manager')) with check (has_admin_role('content_manager'));
create policy "super admins can delete packages" on public.packages for delete using (has_admin_role('super_admin'));

create policy "admins can read audit logs" on public.admin_audit_logs for select using (is_admin());
create policy "admins can create audit logs" on public.admin_audit_logs for insert with check (is_admin());

insert into public.admin_profiles (id, full_name, role)
select id, coalesce(raw_user_meta_data->>'full_name','Super Admin'), 'super_admin'
from auth.users
where email = 'Travel@onatripholidays.com'
on conflict (id) do update set role='super_admin', active=true, updated_at=now();
