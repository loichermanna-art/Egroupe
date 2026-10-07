import Image from "next/image";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { eventMedia, eventOrder, isUpcoming, type EventKey } from "@/data/events";
import { site } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealImage, Rule, Stagger, Item } from "@/components/motion/Reveal";

type Props = { locale: Locale; dict: Dictionary["events"] };
type EventItem = Dictionary["events"]["items"][number];

/** Agenda des événements : une liste éditoriale, l'affiche réelle en regard. */
export function Events({ dict }: Props) {
  const items = eventOrder
    .map((key) => dict.items.find((it) => it.key === key))
    .filter((it): it is EventItem => Boolean(it));
  const now = new Date();
  const hasUpcoming = items.some((it) => isUpcoming(eventMedia[it.key as EventKey], now));

  return (
    <section id="events" className="section bg-white">
      <div className="wrap">
        <SectionHeader layout="split" title={dict.title} lead={dict.lead}>
          {/* Quand aucune date n'est connue : on le dit, et on renvoie vers les canaux réels */}
          {!hasUpcoming && (
            <p className="mt-4 text-[0.9375rem] text-ink-2">
              {dict.datesNote}{" "}
              <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" className="link-ul font-medium text-ink">
                Facebook
              </a>
              {", "}
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="link-ul font-medium text-ink">
                Instagram
              </a>
              .
            </p>
          )}
        </SectionHeader>

        <div className="mt-10 md:mt-14">
          <Rule />
          <ol>
            {items.map((item) => {
              const media = eventMedia[item.key as EventKey];
              const upcoming = isUpcoming(media, now);
              return (
                <li key={item.key} className="grid gap-5 border-b border-line py-7 md:grid-cols-[1fr_10rem] md:gap-10 md:py-8 lg:grid-cols-[1fr_11rem]">
                  {/* Contenu */}
                  <Stagger className="max-w-[38rem]" gap={0.08}>
                    <Item className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <p className="text-[0.875rem] text-ink-3">{item.kicker}</p>
                      {upcoming && (
                        <p className="inline-flex items-center bg-red px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight text-white">
                          {dict.next}
                        </p>
                      )}
                    </Item>
                    <Item as="h3" className="t-h3 mt-1.5 text-ink">
                      {item.title}
                    </Item>
                    <Item as="p" className="mt-3 leading-[1.7] text-ink-2">
                      {item.text}
                    </Item>
                    <Item as="p" className="mt-3 text-[0.9375rem] font-medium text-ink">
                      {item.meta}
                    </Item>

                    {media.extras.length > 0 && (
                      <Item className="mt-4 flex items-center gap-3">
                        <span className="text-[0.8125rem] text-ink-3">{dict.pastEditions}</span>
                        <ul className="flex gap-1.5">
                          {media.extras.map((ex) => (
                            <li key={ex.src} className="relative h-9 w-9 overflow-hidden border border-line bg-cream">
                              <Image src={ex.src} alt="" fill sizes="36px" className="object-cover" />
                            </li>
                          ))}
                        </ul>
                      </Item>
                    )}
                  </Stagger>

                  {/* Affiche de l'édition la plus récente */}
                  <figure className="md:justify-self-end">
                    <RevealImage
                      className="group w-[9.5rem] border border-line bg-cream md:w-full"
                      style={{ aspectRatio: `${media.poster.width} / ${media.poster.height}` }}
                      delay={0.15}
                    >
                      <Image
                        src={media.poster.src}
                        alt={`${item.title} — ${item.kicker}`}
                        fill
                        sizes="(min-width: 768px) 11rem, 9.5rem"
                        className="img-hover object-cover"
                      />
                    </RevealImage>
                  </figure>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
