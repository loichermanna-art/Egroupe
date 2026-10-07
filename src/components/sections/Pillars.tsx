import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { dict: Dictionary["pillars"] };
type Item = Dictionary["pillars"]["items"][number];

function BulletList({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div>
      <h4 className="t-label">{title}</h4>
      <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-ink">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-[0.7em] h-px w-3 shrink-0 bg-ink-3" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Programmes : le renforcement scolaire — cœur de l'activité — occupe toute
 * la largeur ; les trois autres domaines suivent sur une rangée.
 */
export function Pillars({ dict }: Props) {
  const [main, ...others] = dict.items as [Item, ...Item[]];

  return (
    <section id="programs" className="section bg-paper">
      <div className="wrap">
        <SectionHeader layout="split" title={dict.title} lead={dict.lead} />

        {/* Programme principal */}
        <article className="mt-10 grid gap-6 border-t-2 border-ink pt-7 md:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="t-h3 text-ink">{main.title}</h3>
            <p className="mt-1 text-[0.9375rem] text-ink-3">{main.subtitle}</p>
            <p className="mt-4 max-w-[36rem] leading-[1.7] text-ink-2">{main.text}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-1">
            <BulletList title={dict.bulletsTitle} bullets={main.bullets} />
          </div>
        </article>

        {/* Autres programmes */}
        <div className="mt-10 grid border-t border-line md:mt-12 md:grid-cols-3 md:gap-x-10">
          {others.map((item, i) => (
            <article key={item.key} className={["pt-6 pb-8 md:pb-0", i > 0 ? "border-t border-line md:border-t-0" : ""].join(" ")}>
              <h3 className="t-h3 text-ink">{item.title}</h3>
              <p className="mt-1 text-[0.9375rem] text-ink-3">{item.subtitle}</p>
              <p className="mt-4 leading-[1.7] text-ink-2">{item.text}</p>
              <div className="mt-5">
                <BulletList title={dict.bulletsTitle} bullets={item.bullets} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
