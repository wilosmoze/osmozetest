import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminToken, ADMIN_COOKIE, ADMIN_TTL_SECONDS } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password: string };
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "Admin non configuré côté serveur (ADMIN_PASSWORD manquant)" },
      { status: 503 },
    );
  }

  const a = Buffer.from(password ?? "");
  const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);

  if (!ok) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_TTL_SECONDS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
