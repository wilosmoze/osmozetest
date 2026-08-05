"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ArrowSquareOut } from "@phosphor-icons/react";
import { useUI } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { isGrabOnly, grabUrl } from "@/lib/ordering";

export function MenuModal() {
  const t = useT();
  const open = useUI((s) => s.menuOpen);
  const close = useUI((s) => s.closeMenu);
  const grabOnly = isGrabOnly();

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
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
          className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md"
        >
          {/* Floating close button (top-right) */}
          <button
            onClick={close}
            aria-label={t("menumodal.close")}
            className="fixed right-3 top-3 z-30 rounded-full border border-white/10 bg-zinc-900/80 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/10 active:translate-y-[1px] md:right-6 md:top-6"
          >
            <X size={20} weight="bold" />
          </button>

          {/* Menu image fills viewport minus top/bottom padding for controls */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full items-center justify-center px-3 pb-40 pt-16 md:px-8 md:pb-32 md:pt-14"
          >
            <img
              src="/images/menu.png"
              alt="bun&bass burgers — menu"
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Bottom control bar — quick-nav pills + main order CTA */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-zinc-950/90 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-4 md:py-5">
              {/* Quick-nav pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <QuickLink href="/#burgers" onClick={close}>
                  {t("nav.burgers")}
                </QuickLink>
                <QuickLink href="/#sauces" onClick={close}>
                  {t("nav.sauces")}
                </QuickLink>
                <QuickLink href="/#fries" onClick={close}>
                  {t("nav.fries")}
                </QuickLink>
                <QuickLink href="/#drinks" onClick={close}>
                  {t("nav.drinks")}
                </QuickLink>
              </div>

              {/* Main order CTA — Grab in grab_only mode, in-site otherwise */}
              {grabOnly ? (
                // Same-tab: see Hero.tsx / GrabFloatingBar comments.
                <a
                  href={grabUrl}
                  className="group flex w-full items-center justify-between gap-4 rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-zinc-950 transition-all hover:brightness-110 active:translate-y-[1px]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950/10">
                      <ArrowSquareOut size={14} weight="bold" />
                    </span>
                    <span>{t("hero.ctaGrab")}</span>
                  </span>
                  <span className="hidden text-[10px] uppercase tracking-widest opacity-70 sm:inline">
                    {t("gm.external")}
                  </span>
                </a>
              ) : (
                <Link
                  href="/#burgers"
                  onClick={close}
                  className="group flex w-full items-center justify-between gap-4 rounded-full bg-white px-5 py-3.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-100 active:translate-y-[1px]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-zinc-950">
                      <ArrowRight size={14} weight="bold" />
                    </span>
                    <span>{t("menumodal.order")}</span>
                  </span>
                  <span className="hidden text-xs uppercase tracking-widest text-accent transition-transform group-hover:translate-x-0.5 sm:inline">
                    {t("menumodal.goto")}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs uppercase tracking-wider text-zinc-300 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:translate-y-[1px]"
    >
      {children}
    </Link>
  );
}
