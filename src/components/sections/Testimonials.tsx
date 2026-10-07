import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Props = { dict: Dictionary["testimonials"] };

/** Témoignages : tous visibles, en grille éditoriale séparée par des filets. */
export function Testimonials({ dict }: Props) {
  return (
    <section id="testimonials" className="section border-t border-line bg-white">
      <div className="wrap">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />

        <ul className="mt-12 grid border-t border-line md:mt-14 md:grid-cols-2">
          {dict.items.map((t, i) => (
            <Reveal
              key={t.name + i}
              as="li"
              delay={(i % 2) * 0.06}
              className={cn(
                "border-b border-line py-8 md:py-10",
                i % 2 === 0 ? "md:border-r md:pr-10 lg:pr-14" : "md:pl-10 lg:pl-14",
              )}
            >
              <figure>
                <blockquote className="font-serif text-[1.1875rem] leading-[1.5] text-ink md:text-[1.25rem]">
                  <span className="text-gold" aria-hidden>« </span>
                  {t.quote}
                  <span className="text-gold" aria-hidden> »</span>
                </blockquote>
                <figcaption className="mt-5 text-[0.9375rem]">
                  <span className="font-medium text-ink">{t.name}</span>
                  <span className="text-ink-3"> — {t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
