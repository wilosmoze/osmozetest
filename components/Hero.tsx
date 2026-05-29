"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";

export function Hero() {
  const { hero } = themeConfig;

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
              <a href="#burgers" className="btn-ghost">
                {hero.secondaryCta}
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950"
              >
                <img
                  src={themeConfig.brand.logoImage || "/images/hero-logo.png"}
                  alt={`${themeConfig.brand.name} — vinyl logo`}
                  className="h-full w-full object-contain"
                />

                {/* Delivery badge — bottom-right to avoid the logo's top arrow */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/70 px-3 py-1.5 text-xs backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                  <span className="font-mono tabular-nums">
                    {themeConfig.delivery.estimatedMinutes.min}–
                    {themeConfig.delivery.estimatedMinutes.max} min
                  </span>
                </motion.div>
              </motion.div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {hero.reassurances.map((r, i) => (
                  <motion.div
                    key={r.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.07 }}
                    className="rounded-2xl border border-white/[0.06] bg-surface/60 p-3 backdrop-blur-sm"
                  >
                    <div className="font-display text-base font-semibold tracking-tight">
                      {r.label}
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">
                      {r.sub}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
