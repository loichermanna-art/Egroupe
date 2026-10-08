"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";

import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/utils";
import { EASE_OUT } from "./MotionProvider";
import { useReveal } from "./Reveal";

type Props = {
  value: number;
  locale: Locale;
  decimals?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
  /** Appelé quand la valeur finale est atteinte (ou immédiatement si les animations sont réduites). */
  onComplete?: () => void;
};

/**
 * Nombre qui s'incrémente jusqu'à sa valeur à l'entrée dans l'écran (après l'intro).
 * La valeur finale est rendue côté serveur (référencement, sans JavaScript) ;
 * l'animation écrit directement dans le nœud texte, sans re-rendu React.
 */
export function Counter({ value, locale, decimals = 0, suffix = "", duration = 1.6, delay = 0, className, onComplete }: Props) {
  const { ref, show, reduced } = useReveal<HTMLSpanElement>();
  const numRef = useRef<HTMLSpanElement>(null);
  const final = formatNumber(value, locale, decimals);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const el = numRef.current;
    if (!show || !el) return;
    if (reduced) {
      onCompleteRef.current?.();
      return;
    }
    el.textContent = formatNumber(0, locale, decimals);
    const controls = animate(0, value, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => {
        el.textContent = formatNumber(v, locale, decimals);
      },
      onComplete: () => {
        el.textContent = final;
        onCompleteRef.current?.();
      },
    });
    return () => {
      controls.stop();
      el.textContent = final;
    };
  }, [show, reduced, value, locale, decimals, duration, delay, final]);

  return (
    <span ref={ref} className={className}>
      <span ref={numRef} className="tabular-nums">
        {final}
      </span>
      {suffix}
    </span>
  );
}
