"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { useMotionContext } from "./MotionProvider";

/**
 * Léger déplacement vertical au défilement (ordinateur, hors « réduire les
 * animations »). Le contenu est sur-dimensionné de 10 % pour ne jamais laisser
 * apparaître de bord.
 */
export function Parallax({ children, className, range = 5 }: { children: ReactNode; className?: string; range?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { fine, reduced } = useMotionContext();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-range}%`, `${range}%`]);
  const active = fine && !reduced;

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-x-0 -inset-y-[10%]" style={active ? { y } : undefined}>
        {children}
      </motion.div>
    </div>
  );
}
