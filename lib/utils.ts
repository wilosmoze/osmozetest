import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { themeConfig } from "@/config/theme.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat(themeConfig.payment.locale, {
    style: "currency",
    currency: themeConfig.payment.currency,
  }).format(n);
