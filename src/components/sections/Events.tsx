"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CalendarDays, Sparkles } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { eventMedia, eventOrder, type EventKey } from "@/data/events";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

type Props = { locale: Locale; dict: Dictionary["events"] };
type Item = Dictionary["events"]["items"][number];

export function Events({ dict }: Props) {
  const items = eventOrder
    .map((key) => dict.items.find((it) => it.key === key))
    .filter((it): it is Item => Boolean(it));
  const [active, setActive] = useState<EventKey>(items[0].key as EventKey);
  const reduced = useReducedMotion();

  return (
    <section id="events" className="relative overflow-hidden bg-noir py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
      <div className="container-x">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />

        <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* ---- Visuel épinglé (desktop) ---- */}
          <div className="relative hidden lg:col-span-6 lg:block">
            <div className="sticky top-[12vh] h-[76vh]">
              <Collage active={active} reduced={!!reduced} />
            </div>
          </div>

          {/* ---- Liste des événements ---- */}
          <ol className="lg:col-span-6">
            {items.map((item, i) => (
              <EventRow
                key={item.key}
                item={item}
                index={i}
                total={items.length}
                isActive={active === item.key}
                nextLabel={dict.next}
                setActive={setActive}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function EventRow({
  item,
  index,
  total,
  isActive,
  nextLabel,
  setActive,
}: {
  item: Item;
  index: number;
  total: number;
  isActive: boolean;
  nextLabel: string;
  setActive: (key: EventKey) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) setActive(item.key as EventKey);
  }, [inView, item.key, setActive]);

  const media = eventMedia[item.key as EventKey];
  const isNext = item.key === "eclosion";

  return (
    <li
      ref={ref}
      className={cn(
        "group relative border-t border-ivoire/10 py-12 transition-opacity duration-700 lg:min-h-[62vh] lg:py-16",
        index === total - 1 && "border-b",
        "lg:opacity-40 lg:data-[active=true]:opacity-100",
      )}
      data-active={isActive}
    >
      {/* Affiche (mobile / tablette) */}
      <Reveal className="relative mb-8 aspect-[4/3] overflow-hidden rounded-3xl lg:hidden" amount={0.2}>
        <Image
          src={media.poster.src}
          alt={item.title}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent" />
      </Reveal>

      <div className="flex items-start gap-6">
        <span className="font-display text-sm text-or/70 lg:mt-3">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow !tracking-[0.25em]">{item.kicker}</p>
            {isNext && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rouge-vif/20 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-or">
                <Sparkles className="h-3 w-3" />
                {nextLabel}
              </span>
            )}
          </div>
          <h3 className="mt-4 font-display text-[clamp(2rem,3.4vw,3.4rem)] leading-[1.02] text-ivoire transition-colors duration-500 group-hover:text-or lg:group-data-[active=true]:text-ivoire">
            {item.title}
          </h3>
          <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-muted">{item.text}</p>
          <p className="mt-6 flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] text-ivoire/70">
            <CalendarDays className="h-4 w-4 text-or" strokeWidth={1.6} />
            {item.meta}
          </p>
        </div>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
function Collage({ active, reduced }: { active: EventKey; reduced: boolean }) {
  const media = eventMedia[active];
  return (
    <div className="relative h-full w-full">
      {/* Lueur colorée */}
      <motion.div
        className="absolute inset-[12%] rounded-full blur-3xl"
        animate={{ backgroundColor: media.accent, opacity: 0.18 }}
        transition={{ duration: 1 }}
      />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, rotate: -1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.03, rotate: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Extras derrière, en éventail */}
          {media.extras.map((ex, i) => (
            <motion.div
              key={ex.src}
              className={cn(
                "absolute overflow-hidden rounded-2xl border border-ivoire/10 shadow-2xl",
                i === 0 ? "left-0 top-[6%] w-[46%]" : "right-0 bottom-[4%] w-[42%]",
              )}
              style={{ aspectRatio: `${ex.width}/${ex.height}` }}
              initial={{ opacity: 0, y: 30, rotate: i === 0 ? -8 : 8 }}
              animate={{ opacity: 1, y: 0, rotate: i === 0 ? -6 : 6 }}
              transition={{ duration: 1, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={ex.src} alt="" fill sizes="25vw" className="object-cover" />
              <div className="absolute inset-0 bg-noir/35" />
            </motion.div>
          ))}
          {/* Affiche principale */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-[62%] max-h-full -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-or/30 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]"
            style={{ aspectRatio: `${media.poster.width}/${media.poster.height}` }}
            animate={reduced ? undefined : { y: ["-50%", "-53%", "-50%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={media.poster.src} alt="" fill sizes="35vw" className="object-cover" priority={false} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
