import Link from "next/link";
import Image from "next/image";
import { MapPin, MessageCircle, Phone, ArrowUp } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TikTokIcon } from "@/components/ui/BrandIcons";

type Props = { locale: Locale; dict: Dictionary };

export function Footer({ locale, dict }: Props) {
  const home = `/${locale}`;
  const year = new Date().getFullYear();
  const nav = [
    { href: `${home}#about`, label: dict.nav.about },
    { href: `${home}#programs`, label: dict.nav.programs },
    { href: `${home}#results`, label: dict.nav.results },
    { href: `${home}#bases`, label: dict.nav.bases },
    { href: `${home}#events`, label: dict.nav.events },
    { href: `${home}#learning`, label: dict.nav.learning },
    { href: `${home}#contact`, label: dict.nav.contact },
  ];
  const socials = [
    { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-ivoire/10 bg-noir">
      {/* Wordmark géant */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex select-none justify-center overflow-hidden">
        <span className="translate-y-[28%] whitespace-nowrap font-display text-[clamp(5rem,17vw,16rem)] font-semibold leading-none tracking-tight text-ivoire/[0.035]">
          EXCELLENCE
        </span>
      </div>

      <div className="container-x relative pb-28 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Marque */}
          <Reveal className="lg:col-span-5" amount={0.2}>
            <Link href={home} className="inline-flex items-center gap-4">
              <Image src="/images/brand/logo-excellence-group-192.png" alt={site.name} width={72} height={72} className="h-16 w-16" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-semibold text-ivoire">Excellence</span>
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-or">Group</span>
              </span>
            </Link>
            <p className="mt-6 font-display text-lg italic text-or">{dict.footer.tagline}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{dict.footer.description}</p>
            <div className="mt-8 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-ivoire/15 text-ivoire/80 transition hover:-translate-y-0.5 hover:border-or hover:text-or"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Navigation */}
          <Reveal className="lg:col-span-3" delay={0.1} amount={0.2}>
            <p className="eyebrow">{dict.footer.navTitle}</p>
            <ul className="mt-6 space-y-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex items-center gap-2 text-sm text-ivoire/80 transition hover:text-or">
                    <span className="h-px w-0 bg-or transition-all duration-500 group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contact */}
          <Reveal className="lg:col-span-4" delay={0.2} amount={0.2}>
            <p className="eyebrow">{dict.footer.contactTitle}</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-ivoire/85 transition hover:text-or">
                  <MessageCircle className="h-4 w-4 text-or" strokeWidth={1.6} />
                  <span>
                    WhatsApp · <span className="font-medium">{site.phonePrimary}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:+${site.phoneSecondaryE164}`} className="flex items-center gap-3 text-ivoire/85 transition hover:text-or">
                  <Phone className="h-4 w-4 text-or" strokeWidth={1.6} />
                  <span className="font-medium">{site.phoneSecondary}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-ivoire/85">
                <MapPin className="h-4 w-4 text-or" strokeWidth={1.6} />
                {dict.footer.location}
              </li>
            </ul>

            <p className="eyebrow mt-10">{dict.footer.followTitle}</p>
            <p className="mt-3 text-sm text-muted">@group.excellence · ExcellenceGroup1</p>
          </Reveal>
        </div>

        {/* Bas de page */}
        <div className="mt-20 flex flex-col gap-4 border-t border-ivoire/10 pt-8 text-xs text-muted-2 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>{dict.footer.madeWith}</span>
            <Link href={`${home}#top`} className="inline-flex items-center gap-2 text-or transition hover:text-jaune" aria-label="Top">
              <ArrowUp className="h-3.5 w-3.5" />
              Top
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
