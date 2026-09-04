-- ON A TRIP HOLIDAYS CRM — secure Admin / Salesperson access control
-- Team accounts:
-- Admin: Onatripholidays@gmail.com
-- Rohini: rohinisalesoat@gmail.com
-- Harshika: Oatsalesteam@gmail.com
-- Godavari: godavarisalesoat@gmail.com
-- Sai Kumar: onatripholidayssaikumar@gmail.com
-- Run this entire script in Supabase SQL Editor.

-- 1) Ensure salesperson column exists.
alter table public.enquiries
add column if not exists salesperson text;

create index if not exists enquiries_salesperson_idx
on public.enquiries(salesperson);

-- 2) Create a server-controlled CRM user/role table.
create table if not exists public.crm_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('admin','salesperson')),
  salesperson text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_users_salesperson_idx
on public.crm_users(salesperson);

-- 3) Register the existing Auth accounts by email.
insert into public.crm_users (user_id,email,role,salesperson)
select id,email,'admin',null from auth.users
where lower(email)=lower('Onatripholidays@gmail.com')
on conflict (user_id) do update set email=excluded.email, role='admin', salesperson=null, updated_at=now();

insert into public.crm_users (user_id,email,role,salesperson)
select id,email,'salesperson','Rohini' from auth.users
where lower(email)=lower('rohinisalesoat@gmail.com')
on conflict (user_id) do update set email=excluded.email, role='salesperson', salesperson='Rohini', updated_at=now();

insert into public.crm_users (user_id,email,role,salesperson)
select id,email,'salesperson','Harshika' from auth.users
where lower(email)=lower('Oatsalesteam@gmail.com')
on conflict (user_id) do update set email=excluded.email, role='salesperson', salesperson='Harshika', updated_at=now();

insert into public.crm_users (user_id,email,role,salesperson)
select id,email,'salesperson','Godavari' from auth.users
where lower(email)=lower('godavarisalesoat@gmail.com')
on conflict (user_id) do update set email=excluded.email, role='salesperson', salesperson='Godavari', updated_at=now();

insert into public.crm_users (user_id,email,role,salesperson)
select id,email,'salesperson','Sai Kumar' from auth.users
where lower(email)=lower('onatripholidayssaikumar@gmail.com')
on conflict (user_id) do update set email=excluded.email, role='salesperson', salesperson='Sai Kumar', updated_at=now();

-- 4) Remove the old wide-open policies.
drop policy if exists "CRM users can view enquiries" on public.enquiries;
drop policy if exists "CRM users can update enquiries" on public.enquiries;
drop policy if exists "CRM role based view enquiries" on public.enquiries;
drop policy if exists "CRM role based update enquiries" on public.enquiries;

-- 5) Secure SELECT: Admin sees all; salesperson sees assigned leads only.
create policy "CRM secure view enquiries"
on public.enquiries
for select
to authenticated
using (
  exists (
    select 1 from public.crm_users u
    where u.user_id = auth.uid()
      and (
        u.role='admin'
        or (u.role='salesperson' and enquiries.salesperson=u.salesperson)
      )
  )
);

-- 6) Secure UPDATE: Admin can update all; salesperson only own assigned leads.
create policy "CRM secure update enquiries"
on public.enquiries
for update
to authenticated
using (
  exists (
    select 1 from public.crm_users u
    where u.user_id = auth.uid()
      and (
        u.role='admin'
        or (u.role='salesperson' and enquiries.salesperson=u.salesperson)
      )
  )
)
with check (
  exists (
    select 1 from public.crm_users u
    where u.user_id = auth.uid()
      and (
        u.role='admin'
        or (u.role='salesperson' and enquiries.salesperson=u.salesperson)
      )
  )
);

-- 7) Secure INSERT: allow authenticated CRM users to create leads.
-- The CRM UI only exposes assignment to Admin; salesperson accounts get their own name.
drop policy if exists "CRM users can insert enquiries" on public.enquiries;
drop policy if exists "CRM secure insert enquiries" on public.enquiries;
create policy "CRM secure insert enquiries"
on public.enquiries
for insert
to authenticated
with check (
  exists (
    select 1 from public.crm_users u
    where u.user_id = auth.uid()
      and (
        u.role='admin'
        or (u.role='salesperson' and enquiries.salesperson=u.salesperson)
      )
  )
);

-- 8) Prevent salesperson reassignment. Admin can reassign normally.
create or replace function public.crm_protect_salesperson_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.crm_users u where u.user_id=auth.uid() and u.role='admin') then
    return new;
  end if;

  if exists (select 1 from public.crm_users u where u.user_id=auth.uid() and u.role='salesperson')
     and new.salesperson is distinct from old.salesperson then
    raise exception 'Only Admin can reassign a lead';
  end if;

  if not exists (select 1 from public.crm_users u where u.user_id=auth.uid()) then
    raise exception 'CRM user is not authorized';
  end if;

  return new;
end;
$$;

drop trigger if exists crm_protect_salesperson_assignment on public.enquiries;
create trigger crm_protect_salesperson_assignment
before update on public.enquiries
for each row execute function public.crm_protect_salesperson_assignment();

-- 9) Protect CRM user-role table from client changes.
alter table public.crm_users enable row level security;
drop policy if exists "CRM users can read own role" on public.crm_users;
create policy "CRM users can read own role"
on public.crm_users
for select
to authenticated
using (user_id=auth.uid());

-- 10) Verify the accounts that were found in Auth.
select email, role, salesperson
from public.crm_users
order by role desc, salesperson nulls first;
