import {NextResponse} from "next/server";
import {getAdminSession,supabaseConfig} from "@/lib/admin-auth";

export async function POST(req:Request){
 const session=await getAdminSession();
 if(!session||session.profile.role!=="super_admin")return NextResponse.json({error:"Super Admin access required"},{status:403});
 const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!service)return NextResponse.json({error:"Supabase server credential is not configured."},{status:503});
 let body:any;try{body=await req.json()}catch{return NextResponse.json({error:"Invalid request body"},{status:400});}
 const name=String(body?.name||"").trim(),email=String(body?.email||"").trim().toLowerCase(),password=String(body?.password||"");
 if(!name||!email||!password)return NextResponse.json({error:"Name, email and password are required."},{status:400});
 if(password.length<6)return NextResponse.json({error:"Password must be at least 6 characters."},{status:400});
 const {url,key}=supabaseConfig();
 const auth=await fetch(`${url}/auth/v1/admin/users`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${service}`,"Content-Type":"application/json"},body:JSON.stringify({email,password,email_confirm:true,user_metadata:{full_name:name}})});
 let authData:any=null;try{authData=await auth.json()}catch{}
 if(!auth.ok)return NextResponse.json({error:String(authData?.msg||authData?.message||authData?.error_description||"Could not create login account.")},{status:auth.status});
 const userId=authData?.id||authData?.user?.id;
 if(!userId)return NextResponse.json({error:"Account was created but no user ID was returned."},{status:502});
 const headers={apikey:key,Authorization:`Bearer ${service}`,"Content-Type":"application/json",Prefer:"return=representation"};
 const profile=await fetch(`${url}/rest/v1/crm_users`,{method:"POST",headers,body:JSON.stringify({user_id:userId,email,role:"salesperson",salesperson:name})});
 if(!profile.ok){
  await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:key,Authorization:`Bearer ${service}`}});
  let d:any=null;try{d=await profile.json()}catch{}
  return NextResponse.json({error:String(d?.message||d?.details||"Could not create CRM profile. Login account was rolled back.")},{status:profile.status});
 }
 const team=await fetch(`${url}/rest/v1/crm_sales_team`,{method:"POST",headers,body:JSON.stringify({name,email,role:"salesperson",is_active:true,auth_user_id:userId})});
 if(!team.ok){
  await fetch(`${url}/rest/v1/crm_users?user_id=eq.${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:key,Authorization:`Bearer ${service}`}});
  await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE",headers:{apikey:key,Authorization:`Bearer ${service}`}});
  let d:any=null;try{d=await team.json()}catch{}
  return NextResponse.json({error:String(d?.message||d?.details||"Could not add the sales team record. Account was rolled back.")},{status:team.status});
 }
 return NextResponse.json({ok:true,user:{id:userId,name,email,role:"salesperson"}},{status:201});
}
export async function GET(){
 const session=await getAdminSession();
 if(!session||session.profile.role!=="super_admin")return NextResponse.json({error:"Super Admin access required"},{status:403});
 const service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:"Supabase server credential is not configured."},{status:503});
 const {url,key}=supabaseConfig();
 const r=await fetch(`${url}/rest/v1/crm_sales_team?select=id,name,email,role,is_active,auth_user_id&order=name.asc`,{headers:{apikey:key,Authorization:`Bearer ${service}`},cache:"no-store"});
 let data:any=[];try{data=await r.json()}catch{}
 if(!r.ok)return NextResponse.json({error:"Could not load sales team."},{status:r.status});
 return NextResponse.json({users:Array.isArray(data)?data:[]});
}