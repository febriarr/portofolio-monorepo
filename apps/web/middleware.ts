import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")
  const refreshToken = request.cookies.get("refresh_token")
  const { pathname } = request.nextUrl

  const isAuthenticated = !!accessToken || !!refreshToken

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
