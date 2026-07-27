"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";
import { useUI } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { isGrabOnly, grabUrl } from "@/lib/ordering";
import { SpinningVinyl } from "./SpinningVinyl";

export function Hero() {
  const t = useT();
  const openMenu = useUI((s) => s.openMenu);
  const grabOnly = isGrabOnly();
  // Brand mantra — kept untranslated across locales by design
  const headline = themeConfig.hero.headline;

  const reassurances = [
    { label: t("hero.reassure.30min.label"), sub: t("hero.reassure.30min.sub") },
    { label: t("hero.reassure.100.label"), sub: t("hero.reassure.100.sub") },
    { label: t("hero.reassure.free.label"), sub: t("hero.reassure.free.sub") },
  ];

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32"
    >
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(201,163,92,0.18), transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(201,163,92,0.06), transparent 60%)",
        }}
      />

      {/* Ambient brand imagery — real bun photos fading into the dark bg. */}
      {/* Positioned off the left/right edges + heavy radial mask so only  */}
      {/* the center of each bun peeks in, low opacity for atmosphere.     */}
      <motion.img
        src="/images/hero-bun-1.jpg"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 0.42, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -left-32 -top-16 -z-10 hidden h-[440px] w-[440px] rotate-[-8deg] object-cover blur-[1.5px] md:block lg:-left-40 lg:h-[540px] lg:w-[540px]"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 70%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 70%)",
          filter: "saturate(1.1) contrast(1.05) brightness(0.85)",
        }}
      />
      <motion.img
        src="/images/hero-bun-2.jpg"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 0.36, scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        className="pointer-events-none absolute -bottom-24 -right-28 -z-10 hidden h-[360px] w-[520px] rotate-[6deg] object-cover blur-[2px] md:block lg:-right-32 lg:h-[420px] lg:w-[620px]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 25%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 25%, transparent 70%)",
          filter: "saturate(1.05) contrast(1.05) brightness(0.9)",
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
              {t("hero.eyebrow")}
            </motion.span>

            <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tighter">
              {headline.map((line, i) => (
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
                  {i === headline.length - 1 ? (
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
              {t("hero.subline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              {grabOnly ? (
                <a
                  href={grabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  {t("hero.ctaGrab")}
                  <ArrowSquareOut size={18} weight="bold" />
                </a>
              ) : (
                <a href="#burgers" className="btn-primary">
                  {t("hero.cta")}
                  <ArrowRight size={18} weight="bold" />
                </a>
              )}
              <button onClick={openMenu} className="btn-ghost">
                {t("hero.secondaryCta")}
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
                {reassurances.map((r, i) => (
                  <div
                    key={r.label + i}
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
