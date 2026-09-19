import {NextResponse} from "next/server";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
async function rest(url:string,key:string,path:string,init?:RequestInit){const headers:Record<string,string>={apikey:key,"Content-Type":"application/json",...(init?.headers as Record<string,string>||{})};return fetch(url+"/rest/v1/"+path,{...init,headers,cache:"no-store"})}
export async function POST(req:Request){
 const s=await getCrmSession();if(s?.profile.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});
 const {url}=crmSupabaseConfig();const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!key)return NextResponse.json({error:"Server key not configured"},{status:503});
 const b=await req.json().catch(()=>({}));const leadId=b.lead_id?String(b.lead_id):"";
 const rulesR=await rest(url,key,"crm_lead_distribution_rules?is_active=eq.true&order=priority.asc");const rules=await rulesR.json().catch(()=>[]);
 const teamR=await rest(url,key,"crm_sales_team?is_active=eq.true&role=eq.salesperson&select=auth_user_id,name,email&order=name.asc");const rawTeam=await teamR.json().catch(()=>[]);
 const crmR=await rest(url,key,"crm_users?role=eq.salesperson&select=user_id,email,salesperson");const crmUsers=await crmR.json().catch(()=>[]);
 const team=(Array.isArray(rawTeam)?rawTeam:[]).map((p:any)=>{const m=Array.isArray(crmUsers)?crmUsers.find((u:any)=>String(u.user_id)===String(p.auth_user_id)||String(u.email||"").toLowerCase()===String(p.email||"").toLowerCase()):null;return {...p,user_id:p.auth_user_id||m?.user_id||null,name:p.name||m?.salesperson||p.email||""}}).filter((p:any)=>p.user_id);
 if(!team.length)return NextResponse.json({error:"No active salespeople found"},{status:400});
 const q=leadId?"enquiries?id="+encodeURIComponent(leadId)+"&limit=1":"enquiries?or=(assigned_to.is.null,assigned_to.eq.)&status=neq.Deleted&order=created_at.asc&limit=500";
 const lr=await rest(url,key,q);const leads=await lr.json().catch(()=>[]);
 let assigned=0;
 for(const l of Array.isArray(leads)?leads:[]){
  const rule=Array.isArray(rules)?rules.find((r:any)=>(!r.source||String(r.source)===String(l.source||""))&&(!r.branch||String(r.branch)===String(l.branch||""))&&(!r.destination||String(l.dest||l.destination||"").toLowerCase().includes(String(r.destination).toLowerCase()))&&(!r.lead_priority||String(r.lead_priority)===String(l.priority||""))):null;
  let person:any=null;
  if(rule?.assignee_user_id)person=team.find((x:any)=>String(x.user_id)===String(rule.assignee_user_id));
  if(!person)person=team[assigned%team.length];
  if(!person)continue;
  const u=await rest(url,key,"enquiries?id=eq."+encodeURIComponent(String(l.id)),{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({assigned_to:person.user_id,salesperson:person.name,owner_user_id:person.user_id})});
  if(u.ok)assigned++;
 }
 return NextResponse.json({ok:true,assigned});
}