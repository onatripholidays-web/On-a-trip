import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCrmSession, crmSupabaseConfig } from "@/lib/crm-auth";

function h(c: any, extra: Record<string, string> = {}) {
  return { apikey: c.key, Authorization: `Bearer ${c.token}`, ...extra };
}

async function ctx() {
  const session = await getCrmSession();
  if (!session) return null;
  const token = (await cookies()).get("oat_crm_access")?.value || "";
  const { url, key } = crmSupabaseConfig();
  return { session, token, url, key };
}

export async function POST(req: Request) {
  const c = await ctx();
  if (!c) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let b: any = {};
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const customerInput = b?.customer || {};
  if (!customerInput.name || !customerInput.phone || !customerInput.destination) {
    return NextResponse.json({ error: "Customer name, phone and destination are required" }, { status: 400 });
  }

  try {
    // crm_customers is the live customer master. Do not send quotation-only
    // fields such as destination/travel_date into this table.
    const customerPayload = {
      name: String(customerInput.name).trim(),
      phone: String(customerInput.phone).trim(),
      email: customerInput.email || null,
      source: "CRM Quotation",
      assigned_to: c.session.profile.salesperson || null,
      created_by: c.session.user.id,
    };

    const cr = await fetch(`${c.url}/rest/v1/crm_customers?on_conflict=phone`, {
      method: "POST",
      headers: h(c, {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify(customerPayload),
    });
    const cd = await cr.json().catch(() => null);
    if (!cr.ok) throw new Error(cd?.message || "Customer save failed");
    const customer = Array.isArray(cd) ? cd[0] : cd;
    if (!customer?.id) throw new Error("Customer was not returned by Supabase");

    const rawItems = Array.isArray(b.items) ? b.items : [];
    const items = rawItems.map((x: any, i: number) => {
      const quantity = Math.max(0, Number(x.quantity) || 1);
      const cost = Math.max(0, Number(x.unit_cost) || 0);
      const markup = Math.max(0, Number(x.markup) || 0);
      const taxRate = Math.max(0, Number(x.tax_rate) || 0);
      const sell = quantity * (cost + markup);
      return {
        item_type: "service",
        description: String(x.description || "Service"),
        supplier: x.supplier || null,
        quantity,
        unit_cost: cost,
        markup,
        tax_rate: taxRate,
        sell_price: sell,
        sort_order: i,
        _tax: (sell * taxRate) / 100,
      };
    });

    const subtotal = items.reduce((s: number, x: any) => s + x.sell_price, 0);
    const tax = items.reduce((s: number, x: any) => s + x._tax, 0);
    const discount = Math.max(0, Number(b.discount) || 0);
    const tcs = Math.max(0, Number(b.tcs) || 0);
    const total = Math.max(0, subtotal + tax - discount + tcs);
    const qno = `QT-${new Date().toISOString().slice(0, 7).replace("-", "")}-${crypto
      .randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;

    const enquiryId = customerInput.enquiry_id || b.enquiry_id || null;
    const q = {
      quotation_no: qno,
      customer_id: customer.id,
      enquiry_id: enquiryId,
      title: String(customerInput.title || "Holiday Package"),
      destination: String(customerInput.destination),
      travel_date: customerInput.travel_date || null,
      return_date: customerInput.return_date || null,
      travellers: Math.max(1, Number(customerInput.travellers) || 1),
      currency: "INR",
      subtotal,
      discount,
      tax,
      tcs,
      total,
      status: "draft",
      valid_until: b.valid_until || null,
      terms: b.terms || null,
      created_by: c.session.user.id,
      itinerary: Array.isArray(b.itinerary) ? b.itinerary : [],
    };

    const qr = await fetch(`${c.url}/rest/v1/crm_quotations`, {
      method: "POST",
      headers: h(c, { "Content-Type": "application/json", Prefer: "return=representation" }),
      body: JSON.stringify(q),
    });
    const qd = await qr.json().catch(() => null);
    if (!qr.ok) throw new Error(qd?.message || "Quotation save failed");
    const quotation = Array.isArray(qd) ? qd[0] : qd;
    if (!quotation?.id) throw new Error("Quotation was not returned by Supabase");

    if (items.length) {
      const payload = items.map((x: any) => {
        const y = { ...x };
        delete y._tax;
        y.quotation_id = quotation.id;
        return y;
      });
      const ir = await fetch(`${c.url}/rest/v1/crm_quotation_items`, {
        method: "POST",
        headers: h(c, { "Content-Type": "application/json", Prefer: "return=minimal" }),
        body: JSON.stringify(payload),
      });
      if (!ir.ok) {
        await fetch(`${c.url}/rest/v1/crm_quotations?id=eq.${encodeURIComponent(quotation.id)}`, {
          method: "DELETE",
          headers: h(c),
        });
        const details = await ir.text().catch(() => "");
        throw new Error(`Quotation items save failed: ${details}`);
      }
    }

    return NextResponse.json({ ok: true, quotation, customer });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not save quotation" }, { status: 502 });
  }
}
