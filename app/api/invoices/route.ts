import {NextResponse} from "next/server";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

export const dynamic="force-dynamic";

export async function POST(req:Request){
  const session=await getCrmSession();
  if(!session)return NextResponse.json({error:"CRM authentication required."},{status:401});
  const {url,key}=crmSupabaseConfig();
  const token=(await import("next/headers")).cookies;
  const access=(await token()).get("oat_crm_access")?.value||"";
  const d=await req.json();
  if(!d.name||!d.dest||!d.contact||!d.salesperson)return NextResponse.json({error:"Customer name, destination, contact and salesperson are required."},{status:400});
  const total=Number(d.total||0),paid=Number(d.paid||0),balance=Math.max(0,total-paid);
  const invoiceNo=d.invoiceNo||`INV${Date.now().toString().slice(-8)}`;
  const row={invoice_no:invoiceNo,created_by:session.user.id,booking_id:d.bookingId||null,name:String(d.name),destination:String(d.dest),contact:String(d.contact),email:d.email||null,salesperson:String(d.salesperson),booking_date_time:d.bookingDateTime||null,trip_start:d.start||null,trip_end:d.end||null,booking_type:d.type||null,pax:Number(d.pax)||1,tariff:d.tariff||null,inclusions:d.inclusions||null,total,paid,balance,payment_mode:d.mode||null,utr:d.utr||null,status:balance<=0?"PAID IN FULL":(d.status||"PENDING"),payment_date_time:d.paymentDateTime||null,notes:d.notes||null};
  const r=await fetch(`${url}/rest/v1/business_invoices`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${access}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(row),cache:"no-store"});
  const body=await r.text();
  if(!r.ok)return NextResponse.json({error:"Could not save invoice.",detail:body},{status:r.status});
  return NextResponse.json({ok:true,invoice:JSON.parse(body)[0]||row});
}
