"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { useMediaQuery, useMotionContext } from "@/components/motion/MotionProvider";
import { RevealImage, Rule, Stagger, Item } from "@/components/motion/Reveal";

export type TrackEvent = {
  key: string;
  kicker: string;
  title: string;
  text: string;
  meta: string;
  upcoming: boolean;
  poster: { src: string; width: number; height: number };
  extras: { src: string; width: number; height: number }[];
};

type Props = {
  /** En-tête de section (rendu côté serveur). */
  header: ReactNode;
  items: TrackEvent[];
  labels: { next: string; pastEditions: string };
};

/**
 * Événements. Sur ordinateur (écran assez large et haut), la section est
 * épinglée : le défilement vertical fait glisser la piste des cinq rendez-vous
 * à l'horizontale. Ailleurs, la liste éditoriale habituelle, affiche en regard.
 */
export function EventsTrack({ header, items, labels }: Props) {
  const { fine, reduced } = useMotionContext();
  const wide = useMediaQuery("(min-width: 64rem)");
  const tall = useMediaQuery("(min-height: 44rem)");
  const pinned = fine && !reduced && wide && tall;

  const outer = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [dist, setDist] = useState(0);

  // Distance à parcourir : largeur de la piste moins la largeur de lecture
  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const ol = track.current;
      const fr = frame.current;
      if (!ol || !fr) return;
      const cs = getComputedStyle(fr);
      const inner = fr.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setDist(Math.max(0, Math.ceil(ol.scrollWidth - inner)));
    };
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    const id = requestAnimationFrame(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(id);
    };
  }, [pinned, items.length]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -dist]);

  return (
    <section id="events" ref={outer} className="bg-white" style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={cn(pinned ? "sticky top-0 flex h-screen flex-col justify-center-safe overflow-hidden pt-[calc(var(--header-h)+1.5rem)] pb-10" : "section")}>
        <div ref={frame} className="wrap">
          {header}
        </div>

        {pinned ? (
          <div className="wrap mt-10 overflow-visible xl:mt-12">
            <motion.ol ref={track} className="flex w-max items-start gap-16 pr-10" style={{ x }}>
              {items.map((item) => (
                <TrackCard key={item.key} item={item} labels={labels} />
              ))}
            </motion.ol>
          </div>
        ) : (
          <div className="wrap mt-10 md:mt-14">
            <Rule />
            <ol>
              {items.map((item) => (
                <ListRow key={item.key} item={item} labels={labels} />
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Piste horizontale : affiche à gauche, texte à droite ---------- */
function TrackCard({ item, labels }: { item: TrackEvent; labels: Props["labels"] }) {
  const ratio = item.poster.width / item.poster.height;
  return (
    <li className="flex items-start gap-8">
      <RevealImage className="group h-[28vh] max-h-[300px] min-h-[200px] shrink-0 border border-line bg-cream" style={{ aspectRatio: `${ratio}` }} delay={0.1}>
        <Image src={item.poster.src} alt={`${item.title} — ${item.kicker}`} fill sizes="(min-width: 1024px) 24rem, 50vw" className="img-hover object-cover" />
      </RevealImage>
      <Stagger className="w-[18rem] border-t-2 border-ink pt-4 xl:w-[20rem]" gap={0.08}>
        <Item className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="text-[0.875rem] text-ink-3">{item.kicker}</p>
          {item.upcoming && <p className="inline-flex items-center bg-red px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight text-white">{labels.next}</p>}
        </Item>
        <Item as="h3" className="t-h3 mt-1.5 text-ink">
          {item.title}
        </Item>
        <Item as="p" className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-2">
          {item.text}
        </Item>
        <Item as="p" className="mt-3 text-[0.9375rem] font-medium text-ink">
          {item.meta}
        </Item>
        {item.extras.length > 0 && (
          <Item className="mt-4 flex items-center gap-3">
            <span className="text-[0.8125rem] text-ink-3">{labels.pastEditions}</span>
            <ul className="flex gap-1.5">
              {item.extras.map((ex) => (
                <li key={ex.src} className="relative h-9 w-9 overflow-hidden border border-line bg-cream">
                  <Image src={ex.src} alt="" fill sizes="36px" className="object-cover" />
                </li>
              ))}
            </ul>
          </Item>
        )}
      </Stagger>
    </li>
  );
}

/* ---------- Liste verticale (mobile, animations réduites, petits écrans) ----------
   Téléphone : titre pleine largeur, puis affiche à gauche et repères (date, lieu,
   éditions précédentes) à droite, description en dessous.
   À partir de md : texte à gauche, affiche à droite. */
function ListRow({ item, labels }: { item: TrackEvent; labels: Props["labels"] }) {
  return (
    <li className="border-b border-line py-7 md:py-8">
      <Stagger className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 md:grid-cols-[minmax(0,1fr)_10rem] md:gap-x-10 md:gap-y-0 lg:grid-cols-[minmax(0,1fr)_11rem]" gap={0.08}>
        <Item className="col-span-2 md:col-span-1 md:col-start-1 md:row-start-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-[0.875rem] text-ink-3">{item.kicker}</p>
            {item.upcoming && <p className="inline-flex items-center bg-red px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight text-white">{labels.next}</p>}
          </div>
          <h3 className="t-h3 mt-1.5 text-ink">{item.title}</h3>
        </Item>

        <Item as="figure" className="col-start-1 row-start-2 row-span-2 self-start md:col-start-2 md:row-start-1 md:row-span-4">
          <RevealImage className="group w-full border border-line bg-cream" style={{ aspectRatio: `${item.poster.width} / ${item.poster.height}` }} delay={0.15}>
            <Image src={item.poster.src} alt={`${item.title} — ${item.kicker}`} fill sizes="(min-width: 1024px) 11rem, (min-width: 768px) 10rem, 7.5rem" className="img-hover object-cover" />
          </RevealImage>
        </Item>

        <Item as="p" className="col-start-2 row-start-2 self-start text-[0.9375rem] font-medium leading-snug text-ink md:col-start-1 md:row-start-3 md:mt-3">
          {item.meta}
        </Item>

        {item.extras.length > 0 ? (
          <Item className="col-start-2 row-start-3 self-start md:col-start-1 md:row-start-4 md:mt-4 md:flex md:items-center md:gap-3">
            <span className="block text-[0.8125rem] text-ink-3">{labels.pastEditions}</span>
            <ul className="mt-1.5 flex gap-1.5 md:mt-0">
              {item.extras.map((ex) => (
                <li key={ex.src} className="relative h-9 w-9 overflow-hidden border border-line bg-cream">
                  <Image src={ex.src} alt="" fill sizes="36px" className="object-cover" />
                </li>
              ))}
            </ul>
          </Item>
        ) : (
          <span className="col-start-2 row-start-3 md:hidden" aria-hidden />
        )}

        <Item as="p" className="col-span-2 max-w-[38rem] leading-[1.7] text-ink-2 md:col-span-1 md:col-start-1 md:row-start-2 md:mt-3">
          {item.text}
        </Item>
      </Stagger>
    </li>
  );
}
