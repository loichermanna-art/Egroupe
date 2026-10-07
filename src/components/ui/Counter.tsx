"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/utils";

type Props = {
  value: number;
  locale: Locale;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

/** Compteur animé (odomètre doux) qui démarre à l'entrée en vue. */
export function Counter({
  value,
  locale,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.4,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() => formatNumber(0, locale, decimals));
  const final = formatNumber(value, locale, decimals);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(formatNumber(v, locale, decimals)),
    });
    return () => controls.stop();
  }, [inView, value, locale, decimals, duration, delay, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="tabular-nums">{reduced ? final : display}</span>
      {suffix}
    </span>
  );
}
