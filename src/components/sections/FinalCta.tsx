import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/data/site";
import { Reveal, SplitWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type Props = { dict: Dictionary["cta"] };

export function FinalCta({ dict }: Props) {
  const waHref = `${site.whatsappUrl}?text=${encodeURIComponent(dict.whatsappMessage)}`;

  return (
    <section id="contact" className="relative isolate overflow-hidden py-28 md:py-40">
      {/* Fond soie rouge */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/brand/red-silk-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={60}
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir via-bordeaux/60 to-noir" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(253,212,1,0.12),transparent_70%)]" />
      </div>

      <div className="container-x">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-or/30 bg-noir/55 px-6 py-16 text-center backdrop-blur-xl md:px-16 md:py-24">
          {/* Lauriers en filigrane */}
          <Image
            src="/images/brand/laurel-gold.png"
            alt=""
            width={483}
            height={378}
            className="pointer-events-none absolute left-1/2 top-1/2 w-[70%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
          />

          <Reveal y={14} duration={0.8}>
            <p className="eyebrow">{dict.eyebrow}</p>
          </Reveal>
          <h2 className="display-2 mt-6 text-ivoire">
            <SplitWords text={dict.title} stagger={0.04} />
          </h2>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mt-6 max-w-2xl text-creme/80">{dict.lead}</p>
          </Reveal>

          <Reveal delay={0.35} className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button href={waHref} external variant="gold" data-cursor-label="WhatsApp">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {dict.whatsapp}
              </span>
            </Button>
            <Button href={`tel:+${site.phonePrimaryE164}`} external variant="outline" icon={false}>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {dict.call} · {site.phonePrimary}
              </span>
            </Button>
          </Reveal>

          <Reveal delay={0.5}>
            <p className="mt-8 flex items-center justify-center gap-2 text-[0.7rem] uppercase tracking-[0.25em] text-creme/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jaune opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-jaune" />
              </span>
              {dict.note}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
