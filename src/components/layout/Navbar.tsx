"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, Phone } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { EASE_OUT, useMotionContext } from "@/components/motion/MotionProvider";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type Props = { locale: Locale; dict: Dictionary["nav"] };

const SECTION_IDS = ["about", "programs", "results", "bases", "events", "learning", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function Navbar({ locale, dict }: Props) {
  const pathname = usePathname();
  const { reduced, introDone } = useMotionContext();
  const { lock, unlock } = useSmoothScroll();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  const home = `/${locale}`;
  const links: { id: SectionId; label: string }[] = [
    { id: "about", label: dict.about },
    { id: "programs", label: dict.programs },
    { id: "results", label: dict.results },
    { id: "bases", label: dict.bases },
    { id: "events", label: dict.events },
    { id: "learning", label: dict.learning },
    { id: "contact", label: dict.contact },
  ];

  // En-tête qui s'efface quand on descend, revient dès qu'on remonte
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - lastY.current;
    lastY.current = y;
    setScrolled(y > 8);
    if (open || reduced) return;
    if (y < 120) setHidden(false);
    else if (diff > 4) setHidden(true);
    else if (diff < -4) setHidden(false);
  });

  // Section visible → lien souligné
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  // Menu mobile : touche Échap + verrouillage du défilement
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    lock();
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [open, lock, unlock]);

  const currentPath = pathname || home;

  return (
    <>
      {/* Barre utilitaire (à partir de md) */}
      <div className="hidden bg-red-dark text-white md:block">
        <div className="wrap flex h-9 items-center justify-between text-[0.8125rem]">
          <div className="flex items-center gap-6">
            <a href={`tel:+${site.phonePrimaryE164}`} className="inline-flex items-center gap-2 transition-colors hover:text-gold-light">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              <span>
                {dict.phoneLabel} · {site.phonePrimary}
              </span>
            </a>
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-gold-light">
              <WhatsAppIcon className="h-3.5 w-3.5" />
              {dict.whatsapp}
            </a>
          </div>
          <LangSwitch locale={locale} currentPath={currentPath} label={dict.langLabel} />
        </div>
      </div>

      {/* Barre principale */}
      <motion.header
        className={cn(
          "sticky top-0 z-50 border-b border-line bg-white transition-shadow duration-300",
          scrolled && !hidden && "shadow-[0_12px_32px_-20px_rgba(27,21,23,0.35)]",
        )}
        data-motion=""
        initial={false}
        animate={{ y: hidden ? "-100%" : 0, opacity: introDone || reduced ? 1 : 0 }}
        transition={{ y: { duration: 0.45, ease: EASE_OUT }, opacity: { duration: 0.6 } }}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={home} className="flex shrink-0 items-center gap-3" aria-label={`${site.name} — ${dict.home}`}>
            <Image src="/images/brand/icon-512.png" alt="" width={40} height={38} priority className="h-10 w-auto" />
            <span className="font-serif text-[1.1875rem] font-semibold leading-none tracking-tight text-ink">{site.name}</span>
          </Link>

          <nav className="hidden lg:block" aria-label={dict.menu}>
            <ul className="flex items-center">
              {links.map((l) => (
                <li key={l.id} className="relative">
                  <Link
                    href={`${home}#${l.id}`}
                    aria-current={active === l.id ? "true" : undefined}
                    className={cn(
                      "relative inline-flex h-[var(--header-h)] items-center px-3 text-[0.9375rem] text-ink-2 transition-colors duration-300 hover:text-ink",
                      active === l.id && "text-ink",
                    )}
                  >
                    {l.label}
                  </Link>
                  {/* Soulignement qui glisse d'un lien à l'autre */}
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 bottom-0 h-[2px] bg-red"
                      transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile : langue et téléphone visibles sans ouvrir le menu */}
            <div className="md:hidden">
              <LangSwitch locale={locale} currentPath={currentPath} label={dict.langLabel} dark={false} />
            </div>
            <a
              href={`tel:+${site.phonePrimaryE164}`}
              aria-label={`${dict.phoneLabel} · ${site.phonePrimary}`}
              className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:bg-cream md:hidden"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>

            <Link
              href={`${home}#contact`}
              className="relative isolate hidden h-10 items-center overflow-hidden bg-red px-4 text-[0.9375rem] font-medium text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)] before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-red-deep before:transition-transform before:duration-[420ms] before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:scale-y-100 md:inline-flex"
            >
              {dict.cta}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.close : dict.menu}
              className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:bg-cream lg:hidden"
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {/* Panneau mobile */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-line bg-white lg:hidden"
              data-lenis-prevent
              initial={reduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <nav className="wrap py-2" aria-label={dict.menu}>
                <motion.ul
                  className="divide-y divide-line"
                  initial={reduced ? false : "hidden"}
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
                >
                  {links.map((l) => (
                    <motion.li key={l.id} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } } }}>
                      <Link
                        href={`${home}#${l.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={active === l.id ? "true" : undefined}
                        className={cn(
                          "flex items-center justify-between py-3.5 text-[1.0625rem] text-ink",
                          active === l.id && "font-medium text-red",
                        )}
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  className="mt-3 flex flex-col gap-3 border-t border-line pb-4 pt-4"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <Link
                    href={`${home}#contact`}
                    onClick={() => setOpen(false)}
                    className="inline-flex h-12 items-center justify-center bg-red text-[0.9375rem] font-medium text-white transition-colors hover:bg-red-dark"
                  >
                    {dict.cta}
                  </Link>
                  <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-2">
                    <WhatsAppIcon className="h-4 w-4" />
                    {dict.whatsapp} · {site.phonePrimary}
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function LangSwitch({
  locale,
  currentPath,
  label,
  dark = true,
}: {
  locale: Locale;
  currentPath: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="inline-flex items-center text-[0.8125rem] font-medium uppercase" aria-label={label}>
      {(["fr", "en"] as const).map((l, i) => (
        <span key={l} className="inline-flex items-center">
          {i > 0 && <span className={cn("mx-1", dark ? "text-white/40" : "text-line-2")}>/</span>}
          <Link
            href={switchLocalePath(currentPath, l)}
            hrefLang={l}
            lang={l}
            aria-current={locale === l ? "true" : undefined}
            className={cn(
              "px-1 py-2 transition-colors",
              dark
                ? locale === l
                  ? "text-white underline decoration-gold-light underline-offset-4"
                  : "text-white/70 hover:text-white"
                : locale === l
                  ? "text-ink underline decoration-red underline-offset-4"
                  : "text-ink-3 hover:text-ink",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
