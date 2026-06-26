import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

async function countTable(client: NonNullable<ReturnType<typeof getSupabaseAdminClient>>, table: string) {
  const { count, error } = await client
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    return {
      table,
      count: 0,
      error: error.message,
    };
  }

  return {
    table,
    count: count || 0,
    error: "",
  };
}

export async function GET() {
  const client = getSupabaseAdminClient();

  if (!client) {
    return NextResponse.json({
      ok: false,
      message: "Supabase is not configured yet.",
      counts: {},
    });
  }

  const tables = [
    "english_levels",
    "english_courses",
    "english_lessons",
    "english_quiz_questions",
    "english_students",
    "english_test_results",
  ];

  const results = await Promise.all(tables.map((table) => countTable(client, table)));

  const hasError = results.some((item) => item.error);

  return NextResponse.json({
    ok: !hasError,
    message: hasError ? "Some tables could not be counted." : "Database counts loaded.",
    counts: Object.fromEntries(results.map((item) => [item.table, item.count])),
    errors: results.filter((item) => item.error),
  });
}
