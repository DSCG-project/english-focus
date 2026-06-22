import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const match = pathname.match(/^\/student\/courses\/([^/]+)\/([^/]+)\/test\/?$/);

  if (match) {
    const url = request.nextUrl.clone();
    url.pathname = "/student/test";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/courses/:courseId/:lessonId/test"],
};
