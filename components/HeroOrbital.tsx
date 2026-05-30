"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { themeConfig } from "@/config/theme.config";
import { journeyTimeline } from "@/data/journey";

export function HeroOrbital() {
  const { hero } = themeConfig;

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,163,92,0.15), transparent 60%)",
        }}
      />

      <div className="relative">
        <RadialOrbitalTimeline timelineData={journeyTimeline} />

        <div className="pointer-events-none absolute inset-x-0 top-28 z-20 px-5 md:top-32 md:px-8">
          <div className="container-app">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="chip pointer-events-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                {hero.eyebrow}
              </span>

              <h1 className="mt-5 font-display text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-tighter">
                From the flame{" "}
                <span className="italic text-accent">to your door.</span>
              </h1>

              <p className="mt-5 max-w-[44ch] text-sm text-zinc-400 md:text-base">
                Click on each step to explore our process — from beef sourcing
                to piping-hot delivery.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-12 z-20 px-5 md:bottom-16 md:px-8">
          <div className="container-app">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="pointer-events-auto flex flex-wrap items-center gap-3"
            >
              <a href="#burgers" className="btn-primary">
                {hero.cta}
                <ArrowRight size={16} strokeWidth={2.4} />
              </a>
              <a href="#delivery" className="btn-ghost">
                See delivery zones
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
