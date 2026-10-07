"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

type Props = { dict: Dictionary["testimonials"] };

export function Testimonials({ dict }: Props) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const total = dict.items.length;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setIndex((i) => (i + d + total) % total);
    },
    [total],
  );

  // Défilement automatique
  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, reduced, go]);

  const item = dict.items[index];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-noir py-28 md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
      <div className="halo pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50" />

      <div className="container-x">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} align="center" />

        <Reveal className="relative mx-auto mt-16 max-w-4xl" amount={0.3}>
          <Quote className="absolute -top-8 left-1/2 h-20 w-20 -translate-x-1/2 text-or/15" strokeWidth={1} />

          <div className="relative min-h-[260px] text-center md:min-h-[220px]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: 40 * dir, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -40 * dir, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="px-2"
              >
                <blockquote className="font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-normal leading-[1.3] text-ivoire">
                  « {item.quote} »
                </blockquote>
                <figcaption className="mt-8">
                  <p className="font-semibold text-or">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.role}</p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Contrôles */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={dict.prev}
              className="grid h-12 w-12 place-items-center rounded-full border border-ivoire/15 text-ivoire transition hover:border-or hover:text-or"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {dict.items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i + 1}/${total}`}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === index ? "w-8 bg-or" : "w-1.5 bg-ivoire/25 hover:bg-ivoire/50",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={dict.next}
              className="grid h-12 w-12 place-items-center rounded-full border border-ivoire/15 text-ivoire transition hover:border-or hover:text-or"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
