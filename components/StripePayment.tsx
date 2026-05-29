"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadStripe, type StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { LockKey } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useCart, useOrder } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import type { OrderCustomer, OrderLine } from "@/lib/orders";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

type Props = {
  customer: OrderCustomer;
  lines: OrderLine[];
  deliveryFee: number;
  amount: number;
  onValidate: () => boolean;
};

export function StripePayment({ customer, lines, deliveryFee, amount, onValidate }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clearCart = useCart((s) => s.clear);
  const startOrder = useOrder((s) => s.start);

  const launch = useCallback(async () => {
    setError(null);
    if (!onValidate()) {
      setError("Check your delivery details.");
      return;
    }
    setLoading(true);

    try {
      // Demo mode: no Stripe key configured → simulate payment
      if (!stripePromise) {
        await new Promise((r) => setTimeout(r, 1200));
        const orderId = `BR-DEMO-${Date.now().toString(36).toUpperCase()}`;
        startOrder(orderId);
        clearCart();
        router.push(`/tracking/${orderId}`);
        return;
      }

      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, lines, deliveryFee }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      const { clientSecret } = (await res.json()) as { clientSecret: string };
      const stripe = await stripePromise;
      if (!stripe || !containerRef.current) throw new Error("Stripe failed to load");

      checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });
      checkoutRef.current.mount(containerRef.current);
      setMounted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [customer, lines, deliveryFee, onValidate, router, startOrder, clearCart]);

  useEffect(() => {
    return () => {
      checkoutRef.current?.destroy();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <LockKey size={16} weight="duotone" />
        <span>
          {stripePromise
            ? "Secure payment by Stripe — end-to-end encrypted"
            : "Demo mode (no card required)"}
        </span>
      </div>

      {!mounted && (
        <button
          onClick={launch}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-sm font-medium text-zinc-950 transition-all hover:brightness-110 active:translate-y-[1px] disabled:opacity-60"
        >
          {loading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              className="block h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent"
            />
          ) : (
            `Pay ${formatPrice(amount)}`
          )}
        </button>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
      />
    </div>
  );
}
