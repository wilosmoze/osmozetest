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

export type ZoneId = "rawai" | "outside" | "too_far";

export function isInRawai(lat: number, lng: number): boolean {
  return (
    lat >= RAWAI_BBOX.south &&
    lat <= RAWAI_BBOX.north &&
    lng >= RAWAI_BBOX.west &&
    lng <= RAWAI_BBOX.east
  );
}

/** Haversine distance in kilometres between two lat/lng points. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
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

/** Classify a coords pair into a zone. */
function classify(lat: number, lng: number): {
  zoneId: ZoneId;
  distanceKm: number;
} {
  const km = distanceKm(themeConfig.delivery.kitchenLocation, { lat, lng });
  if (km > themeConfig.delivery.maxDistanceKm) {
    return { zoneId: "too_far", distanceKm: km };
  }
  return {
    zoneId: isInRawai(lat, lng) ? "rawai" : "outside",
    distanceKm: km,
  };
}

/** Fee in THB for the given zone id (reads from themeConfig). */
export function feeForZone(zoneId: ZoneId): number {
  if (zoneId === "too_far") return 0;
  const zone = themeConfig.delivery.zones.find((z) => z.id === zoneId);
  return zone ? zone.fee : 0;
}

/** Sync resolver (no network). Falls back to "outside" if no coords. */
export function resolveZoneAndFee(url: string): {
  zoneId: ZoneId;
  fee: number;
  coordsResolved: boolean;
  distanceKm: number | null;
} {
  const coords = extractCoords(url);
  if (!coords) {
    return {
      zoneId: "outside",
      fee: feeForZone("outside"),
      coordsResolved: false,
      distanceKm: null,
    };
  }
  const { zoneId, distanceKm } = classify(coords.lat, coords.lng);
  return {
    zoneId,
    fee: feeForZone(zoneId),
    coordsResolved: true,
    distanceKm,
  };
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
  distanceKm: number | null;
}> {
  let coords = extractCoords(url);

  if (!coords && isShortMapsUrl(url)) {
    const expanded = await followRedirects(url);
    if (expanded) coords = extractCoords(expanded);
  }

  if (coords) {
    const { zoneId, distanceKm } = classify(coords.lat, coords.lng);
    return {
      zoneId,
      fee: feeForZone(zoneId),
      coordsResolved: true,
      distanceKm,
    };
  }
  return {
    zoneId: "outside",
    fee: feeForZone("outside"),
    coordsResolved: false,
    distanceKm: null,
  };
}
