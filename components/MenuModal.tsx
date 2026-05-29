"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
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
            className="relative max-h-full w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white"
          >
            <img
              src="/images/menu.png"
              alt="bun&bass burgers — menu"
              className="block max-h-[85vh] w-full object-contain"
            />
            <button
              onClick={close}
              aria-label="Close menu"
              className="absolute right-4 top-4 rounded-full border border-zinc-900/20 bg-white/90 p-2.5 text-zinc-900 backdrop-blur-md transition-colors hover:bg-white active:translate-y-[1px]"
            >
              <X size={18} weight="bold" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
