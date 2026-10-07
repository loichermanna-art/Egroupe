import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
import "../globals.css";

import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";

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
  themeColor: "#8f0219",
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
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Marque la présence de JavaScript avant le premier rendu (les éléments animés restent visibles sans JS) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <SmoothScroll>
            <Preloader />
            <Cursor />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-red focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
            >
              {dict.nav.skip}
            </a>
            <Navbar locale={lang} dict={dict.nav} />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer locale={lang} dict={dict} />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
