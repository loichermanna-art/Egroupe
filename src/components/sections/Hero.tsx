import Image from "next/image";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";

type Props = { locale: Locale; dict: Dictionary["hero"] };

export function Hero({ locale, dict }: Props) {
  return (
    <section id="top" className="bg-paper">
      <div className="wrap grid items-start gap-10 pb-16 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-20">
        {/* Texte */}
        <div className="lg:col-span-6 xl:col-span-5">
          <span className="rule-gold" aria-hidden />
          <p className="t-eyebrow mt-4">{dict.eyebrow}</p>
          <h1 className="t-display mt-4 text-ink">
            {dict.titleA}{" "}
            <em className="font-normal italic text-red">{dict.titleEm}</em>{" "}
            {dict.titleB}
          </h1>
          <p className="t-lead mt-6 max-w-[34rem]">{dict.lead}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button href={site.whatsappUrl} size="lg">
              {dict.ctaPrimary}
            </Button>
            <Button href={`/${locale}#results`} variant="link">
              {dict.ctaSecondary}
            </Button>
          </div>
        </div>

        {/* Photo */}
        <div className="lg:col-span-6 lg:pl-4 xl:col-span-7">
          <figure>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-cream">
                <Image
                  src="/images/team-encadreurs.jpg"
                  alt={dict.photoCaption}
                  fill
                  priority
                  sizes="(min-width: 1280px) 56vw, (min-width: 1024px) 50vw, 100vw"
                  quality={85}
                  className="object-cover object-[50%_35%]"
                />
              </div>
              {/* Chiffre clé : à cheval sur l'angle inférieur gauche de la photo (desktop), sous la photo (mobile) */}
              <div className="mt-5 flex items-baseline gap-3 border-l-4 border-gold bg-red px-5 py-4 text-white lg:absolute lg:-left-6 lg:bottom-8 lg:mt-0 lg:flex-col lg:items-start lg:gap-1 lg:shadow-[0_18px_40px_-24px_rgba(27,21,23,0.6)]">
                <span className="font-serif text-[1.875rem] font-semibold leading-none tabular-nums lg:text-[2.5rem]">
                  {dict.highlightValue}
                </span>
                <span className="text-[0.875rem] leading-snug text-white/85">{dict.highlightLabel}</span>
              </div>
            </div>
            <figcaption className="t-caption mt-3 flex items-start justify-between gap-6">
              <span>{dict.photoCaption}</span>
              <span className="shrink-0 font-medium text-ink-2">{dict.photoTag}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
