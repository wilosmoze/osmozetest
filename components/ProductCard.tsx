"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useT, useLocalize } from "@/lib/i18n";
import { isGrabOnly } from "@/lib/ordering";
import type { MenuItem } from "@/data/menu";
import { DrinkPickerModal } from "./DrinkPickerModal";

type Props = {
  item: MenuItem;
  index: number;
  variant?: "hero" | "compact";
};

type Feedback = null | "solo" | "menu";

export function ProductCard({ item, index, variant = "hero" }: Props) {
  const add = useCart((s) => s.add);
  const t = useT();
  const localize = useLocalize();
  const [justAdded, setJustAdded] = useState<Feedback>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const hasMenu = typeof item.menuPrice === "number";
  const grabOnly = isGrabOnly();

  const handleAddSolo = () => {
    add(item);
    setJustAdded("solo");
    setTimeout(() => setJustAdded(null), 1200);
  };

  const handleOpenPicker = () => {
    if (!hasMenu) return;
    setPickerOpen(true);
  };

  const handleDrinkSelected = (drink: MenuItem) => {
    // Add the set as its own cart line. The drink is baked into the
    // id + name so different drinks make different lines and the
    // kitchen ticket shows exactly which drink was picked.
    add({
      ...item,
      id: `${item.id}-set-${drink.id}`,
      name: `${item.name} ${t("menu.comboLabel")} + ${drink.name}`,
      price: item.menuPrice!,
    });
    setPickerOpen(false);
    setJustAdded("menu");
    setTimeout(() => setJustAdded(null), 1200);
  };

  return (
    <>
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
          {/* Prices are hidden entirely in grab_only mode — Grab shows */}
          {/* its own tariffs. In own_site the header price is only     */}
          {/* rendered for items without a Solo/Set toggle (fries etc). */}
          {!grabOnly && !hasMenu && (
            <span className="shrink-0 font-mono text-sm tabular-nums text-white">
              {formatPrice(item.price)}
            </span>
          )}
        </div>

        {variant === "hero" && (
          <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">
            {localize(item.description)}
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

        {grabOnly ? (
          // Grab-only mode: no per-card add buttons, no combo hint —
          // a single sticky floating bar (GrabFloatingBar) handles all
          // ordering site-wide and Grab shows its own tariffs/combos.
          null
        ) : hasMenu ? (
          <div className="mt-auto flex flex-col gap-2">
            <AddButton
              tone="solo"
              label={t("menu.solo")}
              price={item.price}
              added={justAdded === "solo"}
              onClick={handleAddSolo}
              addedLabel={t("menu.added")}
            />
            <AddButton
              tone="menu"
              label={t("menu.combo")}
              price={item.menuPrice!}
              added={justAdded === "menu"}
              onClick={handleOpenPicker}
              addedLabel={t("menu.added")}
            />
            <p className="text-[11px] text-zinc-500">
              <span className="text-accent">{t("menu.combo")}</span>{" "}
              · {t("menu.comboIncludes")}
            </p>
          </div>
        ) : (
          <AddButton
            tone="solo"
            price={item.price}
            added={justAdded === "solo"}
            onClick={handleAddSolo}
            addedLabel={t("menu.added")}
            addLabel={t("menu.add")}
            className="mt-auto"
          />
        )}
      </div>

    </motion.article>
    {hasMenu && !grabOnly && (
      <DrinkPickerModal
        open={pickerOpen}
        burger={item}
        onSelect={handleDrinkSelected}
        onClose={() => setPickerOpen(false)}
      />
    )}
    </>
  );
}

// Single add button used for both the solo and menu variants.
// tone="menu" gives it an accent-outlined look to promote the combo.
function AddButton({
  tone,
  label,
  price,
  added,
  onClick,
  addedLabel,
  addLabel,
  className = "",
}: {
  tone: "solo" | "menu";
  label?: string;
  price: number;
  added: boolean;
  onClick: () => void;
  addedLabel: string;
  addLabel?: string;
  className?: string;
}) {
  const isMenu = tone === "menu";
  return (
    <button
      onClick={onClick}
      disabled={added}
      className={`relative inline-flex items-center justify-between gap-3 overflow-hidden rounded-full px-4 py-3 text-sm font-medium transition-all active:translate-y-[1px] ${className} ${
        added
          ? "bg-emerald-500/20 text-emerald-400"
          : isMenu
            ? "border border-accent/50 bg-accent/[0.06] text-accent hover:bg-accent hover:text-zinc-950"
            : "bg-white/[0.04] text-white hover:bg-accent hover:text-zinc-950"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex w-full items-center justify-between"
          >
            <span>{addedLabel}</span>
            <Check size={16} weight="bold" />
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex w-full items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <Plus size={16} weight="bold" />
              <span>{label ?? addLabel}</span>
            </span>
            <span className="font-mono text-xs tabular-nums opacity-90">
              {formatPrice(price)}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
