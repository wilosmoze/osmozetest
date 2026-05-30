"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "@phosphor-icons/react";
import { useUI } from "@/lib/store";

export function MenuModal() {
  const open = useUI((s) => s.menuOpen);
  const close = useUI((s) => s.closeMenu);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-md md:p-12"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white"
          >
            {/* Close (X) */}
            <button
              onClick={close}
              aria-label="Close menu"
              className="absolute right-4 top-4 z-10 rounded-full border border-zinc-900/20 bg-white/90 p-2.5 text-zinc-900 backdrop-blur-md transition-colors hover:bg-white active:translate-y-[1px]"
            >
              <X size={18} weight="bold" />
            </button>

            {/* Menu image */}
            <img
              src="/images/menu.png"
              alt="bun&bass burgers — menu"
              className="block max-h-[70vh] w-full object-contain"
            />

            {/* Sticky bottom CTA — Order now */}
            <div className="border-t border-zinc-900/10 bg-zinc-50 p-4 md:p-5">
              <Link
                href="/#burgers"
                onClick={close}
                className="group flex w-full items-center justify-between gap-4 rounded-full bg-zinc-950 px-5 py-4 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:translate-y-[1px]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-zinc-950">
                    <ArrowRight size={14} weight="bold" />
                  </span>
                  <span>Order from this menu</span>
                </span>
                <span className="text-xs uppercase tracking-widest text-accent transition-transform group-hover:translate-x-0.5">
                  Go to burgers →
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
