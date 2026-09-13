import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { crmSupabaseConfig, getCrmSession } from "@/lib/crm-auth";

type CrmContext = { session: Awaited<ReturnType<typeof getCrmSession>>; token: string; url: string; key: string };
type HeaderContext = { key: string; token: string };

async function ctx(): Promise<CrmContext | null> {
  const session = await getCrmSession();
  if (!session) return null;
  const token = (await cookies()).get("oat_crm_access")?.value || "";
  const { url, key } = crmSupabaseConfig();
  return { session, token, url, key };
}

function h(c: HeaderContext, extra: Record<string, string> = {}): Record<string, string> {
  return { apikey: c.key, Authorization: `Bearer ${c.token}`, ...extra };
}

async function db(c: CrmContext, path: string, init: RequestInit = {}): Promise<any> {
  const r = await fetch(`${c.url}/rest/v1/${path}`, {
    ...init,
    headers: h(c, { "Content-Type": "application/json", ...Object.fromEntries(new Headers(init.headers || {}).entries()) }),
    cache: "no-store",
  });
  const text = await r.text();
  let d: any = null;
  try { d = JSON.parse(text); } catch {}
  if (!r.ok) throw new Error(d?.message || d?.error || "Database request failed");
  return d;
}

function num(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function today(): string { return new Date().toISOString().slice(0, 10); }

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const c = await ctx();
    if (!c) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const p = new URL(req.url).searchParams;
    const bookingId = p.get("booking_id");
    const invoiceId = p.get("invoice_id");
    const paymentId = p.get("payment_id");

    if (invoiceId) return NextResponse.json(await db(c, `crm_invoices?id=eq.${encodeURIComponent(invoiceId)}&select=*`));
    if (paymentId) return NextResponse.json(await db(c, `crm_payments?id=eq.${encodeURIComponent(paymentId)}&select=*`));

    if (bookingId) {
      const [b, pay, inv] = await Promise.all([
        db(c, `crm_bookings?id=eq.${encodeURIComponent(bookingId)}&select=*`),
        db(c, `crm_payments?booking_id=eq.${encodeURIComponent(bookingId)}&select=*&order=payment_date.desc`),
        db(c, `crm_invoices?booking_id=eq.${encodeURIComponent(bookingId)}&select=*&order=created_at.desc`),
      ]);
      return NextResponse.json({ booking: b?.[0] || null, payments: pay || [], invoices: inv || [] });
    }

    const [pay, inv] = await Promise.all([
      db(c, "crm_payments?select=*&order=created_at.desc&limit=200"),
      db(c, "crm_invoices?select=*&order=created_at.desc&limit=200"),
    ]);
    return NextResponse.json({ payments: pay || [], invoices: inv || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Finance request failed" }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const c = await ctx();
    if (!c) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const type = body?.type;

    if (type === "invoice") {
      const booking = body.booking_id
        ? ((await db(c, `crm_bookings?id=eq.${encodeURIComponent(body.booking_id)}&select=*`)) || [])[0]
        : null;
      const total = num(body.total ?? booking?.total_amount);
      if (total <= 0) return NextResponse.json({ error: "Invoice total must be greater than zero" }, { status: 400 });
      const paid = num(booking?.paid_amount);
      const status = paid >= total ? "paid" : paid > 0 ? "partially_paid" : "sent";
      const payload = {
        invoice_no: body.invoice_no || `INV-${new Date().toISOString().slice(0, 7).replace("-", "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        booking_id: body.booking_id || null,
        quotation_id: body.quotation_id || null,
        customer_id: body.customer_id || booking?.customer_id || null,
        invoice_date: body.invoice_date || today(),
        due_date: body.due_date || null,
        subtotal: num(body.subtotal ?? total),
        discount: num(body.discount),
        tax: num(body.tax),
        tcs: num(body.tcs),
        total,
        paid_amount: Math.min(paid, total),
        balance_amount: Math.max(0, total - paid),
        status,
        notes: body.notes || null,
        created_by: c.session.user.id,
      };
      return NextResponse.json(await db(c, "crm_invoices", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      }));
    }

    if (type === "payment") {
      const bookingId = body.booking_id;
      const amount = num(body.amount);
      if (!bookingId || amount <= 0) return NextResponse.json({ error: "Booking and positive payment amount are required" }, { status: 400 });

      const booking = ((await db(c, `crm_bookings?id=eq.${encodeURIComponent(bookingId)}&select=*`)) || [])[0];
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

      const total = num(booking.total_amount);
      const currentPaid = num(booking.paid_amount);
      const remaining = Math.max(0, total - currentPaid);
      if (amount > remaining) {
        return NextResponse.json({ error: `Payment exceeds remaining balance of ₹${Math.round(remaining).toLocaleString("en-IN")}` }, { status: 400 });
      }

      const newPaid = currentPaid + amount;
      const payload = {
        receipt_no: body.receipt_no || `RC-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        booking_id: bookingId,
        quotation_id: body.quotation_id || booking.quotation_id || null,
        customer_id: body.customer_id || booking.customer_id || null,
        payment_date: body.payment_date || today(),
        amount,
        method: body.method || "bank_transfer",
        reference: body.reference || null,
        status: "received",
        notes: body.notes || null,
        created_by: c.session.user.id,
      };

      const payment = (await db(c, "crm_payments", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      })) || [];

      const existingStatus = String(booking.status || "confirmed");
      const updated = (await db(c, `crm_bookings?id=eq.${encodeURIComponent(bookingId)}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ paid_amount: newPaid, balance_amount: Math.max(0, total - newPaid), status: existingStatus }),
      })) || [];

      return NextResponse.json({ payment: payment?.[0] || null, booking: updated?.[0] || null });
    }

    return NextResponse.json({ error: "Invalid finance operation" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Finance operation failed" }, { status: 500 });
  }
}
