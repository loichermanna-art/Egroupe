"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

type Props = { text: string; className?: string };

/** Paragraphe dont les mots s'illuminent progressivement au défilement. */
export function ScrollWords({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]} disabled={!!reduced}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  disabled,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  disabled: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span className="relative mr-[0.28em] mt-[0.1em]">
      <motion.span style={{ opacity: disabled ? 1 : opacity }}>{children}</motion.span>
    </span>
  );
}
