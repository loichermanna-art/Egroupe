import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { basesByZone, zoneOrder, mapPins, referenceCities, type ZoneKey } from "@/data/bases";
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
    <section id="bases" className="section border-y border-line bg-cream">
      <div className="wrap">
        <SectionHeader eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />
        <BasesExplorer
          locale={locale}
          zones={zones}
          pins={pins}
          cities={referenceCities}
          labels={{
            legendBases: dict.legendBases,
            legendCities: dict.legendCities,
            findBase: dict.findBase,
            findBaseHint: dict.findBaseHint,
          }}
        />
      </div>
    </section>
  );
}
