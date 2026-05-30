// ============================================================
//  Courier auth — per-user login, scoped permissions.
//
//  Credentials live in env var COURIER_LOGINS as a CSV:
//     name1:password1,name2:password2,…
//
//  Up to 5 couriers (no hard cap, just operational scope).
// ============================================================
import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const COURIER_COOKIE = "braise_courier";
export const COURIER_TTL_SECONDS = 7 * 86400; // 7 days

type Courier = { name: string; password: string };

function parseCouriers(): Courier[] {
  const raw = process.env.COURIER_LOGINS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, ...rest] = pair.split(":");
      return { name: name.trim(), password: rest.join(":").trim() };
    })
    .filter((c) => c.name && c.password);
}

/** Return just the names — used by admin UI to assign couriers. */
export function listCourierNames(): string[] {
  return parseCouriers().map((c) => c.name);
}

/** Constant-time password check for a given courier name. */
export function verifyCourierPassword(name: string, password: string): boolean {
  const found = parseCouriers().find((c) => c.name === name);
  if (!found) return false;
  const a = Buffer.from(password ?? "");
  const b = Buffer.from(found.password);
  return a.length === b.length && timingSafeEqual(a, b);
}

const SECRET = () =>
  process.env.AUTH_SECRET ?? "dev-secret-replace-me-with-32-chars-min";

function sign(payload: string) {
  return createHmac("sha256", SECRET()).update(payload).digest("hex");
}

export function createCourierToken(name: string): string {
  const exp = Date.now() + COURIER_TTL_SECONDS * 1000;
  const payload = `courier.${name}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyCourierToken(
  token: string | undefined,
): { name: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [role, name, expStr, sig] = parts;
  if (role !== "courier") return null;
  if (Number(expStr) < Date.now()) return null;
  const payload = `${role}.${name}.${expStr}`;
  const expected = sign(payload);
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) {
      return null;
    }
  } catch {
    return null;
  }
  return { name };
}

export async function requireCourier(): Promise<
  { ok: true; name: string } | { ok: false }
> {
  const token = cookies().get(COURIER_COOKIE)?.value;
  const verified = verifyCourierToken(token);
  if (!verified) return { ok: false };
  return { ok: true, name: verified.name };
}
