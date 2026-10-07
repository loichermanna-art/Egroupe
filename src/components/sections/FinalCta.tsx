import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { locale: Locale; dict: Dictionary["cta"]; location: string };

/** Inscriptions et contact : texte et boutons à gauche, coordonnées à droite. */
export function FinalCta({ locale, dict, location }: Props) {
  const waHref = `${site.whatsappUrl}?text=${encodeURIComponent(dict.whatsappMessage)}`;

  return (
    <section id="contact" className="section border-t border-line-2 bg-cream">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeader title={dict.title} lead={dict.lead} />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={waHref} size="lg">
              {dict.whatsapp}
            </Button>
            <Button href={`tel:+${site.phonePrimaryE164}`} variant="secondary" size="lg">
              {dict.call} {site.phonePrimary}
            </Button>
          </div>
          <p className="mt-3 text-[0.875rem] text-ink-3">{dict.note}</p>
        </div>

        {/* Coordonnées */}
        <div className="lg:col-span-4 lg:col-start-9">
          <h3 className="t-label border-b-2 border-ink pb-2.5">{dict.contactTitle}</h3>
          <dl className="divide-y divide-line-2">
            <div className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-[0.9375rem]">
              <dt className="text-ink-3">{dict.whatsappLabel}</dt>
              <dd>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="link-ul font-medium text-ink">
                  {site.phonePrimary}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-[0.9375rem]">
              <dt className="text-ink-3">{dict.phoneLabel}</dt>
              <dd className="flex flex-col gap-1">
                <a href={`tel:+${site.phonePrimaryE164}`} className="link-ul font-medium text-ink">
                  {site.phonePrimary}
                </a>
                <a href={`tel:+${site.phoneSecondaryE164}`} className="link-ul font-medium text-ink">
                  {site.phoneSecondary}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-[0.9375rem]">
              <dt className="text-ink-3">{dict.locationLabel}</dt>
              <dd className="text-ink">{location}</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-[0.9375rem]">
              <dt className="text-ink-3">{dict.hoursLabel}</dt>
              <dd>
                <Link href={`/${locale}#learning`} className="link-ul text-ink">
                  {dict.hoursLink}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
