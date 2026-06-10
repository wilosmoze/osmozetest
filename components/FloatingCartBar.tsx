"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function FloatingCartBar() {
  const t = useT();
  const count = useCart((s) => s.count());
  const subtotal = useCart((s) => s.subtotal());
  const drawerOpen = useCart((s) => s.drawerOpen);
  const openDrawer = useCart((s) => s.openDrawer);

  // Masqué quand panier vide OU drawer déjà ouvert
  const visible = count > 0 && !drawerOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-5 md:bottom-6 md:px-0 pointer-events-none"
        >
          <div className="container-app">
            <div className="flex justify-center md:justify-end">
              <button
                onClick={openDrawer}
                className="pointer-events-auto group relative inline-flex w-full max-w-md items-center justify-between gap-4 rounded-full border border-white/10 bg-accent px-5 py-4 text-zinc-950 shadow-[0_20px_60px_-15px_rgba(201,163,92,0.6)] transition-all hover:brightness-110 active:translate-y-[1px] md:w-auto md:min-w-[420px]"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 60px -15px rgba(201,163,92,0.45)" }}
              >
                {/* Left: count + bag */}
                <span className="flex items-center gap-3">
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/80 text-accent">
                    <ShoppingBag size={18} weight="duotone" />
                    <motion.span
                      key={count}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1 font-mono text-[10px] font-bold text-accent ring-2 ring-accent"
                    >
                      {count}
                    </motion.span>
                  </span>
                  <span className="text-sm font-medium">
                    {count === 1 ? t("bar.item") : t("bar.items", { n: count })}
                  </span>
                </span>

                {/* Right: total + CTA */}
                <span className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-zinc-950/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                    {t("bar.viewCart")}
                    <ArrowRight
                      size={12}
                      weight="bold"
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
