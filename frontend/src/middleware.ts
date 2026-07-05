import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicAuthRoutes, routes } from "@/constants/routes";

const adminPrefix = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(adminPrefix)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("ddm_access_token")?.value;
  const isAuthRoute = publicAuthRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    return NextResponse.next();
  }

  if (!accessToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = routes.login;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
