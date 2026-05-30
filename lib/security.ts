// ============================================================
//  Cross-cutting security helpers used by API routes + UI.
// ============================================================
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify the request comes from our own front-end.
 * Browsers ALWAYS send Origin (or at least Referer) on cross-site
 * fetches initiated by JS. We require it to match NEXT_PUBLIC_APP_URL.
 * This is a lightweight CSRF defense for state-changing endpoints.
 */
export function isSameOrigin(req: Request): boolean {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return true; // dev fallback — allow

  const origin = req.headers.get("origin") ?? req.headers.get("referer");
  if (!origin) return false;

  try {
    const u = new URL(origin);
    const a = new URL(appUrl);
    return u.origin === a.origin;
  } catch {
    return false;
  }
}

/**
 * HMAC token tied to an order id — used to gate /tracking/[orderId]
 * so that only someone with the link can see the customer details.
 * Stateless: re-derived from orderId + AUTH_SECRET at verify time.
 */
const SECRET = () =>
  process.env.AUTH_SECRET ?? "dev-secret-replace-me-with-32-chars-min";

export function signOrderToken(orderId: string): string {
  return createHmac("sha256", SECRET())
    .update(`order:${orderId}`)
    .digest("hex")
    .slice(0, 24); // 96 bits, plenty for this use-case
}

export function verifyOrderToken(orderId: string, token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const expected = signOrderToken(orderId);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Whitelist-only URL sanitizer for hrefs rendered from customer
 * data (the Google Maps link). Blocks `javascript:`, `data:`,
 * `vbscript:` and other dangerous schemes.
 */
export function safeExternalUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  try {
    const u = new URL(trimmed);
    if (u.protocol === "https:" || u.protocol === "http:") return u.toString();
    return null;
  } catch {
    return null;
  }
}
