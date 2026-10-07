"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
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
   Scène 3D
   Le plan de la carte (SVG) est incliné en perspective ; les repères sont
   dessinés dans une couche 2D, à la position projetée de leur point au sol.
   Toutes les longueurs sont exprimées en largeurs de conteneur, ce qui rend
   la projection indépendante de la taille réelle de la carte.
------------------------------------------------------------------- */

/** Inclinaison du plan (degrés) : vue d'ensemble plus plongeante, vue rapprochée plus rasante. */
const TILT_FAR = 38;
const TILT = 55;
/** Distance de perspective (en largeurs de conteneur). */
const PERSPECTIVE = 2;
/** Le plan est plus grand que la fenêtre pour couvrir l'écran une fois incliné. */
const PLANE = 1.6;

const DRAW = 1.6;
const CITY_LEVEL = 4.5;
const START_K = 1.35;

/** Zoom minimal : le pays entier tient dans la vue une fois le plan incliné. */
const K_MIN = 0.86;

export const COUNTRY_VIEW = { cx: MAP_W / 2, cy: MAP_H / 2, k: K_MIN };

/** Point d'intérêt placé légèrement sous le centre : la zone proche (plus grande) lui est réservée. */
function belowCenter(cy: number, k: number) {
  return cy - (0.09 * MAP_H) / k;
}

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
  const k = clamp(Math.min((0.55 * MAP_W) / w, (0.5 * MAP_H) / h), 1, maxK);
  return { cx: (minX + maxX) / 2, cy: belowCenter((minY + maxY) / 2, k), k };
}

/** Vol vers un point précis (une base). */
export function focusOn(point: { x: number; y: number }, k: number): { cx: number; cy: number; k: number } {
  return { cx: point.x, cy: belowCenter(point.y, k), k };
}

/** Le centre de la caméra reste au-dessus de la carte (au niveau pays, il est fixé au milieu). */
function clampCenter(cx: number, cy: number, k: number): [number, number] {
  if (k <= K_MIN + 0.001) return [MAP_W / 2, MAP_H / 2];
  return [clamp(cx, 0, MAP_W), clamp(cy, 0, MAP_H)];
}

type Cam = { cx: MotionValue<number>; cy: MotionValue<number>; k: MotionValue<number>; tilt: MotionValue<number> };

/** Projette un point carte (unités) vers l'écran : position en % du conteneur + facteur de perspective. */
function project(x: number, y: number, cx: number, cy: number, k: number, tiltDeg: number) {
  const th = (tiltDeg * Math.PI) / 180;
  const X = ((x - cx) * k) / MAP_W; // en largeurs de conteneur
  const Y = ((y - cy) * k) / MAP_W;
  const z = Y * Math.sin(th); // vers l'observateur pour la moitié basse du plan
  const f = PERSPECTIVE / Math.max(PERSPECTIVE - z, 0.15);
  return {
    left: 50 + X * f * 100,
    top: 50 + Y * Math.cos(th) * f * (MAP_W / MAP_H) * 100,
    f,
  };
}

/** Inverse de `project` pour le centre de l'écran → point carte (double-clic). */
function unproject(sx: number, sy: number, cx: number, cy: number, k: number, tiltDeg: number) {
  const th = (tiltDeg * Math.PI) / 180;
  const px = (sx - 50) / 100; // en largeurs de conteneur
  const py = ((sy - 50) / 100) * (MAP_H / MAP_W);
  const Y = (py * PERSPECTIVE) / (PERSPECTIVE * Math.cos(th) + py * Math.sin(th));
  const X = (px * (PERSPECTIVE - Y * Math.sin(th))) / PERSPECTIVE;
  return { x: cx + (X * MAP_W) / k, y: cy + (Y * MAP_W) / k };
}

/* ------------------------------------------------------------------
   Repère au sol : suit la caméra, grossit en s'approchant
------------------------------------------------------------------- */

function useGround(lat: number, lng: number, cam: Cam) {
  const { x, y } = useMemo(() => projectCI(lat, lng), [lat, lng]);
  const p = useTransform([cam.cx, cam.cy, cam.k, cam.tilt], ([cx, cy, k, t]: number[]) => project(x, y, cx, cy, k, t));
  const left = useTransform(p, (v) => `${v.left}%`);
  const top = useTransform(p, (v) => `${v.top}%`);
  const scale = useTransform(p, (v) => clamp(v.f, 0.55, 1.6));
  const zIndex = useTransform(p, (v) => Math.round(clamp(v.top, -50, 200) * 10));
  return { left, top, scale, zIndex };
}

function Ground({
  lat,
  lng,
  cam,
  className,
  children,
  raise,
}: {
  lat: number;
  lng: number;
  cam: Cam;
  className?: string;
  children: ReactNode;
  /** Remonte le niveau d'empilement (élément actif). */
  raise?: boolean;
}) {
  const { left, top, scale, zIndex } = useGround(lat, lng, cam);
  return (
    <motion.div className={cn("absolute h-0 w-0", className)} style={{ left, top, zIndex: raise ? 5000 : zIndex }}>
      <motion.div className="relative h-0 w-0" style={{ scale, transformOrigin: "0 0" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Position de l'étiquette par rapport au point au sol, pour une tige de hauteur `h`. */
const labelAt: Record<LabelSide, (h: number) => React.CSSProperties> = {
  right: (h) => ({ left: 10, bottom: h - 6, lineHeight: "12px" }),
  left: (h) => ({ right: 10, bottom: h - 6, lineHeight: "12px" }),
  top: (h) => ({ left: 0, bottom: h + 11, lineHeight: "12px" }),
  bottom: () => ({ left: 0, top: 6, lineHeight: "12px" }),
};
const centered = (side: LabelSide) => (side === "top" || side === "bottom" ? "-translate-x-1/2" : "");

/* ------------------------------------------------------------------
   Carte
------------------------------------------------------------------- */

/**
 * Carte de la Côte d'Ivoire en vue 3D immersive : plan incliné en perspective,
 * caméra qui vole (zoom + déplacement) vers la zone, la ville ou la base
 * choisie. À l'entrée, la caméra descend sur Abidjan pendant que le plan
 * s'incline et que le contour se trace.
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
  const inView = useInView(ref, { amount: 0.2 });
  const { fine } = useMotionContext();
  const on = show || reduced;

  /* ----- caméra ----- */
  const cx = useMotionValue(camera.cx);
  const cy = useMotionValue(camera.cy);
  const k = useMotionValue(START_K);
  /** Part de l'inclinaison appliquée (0 à plat → 1) ; l'angle final dépend du zoom. */
  const tiltAmt = useMotionValue(0);
  const tilt = useTransform([tiltAmt, k], ([a, z]: number[]) => a * (TILT_FAR + (TILT - TILT_FAR) * clamp((z - K_MIN) / 3, 0, 1)));
  const cam = useMemo<Cam>(() => ({ cx, cy, k, tilt }), [cx, cy, k, tilt]);

  // viewBox du plan (le plan est PLANE fois plus grand que la fenêtre)
  const vx = useTransform([cx, k], ([c, z]: number[]) => c - (MAP_W * PLANE) / (2 * z));
  const vy = useTransform([cy, k], ([c, z]: number[]) => c - (MAP_H * PLANE) / (2 * z));
  const vw = useTransform(k, (z) => (MAP_W * PLANE) / z);
  const vh = useTransform(k, (z) => (MAP_H * PLANE) / z);
  const viewBox = useMotionTemplate`${vx} ${vy} ${vw} ${vh}`;
  const strokeWidth = useTransform(k, (z) => 1 / z);
  const extrude = useTransform(k, (z) => 3.2 / z);
  const fontSize = useTransform(k, (z) => 13.5 / z);
  const fontSizeSmall = useTransform(k, (z) => 11.5 / z);

  const cityOpacity = useTransform(k, [3, 6], [1, 0]);
  const baseOpacity = useTransform(k, [3, 6], [0, 1]);
  const refOpacity = useTransform(k, [1.6, 3.5], [1, 0]);
  const areaOpacity = useTransform(k, [5, 8], [0, 1]);
  const fogOpacity = useTransform(k, [1, 4], [0.4, 1]);

  const [zoomState, setZoomState] = useState<{ level: "country" | "city"; zoomed: boolean; atMax: boolean }>({
    level: "country",
    zoomed: false,
    atMax: false,
  });
  const { level, zoomed, atMax } = zoomState;
  useMotionValueEvent(k, "change", (z) => {
    const next = { level: z >= CITY_LEVEL ? ("city" as const) : ("country" as const), zoomed: z > K_MIN * 1.03, atMax: z >= MAP_MAX_ZOOM - 0.01 };
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
      const k1 = clamp(t.k, K_MIN, MAP_MAX_ZOOM);
      const [x1, y1] = clampCenter(t.cx, t.cy, k1);
      if (reduced) {
        k.set(k1);
        cx.set(x1);
        cy.set(y1);
        return;
      }
      const dist = Math.hypot(x1 - x0, y1 - y0);
      // Zoom auquel départ et arrivée tiennent dans la vue → la caméra « prend de la hauteur » en route
      const kBoth = Math.max(K_MIN, Math.min(k0, k1, MAP_W / Math.max(dist * 1.6, 1)));
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

  // Entrée : le plan s'incline et la caméra descend sur la cible initiale (Abidjan)
  const initialCamera = useRef(camera);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!show) return;
    if (reduced) {
      tiltAmt.set(1);
      if (!userFlew.current) {
        const t = initialCamera.current;
        k.set(t.k);
        cx.set(t.cx);
        cy.set(t.cy);
      }
      return;
    }
    const tiltAnim = animate(tiltAmt, 1, {
      duration: 2.6,
      ease: [0.65, 0, 0.35, 1],
      delay: 0.2,
      onComplete: () => setSettled(true),
    });
    if (!userFlew.current) flyTo(initialCamera.current, { duration: 2.8, dip: false });
    return () => tiltAnim.stop();
  }, [show, reduced, tiltAmt, k, cx, cy, flyTo]);

  // Léger balancement du plan quand la carte est à l'écran (respiration, ± 1°)
  useEffect(() => {
    if (!settled || reduced || !inView) return;
    const sway = animate(tiltAmt, [1, 1.02, 0.98], {
      duration: 11,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    });
    return () => sway.stop();
  }, [settled, reduced, inView, tiltAmt]);

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
    if (!fine || e.button !== 0 || k.get() <= K_MIN * 1.02) return;
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
      const cosT = Math.cos((tilt.get() * Math.PI) / 180);
      const [x, y] = clampCenter(d.cx - dx * unitsPerPx, d.cy - (dy * unitsPerPx) / Math.max(cosT, 0.3), k.get());
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
    const sx = ((e.clientX - rect.left) / rect.width) * 100;
    const sy = ((e.clientY - rect.top) / rect.height) * 100;
    const z = k.get();
    const p = unproject(sx, sy, cx.get(), cy.get(), z, tilt.get());
    const k1 = Math.min(MAP_MAX_ZOOM, z * 2);
    // Le point double-cliqué reste (à peu près) sous le curseur
    const f = z / k1;
    flyTo({ cx: p.x + (cx.get() - p.x) * f, cy: p.y + (cy.get() - p.y) * f, k: k1 }, { dip: false, duration: 0.8 });
  };

  const zoomBy = (factor: number) => {
    flyTo({ cx: cx.get(), cy: cy.get(), k: k.get() * factor }, { dip: false, duration: 0.6 });
  };

  return (
    <div className={className} ref={ref} data-motion-tree="">
      <div className="@container mx-auto w-full max-w-[560px]">
        <div
          className="relative w-full touch-manipulation select-none overflow-hidden bg-cream [perspective:200cqw]"
          style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
          onPointerDown={onPointerDown}
          onClickCapture={onClickCapture}
          onDoubleClick={onDoubleClick}
        >
          {/* ---- Plan incliné ---- */}
          <motion.div
            className="absolute bg-cream"
            style={{
              width: `${PLANE * 100}%`,
              height: `${PLANE * 100}%`,
              left: `${(-(PLANE - 1) / 2) * 100}%`,
              top: `${(-(PLANE - 1) / 2) * 100}%`,
              rotateX: tilt,
            }}
            aria-hidden
          >
            {/* `viewBox` animé par motion (pris en charge pour la balise svg, absent du typage) */}
            <motion.svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ viewBox } as MotionStyle} className="absolute inset-0 h-full w-full">
              {/* Épaisseur du relief (copie décalée du contour) */}
              <motion.path
                d={CI_OUTLINE_PATH}
                fill="#d8cdb9"
                style={{ y: extrude }}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.8, delay: DRAW * 0.6 }}
              />
              {/* Terre */}
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
              {/* Toponymes posés au sol (visibles une fois zoomé sur Abidjan) */}
              <motion.g style={{ opacity: areaOpacity }}>
                {areaLabels.map((a) => {
                  const p = projectCI(a.lat, a.lng);
                  return a.key === "abidjan" ? (
                    <motion.text
                      key={a.key}
                      x={p.x}
                      y={p.y}
                      textAnchor="middle"
                      className="font-sans font-semibold uppercase"
                      fill="#7e7377"
                      style={{ fontSize, letterSpacing: "0.18em" }}
                    >
                      {labels.abidjan}
                    </motion.text>
                  ) : (
                    <motion.text key={a.key} x={p.x} y={p.y} textAnchor="middle" className="font-serif italic" fill="#8a7f82" style={{ fontSize: fontSizeSmall }}>
                      {a.key === "lagoon" ? labels.lagoon : labels.ocean}
                    </motion.text>
                  );
                })}
              </motion.g>
            </motion.svg>
          </motion.div>

          {/* ---- Villes repères ---- */}
          <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: refOpacity }} aria-hidden>
            {cities.map((c, i) => (
              <Ground key={c.label} lat={c.lat} lng={c.lng} cam={cam}>
                <motion.div
                  className="absolute left-0 top-0 flex -translate-y-1/2 items-center gap-1.5"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: on ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: DRAW * 0.7 + i * 0.08 }}
                >
                  <span className="h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-line-2" />
                  <span className="text-[0.6875rem] text-ink-3 md:text-[0.75rem]">{c.label}</span>
                </motion.div>
              </Ground>
            ))}
          </motion.div>

          {/* ---- Niveau pays : villes Excellence Group ---- */}
          <motion.div className={cn("absolute inset-0", level === "city" && "pointer-events-none")} style={{ opacity: cityOpacity }} inert={level === "city"}>
            {pins.map((p, i) => (
              <CityMarker
                key={p.key}
                pin={p}
                cam={cam}
                lit={highlighted.includes(p.key)}
                side={p.key === "abidjan" ? "left" : "right"}
                on={on}
                reduced={reduced}
                delay={DRAW * 0.85 + i * 0.12}
                zone={zone}
                onSelect={() => onSelectCity(p.key)}
              />
            ))}
          </motion.div>

          {/* ---- Niveau ville : bases ---- */}
          <motion.div
            className={cn("absolute inset-0", level === "country" && "pointer-events-none")}
            style={{ opacity: baseOpacity }}
            inert={level === "country"}
            data-zoom-layer=""
          >
            {bases.map((b) => (
              <BaseMarker
                key={b.id}
                base={b}
                cam={cam}
                active={b.id === activeBase}
                inZone={b.zone === zone}
                reduced={reduced}
                onSelect={() => onSelectBase(b.id)}
              />
            ))}
          </motion.div>

          {/* ---- Brume d'horizon ---- */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-[6000] h-[44%] bg-linear-to-b from-cream from-6% via-cream/70 via-45% to-transparent"
            style={{ opacity: fogOpacity }}
            aria-hidden
          />

          {/* ---- Contrôles de la caméra ---- */}
          <div className="absolute bottom-3 right-3 z-[7000] flex flex-col border border-line bg-white shadow-[0_8px_20px_-14px_rgba(27,21,23,0.35)]">
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
                  className="flex h-9 w-9 items-center justify-center overflow-hidden border-t border-line text-red transition-colors hover:bg-paper"
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
      </div>

      {/* Légende */}
      <motion.ul
        className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-2"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.5, delay: DRAW + 0.4 }}
      >
        <li className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-white bg-red shadow-[0_0_0_1px_#b20603]" aria-hidden />
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
   Repère dressé : ombre au sol, tige, tête
------------------------------------------------------------------- */

function Marker({ height, head, color, active, reduced }: { height: number; head: number; color: "red" | "white"; active?: boolean; reduced: boolean }) {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 h-[5px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/20 blur-[1px]" aria-hidden />
      <span
        className="pointer-events-none absolute bottom-0 left-0 w-px -translate-x-1/2 bg-red-dark transition-[height] duration-300"
        style={{ height }}
        aria-hidden
      />
      <motion.span
        className={cn(
          "pointer-events-none absolute left-0 rounded-full border-[1.5px] shadow-[0_1px_3px_rgba(27,21,23,0.35)] transition-[bottom,background-color,border-color] duration-300",
          color === "red" ? "border-white bg-red" : "border-red bg-white",
        )}
        style={{ bottom: height - head / 2, width: head, height: head, x: "-50%" }}
        animate={{ scale: active ? 1.3 : 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        aria-hidden
      />
      {active && !reduced && (
        <motion.span
          className="pointer-events-none absolute left-0 h-3 w-3 rounded-full border border-red"
          style={{ bottom: height - 6, x: "-50%" }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 3.4, opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
          aria-hidden
        />
      )}
    </>
  );
}

function CityMarker({
  pin: p,
  cam,
  lit,
  side,
  on,
  reduced,
  delay,
  zone,
  onSelect,
}: {
  pin: MapPinView;
  cam: Cam;
  lit: boolean;
  side: LabelSide;
  on: boolean;
  reduced: boolean;
  delay: number;
  zone: ZoneKey;
  onSelect: () => void;
}) {
  const height = p.primary ? 22 : 16;
  const head = p.primary ? 14 : 11;
  return (
    <Ground lat={p.lat} lng={p.lng} cam={cam}>
      <motion.div
        className="group/pin absolute left-0 top-0 h-0 w-0"
        style={{ transformOrigin: "0 0" }}
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 22, delay: on ? delay : 0 }}
      >
        <Marker height={height} head={head} color={lit ? "red" : "white"} reduced={reduced} />
        {/* Halo lorsque la ville appartient à la zone sélectionnée */}
        {lit && !reduced && (
          <motion.span
            key={`${p.key}-${zone}`}
            className="pointer-events-none absolute left-0 h-3 w-3 rounded-full border border-red"
            style={{ bottom: height - 6, x: "-50%" }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: on ? 0.1 : delay }}
            aria-hidden
          />
        )}
        <button
          type="button"
          aria-label={`${p.label} — ${p.countLabel}`}
          onClick={onSelect}
          className="absolute bottom-[-6px] left-0 w-7 -translate-x-1/2"
          style={{ height: height + head + 6 }}
        />
        <span
          className={cn(
            "pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium [text-shadow:0_0_2px_#fff,0_0_3px_#fff] transition-colors duration-300 md:text-[0.8125rem]",
            lit ? "text-ink" : "text-ink-2",
            centered(side),
          )}
          style={labelAt[side](height)}
        >
          {p.label}
        </span>
        {/* Info-bulle au survol / focus */}
        <span
          role="presentation"
          className="pointer-events-none absolute left-0 top-2 z-10 -translate-x-1/2 whitespace-nowrap border border-line bg-white px-2.5 py-1.5 text-[0.75rem] text-ink opacity-0 shadow-[0_8px_20px_-12px_rgba(27,21,23,0.35)] transition-opacity duration-200 group-hover/pin:opacity-100 group-focus-within/pin:opacity-100"
        >
          {p.countLabel}
        </span>
      </motion.div>
    </Ground>
  );
}

function BaseMarker({
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
  const height = active ? 24 : 16;
  const head = 11;

  return (
    <Ground lat={b.lat} lng={b.lng} cam={cam} raise={active}>
      <div className="group/base absolute left-0 top-0 h-0 w-0">
        <Marker height={height} head={head} color={inZone || active ? "red" : "white"} active={active} reduced={reduced} />
        <button
          type="button"
          aria-label={`${b.area} — ${b.place}`}
          aria-pressed={active}
          onClick={onSelect}
          className="absolute bottom-[-6px] left-0 w-7 -translate-x-1/2"
          style={{ height: height + head + 6 }}
        />
        {/* Étiquette : selon le zoom, ou au survol / focus */}
        <motion.span
          className={cn(
            "pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium [text-shadow:0_0_2px_#fff,0_0_3px_#fff] md:text-[0.8125rem]",
            inZone || active ? "text-ink" : "text-ink-2",
            centered(b.labelSide),
            // La fiche remplace l'étiquette quand la base est sélectionnée
            active ? "opacity-0!" : "group-hover/base:opacity-100! group-focus-within/base:opacity-100!",
          )}
          style={{ opacity: labelOpacity, ...labelAt[b.labelSide](height) }}
          aria-hidden
        >
          {b.area}
        </motion.span>

        {/* Fiche de la base sélectionnée */}
        <AnimatePresence>
          {active && (
            <motion.div
              role="status"
              className="pointer-events-none absolute left-0 w-max max-w-[15rem] border border-line bg-white px-3 py-2 text-left shadow-[0_10px_24px_-14px_rgba(27,21,23,0.4)]"
              style={{ bottom: height + head + 10 }}
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
      </div>
    </Ground>
  );
}
