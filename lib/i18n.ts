"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, type Locale } from "@/lib/translations";

export type { Locale };

export const locales: Locale[] = ["en", "fr", "ru", "th"];

export const localeMeta: Record<
  Locale,
  { code: string; label: string; native: string }
> = {
  en: { code: "EN", label: "English", native: "English" },
  fr: { code: "FR", label: "French", native: "Français" },
  ru: { code: "RU", label: "Russian", native: "Русский" },
  th: { code: "TH", label: "Thai", native: "ไทย" },
};

// ---------- Zustand store ----------
type LocaleState = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (l) => set({ locale: l }),
    }),
    { name: "braise-locale" },
  ),
);

// ---------- t() — translation lookup with interpolation ----------
/**
 * Returns translated string for a key. Falls back to English, then key.
 * Supports `{var}` interpolation: t("cart.items", { n: 3 }) → "3 items"
 */
export function useT() {
  const locale = useLocale((s) => s.locale);
  return (key: string, params?: Record<string, string | number>): string => {
    const dict = translations[locale] ?? translations.en;
    const fallback = translations.en;
    let str = (dict as Record<string, string>)[key]
      ?? (fallback as Record<string, string>)[key]
      ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };
}

// ---------- Localized value helper ----------
/** Pick the right language out of a `string | LocalizedString` value. */
export type LocalizedString = string | Partial<Record<Locale, string>>;

export function pickLocale(
  value: LocalizedString | undefined,
  locale: Locale,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en ?? Object.values(value)[0] ?? "";
}

export function useLocalize() {
  const locale = useLocale((s) => s.locale);
  return (value: LocalizedString | undefined) => pickLocale(value, locale);
}
