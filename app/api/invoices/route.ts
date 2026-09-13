import {NextResponse} from "next/server";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

export const dynamic="force-dynamic";

export async function POST(req:Request){
 const session=await getCrmSession();
 if(!session)return NextResponse.json({error:"CRM authentication required."},{status:401});
 const {url,key}=crmSupabaseConfig();
 const {cookies}=await import("next/headers");
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const d=await req.json();
 if(!d.name||!d.dest||!d.contact||!d.salesperson)return NextResponse.json({error:"Customer name, destination, contact and salesperson are required."},{status:400});
 const total=Math.max(0,Number(d.total)||0),paid=Math.max(0,Math.min(Number(d.paid)||0,total)),balance=Math.max(0,total-paid);
 if(total<=0)return NextResponse.json({error:"Invoice total must be greater than zero."},{status:400});
 const headers={apikey:key,Authorization:`Bearer ${access}`};
 let customerId=d.customerId||null;
 if(!customerId){
  const lookup=await fetch(`${url}/rest/v1/crm_customers?phone=eq.${encodeURIComponent(String(d.contact).trim())}&select=id&limit=1`,{headers,cache:"no-store"});
  if(lookup.ok){const rows=await lookup.json().catch(()=>[]);customerId=rows?.[0]?.id||null;}
 }
 if(!customerId){
  const customerRes=await fetch(`${url}/rest/v1/crm_customers`,{method:"POST",headers:{...headers,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({name:String(d.name).trim(),phone:String(d.contact).trim(),email:d.email||null,source:"CRM Invoice",created_by:session.user.id})});
  if(!customerRes.ok)return NextResponse.json({error:"Could not save invoice customer.",detail:await customerRes.text()},{status:customerRes.status});
  const rows=await customerRes.json().catch(()=>[]);customerId=rows?.[0]?.id||null;
 }
 const invoiceNo=d.invoiceNo||`INV-${new Date().toISOString().slice(0,7).replace("-","")}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
 const row={invoice_no:invoiceNo,booking_id:d.bookingId||null,quotation_id:d.quotationId||null,customer_id:customerId,invoice_date:d.invoiceDate||new Date().toISOString().slice(0,10),due_date:d.dueDate||null,subtotal:total,discount:0,tax:0,tcs:0,total,paid_amount:paid,balance_amount:balance,status:balance<=0?"paid":paid>0?"partially_paid":"draft",notes:d.notes||`Customer: ${String(d.name)} | Destination: ${String(d.dest)} | Contact: ${String(d.contact)} | Salesperson: ${String(d.salesperson)} | Payment mode: ${String(d.mode||"")} | UTR: ${String(d.utr||"")}`,created_by:session.user.id};
 const r=await fetch(`${url}/rest/v1/crm_invoices`,{method:"POST",headers:{...headers,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(row),cache:"no-store"});
 const body=await r.text();
 if(!r.ok)return NextResponse.json({error:"Could not save invoice.",detail:body},{status:r.status});
 const invoice=JSON.parse(body)[0]||row;
 if(d.leadId){try{await fetch(`${url}/rest/v1/crm_lead_activities`,{method:"POST",headers:{...headers,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({enquiry_id:Number(d.leadId),created_by:session.user.id,activity_type:"invoice",subject:`Invoice ${invoiceNo} created`,body:`Invoice ${invoiceNo} created for ${String(d.name)} · ₹${total.toLocaleString("en-IN")} · paid ₹${paid.toLocaleString("en-IN")} · balance ₹${balance.toLocaleString("en-IN")}`})})}catch{}}
 return NextResponse.json({ok:true,invoice});
}
