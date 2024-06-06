import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "next-auth/react";

export async function middleware(req: NextRequest) {
  const requestForNextAuth = {
    headers: { cookie: req.headers.get("cookie") || "" },
  };
  const token = await getSession({
    req: requestForNextAuth,
  });
  const url = req.nextUrl;
  const redirectUrl = ["/sign-in", "/sign-up"];
  if (!token && !redirectUrl.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }
  if (token && redirectUrl.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/forgot-password",
    "/recovery",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
