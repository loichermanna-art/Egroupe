"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { EASE_EXPO, EASE_OUT, useMotionContext } from "./MotionProvider";

const SESSION_KEY = "eg-intro-seen";
const RULES = 22;

type Phase = "intro" | "exit" | "quick" | "done";

type Props = {
  dict: {
    /** Devise en trois temps : « Discipline, / Travail / et Réussite ». */
    motto: string[];
    footer: string;
  };
};

/**
 * Intro de premier chargement (≈ 3,2 s) : la feuille de cahier. La réglure se
 * trace, la marge rouge descend, la devise s'écrit mot à mot, puis la feuille
 * remonte et laisse la page. Jouée une fois par session ; réduite à un simple
 * fondu si l'utilisateur préfère moins d'animations.
 */
export function Preloader({ dict }: Props) {
  const { finishIntro, reduced } = useMotionContext();
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    const html = document.documentElement;
    const seen = sessionStorage.getItem(SESSION_KEY) === "1";
    const quick = seen || reduced;
    const timers: number[] = [];

    if (quick) {
      timers.push(window.setTimeout(() => setPhase("quick"), 20));
      timers.push(window.setTimeout(() => finishIntro(), 60));
      timers.push(window.setTimeout(() => setPhase("done"), 420));
    } else {
      html.setAttribute("data-intro", "");
      timers.push(window.setTimeout(() => setPhase("exit"), 2300));
      timers.push(
        window.setTimeout(() => {
          html.removeAttribute("data-intro");
          finishIntro();
        }, 2750),
      );
      timers.push(window.setTimeout(() => setPhase("done"), 3250));
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    return () => {
      timers.forEach(clearTimeout);
      html.removeAttribute("data-intro");
    };
  }, [finishIntro, reduced]);

  if (phase === "done") return null;

  const leaving = phase === "exit";
  const quick = phase === "quick";

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden data-preloader="">
      <motion.div
        className="absolute inset-0 overflow-hidden bg-paper"
        initial={false}
        animate={leaving ? { y: "-100%" } : quick ? { opacity: 0 } : { y: 0 }}
        transition={leaving ? { duration: 0.9, ease: EASE_EXPO } : { duration: 0.35 }}
      >
        {/* Réglure */}
        {!quick &&
          Array.from({ length: RULES }, (_, i) => (
            <motion.span
              key={i}
              className="absolute inset-x-0 h-px origin-left bg-line"
              style={{ top: `${((i + 1) * 100) / (RULES + 1)}%` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: i * 0.045, ease: EASE_OUT }}
            />
          ))}

        {/* Marge rouge */}
        <motion.span
          className="absolute inset-y-0 w-[2px] origin-top bg-red"
          style={{ left: "var(--margin-x)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.65, delay: 0.35, ease: EASE_EXPO }}
        />

        {/* Devise, mot à mot */}
        <p
          className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-wrap gap-x-[0.3em] font-serif text-[clamp(1.875rem,1.35rem+1.9vw,3rem)] font-semibold leading-[1.15] tracking-tight text-ink"
          style={{ left: "calc(var(--margin-x) + var(--margin-gap))" }}
        >
          {dict.motto.map((w, i) => (
            <span key={w} className={["inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]", i === dict.motto.length - 1 ? "text-red" : ""].join(" ")}>
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: leaving || quick ? "-110%" : 0 }}
                transition={{ duration: leaving ? 0.5 : 0.6, delay: leaving ? i * 0.05 : 0.9 + i * 0.16, ease: EASE_OUT }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </p>

        {/* Signature */}
        <motion.p
          className="absolute bottom-8 flex items-center gap-3 text-[0.875rem] text-ink-3"
          style={{ left: "calc(var(--margin-x) + var(--margin-gap))" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: leaving || quick ? 0 : 1 }}
          transition={{ duration: 0.4, delay: leaving || quick ? 0 : 1.2 }}
        >
          <Image src="/images/brand/icon-512.png" alt="" width={24} height={23} priority className="h-6 w-auto" />
          {dict.footer}
        </motion.p>
      </motion.div>
    </div>
  );
}
