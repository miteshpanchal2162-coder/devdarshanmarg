import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { tokenStorageKeys } from "@/constants/env";
import { publicAuthRoutes, routes } from "@/constants/routes";

const adminPrefix = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(adminPrefix)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(tokenStorageKeys.accessToken)?.value;
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
