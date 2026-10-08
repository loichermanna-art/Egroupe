import Link from "next/link";
import Image from "next/image";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { Reveal, Stagger, Item } from "@/components/motion/Reveal";
import { PenUnderline } from "@/components/motion/PenMark";

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
    { href: site.socials.facebook, label: "Facebook", handle: "ExcellenceGroup1", Icon: FacebookIcon },
    { href: site.socials.instagram, label: "Instagram", handle: "@group.excellence", Icon: InstagramIcon },
    { href: site.socials.tiktok, label: "TikTok", handle: "Excellence Group", Icon: TikTokIcon },
    { href: site.socials.linkedin, label: "LinkedIn", handle: "Excellence Group", Icon: LinkedinIcon },
  ];

  return (
    <footer className="bg-ink pb-[env(safe-area-inset-bottom)] text-paper/80" data-margin-dark="">
      <div className="wrap pb-8 pt-14 md:pt-16">
        <Stagger className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8" gap={0.1}>
          {/* Marque */}
          <Item>
            <Link href={home} className="inline-flex items-center gap-3">
              <Image src="/images/brand/logo-excellence-group-192.png" alt={site.name} width={48} height={48} className="h-12 w-12" />
              <span className="font-serif text-[1.1875rem] font-semibold leading-tight text-white">{site.name}</span>
            </Link>
            <span className="rule-gold mt-5" aria-hidden />
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed">{dict.footer.description}</p>
            {/* La devise, signée d'un trait de stylo */}
            <p className="mt-3 font-serif text-[1.0625rem] text-gold-light">
              <PenUnderline color="gold" delay={0.6}>
                {dict.footer.tagline}
              </PenUnderline>
            </p>
          </Item>

          {/* Navigation */}
          <Item as="div">
          <nav aria-label={dict.footer.navTitle}>
            <h2 className="t-label text-white">{dict.footer.navTitle}</h2>
            <ul className="mt-3 text-[0.9375rem] md:mt-4">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-10 items-center transition-colors hover:text-white md:min-h-8">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          </Item>

          {/* Contact */}
          <Item>
            <h2 className="t-label text-white">{dict.footer.contactTitle}</h2>
            <ul className="mt-3 text-[0.9375rem] md:mt-4 md:space-y-2.5">
              <li>
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center transition-colors hover:text-white md:min-h-0">
                  WhatsApp · {site.phonePrimary}
                </a>
              </li>
              <li>
                <a href={`tel:+${site.phoneSecondaryE164}`} className="inline-flex min-h-10 items-center transition-colors hover:text-white md:min-h-0">
                  {site.phoneSecondary}
                </a>
              </li>
              <li className="flex min-h-10 items-center md:min-h-0">{dict.footer.location}</li>
              <li>
                <a href={site.links.learningWeb} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center transition-colors hover:text-white md:min-h-0">
                  app.excellencegroup.ci
                </a>
              </li>
            </ul>
          </Item>

          {/* Réseaux */}
          <Item>
            <h2 className="t-label text-white">{dict.footer.followTitle}</h2>
            <ul className="mt-3 text-[0.9375rem] md:mt-4">
              {socials.map(({ href, label, handle, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-10 items-center gap-3 transition-colors hover:text-white md:min-h-9">
                    <Icon className="h-4 w-4 text-paper/60 transition-colors group-hover:text-white" />
                    <span>
                      {label} <span className="text-paper/50">· {handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Item>
        </Stagger>

        <Reveal kind="fade" delay={0.3} className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-[0.8125rem] text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} — {dict.footer.rights}
          </p>
          <a href="#top" className="inline-flex min-h-10 items-center self-start transition-colors hover:text-white sm:min-h-0 sm:self-auto">
            {dict.footer.backToTop} ↑
          </a>
        </Reveal>
      </div>
    </footer>
  );
}
