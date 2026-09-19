import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import "../crm.css";
import "../v2.css";
import CrmUserManager from "@/components/CrmUserManager";


export const dynamic="force-dynamic";

type CrmUser={user_id:string;email:string;role:string;salesperson:string|null;created_at:string;updated_at:string};

export default async function CrmUsersPage(){
 const session=await getCrmSession();
 if(!session)redirect("/crm/login");
 if(session.profile.role!=="admin")redirect("/crm");
 const {url,key}=crmSupabaseConfig();
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const r=await fetch(`${url}/rest/v1/crm_users?select=user_id,email,role,salesperson,created_at,updated_at&order=created_at.asc`,{headers:{apikey:key,Authorization:`Bearer ${access}`},cache:"no-store"});
 const users:CrmUser[]=r.ok?await r.json():[];
 return <main style={{minHeight:"100vh",background:"#f4f7f9",padding:"28px"}}>
  <div style={{maxWidth:1200,margin:"0 auto"}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,marginBottom:24,flexWrap:"wrap"}}>
    <div><div style={{fontSize:11,fontWeight:800,letterSpacing:1.2,opacity:.55}}>ON A TRIP HOLIDAYS CRM</div><h1 style={{margin:"6px 0",fontSize:30}}>Users & Access</h1><p style={{margin:0,opacity:.65}}>All CRM users connected to the admin dashboard and lead workspace.</p></div>
    <a href="/crm" style={{textDecoration:"none",padding:"11px 16px",borderRadius:10,background:"#111",color:"#fff",fontWeight:700}}>← Back to CRM</a>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:12,marginBottom:18}}>
    <div style={{background:"#fff",borderRadius:16,padding:18}}><small>Total users</small><div style={{fontSize:28,fontWeight:800}}>{users.length}</div></div>
    <div style={{background:"#fff",borderRadius:16,padding:18}}><small>Admins</small><div style={{fontSize:28,fontWeight:800}}>{users.filter(u=>u.role==="admin").length}</div></div>
    <div style={{background:"#fff",borderRadius:16,padding:18}}><small>Sales team</small><div style={{fontSize:28,fontWeight:800}}>{users.filter(u=>u.role==="salesperson").length}</div></div>
   </div>
   <CrmUserManager initialUsers={users.map(u=>({id:u.user_id,name:u.salesperson||"",email:u.email,role:u.role,is_active:true,auth_user_id:u.user_id}))}/>
  </div>
 </main>;
}
