import { existsSync } from "node:fs";
import { resolve } from "node:path";

const required = [
  "app/crm/page.tsx",
  "components/CrmWorkspaceV2.tsx",
  "components/CrmCompleteLeadManager.tsx",
  "components/CrmOrganizationDashboard.tsx",
  "app/api/crm/leads/route.ts",
  "app/api/crm/leads/assign/route.ts",
  "app/api/crm/leads/activity/route.ts",
  "app/api/crm/leads/views/route.ts",
  "app/api/crm/users/route.ts",
  "app/api/crm/lead-distribution/route.ts",
  "app/api/crm/lead-distribution/apply/route.ts",
  "app/api/crm/commercial/route.ts",
  "app/api/crm/quotations/route.ts",
  "app/crm/itinerary/page.tsx",
  "supabase/migrations/20260920_travel_os_enhancements.sql",
];

const missing = required.filter((p) => !existsSync(resolve(process.cwd(), p)));
if (missing.length) {
  console.error("CRM structural smoke test FAILED");
  for (const p of missing) console.error("Missing:", p);
  process.exit(1);
}

console.log("CRM structural smoke test PASSED");
console.log("Checked", required.length, "required CRM modules/routes.");
