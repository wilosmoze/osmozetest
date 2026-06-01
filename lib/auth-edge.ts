// ============================================================
//  Edge-runtime compatible token verification.
//
//  middleware.ts runs on Edge (no node:crypto). We re-implement the
//  HMAC check with Web Crypto so cookies are *cryptographically*
//  validated at the edge — not just checked for presence.
//
//  Must derive the same signatures as lib/auth.ts (admin) and
//  lib/courier.ts (courier) — same AUTH_SECRET, same payload format.
// ============================================================

const enc = new TextEncoder();

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function secret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret-replace-me-with-32-chars-min";
}

/** Constant-time string compare (best effort in JS). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyAdminTokenEdge(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  if (role !== "admin") return false;
  if (Number(expStr) < Date.now()) return false;
  const expected = await hmacHex(secret(), `${role}.${expStr}`);
  return safeEqual(sig, expected);
}

export async function verifyCourierTokenEdge(
  token: string | undefined,
): Promise<{ name: string } | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [role, name, expStr, sig] = parts;
  if (role !== "courier") return null;
  if (Number(expStr) < Date.now()) return null;
  const expected = await hmacHex(secret(), `${role}.${name}.${expStr}`);
  return safeEqual(sig, expected) ? { name } : null;
}
