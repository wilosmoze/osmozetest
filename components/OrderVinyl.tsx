"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, Receipt } from "@phosphor-icons/react";
import { formatPrice } from "@/lib/utils";
import { themeConfig } from "@/config/theme.config";
import type { OrderSnapshot } from "@/lib/store";

type Props = {
  order: OrderSnapshot;
};

export function OrderVinyl({ order }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center">
      {/* ---------- SPINNING VINYL ---------- */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide order details" : "Show order details"}
        className="group relative h-60 w-60 select-none md:h-72 md:w-72"
      >
        {/* Ember glow halo behind the disc */}
        <div
          aria-hidden
          className="absolute -inset-8 rounded-full opacity-60 transition-opacity group-hover:opacity-90"
          style={{
            background:
              "radial-gradient(circle, rgba(224,113,44,0.35), transparent 65%)",
          }}
        />

        {/* The vinyl disc itself — full circular logo, spinning continuously */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative h-full w-full overflow-hidden rounded-full border border-white/[0.08] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        >
          <img
            src={themeConfig.brand.logoImage || "/images/hero-logo.png"}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 35%" }}
          />

          {/* Subtle concentric groove rings on top of the image */}
          <div className="pointer-events-none absolute inset-3 rounded-full border border-white/[0.04]" />
          <div className="pointer-events-none absolute inset-6 rounded-full border border-white/[0.03]" />
          <div className="pointer-events-none absolute inset-10 rounded-full border border-white/[0.03]" />

          {/* Center spindle hole */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 ring-2 ring-white/10" />
        </motion.div>

        {/* Tonearm indicator (subtle, top-right) */}
        <div className="pointer-events-none absolute -top-2 right-4 h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_rgba(224,113,44,0.8)]" />
      </button>

      {/* Hint label below the vinyl */}
      <motion.div
        animate={{ opacity: open ? 0.4 : 1 }}
        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-400"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
        {open ? "Now playing — close to resume" : "Tap to view your order"}
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
      </motion.div>

      {/* ---------- ORDER DETAILS PANEL (slides down on click) ---------- */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            className="mt-8 w-full overflow-hidden"
          >
            <div className="rounded-3xl border border-white/[0.08] bg-surface/70 p-6 backdrop-blur-xl md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">
                  <Receipt size={14} weight="duotone" />
                  Side B — Track listing
                </div>
                <div className="font-mono text-xs tabular-nums text-zinc-500">
                  #{order.id}
                </div>
              </div>

              {/* Lines */}
              <ul className="mt-5 space-y-3">
                {order.lines.map((l, i) => (
                  <motion.li
                    key={l.itemId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] font-mono text-[10px] tabular-nums text-zinc-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="text-sm">{l.name}</div>
                        <div className="font-mono text-xs text-zinc-500">
                          × {l.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-sm tabular-nums">
                      {formatPrice(l.price * l.quantity)}
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* Totals */}
              <div className="mt-6 space-y-1.5 border-t border-white/[0.06] pt-5">
                <Row label="Subtotal" value={formatPrice(order.subtotal)} />
                <Row
                  label="Delivery"
                  value={
                    order.deliveryFee === 0
                      ? "Free"
                      : formatPrice(order.deliveryFee)
                  }
                  highlight={order.deliveryFee === 0}
                />
                <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-3 font-display text-lg font-semibold">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Close hint */}
              <button
                onClick={() => setOpen(false)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] py-3 text-xs uppercase tracking-wider text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <CaretDown size={14} weight="bold" />
                Resume spinning
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm text-zinc-400">
      <span>{label}</span>
      <span
        className={`font-mono tabular-nums ${highlight ? "text-accent" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}
