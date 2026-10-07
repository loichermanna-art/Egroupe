"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Reveal : apparition douce (fondu + translation) à l'entrée en vue    */
/* ------------------------------------------------------------------ */
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "span" | "li" | "p" | "figure" | "article";
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 1,
  y = 36,
  once = true,
  amount = 0.25,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* SplitWords : chaque mot remonte derrière un masque, en cascade       */
/* ------------------------------------------------------------------ */
type SplitProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: ElementType;
  once?: boolean;
  /** Déclenchement immédiat (ex. hero) au lieu d'attendre l'entrée en vue. */
  immediate?: boolean;
  /** Mots (index) à mettre en valeur avec une classe dédiée. */
  highlight?: { words: number[]; className: string };
};

export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  duration = 1.1,
  as: Tag = "span",
  once = true,
  immediate = false,
  highlight,
}: SplitProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: "115%", rotate: 4, opacity: 0 },
    visible: { y: "0%", rotate: 0, opacity: 1, transition: { duration, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <Tag className={cn("inline", className)} aria-label={text}>
      <motion.span
        className="inline"
        variants={container}
        initial={reduced ? "visible" : "hidden"}
        {...(immediate ? { animate: "visible" } : { whileInView: "visible", viewport: { once, amount: 0.5 } })}
        aria-hidden
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              variants={word}
              className={cn(
                "inline-block origin-bottom-left will-change-transform",
                wordClassName,
                highlight?.words.includes(i) && highlight.className,
              )}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* LineReveal : une ligne qui se dessine (séparateur doré)              */
/* ------------------------------------------------------------------ */
export function LineReveal({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className={cn("block h-px w-full origin-left bg-gradient-to-r from-or via-or/60 to-transparent", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
