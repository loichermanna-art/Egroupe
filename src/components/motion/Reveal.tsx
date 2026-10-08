"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_EXPO, EASE_OUT, useMotionContext } from "./MotionProvider";

type Tag =
  | "div" | "section" | "li" | "ul" | "ol" | "p" | "figure" | "figcaption" | "blockquote"
  | "article" | "span" | "header" | "aside" | "tr" | "tbody" | "dl" | "footer" | "h3";

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  p: motion.p,
  figure: motion.figure,
  figcaption: motion.figcaption,
  blockquote: motion.blockquote,
  h3: motion.h3,
  article: motion.article,
  span: motion.span,
  header: motion.header,
  aside: motion.aside,
  tr: motion.tr,
  tbody: motion.tbody,
  dl: motion.dl,
  footer: motion.footer,
} as const;

const inViewOptions = { once: true, margin: "0px 0px -10% 0px", amount: 0.15 } as const;

/* ------------------------------------------------------------------
   Variantes partagées
------------------------------------------------------------------- */
export const upVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};
export const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: EASE_EXPO } },
};
export const clipVariants: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: { clipPath: "inset(0 0 0 0)", transition: { duration: 1.2, ease: EASE_EXPO } },
};
export const zoomVariants: Variants = {
  hidden: { scale: 1.12 },
  show: { scale: 1, transition: { duration: 1.6, ease: EASE_EXPO } },
};

const kinds = { up: upVariants, fade: fadeVariants, rule: ruleVariants, clip: clipVariants } as const;

/** Variantes avec un délai propre (un `transition` de variante prime sur la prop `transition`). */
function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants;
  const show = variants.show as { transition?: Record<string, unknown> } & Record<string, unknown>;
  return { ...variants, show: { ...show, transition: { ...(show.transition ?? {}), delay } } };
}

/** Hook commun : l'élément est-il « à montrer » (intro finie + visible) ? */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, inViewOptions);
  const { introDone, reduced } = useMotionContext();
  return { ref, show: reduced || (introDone && inView), reduced };
}

type RevealProps = {
  children?: ReactNode;
  as?: Tag;
  className?: string;
  kind?: keyof typeof kinds;
  delay?: number;
  /** Quand `true`, l'élément hérite de l'état de son parent `Stagger` au lieu d'observer lui-même. */
  inherit?: boolean;
  style?: React.CSSProperties;
};

/**
 * Apparition à l'entrée dans l'écran (une fois), après l'intro.
 * `kind` : up (fondu + 22 px), fade, rule (filet qui se trace), clip (masque qui se lève).
 */
export function Reveal({ children, as = "div", className, kind = "up", delay = 0, inherit = false, style }: RevealProps) {
  const Comp = tags[as] as typeof motion.div;
  const { ref, show, reduced } = useReveal<HTMLDivElement>();
  const variants = withDelay(kinds[kind], delay);

  if (reduced) {
    return (
      <Comp className={className} style={style}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
      data-motion=""
      className={cn(kind === "rule" && "origin-left", className)}
      style={style}
      variants={variants}
      initial="hidden"
      animate={inherit ? undefined : show ? "show" : "hidden"}
    >
      {children}
    </Comp>
  );
}

type StaggerProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  /** Intervalle entre enfants (s). */
  gap?: number;
  delay?: number;
};

/** Conteneur dont les enfants `<Item>` apparaissent en cascade. */
export function Stagger({ children, as = "div", className, gap = 0.08, delay = 0 }: StaggerProps) {
  const Comp = tags[as] as typeof motion.div;
  const { ref, show, reduced } = useReveal<HTMLDivElement>();

  if (reduced) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

type ItemProps = { children?: ReactNode; as?: Tag; className?: string; kind?: keyof typeof kinds; style?: React.CSSProperties };

/** Enfant d'un `Stagger`. */
export function Item({ children, as = "div", className, kind = "up", style }: ItemProps) {
  const Comp = tags[as] as typeof motion.div;
  const { reduced } = useMotionContext();
  if (reduced) {
    return (
      <Comp className={className} style={style}>
        {children}
      </Comp>
    );
  }
  return (
    <Comp data-motion="" className={cn(kind === "rule" && "origin-left", className)} style={style} variants={kinds[kind]}>
      {children}
    </Comp>
  );
}

/** Filet qui se trace de gauche à droite (remplace une bordure CSS). */
export function Rule({ className, delay = 0, inherit = false }: { className?: string; delay?: number; inherit?: boolean }) {
  return <Reveal as="div" kind="rule" delay={delay} inherit={inherit} className={cn("h-px w-full bg-line", className)} />;
}

/**
 * Image révélée par un masque qui se lève pendant qu'elle se « pose »
 * (léger dézoom). `children` : le composant `Image` en `fill`.
 */
export function RevealImage({
  children,
  className,
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, show, reduced } = useReveal<HTMLDivElement>();
  if (reduced) {
    return (
      <div className={cn("relative overflow-hidden", className)} style={style}>
        {children}
      </div>
    );
  }
  // Le cadre (observé) n'est jamais découpé : les navigateurs récents ne signalent
  // pas l'entrée à l'écran d'un élément entièrement masqué par son propre clip-path.
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} style={style}>
      <motion.div
        data-motion=""
        className="absolute inset-0"
        variants={withDelay(clipVariants, delay)}
        initial="hidden"
        animate={show ? "show" : "hidden"}
      >
        <motion.div className="absolute inset-0" variants={withDelay(zoomVariants, delay)} initial="hidden" animate={show ? "show" : "hidden"}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
