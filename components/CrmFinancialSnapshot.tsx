"use client";

import {useEffect,useMemo,useState} from "react";

type Booking={id?:string;booking_no?:string;destination?:string;departure_date?:string;total_amount?:number;paid_amount?:number;balance_amount?:number;status?:string;assigned_to?:string};
type Payment={id?:string;payment_date?:string;amount?:number;method?:string;status?:string};
type Invoice={id?:string;invoice_date?:string;due_date?:string;total?:number;paid_amount?:number;balance_amount?:number;status?:string};
type SupplierBooking={id?:string;cost?:number;paid_amount?:number;balance_amount?:number;status?:string};

function money(v:unknown){const n=Number(v||0);return `₹${Math.round(Number.isFinite(n)?n:0).toLocaleString("en-IN")}`}
function n(v:unknown){const x=Number(v||0);return Number.isFinite(x)?x:0}

export default function CrmFinancialSnapshot(){
 const [data,setData]=useState<{bookings:Booking[];payments:Payment[];invoices:Invoice[];supplierBookings:SupplierBooking[]}|null>(null);
 const [error,setError]=useState("");
 useEffect(()=>{fetch("/api/crm/dashboard-finance",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d?.error||"Unable to load financial data");setData(d)}).catch(e=>setError(e instanceof Error?e.message:"Unable to load financial data"))},[]);
 const stats=useMemo(()=>{
   const b=data?.bookings||[],p=data?.payments||[],i=data?.invoices||[],s=data?.supplierBookings||[];
   const confirmed=b.filter(x=>["booked","confirmed"].includes(String(x.status||"").toLowerCase()));
   const invoiced=i.filter(x=>!["cancelled","void"].includes(String(x.status||"").toLowerCase()));
   const outstandingBookings=confirmed.reduce((a,x)=>a+n(x.balance_amount),0);
   const outstandingInvoices=invoiced.reduce((a,x)=>a+n(x.balance_amount),0);
   const collected=p.filter(x=>String(x.status||"").toLowerCase()!=="cancelled").reduce((a,x)=>a+n(x.amount),0);
   const supplierBalance=s.reduce((a,x)=>a+n(x.balance_amount),0);
   return {bookingCount:confirmed.length,bookingValue:confirmed.reduce((a,x)=>a+n(x.total_amount),0),collected,outstanding:Math.max(outstandingBookings,outstandingInvoices),supplierBalance,invoices:invoiced.length};
 },[data]);
 const recentPayments=[...(data?.payments||[])].slice(0,5);
 return <section className="crm-v2-page crm-finance-snapshot">
   <div className="v2-card org-card">
    <div className="v2-card-head"><div><span>COMMERCIAL CONTROL</span><h2>Bookings & collections</h2><p>Live financial snapshot from CRM bookings, payments and invoices.</p></div></div>
    {error?<div className="v2-empty">{error}</div>:!data?<div className="v2-empty">Loading financial data…</div>:<>
      <div className="org-kpis finance-kpis">
       <div><span>✓ Confirmed Bookings</span><b>{stats.bookingCount}</b><small>{money(stats.bookingValue)} booking value</small></div>
       <div><span>₹ Collections</span><b>{money(stats.collected)}</b><small>Recorded payments</small></div>
       <div><span>◷ Customer Outstanding</span><b>{money(stats.outstanding)}</b><small>Booking/invoice balance</small></div>
       <div><span>▣ Invoices</span><b>{stats.invoices}</b><small>Non-cancelled invoices</small></div>
       <div><span>Supplier Payables</span><b>{money(stats.supplierBalance)}</b><small>Supplier booking balance</small></div>
      </div>
      <div className="org-finance-grid">
       <div><h3>Recent collections</h3><div className="org-list">{recentPayments.map(p=><div key={String(p.id)}><span><b>{money(p.amount)}</b><small>{p.method||"Payment"} · {p.payment_date||"—"}</small></span><em>{p.status||"Recorded"}</em></div>)}{!recentPayments.length&&<div className="v2-empty">No payments recorded yet.</div>}</div></div>
       <div><h3>Cash position</h3><div className="finance-bars"><div><span>Collected</span><i><b style={{width:`${stats.bookingValue?Math.min(100,stats.collected/stats.bookingValue*100):0}%`}}/></i><strong>{stats.bookingValue?Math.round(stats.collected/stats.bookingValue*100):0}%</strong></div><div><span>Outstanding</span><i><b style={{width:`${stats.bookingValue?Math.min(100,stats.outstanding/stats.bookingValue*100):0}%`}}/></i><strong>{money(stats.outstanding)}</strong></div><div><span>Supplier payable</span><i><b style={{width:`${stats.bookingValue?Math.min(100,stats.supplierBalance/stats.bookingValue*100):0}%`}}/></i><strong>{money(stats.supplierBalance)}</strong></div></div></div>
      </div>
    </>}
   </div>
 </section>
}
