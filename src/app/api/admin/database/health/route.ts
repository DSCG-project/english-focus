import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const hasPublishable = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const hasSecret = Boolean(process.env.SUPABASE_SECRET_KEY);
  const hasService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  const client = getSupabaseAdminClient();

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: hasUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: hasPublishable,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnon,
    SUPABASE_SECRET_KEY: hasSecret,
    SUPABASE_SERVICE_ROLE_KEY: hasService,
  };

  if (!client) {
    return NextResponse.json({
      ok: false,
      mode: "localStorage",
      message: "Supabase is not configured yet.",
      env,
    });
  }

  const { error } = await client.from("english_levels").select("id").limit(1);

  if (error) {
    return NextResponse.json({
      ok: false,
      mode: "supabase",
      message: error.message,
      env,
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    message: "Supabase connected successfully.",
    env,
  });
}
