"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Curseur personnalisé : un point d'or + un anneau qui suit avec inertie.
 * - s'agrandit au survol des liens/boutons et des éléments [data-cursor]
 * - affiche un libellé optionnel via data-cursor-label
 * - uniquement sur pointeur fin (souris / trackpad)
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;

  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea, select, label, [role='tab']",
      );
      if (target) {
        setHovering(true);
        setLabel(target.dataset.cursorLabel ?? target.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? null);
      } else {
        setHovering(false);
        setLabel(null);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("mouseenter", onEnter);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = label ? 88 : hovering ? 56 : 36;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {/* Point central */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-jaune"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: visible ? 1 : 0 }}
      />
      {/* Anneau */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-or/70"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.82 : 1,
          backgroundColor: label
            ? "rgba(229,194,91,0.92)"
            : hovering
              ? "rgba(229,194,91,0.12)"
              : "rgba(229,194,91,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {label && (
          <span className="px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-noir">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
