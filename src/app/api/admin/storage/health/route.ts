import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const client = getSupabaseAdminClient();

  if (!client) {
    return NextResponse.json({
      ok: false,
      mode: "local",
      message: "Supabase is not configured. Uploads will use local public/uploads fallback.",
      buckets: {
        "english-focus-videos": false,
        "english-focus-pdfs": false,
      },
    });
  }

  const { data, error } = await client.storage.listBuckets();

  if (error) {
    return NextResponse.json({
      ok: false,
      mode: "supabase",
      message: error.message,
      buckets: {
        "english-focus-videos": false,
        "english-focus-pdfs": false,
      },
    });
  }

  const bucketNames = new Set((data || []).map((bucket) => bucket.name));

  const videos = bucketNames.has("english-focus-videos");
  const pdfs = bucketNames.has("english-focus-pdfs");

  return NextResponse.json({
    ok: videos && pdfs,
    mode: "supabase",
    message: videos && pdfs ? "Supabase Storage is ready." : "One or more buckets are missing.",
    buckets: {
      "english-focus-videos": videos,
      "english-focus-pdfs": pdfs,
    },
  });
}
