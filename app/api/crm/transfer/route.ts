import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

export async function POST(req:Request){
  const session=await getCrmSession();
  if(!session||session.profile.role!=="admin") return NextResponse.json({error:"Admin access required"},{status:403});
  const {id,salesperson}=await req.json();
  if(!id||!salesperson) return NextResponse.json({error:"Lead and salesperson are required"},{status:400});
  const {url,key}=crmSupabaseConfig();
  const token=(await cookies()).get("oat_crm_access")?.value||"";
  const r=await fetch(`${url}/rest/v1/enquiries?id=eq.${encodeURIComponent(String(id))}`,{method:"PATCH",headers:{apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({salesperson})});
  const data=await r.json().catch(()=>null);
  if(!r.ok)return NextResponse.json({error:data?.message||data?.hint||"Could not transfer lead"},{status:r.status});
  return NextResponse.json({ok:true,lead:data?.[0]||null});
}
