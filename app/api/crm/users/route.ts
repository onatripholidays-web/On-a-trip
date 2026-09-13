import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

export async function GET(){
 const session=await getCrmSession();
 if(!session||session.profile.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});
 const {url,key}=crmSupabaseConfig();
 const token=(await cookies()).get("oat_crm_access")?.value||"";
 const service=process.env.SUPABASE_SERVICE_ROLE_KEY||"";
 const authorization=service||token;
 const r=await fetch(`${url}/rest/v1/crm_sales_team?select=id,name,email,role,is_active,auth_user_id&order=name.asc`,{headers:{apikey:key,Authorization:`Bearer ${authorization}`},cache:"no-store"});
 let data:any[]=[];
 try{data=await r.json()}catch{data=[]}
 if(!r.ok)return NextResponse.json({error:"Could not load sales team"},{status:r.status});
 return NextResponse.json({users:Array.isArray(data)?data:[]});
}
