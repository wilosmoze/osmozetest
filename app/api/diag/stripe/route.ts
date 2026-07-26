import { NextResponse } from "next/server";

// Public diagnostic: reports which Stripe env vars are visible to
// the server at runtime. Values are NEVER returned — only their
// presence + a short prefix hint so you can tell test vs live.
// NEXT_PUBLIC_* is also inlined at BUILD time into the client JS
// bundle, so if server sees it but the checkout banner still says
// 'Demo mode' the JS bundle was built before the var was set → a
// full rebuild without build cache is needed.

export const runtime = "nodejs";

function describe(name: string): {
  set: boolean;
  prefix?: string;
  length?: number;
} {
  const v = process.env[name];
  if (!v) return { set: false };
  return { set: true, prefix: v.slice(0, 8), length: v.length };
}

export async function GET() {
  return NextResponse.json({
    server_sees: {
      STRIPE_SECRET_KEY: describe("STRIPE_SECRET_KEY"),
      STRIPE_WEBHOOK_SECRET: describe("STRIPE_WEBHOOK_SECRET"),
      NEXT_PUBLIC_STRIPE_PUBLIC_KEY: describe("NEXT_PUBLIC_STRIPE_PUBLIC_KEY"),
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "NOT_SET",
      AUTH_SECRET: describe("AUTH_SECRET"),
    },
    // Vercel injects these automatically on every deployment — they
    // tell us WHICH project + WHICH env is actually running.
    // If VERCEL_ENV != 'production', the domain isn't hitting the
    // production runtime (which is where the Prod env vars apply).
    vercel_deployment: {
      VERCEL: process.env.VERCEL ?? null,
      VERCEL_ENV: process.env.VERCEL_ENV ?? null,
      VERCEL_URL: process.env.VERCEL_URL ?? null,
      VERCEL_GIT_REPO_SLUG: process.env.VERCEL_GIT_REPO_SLUG ?? null,
      VERCEL_GIT_REPO_OWNER: process.env.VERCEL_GIT_REPO_OWNER ?? null,
      VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? null,
      VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      NODE_ENV: process.env.NODE_ENV ?? null,
    },
    request_time: new Date().toISOString(),
  });
}
