"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Reveal, SplitWords, LineReveal } from "@/components/ui/Reveal";
import { ScrollWords } from "@/components/ui/ScrollWords";

type Props = { locale: Locale; dict: Dictionary["about"] };

export function About({ dict }: Props) {
  const photoRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-40, 40]);
  const yNum = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -60]);

  return (
    <section id="about" className="relative overflow-hidden bg-noir py-28 md:py-40">
      {/* Halo discret */}
      <div className="halo pointer-events-none absolute -left-[20vw] top-0 h-[60vmin] w-[60vmin] rounded-full opacity-60" />

      {/* ---- Manifeste ---- */}
      <div className="container-x">
        <Reveal y={16} duration={0.8}>
          <p className="eyebrow flex items-center gap-4">
            <span className="inline-block h-px w-10 bg-or/70" aria-hidden />
            {dict.eyebrow}
          </p>
        </Reveal>
        <ScrollWords
          text={dict.manifesto}
          className="mt-10 max-w-5xl font-display text-[clamp(1.6rem,3.4vw,3.3rem)] font-normal leading-[1.2] tracking-tight text-ivoire"
        />
        <div className="mt-10 flex flex-wrap gap-3">
          {dict.values.map((v, i) => (
            <Reveal key={v} delay={i * 0.1} y={12} as="span">
              <span className="inline-flex items-center gap-2 rounded-full border border-or/30 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-or">
                <span className="h-1.5 w-1.5 rounded-full bg-or" aria-hidden />
                {v}
              </span>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---- Deux colonnes ---- */}
      <div className="container-x mt-24 grid grid-cols-1 items-start gap-14 lg:mt-36 lg:grid-cols-12 lg:gap-10">
        {/* Photo */}
        <div ref={photoRef} className="relative lg:col-span-6">
          <Reveal className="relative" amount={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border-gold-gradient">
              <motion.div style={{ y: yImg }} className="absolute -inset-y-12 inset-x-0">
                <Image
                  src="/images/team-encadreurs.jpg"
                  alt={dict.photoCaption}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={85}
                  className="object-cover"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-6 text-[0.65rem] uppercase tracking-[0.22em] text-ivoire/70">
                {dict.photoCaption}
              </p>
            </div>
          </Reveal>

          {/* Grand chiffre flottant */}
          <motion.div
            style={{ y: yNum }}
            className="pointer-events-none absolute -bottom-10 -right-2 flex items-end gap-3 sm:right-6 lg:-right-8"
          >
            <span className="font-display text-[clamp(6rem,14vw,11rem)] leading-[0.8] text-gold">{dict.yearsValue}</span>
            <span className="mb-3 max-w-[9rem] text-[0.7rem] font-medium uppercase leading-snug tracking-[0.22em] text-ivoire/80">
              {dict.yearsLabel}
            </span>
          </motion.div>
        </div>

        {/* Texte */}
        <div className="lg:col-span-6 lg:pl-8 lg:pt-6">
          <h2 className="display-2 text-ivoire">
            <SplitWords text={dict.title} stagger={0.035} />
          </h2>
          <Reveal delay={0.2}>
            <p className="lead mt-8">{dict.body1}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-5 text-base leading-relaxed text-muted/90">{dict.body2}</p>
          </Reveal>

          <LineReveal className="mt-10" />

          <Reveal delay={0.1}>
            <h3 className="mt-8 font-display text-2xl text-ivoire">{dict.objectivesTitle}</h3>
          </Reveal>
          <ul className="mt-6 space-y-4">
            {dict.objectives.map((o, i) => (
              <Reveal key={o} as="li" delay={0.08 * i} y={18}>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-or/50 text-or">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <p className="text-[0.98rem] leading-relaxed text-ivoire/85">{o}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
