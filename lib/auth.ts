import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "braise_admin";
const TTL_DAYS = 7;

function sign(payload: string) {
  return createHmac("sha256", process.env.AUTH_SECRET ?? "dev-secret-replace-me")
    .update(payload)
    .digest("hex");
}

export function createAdminToken() {
  const exp = Date.now() + TTL_DAYS * 86400_000;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  const payload = `${role}.${expStr}`;
  const expected = sign(payload);
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) {
      return false;
    }
  } catch {
    return false;
  }
  if (role !== "admin") return false;
  if (Number(expStr) < Date.now()) return false;
  return true;
}

export async function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return { ok: verifyAdminToken(token) };
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_TTL_SECONDS = TTL_DAYS * 86400;
