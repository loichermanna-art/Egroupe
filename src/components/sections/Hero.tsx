import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal, RevealImage, Stagger, Item, Rule } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Counter } from "@/components/motion/Counter";
import { CircledCounter } from "@/components/motion/PenMark";
import { Magnetic } from "@/components/motion/Magnetic";

type Props = { locale: Locale; dict: Dictionary["hero"]; facts: Dictionary["facts"]; cursor: Dictionary["cursor"] };

/** Découpe « {bac} … {bepc} … » en segments texte / jetons. */
function splitNotice(template: string): string[] {
  return template.split(/(\{bac\}|\{bepc\})/).filter(Boolean);
}

/**
 * En-tête de page. Entrée orchestrée après l'intro : titre ligne par ligne,
 * chapeau, boutons, annonce ; la photo se dévoile par un masque et se pose,
 * puis les repères chiffrés s'incrémentent.
 */
export function Hero({ locale, dict, facts, cursor }: Props) {
  const home = `/${locale}`;
  const pct = locale === "fr" ? " %" : "%";
  const notice = splitNotice(dict.notice);

  return (
    <section id="top" className="bg-paper">
      <div className="wrap">
        <div className="grid gap-10 pb-12 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-16 lg:pt-16">
          {/* Texte */}
          <div className="lg:col-span-5 lg:pt-2">
            <SplitLines as="h1" text={dict.title} className="t-display text-ink" delay={0.1} gap={0.11} />
            <Reveal as="p" className="t-lead mt-5 max-w-[32rem]" delay={0.45}>
              {dict.lead}
            </Reveal>

            <Stagger className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" delay={0.6} gap={0.1}>
              <Item>
                <Magnetic className="w-full sm:w-auto">
                  <Button href={site.whatsappUrl} size="lg" className="w-full sm:w-auto" data-cursor={cursor.whatsapp}>
                    {dict.ctaPrimary}
                  </Button>
                </Magnetic>
              </Item>
              <Item>
                <Button href={`${home}#bases`} variant="secondary" size="lg" className="w-full sm:w-auto">
                  {dict.ctaSecondary}
                </Button>
              </Item>
            </Stagger>

            {/* Annonce de la session : information datée ; le stylo du correcteur entoure le taux du BAC */}
            <Reveal kind="fade" delay={0.95}>
              <p className="mt-9 max-w-[32rem] border-l-2 border-red pl-4 text-[0.9375rem] leading-[1.9] text-ink-2">
                <strong className="font-semibold text-ink">{dict.noticeLabel}.</strong>{" "}
                {notice.map((part, i) =>
                  part === "{bac}" ? (
                    <CircledCounter
                      key={i}
                      value={site.stats.bacRate2026}
                      locale={locale}
                      decimals={2}
                      suffix={pct}
                      delay={1.05}
                      duration={1.6}
                      className="mx-1 font-semibold text-ink"
                    />
                  ) : part === "{bepc}" ? (
                    <Counter key={i} value={site.stats.bepcRate2026} locale={locale} decimals={2} suffix={pct} delay={1.2} duration={1.6} className="font-semibold text-ink" />
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}{" "}
                <Link href={`${home}#results`} className="link-ul whitespace-nowrap font-medium text-red">
                  {dict.noticeLink}
                </Link>
              </p>
            </Reveal>
          </div>

          {/* Photo */}
          <figure className="lg:col-span-7">
            <RevealImage className="aspect-[3/2] bg-cream lg:bleed-r lg:aspect-[16/10]" delay={0.25}>
              <Parallax className="h-full w-full" range={5}>
                <Image
                  src="/images/team-encadreurs.jpg"
                  alt={dict.photoCaption}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  quality={85}
                  className="object-cover object-[50%_35%]"
                />
              </Parallax>
            </RevealImage>
            <Reveal as="figcaption" kind="fade" delay={1.1} className="t-caption mt-2.5">
              {dict.photoCaption}
            </Reveal>
          </figure>
        </div>

        {/* Repères */}
        <div className="relative">
          <Rule className="absolute inset-x-0 top-0 bg-line-2" delay={0.9} />
          <Stagger as="dl" className="grid grid-cols-2 md:grid-cols-4" delay={1.0} gap={0.1}>
            {facts.map((f, i) => (
              <Item
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
                  {f.count === null ? f.value : <Counter value={f.count} locale={locale} delay={1.1 + i * 0.1} duration={1.4} />}
                </dd>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
