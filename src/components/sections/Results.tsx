"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ChevronDown, Trophy } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { bacRates, bepcRates, type RatePoint } from "@/data/stats";
import { laureates2026 } from "@/data/laureates";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

type Props = { locale: Locale; dict: Dictionary["results"] };

export function Results({ locale, dict }: Props) {
  const [series, setSeries] = useState<"bac" | "bepc">("bac");
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? laureates2026 : laureates2026.slice(0, 10);

  return (
    <section id="results" className="relative overflow-hidden bg-noir py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
      <div className="halo pointer-events-none absolute -right-[15vw] top-[20%] h-[70vmin] w-[70vmin] rounded-full opacity-70" />

      <div className="container-x">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />

        {/* ---- Compteurs ---- */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-ivoire/10 bg-ivoire/10 lg:grid-cols-4">
          {dict.counters.map((c, i) => (
            <Reveal key={c.label} delay={0.08 * i} className="bg-noir-2 p-7 md:p-9" amount={0.4}>
              <p className="font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-none text-gold">
                <Counter value={c.value} locale={locale} decimals={c.decimals} suffix={c.suffix} delay={0.1 * i} />
              </p>
              <p className="mt-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted">{c.label}</p>
            </Reveal>
          ))}
        </div>

        {/* ---- Graphique + mentions ---- */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <Reveal className="rounded-[1.5rem] border-gold-gradient p-6 md:p-9 lg:col-span-8" amount={0.2}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-2xl text-ivoire">{dict.chartTitle}</h3>
              <div className="flex rounded-full border border-ivoire/10 p-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                {(["bac", "bepc"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeries(s)}
                    className={cn(
                      "relative rounded-full px-4 py-2 transition-colors",
                      series === s ? "text-noir" : "text-muted hover:text-ivoire",
                    )}
                  >
                    {series === s && (
                      <motion.span
                        layoutId="series-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-or-3 via-or to-or-2"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{s === "bac" ? dict.chartBac : dict.chartBepc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <RateChart key={series} data={series === "bac" ? bacRates : bepcRates} locale={locale} />
            </div>
            <p className="mt-5 text-xs text-muted-2">{dict.chartNote}</p>
          </Reveal>

          <div className="grid gap-6 lg:col-span-4">
            {dict.mentions.map((m, i) => (
              <Reveal key={m.label} delay={0.1 * i} className="relative overflow-hidden rounded-[1.5rem] border border-ivoire/10 bg-noir-2 p-7" amount={0.4}>
                <Trophy className="absolute -right-3 -top-3 h-24 w-24 text-or/[0.07]" strokeWidth={1} />
                <p className="font-display text-5xl text-ivoire">{m.value}</p>
                <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-or">{m.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---- Lauréats ---- */}
        <div className="mt-28 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">2026</p>
              <h3 className="display-3 mt-4 text-ivoire">{dict.laureatesTitle}</h3>
              <p className="mt-4 text-muted">{dict.laureatesLead}</p>
            </Reveal>
            <Reveal delay={0.2} className="relative mt-10 hidden aspect-[4/5] max-w-[300px] lg:block">
              <Image
                src="/images/illustrations/diploma-hand.png"
                alt=""
                fill
                sizes="300px"
                className="object-contain object-left drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            {/* Podium top 3 */}
            <div className="grid gap-4 sm:grid-cols-3">
              {laureates2026.slice(0, 3).map((l, i) => (
                <Reveal key={l.rank} delay={0.1 * i} amount={0.3}>
                  <div
                    className={cn(
                      "relative h-full overflow-hidden rounded-3xl border p-6",
                      i === 0 ? "border-or/50 bg-gradient-to-b from-or/15 to-noir-2" : "border-ivoire/10 bg-noir-2",
                    )}
                  >
                    <span className="font-display text-5xl text-gold">{String(l.rank).padStart(2, "0")}</span>
                    <p className="mt-5 font-display text-xl leading-tight text-ivoire">{l.name}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                      {dict.seriesShort} {l.series} · {formatNumber(l.points, locale)} {dict.pts}
                    </p>
                    <span className="mt-4 inline-block rounded-full bg-or/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-or">
                      {l.mention === "TB" ? dict.mentionTB : dict.mentionB}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Tableau */}
            <Reveal className="mt-6 overflow-hidden rounded-3xl border border-ivoire/10" amount={0.1}>
              <table className="w-full text-left text-sm">
                <thead className="bg-noir-3 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-medium">{dict.rank}</th>
                    <th className="px-5 py-4 font-medium">{dict.name}</th>
                    <th className="hidden px-5 py-4 font-medium sm:table-cell">{dict.series}</th>
                    <th className="px-5 py-4 text-right font-medium">{dict.points}</th>
                    <th className="hidden px-5 py-4 text-right font-medium md:table-cell">{dict.mention}</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {shown.slice(3).map((l, i) => (
                      <motion.tr
                        key={l.rank}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.02, 0.4) } }}
                        exit={{ opacity: 0 }}
                        className="border-t border-ivoire/5 transition-colors hover:bg-or/5"
                      >
                        <td className="px-5 py-3.5 font-display text-lg text-or">{String(l.rank).padStart(2, "0")}</td>
                        <td className="px-5 py-3.5 text-ivoire/90">{l.name}</td>
                        <td className="hidden px-5 py-3.5 text-muted sm:table-cell">{l.series}</td>
                        <td className="px-5 py-3.5 text-right tabular-nums text-ivoire">{formatNumber(l.points, locale)}</td>
                        <td className="hidden px-5 py-3.5 text-right md:table-cell">
                          <span className={cn("rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em]", l.mention === "TB" ? "bg-or/15 text-or" : "bg-ivoire/5 text-muted")}>
                            {l.mention === "TB" ? dict.mentionTB : dict.mentionB}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-center gap-2 border-t border-ivoire/10 bg-noir-3 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-or transition hover:bg-noir-4"
              >
                {expanded ? dict.showLess : dict.showAll}
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-500", expanded && "rotate-180")} />
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Graphique SVG : ligne + aire, animé au scroll                       */
/* ------------------------------------------------------------------ */
function RateChart({ data, locale }: { data: RatePoint[]; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number>(data.length - 1);

  const W = 800;
  const H = 300;
  const padX = 28;
  const padTop = 30;
  const padBottom = 40;
  const min = 40;
  const max = 100;

  const pts = useMemo(
    () =>
      data.map((d, i) => ({
        x: padX + (i / (data.length - 1)) * (W - padX * 2),
        y: padTop + (1 - (d.rate - min) / (max - min)) * (H - padTop - padBottom),
        d,
      })),
    [data],
  );

  const path = useMemo(() => {
    // Courbe lissée (Catmull-Rom → Bézier)
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const t = 0.2;
      const c1x = p1.x + (p2.x - p0.x) * t;
      const c1y = p1.y + (p2.y - p0.y) * t;
      const c2x = p2.x - (p3.x - p1.x) * t;
      const c2y = p2.y - (p3.y - p1.y) * t;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [pts]);

  const area = `${path} L ${pts[pts.length - 1].x} ${H - padBottom} L ${pts[0].x} ${H - padBottom} Z`;
  const a = pts[active];

  return (
    <div ref={ref} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label="Chart">
        <defs>
          <linearGradient id="eg-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e5c25b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e5c25b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="eg-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#b07000" />
            <stop offset="50%" stopColor="#e5c25b" />
            <stop offset="100%" stopColor="#fdd401" />
          </linearGradient>
        </defs>

        {/* Grille horizontale */}
        {[50, 60, 70, 80, 90, 100].map((v) => {
          const y = padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBottom);
          return (
            <g key={v}>
              <line x1={padX} x2={W - padX} y1={y} y2={y} stroke="rgba(250,243,230,0.07)" strokeDasharray="2 6" />
              <text x={0} y={y + 4} fill="rgba(185,168,154,0.7)" fontSize="11">
                {v}%
              </text>
            </g>
          );
        })}

        {/* Aire */}
        <motion.path
          d={area}
          fill="url(#eg-area)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
        />
        {/* Ligne */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#eg-line)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Points */}
        {pts.map((p, i) => (
          <g key={p.d.session} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} className="cursor-pointer">
            <rect x={p.x - 20} y={0} width={40} height={H} fill="transparent" />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={active === i ? 7 : 4}
              fill={active === i ? "#fdd401" : "#0a0506"}
              stroke="#e5c25b"
              strokeWidth={2}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300, damping: 18 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
            <text x={p.x} y={H - 12} textAnchor="middle" fill={active === i ? "#e5c25b" : "rgba(185,168,154,0.8)"} fontSize="12" fontWeight={active === i ? 600 : 400}>
              {p.d.short}
            </text>
          </g>
        ))}

        {/* Tooltip */}
        {a && (
          <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <line x1={a.x} x2={a.x} y1={a.y} y2={H - padBottom} stroke="rgba(229,194,91,0.35)" />
            <rect x={Math.min(Math.max(a.x - 56, padX), W - padX - 112)} y={a.y - 48} width={112} height={32} rx={16} fill="#e5c25b" />
            <text x={Math.min(Math.max(a.x, padX + 56), W - padX - 56)} y={a.y - 27} textAnchor="middle" fill="#0a0506" fontSize="12" fontWeight={700}>
              {a.d.session} · {formatPercent(a.d.rate, locale)}
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
