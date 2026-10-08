"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

import { EASE_OUT, useMotionContext } from "./MotionProvider";

/**
 * La marge du cahier : un filet rouge fixe à gauche de la page, qui se
 * remplit au fur et à mesure de la lecture (progression du défilement,
 * lissée par un ressort). Il passe à l'or devant les fonds sombres
 * (éléments marqués `data-margin-dark`).
 */
export function Margin() {
  const { introDone, reduced } = useMotionContext();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [dark, setDark] = useState(false);

  // Fond sombre au niveau du milieu de l'écran → trait doré
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-margin-dark]"));
    if (!targets.length) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setDark(visible.size > 0);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-y-0 z-[60] w-[2px]" style={{ left: "var(--margin-x)" }} aria-hidden>
      <motion.span
        className="absolute inset-0 origin-top bg-red/15"
        data-motion=""
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: introDone || reduced ? 1 : 0 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      />
      <motion.span
        className="absolute inset-0 origin-top"
        style={{ scaleY: reduced ? scrollYProgress : smooth }}
        animate={{ backgroundColor: dark ? "#d9b45a" : "#b20603" }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
