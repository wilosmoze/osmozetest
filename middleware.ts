import { NextResponse, type NextRequest } from "next/server";

// Doit rester identique à ADMIN_COOKIE dans lib/auth.ts.
// Inliné ici car middleware tourne sur Edge runtime (pas de node:crypto).
const ADMIN_COOKIE = "braise_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname.startsWith("/admin") && !req.cookies.get(ADMIN_COOKIE)?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
