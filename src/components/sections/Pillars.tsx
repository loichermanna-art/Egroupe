import type { Dictionary } from "@/i18n/get-dictionary";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { PillarsList } from "./PillarsList";

type Props = { dict: Dictionary["pillars"] };

/**
 * Programmes : le titre et le chapeau restent épinglés à gauche pendant que
 * les quatre domaines défilent à droite, soulignés au stylo quand on les lit.
 */
export function Pillars({ dict }: Props) {
  return (
    <section id="programs" className="section bg-paper">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:self-start">
          <SplitLines as="h2" text={dict.title} className="t-h2 text-ink" />
          <Reveal as="p" className="t-lead mt-4 max-w-md" delay={0.25}>
            {dict.lead}
          </Reveal>
        </header>
        <PillarsList items={dict.items} bulletsTitle={dict.bulletsTitle} className="lg:col-span-7 lg:col-start-6" />
      </div>
    </section>
  );
}
