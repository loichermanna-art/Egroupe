"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "li" | "p" | "figure" | "article" | "span";
};

/**
 * Apparition discrète à l'entrée dans le viewport : léger fondu + 10 px.
 * Désactivée si l'utilisateur préfère réduire les animations.
 */
export function Reveal({ children, className, delay = 0, once = true, amount = 0.2, as = "div" }: Props) {
  const reduced = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
