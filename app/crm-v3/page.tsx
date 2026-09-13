import {getCrmSession} from "@/lib/crm-auth";
import CrmV3 from "./ui";

export const dynamic="force-dynamic";

export default async function CrmV3Page(){
 const session=await getCrmSession();
 if(!session)return <main style={{padding:40,fontFamily:"system-ui"}}><h1>CRM Login Required</h1><p>Please sign in to continue.</p></main>;
 return <CrmV3 role={session.profile.role} salesperson={session.profile.salesperson||session.profile.email}/>;
}
