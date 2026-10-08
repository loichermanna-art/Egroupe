"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { bacRates, bepcRates, type RatePoint } from "@/data/stats";
import { laureates2026 } from "@/data/laureates";
import { site } from "@/data/site";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, Rule, Stagger, Item, useReveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { CircledCounter, PenUnderline } from "@/components/motion/PenMark";
import { SplitLines } from "@/components/motion/SplitLines";
import { EASE_EXPO, EASE_OUT, useMotionContext } from "@/components/motion/MotionProvider";

type Props = { locale: Locale; dict: Dictionary["results"] };

const PREVIEW_ROWS = 10;

export function Results({ locale, dict }: Props) {
  const [series, setSeries] = useState<"bac" | "bepc">("bac");
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? laureates2026 : laureates2026.slice(0, PREVIEW_ROWS);
  const tabsId = useId();
  const { reduced } = useMotionContext();

  const lastBac = bacRates[bacRates.length - 1];
  const prevBac = bacRates[bacRates.length - 2];
  const lastBepc = bepcRates[bepcRates.length - 1];
  const prevBepc = bepcRates[bepcRates.length - 2];

  const figures = [
    { key: "bac", value: lastBac.rate, decimals: 2, percent: true, label: dict.figures.bac, previous: formatPercent(prevBac.rate, locale) },
    { key: "bepc", value: lastBepc.rate, decimals: 2, percent: true, label: dict.figures.bepc, previous: formatPercent(prevBepc.rate, locale) },
    { key: "graduates", value: site.stats.graduates2026, decimals: 0, percent: false, label: dict.figures.graduates, previous: null },
  ];
  const pct = locale === "fr" ? " %" : "%";

  return (
    <section id="results">
      {/* ---- Chiffres de la session : bloc bordeaux ---- */}
      <div className="section bg-red-dark text-white" data-margin-dark="">
        <div className="wrap">
          <SectionHeader title={dict.title} lead={dict.lead} dark />

          <div className="mt-10 md:mt-12">
            <Rule className="bg-white/20" />
            <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-10">
              {/* Chiffres clés */}
              <div className="lg:col-span-8">
                <Reveal as="p" kind="fade" className="t-label text-gold-light" delay={0.1}>
                  {dict.sessionLabel}
                </Reveal>
                <Stagger as="dl" className="mt-4 grid gap-8 sm:grid-cols-3 sm:gap-6" gap={0.12} delay={0.2}>
                  {figures.map((f, i) => (
                    <Item key={f.key} className={cn(i > 0 && "sm:border-l sm:border-white/20 sm:pl-6")}>
                      <dd className="t-stat">
                        {f.key === "bac" ? (
                          /* Le stylo du correcteur entoure le résultat principal une fois le compteur arrivé */
                          <CircledCounter value={f.value} locale={locale} decimals={f.decimals} suffix={pct} delay={0.3} duration={1.8} color="gold" />
                        ) : (
                          <Counter value={f.value} locale={locale} decimals={f.decimals} suffix={f.percent ? pct : ""} delay={0.3 + i * 0.12} duration={1.8} />
                        )}
                      </dd>
                      <dt className="mt-2 text-[0.9375rem] leading-snug text-white/80">{f.label}</dt>
                      {f.previous && (
                        <p className="mt-2 text-[0.8125rem] text-white/55">
                          {dict.previousLabel} {f.previous}
                        </p>
                      )}
                    </Item>
                  ))}
                </Stagger>
              </div>

              {/* Mentions */}
              <div className="lg:col-span-4">
                <Reveal as="p" kind="fade" className="t-label text-gold-light" delay={0.3}>
                  {dict.mentionsTitle}
                </Reveal>
                <Stagger as="ul" className="mt-3 divide-y divide-white/20 border-y border-white/20" gap={0.1} delay={0.4}>
                  {dict.mentions.map((m) => (
                    <Item as="li" key={m.label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <span className="text-[0.9375rem] text-white/80">{m.label}</span>
                      <span className="font-serif text-[1.375rem] font-semibold leading-none tabular-nums">{m.value}</span>
                    </Item>
                  ))}
                </Stagger>
              </div>
            </div>
          </div>

          {/* Graphique */}
          <div className="mt-12 md:mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-3">
              <SplitLines as="h3" text={dict.chartTitle} className="t-h3 text-white" />
              <Reveal kind="fade" delay={0.3} className="-mb-[13px]">
                <div role="tablist" aria-label={dict.chartTitle} className="flex gap-6 text-[0.9375rem]">
                  {(["bac", "bepc"] as const).map((s) => (
                    <button
                      key={s}
                      id={`${tabsId}-${s}`}
                      role="tab"
                      type="button"
                      aria-selected={series === s}
                      onClick={() => setSeries(s)}
                      className={cn(
                        "relative pb-3 transition-colors duration-300",
                        series === s ? "font-medium text-white" : "text-white/60 hover:text-white",
                      )}
                    >
                      {s === "bac" ? dict.chartBac : dict.chartBepc}
                      {series === s && (
                        <motion.span
                          layoutId="chart-tab"
                          className="absolute inset-x-0 bottom-0 h-[2px] bg-gold-light"
                          transition={{ type: "spring", stiffness: 420, damping: 38 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </Reveal>
            </div>
            <Rule className="bg-white/20" />
            {/* Sur petit écran, le graphique défile horizontalement plutôt que de devenir illisible */}
            <div className="mt-6 overflow-x-auto" role="tabpanel" aria-labelledby={`${tabsId}-${series}`} data-lenis-prevent>
              <div className="min-w-[560px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={series}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                  >
                    <RateChart data={series === "bac" ? bacRates : bepcRates} locale={locale} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <Reveal kind="fade" delay={0.6} className="mt-4 flex flex-col gap-1 text-[0.8125rem] text-white/60 sm:flex-row sm:justify-between">
              <p>{dict.chartNote}</p>
              <p>{dict.source}</p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ---- Lauréats : fond papier ---- */}
      <div className="section bg-paper">
        <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SplitLines as="h3" text={dict.laureatesTitle} className="t-h2 text-ink" />
            <Reveal as="p" className="t-lead mt-4 max-w-sm" delay={0.25}>
              {dict.laureatesLead}
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="overflow-x-auto" data-lenis-prevent>
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
                <LaureateRows rows={shown} locale={locale} dict={dict} />
              </table>
            </div>
            <Reveal kind="fade" delay={0.5} className="mt-4 flex flex-wrap items-center justify-between gap-4">
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
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", expanded && "rotate-180")} aria-hidden />
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Lignes du tableau : cascade à l'entrée, puis cascade des lignes ajoutées */
/* ------------------------------------------------------------------ */
function LaureateRows({
  rows,
  locale,
  dict,
}: {
  rows: typeof laureates2026;
  locale: Locale;
  dict: Dictionary["results"];
}) {
  const { ref, show, reduced } = useReveal<HTMLTableSectionElement>();
  return (
    <tbody ref={ref}>
      <AnimatePresence initial={false}>
        {rows.map((l, i) => {
          const top = l.rank <= 3;
          const firstBatch = i < PREVIEW_ROWS;
          return (
            <motion.tr
              key={l.rank}
              data-motion=""
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={firstBatch && !show ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: firstBatch ? 0.15 + i * 0.05 : (i - PREVIEW_ROWS) * 0.025 }}
              className={cn("border-b border-line transition-colors hover:bg-cream/70", top && "bg-gold-pale")}
            >
              <td className="py-2.5 pr-3 tabular-nums text-ink-2">{l.rank}</td>
              <td className="py-2.5 pr-3 font-medium text-ink">
                {l.rank === 1 ? (
                  <PenUnderline color="gold" delay={0.9}>
                    {l.name}
                  </PenUnderline>
                ) : (
                  l.name
                )}
              </td>
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
            </motion.tr>
          );
        })}
      </AnimatePresence>
    </tbody>
  );
}

/* ------------------------------------------------------------------ */
/* Graphique SVG : la courbe se trace, les points apparaissent en cascade */
/* ------------------------------------------------------------------ */
function RateChart({ data, locale }: { data: RatePoint[]; locale: Locale }) {
  const [active, setActive] = useState<number>(data.length - 1);
  const { ref, show, reduced } = useReveal<HTMLDivElement>();

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
  const drawDuration = 1.6;

  return (
    <div ref={ref} data-motion-tree="">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${a.d.session} : ${formatPercent(a.d.rate, locale)}`}>
        {/* Grille */}
        {[50, 60, 70, 80, 90, 100].map((v, i) => {
          const y = padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBottom);
          return (
            <motion.g
              key={v}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: show || reduced ? 1 : 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <line x1={padX} x2={W - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.14)" />
              <text x={padX - 10} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.55)" fontSize="11">
                {v}
              </text>
            </motion.g>
          );
        })}

        <motion.path
          d={area}
          fill="rgba(255,255,255,0.06)"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: show || reduced ? 1 : 0 }}
          transition={{ duration: 0.8, delay: drawDuration * 0.6 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#e9d9a8"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: show || reduced ? 1 : 0 }}
          transition={{ duration: drawDuration, ease: EASE_EXPO }}
        />

        {pts.map((p, i) => {
          const delay = 0.15 + (i / (pts.length - 1)) * (drawDuration - 0.3);
          return (
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
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={active === i ? 5 : 3}
                fill={active === i ? "#ffffff" : "#8f0219"}
                stroke="#e9d9a8"
                strokeWidth={1.5}
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: show || reduced ? 1 : 0, opacity: show || reduced ? 1 : 0 }}
                transition={{ duration: 0.35, delay, ease: EASE_OUT }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              />
              <motion.text
                x={p.x}
                y={H - 12}
                textAnchor="middle"
                fill={active === i ? "#ffffff" : "rgba(255,255,255,0.55)"}
                fontSize="11"
                fontWeight={active === i ? 600 : 400}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: show || reduced ? 1 : 0 }}
                transition={{ duration: 0.4, delay }}
              >
                {p.d.short}
              </motion.text>
            </g>
          );
        })}

        {/* Info-bulle : suit le point actif */}
        <motion.g
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: show || reduced ? 1 : 0 }}
          transition={{ duration: 0.4, delay: drawDuration }}
        >
          <motion.line
            x1={a.x}
            x2={a.x}
            y1={a.y + 6}
            y2={H - padBottom}
            stroke="rgba(255,255,255,0.3)"
            strokeDasharray="2 4"
            animate={{ x1: a.x, x2: a.x, y1: a.y + 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <motion.rect
            width={tipW}
            height={26}
            fill="#ffffff"
            animate={{ x: tipX, y: a.y - 42 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <motion.text
            textAnchor="middle"
            fill="#1b1517"
            fontSize="12"
            fontWeight={600}
            animate={{ x: tipX + tipW / 2, y: a.y - 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {a.d.session} · {formatPercent(a.d.rate, locale)}
          </motion.text>
        </motion.g>
      </svg>
    </div>
  );
}
