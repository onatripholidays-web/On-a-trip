import { NextResponse } from "next/server";
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

    // Honeypot: silently accept obvious bot submissions without writing to the CRM.
    if (parsed.data.website) return NextResponse.json({ ok: true });

    // Keep the public website and CRM on the same Supabase configuration.
    // The anon/publishable key is intentionally used here; Supabase RLS controls writes.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
        apikey: key,
        Authorization: `Bearer ${key}`,
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
        { error: "We could not save the enquiry. Please use WhatsApp or call us." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Website enquiry request failed", error);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
