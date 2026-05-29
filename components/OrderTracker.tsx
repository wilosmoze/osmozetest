"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame, Package, Motorcycle, Check,
} from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";
import { useOrder } from "@/lib/store";

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

export function OrderTracker({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const mockStep = useOrder((s) => s.step);

  useEffect(() => {
    // Mode démo : pas de SSE, on utilise le store mock
    if (orderId.startsWith("BR-DEMO-")) {
      return;
    }

    const es = new EventSource(`/api/orders/stream?orderId=${orderId}`);
    es.addEventListener("snapshot", (e) => setOrder(JSON.parse((e as MessageEvent).data)));
    es.addEventListener("update", (e) => setOrder(JSON.parse((e as MessageEvent).data)));
    es.addEventListener("not_found", () => setNotFound(true));
    return () => es.close();
  }, [orderId]);

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
