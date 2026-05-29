"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";

type Props = {
  item: MenuItem;
  index: number;
  variant?: "hero" | "compact";
};

export function ProductCard({ item, index, variant = "hero" }: Props) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    add(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-surface transition-colors hover:border-white/[0.12]"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
    >
      <div
        className={`relative overflow-hidden ${variant === "hero" ? "aspect-[4/3]" : "aspect-square"}`}
      >
        <motion.img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        {item.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-950/70 px-2.5 py-1 text-[10px] uppercase tracking-wider text-accent backdrop-blur-md">
            {item.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">
            {item.name}
          </h3>
          <span className="shrink-0 font-mono text-sm tabular-nums text-white">
            {formatPrice(item.price)}
          </span>
        </div>

        {variant === "hero" && (
          <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">
            {item.description}
          </p>
        )}

        {variant === "hero" && item.ingredients && (
          <div className="flex flex-wrap gap-1.5">
            {item.ingredients.map((i) => (
              <span
                key={i}
                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] text-zinc-500"
              >
                {i}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={justAdded}
          className={`relative mt-auto inline-flex items-center justify-between gap-2 rounded-full px-4 py-3 text-sm font-medium transition-all active:translate-y-[1px] overflow-hidden ${
            justAdded
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-white/[0.04] hover:bg-accent hover:text-zinc-950"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex w-full items-center justify-between"
              >
                <span>Added to cart</span>
                <Check size={16} weight="bold" />
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex w-full items-center justify-between"
              >
                <span>Add</span>
                <Plus size={16} weight="bold" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.article>
  );
}
