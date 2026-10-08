"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";
import { useMotionContext } from "./MotionProvider";

/**
 * Bouton « magnétique » : l'élément suit légèrement le pointeur (± `strength` px)
 * puis revient à sa place par ressort. Ordinateur uniquement ; inactif si
 * l'utilisateur préfère réduire les animations.
 */
export function Magnetic({ children, strength = 10, className }: { children: ReactNode; strength?: number; className?: string }) {
  const { fine, reduced } = useMotionContext();
  const active = fine && !reduced;
  const x = useSpring(0, { stiffness: 200, damping: 16, mass: 0.6 });
  const y = useSpring(0, { stiffness: 200, damping: 16, mass: 0.6 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div className={cn("inline-flex", className)} style={active ? { x, y } : undefined} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </motion.div>
  );
}
