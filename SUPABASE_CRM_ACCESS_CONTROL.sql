-- ON A TRIP HOLIDAYS CRM — Admin / Salesperson access control
-- Run this in Supabase SQL Editor AFTER confirming the salesperson column exists.
-- IMPORTANT: Replace the example email addresses below with your real CRM user emails.

-- 1) Remove the old wide-open authenticated CRM policies created earlier.
drop policy if exists "CRM users can view enquiries" on public.enquiries;
drop policy if exists "CRM users can update enquiries" on public.enquiries;

-- 2) Role-based SELECT policy.
-- Existing Admin accounts with no crm_role metadata are treated as Admin by the CRM UI.
-- For database security, set crm_role='admin' on the Admin Auth user(s).
create policy "CRM role based view enquiries"
on public.enquiries
for select
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'crm_role', 'admin') = 'admin'
  or (
    auth.jwt() -> 'user_metadata' ->> 'crm_role' = 'salesperson'
    and salesperson = coalesce(
      auth.jwt() -> 'user_metadata' ->> 'salesperson',
      auth.jwt() -> 'user_metadata' ->> 'crm_salesperson'
    )
  )
);

-- 3) Admin can update any lead. Salesperson can update only their assigned lead.
create policy "CRM role based update enquiries"
on public.enquiries
for update
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'crm_role', 'admin') = 'admin'
  or (
    auth.jwt() -> 'user_metadata' ->> 'crm_role' = 'salesperson'
    and salesperson = coalesce(
      auth.jwt() -> 'user_metadata' ->> 'salesperson',
      auth.jwt() -> 'user_metadata' ->> 'crm_salesperson'
    )
  )
)
with check (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'crm_role', 'admin') = 'admin'
  or (
    auth.jwt() -> 'user_metadata' ->> 'crm_role' = 'salesperson'
    and salesperson = coalesce(
      auth.jwt() -> 'user_metadata' ->> 'salesperson',
      auth.jwt() -> 'user_metadata' ->> 'crm_salesperson'
    )
  )
);

-- 4) Prevent a salesperson from changing the salesperson assignment.
-- Admins can still reassign leads normally.
create or replace function public.crm_protect_salesperson_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.jwt() -> 'user_metadata' ->> 'crm_role', 'admin') <> 'admin'
     and new.salesperson is distinct from old.salesperson then
    raise exception 'Only Admin can reassign a lead';
  end if;
  return new;
end;
$$;

drop trigger if exists crm_protect_salesperson_assignment on public.enquiries;
create trigger crm_protect_salesperson_assignment
before update on public.enquiries
for each row execute function public.crm_protect_salesperson_assignment();

-- 5) Optional: create/update Auth user metadata for each salesperson.
-- Do NOT run these examples unchanged. Replace the email and salesperson names.
-- The CRM expects:
--   crm_role = salesperson
--   salesperson = one of: Rohini, Harshika, Godavari, Vanditha
--
-- Example:
-- update auth.users
-- set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
--     || jsonb_build_object('crm_role','salesperson','salesperson','Rohini')
-- where email = 'rohini@example.com';
--
-- For Admin:
-- update auth.users
-- set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
--     || jsonb_build_object('crm_role','admin')
-- where email = 'admin@example.com';
