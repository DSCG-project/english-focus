import { NextResponse } from "next/server";

const STUDENT_COOKIE = "english_focus_student_session";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: "Logged out.",
  });

  response.cookies.set(STUDENT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}
