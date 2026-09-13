import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCrmSession, crmSupabaseConfig } from "@/lib/crm-auth";

async function ctx() {
  const session = await getCrmSession();
  if (!session) return null;
  const token = (await cookies()).get("oat_crm_access")?.value || "";
  const { url, key } = crmSupabaseConfig();
  return { session, token, url, key };
}

function h(c: any, extra: Record<string, string> = {}) {
  return { apikey: c.key, Authorization: `Bearer ${c.token}`, ...extra };
}

export async function POST(req: Request) {
  const c = await ctx();
  if (!c) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const quotationId = String(body?.quotation_id || "").trim();
  if (!quotationId) return NextResponse.json({ error: "quotation_id is required" }, { status: 400 });

  try {
    const qR = await fetch(
      `${c.url}/rest/v1/crm_quotations?id=eq.${encodeURIComponent(quotationId)}&select=*`,
      { headers: h(c), cache: "no-store" },
    );
    const qs = await qR.json().catch(() => null);
    if (!qR.ok) return NextResponse.json({ error: "Could not load quotation", details: qs }, { status: 502 });

    const q = Array.isArray(qs) ? qs[0] : null;
    if (!q) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    if (String(q.status || "").toLowerCase() === "converted") {
      return NextResponse.json({ error: "Quotation is already converted" }, { status: 409 });
    }
    if (!q.customer_id) return NextResponse.json({ error: "Quotation has no customer" }, { status: 400 });

    const total = Math.max(0, Number(q.total) || 0);
    const pax = Math.max(1, Number(q.travellers) || 1);
    const bno = `BK-${new Date().toISOString().slice(0, 7).replace("-", "")}-${crypto
      .randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;

    // IMPORTANT: use the live Supabase booking contract. The database uses
    // quotation_id / departure_date / return_date / travellers / assigned_to.
    const booking = {
      booking_no: bno,
      quotation_id: q.id,
      customer_id: q.customer_id,
      enquiry_id: q.enquiry_id || null,
      package_id: q.package_id || null,
      destination: q.destination || null,
      departure_date: q.travel_date || null,
      return_date: q.return_date || null,
      travellers: pax,
      total_amount: total,
      paid_amount: 0,
      balance_amount: total,
      status: "confirmed",
      assigned_to: c.session.profile.salesperson || null,
      notes: q.terms || null,
      created_by: c.session.user.id,
    };

    const r = await fetch(`${c.url}/rest/v1/crm_bookings`, {
      method: "POST",
      headers: h(c, { "Content-Type": "application/json", Prefer: "return=representation" }),
      body: JSON.stringify(booking),
    });
    const d = await r.json().catch(() => null);
    if (!r.ok) {
      return NextResponse.json({ error: "Could not create booking", details: d }, { status: 502 });
    }

    const bookingRow = Array.isArray(d) ? d[0] : d;

    // Mark the quotation only after the booking exists. Keep the live quotation
    // table as the single source of truth for quotation status.
    const qUpdate = await fetch(
      `${c.url}/rest/v1/crm_quotations?id=eq.${encodeURIComponent(q.id)}`,
      {
        method: "PATCH",
        headers: h(c, { "Content-Type": "application/json", Prefer: "return=minimal" }),
        body: JSON.stringify({ status: "converted" }),
      },
    );

    if (!qUpdate.ok) {
      // Do not pretend the conversion succeeded: the booking exists but the
      // quotation state is inconsistent and must be surfaced to the operator.
      return NextResponse.json(
        {
          error: "Booking created but quotation status could not be updated. Do not convert this quotation again.",
          booking: bookingRow,
        },
        { status: 502 },
      );
    }

    if (q.enquiry_id) {
      const enquiryUpdate = await fetch(
        `${c.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(q.enquiry_id)}`,
        {
          method: "PATCH",
          headers: h(c, { "Content-Type": "application/json", Prefer: "return=minimal" }),
          body: JSON.stringify({ status: "Booked" }),
        },
      );
      if (!enquiryUpdate.ok) {
        console.warn("Booking conversion succeeded but enquiry status could not be updated", await enquiryUpdate.text().catch(() => ""));
      }
    }

    return NextResponse.json({ ok: true, booking: bookingRow });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Conversion failed" }, { status: 502 });
  }
}
