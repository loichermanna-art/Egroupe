import { ExternalLink } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal, Stagger, Item } from "@/components/motion/Reveal";

type Props = { dict: Dictionary["learning"] };

const platformHost = site.links.learningWeb.replace(/^https?:\/\//, "");

export function Learning({ dict }: Props) {
  return (
    <section id="learning" className="section border-t border-line bg-paper">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Présentation */}
        <div className="lg:col-span-6">
          <SectionHeader title={dict.title} lead={dict.lead} />

          <Stagger as="dl" className="mt-8 max-w-[34rem] divide-y divide-line border-y border-line" gap={0.1} delay={0.2}>
            {dict.features.map((f) => (
              <Item key={f.title} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="font-medium text-ink">{f.title}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-ink-2">{f.text}</dd>
              </Item>
            ))}
          </Stagger>

          <Stagger className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" gap={0.1} delay={0.1}>
            <Item>
              <Button href={site.links.learningWeb} className="w-full sm:w-auto">
                {dict.ctaWeb}
              </Button>
            </Item>
            <Item>
              <Button href={site.links.playStore} variant="secondary" className="w-full sm:w-auto">
                {dict.ctaStores}
              </Button>
            </Item>
          </Stagger>
        </div>

        {/* Fiche pratique : encadrée, car c'est une information à retrouver vite */}
        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.3}>
          <div className="border border-line-2 bg-white">
            <div className="border-b border-line px-5 py-4 md:px-6">
              <h3 className="t-label">{dict.accessTitle}</h3>
              <a
                href={site.links.learningWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-1.5 inline-flex items-center gap-2 font-serif text-[1.1875rem] font-semibold text-red transition-colors hover:text-red-dark"
              >
                {platformHost}
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
              </a>
              <p className="t-caption mt-0.5">
                {dict.accessUrlLabel} · EG Learning
              </p>
            </div>

            <div className="px-5 py-4 md:px-6">
              <h3 className="t-label">{dict.scheduleTitle}</h3>
              <table className="mt-2 w-full text-left text-[0.9375rem]">
                <thead>
                  <tr className="t-label border-b border-line-2">
                    <th scope="col" className="py-2 pr-4 font-semibold">{dict.scheduleDays}</th>
                    <th scope="col" className="py-2 text-right font-semibold">{dict.scheduleHours}</th>
                  </tr>
                </thead>
                <Stagger as="tbody" className="" gap={0.1} delay={0.5}>
                  {dict.schedule.map((s) => (
                    <Item as="tr" key={s.days} className="border-b border-line last:border-b-0">
                      <td className="py-2.5 pr-4 text-ink">{s.days}</td>
                      <td className="py-2.5 text-right">
                        <span className="font-medium tabular-nums text-ink">{s.hours}</span>
                        {s.note ? <span className="block text-[0.8125rem] text-ink-3">{s.note}</span> : null}
                      </td>
                    </Item>
                  ))}
                </Stagger>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
