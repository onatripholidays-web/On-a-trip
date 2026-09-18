import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const { env } = getCloudflareContext();
  const cfEnv = env as unknown as Record<string, unknown>;
  const procEnv = process.env as Record<string, unknown>;

  return NextResponse.json({
    cloudflareEnv: {
      supabaseUrl: typeof cfEnv.NEXT_PUBLIC_SUPABASE_URL === "string",
      supabaseSecret: typeof cfEnv.SUPABASE_SERVICE_ROLE_KEY === "string",
    },
    processEnv: {
      supabaseUrl: typeof procEnv.NEXT_PUBLIC_SUPABASE_URL === "string",
      supabaseSecret: typeof procEnv.SUPABASE_SERVICE_ROLE_KEY === "string",
    },
  });
}
