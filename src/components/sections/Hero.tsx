import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";

type Props = { locale: Locale; dict: Dictionary["hero"]; facts: Dictionary["facts"] };

/**
 * En-tête de page : présentation factuelle, photo de l'équipe qui déborde
 * à droite sur grand écran, puis une ligne de repères chiffrés.
 */
export function Hero({ locale, dict, facts }: Props) {
  const home = `/${locale}`;

  return (
    <section id="top" className="bg-paper">
      <div className="wrap">
        <div className="grid gap-10 pb-12 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-16 lg:pt-16">
          {/* Texte */}
          <div className="lg:col-span-5 lg:pt-2">
            <h1 className="t-display text-ink">{dict.title}</h1>
            <p className="t-lead mt-5 max-w-[32rem]">{dict.lead}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={site.whatsappUrl} size="lg">
                {dict.ctaPrimary}
              </Button>
              <Button href={`${home}#bases`} variant="secondary" size="lg">
                {dict.ctaSecondary}
              </Button>
            </div>

            {/* Annonce de la session : information datée, comme sur un site tenu à jour */}
            <p className="mt-9 max-w-[32rem] border-l-2 border-red pl-4 text-[0.9375rem] leading-relaxed text-ink-2">
              <strong className="font-semibold text-ink">{dict.noticeLabel}.</strong> {dict.notice}{" "}
              <Link href={`${home}#results`} className="link-ul whitespace-nowrap font-medium text-red">
                {dict.noticeLink}
              </Link>
            </p>
          </div>

          {/* Photo */}
          <figure className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden bg-cream lg:bleed-r lg:aspect-[16/10]">
              <Image
                src="/images/team-encadreurs.jpg"
                alt={dict.photoCaption}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                quality={85}
                className="object-cover object-[50%_35%]"
              />
            </div>
            <figcaption className="t-caption mt-2.5">{dict.photoCaption}</figcaption>
          </figure>
        </div>

        {/* Repères */}
        <dl className="grid grid-cols-2 border-t border-line-2 md:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={[
                "flex flex-col py-5 pr-4 md:py-6",
                i % 2 === 1 ? "border-l border-line pl-5 md:pl-6" : "",
                i >= 2 ? "border-t border-line md:border-t-0" : "",
                i === 2 ? "md:border-l md:pl-6" : "",
              ].join(" ")}
            >
              <dt className="order-2 mt-1.5 text-[0.875rem] leading-snug text-ink-2">{f.label}</dt>
              <dd className="order-1 font-serif text-[1.625rem] font-semibold leading-none tabular-nums text-ink md:text-[1.75rem]">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
