"use client";

import { useState } from "react";
import { CI_OUTLINE_PATH, MAP_H, MAP_W, projectCI } from "@/data/map-ci";
import { cn } from "@/lib/utils";

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

export function MapCI({ pins, cities, highlighted, legendBases, legendCities, className }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
        {/* Fond de carte */}
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={CI_OUTLINE_PATH} fill="#ffffff" stroke="#cfc5b5" strokeWidth={1.25} strokeLinejoin="round" />
        </svg>

        {/* Villes repères */}
        {cities.map((c) => (
          <div
            key={c.label}
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
            style={pct(c.lat, c.lng)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
            <span className="text-[0.6875rem] text-ink-3 md:text-[0.75rem]">{c.label}</span>
          </div>
        ))}

        {/* Villes Excellence Group */}
        {pins.map((p) => {
          const on = highlighted.includes(p.key);
          const side = labelSide[p.key] ?? "right";
          const showTip = hover === p.key;
          return (
            <div key={p.key} className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(p.lat, p.lng)}>
              <button
                type="button"
                aria-label={`${p.label} — ${p.countLabel}`}
                onMouseEnter={() => setHover(p.key)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p.key)}
                onBlur={() => setHover(null)}
                className={cn(
                  "block rounded-full border-2 transition-[background-color,border-color,transform] duration-150",
                  p.primary ? "h-4 w-4" : "h-3 w-3",
                  on ? "border-red bg-red" : "border-red bg-white",
                  showTip && "scale-110",
                )}
              />
              {/* Étiquette permanente */}
              <span
                className={cn(
                  "pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium leading-none md:text-[0.8125rem]",
                  on ? "text-ink" : "text-ink-2",
                  side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2",
                  side === "left" && "right-full top-1/2 mr-2 -translate-y-1/2",
                  side === "top" && "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
                )}
              >
                {p.label}
              </span>
              {/* Info-bulle au survol */}
              {showTip && (
                <span
                  role="status"
                  className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-[2px] border border-line bg-white px-2.5 py-1.5 text-[0.75rem] text-ink shadow-[0_8px_20px_-12px_rgba(27,21,23,0.35)]"
                >
                  {p.countLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-2">
        <li className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-red bg-red" aria-hidden />
          {legendBases}
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-line-2" aria-hidden />
          {legendCities}
        </li>
      </ul>
    </div>
  );
}
