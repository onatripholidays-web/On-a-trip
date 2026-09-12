import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function count(url:string,key:string,token:string,filter:string){
 const r=await fetch(`${url}/rest/v1/enquiries?select=id&${filter}`,{headers:{apikey:key,Authorization:`Bearer ${token}`,Prefer:"count=exact"},cache:"no-store"});
 const range=r.headers.get("content-range")||""; const m=range.match(/\/(\d+|\*)$/); return m&&m[1]!=="*"?Number(m[1]):0;
}
export async function GET(){
 const session=await getCrmSession(); if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {url,key}=crmSupabaseConfig(); const token=(await cookies()).get("oat_crm_access")?.value||"";
 const owner=session.profile.role==="admin"?"":`&salesperson=eq.${encodeURIComponent(session.profile.salesperson||"")}`;
 const base=`status=neq.Deleted${owner}`;
 const [total,booked,hot,followups,quotes,bookings,payments,invoices]=await Promise.all([
  count(url,key,token,base),count(url,key,token,`status=eq.Booked${owner}`),count(url,key,token,`status=eq.Hot${owner}`),count(url,key,token,`follow_up=not.is.null${owner}`),
  count(url,key,token,"id=not.is.null"),count(url,key,token,"id=not.is.null"),count(url,key,token,"id=not.is.null"),count(url,key,token,"id=not.is.null")
 ]);
 return NextResponse.json({total,booked,hot,followups,commercial:{quotes,bookings,payments,invoices},conversion:total?Math.round(booked/total*100):0});
}
