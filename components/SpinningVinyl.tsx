"use client";

import { motion } from "framer-motion";
import { themeConfig } from "@/config/theme.config";

type Size = "sm" | "md" | "lg" | "hero";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-40 w-40",
  md: "h-60 w-60 md:h-72 md:w-72",
  lg: "h-72 w-72 md:h-80 md:w-80",
  hero: "h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-[420px] lg:w-[420px]",
};

type Props = {
  size?: Size;
  onClick?: () => void;
  spinning?: boolean;
  /** seconds per full revolution */
  speed?: number;
  className?: string;
};

export function SpinningVinyl({
  size = "md",
  onClick,
  spinning = true,
  speed = 9,
  className = "",
}: Props) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      aria-label={onClick ? "Open menu" : undefined}
      className={`group relative select-none ${SIZE_CLASSES[size]} ${className}`}
    >
      {/* Halo ember derrière le disque */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgba(224,113,44,0.35), transparent 65%)",
        }}
      />

      {/* Le disque qui tourne */}
      <motion.div
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={
          spinning
            ? { duration: speed, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
        className="relative h-full w-full overflow-hidden rounded-full border border-white/[0.08] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        <img
          src={themeConfig.brand.logoImage || "/images/hero-logo.png"}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 35%" }}
        />

        {/* Groove rings */}
        <div className="pointer-events-none absolute inset-3 rounded-full border border-white/[0.04]" />
        <div className="pointer-events-none absolute inset-6 rounded-full border border-white/[0.03]" />
        <div className="pointer-events-none absolute inset-10 rounded-full border border-white/[0.03]" />

        {/* Spindle hole */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 ring-2 ring-white/10" />
      </motion.div>

      {/* Tonearm indicator (ember dot) */}
      <div className="pointer-events-none absolute -top-2 right-4 h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_rgba(224,113,44,0.8)]" />
    </Tag>
  );
}
