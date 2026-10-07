"use client";

import { useId, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Base, ZoneKey } from "@/data/bases";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MapCI, type MapPinView } from "@/components/ui/MapCI";

export type ZoneView = { key: ZoneKey; label: string; count: string; bases: Base[] };

type Props = {
  locale: Locale;
  zones: ZoneView[];
  pins: MapPinView[];
  cities: { label: string; lat: number; lng: number }[];
  labels: { legendBases: string; legendCities: string; findBase: string; findBaseHint: string };
};

/** Villes mises en avant sur la carte selon la zone sélectionnée. */
const zonePins: Record<ZoneKey, string[]> = {
  south: ["abidjan"],
  north: ["abidjan"],
  interior: ["bassam", "yakro", "bouake", "arrah"],
};

export function BasesExplorer({ zones, pins, cities, labels }: Props) {
  const [zone, setZone] = useState<ZoneKey>("south");
  const tabsId = useId();
  const current = zones.find((z) => z.key === zone) ?? zones[0];

  return (
    <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
      {/* ---- Liste ---- */}
      <div className="lg:col-span-6">
        <div role="tablist" aria-label={labels.legendBases} className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line-2">
          {zones.map((z) => {
            const selected = z.key === zone;
            return (
              <button
                key={z.key}
                id={`${tabsId}-tab-${z.key}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${tabsId}-panel-${z.key}`}
                onClick={() => setZone(z.key)}
                className={cn(
                  "-mb-px inline-flex items-baseline gap-2 border-b-2 pb-3 text-[0.9375rem] transition-colors",
                  selected ? "border-red font-medium text-ink" : "border-transparent text-ink-2 hover:text-ink",
                )}
              >
                {z.label}
                <span className={cn("text-[0.8125rem] tabular-nums", selected ? "text-red" : "text-ink-3")}>{z.count}</span>
              </button>
            );
          })}
        </div>

        <div id={`${tabsId}-panel-${zone}`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${zone}`} className="mt-2">
          <ol className="grid sm:grid-cols-2 sm:gap-x-8">
            {current.bases.map((b, i) => (
              <li key={`${b.area}-${b.place}`} className="border-b border-line py-3.5">
                <p className="flex items-baseline gap-3 font-medium text-ink">
                  <span className="w-5 shrink-0 text-[0.8125rem] font-normal text-ink-3 tabular-nums">{i + 1}</span>
                  <span>
                    {b.area}
                    {b.city && b.city !== b.area ? <span className="font-normal text-ink-3"> — {b.city}</span> : null}
                  </span>
                </p>
                <p className="pl-8 text-[0.875rem] leading-snug text-ink-2">{b.place}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button href={site.whatsappUrl} variant="secondary">
            {labels.findBase}
          </Button>
          <p className="t-caption">{labels.findBaseHint}</p>
        </div>
      </div>

      {/* ---- Carte ---- */}
      <MapCI
        className="lg:col-span-6"
        pins={pins}
        cities={cities}
        highlighted={zonePins[zone]}
        legendBases={labels.legendBases}
        legendCities={labels.legendCities}
      />
    </div>
  );
}
