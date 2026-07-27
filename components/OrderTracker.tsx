"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame, Package, Motorcycle, Check,
} from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";
import { useOrder, useCart } from "@/lib/store";
import { OrderVinyl } from "./OrderVinyl";

const ICONS = { flame: Flame, package: Package, scooter: Motorcycle };

type PublicOrder = {
  id: string;
  status: "pending_payment" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "failed";
};

function statusToStep(s: PublicOrder["status"] | undefined): 0 | 1 | 2 | 3 {
  switch (s) {
    case "preparing": return 1;
    case "ready": return 2;
    case "delivering":
    case "delivered": return 3;
    default: return 0;
  }
}

export function OrderTracker({
  orderId,
  token,
}: {
  orderId: string;
  token?: string;
}) {
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const mockStep = useOrder((s) => s.step);
  const lastOrder = useOrder((s) => s.lastOrder);
  const clearCart = useCart((s) => s.clear);
  const resetOrder = useOrder((s) => s.reset);
  const setLastOrder = useOrder((s) => s.setLastOrder);

  // Reaching the tracker page means checkout succeeded (Stripe redirected
  // us here on return_url, or demo mode routed straight in). Clear the
  // cart so the header badge/floating bar no longer show the just-ordered
  // items. Safe to call more than once — it's a no-op on an empty cart.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Save orderId + tracking token to the persisted useOrder store so the
  // "Track order" chip in the header can bring the customer back here
  // from any page, even after they close and reopen the tab.
  useEffect(() => {
    if (!token) return;
    const current = useOrder.getState().lastOrder;
    if (current?.id === orderId && current.trackingToken === token) return;
    setLastOrder({
      id: orderId,
      lines: current?.id === orderId ? current.lines : [],
      subtotal: current?.id === orderId ? current.subtotal : 0,
      deliveryFee: current?.id === orderId ? current.deliveryFee : 0,
      total: current?.id === orderId ? current.total : 0,
      createdAt: current?.id === orderId ? current.createdAt : Date.now(),
      trackingToken: token,
    });
  }, [orderId, token, setLastOrder]);

  // Once the SSE stream reports 'delivered', reset the useOrder store so
  // the mock ticker stops and any OrderVinyl on subsequent pages doesn't
  // stick around after the customer has been served.
  useEffect(() => {
    if (order?.status === "delivered" || order?.status === "cancelled") {
      resetOrder();
    }
  }, [order?.status, resetOrder]);

  useEffect(() => {
    // Demo mode: no server order, we drive the timeline from the mock store.
    if (orderId.startsWith("BR-DEMO-")) return;

    let alive = true;

    // Simple REST polling — replaces the previous SSE stream because
    // Vercel routes requests to different Lambda instances and the
    // in-process EventEmitter never propagates updates across them.
    // Polling hits the DB directly on every tick so any admin/courier
    // change lands here within one interval.
    const fetchOnce = async () => {
      try {
        const q = token ? `?t=${encodeURIComponent(token)}` : "";
        const res = await fetch(`/api/orders/${orderId}${q}`, {
          cache: "no-store",
        });
        if (!alive) return;
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) return;
        const data = (await res.json()) as { order: PublicOrder };
        setOrder(data.order);
      } catch {
        /* transient network hiccup — next tick will retry */
      }
    };

    fetchOnce();
    const id = setInterval(fetchOnce, 3000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [orderId, token]);

  const isDemo = orderId.startsWith("BR-DEMO-");
  const step = isDemo ? mockStep : statusToStep(order?.status);
  const steps = themeConfig.tracking.steps;
  const currentIndex = Math.max(0, step - 1);
  const progress = step === 0 ? 0 : ((step - 1) / (steps.length - 1)) * 100;

  if (notFound) {
    return (
      <section className="container-app py-20 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tighter">
          Order not found
        </h1>
        <p className="mt-3 text-zinc-400">This order doesn't exist or has expired.</p>
      </section>
    );
  }

  return (
    <section className="container-app">
      <header className="mb-12 text-center md:mb-16">
        <span className="chip">
          Order #{orderId}
          {(isDemo || order?.paymentStatus === "paid") && (
            <span className="ml-2 text-emerald-400">payment confirmed</span>
          )}
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tighter md:text-6xl">
          {order?.status === "delivered" ? "Enjoy your meal." : "Thank you."}
        </h1>
        <p className="mx-auto mt-4 max-w-[52ch] text-zinc-400">
          Track your order in real time. Nothing to do — the page updates
          automatically.
        </p>
      </header>

      {/* ---------- SPINNING VINYL — tap to reveal order details ---------- */}
      {/* Only show when we have real line details (demo path has them; a  */}
      {/* Stripe order restored from persistence only has id + token).     */}
      {lastOrder && lastOrder.id === orderId && lastOrder.lines.length > 0 && (
        <div className="mb-20">
          <OrderVinyl order={lastOrder} />
        </div>
      )}

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-7 top-7 bottom-7 w-px bg-white/[0.06] md:left-1/2 md:right-1/2 md:top-7 md:h-px md:w-auto">
          <motion.div
            className="absolute inset-0 origin-top bg-accent md:origin-left"
            initial={false}
            animate={{ scaleY: progress / 100, scaleX: progress / 100 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <ol className="relative space-y-10 md:flex md:space-y-0">
          {steps.map((s) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Flame;
            const active = step >= s.id;
            const done = step > s.id || (step === s.id && order?.status === "delivered" && s.id === 3);
            return (
              <li
                key={s.id}
                className="flex items-start gap-5 md:flex-1 md:flex-col md:items-center md:text-center"
              >
                <motion.div
                  initial={false}
                  animate={
                    active
                      ? { scale: 1, backgroundColor: themeConfig.colors.accent }
                      : { scale: 0.95, backgroundColor: "rgba(255,255,255,0.04)" }
                  }
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/[0.08]"
                >
                  {done ? (
                    <Check size={20} weight="bold" className="text-zinc-950" />
                  ) : (
                    <Icon
                      size={22}
                      weight="duotone"
                      className={active ? "text-zinc-950" : "text-zinc-500"}
                    />
                  )}
                  {active && !done && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-accent/40"
                      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <div className="md:mt-5">
                  <div className="font-display text-lg font-semibold tracking-tight md:text-xl">
                    {s.title}
                  </div>
                  <div className="mt-1 max-w-[26ch] text-sm text-zinc-500">
                    {s.description}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <motion.div
        layout
        className="mx-auto mt-14 max-w-3xl rounded-3xl border border-white/[0.06] bg-surface p-6 md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="text-xs uppercase tracking-wider text-zinc-400">
            Live status
          </span>
        </div>
        <div className="mt-3 font-display text-2xl font-semibold tracking-tight">
          {steps[currentIndex]?.title ?? "Awaiting confirmation"}
        </div>
        <p className="mt-2 text-zinc-400">
          {steps[currentIndex]?.description ?? "We're confirming your payment."}
        </p>
      </motion.div>
    </section>
  );
}
