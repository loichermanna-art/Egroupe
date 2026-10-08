import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { eventMedia, eventOrder, isUpcoming, type EventKey } from "@/data/events";
import { site } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EventsTrack, type TrackEvent } from "./EventsTrack";

type Props = { locale: Locale; dict: Dictionary["events"] };
type EventItem = Dictionary["events"]["items"][number];

/** Agenda des événements : en-tête rendu côté serveur, piste / liste côté client. */
export function Events({ dict }: Props) {
  const now = new Date();
  const items: TrackEvent[] = eventOrder
    .map((key) => dict.items.find((it) => it.key === key))
    .filter((it): it is EventItem => Boolean(it))
    .map((it) => {
      const media = eventMedia[it.key as EventKey];
      return {
        key: it.key,
        kicker: it.kicker,
        title: it.title,
        text: it.text,
        meta: it.meta,
        upcoming: isUpcoming(media, now),
        poster: media.poster,
        extras: media.extras,
      };
    });
  const hasUpcoming = items.some((it) => it.upcoming);

  const header = (
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
  );

  return <EventsTrack header={header} items={items} labels={{ next: dict.next, pastEditions: dict.pastEditions }} />;
}
