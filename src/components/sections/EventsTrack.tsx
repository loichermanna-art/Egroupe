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

/* ---------- Liste verticale (mobile, animations réduites, petits écrans) ---------- */
function ListRow({ item, labels }: { item: TrackEvent; labels: Props["labels"] }) {
  return (
    <li className="grid gap-5 border-b border-line py-7 md:grid-cols-[1fr_10rem] md:gap-10 md:py-8 lg:grid-cols-[1fr_11rem]">
      <Stagger className="max-w-[38rem]" gap={0.08}>
        <Item className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="text-[0.875rem] text-ink-3">{item.kicker}</p>
          {item.upcoming && <p className="inline-flex items-center bg-red px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight text-white">{labels.next}</p>}
        </Item>
        <Item as="h3" className="t-h3 mt-1.5 text-ink">
          {item.title}
        </Item>
        <Item as="p" className="mt-3 leading-[1.7] text-ink-2">
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
      <figure className="md:justify-self-end">
        <RevealImage className="group w-[9.5rem] border border-line bg-cream md:w-full" style={{ aspectRatio: `${item.poster.width} / ${item.poster.height}` }} delay={0.15}>
          <Image src={item.poster.src} alt={`${item.title} — ${item.kicker}`} fill sizes="(min-width: 768px) 11rem, 9.5rem" className="img-hover object-cover" />
        </RevealImage>
      </figure>
    </li>
  );
}
