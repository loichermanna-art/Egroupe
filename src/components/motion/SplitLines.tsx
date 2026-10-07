"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "./MotionProvider";
import { useReveal } from "./Reveal";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Intervalle entre les lignes (s). */
  gap?: number;
  id?: string;
};

/**
 * Titre révélé ligne par ligne derrière un masque. Les lignes sont mesurées
 * dans le DOM (donc fidèles à la typographie réelle) ; une fois l'animation
 * jouée, le texte redevient un simple nœud texte.
 */
export function SplitLines({ text, as: Tag = "h2", className, delay = 0, gap = 0.1, id }: Props) {
  const { ref, show, reduced } = useReveal<HTMLElement>();
  const [lines, setLines] = useState<string[] | null>(null);
  const [done, setDone] = useState(false);
  const words = text.split(" ");
  const measureRef = useRef<HTMLElement | null>(null);

  // Mesure des lignes (et re-mesure tant que l'animation n'a pas joué)
  useEffect(() => {
    if (reduced || done) return;
    const el = measureRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
      if (!spans.length) return;
      const out: string[] = [];
      let lastTop: number | null = null;
      for (const s of spans) {
        const top = Math.round(s.getBoundingClientRect().top);
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          out.push(s.textContent ?? "");
          lastTop = top;
        } else {
          out[out.length - 1] += ` ${s.textContent ?? ""}`;
        }
      }
      setLines(out);
    };
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
    // `lines` volontairement absent : on observe l'élément de mesure, qui n'existe que lorsque lines === null
  }, [reduced, done, lines]);

  if (reduced || done) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  // Phase de mesure : mots inline (même habillage que le texte brut)
  if (lines === null) {
    return (
      <Tag
        id={id}
        ref={(node: HTMLElement | null) => {
          measureRef.current = node;
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={className}
        data-motion=""
        style={{ opacity: 0 }}
      >
        {words.map((w, i) => (
          <span key={i}>
            <span data-w="">{w}</span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag id={id} ref={ref} className={cn(className)} aria-label={text}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]" aria-hidden>
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={show ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.95, ease: EASE_OUT, delay: delay + i * gap }}
            onAnimationComplete={() => {
              if (show && i === lines.length - 1) setDone(true);
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
