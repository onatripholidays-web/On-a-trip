import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCrmSession, crmSupabaseConfig } from "@/lib/crm-auth";

export const dynamic = "force-dynamic";

async function db(url: string, key: string, access: string, path: string, init: RequestInit = {}) {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(init.headers || {}).entries()),
    },
    cache: "no-store",
  });
  const text = await r.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) throw Object.assign(new Error(data?.message || data?.error || "Database request failed"), { status: r.status, data });
  return data;
}

export async function POST(req: Request) {
  const session = await getCrmSession();
  if (!session) return NextResponse.json({ error: "CRM authentication required." }, { status: 401 });

  try {
    const { url, key } = crmSupabaseConfig();
    const access = (await cookies()).get("oat_crm_access")?.value || "";
    const d = await req.json();
    const total = Math.max(0, Number(d.total || 0));
    const paid = Math.max(0, Number(d.paid || 0));
    if (!d.name || !d.dest || !d.contact || !d.salesperson) {
      return NextResponse.json({ error: "Customer name, destination, contact and salesperson are required." }, { status: 400 });
    }
    if (total <= 0) return NextResponse.json({ error: "Invoice total must be greater than zero." }, { status: 400 });
    if (paid > total) return NextResponse.json({ error: "Amount paid cannot exceed the invoice total." }, { status: 400 });

    let booking: any = null;
    if (d.bookingId) {
      const rows = await db(url, key, access, `crm_bookings?id=eq.${encodeURIComponent(String(d.bookingId))}&select=*`);
      booking = Array.isArray(rows) ? rows[0] : null;
    }

    const customerId = d.customerId || booking?.customer_id || null;
    const invoiceNo = d.invoiceNo || `INV-${new Date().toISOString().slice(0, 7).replace("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const balance = total - paid;
    const status = balance <= 0 ? "paid" : paid > 0 ? "partially_paid" : "sent";

    const invoiceRows = await db(url, key, access, "crm_invoices", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        invoice_no: invoiceNo,
        booking_id: booking?.id || null,
        quotation_id: d.quotationId || booking?.quotation_id || null,
        customer_id: customerId,
        invoice_date: d.invoiceDate || new Date().toISOString().slice(0, 10),
        due_date: d.dueDate || null,
        subtotal: Number(d.subtotal ?? total),
        discount: Number(d.discount || 0),
        tax: Number(d.tax || 0),
        tcs: Number(d.tcs || 0),
        total,
        paid_amount: paid,
        balance_amount: balance,
        status,
        notes: d.notes || null,
        created_by: session.user.id,
      }),
    });
    const invoice = Array.isArray(invoiceRows) ? invoiceRows[0] : invoiceRows;

    if (invoice?.id) {
      await db(url, key, access, "crm_invoice_items", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          invoice_id: invoice.id,
          description: `${String(d.dest)} — ${d.type || "Travel booking"}`,
          quantity: Math.max(1, Number(d.pax) || 1),
          rate: total / Math.max(1, Number(d.pax) || 1),
          tax_rate: Number(d.taxRate || 0),
          amount: total,
          sort_order: 0,
        }),
      });
    }

    if (booking?.id && paid > 0) {
      const currentPaid = Math.max(0, Number(booking.paid_amount || 0));
      const remaining = Math.max(0, Number(booking.total_amount || 0) - currentPaid);
      if (paid <= remaining) {
        await db(url, key, access, "crm_payments", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            receipt_no: `RC-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
            booking_id: booking.id,
            quotation_id: booking.quotation_id || null,
            customer_id: booking.customer_id || null,
            payment_date: d.paymentDate || new Date().toISOString().slice(0, 10),
            amount: paid,
            method: String(d.mode || "other").toLowerCase().replace(/\s+/g, "_"),
            reference: d.utr || null,
            status: "received",
            notes: d.notes || "Payment recorded with invoice",
            created_by: session.user.id,
          }),
        });
        await db(url, key, access, `crm_bookings?id=eq.${encodeURIComponent(String(booking.id))}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ paid_amount: currentPaid + paid, balance_amount: Math.max(0, Number(booking.total_amount || 0) - currentPaid - paid) }),
        });
      }
    }

    return NextResponse.json({ ok: true, invoice });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not save invoice.", detail: e?.data || null }, { status: e?.status || 500 });
  }
}
