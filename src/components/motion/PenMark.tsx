"use client";

import { useCallback, useState, type ReactNode } from "react";
import { motion } from "motion/react";

import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { useMotionContext } from "./MotionProvider";
import { useReveal } from "./Reveal";
import { Counter } from "./Counter";

/* ------------------------------------------------------------------
   Le stylo du correcteur
   Traits SVG « à main levée » qui se tracent : un cercle autour d'un
   résultat, un soulignement sous un titre ou un nom. Rouge sur papier,
   or sur bordeaux et sur encre.
------------------------------------------------------------------- */

export type PenKind = "circle" | "line";
export type PenColor = "red" | "gold";

const PATHS: Record<PenKind, { d: string; viewBox: string; width: number }> = {
  circle: {
    d: "M44 22 C 110 4, 236 2, 280 34 C 308 62, 250 104, 150 108 C 62 110, 6 88, 12 58 C 18 30, 72 12, 176 9",
    viewBox: "0 0 300 120",
    width: 3,
  },
  line: {
    d: "M4 12 C 60 6, 140 4, 200 8 C 240 10, 270 12, 296 9",
    viewBox: "0 0 300 20",
    width: 3.5,
  },
};

const COLORS: Record<PenColor, string> = { red: "#b20603", gold: "#d9b45a" };
const PEN_EASE = [0.65, 0, 0.35, 1] as const;

type PenMarkProps = {
  kind?: PenKind;
  color?: PenColor;
  /** Le trait se trace quand `show` passe à vrai ; il s'efface (puis se réarme) quand il repasse à faux. */
  show: boolean;
  delay?: number;
  className?: string;
};

/** Trait contrôlé par le parent (`show`). Positionné en absolu par la classe passée. */
export function PenMark({ kind = "circle", color = "red", show, delay = 0, className }: PenMarkProps) {
  const { reduced } = useMotionContext();
  const { d, viewBox, width } = PATHS[kind];
  const draw = kind === "circle" ? 0.9 : 0.7;

  return (
    <svg className={cn("pointer-events-none overflow-visible", className)} viewBox={viewBox} preserveAspectRatio="none" fill="none" aria-hidden data-pen="">
      <motion.path
        d={d}
        stroke={COLORS[color]}
        strokeWidth={width}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={reduced ? { pathLength: 1, opacity: show ? 1 : 0 } : show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={
          show
            ? { pathLength: { duration: draw, delay, ease: PEN_EASE }, opacity: { duration: 0.01, delay } }
            : { opacity: { duration: 0.25 }, pathLength: { duration: 0, delay: 0.25 } }
        }
      />
    </svg>
  );
}

/** Soulignement qui se trace à l'entrée dans l'écran (après l'intro). */
export function PenUnderline({
  children,
  color = "red",
  delay = 0.3,
  className,
  markClassName,
}: {
  children: ReactNode;
  color?: PenColor;
  delay?: number;
  className?: string;
  markClassName?: string;
}) {
  const { ref, show } = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
      <PenMark kind="line" color={color} show={show} delay={delay} className={cn("absolute -bottom-[0.3em] left-[-2%] h-[0.45em] w-[104%]", markClassName)} />
    </span>
  );
}

type CircledCounterProps = {
  value: number;
  locale: Locale;
  decimals?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  color?: PenColor;
  className?: string;
};

/** Nombre qui s'incrémente, puis que le stylo entoure une fois la valeur atteinte. */
export function CircledCounter({ value, locale, decimals = 0, suffix = "", duration = 1.6, delay = 0, color = "red", className }: CircledCounterProps) {
  const [done, setDone] = useState(false);
  const onComplete = useCallback(() => setDone(true), []);
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <Counter value={value} locale={locale} decimals={decimals} suffix={suffix} duration={duration} delay={delay} onComplete={onComplete} />
      <PenMark kind="circle" color={color} show={done} className="absolute -inset-y-[0.22em] -inset-x-[0.5em] h-[calc(100%+0.44em)] w-[calc(100%+1em)]" />
    </span>
  );
}
