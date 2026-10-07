"use client";

import { useId, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { bacRates, bepcRates, type RatePoint } from "@/data/stats";
import { laureates2026 } from "@/data/laureates";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

type Props = { locale: Locale; dict: Dictionary["results"] };

const PREVIEW_ROWS = 10;

export function Results({ locale, dict }: Props) {
  const [series, setSeries] = useState<"bac" | "bepc">("bac");
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? laureates2026 : laureates2026.slice(0, PREVIEW_ROWS);
  const tabsId = useId();

  return (
    <section id="results">
      {/* ---- Bloc chiffres : fond bordeaux ---- */}
      <div className="section bg-red-dark text-white">
        <div className="wrap">
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} dark />

          <dl className="mt-12 grid grid-cols-2 border-t border-white/15 md:mt-16 lg:grid-cols-4">
            {dict.counters.map((c, i) => (
              <div
                key={c.label}
                className={cn(
                  "flex flex-col gap-3 py-7 pr-4 lg:py-9",
                  i % 2 === 1 && "border-l border-white/15 pl-6 lg:pl-8",
                  i >= 2 && "border-t border-white/15 lg:border-t-0",
                  i === 2 && "lg:border-l lg:pl-8",
                  i === 3 && "lg:pl-8",
                )}
              >
                <dd className="t-stat order-1 text-white">
                  <Counter value={c.value} locale={locale} decimals={c.decimals} suffix={c.suffix} delay={0.08 * i} />
                </dd>
                <dt className="order-2 text-[0.9375rem] leading-snug text-white/75">{c.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Graphique */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-3">
                <h3 className="t-h3 text-white">{dict.chartTitle}</h3>
                <div role="tablist" aria-label={dict.chartTitle} className="-mb-[13px] flex gap-6 text-[0.9375rem]">
                  {(["bac", "bepc"] as const).map((s) => (
                    <button
                      key={s}
                      id={`${tabsId}-${s}`}
                      role="tab"
                      type="button"
                      aria-selected={series === s}
                      onClick={() => setSeries(s)}
                      className={cn(
                        "border-b-2 pb-3 transition-colors",
                        series === s ? "border-gold-light font-medium text-white" : "border-transparent text-white/60 hover:text-white",
                      )}
                    >
                      {s === "bac" ? dict.chartBac : dict.chartBepc}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6" role="tabpanel" aria-labelledby={`${tabsId}-${series}`}>
                <RateChart key={series} data={series === "bac" ? bacRates : bepcRates} locale={locale} />
              </div>
              <p className="mt-4 text-[0.8125rem] text-white/60">{dict.chartNote}</p>
            </div>

            {/* Mentions */}
            <div className="lg:col-span-4">
              <h3 className="border-b border-white/15 pb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-gold-light">
                {dict.mentionsTitle}
              </h3>
              <ul className="divide-y divide-white/15">
                {dict.mentions.map((m) => (
                  <li key={m.label} className="flex items-baseline justify-between gap-4 py-4">
                    <span className="text-[0.9375rem] text-white/80">{m.label}</span>
                    <span className="font-serif text-[1.75rem] font-semibold leading-none tabular-nums">{m.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Lauréats : fond papier ---- */}
      <div className="section bg-paper">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="t-eyebrow">2026</p>
              <h3 className="t-h2 mt-3 text-ink">{dict.laureatesTitle}</h3>
              <p className="t-lead mt-4 max-w-sm">{dict.laureatesLead}</p>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-[0.9375rem]">
                    <caption className="sr-only">{dict.laureatesTitle}</caption>
                    <thead>
                      <tr className="border-b border-ink/60 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
                        <th scope="col" className="w-16 py-3 pr-3 font-semibold">{dict.rank}</th>
                        <th scope="col" className="py-3 pr-3 font-semibold">{dict.name}</th>
                        <th scope="col" className="py-3 pr-3 font-semibold">{dict.series}</th>
                        <th scope="col" className="py-3 pr-3 text-right font-semibold">{dict.points}</th>
                        <th scope="col" className="py-3 pl-3 text-right font-semibold">{dict.mention}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((l) => {
                        const top = l.rank <= 3;
                        return (
                          <tr
                            key={l.rank}
                            className={cn("border-b border-line transition-colors hover:bg-cream/70", top && "bg-gold-pale")}
                          >
                            <td className="py-3 pr-3 font-serif text-[1.0625rem] text-red tabular-nums">{l.rank}</td>
                            <td className="py-3 pr-3 text-ink">{l.name}</td>
                            <td className="py-3 pr-3 text-ink-2">{l.series}</td>
                            <td className="py-3 pr-3 text-right tabular-nums text-ink">
                              {formatNumber(l.points, locale)}
                              <span className="ml-1 text-[0.8125rem] text-ink-3">{dict.pts}</span>
                            </td>
                            <td className="py-3 pl-3 text-right">
                              <span
                                className={cn(
                                  "inline-block rounded-[2px] border px-2 py-0.5 text-[0.75rem] font-medium",
                                  l.mention === "TB" ? "border-gold bg-white text-gold-text" : "border-line bg-white text-ink-2",
                                )}
                              >
                                {l.mention === "TB" ? dict.mentionTB : dict.mentionB}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="t-caption">
                    {shown.length} / {laureates2026.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                    aria-expanded={expanded}
                    className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-red hover:text-red-dark"
                  >
                    <span className="link-ul">{expanded ? dict.showLess : dict.showAll}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")} aria-hidden />
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Graphique SVG : courbe des taux, sur fond bordeaux                  */
/* ------------------------------------------------------------------ */
function RateChart({ data, locale }: { data: RatePoint[]; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number>(data.length - 1);
  const gradId = useId();

  const W = 800;
  const H = 300;
  const padX = 36;
  const padTop = 36;
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

  const path = useMemo(() => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "), [pts]);
  const area = `${path} L ${pts[pts.length - 1].x} ${H - padBottom} L ${pts[0].x} ${H - padBottom} Z`;
  const a = pts[active];
  const tipW = 150;
  const tipX = Math.min(Math.max(a.x - tipW / 2, 0), W - tipW);

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${a.d.session} : ${formatPercent(a.d.rate, locale)}`}>
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e9d9a8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e9d9a8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grille */}
        {[50, 60, 70, 80, 90, 100].map((v) => {
          const y = padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBottom);
          return (
            <g key={v}>
              <line x1={padX} x2={W - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.12)" />
              <text x={padX - 10} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.55)" fontSize="11">
                {v}
              </text>
            </g>
          );
        })}

        <motion.path
          d={area}
          fill={`url(#${gradId})`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#e9d9a8"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {pts.map((p, i) => (
          <g
            key={p.d.session}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            tabIndex={0}
            role="button"
            aria-label={`${p.d.session} : ${formatPercent(p.d.rate, locale)}`}
            className="cursor-pointer outline-none"
          >
            <rect x={p.x - 18} y={0} width={36} height={H} fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={active === i ? 5 : 3}
              fill={active === i ? "#ffffff" : "#8f0219"}
              stroke="#e9d9a8"
              strokeWidth={1.5}
            />
            <text
              x={p.x}
              y={H - 14}
              textAnchor="middle"
              fill={active === i ? "#ffffff" : "rgba(255,255,255,0.55)"}
              fontSize="11"
              fontWeight={active === i ? 600 : 400}
            >
              {p.d.short}
            </text>
          </g>
        ))}

        {/* Info-bulle */}
        <g>
          <line x1={a.x} x2={a.x} y1={a.y + 6} y2={H - padBottom} stroke="rgba(255,255,255,0.25)" strokeDasharray="2 4" />
          <rect x={tipX} y={a.y - 44} width={tipW} height={28} rx={2} fill="#ffffff" />
          <text x={tipX + tipW / 2} y={a.y - 25} textAnchor="middle" fill="#1b1517" fontSize="12" fontWeight={600}>
            {a.d.session} · {formatPercent(a.d.rate, locale)}
          </text>
        </g>
      </svg>
    </div>
  );
}
