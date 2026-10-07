"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { bacRates, bepcRates, type RatePoint } from "@/data/stats";
import { laureates2026 } from "@/data/laureates";
import { site } from "@/data/site";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { locale: Locale; dict: Dictionary["results"] };

const PREVIEW_ROWS = 10;

export function Results({ locale, dict }: Props) {
  const [series, setSeries] = useState<"bac" | "bepc">("bac");
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? laureates2026 : laureates2026.slice(0, PREVIEW_ROWS);
  const tabsId = useId();

  const lastBac = bacRates[bacRates.length - 1];
  const prevBac = bacRates[bacRates.length - 2];
  const lastBepc = bepcRates[bepcRates.length - 1];
  const prevBepc = bepcRates[bepcRates.length - 2];

  const figures = [
    { key: "bac", value: formatPercent(lastBac.rate, locale), label: dict.figures.bac, previous: formatPercent(prevBac.rate, locale) },
    { key: "bepc", value: formatPercent(lastBepc.rate, locale), label: dict.figures.bepc, previous: formatPercent(prevBepc.rate, locale) },
    { key: "graduates", value: formatNumber(site.stats.graduates2026, locale), label: dict.figures.graduates, previous: null },
  ];

  return (
    <section id="results">
      {/* ---- Chiffres de la session : bloc bordeaux ---- */}
      <div className="section bg-red-dark text-white">
        <div className="wrap">
          <SectionHeader title={dict.title} lead={dict.lead} dark />

          <div className="mt-10 grid gap-10 border-t border-white/20 pt-8 md:mt-12 lg:grid-cols-12 lg:gap-10">
            {/* Chiffres clés */}
            <div className="lg:col-span-8">
              <p className="t-label text-gold-light">{dict.sessionLabel}</p>
              <dl className="mt-4 grid gap-8 sm:grid-cols-3 sm:gap-6">
                {figures.map((f, i) => (
                  <div key={f.key} className={cn(i > 0 && "sm:border-l sm:border-white/20 sm:pl-6")}>
                    <dd className="t-stat">{f.value}</dd>
                    <dt className="mt-2 text-[0.9375rem] leading-snug text-white/80">{f.label}</dt>
                    {f.previous && (
                      <p className="mt-2 text-[0.8125rem] text-white/55">
                        {dict.previousLabel} {f.previous}
                      </p>
                    )}
                  </div>
                ))}
              </dl>
            </div>

            {/* Mentions */}
            <div className="lg:col-span-4">
              <p className="t-label text-gold-light">{dict.mentionsTitle}</p>
              <ul className="mt-3 divide-y divide-white/20 border-y border-white/20">
                {dict.mentions.map((m) => (
                  <li key={m.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span className="text-[0.9375rem] text-white/80">{m.label}</span>
                    <span className="font-serif text-[1.375rem] font-semibold leading-none tabular-nums">{m.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Graphique */}
          <div className="mt-12 md:mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/20 pb-3">
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
            {/* Sur petit écran, le graphique défile horizontalement plutôt que de devenir illisible */}
            <div className="mt-6 overflow-x-auto" role="tabpanel" aria-labelledby={`${tabsId}-${series}`}>
              <div className="min-w-[560px]">
                <RateChart key={series} data={series === "bac" ? bacRates : bepcRates} locale={locale} />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1 text-[0.8125rem] text-white/60 sm:flex-row sm:justify-between">
              <p>{dict.chartNote}</p>
              <p>{dict.source}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Lauréats : fond papier ---- */}
      <div className="section bg-paper">
        <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h3 className="t-h2 text-ink">{dict.laureatesTitle}</h3>
            <p className="t-lead mt-4 max-w-sm">{dict.laureatesLead}</p>
          </div>

          <div className="lg:col-span-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-[0.9375rem]">
                <caption className="sr-only">{dict.laureatesTitle}</caption>
                <thead>
                  <tr className="t-label border-b-2 border-ink">
                    <th scope="col" className="w-14 py-2.5 pr-3 font-semibold">{dict.rank}</th>
                    <th scope="col" className="py-2.5 pr-3 font-semibold">{dict.name}</th>
                    <th scope="col" className="py-2.5 pr-3 font-semibold">{dict.series}</th>
                    <th scope="col" className="py-2.5 pr-3 text-right font-semibold">{dict.points}</th>
                    <th scope="col" className="py-2.5 pl-3 text-right font-semibold">{dict.mention}</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((l) => {
                    const top = l.rank <= 3;
                    return (
                      <tr key={l.rank} className={cn("border-b border-line transition-colors hover:bg-cream/70", top && "bg-gold-pale")}>
                        <td className="py-2.5 pr-3 tabular-nums text-ink-2">{l.rank}</td>
                        <td className="py-2.5 pr-3 font-medium text-ink">{l.name}</td>
                        <td className="py-2.5 pr-3 text-ink-2">{l.series}</td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-ink">
                          {formatNumber(l.points, locale)}
                          <span className="ml-1 text-[0.8125rem] text-ink-3">{dict.pts}</span>
                        </td>
                        <td className="py-2.5 pl-3 text-right">
                          <span
                            className={cn(
                              "inline-block border px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight",
                              l.mention === "TB" ? "border-gold bg-white text-gold-text" : "border-line-2 bg-white text-ink-2",
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
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="t-caption" aria-live="polite">
                {dict.shownOf.replace("{shown}", String(shown.length)).replace("{total}", String(laureates2026.length))}
              </p>
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-red hover:text-red-dark"
              >
                <span className="link-ul">{expanded ? dict.showLess : dict.showAll}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-150", expanded && "rotate-180")} aria-hidden />
              </button>
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
  const [active, setActive] = useState<number>(data.length - 1);

  const W = 800;
  const H = 280;
  const padX = 36;
  const padTop = 40;
  const padBottom = 36;
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
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${a.d.session} : ${formatPercent(a.d.rate, locale)}`}>
      {/* Grille */}
      {[50, 60, 70, 80, 90, 100].map((v) => {
        const y = padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBottom);
        return (
          <g key={v}>
            <line x1={padX} x2={W - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.14)" />
            <text x={padX - 10} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.55)" fontSize="11">
              {v}
            </text>
          </g>
        );
      })}

      <path d={area} fill="rgba(255,255,255,0.06)" />
      <path d={path} fill="none" stroke="#e9d9a8" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

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
            y={H - 12}
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
        <line x1={a.x} x2={a.x} y1={a.y + 6} y2={H - padBottom} stroke="rgba(255,255,255,0.3)" strokeDasharray="2 4" />
        <rect x={tipX} y={a.y - 42} width={tipW} height={26} fill="#ffffff" />
        <text x={tipX + tipW / 2} y={a.y - 24} textAnchor="middle" fill="#1b1517" fontSize="12" fontWeight={600}>
          {a.d.session} · {formatPercent(a.d.rate, locale)}
        </text>
      </g>
    </svg>
  );
}
