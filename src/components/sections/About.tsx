import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

type Props = { locale: Locale; dict: Dictionary["about"] };

export function About({ dict }: Props) {
  return (
    <section id="about" className="section bg-white">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Colonne principale */}
        <div className="lg:col-span-7">
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />

          <div className="mt-8 max-w-[38rem] space-y-5 text-[1.0625rem] leading-[1.7] text-ink-2">
            <p>{dict.body1}</p>
            <p>{dict.body2}</p>
          </div>

          <h3 className="t-h3 mt-12 text-ink">{dict.objectivesTitle}</h3>
          <ol className="mt-5 max-w-[38rem] border-t border-line">
            {dict.objectives.map((o, i) => (
              <Reveal key={o} as="li" delay={i * 0.04} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-4">
                <span className="font-serif text-lg leading-7 text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <p className="leading-7 text-ink">{o}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Colonne latérale */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <Reveal className="bg-red-dark px-7 py-8 text-white md:px-8 md:py-9">
            <span className="rule-gold-light" aria-hidden />
            <p className="mt-4 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-gold-light">{dict.missionTitle}</p>
            <p className="mt-4 font-serif text-[1.3125rem] leading-[1.45] md:text-[1.4375rem]">{dict.manifesto}</p>
            <p className="mt-6 font-serif text-[1rem] italic text-white/75">« {dict.slogan} »</p>
          </Reveal>

          <div className="mt-8 flex items-end gap-5 border-b border-line pb-6">
            <span className="font-serif text-[4rem] font-semibold leading-[0.85] text-red md:text-[4.5rem]">{dict.yearsValue}</span>
            <p className="max-w-[12rem] pb-1 text-[0.9375rem] leading-snug text-ink-2">{dict.yearsLabel}</p>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] font-medium text-ink">
            {dict.values.map((v, i) => (
              <li key={v} className="inline-flex items-center gap-5">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />}
                {v}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
