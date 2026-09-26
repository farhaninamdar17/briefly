import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@/lib/security/headers";
import { SESSION_COOKIE_NAME } from "@/lib/security/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin dashboard routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    // Check if token has valid role format
    const isValidAdminOrEditor =
      sessionCookie &&
      (sessionCookie.includes(":ADMIN:") || sessionCookie.includes(":EDITOR:") || sessionCookie.startsWith("usr_admin") || sessionCookie.startsWith("usr_editor"));

    if (!isValidAdminOrEditor) {
      // Redirect unauthenticated/unauthorized users to home with return path or auth modal trigger
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth_required", "admin");
      return NextResponse.redirect(url);
    }
  }

  // Create response and apply production security headers
  const response = NextResponse.next();

  for (const header of SECURITY_HEADERS) {
    response.headers.set(header.key, header.value);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
