"use client";

import { InstagramLogo, TiktokLogo } from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";
import { useT } from "@/lib/i18n";
import { isGrabOnly } from "@/lib/ordering";

export function Footer() {
  const t = useT();
  const { brand, social } = themeConfig;
  const grabOnly = isGrabOnly();
  return (
    <footer className="border-t border-white/[0.05] bg-surface/40 py-14">
      <div className="container-app">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-2xl font-bold tracking-tighter">
              {brand.name}
            </div>
            <p className="mt-3 max-w-[44ch] text-sm text-zinc-500">
              {brand.description}
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 p-2.5 transition-colors hover:bg-white/[0.05]"
              >
                <InstagramLogo size={18} weight="duotone" />
              </a>
              <a
                href={social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 p-2.5 transition-colors hover:bg-white/[0.05]"
              >
                <TiktokLogo size={18} weight="duotone" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              {t("footer.menu")}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/#burgers" className="hover:text-accent">{t("nav.burgers")}</a></li>
              <li><a href="/#sauces" className="hover:text-accent">{t("nav.sauces")}</a></li>
              <li><a href="/#fries" className="hover:text-accent">{t("nav.fries")}</a></li>
              <li><a href="/#drinks" className="hover:text-accent">{t("nav.drinks")}</a></li>
              {!grabOnly && (
                <li><a href="/#delivery" className="hover:text-accent">{t("nav.delivery")}</a></li>
              )}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              {t("footer.contact")}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {social.contactPhone && (
                <li className="font-mono">{social.contactPhone}</li>
              )}
              <li>
                <a
                  href={`mailto:${social.contactEmail}`}
                  className="hover:text-accent"
                >
                  {social.contactEmail}
                </a>
              </li>
              <li className="text-zinc-500">{t("deliv.cutoff")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.04] pt-6 text-xs text-zinc-600 md:flex-row md:items-center">
          <span>
            {t("footer.copyright", {
              year: new Date().getFullYear(),
              brand: brand.name,
            })}
          </span>
          <div className="flex items-center gap-4">
            <a href="/legal" className="transition-colors hover:text-accent">
              {t("footer.legalLink")}
            </a>
            <span className="text-zinc-800">·</span>
            <a href="/terms" className="transition-colors hover:text-accent">
              {t("footer.termsLink")}
            </a>
            <span className="text-zinc-800">·</span>
            <a href="/privacy" className="transition-colors hover:text-accent">
              {t("footer.privacyLink")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
