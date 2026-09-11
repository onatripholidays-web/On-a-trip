import {redirect} from "next/navigation";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import CrmWorkspace from "@/components/CrmWorkspace";
import "./crm.css";

export const dynamic="force-dynamic";

export default async function CrmPage(){
  const session=await getCrmSession();
  if(!session)redirect("/crm/login");
  const {url,key}=crmSupabaseConfig();
  const token=(await import("next/headers")).cookies;
  const access=(await token()).get("oat_crm_access")?.value||"";
  const query=session.profile.role==="admin"?"":"&salesperson=eq."+encodeURIComponent(session.profile.salesperson||"");
  const response=await fetch(`${url}/rest/v1/enquiries?select=*&order=created_at.desc${query?query:""}&limit=200`,{headers:{apikey:key,Authorization:`Bearer ${access}`},cache:"no-store"});
  const leads=response.ok?await response.json():[];
  return <CrmWorkspace session={session} initialLeads={Array.isArray(leads)?leads:[]}/>;
}
