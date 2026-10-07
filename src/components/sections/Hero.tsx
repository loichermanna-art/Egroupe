"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "motion/react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { useIntroDone } from "@/lib/intro";
import { Button } from "@/components/ui/Button";
import { SplitWords } from "@/components/ui/Reveal";

type Props = { locale: Locale; dict: Dictionary["hero"] };

const EASE = [0.16, 1, 0.3, 1] as const;

const fade = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, delay, ease: EASE } },
});

export function Hero({ locale, dict }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const introDone = useIntroDone();
  const state = introDone ? "visible" : "hidden";

  // Parallaxe au défilement (le visuel monte plus lentement que le texte)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-noir pt-[calc(var(--header-h)+1rem)]"
    >
      {/* ---- Fond : soie rouge + dégradés + lignes ---- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/brand/red-silk-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={60}
          className="object-cover opacity-[0.28] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_20%,rgba(143,2,25,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/55 to-noir" />
        <div className="grid-lines absolute inset-0 opacity-70 mask-fade-b" />
        <div className="halo absolute -right-[10vw] top-[10vh] h-[70vmin] w-[70vmin] rounded-full" />
      </div>

      <div className="container-x relative grid flex-1 grid-cols-1 items-center gap-12 pb-24 lg:grid-cols-12 lg:gap-6">
        {/* ---- Texte ---- */}
        <motion.div style={{ y: yText, opacity }} className="relative z-10 lg:col-span-7">
          <motion.p
            className="eyebrow flex items-center gap-4"
            variants={fade(0.15)}
            initial="hidden"
            animate={state}
          >
            <span className="inline-block h-px w-10 bg-or/80" aria-hidden />
            {dict.eyebrow}
          </motion.p>

          <h1 className="display-1 mt-7 max-w-[13ch] text-ivoire">
            {introDone && (
              <>
                <SplitWords text={dict.titleA} immediate delay={0.25} stagger={0.06} />{" "}
                <SplitWords
                  text={dict.titleEm}
                  immediate
                  delay={0.4}
                  stagger={0.06}
                  className="font-display italic font-normal"
                  wordClassName="text-gold pr-[0.08em]"
                />{" "}
                <SplitWords text={dict.titleB} immediate delay={0.55} stagger={0.045} />
              </>
            )}
            {!introDone && <span className="opacity-0">{`${dict.titleA} ${dict.titleEm} ${dict.titleB}`}</span>}
          </h1>

          <motion.p
            className="lead mt-8 max-w-[52ch]"
            variants={fade(0.95)}
            initial="hidden"
            animate={state}
          >
            {dict.lead}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            variants={fade(1.15)}
            initial="hidden"
            animate={state}
          >
            <Button href={site.whatsappUrl} external variant="gold" data-cursor-label="WhatsApp">
              {dict.ctaPrimary}
            </Button>
            <Button href={`/${locale}#results`} variant="outline" icon={false}>
              {dict.ctaSecondary}
            </Button>
          </motion.div>

          {/* Badges chiffres clés */}
          <motion.ul
            className="mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-ivoire/10 pt-8"
            variants={fade(1.35)}
            initial="hidden"
            animate={state}
          >
            {dict.badges.map((b) => (
              <li key={b.label} className="flex flex-col">
                <span className="font-display text-3xl font-medium text-ivoire md:text-4xl">{b.value}</span>
                <span className="mt-1 text-[0.72rem] uppercase tracking-[0.22em] text-muted">{b.label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ---- Visuel ---- */}
        <motion.div
          style={{ y: yVisual }}
          className="relative mx-auto flex w-full max-w-[520px] items-end justify-center lg:col-span-5 lg:max-w-none"
        >
          <motion.div
            className="relative aspect-[3/4] w-[min(78vw,440px)] lg:w-[min(32vw,480px)]"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={introDone ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
          >
            {/* Anneau conique doré tournant */}
            <motion.div
              aria-hidden
              style={{ rotate: ringRotate }}
              className="absolute left-1/2 top-[46%] h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full [background:conic-gradient(from_0deg,rgba(229,194,91,0)_0%,rgba(229,194,91,0.9)_18%,rgba(229,194,91,0)_38%,rgba(229,194,91,0.35)_62%,rgba(229,194,91,0)_80%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1.5px),#000_calc(100%-1.5px))]"
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-[46%] h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-or/15"
            />
            {/* Disque sombre */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[46%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,#2a0b12,#0a0506_70%)] shadow-[0_40px_120px_-30px_rgba(178,6,3,0.55)]"
            />
            {/* Lauréate */}
            <motion.div
              className="absolute inset-x-0 bottom-0 top-[4%]"
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/illustrations/graduate-red-gown.png"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 32vw, 78vw"
                className="object-contain object-bottom drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
            {/* Lauriers */}
            <Image
              src="/images/brand/laurel-gold.png"
              alt=""
              width={483}
              height={378}
              className="pointer-events-none absolute -bottom-6 left-1/2 w-[82%] -translate-x-1/2 opacity-90"
            />

            {/* Cartes flottantes */}
            <motion.div
              className="glass absolute -left-4 top-[18%] rounded-2xl px-4 py-3 sm:-left-10"
              initial={{ opacity: 0, x: -24 }}
              animate={introDone ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 1.5, ease: EASE }}
            >
              <motion.div animate={reduced ? undefined : { y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                <p className="font-display text-2xl text-or">{dict.badges[0].value}</p>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">{dict.badges[0].label}</p>
              </motion.div>
            </motion.div>
            <motion.div
              className="glass absolute -right-2 top-[58%] rounded-2xl px-4 py-3 sm:-right-8"
              initial={{ opacity: 0, x: 24 }}
              animate={introDone ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 1.7, ease: EASE }}
            >
              <motion.div animate={reduced ? undefined : { y: [0, -8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
                <p className="font-display text-2xl text-ivoire">{dict.badges[1].value}</p>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">{dict.badges[1].label}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ---- Bas : tagline + indicateur de scroll ---- */}
      <motion.div
        className="container-x relative flex items-center justify-between pb-8"
        variants={fade(1.8)}
        initial="hidden"
        animate={state}
      >
        <p className="font-display text-sm italic text-muted sm:text-base">« {dict.tagline} »</p>
        <a href={`/${locale}#about`} className="group flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-muted transition hover:text-or">
          {dict.scroll}
          <span className="relative h-10 w-px overflow-hidden bg-ivoire/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-or"
              animate={reduced ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </a>
      </motion.div>
    </section>
  );
}
