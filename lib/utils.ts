import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { themeConfig } from "@/config/theme.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price.
 *  - THB → "590 ฿" (no decimals, space, symbol after — common Thai retail format)
 *  - Other → standard Intl currency format
 */
export const formatPrice = (n: number) => {
  if (themeConfig.payment.currency === "THB") {
    return `${Math.round(n).toLocaleString("en-US")} ${themeConfig.payment.currencySymbol}`;
  }
  return new Intl.NumberFormat(themeConfig.payment.locale, {
    style: "currency",
    currency: themeConfig.payment.currency,
  }).format(n);
};
