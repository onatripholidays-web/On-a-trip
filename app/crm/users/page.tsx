import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import "../crm.css";
import "../v2.css";

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
   <section style={{background:"#fff",borderRadius:18,overflow:"hidden",border:"1px solid #e5eaee"}}>
    <div style={{padding:"18px 20px",borderBottom:"1px solid #e5eaee",fontWeight:800}}>CRM User Directory</div>
    <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:720}}><thead><tr><th style={{textAlign:"left",padding:14,fontSize:11}}>USER</th><th style={{textAlign:"left",padding:14,fontSize:11}}>ROLE</th><th style={{textAlign:"left",padding:14,fontSize:11}}>SALESPERSON</th><th style={{textAlign:"left",padding:14,fontSize:11}}>CRM ACCESS</th></tr></thead><tbody>{users.map(u=><tr key={u.user_id} style={{borderTop:"1px solid #edf0f2"}}><td style={{padding:14}}><b>{u.email}</b><div style={{fontSize:10,opacity:.5,marginTop:3}}>{u.user_id}</div></td><td style={{padding:14}}><span style={{padding:"5px 9px",borderRadius:999,background:u.role==="admin"?"#111":"#eef4ff",color:u.role==="admin"?"#fff":"#2457a6",fontSize:10,fontWeight:800}}>{u.role}</span></td><td style={{padding:14}}>{u.salesperson||"—"}</td><td style={{padding:14,fontWeight:700}}>✓ Linked</td></tr>)}</tbody></table></div>
   </section>
  </div>
 </main>;
}
