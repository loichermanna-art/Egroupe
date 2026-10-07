"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Base, ZoneKey, MapPin as Pin } from "@/data/bases";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export type ZoneView = { key: ZoneKey; label: string; count: string; bases: Base[] };
type PinView = Pin & { countLabel: string };

type Props = {
  locale: Locale;
  zones: ZoneView[];
  pins: PinView[];
  labels: { mapLegend: string; abidjanPin: string; findBase: string };
};

/** Lien zone → épingles mises en avant sur la carte. */
const zonePins: Record<ZoneKey, string[]> = {
  south: ["abidjan", "bassam"],
  north: ["abidjan"],
  interior: ["bassam", "yakro", "bouake", "arrah"],
};

export function BasesExplorer({ zones, pins, labels }: Props) {
  const [zone, setZone] = useState<ZoneKey>("south");
  const [hoverPin, setHoverPin] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const current = zones.find((z) => z.key === zone)!;

  return (
    <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
      {/* ---- Liste ---- */}
      <div className="lg:col-span-5">
        {/* Onglets */}
        <Reveal>
          <div role="tablist" aria-label={labels.mapLegend} className="flex flex-wrap gap-2">
            {zones.map((z) => {
              const active = z.key === zone;
              return (
                <button
                  key={z.key}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setZone(z.key)}
                  className={cn(
                    "relative rounded-full border px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors",
                    active ? "border-or text-noir" : "border-ivoire/15 text-muted hover:border-or/50 hover:text-ivoire",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="zone-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-or-3 via-or to-or-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {z.label} <span className={cn("ml-1 opacity-70", active && "opacity-80")}>· {z.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Liste des bases */}
        <div className="relative mt-8 min-h-[360px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={zone}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="divide-y divide-ivoire/8 border-y border-ivoire/8"
            >
              {current.bases.map((b, i) => (
                <motion.li
                  key={`${b.area}-${b.place}`}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-start gap-4 py-4"
                >
                  <span className="mt-1 font-display text-sm text-or/70">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <p className="font-medium text-ivoire transition-colors group-hover:text-or">
                      {b.area}
                      {b.city && b.city !== b.area ? <span className="text-muted"> · {b.city}</span> : null}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{b.place}</p>
                  </div>
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-or/40 transition-colors group-hover:text-or" strokeWidth={1.6} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <Reveal delay={0.1} className="mt-8">
          <Button href={site.whatsappUrl} external variant="outline" size="md" data-cursor-label="WhatsApp">
            {labels.findBase}
          </Button>
        </Reveal>
      </div>

      {/* ---- Carte ---- */}
      <Reveal className="relative lg:col-span-7" amount={0.2} duration={1.2}>
        <div className="relative mx-auto aspect-[1200/867] w-full max-w-[820px]">
          {/* Lueur */}
          <div className="halo absolute inset-[10%] rounded-full opacity-80" />
          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/illustrations/map-cote-divoire-gold.png"
              alt="Côte d'Ivoire"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
            />

            {/* Épingles */}
            {pins.map((p) => {
              const highlighted = zonePins[zone].includes(p.key);
              const show = hoverPin === p.key || (hoverPin === null && p.primary && highlighted);
              return (
                <div
                  key={p.key}
                  className="absolute"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
                  onMouseEnter={() => setHoverPin(p.key)}
                  onMouseLeave={() => setHoverPin(null)}
                >
                  <button
                    type="button"
                    aria-label={`${p.label} — ${p.countLabel}`}
                    onFocus={() => setHoverPin(p.key)}
                    onBlur={() => setHoverPin(null)}
                    className="relative grid place-items-center"
                  >
                    {/* Anneaux pulsés */}
                    {highlighted && !reduced && (
                      <>
                        <span className="absolute h-6 w-6 rounded-full border border-rouge-vif/80 animate-pulse-ring" />
                        <span className="absolute h-6 w-6 rounded-full border border-rouge-vif/60 animate-pulse-ring [animation-delay:0.8s]" />
                      </>
                    )}
                    <span
                      className={cn(
                        "relative block rounded-full border-2 border-noir shadow-[0_0_0_3px_rgba(10,5,6,0.4)] transition-all duration-500",
                        p.primary ? "h-5 w-5" : "h-3.5 w-3.5",
                        highlighted ? "bg-rouge-vif scale-110" : "bg-ivoire/70",
                      )}
                    />
                  </button>

                  {/* Étiquette */}
                  <AnimatePresence>
                    {show && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                        className="glass pointer-events-none absolute left-1/2 top-full z-10 mt-3 -translate-x-1/2 whitespace-nowrap rounded-xl px-3.5 py-2 text-center"
                      >
                        <p className="text-sm font-semibold text-ivoire">{p.label}</p>
                        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-or">{p.countLabel}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

          {/* Légende */}
          <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-muted sm:bottom-6 sm:left-6">
            <span className="h-2.5 w-2.5 rounded-full bg-rouge-vif" />
            {labels.mapLegend}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
