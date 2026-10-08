"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { MAP_MAX_ZOOM, baseZoom, type ZoneKey } from "@/data/bases";
import { projectCI } from "@/data/map-ci";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { COUNTRY_VIEW, MapCI, focusOn, frameFor, type CameraTarget, type MapBaseView, type MapLabels, type MapPinView } from "@/components/ui/MapCI";
import { Reveal, Rule } from "@/components/motion/Reveal";
import { EASE_OUT, useMediaQuery, useMotionContext } from "@/components/motion/MotionProvider";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

export type ZoneView = { key: ZoneKey; label: string; count: string; bases: MapBaseView[] };

type Props = {
  locale: Locale;
  zones: ZoneView[];
  pins: MapPinView[];
  cities: { label: string; lat: number; lng: number }[];
  areaLabels: { key: "abidjan" | "lagoon" | "ocean"; lat: number; lng: number }[];
  labels: MapLabels & { findBase: string; findBaseHint: string; approx: string };
};

/** Villes mises en avant sur la carte selon la zone sélectionnée. */
const zonePins: Record<ZoneKey, string[]> = {
  south: ["abidjan"],
  north: ["abidjan"],
  interior: ["bassam", "yakro", "bouake", "arrah"],
};

/** Ville (épingle niveau pays) → zone à ouvrir. */
const cityZone: Record<string, ZoneKey> = {
  abidjan: "south",
  bassam: "interior",
  yakro: "interior",
  bouake: "interior",
  arrah: "interior",
};

const point = (b: MapBaseView) => projectCI(b.lat, b.lng);

/** Part de la largeur de la scène occupée par les bases cadrées : plus serré sur téléphone. */
const FILL_WIDE = 0.55;
const FILL_NARROW = 0.8;

/** Cadrage d'ouverture : Abidjan (bases Sud + Nord), avant toute interaction. */
function abidjanFrame(zones: ZoneView[], fill = FILL_WIDE) {
  const pts = zones.filter((z) => z.key !== "interior").flatMap((z) => z.bases.map(point));
  return pts.length ? frameFor(pts, MAP_MAX_ZOOM, fill) : COUNTRY_VIEW;
}

export function BasesExplorer({ zones, pins, cities, areaLabels, labels }: Props) {
  const [zone, setZone] = useState<ZoneKey>("south");
  const [activeBase, setActiveBase] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraTarget>({ ...COUNTRY_VIEW, id: 0 });
  const tabsId = useId();
  const mapWrap = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionContext();
  const { scrollTo } = useSmoothScroll();

  // Téléphone : scène étroite → cadrages plus serrés, bases vues de plus près
  const narrow = useMediaQuery("(max-width: 40rem)");
  const fill = narrow ? FILL_NARROW : FILL_WIDE;
  const closeUp = (k: number) => Math.min(MAP_MAX_ZOOM, narrow ? k * 1.25 : k);
  // Cadrage d'ouverture (tant qu'aucun vol n'a été demandé) : suit la largeur d'écran
  const opening = useMemo<CameraTarget>(() => ({ ...abidjanFrame(zones, fill), id: 0 }), [zones, fill]);
  const cameraTarget = camera.id === 0 ? opening : camera;

  const current = zones.find((z) => z.key === zone) ?? zones[0];
  const allBases = useMemo(() => zones.flatMap((z) => z.bases), [zones]);

  /** Nouveau vol : la caméra réagit à chaque changement d'identifiant. */
  const fly = useCallback((t: { cx: number; cy: number; k: number }) => {
    setCamera((prev) => ({ ...t, id: prev.id + 1 }));
  }, []);

  /** Sur mobile, la carte est au-dessus de la liste : on la ramène dans l'écran avant le vol si elle en est sortie. */
  const bringMapIntoView = useCallback(() => {
    const el = mapWrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (visible < r.height * 0.75) scrollTo(el);
  }, [scrollTo]);

  const selectZone = (key: ZoneKey) => {
    const target = zones.find((z) => z.key === key);
    if (!target) return;
    setZone(key);
    setActiveBase(null);
    fly(frameFor(target.bases.map(point), MAP_MAX_ZOOM, fill));
  };

  const selectBase = (id: string, fromList = false) => {
    const base = allBases.find((b) => b.id === id);
    if (!base) return;
    if (activeBase === id) {
      // Second clic : on revient à la vue de la zone
      setActiveBase(null);
      fly(frameFor((zones.find((z) => z.key === base.zone)?.bases ?? []).map(point), MAP_MAX_ZOOM, fill));
      return;
    }
    setZone(base.zone);
    setActiveBase(id);
    if (fromList) bringMapIntoView();
    fly(focusOn(point(base), closeUp(baseZoom[base.zone])));
  };

  const selectCity = (key: string) => {
    const z = cityZone[key] ?? "interior";
    const pin = pins.find((p) => p.key === key);
    const inCity =
      key === "abidjan"
        ? allBases.filter((b) => b.zone !== "interior")
        : allBases.filter((b) => b.zone === "interior" && pin && Math.hypot(b.lat - pin.lat, b.lng - pin.lng) < 0.2);
    setZone(key === "abidjan" ? (zone === "north" ? "north" : "south") : z);
    setActiveBase(null);
    fly(frameFor(inCity.map(point), key === "abidjan" ? MAP_MAX_ZOOM : closeUp(baseZoom.interior), fill));
  };

  const reset = () => {
    setActiveBase(null);
    fly(COUNTRY_VIEW);
  };

  return (
    <div className="mt-8 grid gap-9 md:mt-10 lg:mt-12 lg:grid-cols-12 lg:gap-10">
      {/* ---- Liste (sous la carte sur téléphone, à sa gauche à partir de lg) ---- */}
      <div className="min-w-0 lg:col-span-6">
        <Reveal kind="fade" delay={0.2}>
          <div role="tablist" aria-label={labels.legendBases} className="flex flex-wrap gap-x-6 gap-y-0">
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
                  onClick={() => selectZone(z.key)}
                  className={cn(
                    "relative inline-flex min-h-11 items-baseline gap-2 pb-3 pt-2 text-[0.9375rem] transition-colors duration-300",
                    selected ? "font-medium text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {z.label}
                  <span className={cn("text-[0.8125rem] tabular-nums transition-colors duration-300", selected ? "text-red" : "text-ink-3")}>{z.count}</span>
                  {selected && (
                    <motion.span
                      layoutId="zone-tab"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-red"
                      transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>
        <Rule className="bg-line-2" delay={0.1} />

        <div className="mt-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={zone}
              id={`${tabsId}-panel-${zone}`}
              role="tabpanel"
              aria-labelledby={`${tabsId}-tab-${zone}`}
              data-motion-tree=""
              className="grid sm:grid-cols-2 sm:gap-x-8"
              initial={reduced ? false : "hidden"}
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.04 } },
                exit: { opacity: 0, transition: { duration: 0.15 } },
              }}
            >
              {current.bases.map((b, i) => {
                const active = b.id === activeBase;
                return (
                  <motion.li
                    key={b.id}
                    className="border-b border-line"
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } } }}
                  >
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectBase(b.id, true)}
                      className={cn(
                        "group/row -mx-3 flex w-[calc(100%+1.5rem)] items-start gap-3 px-3 py-3.5 text-left transition-colors duration-300",
                        active ? "bg-white" : "hover:bg-white/60",
                      )}
                    >
                      <span
                        className={cn(
                          "w-5 shrink-0 pt-0.5 text-[0.8125rem] tabular-nums transition-colors duration-300",
                          active ? "font-medium text-red" : "text-ink-3",
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink">
                          {b.area}
                          {b.city && b.city !== b.area ? <span className="font-normal text-ink-3"> — {b.city}</span> : null}
                        </span>
                        <span className="block text-[0.875rem] leading-snug text-ink-2">{b.place}</span>
                      </span>
                      <MapPin
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0 transition-all duration-300",
                          active ? "text-red opacity-100" : "text-ink-3 opacity-0 group-hover/row:opacity-100 group-focus-visible/row:opacity-100",
                        )}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </button>
                  </motion.li>
                );
              })}
            </motion.ol>
          </AnimatePresence>
        </div>

        <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5" delay={0.3}>
          <Button href={site.whatsappUrl} variant="secondary">
            {labels.findBase}
          </Button>
          <p className="t-caption max-w-xs">{labels.findBaseHint}</p>
        </Reveal>
      </div>

      {/* ---- Carte : en premier sur téléphone (le vol vers la base reste visible), épinglée à droite sur grand écran ---- */}
      <div ref={mapWrap} className="order-first min-w-0 scroll-mt-[calc(var(--header-h)+0.5rem)] lg:order-none lg:col-span-6 lg:self-start lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
        <MapCI
          pins={pins}
          cities={cities}
          areaLabels={areaLabels}
          bases={allBases}
          zone={zone}
          highlighted={zonePins[zone]}
          activeBase={activeBase}
          camera={cameraTarget}
          onSelectBase={(id) => selectBase(id)}
          onSelectCity={selectCity}
          onReset={reset}
          labels={labels}
        />
        <Reveal as="p" kind="fade" delay={0.4} className="t-caption mx-auto mt-3 max-w-[560px] text-center">
          {labels.approx}
        </Reveal>
      </div>
    </div>
  );
}
