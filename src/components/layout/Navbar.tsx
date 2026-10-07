"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";

type Props = { locale: Locale; dict: Dictionary["nav"] };

export function Navbar({ locale, dict }: Props) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 160 && !open);
  });

  // Ferme le menu mobile à la navigation / échappe
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const home = `/${locale}`;
  const links = [
    { href: `${home}#about`, label: dict.about },
    { href: `${home}#programs`, label: dict.programs },
    { href: `${home}#results`, label: dict.results },
    { href: `${home}#bases`, label: dict.bases },
    { href: `${home}#events`, label: dict.events },
    { href: `${home}#contact`, label: dict.contact },
  ];
  const otherLocale: Locale = locale === "fr" ? "en" : "fr";
  const otherPath = switchLocalePath(pathname || home, otherLocale);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80]"
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "mx-auto mt-3 flex items-center justify-between gap-4 transition-all duration-700 ease-out-expo",
            scrolled
              ? "glass w-[calc(100%-1.5rem)] max-w-[1180px] rounded-full px-4 py-2.5 sm:px-5"
              : "container-x py-4",
          )}
        >
          {/* Logo */}
          <Link href={home} className="flex items-center gap-3" aria-label={site.name} data-cursor>
            <Image
              src="/images/brand/icon-512.png"
              alt=""
              width={44}
              height={44}
              priority
              className={cn("transition-all duration-500", scrolled ? "h-9 w-9" : "h-11 w-11")}
            />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[1.05rem] font-semibold tracking-wide text-ivoire">Excellence</span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-or">Group</span>
            </span>
          </Link>

          {/* Liens desktop */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative px-3.5 py-2 text-[0.8rem] font-medium tracking-wide text-ivoire/80 transition-colors hover:text-ivoire"
              >
                {l.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-or transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={otherPath}
              hrefLang={otherLocale}
              aria-label={dict.langLabel}
              className="hidden rounded-full border border-ivoire/15 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivoire/80 transition hover:border-or hover:text-or sm:inline-flex"
            >
              {otherLocale}
            </Link>
            <a
              href={site.links.learningWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-[0.75rem] font-medium text-ivoire/70 transition hover:text-or md:inline-flex"
            >
              {dict.learning}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Magnetic strength={0.25}>
              <Link
                href={`${home}#contact`}
                className="hidden items-center rounded-full bg-gradient-to-r from-or-3 via-or to-or-2 px-5 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-noir shadow-[0_8px_30px_-10px_rgba(229,194,91,0.6)] transition hover:-translate-y-0.5 sm:inline-flex"
              >
                {dict.cta}
              </Link>
            </Magnetic>

            {/* Burger */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.close : dict.menu}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-ivoire/15 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-5 bg-ivoire transition-all duration-500 ease-out-expo",
                    open && "top-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1.5 h-px w-5 bg-ivoire transition-all duration-500 ease-out-expo",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-3 h-px w-5 bg-ivoire transition-all duration-500 ease-out-expo",
                    open && "top-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu mobile plein écran */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[75] flex flex-col bg-noir/95 pt-28 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, clipPath: "circle(0% at 92% 6%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 92% 6%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="container-x flex flex-1 flex-col gap-1" aria-label="Navigation mobile">
              {[{ href: home, label: dict.home }, ...links].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between border-b border-ivoire/10 py-4 font-display text-3xl text-ivoire transition hover:text-or"
                  >
                    {l.label}
                    <ArrowUpRight className="h-6 w-6 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="container-x flex items-center justify-between gap-4 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
                <Link href={switchLocalePath(pathname || home, "fr")} onClick={() => setOpen(false)} className={cn(locale === "fr" ? "text-or" : "text-ivoire/60")}>FR</Link>
                <span className="text-ivoire/30">/</span>
                <Link href={switchLocalePath(pathname || home, "en")} onClick={() => setOpen(false)} className={cn(locale === "en" ? "text-or" : "text-ivoire/60")}>EN</Link>
              </div>
              <Link
                href={`${home}#contact`}
                onClick={() => setOpen(false)}
                className="rounded-full bg-gradient-to-r from-or-3 via-or to-or-2 px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-noir"
              >
                {dict.cta}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
