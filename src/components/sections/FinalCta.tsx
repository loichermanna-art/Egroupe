import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, Rule, Stagger, Item } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

type Props = { locale: Locale; dict: Dictionary["cta"]; location: string; cursor: Dictionary["cursor"] };

/** Inscriptions et contact : texte et boutons à gauche, coordonnées à droite. */
export function FinalCta({ locale, dict, location, cursor }: Props) {
  const waHref = `${site.whatsappUrl}?text=${encodeURIComponent(dict.whatsappMessage)}`;

  const rows = [
    {
      label: dict.whatsappLabel,
      content: (
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="link-ul font-medium text-ink">
          {site.phonePrimary}
        </a>
      ),
    },
    {
      label: dict.phoneLabel,
      content: (
        <span className="flex flex-col gap-1">
          <a href={`tel:+${site.phonePrimaryE164}`} className="link-ul self-start font-medium text-ink">
            {site.phonePrimary}
          </a>
          <a href={`tel:+${site.phoneSecondaryE164}`} className="link-ul self-start font-medium text-ink">
            {site.phoneSecondary}
          </a>
        </span>
      ),
    },
    { label: dict.locationLabel, content: <span className="text-ink">{location}</span> },
    {
      label: dict.hoursLabel,
      content: (
        <Link href={`/${locale}#learning`} className="link-ul text-ink">
          {dict.hoursLink}
        </Link>
      ),
    },
  ];

  return (
    <section id="contact" className="section border-t border-line-2 bg-cream">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeader title={dict.title} lead={dict.lead} />

          <Stagger className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" gap={0.1} delay={0.35}>
            <Item>
              <Magnetic className="w-full sm:w-auto">
                <Button href={waHref} size="lg" className="w-full sm:w-auto" data-cursor={cursor.whatsapp}>
                  {dict.whatsapp}
                </Button>
              </Magnetic>
            </Item>
            <Item>
              <Button href={`tel:+${site.phonePrimaryE164}`} variant="secondary" size="lg" className="w-full sm:w-auto" data-cursor={cursor.call}>
                {dict.call} {site.phonePrimary}
              </Button>
            </Item>
          </Stagger>
          <Reveal as="p" kind="fade" className="mt-3 text-[0.875rem] text-ink-3" delay={0.7}>
            {dict.note}
          </Reveal>
        </div>

        {/* Coordonnées */}
        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal as="h3" kind="fade" className="t-label pb-2.5" delay={0.2}>
            {dict.contactTitle}
          </Reveal>
          <Rule className="h-0.5 bg-ink" delay={0.2} />
          <Stagger as="dl" className="divide-y divide-line-2" gap={0.1} delay={0.4}>
            {rows.map((r) => (
              <Item key={r.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-[0.9375rem]">
                <dt className="text-ink-3">{r.label}</dt>
                <dd>{r.content}</dd>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
