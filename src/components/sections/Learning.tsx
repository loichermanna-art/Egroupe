import { MonitorSmartphone, KeyRound, GraduationCap, ExternalLink } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type Props = { dict: Dictionary["learning"] };

const featureIcons = [MonitorSmartphone, KeyRound, GraduationCap];
const platformHost = site.links.learningWeb.replace(/^https?:\/\//, "");

export function Learning({ dict }: Props) {
  return (
    <section id="learning" className="section bg-paper">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Présentation */}
        <div className="lg:col-span-6">
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />

          <ul className="mt-10 max-w-[34rem] divide-y divide-line border-y border-line">
            {dict.features.map((f, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <li key={f.title} className="flex gap-4 py-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-red" strokeWidth={1.5} aria-hidden />
                  <div>
                    <p className="t-h4 text-ink">{f.title}</p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">{f.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button href={site.links.learningWeb}>{dict.ctaWeb}</Button>
            <Button href={site.links.playStore} variant="secondary">
              {dict.ctaStores}
            </Button>
          </div>
        </div>

        {/* Fiche pratique */}
        <Reveal className="lg:col-span-5 lg:col-start-8">
          <div className="border border-line bg-white">
            <div className="border-b border-line px-6 py-5 md:px-7">
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-3">{dict.accessTitle}</h3>
              <a
                href={site.links.learningWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 font-serif text-[1.25rem] font-semibold text-red hover:text-red-dark"
              >
                {platformHost}
                <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </a>
              <p className="t-caption mt-1">
                {dict.accessUrlLabel} · EG Learning
              </p>
            </div>

            <div className="px-6 py-5 md:px-7">
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-3">{dict.scheduleTitle}</h3>
              <table className="mt-3 w-full text-left text-[0.9375rem]">
                <thead>
                  <tr className="border-b border-ink/60 text-[0.75rem] uppercase tracking-[0.08em] text-ink-3">
                    <th scope="col" className="py-2 pr-4 font-semibold">{dict.scheduleDays}</th>
                    <th scope="col" className="py-2 text-right font-semibold">{dict.scheduleHours}</th>
                  </tr>
                </thead>
                <tbody>
                  {dict.schedule.map((s) => (
                    <tr key={s.days} className="border-b border-line last:border-b-0">
                      <td className="py-3 pr-4 text-ink">{s.days}</td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-ink tabular-nums">{s.hours}</span>
                        {s.note ? <span className="block text-[0.8125rem] text-ink-3">{s.note}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
