import { NextResponse } from "next/server";
import {
  verifyCourierPassword,
  createCourierToken,
  COURIER_COOKIE,
  COURIER_TTL_SECONDS,
} from "@/lib/courier";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ip = clientIp(req);
  const rl = rateLimit(`courier-login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const { name, password } = (await req.json()) as {
    name?: string;
    password?: string;
  };
  if (!name || !password) {
    return NextResponse.json(
      { error: "Name and password required" },
      { status: 400 },
    );
  }
  if (!verifyCourierPassword(name, password)) {
    return NextResponse.json(
      { error: "Wrong name or password" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true, name });
  res.cookies.set(COURIER_COOKIE, createCourierToken(name), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COURIER_TTL_SECONDS,
  });
  return res;
}

export async function DELETE(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COURIER_COOKIE);
  return res;
}
