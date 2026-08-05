"use client";

import { InstagramLogo, ArrowUpRight } from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";
import { useT } from "@/lib/i18n";

export function SocialBlock({
  variant = "default",
}: {
  variant?: "default" | "post-purchase";
}) {
  const t = useT();
  const { instagram } = themeConfig.social;

  return (
    <section className="py-16 md:py-24">
      <div className="container-app">
        <a
          href={instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-surface via-surface to-zinc-950 p-8 md:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full opacity-40 transition-opacity group-hover:opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(201,163,92,0.4), transparent 70%)",
            }}
          />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <span className="chip">
                {variant === "post-purchase"
                  ? t("social.waiting")
                  : t("social.community")}
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-tighter md:text-5xl">
                {t("social.ctaTitle")}
              </h2>
              <p className="mt-5 max-w-[54ch] text-zinc-400">
                {t("social.ctaBody")}
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/40 px-5 py-3 transition-colors group-hover:border-accent/40 group-hover:bg-accent/[0.08]">
                <InstagramLogo size={20} weight="duotone" />
                <span className="font-mono text-sm">{instagram.handle}</span>
                <span className="ml-2 text-zinc-500 transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight size={16} weight="bold" />
                </span>
              </div>
            </div>

            <div className="md:col-span-5">
              {/* Preview of the actual Instagram/TikTok content — 6 tiles */}
              {/* in a 3×2 grid mimicking an IG profile grid. Mix of feed  */}
              {/* posts (1080×1080), Reel ending, and 3 mystery product    */}
              {/* photos (BBB stamp close-up, hands holding the bun, and   */}
              {/* the BBB circular logo teaser).                            */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { src: "/images/social/ig-sauces-wheel.png", alt: "Sauces wheel post" },
                  { src: "/images/social/ig-nine-mixers.png", alt: "Nine mixers post" },
                  { src: "/images/social/ig-bbb-stamp.jpg", alt: "BBB stamped bun close-up" },
                  { src: "/images/social/ig-hands-bun.jpg", alt: "Hands holding a sealed bun" },
                  { src: "/images/social/ig-bbb-logo.jpg", alt: "BBB circular logo teaser" },
                  { src: "/images/social/ig-bun-in-bass-on.png", alt: "Bun in. Bass on. reel" },
                ].map((post, i) => (
                  <div
                    key={post.src}
                    className="aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950"
                    style={{
                      transform: `translateY(${i % 2 === 0 ? "0" : "8px"})`,
                    }}
                  >
                    <img
                      src={post.src}
                      alt={post.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
