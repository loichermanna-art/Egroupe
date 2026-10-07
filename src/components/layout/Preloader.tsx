"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { introStore, useIntroPlaying } from "@/lib/intro";

type Props = { words: string[]; since: string };

const DURATION = 2.1; // compteur
const TOTAL = 2500; // ms avant la levée du rideau

/**
 * Écran d'introduction : compteur 0 → 100, mots-valeurs qui défilent,
 * puis rideau qui se lève. Joué une fois par session.
 */
export function Preloader({ words, since }: Props) {
  const playing = useIntroPlaying();
  const lenis = useLenis();
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  // Compteur + mots + fin — uniquement lorsque l'intro est active
  useEffect(() => {
    if (!playing) return;
    document.documentElement.dataset.intro = "playing";
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: DURATION,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    const wordTimer = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 650);
    const end = setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      introStore.finish();
    }, TOTAL);

    return () => {
      controls.stop();
      clearInterval(wordTimer);
      clearTimeout(end);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [playing, words.length, lenis]);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="preloader"
          className="eg-preloader fixed inset-0 z-[100] flex flex-col bg-noir text-ivoire"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
          aria-hidden
        >
          {/* Halo */}
          <div className="halo pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />

          {/* Haut : marque */}
          <div className="container-x flex items-center justify-between pt-8">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src="/images/brand/icon-512.png" alt="" width={36} height={36} priority className="h-9 w-9" />
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-ivoire/80">Excellence Group</span>
            </motion.div>
            <motion.span
              className="eyebrow hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {since}
            </motion.span>
          </div>

          {/* Centre : mot-valeur */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="display-1 relative h-[1.2em] overflow-hidden text-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={wordIndex}
                  className="block font-display italic text-gold"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Bas : compteur + barre */}
          <div className="container-x flex items-end justify-between pb-8">
            <div className="h-px w-2/5 bg-ivoire/10">
              <div
                className="h-px origin-left bg-gradient-to-r from-or to-jaune transition-transform duration-100 ease-linear"
                style={{ transform: `scaleX(${count / 100})` }}
              />
            </div>
            <span className="font-display text-[clamp(3rem,9vw,7rem)] leading-none tabular-nums text-ivoire">
              {count}
              <span className="text-or">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
