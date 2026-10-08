import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  const languages = Object.fromEntries([
    ...locales.map((locale) => [locale, `${base}/${locale}`]),
    ["x-default", `${base}/fr`],
  ]);

  return locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "fr" ? 1 : 0.8,
    alternates: { languages },
  }));
}
