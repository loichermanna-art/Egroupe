import { BookOpenText, Compass, Flame, Briefcase, Check } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Props = { dict: Dictionary["pillars"] };

const icons = [BookOpenText, Compass, Flame, Briefcase];

export function Pillars({ dict }: Props) {
  return (
    <section id="programs" className="section bg-paper">
      <div className="wrap">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />

        {/* Grille 2 × 2 séparée par des filets (pas de cartes) */}
        <div className="mt-12 grid border-t border-line md:mt-16 md:grid-cols-2">
          {dict.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal
                key={item.index}
                as="article"
                delay={(i % 2) * 0.06}
                className={cn(
                  "border-b border-line py-8 md:py-10",
                  // Colonne de gauche : filet vertical + espacement à droite
                  i % 2 === 0 ? "md:border-r md:pr-10 lg:pr-14" : "md:pl-10 lg:pl-14",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[0.9375rem] text-red tabular-nums">{item.index}</span>
                  <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="t-h3 mt-5 text-ink">{item.title}</h3>
                <p className="mt-1 text-[0.9375rem] font-medium text-ink-3">{item.subtitle}</p>
                <p className="mt-4 max-w-[32rem] leading-[1.7] text-ink-2">{item.text}</p>
                <ul className="mt-6 space-y-2.5">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-red" strokeWidth={2} aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
