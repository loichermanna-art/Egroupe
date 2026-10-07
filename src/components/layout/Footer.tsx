import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
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
    { href: site.socials.facebook, label: "Facebook", handle: "ExcellenceGroup1", Icon: FacebookIcon },
    { href: site.socials.instagram, label: "Instagram", handle: "@group.excellence", Icon: InstagramIcon },
    { href: site.socials.tiktok, label: "TikTok", handle: "Excellence Group", Icon: TikTokIcon },
    { href: site.socials.linkedin, label: "LinkedIn", handle: "Excellence Group", Icon: LinkedinIcon },
  ];

  return (
    <footer className="bg-ink text-paper/80">
      <div className="wrap pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          {/* Marque */}
          <div>
            <Link href={home} className="inline-flex items-center gap-3">
              <Image
                src="/images/brand/logo-excellence-group-192.png"
                alt={site.name}
                width={56}
                height={56}
                className="h-14 w-14"
              />
              <span className="font-serif text-xl font-semibold leading-tight text-white">
                Excellence Group
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed">{dict.footer.description}</p>
            <p className="mt-4 text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-gold-light">{dict.footer.tagline}</p>
          </div>

          {/* Navigation */}
          <nav aria-label={dict.footer.navTitle}>
            <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-white">{dict.footer.navTitle}</h2>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-white">{dict.footer.contactTitle}</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              <li>
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  WhatsApp · {site.phonePrimary}
                </a>
              </li>
              <li>
                <a href={`tel:+${site.phoneSecondaryE164}`} className="transition-colors hover:text-white">
                  {site.phoneSecondary}
                </a>
              </li>
              <li>{dict.footer.location}</li>
              <li>
                <a href={site.links.learningWeb} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  app.excellencegroup.ci
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux */}
          <div>
            <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-white">{dict.footer.followTitle}</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {socials.map(({ href, label, handle, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 transition-colors hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-paper/60 transition-colors group-hover:text-white" />
                    <span>
                      {label} <span className="text-paper/50">· {handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.8125rem] text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} — {dict.footer.rights}
          </p>
          <a href="#main" className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {dict.footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
