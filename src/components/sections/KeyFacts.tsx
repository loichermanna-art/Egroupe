import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { items: Dictionary["facts"] };

/** Bandeau de chiffres clés : une ligne sobre, séparée par des filets. */
export function KeyFacts({ items }: Props) {
  return (
    <section aria-label="Chiffres clés" className="border-y border-line bg-cream">
      <div className="wrap">
        <dl className="grid grid-cols-2 divide-line sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {items.map((f, i) => (
            <div
              key={f.label}
              className={[
                "flex flex-col gap-1 py-6 lg:px-6 lg:py-7",
                i === 0 ? "lg:pl-0" : "",
                i === items.length - 1 ? "lg:pr-0" : "",
                // Sur mobile : filets horizontaux entre les rangées
                i >= 2 ? "border-t border-line sm:border-t-0" : "",
                i >= 3 ? "sm:border-t sm:border-line lg:border-t-0" : "",
              ].join(" ")}
            >
              <dt className="order-2 text-[0.8125rem] leading-snug text-ink-2">{f.label}</dt>
              <dd className="order-1 font-serif text-[1.75rem] font-semibold leading-none tabular-nums text-ink md:text-[2rem]">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
