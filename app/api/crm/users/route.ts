import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

async function rest(url:string,apiKey:string,path:string,init?:RequestInit,token?:string){
 const headers:Record<string,string>={apikey:apiKey,"Content-Type":"application/json",...(init?.headers as Record<string,string>||{})};
 if(token && token.split(".").length===3) headers.Authorization=`Bearer ${token}`;
 return fetch(`${url}/rest/v1/${path}`,{...init,headers,cache:"no-store"});
}
export async function GET(){
 const session=await getCrmSession();if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});
 const {url,key}=crmSupabaseConfig();const token=(await cookies()).get("oat_crm_access")?.value||"";const service=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 const r=service
   ? await rest(url,service,"crm_sales_team?select=id,name,email,role,is_active,auth_user_id&order=name.asc")
   : await rest(url,key,"crm_sales_team?select=id,name,email,role,is_active,auth_user_id&order=name.asc",undefined,token);const data=await r.json().catch(()=>[]);
 if(!r.ok)return NextResponse.json({error:"Could not load sales team"},{status:r.status});return NextResponse.json({users:Array.isArray(data)?data:[]});
}
export async function POST(req:Request){
 const session=await getCrmSession();if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Only CRM admins can create users."},{status:403});
 const {url}=crmSupabaseConfig();const service=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:"Server user-management key is not configured."},{status:503});
 const body=await req.json().catch(()=>({}));const name=String(body.name||"").trim();const email=String(body.email||"").trim().toLowerCase();const password=String(body.password||"");
 if(name.length<2||!email||password.length<6)return NextResponse.json({error:"Name, valid email and a password of at least 6 characters are required."},{status:400});
 const authHeaders:Record<string,string>={apikey:service,"Content-Type":"application/json"};
 const auth=await fetch(`${url}/auth/v1/admin/users`,{method:"POST",headers:authHeaders,body:JSON.stringify({email,password,email_confirm:true,user_metadata:{full_name:name}})});
 const authData=await auth.json().catch(()=>null);if(!auth.ok)return NextResponse.json({error:authData?.msg||authData?.message||"Could not create login account."},{status:auth.status});
 const userId=authData?.id||authData?.user?.id;if(!userId)return NextResponse.json({error:"Login account was created but no user ID was returned."},{status:500});
 const profile=await rest(url,service,"profiles",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({id:userId,full_name:name,email,role:"sales",is_active:true})});
 if(!profile.ok){
   const details=await profile.text().catch(()=>"");
   console.error("CRM user profile insert failed",profile.status,details);
   await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:service}});
   return NextResponse.json({error:"Could not create the CRM profile."},{status:500});
 }
 const crm=await rest(url,service,"crm_users",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({user_id:userId,email,role:"salesperson",salesperson:name})});
 if(!crm.ok){await rest(url,service,`profiles?id=eq.${encodeURIComponent(userId)}`,{method:"DELETE"});await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:service}});return NextResponse.json({error:"Could not create the CRM user profile."},{status:500});}
 const team=await rest(url,service,"crm_sales_team",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({name,email,role:"salesperson",is_active:true,auth_user_id:userId})});
 if(!team.ok){await rest(url,service,`crm_users?user_id=eq.${encodeURIComponent(userId)}`,{method:"DELETE"});await rest(url,service,`profiles?id=eq.${encodeURIComponent(userId)}`,{method:"DELETE"});await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:service}});return NextResponse.json({error:"Could not add the user to the sales team."},{status:500});}
 return NextResponse.json({ok:true,user:{id:userId,name,email,role:"salesperson"}},{status:201});
}

export async function PUT(req:Request){
 const session=await getCrmSession();if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Only CRM admins can edit users."},{status:403});
 const {url}=crmSupabaseConfig();const service=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:"Server user-management key is not configured."},{status:503});
 const body=await req.json().catch(()=>({}));const id=String(body.id||"").trim();const name=String(body.name||"").trim();const email=String(body.email||"").trim().toLowerCase();const role=String(body.role||"").trim();
 const allowedRoles=["admin","salesperson","accountant","operations","manager","staff"];
 if(!id||name.length<2||!email||!allowedRoles.includes(role))return NextResponse.json({error:"User ID, name, valid email and a valid role are required."},{status:400});
 const auth=await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(id)}`,{method:"PUT",headers:{apikey:service,"Content-Type":"application/json"},body:JSON.stringify({email,user_metadata:{full_name:name}})});
 const authData=await auth.json().catch(()=>null);if(!auth.ok)return NextResponse.json({error:authData?.msg||authData?.message||"Could not update login account."},{status:auth.status});
 const profileRole=role==="admin"?"admin":role==="accountant"?"accounts":role==="operations"?"operations":role==="manager"?"manager":"staff";
 const profile=await rest(url,service,`profiles?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({full_name:name,email,role:profileRole,is_active:true})});
 if(!profile.ok)return NextResponse.json({error:"Could not update the user profile."},{status:500});
 const crm=await rest(url,service,`crm_users?user_id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({email,role,salesperson:role==="salesperson"?name:null})});
 if(!crm.ok)return NextResponse.json({error:"Could not update the CRM user."},{status:500});
 if(role==="salesperson"){
   const existing=await rest(url,service,`crm_sales_team?auth_user_id=eq.${encodeURIComponent(id)}&select=id&limit=1`);
   const rows=await existing.json().catch(()=>[]);
   if(Array.isArray(rows)&&rows[0]?.id){
     await rest(url,service,`crm_sales_team?id=eq.${encodeURIComponent(rows[0].id)}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({name,email,role:"salesperson",is_active:true})});
   }else{
     await rest(url,service,"crm_sales_team",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({name,email,role:"salesperson",is_active:true,auth_user_id:id})});
   }
 }else{
   await rest(url,service,`crm_sales_team?auth_user_id=eq.${encodeURIComponent(id)}`,{method:"DELETE"});
 }
 return NextResponse.json({ok:true,user:{id,name,email,role}});
}

export async function PATCH(req:Request){
 const session=await getCrmSession();if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Only CRM admins can reset passwords."},{status:403});
 const {url}=crmSupabaseConfig();const service=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:"Server user-management key is not configured."},{status:503});
 const body=await req.json().catch(()=>({}));const id=String(body.id||"").trim();const password=String(body.password||"");
 if(body.action!=="reset-password"||!id||password.length<6)return NextResponse.json({error:"A user ID and password of at least 6 characters are required."},{status:400});
 const auth=await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(id)}`,{method:"PUT",headers:{apikey:service,"Content-Type":"application/json"},body:JSON.stringify({password})});
 const data=await auth.json().catch(()=>null);if(!auth.ok)return NextResponse.json({error:data?.msg||data?.message||"Could not reset password."},{status:auth.status});
 return NextResponse.json({ok:true});
}

export async function DELETE(req:Request){
 const session=await getCrmSession();if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Only CRM admins can delete users."},{status:403});
 const {url}=crmSupabaseConfig();const service=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:"Server user-management key is not configured."},{status:503});
 const body=await req.json().catch(()=>({}));const id=String(body.id||"").trim();
 if(!id)return NextResponse.json({error:"User ID is required."},{status:400});
 if(id===session.user.id)return NextResponse.json({error:"You cannot delete your own admin account."},{status:400});
 await rest(url,service,`crm_sales_team?auth_user_id=eq.${encodeURIComponent(id)}`,{method:"DELETE"});
 await rest(url,service,`crm_users?user_id=eq.${encodeURIComponent(id)}`,{method:"DELETE"});
 await rest(url,service,`profiles?id=eq.${encodeURIComponent(id)}`,{method:"DELETE"});
 const auth=await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(id)}`,{method:"DELETE",headers:{apikey:service}});
 if(!auth.ok)return NextResponse.json({error:"CRM records were removed, but the login account could not be deleted."},{status:500});
 return NextResponse.json({ok:true});
}

export async function POST_RESET_PASSWORD(req:Request){ return NextResponse.json({error:"Unsupported method"},{status:405}); }
