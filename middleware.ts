import { NextResponse, type NextRequest } from "next/server";

// Doit rester identique aux constantes côté lib/auth.ts et lib/courier.ts.
// Inlinés ici car middleware tourne sur Edge runtime (pas de node:crypto).
const ADMIN_COOKIE = "braise_admin";
const COURIER_COOKIE = "braise_courier";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // -------- Admin routes --------
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!req.cookies.get(ADMIN_COOKIE)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // -------- Courier routes --------
  if (pathname.startsWith("/courier")) {
    if (pathname === "/courier/login") return NextResponse.next();
    if (!req.cookies.get(COURIER_COOKIE)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/courier/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/courier/:path*"],
};
