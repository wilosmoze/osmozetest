"use client";

import { motion } from "framer-motion";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { grabUrl } from "@/lib/ordering";
import { useT } from "@/lib/i18n";

/**
 * Sticky bottom bar rendered site-wide while ordering.mode === "grab_only".
 * Replaces the FloatingCartBar (which is hidden in this mode) so the user
 * always has a one-tap path to Grab Food, no matter where they are on the
 * page.
 */
export function GrabFloatingBar() {
  const t = useT();
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 220, damping: 26 }}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:bottom-6"
    >
      {/* Same-tab navigation — see Hero.tsx comment for the iOS deeplink */}
      {/* reason. Grab short-links only hand off to the installed app when  */}
      {/* the anchor navigates the current tab.                            */}
      <a
        href={grabUrl}
        className="pointer-events-auto group flex w-full max-w-md items-center justify-between gap-4 rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-zinc-950 shadow-[0_16px_60px_-12px_rgba(201,163,92,0.5)] transition-all hover:brightness-110 active:translate-y-[1px] md:py-4"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950/10">
            <ArrowSquareOut size={16} weight="bold" />
          </span>
          <span className="font-display font-semibold tracking-tight">
            {t("hero.ctaGrab")}
          </span>
        </span>
        <span className="hidden text-[10px] uppercase tracking-widest opacity-70 sm:inline">
          {t("gm.external")}
        </span>
      </a>
    </motion.div>
  );
}
