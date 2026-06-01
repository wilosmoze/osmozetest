import { NextResponse, type NextRequest } from "next/server";
import {
  verifyAdminTokenEdge,
  verifyCourierTokenEdge,
} from "@/lib/auth-edge";

// Doivent rester identiques à ADMIN_COOKIE / COURIER_COOKIE côté lib/.
const ADMIN_COOKIE = "braise_admin";
const COURIER_COOKIE = "braise_courier";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // -------- Admin routes --------
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await verifyAdminTokenEdge(token))) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // -------- Courier routes --------
  if (pathname.startsWith("/courier")) {
    if (pathname === "/courier/login") return NextResponse.next();
    const token = req.cookies.get(COURIER_COOKIE)?.value;
    if (!(await verifyCourierTokenEdge(token))) {
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
