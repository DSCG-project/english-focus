import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const STUDENT_COOKIE = "english_focus_student_session";

function safeEqual(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const expectedCode = process.env.STUDENT_ACCESS_CODE || "";

    if (!expectedCode) {
      return NextResponse.json(
        {
          ok: false,
          message: "STUDENT_ACCESS_CODE is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const code = String(body.code || "");

    if (!code || !safeEqual(code, expectedCode)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid access code.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      message: "Access granted.",
    });

    response.cookies.set(STUDENT_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 14,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Student login failed.",
      },
      { status: 500 }
    );
  }
}
