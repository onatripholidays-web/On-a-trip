import { NextResponse } from "next/server";
import { crmSupabaseConfig } from "@/lib/crm-auth";

const val = (a: any[], ...names: string[]) => {
  const x = a?.find((v) => names.includes(String(v?.name || v?.field || "").toLowerCase()));
  return x?.values?.[0] ?? x?.value ?? "";
};

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const mode = p.get("hub.mode");
  const verify = p.get("hub.verify_token");
  const challenge = p.get("hub.challenge");
  if (mode === "subscribe" && verify === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge || "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const change = body?.entry?.flatMap((e: any) => e.changes || []).find((c: any) => c.field === "leadgen");
    const leadgenId = change?.value?.leadgen_id;
    if (!leadgenId) return NextResponse.json({ ok: true });

    const metaToken = process.env.META_LEADS_ACCESS_TOKEN;
    if (!metaToken) return NextResponse.json({ error: "META_LEADS_ACCESS_TOKEN is not configured" }, { status: 500 });

    // Never fall back to the public/anon Supabase key for server-to-server Meta ingestion.
    const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serverKey) {
      console.error("Meta webhook: SUPABASE_SERVICE_ROLE_KEY is not configured");
      return NextResponse.json({ error: "Meta lead storage is not configured" }, { status: 503 });
    }

    const version = process.env.META_GRAPH_VERSION || "v23.0";
    const gr = await fetch(
      `https://graph.facebook.com/${version}/${leadgenId}?fields=field_data&access_token=${encodeURIComponent(metaToken)}`,
      { cache: "no-store" },
    );
    const lead = await gr.json().catch(() => null);
    if (!gr.ok) return NextResponse.json({ error: "Meta lead fetch failed", details: lead }, { status: 502 });

    const fields = lead?.field_data || [];
    const name = String(val(fields, "full_name", "name", "first_name") || "").trim();
    const phone = String(val(fields, "phone_number", "phone", "mobile", "contact_number") || "").trim();
    const email = String(val(fields, "email", "email_address") || "").trim();
    const destination = String(
      val(fields, "destination", "travel_destination", "preferred_destination", "trip_destination") || "",
    ).trim();

    const { url } = crmSupabaseConfig();
    const payload = {
      name: name || null,
      phone: phone || null,
      email: email || null,
      dest: destination || null,
      source: "Meta Ads",
      status: "New",
      priority: "Normal",
      branch: "Hyderabad",
      notes: `Meta Lead ID: ${leadgenId}`,
    };

    const r = await fetch(`${url}/rest/v1/enquiries`, {
      method: "POST",
      headers: {
        apikey: serverKey,
        Authorization: `Bearer ${serverKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const details = await r.text().catch(() => "");
      console.error("Meta lead CRM insert failed", r.status, details);
      return NextResponse.json({ error: "CRM insert failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Webhook error" }, { status: 500 });
  }
}
