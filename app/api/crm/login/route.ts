import {NextResponse} from "next/server";

export async function POST(req:Request){
  try{
    const {email,password}=await req.json();
    const {url,key}=getConfig();
    if(!email||!password)return NextResponse.json({error:"Email and password are required."},{status:400});
    const auth=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
    const data=await auth.json();
    if(!auth.ok)return NextResponse.json({error:data.error_description||data.msg||"Invalid login details."},{status:401});
    const profile=await fetch(`${url}/rest/v1/crm_users?user_id=eq.${encodeURIComponent(data.user.id)}&select=email,role,salesperson&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${data.access_token}`},cache:"no-store"});
    const profiles=await profile.json();
    if(!profile.ok||!profiles?.[0])return NextResponse.json({error:"This account is not authorized for the CRM."},{status:403});
    const p=profiles[0];
    const res=NextResponse.json({ok:true,user:{email:p.email,role:p.role,salesperson:p.salesperson}});
    res.cookies.set("oat_crm_access",data.access_token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:Math.max(300,data.expires_in||3600)});
    return res;
  }catch{return NextResponse.json({error:"Unable to sign in."},{status:500});}
}
function getConfig(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)throw new Error("Supabase is not configured yet.");
  return {url,key};
}
