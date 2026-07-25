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
    },
    hint: [
      "If all three show set:true → env vars ARE injected at runtime.",
      "If STRIPE_SECRET_KEY.set is true → server will use real Stripe (not demo).",
      "If NEXT_PUBLIC_STRIPE_PUBLIC_KEY.set is true here but the browser",
      "  still shows 'Demo mode', the client JS bundle was built BEFORE",
      "  the var was set. Trigger a rebuild WITHOUT build cache.",
      "Prefix 'pk_test_' / 'sk_test_' = test mode, 'pk_live_' / 'sk_live_' = live.",
    ],
    build_time: new Date().toISOString(),
  });
}
