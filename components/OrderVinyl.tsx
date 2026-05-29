"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, Receipt } from "@phosphor-icons/react";
import { formatPrice } from "@/lib/utils";
import type { OrderSnapshot } from "@/lib/store";
import { SpinningVinyl } from "./SpinningVinyl";

type Props = {
  order: OrderSnapshot;
};

export function OrderVinyl({ order }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center">
      {/* ---------- SPINNING VINYL ---------- */}
      <SpinningVinyl
        size="md"
        onClick={() => setOpen((v) => !v)}
        spinning
      />

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
