"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { site } from "@/data/site";
import { EASE_EXPO, EASE_OUT, useMotionContext } from "./MotionProvider";

const SESSION_KEY = "eg-intro-seen";

type Phase = "intro" | "exit" | "quick" | "done";

/**
 * Intro de premier chargement (≈ 2,2 s) : emblème, double filet or, nom de la
 * structure, puis rideau en deux temps (papier, bordeaux). Jouée une fois par
 * session ; réduite à un simple fondu si l'utilisateur préfère moins d'animations.
 */
export function Preloader() {
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
      timers.push(window.setTimeout(() => setPhase("exit"), 1350));
      timers.push(
        window.setTimeout(() => {
          html.removeAttribute("data-intro");
          finishIntro();
        }, 1500),
      );
      timers.push(window.setTimeout(() => setPhase("done"), 2450));
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
      {/* Rideau bordeaux (second temps) */}
      <motion.div
        className="absolute inset-0 bg-red-dark"
        initial={false}
        animate={leaving ? { y: "-100%" } : quick ? { opacity: 0 } : { y: 0 }}
        transition={leaving ? { duration: 0.9, delay: 0.12, ease: EASE_EXPO } : { duration: 0.35 }}
      />
      {/* Rideau papier (premier temps) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-paper"
        initial={false}
        animate={leaving ? { y: "-100%" } : quick ? { opacity: 0 } : { y: 0 }}
        transition={leaving ? { duration: 0.9, ease: EASE_EXPO } : { duration: 0.35 }}
      >
        <motion.div
          className="flex flex-col items-center"
          initial={false}
          animate={leaving || quick ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
          >
            <Image src="/images/brand/icon-512.png" alt="" width={64} height={61} priority className="h-16 w-auto" />
          </motion.div>

          <motion.span
            className="rule-gold mt-5 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE_OUT }}
          />

          <span className="mt-4 block overflow-hidden pb-[0.1em]">
            <motion.span
              className="block font-serif text-[1.25rem] font-semibold tracking-tight text-ink"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT }}
            >
              {site.name}
            </motion.span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
