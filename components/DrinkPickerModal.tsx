"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { menu, type MenuItem } from "@/data/menu";
import { useT } from "@/lib/i18n";

type Props = {
  open: boolean;
  burger: MenuItem | null;
  onSelect: (drink: MenuItem) => void;
  onClose: () => void;
};

export function DrinkPickerModal({ open, burger, onSelect, onClose }: Props) {
  const t = useT();
  const drinks = menu.filter((m) => m.category === "drink");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && burger && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-6">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-accent">
                  {burger.name} {t("menu.comboLabel")}
                </div>
                <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                  {t("drinkPicker.title")}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {t("drinkPicker.subtitle")}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label={t("common.close")}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/[0.08] active:translate-y-[1px]"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 md:p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
                {drinks.map((drink) => (
                  <button
                    key={drink.id}
                    onClick={() => onSelect(drink)}
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-accent/60 hover:bg-accent/[0.06] active:translate-y-[1px]"
                  >
                    <div className="relative flex h-24 w-full items-end justify-center overflow-hidden rounded-lg bg-gradient-to-b from-white via-sky-50 to-sky-100">
                      <img
                        src={drink.image}
                        alt={drink.name}
                        loading="lazy"
                        className="h-[92px] w-auto object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)]"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-display text-sm font-semibold text-white group-hover:text-accent">
                        {drink.name}
                      </div>
                      {drink.tag && (
                        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                          {drink.tag}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
