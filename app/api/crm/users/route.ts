import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

async function rest(url:string,key:string,token:string,path:string,init?:RequestInit){
 return fetch(`${url}/rest/v1/${path}`,{...init,headers:{apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json",...(init?.headers||{})},cache:"no-store"});
}
export async function GET(){
 const session=await getCrmSession();if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});
 const {url,key}=crmSupabaseConfig();const token=(await cookies()).get("oat_crm_access")?.value||"";const service=process.env.SUPABASE_SERVICE_ROLE_KEY||token;
 const r=await rest(url,key,service,"crm_sales_team?select=id,name,email,role,is_active,auth_user_id&order=name.asc");const data=await r.json().catch(()=>[]);
 if(!r.ok)return NextResponse.json({error:"Could not load sales team"},{status:r.status});return NextResponse.json({users:Array.isArray(data)?data:[]});
}
export async function POST(req:Request){
 const session=await getCrmSession();if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Only CRM admins can create users."},{status:403});
 const {url,key}=crmSupabaseConfig();const service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:"Server user-management key is not configured."},{status:503});
 const body=await req.json().catch(()=>({}));const name=String(body.name||"").trim();const email=String(body.email||"").trim().toLowerCase();const password=String(body.password||"");
 if(name.length<2||!email||password.length<6)return NextResponse.json({error:"Name, valid email and a password of at least 6 characters are required."},{status:400});
 const auth=await fetch(`${url}/auth/v1/admin/users`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${service}`,"Content-Type":"application/json"},body:JSON.stringify({email,password,email_confirm:true,user_metadata:{full_name:name}})});
 const authData=await auth.json().catch(()=>null);if(!auth.ok)return NextResponse.json({error:authData?.msg||authData?.message||"Could not create login account."},{status:auth.status});
 const userId=authData?.id||authData?.user?.id;if(!userId)return NextResponse.json({error:"Login account was created but no user ID was returned."},{status:500});
 const profile=await rest(url,key,service,"profiles",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({id:userId,full_name:name,email,role:"sales",is_active:true})});
 if(!profile.ok){await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:key,Authorization:`Bearer ${service}`}});return NextResponse.json({error:"Could not create the CRM profile."},{status:500});}
 const crm=await rest(url,key,service,"crm_users",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({user_id:userId,email,role:"salesperson",salesperson:name})});
 if(!crm.ok){await rest(url,key,service,`profiles?id=eq.${encodeURIComponent(userId)}`,{method:"DELETE"});await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:key,Authorization:`Bearer ${service}`}});return NextResponse.json({error:"Could not create the CRM user profile."},{status:500});}
 const team=await rest(url,key,service,"crm_sales_team",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({name,email,role:"salesperson",is_active:true,auth_user_id:userId})});
 if(!team.ok){await rest(url,key,service,`crm_users?user_id=eq.${encodeURIComponent(userId)}`,{method:"DELETE"});await rest(url,key,service,`profiles?id=eq.${encodeURIComponent(userId)}`,{method:"DELETE"});await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:key,Authorization:`Bearer ${service}`}});return NextResponse.json({error:"Could not add the user to the sales team."},{status:500});}
 return NextResponse.json({ok:true,user:{id:userId,name,email,role:"salesperson"}},{status:201});
}