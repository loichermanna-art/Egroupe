import Image from "next/image";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { eventMedia, eventOrder, isUpcoming, type EventKey } from "@/data/events";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

type Props = { locale: Locale; dict: Dictionary["events"] };
type Item = Dictionary["events"]["items"][number];

/** Agenda des événements : une liste éditoriale, les affiches réelles en regard. */
export function Events({ dict }: Props) {
  const items = eventOrder
    .map((key) => dict.items.find((it) => it.key === key))
    .filter((it): it is Item => Boolean(it));
  const now = new Date();

  return (
    <section id="events" className="section bg-white">
      <div className="wrap">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />

        <ol className="mt-12 border-t border-line md:mt-16">
          {items.map((item, i) => {
            const media = eventMedia[item.key as EventKey];
            const upcoming = isUpcoming(media, now);
            return (
              <Reveal
                key={item.key}
                as="li"
                amount={0.15}
                className="grid gap-6 border-b border-line py-8 md:grid-cols-[9rem_1fr_11rem] md:gap-10 md:py-10 lg:grid-cols-[11rem_1fr_12rem]"
              >
                {/* Colonne repère */}
                <div className="flex items-start gap-4 md:block">
                  <span className="font-serif text-[0.9375rem] text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div className="md:mt-3">
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-3">{item.kicker}</p>
                    {upcoming && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-[2px] bg-red px-2 py-0.5 text-[0.75rem] font-medium text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-light" aria-hidden />
                        {dict.next}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="max-w-[36rem]">
                  <h3 className="t-h3 text-ink">{item.title}</h3>
                  <p className="mt-3 leading-[1.7] text-ink-2">{item.text}</p>
                  <p className="mt-4 text-[0.875rem] font-medium text-ink">{item.meta}</p>

                  {media.extras.length > 0 && (
                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-[0.75rem] text-ink-3">{dict.pastEditions}</span>
                      <ul className="flex gap-2">
                        {media.extras.map((ex) => (
                          <li key={ex.src} className="relative h-10 w-10 overflow-hidden rounded-[2px] border border-line bg-cream">
                            <Image src={ex.src} alt="" fill sizes="40px" className="object-cover" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Affiche de l'édition la plus récente */}
                <figure className="md:justify-self-end">
                  <div
                    className="relative w-[11rem] overflow-hidden rounded-[2px] border border-line bg-cream md:w-full"
                    style={{ aspectRatio: `${media.poster.width} / ${media.poster.height}` }}
                  >
                    <Image
                      src={media.poster.src}
                      alt={`${item.title} — ${item.kicker}`}
                      fill
                      sizes="(min-width: 768px) 12rem, 11rem"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
