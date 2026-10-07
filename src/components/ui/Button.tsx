"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode, ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Variant = "gold" | "outline" | "ghost" | "red";
type Size = "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  icon?: boolean;
  className?: string;
  children: ReactNode;
};

type AnchorProps = BaseProps & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children">;
type ButtonProps = BaseProps & { href?: undefined } & Omit<ComponentProps<"button">, "children">;

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-sans font-semibold uppercase tracking-[0.18em] transition-[transform,box-shadow,background-color,color,border-color] duration-500 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or/70 focus-visible:ring-offset-2 focus-visible:ring-offset-noir";

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[0.7rem]",
  lg: "px-8 py-4 text-[0.75rem]",
};

const variants: Record<Variant, string> = {
  gold:
    "bg-gradient-to-r from-or-3 via-or to-or-2 text-noir shadow-[0_10px_40px_-12px_rgba(229,194,91,0.55)] hover:shadow-[0_18px_60px_-14px_rgba(229,194,91,0.75)] hover:-translate-y-0.5",
  red:
    "bg-gradient-to-r from-rouge to-bordeaux text-ivoire shadow-[0_10px_40px_-12px_rgba(178,6,3,0.6)] hover:-translate-y-0.5",
  outline:
    "border border-ivoire/25 text-ivoire hover:border-or hover:text-or",
  ghost: "text-ivoire hover:text-or",
};

function Inner({ children, icon, variant }: { children: ReactNode; icon?: boolean; variant: Variant }) {
  return (
    <>
      {/* Balayage lumineux au survol */}
      {(variant === "gold" || variant === "red") && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full"
        />
      )}
      <span className="relative">{children}</span>
      {icon && (
        <span className="relative grid h-5 w-5 place-items-center overflow-hidden">
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-5 group-hover:translate-x-5"
            strokeWidth={2.2}
          />
          <ArrowUpRight
            className="absolute h-4 w-4 translate-y-5 -translate-x-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0"
            strokeWidth={2.2}
          />
        </span>
      )}
    </>
  );
}

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "gold", size = "lg", magnetic = true, icon = true, className, children } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  let node: ReactNode;
  if ("href" in props && props.href) {
    const { href, external, variant: _v, size: _s, magnetic: _m, icon: _i, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _m; void _i; void _c; void _ch;
    const isHttp = /^https?:\/\//i.test(href);
    node = external ? (
      <a
        href={href}
        target={isHttp ? "_blank" : undefined}
        rel={isHttp ? "noopener noreferrer" : undefined}
        className={classes}
        {...rest}
      >
        <Inner icon={icon} variant={variant}>{children}</Inner>
      </a>
    ) : (
      <Link href={href} className={classes} {...rest}>
        <Inner icon={icon} variant={variant}>{children}</Inner>
      </Link>
    );
  } else {
    const { variant: _v, size: _s, magnetic: _m, icon: _i, className: _c, children: _ch, href: _h, ...rest } = props as ButtonProps;
    void _v; void _s; void _m; void _i; void _c; void _ch; void _h;
    node = (
      <button type="button" className={classes} {...rest}>
        <Inner icon={icon} variant={variant}>{children}</Inner>
      </button>
    );
  }

  return magnetic ? <Magnetic>{node}</Magnetic> : <>{node}</>;
}
