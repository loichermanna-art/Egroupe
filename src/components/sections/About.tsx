import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { locale: Locale; dict: Dictionary["about"] };

export function About({ dict }: Props) {
  return (
    <section id="about" className="section border-t border-line bg-white">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Colonne principale */}
        <div className="lg:col-span-7">
          <SectionHeader title={dict.title} />

          <div className="mt-6 max-w-[38rem] space-y-4 text-[1.0625rem] leading-[1.7] text-ink-2">
            <p>{dict.body1}</p>
            <p>{dict.body2}</p>
          </div>

          <h3 className="t-h3 mt-10 text-ink">{dict.objectivesTitle}</h3>
          <ol className="mt-4 max-w-[38rem] list-decimal space-y-2 pl-6 marker:text-ink-3">
            {dict.objectives.map((o) => (
              <li key={o} className="pl-1 leading-7 text-ink">
                {o}
              </li>
            ))}
          </ol>
        </div>

        {/* Colonne latérale : mission, fiche d'identité, valeurs */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border-t-2 border-ink pt-5">
            <h3 className="t-h4 text-ink">{dict.missionTitle}</h3>
            <p className="mt-3 font-serif text-[1.1875rem] leading-[1.5] text-ink">{dict.manifesto}</p>
            <p className="mt-3 text-[0.9375rem] italic text-ink-3">« {dict.slogan} »</p>
          </div>

          <div className="mt-10 border-t border-line pt-5">
            <h3 className="t-label">{dict.factsTitle}</h3>
            <dl className="mt-2 divide-y divide-line">
              {dict.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-2.5 text-[0.9375rem]">
                  <dt className="text-ink-3">{f.label}</dt>
                  <dd className="text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 border-t border-line pt-5">
            <h3 className="t-label">{dict.valuesTitle}</h3>
            <p className="mt-2 font-serif text-[1.125rem] text-ink">{dict.values.join(" · ")}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
