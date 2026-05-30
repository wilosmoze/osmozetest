// ============================================================
//  Vercel Postgres connection + schema bootstrap.
//
//  - When POSTGRES_URL env var is set: real Postgres backend.
//  - When NOT set (local dev, pre-activation): falls back to
//    in-memory store. lib/orders.ts uses dbEnabled to branch.
//
//  Schema is created lazily on first access (idempotent).
// ============================================================
import "server-only";
import { sql } from "@vercel/postgres";

export const dbEnabled =
  !!process.env.POSTGRES_URL || !!process.env.POSTGRES_PRISMA_URL;

let initPromise: Promise<void> | null = null;

/** Idempotent schema creation. Called once per Lambda lifetime. */
export async function ensureSchema(): Promise<void> {
  if (!dbEnabled) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id              TEXT PRIMARY KEY,
        status          TEXT NOT NULL,
        payment_status  TEXT NOT NULL,
        stripe_session_id TEXT,
        customer        JSONB NOT NULL,
        lines           JSONB NOT NULL,
        subtotal        NUMERIC(12, 2) NOT NULL,
        delivery_fee    NUMERIC(12, 2) NOT NULL,
        total           NUMERIC(12, 2) NOT NULL,
        assigned_courier TEXT,
        history         JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at      BIGINT NOT NULL,
        updated_at      BIGINT NOT NULL
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_courier ON orders(assigned_courier)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`;
  })();

  return initPromise;
}

export { sql };
