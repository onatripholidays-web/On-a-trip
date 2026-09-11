import {NextResponse} from "next/server";

export async function POST(req:Request){
  try{
    const body=await req.json().catch(()=>null);
    const email=String(body?.email||"").trim().toLowerCase();
    const password=String(body?.password||"");
    const {url,key}=getConfig();
    if(!email||!password)return NextResponse.json({error:"Email and password are required."},{status:400});

    const auth=await fetch(`${url}/auth/v1/token?grant_type=password`,{
      method:"POST",
      headers:{apikey:key,"Content-Type":"application/json"},
      body:JSON.stringify({email,password}),
      cache:"no-store"
    });
    const data=await auth.json().catch(()=>null);
    if(!auth.ok){
      const message=String(data?.error_description||data?.msg||data?.message||"Invalid login details.");
      return NextResponse.json({error:message},{status:401});
    }
    if(!data?.access_token||!data?.user?.id){
      return NextResponse.json({error:"Supabase login succeeded but no session was returned."},{status:502});
    }

    const profile=await fetch(`${url}/rest/v1/crm_users?user_id=eq.${encodeURIComponent(data.user.id)}&select=email,role,salesperson&limit=1`,{
      headers:{apikey:key,Authorization:`Bearer ${data.access_token}`},
      cache:"no-store"
    });
    const profiles=await profile.json().catch(()=>null);
    if(!profile.ok){
      const message=String(profiles?.message||profiles?.error_description||profiles?.hint||"CRM user authorization check failed.");
      return NextResponse.json({error:message},{status:502});
    }
    if(!Array.isArray(profiles)||!profiles[0]){
      return NextResponse.json({error:"This account is not authorized for the CRM."},{status:403});
    }

    const p=profiles[0];
    const res=NextResponse.json({ok:true,user:{email:p.email||email,role:p.role,salesperson:p.salesperson}});
    res.cookies.set("oat_crm_access",data.access_token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:Math.max(300,Number(data.expires_in)||3600)});
    return res;
  }catch(err){
    console.error("CRM login error",err);
    return NextResponse.json({error:err instanceof Error?err.message:"Unable to sign in."},{status:500});
  }
}

function getConfig(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)throw new Error("Supabase environment variables are not configured in Vercel.");
  return {url,key};
}
