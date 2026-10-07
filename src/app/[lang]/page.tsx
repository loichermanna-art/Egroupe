import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { Pillars } from "@/components/sections/Pillars";
import { Results } from "@/components/sections/Results";
import { Bases } from "@/components/sections/Bases";
import { Events } from "@/components/sections/Events";
import { Learning } from "@/components/sections/Learning";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero locale={lang} dict={dict.hero} />
      <Marquee items={dict.marquee} />
      <About locale={lang} dict={dict.about} />
      <Pillars dict={dict.pillars} />
      <Results locale={lang} dict={dict.results} />
      <Bases locale={lang} dict={dict.bases} />
      <Events locale={lang} dict={dict.events} />
      <Learning dict={dict.learning} />
      <Testimonials dict={dict.testimonials} />
      <FinalCta dict={dict.cta} />
    </>
  );
}
