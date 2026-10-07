import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { basesByZone, zoneOrder, mapPins, type ZoneKey } from "@/data/bases";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BasesExplorer, type ZoneView } from "./BasesExplorer";

type Props = { locale: Locale; dict: Dictionary["bases"] };

/**
 * Composant serveur : prépare des données sérialisables (le dictionnaire
 * contient une fonction `basesCount`, qui ne peut pas traverser la frontière client).
 */
export function Bases({ locale, dict }: Props) {
  const zones: ZoneView[] = zoneOrder.map((key: ZoneKey) => ({
    key,
    label: dict.zones[key],
    count: dict.basesCount(basesByZone[key].length),
    bases: basesByZone[key],
  }));

  const pins = mapPins.map((p) => ({ ...p, countLabel: dict.basesCount(p.count) }));

  return (
    <section id="bases" className="relative overflow-hidden bg-noir-2 py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
      <div className="container-x">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />
        <BasesExplorer
          locale={locale}
          zones={zones}
          pins={pins}
          labels={{ mapLegend: dict.mapLegend, abidjanPin: dict.abidjanPin, findBase: dict.findBase }}
        />
      </div>
    </section>
  );
}
