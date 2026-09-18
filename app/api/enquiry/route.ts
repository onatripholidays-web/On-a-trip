import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  destination: z.string().trim().min(2).max(100),
  travel_date: z.string().max(20).optional().default(""),
  travellers: z.string().max(3).optional().default(""),
  enquiry_type: z.string().max(40).default("Package enquiry"),
  message: z.string().max(1000).optional().default(""),
  website: z.string().max(1).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });
    }

    if (parsed.data.website) return NextResponse.json({ ok: true });

    const { env } = getCloudflareContext();
    const cfEnv = env as unknown as Record<string, string | undefined>;
    // OpenNext exposes Cloudflare bindings through env; with nodejs_compat,
    // Worker runtime variables/secrets are also available through process.env.
    // Use both so dashboard-configured runtime values are available reliably.
    const url = "https://mdariypftlkjxfkhrans.supabase.co";
    const key = process.env['SUPABASE_' + 'SERVICE_ROLE_KEY'] ?? cfEnv['SUPABASE_' + 'SERVICE_ROLE_KEY'];

    if (!url || !key) {
      console.error("Supabase enquiry storage is not configured.");
      return NextResponse.json(
        { error: "Enquiry service is temporarily unavailable. Please use WhatsApp or call us." },
        { status: 503 },
      );
    }

    const payload = {
      name: parsed.data.name,
      phone: parsed.data.phone,
      destination: parsed.data.destination,
      travel_date: parsed.data.travel_date || null,
      travellers: parsed.data.travellers ? Number(parsed.data.travellers) || 1 : 1,
      source: "Website",
      notes: [parsed.data.enquiry_type, parsed.data.message].filter(Boolean).join(" — ") || null,
      status: "New",
      priority: "Normal",
    };

    const r = await fetch(`${url}/rest/v1/enquiries`, {
      method: "POST",
      headers: {
        // Supabase publishable/secret keys are API keys, not JWTs.
        // The secret key stays server-side and is sent only via apikey.
        apikey: key,
        "User-Agent": "OnATripHolidays-Cloudflare-Worker/1.0",
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!r.ok) {
      const details = await r.text().catch(() => "");
      console.error("Website enquiry Supabase insert failed", r.status, details);
      return NextResponse.json(
        { error: `Supabase insert failed (${r.status}): ${details.slice(0, 500)}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Website enquiry request failed", error);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
