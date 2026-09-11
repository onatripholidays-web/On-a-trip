import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

export async function GET(){
  const session=await getCrmSession();
  if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});
  const {url,key}=crmSupabaseConfig(); const token=(await cookies()).get("oat_crm_access")?.value||"";
  const r=await fetch(`${url}/rest/v1/crm_users?select=salesperson,email,role&order=salesperson.asc`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});
  const data=await r.json().catch(()=>[]); if(!r.ok)return NextResponse.json({error:"Could not load salespeople"},{status:r.status});
  return NextResponse.json({users:(Array.isArray(data)?data:[]).filter((u:any)=>u.salesperson&&String(u.role||"").toLowerCase()!=="admin")});
}
