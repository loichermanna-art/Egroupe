"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Props = { locale: Locale; dict: Dictionary["nav"] };

const SECTION_IDS = ["about", "programs", "results", "bases", "events", "learning", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function Navbar({ locale, dict }: Props) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

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

  // Ombre légère une fois la page défilée
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section active (soulignement du lien correspondant)
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

  // Menu mobile : échappe + verrouillage du défilement
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const currentPath = pathname || home;

  return (
    <>
      {/* Barre utilitaire (desktop) */}
      <div className="hidden bg-red-dark text-white md:block">
        <div className="wrap flex h-9 items-center justify-between text-[0.8125rem]">
          <div className="flex items-center gap-6">
            <a href={`tel:+${site.phonePrimaryE164}`} className="inline-flex items-center gap-2 hover:text-gold-light">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              <span>
                {dict.phoneLabel} · {site.phonePrimary}
              </span>
            </a>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-gold-light"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              {dict.whatsapp}
            </a>
          </div>
          <LangSwitch locale={locale} currentPath={currentPath} label={dict.langLabel} />
        </div>
      </div>

      {/* Barre principale */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm transition-shadow duration-200",
          scrolled && "shadow-[0_10px_30px_-18px_rgba(27,21,23,0.35)]",
        )}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={home} className="flex shrink-0 items-center gap-3" aria-label={`${site.name} — ${dict.home}`}>
            <Image src="/images/brand/icon-512.png" alt="" width={40} height={38} priority className="h-10 w-auto" />
            <span className="font-serif text-[1.25rem] font-semibold leading-none tracking-tight text-ink">
              Excellence <span className="text-red">Group</span>
            </span>
          </Link>

          <nav className="hidden lg:block" aria-label={dict.menu}>
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`${home}#${l.id}`}
                    aria-current={active === l.id ? "true" : undefined}
                    className={cn(
                      "relative inline-flex h-[var(--header-h)] items-center px-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink",
                      "after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:bg-red after:opacity-0 after:transition-opacity",
                      active === l.id && "text-ink after:opacity-100",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={`${home}#contact`}
              className="hidden h-10 items-center rounded-[var(--radius-sm)] bg-red px-4 text-[0.9375rem] font-medium text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)] transition-colors hover:bg-red-dark md:inline-flex"
            >
              {dict.cta}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.close : dict.menu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-line text-ink hover:bg-cream lg:hidden"
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
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-line bg-white shadow-[0_24px_40px_-24px_rgba(27,21,23,0.35)] lg:hidden"
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <nav className="wrap py-3" aria-label={dict.menu}>
                <ul className="divide-y divide-line">
                  {links.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`${home}#${l.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between py-3.5 text-[1.0625rem] text-ink",
                          active === l.id && "font-medium text-red",
                        )}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
                  <Link
                    href={`${home}#contact`}
                    onClick={() => setOpen(false)}
                    className="inline-flex h-12 items-center justify-center rounded-[var(--radius-sm)] bg-red text-[0.9375rem] font-medium text-white hover:bg-red-dark"
                  >
                    {dict.cta}
                  </Link>
                  <div className="flex items-center justify-between text-[0.9375rem]">
                    <a href={`tel:+${site.phonePrimaryE164}`} className="inline-flex items-center gap-2 text-ink-2">
                      <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      {site.phonePrimary}
                    </a>
                    <LangSwitch locale={locale} currentPath={currentPath} label={dict.langLabel} onNavigate={() => setOpen(false)} dark={false} />
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function LangSwitch({
  locale,
  currentPath,
  label,
  onNavigate,
  dark = true,
}: {
  locale: Locale;
  currentPath: string;
  label: string;
  onNavigate?: () => void;
  dark?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1 text-[0.8125rem] font-medium uppercase tracking-wide" aria-label={label}>
      {(["fr", "en"] as const).map((l, i) => (
        <span key={l} className="inline-flex items-center">
          {i > 0 && <span className={cn("mx-1", dark ? "text-white/40" : "text-line-2")}>/</span>}
          <Link
            href={switchLocalePath(currentPath, l)}
            hrefLang={l}
            lang={l}
            onClick={onNavigate}
            aria-current={locale === l ? "true" : undefined}
            className={cn(
              "px-0.5 transition-colors",
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
