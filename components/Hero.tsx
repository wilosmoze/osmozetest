"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";
import { useUI } from "@/lib/store";
import { SpinningVinyl } from "./SpinningVinyl";

export function Hero() {
  const { hero } = themeConfig;
  const openMenu = useUI((s) => s.openMenu);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32"
    >
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(224,113,44,0.18), transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(224,113,44,0.06), transparent 60%)",
        }}
      />

      <div className="container-app">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT — copy + CTAs */}
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="chip"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
              {hero.eyebrow}
            </motion.span>

            <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tighter">
              {hero.headline.map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1 + i * 0.08,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="block"
                >
                  {i === hero.headline.length - 1 ? (
                    <span className="italic text-accent">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 max-w-[58ch] text-base leading-relaxed text-zinc-400 md:text-lg"
            >
              {hero.subline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a href="#burgers" className="btn-primary">
                {hero.cta}
                <ArrowRight size={18} weight="bold" />
              </a>
              <button onClick={openMenu} className="btn-ghost">
                {hero.secondaryCta}
              </button>
            </motion.div>
          </div>

          {/* RIGHT — Spinning vinyl + reassurances */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col items-center gap-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <SpinningVinyl size="hero" onClick={openMenu} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid w-full grid-cols-3 gap-2"
              >
                {hero.reassurances.map((r, i) => (
                  <div
                    key={r.label}
                    className="rounded-2xl border border-white/[0.06] bg-surface/60 p-3 backdrop-blur-sm"
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <div className="font-display text-base font-semibold tracking-tight">
                      {r.label}
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">
                      {r.sub}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
