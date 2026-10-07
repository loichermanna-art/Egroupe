"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MonitorSmartphone, KeyRound, GraduationCap, Clock3, Wifi, BatteryFull, Signal, Play, BookOpen, CheckCircle2 } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type Props = { dict: Dictionary["learning"] };

const featureIcons = [MonitorSmartphone, KeyRound, GraduationCap];

export function Learning({ dict }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [0, 0, 0] : [14, 0, -8]);
  const yPhone = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -60]);

  return (
    <section id="learning" className="relative overflow-hidden bg-noir-2 py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50 mask-fade-b" />

      <div className="container-x grid items-center gap-16 lg:grid-cols-12">
        {/* ---- Texte ---- */}
        <div className="lg:col-span-6">
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />

          <ul className="mt-12 space-y-6">
            {dict.features.map((f, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <Reveal key={f.title} as="li" delay={0.08 * i} y={20}>
                  <div className="flex gap-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-or/30 bg-noir text-or">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="font-display text-xl text-ivoire">{f.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-4">
            <Button href={site.links.learningWeb} external variant="gold" size="md">
              {dict.ctaWeb}
            </Button>
            <Button href={site.links.playStore} external variant="outline" size="md" icon={false}>
              {dict.ctaStores}
            </Button>
          </Reveal>

          {/* Horaires */}
          <Reveal delay={0.1} className="mt-14 rounded-3xl border border-ivoire/10 bg-noir/60 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-or" strokeWidth={1.6} />
              <h3 className="font-display text-xl text-ivoire">{dict.scheduleTitle}</h3>
            </div>
            <ul className="mt-6 divide-y divide-ivoire/8">
              {dict.schedule.map((s) => (
                <li key={s.days} className="flex flex-wrap items-baseline justify-between gap-2 py-3.5">
                  <span className="text-sm text-ivoire/85">{s.days}</span>
                  <span className="font-display text-lg text-or">
                    {s.hours}
                    {s.note ? <span className="ml-2 font-sans text-xs text-muted">({s.note})</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ---- Téléphone ---- */}
        <div ref={ref} className="relative flex justify-center lg:col-span-6 [perspective:1600px]">
          <div className="halo absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <motion.div
            style={{ rotateX, y: yPhone }}
            className="relative w-[300px] sm:w-[330px]"
          >
            {/* Coque */}
            <div className="relative aspect-[9/19] overflow-hidden rounded-[3rem] border border-ivoire/15 bg-noir p-2 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)]">
              <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-noir-3 via-noir-2 to-noir">
                {/* Encoche */}
                <div className="absolute left-1/2 top-3 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-noir" />
                {/* Barre d'état */}
                <div className="flex items-center justify-between px-7 pt-4 text-[0.6rem] text-ivoire/70">
                  <span>09:41</span>
                  <span className="flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <BatteryFull className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Contenu */}
                <div className="px-5 pt-8">
                  <p className="text-[0.6rem] uppercase tracking-[0.25em] text-or">EgroupLearning</p>
                  <p className="mt-2 font-display text-xl text-ivoire">{dict.phone.greeting}</p>
                  <p className="text-xs text-muted">{dict.phone.sub}</p>

                  {/* Progression */}
                  <div className="mt-5 rounded-2xl border border-or/25 bg-gradient-to-br from-or/15 to-transparent p-4">
                    <div className="flex items-center justify-between text-[0.65rem] text-ivoire/80">
                      <span>{dict.phone.progressLabel}</span>
                      <span className="font-semibold text-or">78%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivoire/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-or to-jaune"
                        initial={{ width: 0 }}
                        whileInView={{ width: "78%" }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>

                  {/* Cours */}
                  <ul className="mt-5 space-y-2.5">
                    {dict.phone.courses.map((c, i) => (
                      <motion.li
                        key={c}
                        className="flex items-center gap-3 rounded-xl border border-ivoire/8 bg-noir/50 px-3 py-2.5"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-or/15 text-or">
                          {i === 0 ? <Play className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                        </span>
                        <span className="flex-1 text-[0.72rem] text-ivoire/90">{c}</span>
                        {i === 2 && <CheckCircle2 className="h-4 w-4 text-or" />}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-xl bg-rouge/25 px-3 py-2.5 text-center text-[0.65rem] font-medium text-ivoire">
                    {dict.phone.nextTest}
                  </div>
                </div>

                {/* Barre home */}
                <div className="absolute bottom-2.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-ivoire/30" />
              </div>
            </div>

            {/* Reflet */}
            <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
