"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { BookOpenText, Compass, Flame, Briefcase, ArrowRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Props = { dict: Dictionary["pillars"] };

const icons = [BookOpenText, Compass, Flame, Briefcase];
const tints = [
  "from-bordeaux/70 via-noir-3 to-noir-2",
  "from-or-fonce/40 via-noir-3 to-noir-2",
  "from-rouge/50 via-noir-3 to-noir-2",
  "from-noir-4 via-noir-3 to-noir-2",
];

export function Pillars({ dict }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.25, 1]);

  // Mesure la distance horizontale à parcourir (largeur du rail − largeur visible)
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !railRef.current) return;
      setDistance(Math.max(0, railRef.current.scrollWidth - viewportRef.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="programs" className="relative bg-noir-2">
      {/* En-tête */}
      <div className="container-x pt-28 md:pt-40">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />
          <Reveal delay={0.3} className="hidden items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-muted lg:flex">
            <span>{dict.hint}</span>
            <motion.span animate={reduced ? undefined : { x: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowRight className="h-4 w-4 text-or" />
            </motion.span>
          </Reveal>
        </div>
      </div>

      {/* ---- Desktop : défilement horizontal épinglé ---- */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${dict.items.length * 90}vh` }}>
        <div ref={viewportRef} className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div
            ref={railRef}
            style={{ x }}
            className="flex w-max gap-8 pl-[clamp(1.25rem,4vw,4rem)] pr-[clamp(1.25rem,4vw,4rem)]"
          >
            {dict.items.map((item, i) => (
              <Card key={item.index} item={item} i={i} className="w-[min(58vw,760px)] shrink-0" />
            ))}
          </motion.div>
          {/* Barre de progression */}
          <div className="container-x mt-12">
            <div className="h-px w-full bg-ivoire/10">
              <motion.div style={{ scaleX: progressScale }} className="h-px origin-left bg-gradient-to-r from-or to-jaune" />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Mobile / tablette : cartes empilées ---- */}
      <div className="container-x mt-14 grid gap-6 pb-28 md:grid-cols-2 lg:hidden">
        {dict.items.map((item, i) => (
          <Reveal key={item.index} delay={0.08 * i} amount={0.2}>
            <Card item={item} i={i} className="h-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Card({
  item,
  i,
  className,
}: {
  item: Dictionary["pillars"]["items"][number];
  i: number;
  className?: string;
}) {
  const Icon = icons[i % icons.length];
  return (
    <article
      className={cn(
        "group relative flex min-h-[520px] flex-col justify-between overflow-hidden rounded-[2rem] border border-ivoire/10 bg-gradient-to-br p-8 transition-colors duration-700 hover:border-or/40 lg:min-h-[64vh] lg:p-10",
        tints[i % tints.length],
        className,
      )}
    >
      {/* Numéro géant en filigrane */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-8 font-display text-[11rem] leading-none text-ivoire/[0.04] transition-all duration-700 group-hover:text-or/[0.08]"
      >
        {item.index}
      </span>

      <div>
        <div className="flex items-center justify-between">
          <span className="eyebrow">{item.index}</span>
          <span className="grid h-12 w-12 place-items-center rounded-full border border-or/30 text-or transition-transform duration-700 ease-out-expo group-hover:rotate-12 group-hover:scale-110">
            <Icon className="h-5 w-5" strokeWidth={1.6} />
          </span>
        </div>
        <h3 className="mt-10 font-display text-[clamp(1.8rem,2.4vw,2.6rem)] leading-[1.05] text-ivoire">{item.title}</h3>
        <p className="mt-3 font-display text-lg italic text-or">{item.subtitle}</p>
        <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-muted">{item.text}</p>
      </div>

      <ul className="mt-10 space-y-3 border-t border-ivoire/10 pt-6">
        {item.bullets.map((b) => (
          <li key={b} className="flex items-center gap-3 text-sm text-ivoire/85">
            <span className="h-1.5 w-1.5 rotate-45 bg-or" aria-hidden />
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
