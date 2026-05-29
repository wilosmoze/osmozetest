"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { themeConfig } from "@/config/theme.config";
import { cn } from "@/lib/utils";

export function Header() {
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.openDrawer);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="container-app">
        <div
          className={cn(
            "flex items-center justify-between rounded-full border px-5 py-3 backdrop-blur-xl transition-all",
            scrolled
              ? "border-white/[0.08] bg-zinc-950/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
              : "border-white/[0.04] bg-zinc-950/30",
          )}
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
        >
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-white"
          >
            {themeConfig.brand.name}
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: "Burgers", href: "#burgers" },
              { label: "Sauces", href: "#sauces" },
              { label: "Desserts", href: "#desserts" },
              { label: "Livraison", href: "#delivery" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            onClick={open}
            className="group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm transition-all hover:bg-white/[0.08] active:translate-y-[1px]"
          >
            <ShoppingBag size={18} weight="duotone" />
            <span className="font-mono text-xs tabular-nums">{count}</span>
            {count > 0 && (
              <motion.span
                layoutId="cart-pulse"
                className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
