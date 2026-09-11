import {NextResponse} from "next/server";

export async function POST(req:Request){
  try{
    const {email,password}=await req.json();
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(!url||!key) return NextResponse.json({error:"Supabase is not configured yet."},{status:503});
    if(!email||!password) return NextResponse.json({error:"Email and password are required."},{status:400});
    const auth=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
    const data=await auth.json();
    if(!auth.ok) return NextResponse.json({error:data.error_description||data.msg||"Invalid login details."},{status:401});
    const profile=await fetch(`${url}/rest/v1/admin_profiles?id=eq.${encodeURIComponent(data.user.id)}&select=id,full_name,role,active&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${data.access_token}`},cache:"no-store"});
    const profiles=await profile.json();
    if(!profile.ok||!profiles?.[0]?.active) return NextResponse.json({error:"This account is not authorized for the admin panel."},{status:403});
    const res=NextResponse.json({ok:true,user:{full_name:profiles[0].full_name,role:profiles[0].role}});
    res.cookies.set("oat_admin_access",data.access_token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:Math.max(300,data.expires_in||3600)});
    return res;
  }catch{return NextResponse.json({error:"Unable to sign in."},{status:500});}
}
