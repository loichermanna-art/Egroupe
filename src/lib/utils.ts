import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

export function formatNumber(value: number, locale: Locale, decimals = 0): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, locale: Locale, decimals = 2): string {
  const n = formatNumber(value, locale, decimals);
  return locale === "fr" ? `${n} %` : `${n}%`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
