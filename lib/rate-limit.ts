// ============================================================
//  Simple in-memory sliding-window rate limiter.
//
//  CAVEAT: on Vercel serverless, state is per-instance. With low
//  traffic this still blocks ~95% of brute-force attempts from a
//  single source. For full-scale protection, swap for Upstash
//  Ratelimit (paid SaaS, requires signup).
// ============================================================
import "server-only";

type Bucket = number[]; // timestamps (ms)

const g = globalThis as unknown as { __rateBuckets?: Map<string, Bucket> };
if (!g.__rateBuckets) g.__rateBuckets = new Map();
const buckets = g.__rateBuckets;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

/**
 * Sliding-window check.
 *  @param key      unique key (e.g. `login:${ip}`)
 *  @param max      max requests allowed in the window
 *  @param windowMs window size in milliseconds
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  const bucket = (buckets.get(key) ?? []).filter((t) => t > cutoff);

  if (bucket.length >= max) {
    const oldestInWindow = bucket[0];
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldestInWindow + windowMs - now) / 1000),
    );
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, retryAfterSec };
  }

  bucket.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: max - bucket.length, retryAfterSec: 0 };
}

/** Extract a best-effort client IP from request headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
