"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CI_OUTLINE_PATH, MAP_H, MAP_W, projectCI } from "@/data/map-ci";
import { cn } from "@/lib/utils";
import { useReveal } from "@/components/motion/Reveal";
import { EASE_EXPO, EASE_OUT } from "@/components/motion/MotionProvider";

export type MapPinView = {
  key: string;
  label: string;
  lat: number;
  lng: number;
  countLabel: string;
  primary?: boolean;
};

type Props = {
  pins: MapPinView[];
  cities: { label: string; lat: number; lng: number }[];
  /** Clés des épingles mises en avant (zone sélectionnée). */
  highlighted: string[];
  legendBases: string;
  legendCities: string;
  className?: string;
};

/** Position en pourcentage dans le conteneur, à partir de lat/lng. */
function pct(lat: number, lng: number) {
  const { x, y } = projectCI(lat, lng);
  return { left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` };
}

/** Côté d'affichage de l'étiquette pour éviter les chevauchements (Abidjan / Grand-Bassam). */
const labelSide: Record<string, "left" | "right" | "top"> = {
  abidjan: "left",
  bassam: "right",
  arrah: "right",
  yakro: "right",
  bouake: "right",
};

const DRAW = 1.8;

/**
 * Carte : le contour du pays se trace, les villes repères apparaissent,
 * puis les épingles Excellence Group se posent une à une.
 */
export function MapCI({ pins, cities, highlighted, legendBases, legendCities, className }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const { ref, show, reduced } = useReveal<HTMLDivElement>();
  const on = show || reduced;

  return (
    <div className={className} ref={ref} data-motion-tree="">
      <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
        {/* Fond de carte */}
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <motion.path
            d={CI_OUTLINE_PATH}
            fill="#ffffff"
            stroke="#cfc5b5"
            strokeWidth={1.25}
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: on ? 1 : 0, fillOpacity: on ? 1 : 0 }}
            transition={{ pathLength: { duration: DRAW, ease: EASE_EXPO }, fillOpacity: { duration: 0.8, delay: DRAW * 0.55 } }}
          />
        </svg>

        {/* Villes repères */}
        {cities.map((c, i) => (
          <motion.div
            key={c.label}
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
            style={pct(c.lat, c.lng)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: on ? 1 : 0 }}
            transition={{ duration: 0.5, delay: DRAW * 0.7 + i * 0.08 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
            <span className="text-[0.6875rem] text-ink-3 md:text-[0.75rem]">{c.label}</span>
          </motion.div>
        ))}

        {/* Villes Excellence Group */}
        {pins.map((p, i) => {
          const lit = highlighted.includes(p.key);
          const side = labelSide[p.key] ?? "right";
          const showTip = hover === p.key;
          const delay = DRAW * 0.85 + i * 0.12;
          return (
            <div key={p.key} className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(p.lat, p.lng)}>
              <motion.button
                type="button"
                aria-label={`${p.label} — ${p.countLabel}`}
                onMouseEnter={() => setHover(p.key)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p.key)}
                onBlur={() => setHover(null)}
                className={cn(
                  "block rounded-full border-2 border-red transition-colors duration-300",
                  p.primary ? "h-4 w-4" : "h-3 w-3",
                  lit ? "bg-red" : "bg-white",
                )}
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: on ? (showTip ? 1.15 : 1) : 0, opacity: on ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 22, delay: on && !showTip ? delay : 0 }}
              />
              {/* Halo discret lorsque la ville appartient à la zone sélectionnée */}
              {lit && !reduced && (
                <motion.span
                  key={`${p.key}-${highlighted.join("-")}`}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut", delay: on ? 0.1 : delay }}
                  aria-hidden
                />
              )}
              {/* Étiquette permanente */}
              <motion.span
                className={cn(
                  "pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium leading-none transition-colors duration-300 md:text-[0.8125rem]",
                  lit ? "text-ink" : "text-ink-2",
                  side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2",
                  side === "left" && "right-full top-1/2 mr-2 -translate-y-1/2",
                  side === "top" && "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
                )}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.4, delay: delay + 0.15 }}
              >
                {p.label}
              </motion.span>
              {/* Info-bulle au survol */}
              <AnimatePresence>
                {showTip && (
                  <motion.span
                    role="status"
                    className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap border border-line bg-white px-2.5 py-1.5 text-[0.75rem] text-ink shadow-[0_8px_20px_-12px_rgba(27,21,23,0.35)]"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                  >
                    {p.countLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <motion.ul
        className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-2"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.5, delay: DRAW + 0.4 }}
      >
        <li className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-red bg-red" aria-hidden />
          {legendBases}
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-line-2" aria-hidden />
          {legendCities}
        </li>
      </motion.ul>
    </div>
  );
}
