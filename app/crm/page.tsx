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
  const token=(await import("next/headers")).cookies;
  const access=(await token()).get("oat_crm_access")?.value||"";
  const query=session.profile.role==="admin"?"":"&salesperson=eq."+encodeURIComponent(session.profile.salesperson||"");
  const fields="id,name,phone,email,dest,destination,status,salesperson,source,branch,priority,value,notes,follow,follow_up,date,travel_date,trav,travellers,created_at";
  const response=await fetch(`${url}/rest/v1/enquiries?select=${fields}&order=created_at.desc${query?query:""}&limit=50`,{headers:{apikey:key,Authorization:`Bearer ${access}`},cache:"no-store"});
  const leads=response.ok?await response.json():[];
  return <CrmWorkspaceV2 session={session} initialLeads={Array.isArray(leads)?leads:[]}/>;
}
