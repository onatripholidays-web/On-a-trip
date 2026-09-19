-- CRM Travel OS access policies and saved-view isolation.
-- All operational Travel OS records are restricted to authenticated CRM users.

drop policy if exists crm_travel_os_access on public.crm_trips;
create policy crm_travel_os_access on public.crm_trips for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_trip_travellers;
create policy crm_travel_os_access on public.crm_trip_travellers for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_trip_services;
create policy crm_travel_os_access on public.crm_trip_services for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_trip_vouchers;
create policy crm_travel_os_access on public.crm_trip_vouchers for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_supplier_ledger;
create policy crm_travel_os_access on public.crm_supplier_ledger for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_customer_ledger;
create policy crm_customer_ledger_access on public.crm_customer_ledger for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_lead_scores;
create policy crm_lead_scores_access on public.crm_lead_scores for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_quotation_lines;
create policy crm_quotation_lines_access on public.crm_quotation_lines for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_customer_documents;
create policy crm_customer_documents_access on public.crm_customer_documents for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_campaigns;
create policy crm_campaigns_access on public.crm_campaigns for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_sales_targets;
create policy crm_sales_targets_access on public.crm_sales_targets for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_incentive_rules;
create policy crm_incentive_rules_access on public.crm_incentive_rules for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_incentive_payouts;
create policy crm_incentive_payouts_access on public.crm_incentive_payouts for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_automation_rules;
create policy crm_automation_rules_access on public.crm_automation_rules for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_customer_portal_tokens;
create policy crm_customer_portal_tokens_access on public.crm_customer_portal_tokens for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());
drop policy if exists crm_travel_os_access on public.crm_feedback;
create policy crm_feedback_access on public.crm_feedback for all to authenticated using (private.crm_is_user()) with check (private.crm_is_user());

grant select,insert,update,delete on public.crm_trips,public.crm_trip_travellers,public.crm_trip_services,public.crm_trip_vouchers,
public.crm_supplier_ledger,public.crm_customer_ledger,public.crm_lead_scores,public.crm_quotation_lines,public.crm_customer_documents,
public.crm_campaigns,public.crm_sales_targets,public.crm_incentive_rules,public.crm_incentive_payouts,public.crm_automation_rules,
public.crm_customer_portal_tokens,public.crm_feedback to authenticated;

drop policy if exists crm_saved_views_owner on public.crm_lead_saved_views;
drop policy if exists crm_saved_views_shared on public.crm_lead_saved_views;
create policy crm_saved_views_owner on public.crm_lead_saved_views for all to authenticated
using (user_id=auth.uid() or private.crm_is_admin())
with check (user_id=auth.uid() or private.crm_is_admin());
create policy crm_saved_views_shared on public.crm_lead_saved_views for select to authenticated using (is_shared=true);
grant select,insert,update,delete on public.crm_lead_saved_views to authenticated;
