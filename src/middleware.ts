import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "english_focus_admin_session";
const STUDENT_COOKIE = "english_focus_student_session";

function isProtectedAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/");
}

function isProtectedStudentRoute(pathname: string) {
  if (pathname === "/student/login") return false;
  return pathname === "/student" || pathname.startsWith("/student/");
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isProtectedAdminRoute(pathname)) {
    const hasAdminSession = request.cookies.get(ADMIN_COOKIE)?.value === "1";

    if (hasAdminSession) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/admin/")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedStudentRoute(pathname)) {
    const hasStudentSession = request.cookies.get(STUDENT_COOKIE)?.value === "1";

    if (hasStudentSession) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/student/login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/student/:path*"],
};
