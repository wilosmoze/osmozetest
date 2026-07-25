"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useT, useLocalize } from "@/lib/i18n";
import type { MenuItem } from "@/data/menu";
import { SauceIcon } from "./SauceIcons";

export function SaucesSection({ items }: { items: MenuItem[] }) {
  const t = useT();
  // Sort by price so the 20 ฿ tier groups above the 25 ฿ tier naturally.
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.price - b.price || a.name.localeCompare(b.name)),
    [items],
  );
  // Split into two columns (ceil for left) while preserving sort order.
  const half = Math.ceil(sorted.length / 2);
  const left = sorted.slice(0, half);
  const right = sorted.slice(half);

  return (
    <section id="sauces" className="py-20 md:py-28">
      <div className="container-app">
        <div className="mb-12 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="chip">{t("menu.sauces.eyebrow")}</span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[0.95] tracking-tighter md:text-6xl">
              {t("menu.sauces.title")}
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              {t("menu.sauces.subtitle")}
            </p>
          </div>
          <div className="hidden md:block">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {t("menu.creations", { n: items.length })}
            </span>
          </div>
        </div>

        <div
          className="mx-auto max-w-5xl rounded-3xl border border-white/[0.06] bg-surface/40 p-2 backdrop-blur-sm md:p-4"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
        >
          <div className="grid gap-x-4 md:grid-cols-2 md:gap-x-10">
            <ul className="divide-y divide-white/[0.05]">
              {left.map((sauce, i) => (
                <SauceRow key={sauce.id} item={sauce} index={i} />
              ))}
            </ul>
            <ul className="divide-y divide-white/[0.05] border-t border-white/[0.05] md:border-t-0">
              {right.map((sauce, i) => (
                <SauceRow key={sauce.id} item={sauce} index={half + i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SauceRow({ item, index }: { item: MenuItem; index: number }) {
  const localize = useLocalize();
  const t = useT();
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    add(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 5) * 0.03, duration: 0.35 }}
      className="flex items-center gap-3 px-3 py-4 md:gap-4 md:px-4 md:py-5"
    >
      {/* Vintage line-art icon echoing the menu photo */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-accent">
        <SauceIcon id={item.id} className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-base font-semibold text-white md:text-lg">
            {item.name}
          </span>
          {item.tag && (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
              {item.tag}
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
          {localize(item.description)}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5 md:gap-3">
        <div className="font-mono text-sm font-medium tabular-nums text-white">
          {formatPrice(item.price)}
        </div>
        <button
          onClick={handleAdd}
          disabled={justAdded}
          aria-label={`${t("menu.add")} ${item.name}`}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all active:translate-y-[1px] ${
            justAdded
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
              : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-accent hover:bg-accent hover:text-zinc-950"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                <Check size={14} weight="bold" />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                <Plus size={14} weight="bold" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.li>
  );
}
