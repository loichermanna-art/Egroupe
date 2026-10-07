import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, Rule, Stagger, Item } from "@/components/motion/Reveal";

type Props = { dict: Dictionary["testimonials"] };

/**
 * Témoignages : le premier en grand à gauche, les autres en colonne à droite,
 * séparés par des filets. Rien d'autre : pas d'avatars, pas de notes.
 */
export function Testimonials({ dict }: Props) {
  const [first, ...rest] = dict.items;

  return (
    <section id="testimonials" className="section border-t border-line bg-white">
      <div className="wrap">
        <SectionHeader title={dict.title} lead={dict.lead} />

        <div className="mt-10">
          <Rule />
          <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-12">
            <Reveal as="figure" className="lg:col-span-6" delay={0.15}>
              <blockquote className="font-serif text-[1.375rem] leading-[1.45] text-ink md:text-[1.5rem]">{first.quote}</blockquote>
              <figcaption className="mt-5 text-[0.9375rem]">
                <span className="font-medium text-ink">{first.name}</span>
                <span className="text-ink-3"> — {first.role}</span>
              </figcaption>
            </Reveal>

            <Stagger as="ul" className="lg:col-span-5 lg:col-start-8" gap={0.14} delay={0.3}>
              {rest.map((t, i) => (
                <Item as="li" key={t.name + i} className={["py-5 first:pt-0 last:pb-0", i > 0 ? "border-t border-line" : ""].join(" ")}>
                  <figure>
                    <blockquote className="text-[1rem] leading-[1.65] text-ink-2">{t.quote}</blockquote>
                    <figcaption className="mt-3 text-[0.875rem]">
                      <span className="font-medium text-ink">{t.name}</span>
                      <span className="text-ink-3"> — {t.role}</span>
                    </figcaption>
                  </figure>
                </Item>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
