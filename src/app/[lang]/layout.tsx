import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "@fontsource-variable/outfit";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "../globals.css";

import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type Params = Promise<{ lang: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "fr";
  const dict = await getDictionary(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://excellencegroup.ci";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.title,
      template: `%s — ${site.name}`,
    },
    description: dict.meta.description,
    applicationName: site.name,
    keywords: [
      "Excellence Group",
      "E-Group",
      "cours de renforcement",
      "Abidjan",
      "BAC",
      "BEPC",
      "soutien scolaire",
      "Côte d'Ivoire",
      "EG Learning",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CI" : "en_GB",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/og-cover.jpg"],
    },
    icons: {
      icon: [
        { url: "/images/brand/favicon-64.png", sizes: "64x64", type: "image/png" },
        { url: "/images/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/images/brand/icon-512.png", sizes: "512x512" }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0506",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="grain" suppressHydrationWarning>
      <head>
        {/* Avant le premier rendu : masque l'intro si elle a déjà été vue dans la session */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(sessionStorage.getItem("eg-intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="done"}}catch(e){}',
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col">
        <SmoothScroll>
          <Preloader words={dict.preloader.words} since={dict.preloader.since} />
          <Cursor />
          <Navbar locale={lang} dict={dict.nav} />
          <main className="flex-1">{children}</main>
          <Footer locale={lang} dict={dict} />
        </SmoothScroll>
      </body>
    </html>
  );
}
