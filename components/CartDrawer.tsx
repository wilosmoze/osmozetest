"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X,
  Minus,
  Plus,
  Trash,
  ArrowRight,
} from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { themeConfig } from "@/config/theme.config";

export function CartDrawer() {
  const router = useRouter();
  const { lines, drawerOpen, closeDrawer, setQty, remove, subtotal, deliveryFee, total } =
    useCart();

  const sub = subtotal();
  const fee = deliveryFee();
  const sum = total();
  const empty = lines.length === 0;
  const remaining = Math.max(0, themeConfig.delivery.freeAbove - sub);
  const progress = Math.min(100, (sub / themeConfig.delivery.freeAbove) * 100);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-white/[0.06] bg-bg"
            style={{ boxShadow: "inset 1px 0 0 rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <div className="font-display text-lg font-semibold tracking-tight">
                  Your order
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {lines.length} item{lines.length > 1 ? "s" : ""}
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="rounded-full border border-white/10 p-2 hover:bg-white/[0.05]"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {!empty && remaining > 0 && (
              <div className="border-b border-white/[0.06] px-6 py-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Free delivery</span>
                  <span className="font-mono tabular-nums">
                    +{formatPrice(remaining)}
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {empty ? (
                <EmptyCart onContinue={closeDrawer} />
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 26,
                        }}
                        className="flex gap-4 px-6 py-5"
                      >
                        <img
                          src={l.item.image}
                          alt={l.item.name}
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium leading-tight">
                                {l.item.name}
                              </div>
                              <div className="mt-1 font-mono text-xs tabular-nums text-zinc-500">
                                {formatPrice(l.item.price)}
                              </div>
                            </div>
                            <button
                              onClick={() => remove(l.item.id)}
                              className="text-zinc-500 transition-colors hover:text-red-400"
                              aria-label="Remove"
                            >
                              <Trash size={16} weight="duotone" />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center rounded-full border border-white/10">
                              <button
                                onClick={() => setQty(l.item.id, l.quantity - 1)}
                                className="px-3 py-1.5 text-zinc-400 hover:text-white active:translate-y-[1px]"
                              >
                                <Minus size={12} weight="bold" />
                              </button>
                              <span className="w-7 text-center font-mono text-xs tabular-nums">
                                {l.quantity}
                              </span>
                              <button
                                onClick={() => setQty(l.item.id, l.quantity + 1)}
                                className="px-3 py-1.5 text-zinc-400 hover:text-white active:translate-y-[1px]"
                              >
                                <Plus size={12} weight="bold" />
                              </button>
                            </div>
                            <div className="font-mono text-sm tabular-nums">
                              {formatPrice(l.item.price * l.quantity)}
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {!empty && (
              <div className="border-t border-white/[0.06] px-6 py-5">
                <Row label="Subtotal" value={formatPrice(sub)} />
                <Row
                  label="Delivery"
                  value={fee === 0 ? "Free" : formatPrice(fee)}
                  emphasized={fee === 0}
                />
                <div className="my-3 h-px bg-white/[0.06]" />
                <Row label="Total" value={formatPrice(sum)} bold />
                <button
                  onClick={() => {
                    closeDrawer();
                    router.push("/checkout");
                  }}
                  className="mt-5 flex w-full items-center justify-between rounded-full bg-accent px-5 py-4 text-sm font-medium text-zinc-950 transition-all hover:brightness-110 active:translate-y-[1px]"
                >
                  <span>Validate order</span>
                  <ArrowRight size={18} weight="bold" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  value,
  bold,
  emphasized,
}: {
  label: string;
  value: string;
  bold?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1 ${
        bold ? "font-display text-lg font-semibold" : "text-sm text-zinc-400"
      }`}
    >
      <span>{label}</span>
      <span
        className={`font-mono tabular-nums ${emphasized ? "text-accent" : ""} ${bold ? "text-white" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyCart({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="h-16 w-16 rounded-full border border-white/[0.06] bg-white/[0.02]" />
      <div className="mt-6 font-display text-xl font-semibold tracking-tight">
        Empty cart
      </div>
      <p className="mt-2 max-w-[28ch] text-sm text-zinc-500">
        Your burgers are waiting on the menu.
      </p>
      <button onClick={onContinue} className="btn-ghost mt-6">
        Browse the menu
      </button>
    </div>
  );
}
