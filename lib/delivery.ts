// ============================================================
//  Shared delivery-zone logic (used by client form + server API)
//  Single source of truth → no drift between front and back.
// ============================================================
import { themeConfig } from "@/config/theme.config";

/** Rawai bounding box (Phuket). Covers Rawai + Naiharn + Yanui. */
export const RAWAI_BBOX = {
  north: 7.795,
  south: 7.750,
  east: 98.360,
  west: 98.300,
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
 * Extract lat/lng from a Google Maps URL.
 * Handles `@lat,lng`, `q=lat,lng`, `ll=lat,lng`, and `?lat,lng` patterns.
 * Returns null for short links (maps.app.goo.gl/xxx) or unrecognised formats.
 */
export function extractCoords(
  url: string,
): { lat: number; lng: number } | null {
  if (!url) return null;
  const match = url.match(/(-?\d{1,3}\.\d{4,})[, ]+(-?\d{1,3}\.\d{4,})/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/**
 * Resolve the zone id from a Maps URL.
 *  - If we can extract coords AND they're inside Rawai → "rawai"
 *  - If we can extract coords AND they're outside Rawai → "outside"
 *  - If we can't extract coords (short link) → null (server should reject or
 *    fall back to a safe default — here we pick "outside" so the fee is
 *    charged on the safe side).
 */
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

/**
 * Server-side authoritative resolution.
 * Falls back to "outside" (paid) when coords can't be extracted, so we
 * never UNDERCHARGE. A real-life improvement: resolve short links via
 * a HEAD request and re-extract.
 */
export function resolveZoneAndFee(url: string): {
  zoneId: ZoneId;
  fee: number;
  coordsResolved: boolean;
} {
  const detected = zoneFromUrl(url);
  if (detected) {
    return { zoneId: detected, fee: feeForZone(detected), coordsResolved: true };
  }
  // Safe default: charge the fee when we can't verify.
  return { zoneId: "outside", fee: feeForZone("outside"), coordsResolved: false };
}
