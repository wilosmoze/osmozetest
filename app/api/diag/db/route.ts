// TEMPORARY diagnostic endpoint — expose ONLY booleans + counts.
// Helps debug whether Vercel Postgres env vars are reaching the runtime.
// Safe to ship: no secrets, no PII. Remove after debug if desired.
import { NextResponse } from "next/server";
import { dbEnabled, ensureSchema, sql } from "@/lib/db";
import { orderStore } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Which POSTGRES_* keys are visible from the runtime?
  const envKeys = Object.keys(process.env)
    .filter((k) => k.startsWith("POSTGRES_") || k.startsWith("DATABASE_"))
    .sort();

  let dbReachable = false;
  let dbCount: number | null = null;
  let dbError: string | null = null;

  if (dbEnabled) {
    try {
      await ensureSchema();
      const { rows } = await sql`SELECT count(*)::int AS c FROM orders`;
      dbReachable = true;
      dbCount = rows[0]?.c ?? 0;
    } catch (e) {
      dbError = (e as Error).message?.slice(0, 200) ?? "unknown";
    }
  }

  return NextResponse.json({
    dbEnabled,
    dbReachable,
    dbCount,
    dbError,
    envKeysPresent: envKeys,
    memoryOrderCount: orderStore.orders.size,
    runtime: "nodejs",
    timestamp: new Date().toISOString(),
  });
}
