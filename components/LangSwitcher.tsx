"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "@phosphor-icons/react";
import { useLocale, locales, localeMeta, type Locale } from "@/lib/i18n";

export function LangSwitcher() {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep <html lang="…"> in sync with the selected locale
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const pick = (l: Locale) => {
    setLocale(l);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:bg-white/[0.08]"
      >
        <Globe size={14} weight="duotone" />
        <span className="font-mono">{localeMeta[locale].code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 p-1 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
          >
            {locales.map((l) => {
              const active = l === locale;
              return (
                <button
                  key={l}
                  onClick={() => pick(l)}
                  role="menuitem"
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-zinc-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                      {localeMeta[l].code}
                    </span>
                    <span>{localeMeta[l].native}</span>
                  </span>
                  {active && <Check size={14} weight="bold" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
