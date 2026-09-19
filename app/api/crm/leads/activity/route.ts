import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

export async function GET(req:Request){
 const session=await getCrmSession(); if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const id=new URL(req.url).searchParams.get("enquiry_id"); if(!id)return NextResponse.json({error:"enquiry_id required"},{status:400});
 const {url,key}=crmSupabaseConfig(); const access=(await cookies()).get("oat_crm_access")?.value||""; const service=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SECRET_KEY||access;
 const r=await fetch(url+"/rest/v1/crm_lead_activities?select=*&enquiry_id=eq."+encodeURIComponent(id)+"&order=created_at.desc",{headers:{apikey:service||key,...(service?{}:{Authorization:"Bearer "+access})},cache:"no-store"});
 const d=await r.json().catch(()=>[]); return NextResponse.json(Array.isArray(d)?d:[]);
}

export async function POST(req:Request){
 const session=await getCrmSession(); if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json().catch(()=>null); if(!body?.enquiry_id||!body?.activity_type)return NextResponse.json({error:"enquiry_id and activity_type required"},{status:400});
 const {url,key}=crmSupabaseConfig(); const access=(await cookies()).get("oat_crm_access")?.value||""; const service=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SECRET_KEY||access;
 const r=await fetch(url+"/rest/v1/crm_lead_activities",{method:"POST",headers:{apikey:service||key,...(service?{}:{Authorization:"Bearer "+access}),"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({enquiry_id:body.enquiry_id,activity_type:body.activity_type,subject:body.subject||"Lead activity",body:body.body||"",created_by:session.user.id})});
 const d=await r.json().catch(()=>null); if(!r.ok)return NextResponse.json({error:"Could not save activity",details:d},{status:r.status}); return NextResponse.json(Array.isArray(d)?d[0]:d,{status:201});
}
