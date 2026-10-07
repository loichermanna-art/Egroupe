import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode, ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "link" | "onDark" | "onDarkOutline" | "onDarkLink";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  /** Affiche une flèche à droite (par défaut pour les variantes « link »). */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type AnchorProps = BaseProps & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children">;
type ButtonProps = BaseProps & { href?: undefined } & Omit<ComponentProps<"button">, "children">;

/* Remplissage qui monte depuis le bas au survol (pseudo-élément), texte au-dessus */
const fill =
  "relative isolate overflow-hidden before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-[420ms] before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:scale-y-100 active:before:scale-y-100";

const base =
  "group inline-flex items-center justify-center gap-2 font-medium transition-[background-color,color,border-color,box-shadow] duration-300 ease-out select-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:hover:before:scale-y-0";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.875rem] rounded-[var(--radius-sm)]",
  md: "h-11 px-5 text-[0.9375rem] rounded-[var(--radius-sm)]",
  lg: "h-12 px-6 text-[0.9375rem] rounded-[var(--radius-sm)]",
};

const variants: Record<Variant, string> = {
  primary: `${fill} bg-red text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)] before:bg-red-deep`,
  secondary: `${fill} border border-ink/30 bg-transparent text-ink hover:border-ink hover:text-paper before:bg-ink`,
  link: "h-auto px-0 text-red hover:text-red-dark rounded-none",
  onDark: `${fill} bg-white text-red-dark before:bg-cream`,
  onDarkOutline: `${fill} border border-white/40 text-white hover:border-white hover:text-red-dark before:bg-white`,
  onDarkLink: "h-auto px-0 text-white hover:text-gold-light rounded-none",
};

function Inner({ children, arrow, variant }: { children: ReactNode; arrow: boolean; variant: Variant }) {
  const isLink = variant === "link" || variant === "onDarkLink";
  return (
    <>
      <span className={cn(isLink && "link-ul")}>{children}</span>
      {arrow && (
        <ArrowRight
          className="h-4 w-4 shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
    </>
  );
}

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const isLink = variant === "link" || variant === "onDarkLink";
  const arrow = props.arrow ?? isLink;
  const classes = cn(base, sizes[size], variants[variant], className);

  if ("href" in props && props.href) {
    const { href, external, variant: _v, size: _s, arrow: _a, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _a; void _c; void _ch;
    const isHttp = /^https?:\/\//i.test(href);
    if (external || isHttp || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          target={isHttp ? "_blank" : undefined}
          rel={isHttp ? "noopener noreferrer" : undefined}
          className={classes}
          {...rest}
        >
          <Inner arrow={arrow} variant={variant}>{children}</Inner>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        <Inner arrow={arrow} variant={variant}>{children}</Inner>
      </Link>
    );
  }

  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, href: _h, type, ...rest } = props as ButtonProps;
  void _v; void _s; void _a; void _c; void _ch; void _h;
  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      <Inner arrow={arrow} variant={variant}>{children}</Inner>
    </button>
  );
}
