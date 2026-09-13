import {redirect} from "next/navigation";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import CrmTeamManager from "@/components/CrmTeamManager";
import "../crm.css";
import "./team.css";

export const dynamic="force-dynamic";

export default async function CrmTeamPage(){
 const session=await getCrmSession();
 if(!session)redirect("/crm/login");
 if(session.profile.role!=="admin")redirect("/crm");
 const {url,key}=crmSupabaseConfig();
 const {cookies}=await import("next/headers");
 const token=(await cookies()).get("oat_crm_access")?.value||"";
 const service=process.env.SUPABASE_SERVICE_ROLE_KEY||"";
 const headers={apikey:key,Authorization:`Bearer ${service||token}`};
 const [tr,lr]=await Promise.all([
  fetch(`${url}/rest/v1/crm_sales_team?select=id,name,email,role,is_active,auth_user_id&order=name.asc`,{headers,cache:"no-store"}),
  fetch(`${url}/rest/v1/enquiries?select=status,salesperson,value,follow_up,assigned_to&status=not.eq.Deleted&limit=5000`,{headers,cache:"no-store"})
 ]);
 const team=tr.ok?await tr.json():[];
 const leads=lr.ok?await lr.json():[];
 return <CrmTeamManager initialTeam={Array.isArray(team)?team:[]} initialLeads={Array.isArray(leads)?leads:[]}/>;
}
