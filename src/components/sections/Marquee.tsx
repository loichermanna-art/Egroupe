import { cn } from "@/lib/utils";

type Props = { items: string[]; className?: string };

function Row({ items, ariaHidden = false }: { items: string[]; ariaHidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-8 pr-8">
          <span className="whitespace-nowrap font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium tracking-tight text-ivoire/90">
            {item}
          </span>
          <span aria-hidden className="block h-2 w-2 rotate-45 bg-or" />
        </li>
      ))}
    </ul>
  );
}

/** Bandeau défilant infini (liste dupliquée pour une boucle parfaite). */
export function Marquee({ items, className }: Props) {
  return (
    <div
      className={cn(
        "relative -mt-px overflow-hidden border-y border-or/15 bg-noir-2/80 py-6 backdrop-blur-sm",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-noir to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-noir to-transparent" />
      <div className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]">
        <Row items={items} />
        <Row items={items} ariaHidden />
      </div>
    </div>
  );
}
