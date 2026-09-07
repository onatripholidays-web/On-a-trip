import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/),
  destination: z.string().trim().min(2).max(100),
  travel_date: z.string().trim().max(20).optional().default(""),
  travellers: z.string().trim().regex(/^\d{1,3}$/).optional().default(""),
  enquiry_type: z.string().trim().max(40).optional().default("Package enquiry"),
  message: z.string().trim().max(1000).optional().default(""),
  website: z.string().max(0).optional().default("")
});

const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string) {
  const now = Date.now(), old = hits.get(ip);
  if (!old || old.reset < now) {
    hits.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  old.count += 1;
  return old.count > 8;
}

function allowedOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).hostname === new URL(req.url).hostname; }
  catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return NextResponse.json({error:"Forbidden"}, {status:403});

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({error:"Too many enquiries. Please try again later."},{status:429});

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || parsed.data.website)
    return NextResponse.json({error:"Invalid enquiry."},{status:400});

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error("Supabase server configuration is missing.");
    return NextResponse.json({error:"Service temporarily unavailable."},{status:503});
  }

  const response = await fetch(`${url.replace(/\/$/,"")}/rest/v1/enquiries`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      apikey:key,
      Authorization:`Bearer ${key}`,
      Prefer:"return=minimal"
    },
    body:JSON.stringify({
      name:parsed.data.name, phone:parsed.data.phone,
      destination:parsed.data.destination,
      travel_date:parsed.data.travel_date || null,
      travellers:parsed.data.travellers ? Number(parsed.data.travellers) : null,
      enquiry_type:parsed.data.enquiry_type,
      message:parsed.data.message || null,
      source:"website"
    }),
    cache:"no-store"
  });

  if (!response.ok) {
    console.error("Supabase enquiry insert failed:", response.status);
    return NextResponse.json({error:"Unable to save enquiry."},{status:502});
  }

  return NextResponse.json({success:true},{status:201,headers:{"Cache-Control":"no-store"}});
}
