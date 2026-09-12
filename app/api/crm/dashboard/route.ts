import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function count(url:string,key:string,token:string,table:string,filter=""){
 const r=await fetch(`${url}/rest/v1/${table}?select=id${filter?`&${filter}`:""}`,{headers:{apikey:key,Authorization:`Bearer ${token}`,Prefer:"count=exact"},cache:"no-store"});
 const range=r.headers.get("content-range")||""; const m=range.match(/\/(\d+|\*)$/); return m&&m[1]!=="*"?Number(m[1]):0;
}
export async function GET(){
 const session=await getCrmSession(); if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {url,key}=crmSupabaseConfig(); const token=(await cookies()).get("oat_crm_access")?.value||"";
 const owner=session.profile.role==="admin"?"":`salesperson=eq.${encodeURIComponent(session.profile.salesperson||"")}`;
 const [total,booked,hot,followups,quotes,bookings,payments,invoices,customers,tasks]=await Promise.all([
  count(url,key,token,"enquiries",`status=neq.Deleted${owner?`&${owner}`:""}`),
  count(url,key,token,"enquiries",`status=eq.Booked${owner?`&${owner}`:""}`),
  count(url,key,token,"enquiries",`status=eq.Hot${owner?`&${owner}`:""}`),
  count(url,key,token,"enquiries","follow_up=not.is.null"),
  count(url,key,token,"crm_quotations"),count(url,key,token,"crm_bookings"),count(url,key,token,"crm_payments"),count(url,key,token,"crm_invoices"),count(url,key,token,"crm_customers"),count(url,key,token,"crm_tasks","status=eq.open")
 ]);
 return NextResponse.json({total,booked,hot,followups,customers,tasks,commercial:{quotes,bookings,payments,invoices},conversion:total?Math.round(booked/total*100):0});
}
