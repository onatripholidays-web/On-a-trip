import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

export async function GET(){
  const session=await getCrmSession();
  if(!session)return NextResponse.json({error:"Authentication required"},{status:401});
  const allowed=["admin","manager","accounts"];
  if(!allowed.includes(String(session.profile.role||"")))return NextResponse.json({error:"Access denied"},{status:403});

  const {url,key}=crmSupabaseConfig();
  const token=(await cookies()).get("oat_crm_access")?.value||"";
  const service=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SECRET_KEY||"";
  const authorization=service||token;
  const headers={apikey:key,Authorization:`Bearer ${authorization}`};

  const [bookingsRes,paymentsRes,invoicesRes,supplierRes]=await Promise.all([
    fetch(`${url}/rest/v1/crm_bookings?select=id,booking_no,destination,departure_date,return_date,travellers,total_amount,paid_amount,balance_amount,status,assigned_to,created_at&order=departure_date.asc`,{headers,cache:"no-store"}),
    fetch(`${url}/rest/v1/crm_payments?select=id,receipt_no,booking_id,payment_date,amount,method,status,created_at&order=payment_date.desc`,{headers,cache:"no-store"}),
    fetch(`${url}/rest/v1/crm_invoices?select=id,invoice_no,booking_id,invoice_date,due_date,total,paid_amount,balance_amount,status&order=invoice_date.desc`,{headers,cache:"no-store"}),
    fetch(`${url}/rest/v1/crm_supplier_bookings?select=id,booking_id,cost,paid_amount,balance_amount,status&order=created_at.desc`,{headers,cache:"no-store"})
  ]);

  if(!bookingsRes.ok||!paymentsRes.ok||!invoicesRes.ok||!supplierRes.ok){
    return NextResponse.json({error:"Could not load financial dashboard data"},{status:502});
  }
  const [bookings,payments,invoices,supplierBookings]=await Promise.all([
    bookingsRes.json(),paymentsRes.json(),invoicesRes.json(),supplierRes.json()
  ]);
  return NextResponse.json({
    bookings:Array.isArray(bookings)?bookings:[],
    payments:Array.isArray(payments)?payments:[],
    invoices:Array.isArray(invoices)?invoices:[],
    supplierBookings:Array.isArray(supplierBookings)?supplierBookings:[]
  });
}
