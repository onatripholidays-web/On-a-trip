import {NextResponse} from "next/server";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import {cookies} from "next/headers";

export async function POST(req:Request){
 const session=await getCrmSession();
 if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});
 let body:any;try{body=await req.json()}catch{return NextResponse.json({error:"Invalid request body"},{status:400});}
 const name=String(body.name||"").trim();const email=String(body.email||"").trim().toLowerCase();
 if(!name||!email)return NextResponse.json({error:"Name and email are required"},{status:400});
 const {url,key}=crmSupabaseConfig();const token=(await cookies()).get("oat_crm_access")?.value||"";const service=process.env.SUPABASE_SERVICE_ROLE_KEY||token;
 const r=await fetch(`${url}/rest/v1/crm_sales_team`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${service}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({name,email,role:"salesperson",is_active:true})});
 const data=await r.json().catch(()=>null);if(!r.ok)return NextResponse.json({error:data?.message||data?.details||"Could not add salesperson"},{status:r.status});
 return NextResponse.json({ok:true,user:Array.isArray(data)?data[0]:data},{status:201});
}
