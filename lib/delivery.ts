// ============================================================
//  Shared delivery-zone logic (used by client form + server API)
//  Single source of truth → no drift between front and back.
// ============================================================
import { themeConfig } from "@/config/theme.config";

/** Rawai sub-district bounding box (Phuket).
 *  Covers Rawai + Naiharn + Promthep + Yanui + Friendship Beach. */
export const RAWAI_BBOX = {
  north: 7.815,
  south: 7.735,
  east: 98.375,
  west: 98.282,
} as const;

export type ZoneId = "rawai" | "outside";

export function isInRawai(lat: number, lng: number): boolean {
  return (
    lat >= RAWAI_BBOX.south &&
    lat <= RAWAI_BBOX.north &&
    lng >= RAWAI_BBOX.west &&
    lng <= RAWAI_BBOX.east
  );
}

/**
 * Extract lat/lng from a Google Maps URL. Handles every common format:
 *  - `@lat,lng,zoom`           (browser place URLs)
 *  - `q=lat,lng`               (search shares)
 *  - `ll=lat,lng`              (legacy embed)
 *  - `!3d{lat}!4d{lng}`        (data param after redirect)
 *  - `center=lat,lng`          (Maps Static)
 *  - generic `lat,lng` fallback
 * Returns null for SHORT links (maps.app.goo.gl/xxx) — those have to be
 * resolved first via `resolveZoneAndFeeAsync` which follows redirects.
 */
export function extractCoords(
  url: string,
): { lat: number; lng: number } | null {
  if (!url) return null;

  const patterns = [
    /[@?](-?\d{1,3}\.\d{2,}),(-?\d{1,3}\.\d{2,})/,
    /(?:q=|ll=|center=)(-?\d{1,3}\.\d{2,}),\s*(-?\d{1,3}\.\d{2,})/,
    /!3d(-?\d{1,3}\.\d{2,})!4d(-?\d{1,3}\.\d{2,})/,
    /(-?\d{1,3}\.\d{4,})[, ]+(-?\d{1,3}\.\d{4,})/,
  ];

  for (const pat of patterns) {
    const m = url.match(pat);
    if (!m) continue;
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  return null;
}

const SHORT_MAPS_URL = /^https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps)/i;

export function isShortMapsUrl(url: string): boolean {
  return SHORT_MAPS_URL.test(url.trim());
}

/** Follow redirects on a short Maps URL → returns the expanded URL or null.
 *
 *  IMPORTANT: Google's maps.app.goo.gl does user-agent sniffing — desktop UAs
 *  get a 200 OK with a JS-only page (no Location header). Mobile UAs get a
 *  proper 302 with Location → the long /maps/place/... URL containing coords.
 *  We use an iPhone UA so `redirect: "follow"` resolves to the real target.
 */
async function followRedirects(url: string): Promise<string | null> {
  const MOBILE_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

  // 1. Try the standard "follow" path with a mobile UA
  try {
    const res = await fetch(url.trim(), {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": MOBILE_UA },
      signal: AbortSignal.timeout(6000),
    });
    if (res.url && res.url !== url.trim()) return res.url;
  } catch {
    /* fall through to manual mode */
  }

  // 2. Fallback: read the Location header manually (some envs / Vercel edge
  //    cases don't expose the final URL on res.url).
  try {
    const res = await fetch(url.trim(), {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": MOBILE_UA },
      signal: AbortSignal.timeout(6000),
    });
    const loc = res.headers.get("location");
    if (loc) return loc;
  } catch {
    /* nothing more we can do */
  }

  return null;
}

/** Resolve the zone id from a Maps URL. Sync — no network calls.
 *  Returns null when coords can't be extracted locally (short links). */
export function zoneFromUrl(url: string): ZoneId | null {
  const coords = extractCoords(url);
  if (!coords) return null;
  return isInRawai(coords.lat, coords.lng) ? "rawai" : "outside";
}

/** Fee in THB for the given zone id (reads from themeConfig). */
export function feeForZone(zoneId: ZoneId): number {
  const zone = themeConfig.delivery.zones.find((z) => z.id === zoneId);
  return zone ? zone.fee : 0;
}

/** Sync resolver (no network). Falls back to "outside" if no coords. */
export function resolveZoneAndFee(url: string): {
  zoneId: ZoneId;
  fee: number;
  coordsResolved: boolean;
} {
  const detected = zoneFromUrl(url);
  if (detected) {
    return { zoneId: detected, fee: feeForZone(detected), coordsResolved: true };
  }
  return { zoneId: "outside", fee: feeForZone("outside"), coordsResolved: false };
}

/**
 * ASYNC resolver — server-side authoritative version.
 *  1. Try local extraction (works for long URLs).
 *  2. If short URL → follow redirect → try extraction again on expanded URL.
 *  3. Last resort: safe default "outside" (never undercharge).
 */
export async function resolveZoneAndFeeAsync(url: string): Promise<{
  zoneId: ZoneId;
  fee: number;
  coordsResolved: boolean;
}> {
  let coords = extractCoords(url);

  if (!coords && isShortMapsUrl(url)) {
    const expanded = await followRedirects(url);
    if (expanded) coords = extractCoords(expanded);
  }

  if (coords) {
    const zoneId = isInRawai(coords.lat, coords.lng) ? "rawai" : "outside";
    return { zoneId, fee: feeForZone(zoneId), coordsResolved: true };
  }
  return {
    zoneId: "outside",
    fee: feeForZone("outside"),
    coordsResolved: false,
  };
}
