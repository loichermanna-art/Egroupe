import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, Rule, Stagger, Item } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";

type Props = { locale: Locale; dict: Dictionary["about"] };

export function About({ dict }: Props) {
  return (
    <section id="about" className="section border-t border-line bg-white">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Colonne principale */}
        <div className="lg:col-span-7">
          <SectionHeader title={dict.title} />

          <Stagger className="mt-6 max-w-[38rem] space-y-4 text-[1.0625rem] leading-[1.7] text-ink-2" gap={0.12} delay={0.2}>
            <Item as="p">{dict.body1}</Item>
            <Item as="p">{dict.body2}</Item>
          </Stagger>

          <SplitLines as="h3" text={dict.objectivesTitle} className="t-h3 mt-10 text-ink" />
          <Stagger as="ol" className="mt-4 max-w-[38rem] list-decimal space-y-2 pl-6 marker:text-ink-3" gap={0.07} delay={0.15}>
            {dict.objectives.map((o) => (
              <Item as="li" key={o} className="pl-1 leading-7 text-ink">
                {o}
              </Item>
            ))}
          </Stagger>
        </div>

        {/* Colonne latérale : mission, fiche d'identité, valeurs */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <div>
            <Rule className="h-0.5 bg-ink" />
            <Reveal className="pt-5" delay={0.2}>
              <h3 className="t-h4 text-ink">{dict.missionTitle}</h3>
              <p className="mt-3 font-serif text-[1.1875rem] leading-[1.5] text-ink">{dict.manifesto}</p>
              <p className="mt-3 text-[0.9375rem] italic text-ink-3">« {dict.slogan} »</p>
            </Reveal>
          </div>

          <div className="mt-10">
            <Rule />
            <Stagger className="pt-5" gap={0.06} delay={0.1}>
              <Item as="h3" className="t-label">
                {dict.factsTitle}
              </Item>
              <dl className="mt-2 divide-y divide-line">
                {dict.facts.map((f) => (
                  <Item key={f.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-2.5 text-[0.9375rem]">
                    <dt className="text-ink-3">{f.label}</dt>
                    <dd className="text-ink">{f.value}</dd>
                  </Item>
                ))}
              </dl>
            </Stagger>
          </div>

          <div className="mt-8">
            <Rule />
            <Reveal className="pt-5" delay={0.15}>
              <h3 className="t-label">{dict.valuesTitle}</h3>
              <p className="mt-2 font-serif text-[1.125rem] text-ink">{dict.values.join(" · ")}</p>
            </Reveal>
          </div>
        </aside>
      </div>
    </section>
  );
}
