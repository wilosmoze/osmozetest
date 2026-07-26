"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Motorcycle, ArrowRight } from "@phosphor-icons/react";
import { useOrder } from "@/lib/store";
import { useT } from "@/lib/i18n";

// Small pill shown in the header when the customer has an active
// order — clicking it takes them back to the tracker even if they
// closed the tracker tab. Auto-vanishes once the SSE hook in
// OrderTracker calls useOrder.reset() on delivered/cancelled.
export function TrackOrderChip() {
  const lastOrder = useOrder((s) => s.lastOrder);
  const t = useT();

  if (!lastOrder || !lastOrder.trackingToken) return null;

  const href = `/tracking/${lastOrder.id}?t=${lastOrder.trackingToken}`;
  const shortId = lastOrder.id.replace(/^BR-/, "");

  return (
    <AnimatePresence>
      <motion.div
        key={lastOrder.id}
        initial={{ opacity: 0, y: -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      >
        <Link
          href={href}
          className="group inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/[0.08] px-3 py-1.5 text-xs font-medium text-accent transition-all hover:border-accent/70 hover:bg-accent/15 active:translate-y-[1px]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <Motorcycle size={14} weight="duotone" />
          <span className="hidden sm:inline">{t("track.chip")}</span>
          <span className="font-mono uppercase tracking-wider opacity-80">
            #{shortId.slice(0, 6)}
          </span>
          <ArrowRight
            size={12}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
