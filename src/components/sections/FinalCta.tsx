import { MessageCircle, Phone, MapPin } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";

type Props = { dict: Dictionary["cta"]; location: string };

export function FinalCta({ dict, location }: Props) {
  const waHref = `${site.whatsappUrl}?text=${encodeURIComponent(dict.whatsappMessage)}`;

  return (
    <section id="contact" className="section bg-red-dark text-white">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <span className="rule-gold-light" aria-hidden />
          <p className="t-eyebrow mt-4 text-gold-light">{dict.eyebrow}</p>
          <h2 className="t-h2 mt-3 text-white">{dict.title}</h2>
          <p className="t-lead mt-5 max-w-[34rem] text-white/80">{dict.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button href={waHref} variant="onDark" size="lg">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {dict.whatsapp}
            </Button>
            <Button href={`tel:+${site.phonePrimaryE164}`} variant="onDarkOutline" size="lg">
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {dict.call}
            </Button>
          </div>
          <p className="mt-4 text-[0.875rem] text-white/60">{dict.note}</p>
        </div>

        {/* Coordonnées */}
        <div className="lg:col-span-4 lg:col-start-9">
          <h3 className="border-b border-white/15 pb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-gold-light">
            {dict.contactTitle}
          </h3>
          <dl className="divide-y divide-white/15">
            <div className="flex items-start gap-4 py-4">
              <MessageCircle className="mt-1 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} aria-hidden />
              <div>
                <dt className="text-[0.8125rem] text-white/60">{dict.whatsappLabel}</dt>
                <dd>
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-gold-light">
                    {site.phonePrimary}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-4 py-4">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} aria-hidden />
              <div>
                <dt className="text-[0.8125rem] text-white/60">{dict.phoneLabel}</dt>
                <dd className="space-x-3">
                  <a href={`tel:+${site.phonePrimaryE164}`} className="font-medium text-white hover:text-gold-light">
                    {site.phonePrimary}
                  </a>
                  <span className="text-white/40">·</span>
                  <a href={`tel:+${site.phoneSecondaryE164}`} className="font-medium text-white hover:text-gold-light">
                    {site.phoneSecondary}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-4 py-4">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} aria-hidden />
              <div>
                <dt className="text-[0.8125rem] text-white/60">{dict.locationLabel}</dt>
                <dd className="font-medium text-white">{location}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
