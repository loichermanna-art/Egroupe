"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { Maximize, Minus, Plus } from "lucide-react";

import { CI_OUTLINE_PATH, MAP_H, MAP_W, projectCI } from "@/data/map-ci";
import { MAP_MAX_ZOOM, type LabelSide, type ZoneKey } from "@/data/bases";
import { clamp, cn } from "@/lib/utils";
import { useReveal } from "@/components/motion/Reveal";
import { EASE_EXPO, EASE_OUT, useMotionContext } from "@/components/motion/MotionProvider";

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */

export type MapPinView = {
  key: string;
  label: string;
  lat: number;
  lng: number;
  countLabel: string;
  primary?: boolean;
};

export type MapBaseView = {
  id: string;
  zone: ZoneKey;
  area: string;
  place: string;
  city?: string;
  lat: number;
  lng: number;
  labelSide: LabelSide;
  labelMinK?: number;
};

/** Cible de caméra : centre (unités carte) + zoom. `id` change à chaque vol demandé. */
export type CameraTarget = { cx: number; cy: number; k: number; id: number };

export type MapLabels = {
  legendBases: string;
  legendCities: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  abidjan: string;
  lagoon: string;
  ocean: string;
};

type Props = {
  pins: MapPinView[];
  cities: { label: string; lat: number; lng: number }[];
  areaLabels: { key: "abidjan" | "lagoon" | "ocean"; lat: number; lng: number }[];
  bases: MapBaseView[];
  zone: ZoneKey;
  /** Clés des villes mises en avant (zone sélectionnée). */
  highlighted: string[];
  activeBase: string | null;
  camera: CameraTarget;
  onSelectBase: (id: string) => void;
  onSelectCity: (key: string) => void;
  onReset: () => void;
  labels: MapLabels;
  className?: string;
};

/* ------------------------------------------------------------------
   Caméra
------------------------------------------------------------------- */

export const COUNTRY_VIEW = { cx: MAP_W / 2, cy: MAP_H / 2, k: 1 };

/** Cadre un ensemble de points (unités carte) : centre + zoom, plafonné. */
export function frameFor(points: { x: number; y: number }[], maxK: number): { cx: number; cy: number; k: number } {
  if (points.length === 0) return COUNTRY_VIEW;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = Math.max(maxX - minX, 0.01);
  const h = Math.max(maxY - minY, 0.01);
  const k = clamp(Math.min((0.55 * MAP_W) / w, (0.55 * MAP_H) / h), 1, maxK);
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, k };
}

/** Le centre ne doit pas laisser apparaître de vide au-delà de la carte. */
function clampCenter(cx: number, cy: number, k: number): [number, number] {
  const hw = MAP_W / (2 * k);
  const hh = MAP_H / (2 * k);
  const x = hw >= MAP_W / 2 ? MAP_W / 2 : clamp(cx, hw, MAP_W - hw);
  const y = hh >= MAP_H / 2 ? MAP_H / 2 : clamp(cy, hh, MAP_H - hh);
  return [x, y];
}

const DRAW = 1.8;
const CITY_LEVEL = 4.5;

/* ------------------------------------------------------------------
   Élément positionné sur la carte (suit la caméra)
------------------------------------------------------------------- */

type Cam = { cx: MotionValue<number>; cy: MotionValue<number>; k: MotionValue<number> };

function Positioned({
  lat,
  lng,
  cam,
  className,
  children,
}: {
  lat: number;
  lng: number;
  cam: Cam;
  className?: string;
  children: ReactNode;
}) {
  const { x, y } = useMemo(() => projectCI(lat, lng), [lat, lng]);
  const left = useTransform([cam.cx, cam.k], ([c, z]: number[]) => `${(((x - c) * z) / MAP_W) * 100 + 50}%`);
  const top = useTransform([cam.cy, cam.k], ([c, z]: number[]) => `${(((y - c) * z) / MAP_H) * 100 + 50}%`);
  return (
    <motion.div className={cn("absolute", className)} style={{ left, top }}>
      {children}
    </motion.div>
  );
}

const sideClass: Record<LabelSide, string> = {
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
};

/* ------------------------------------------------------------------
   Carte
------------------------------------------------------------------- */

/**
 * Carte de la Côte d'Ivoire avec caméra : le contour se trace à l'entrée,
 * puis la vue vole (zoom + déplacement) vers la zone ou la base choisie.
 * Niveau pays : villes ; niveau ville : bases une à une, lagune et océan nommés.
 */
export function MapCI({
  pins,
  cities,
  areaLabels,
  bases,
  zone,
  highlighted,
  activeBase,
  camera,
  onSelectBase,
  onSelectCity,
  onReset,
  labels,
  className,
}: Props) {
  const { ref, show, reduced } = useReveal<HTMLDivElement>();
  const { fine } = useMotionContext();
  const on = show || reduced;

  /* ----- caméra ----- */
  const cx = useMotionValue(COUNTRY_VIEW.cx);
  const cy = useMotionValue(COUNTRY_VIEW.cy);
  const k = useMotionValue(1);
  const cam = useMemo<Cam>(() => ({ cx, cy, k }), [cx, cy, k]);

  const vx = useTransform([cx, k], ([c, z]: number[]) => c - MAP_W / (2 * z));
  const vy = useTransform([cy, k], ([c, z]: number[]) => c - MAP_H / (2 * z));
  const vw = useTransform(k, (z) => MAP_W / z);
  const vh = useTransform(k, (z) => MAP_H / z);
  const viewBox = useMotionTemplate`${vx} ${vy} ${vw} ${vh}`;
  const strokeWidth = useTransform(k, (z) => 1.25 / z);

  const cityOpacity = useTransform(k, [3, 6], [1, 0]);
  const baseOpacity = useTransform(k, [3, 6], [0, 1]);
  const refOpacity = useTransform(k, [1.6, 3.5], [1, 0]);
  const areaOpacity = useTransform(k, [5, 8], [0, 1]);

  const [zoomState, setZoomState] = useState<{ level: "country" | "city"; zoomed: boolean; atMax: boolean }>({
    level: "country",
    zoomed: false,
    atMax: false,
  });
  const { level, zoomed, atMax } = zoomState;
  useMotionValueEvent(k, "change", (z) => {
    const next = { level: z >= CITY_LEVEL ? ("city" as const) : ("country" as const), zoomed: z > 1.02, atMax: z >= MAP_MAX_ZOOM - 0.01 };
    setZoomState((prev) => (prev.level === next.level && prev.zoomed === next.zoomed && prev.atMax === next.atMax ? prev : next));
  });

  const flight = useRef<ReturnType<typeof animate> | null>(null);
  const userFlew = useRef(false);

  const flyTo = useCallback(
    (t: { cx: number; cy: number; k: number }, opts: { duration?: number; dip?: boolean } = {}) => {
      flight.current?.stop();
      const k0 = k.get();
      const x0 = cx.get();
      const y0 = cy.get();
      const k1 = clamp(t.k, 1, MAP_MAX_ZOOM);
      const [x1, y1] = clampCenter(t.cx, t.cy, k1);
      if (reduced) {
        k.set(k1);
        cx.set(x1);
        cy.set(y1);
        return;
      }
      const dist = Math.hypot(x1 - x0, y1 - y0);
      // Zoom auquel départ et arrivée tiennent dans la vue → la caméra « prend de la hauteur » en route
      const kBoth = Math.max(1, Math.min(k0, k1, MAP_W / Math.max(dist * 1.6, 1)));
      const dip = opts.dip === false ? 0 : Math.max(0, Math.log(Math.min(k0, k1)) - Math.log(kBoth));
      const dz = Math.abs(Math.log(k1 / k0));
      const duration = opts.duration ?? clamp(0.8 + 0.22 * (dz + 2 * dip) + dist / 900, 0.9, 2.4);
      const lk0 = Math.log(k0);
      const lk1 = Math.log(k1);
      flight.current = animate(0, 1, {
        duration,
        ease: [0.65, 0, 0.35, 1],
        onUpdate: (p) => {
          const kk = Math.exp(lk0 + (lk1 - lk0) * p - dip * Math.sin(Math.PI * p));
          const [x, y] = clampCenter(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p, kk);
          k.set(kk);
          cx.set(x);
          cy.set(y);
        },
      });
    },
    [cx, cy, k, reduced],
  );

  // Entrée : la carte se pose doucement (léger recul → échelle 1) pendant que le contour se trace
  useEffect(() => {
    if (!show || reduced || userFlew.current) return;
    k.set(0.94);
    flyTo(COUNTRY_VIEW, { duration: DRAW + 0.6, dip: false });
  }, [show, reduced, k, flyTo]);

  // Vols demandés par le parent (zone, base, ville, vue d'ensemble)
  useEffect(() => {
    if (camera.id === 0) return;
    userFlew.current = true;
    flyTo(camera);
  }, [camera, flyTo]);

  useEffect(() => () => flight.current?.stop(), []);

  /* ----- interactions directes : glisser (ordinateur), double-clic, boutons ----- */
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; width: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!fine || e.button !== 0 || k.get() <= 1.01) return;
    if ((e.target as HTMLElement).closest("button")) return;
    flight.current?.stop();
    drag.current = { x: e.clientX, y: e.clientY, cx: cx.get(), cy: cy.get(), width: e.currentTarget.getBoundingClientRect().width, moved: false };
    const onMove = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = ev.clientX - d.x;
      const dy = ev.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) < 4) return;
      d.moved = true;
      const unitsPerPx = MAP_W / k.get() / d.width;
      const [x, y] = clampCenter(d.cx - dx * unitsPerPx, d.cy - dy * unitsPerPx, k.get());
      cx.set(x);
      cy.set(y);
    };
    const onUp = () => {
      if (drag.current?.moved) suppressClick.current = true;
      drag.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const onDoubleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const z = k.get();
    const px = cx.get() + ((e.clientX - rect.left) / rect.width - 0.5) * (MAP_W / z);
    const py = cy.get() + ((e.clientY - rect.top) / rect.height - 0.5) * (MAP_H / z);
    const k1 = Math.min(MAP_MAX_ZOOM, z * 2);
    // Le point double-cliqué reste sous le curseur
    const f = z / k1;
    flyTo({ cx: px + (cx.get() - px) * f, cy: py + (cy.get() - py) * f, k: k1 }, { dip: false, duration: 0.8 });
  };

  const zoomBy = (factor: number) => {
    flyTo({ cx: cx.get(), cy: cy.get(), k: k.get() * factor }, { dip: false, duration: 0.6 });
  };

  return (
    <div className={className} ref={ref} data-motion-tree="">
      <div
        className="relative mx-auto w-full max-w-[560px] touch-manipulation select-none overflow-hidden"
        style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        onDoubleClick={onDoubleClick}
      >
        {/* Fond de carte */}
        {/* `viewBox` animé par motion (pris en charge pour la balise svg, absent du typage) */}
        <motion.svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ viewBox } as MotionStyle} className="absolute inset-0 h-full w-full" aria-hidden>
          <motion.path
            d={CI_OUTLINE_PATH}
            fill="#ffffff"
            stroke="#cfc5b5"
            strokeLinejoin="round"
            style={{ strokeWidth }}
            initial={reduced ? false : { pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: on ? 1 : 0, fillOpacity: on ? 1 : 0 }}
            transition={{ pathLength: { duration: DRAW, ease: EASE_EXPO }, fillOpacity: { duration: 0.8, delay: DRAW * 0.55 } }}
          />
        </motion.svg>

        {/* Toponymes (visibles une fois zoomé sur Abidjan) */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: areaOpacity }} aria-hidden data-zoom-layer="">
          {areaLabels.map((a) => (
            <Positioned key={a.key} lat={a.lat} lng={a.lng} cam={cam} className="-translate-x-1/2 -translate-y-1/2">
              {a.key === "abidjan" ? (
                <span className="block whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-3">{labels.abidjan}</span>
              ) : (
                <span className="block whitespace-nowrap font-serif text-[0.8125rem] italic text-ink-3">{a.key === "lagoon" ? labels.lagoon : labels.ocean}</span>
              )}
            </Positioned>
          ))}
        </motion.div>

        {/* Villes repères */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: refOpacity }} aria-hidden>
          {cities.map((c, i) => (
            <Positioned key={c.label} lat={c.lat} lng={c.lng} cam={cam} className="-translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="flex items-center gap-1.5"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.5, delay: DRAW * 0.7 + i * 0.08 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
                <span className="text-[0.6875rem] text-ink-3 md:text-[0.75rem]">{c.label}</span>
              </motion.div>
            </Positioned>
          ))}
        </motion.div>

        {/* Niveau pays : villes Excellence Group */}
        <motion.div className={cn("absolute inset-0", level === "city" && "pointer-events-none")} style={{ opacity: cityOpacity }} inert={level === "city"}>
          {pins.map((p, i) => {
            const lit = highlighted.includes(p.key);
            const side: LabelSide = p.key === "abidjan" ? "left" : "right";
            const delay = DRAW * 0.85 + i * 0.12;
            return (
              <Positioned key={p.key} lat={p.lat} lng={p.lng} cam={cam} className="-translate-x-1/2 -translate-y-1/2">
                <motion.button
                  type="button"
                  aria-label={`${p.label} — ${p.countLabel}`}
                  onClick={() => onSelectCity(p.key)}
                  className={cn(
                    "group/pin relative block rounded-full border-2 border-red transition-colors duration-300",
                    p.primary ? "h-4 w-4" : "h-3 w-3",
                    lit ? "bg-red" : "bg-white hover:bg-red",
                  )}
                  initial={reduced ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22, delay: on ? delay : 0 }}
                >
                  {/* Halo lorsque la ville appartient à la zone sélectionnée */}
                  {lit && !reduced && (
                    <motion.span
                      key={`${p.key}-${zone}`}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 1.1, ease: "easeOut", delay: on ? 0.1 : delay }}
                      aria-hidden
                    />
                  )}
                  {/* Info-bulle au survol / focus */}
                  <span
                    role="presentation"
                    className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap border border-line bg-white px-2.5 py-1.5 text-[0.75rem] text-ink opacity-0 shadow-[0_8px_20px_-12px_rgba(27,21,23,0.35)] transition-opacity duration-200 group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100"
                  >
                    {p.countLabel}
                  </span>
                </motion.button>
                <motion.span
                  className={cn(
                    "pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium leading-none transition-colors duration-300 md:text-[0.8125rem]",
                    lit ? "text-ink" : "text-ink-2",
                    sideClass[side],
                  )}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: on ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: delay + 0.15 }}
                >
                  {p.label}
                </motion.span>
              </Positioned>
            );
          })}
        </motion.div>

        {/* Niveau ville : bases */}
        <motion.div
          className={cn("absolute inset-0", level === "country" && "pointer-events-none")}
          style={{ opacity: baseOpacity }}
          inert={level === "country"}
          data-zoom-layer=""
        >
          {bases.map((b) => {
            const active = b.id === activeBase;
            const inZone = b.zone === zone;
            return (
              <BasePin
                key={b.id}
                base={b}
                cam={cam}
                active={active}
                inZone={inZone}
                reduced={reduced}
                onSelect={() => onSelectBase(b.id)}
              />
            );
          })}
        </motion.div>

        {/* Contrôles de la caméra */}
        <div className="absolute bottom-3 right-3 flex flex-col border border-line bg-white shadow-[0_8px_20px_-14px_rgba(27,21,23,0.35)]">
          <button
            type="button"
            aria-label={labels.zoomIn}
            title={labels.zoomIn}
            disabled={atMax}
            onClick={() => zoomBy(1.8)}
            className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-paper disabled:text-ink-3/50 disabled:hover:bg-white"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={labels.zoomOut}
            title={labels.zoomOut}
            disabled={!zoomed}
            onClick={() => zoomBy(1 / 1.8)}
            className="flex h-9 w-9 items-center justify-center border-t border-line text-ink transition-colors hover:bg-paper disabled:text-ink-3/50 disabled:hover:bg-white"
          >
            <Minus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
          <AnimatePresence initial={false}>
            {zoomed && (
              <motion.button
                type="button"
                aria-label={labels.resetView}
                title={labels.resetView}
                onClick={onReset}
                className="flex h-9 w-9 items-center justify-center border-t border-line text-red transition-colors hover:bg-paper"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 36, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                <Maximize className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
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
          {labels.legendBases}
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-line-2" aria-hidden />
          {labels.legendCities}
        </li>
      </motion.ul>
    </div>
  );
}

/* ------------------------------------------------------------------
   Épingle d'une base
------------------------------------------------------------------- */

function BasePin({
  base: b,
  cam,
  active,
  inZone,
  reduced,
  onSelect,
}: {
  base: MapBaseView;
  cam: Cam;
  active: boolean;
  inZone: boolean;
  reduced: boolean;
  onSelect: () => void;
}) {
  // Étiquette masquée tant que le zoom ne sépare pas assez les bases voisines ;
  // les bases hors de la zone sélectionnée ne sont nommées qu'en zoom rapproché
  const minK = Math.max(b.labelMinK ?? 0, inZone ? 0 : 14);
  const labelOpacity = useTransform(cam.k, (z) => (z >= minK ? 1 : 0));

  return (
    <Positioned lat={b.lat} lng={b.lng} cam={cam} className={cn("-translate-x-1/2 -translate-y-1/2", active && "z-20")}>
      <button
        type="button"
        aria-label={`${b.area} — ${b.place}`}
        aria-pressed={active}
        onClick={onSelect}
        className="group/base relative block h-6 w-6 -m-1.5 p-1.5"
      >
        <motion.span
          className={cn(
            "block h-3 w-3 rounded-full border-[1.5px] shadow-[0_1px_2px_rgba(27,21,23,0.25)] transition-colors duration-300",
            inZone || active ? "border-white bg-red" : "border-red bg-white group-hover/base:bg-red",
          )}
          animate={{ scale: active ? 1.35 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
        />
        {active && !reduced && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
            aria-hidden
          />
        )}
        {/* Étiquette : selon le zoom, ou au survol / focus / sélection */}
        <motion.span
          className={cn(
            "pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium leading-none [text-shadow:0_0_2px_#fff,0_0_3px_#fff] md:text-[0.8125rem]",
            inZone || active ? "text-ink" : "text-ink-2",
            sideClass[b.labelSide],
            // au survol, l'étiquette est forcée visible via la classe (l'opacité motion reste à 0 → on la contourne avec !important)
            "group-hover/base:opacity-100! group-focus-visible/base:opacity-100!",
            active && "opacity-100!",
          )}
          style={{ opacity: labelOpacity }}
          aria-hidden
        >
          {b.area}
        </motion.span>
      </button>

      {/* Fiche de la base sélectionnée */}
      <AnimatePresence>
        {active && (
          <motion.div
            role="status"
            className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-max max-w-[15rem] border border-line bg-white px-3 py-2 text-left shadow-[0_10px_24px_-14px_rgba(27,21,23,0.4)]"
            initial={{ opacity: 0, x: "-50%", y: 6 }}
            animate={{ opacity: 1, x: "-50%", y: 0 }}
            exit={{ opacity: 0, x: "-50%", y: 6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: EASE_OUT, delay: reduced ? 0 : 0.5 }}
          >
            <p className="text-[0.8125rem] font-medium leading-snug text-ink">
              {b.area}
              {b.city && b.city !== b.area ? <span className="font-normal text-ink-3"> — {b.city}</span> : null}
            </p>
            <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-2">{b.place}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Positioned>
  );
}
