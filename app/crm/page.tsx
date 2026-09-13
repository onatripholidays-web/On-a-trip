import {redirect} from "next/navigation";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import CrmWorkspaceV2 from "@/components/CrmWorkspaceV2";
import "./crm.css";
import "./v2.css";

export const dynamic="force-dynamic";

export default async function CrmPage(){
 const session=await getCrmSession();
 if(!session)redirect("/crm/login");
 const {url,key}=crmSupabaseConfig();
 const {cookies}=await import("next/headers");
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const query=session.profile.role==="admin"?"":"&salesperson=eq."+encodeURIComponent(session.profile.salesperson||"");
 const fields="id,name,phone,email,dest,destination,status,salesperson,source,branch,priority,value,notes,travel_date,travellers,follow_up,created_at";
 const response=await fetch(`${url}/rest/v1/enquiries?select=${fields}&order=created_at.desc${query}&limit=200`,{headers:{apikey:key,Authorization:`Bearer ${access}`},cache:"no-store"});
 const leads=response.ok?await response.json():[];
 return <CrmWorkspaceV2 session={session} initialLeads={Array.isArray(leads)?leads:[]}/>;
}
