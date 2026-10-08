"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMediaQuery, useMotionContext } from "@/components/motion/MotionProvider";
import { useReveal } from "@/components/motion/Reveal";
import { PenMark } from "@/components/motion/PenMark";

type Program = Dictionary["pillars"]["items"][number];

type Props = { items: Program[]; bulletsTitle: string; className?: string };

/**
 * Les programmes défilent à côté du titre épinglé ; celui qui passe au
 * milieu de l'écran est « lu » : net, souligné au stylo rouge, les autres
 * en retrait. Sur mobile et en animations réduites, tous restent nets et
 * le soulignement se trace simplement à l'apparition.
 */
export function PillarsList({ items, bulletsTitle, className }: Props) {
  const { fine, reduced, introDone } = useMotionContext();
  const wide = useMediaQuery("(min-width: 64rem)");
  const dimming = fine && wide && !reduced && introDone;
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const update = useCallback(() => {
    const center = window.innerHeight * 0.5;
    let best = 0;
    let bestDist = Infinity;
    refs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive((prev) => (prev === best ? prev : best));
  }, []);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    if (dimming) update();
  });
  useEffect(() => {
    if (!dimming) return;
    const id = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", update);
    };
  }, [dimming, update]);

  return (
    <ol className={cn("border-t border-line-2", className)}>
      {items.map((item, i) => (
        <PillarItem
          key={item.key}
          item={item}
          bulletsTitle={bulletsTitle}
          dim={dimming && active !== i}
          lit={!dimming || active === i}
          refCb={(el) => {
            refs.current[i] = el;
          }}
        />
      ))}
    </ol>
  );
}

function PillarItem({
  item,
  bulletsTitle,
  dim,
  lit,
  refCb,
}: {
  item: Program;
  bulletsTitle: string;
  dim: boolean;
  lit: boolean;
  refCb: (el: HTMLElement | null) => void;
}) {
  const { ref, show, reduced } = useReveal<HTMLDivElement>();

  return (
    <motion.li
      ref={refCb}
      className="border-b border-line-2 py-9 lg:flex lg:min-h-[38vh] lg:flex-col lg:justify-center lg:py-12"
      initial={false}
      animate={{ opacity: dim ? 0.42 : 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <motion.article
        ref={ref}
        data-motion=""
        className="grid gap-6 md:grid-cols-12 md:gap-8"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <div className="md:col-span-7">
          <p className="t-label text-gold-text">{item.subtitle}</p>
          <h3 className="t-h3 mt-2 text-ink">
            <span className="relative inline-block">
              {item.title}
              <PenMark kind="line" show={show && lit} delay={reduced ? 0 : 0.2} className="absolute -bottom-[0.28em] left-[-2%] h-[0.45em] w-[104%]" />
            </span>
          </h3>
          <p className="mt-4 max-w-[34rem] leading-[1.7] text-ink-2">{item.text}</p>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:pt-7">
          <h4 className="t-label">{bulletsTitle}</h4>
          <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-ink">
            {item.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-[0.7em] h-px w-3 shrink-0 bg-ink-3" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </motion.li>
  );
}
