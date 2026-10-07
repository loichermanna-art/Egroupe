export type ZoneKey = "south" | "north" | "interior";

export type Base = {
  area: string;
  place: string;
  city?: string;
};

export const basesByZone: Record<ZoneKey, Base[]> = {
  south: [
    { area: "Anani", place: "Groupe scolaire la Nouvelle Jérusalem" },
    { area: "Koumassi Nord-Est", place: "EPP Nord-Est" },
    { area: "Koumassi Sicogi", place: "EPP Sicogi Est" },
    { area: "Port-Bouët", place: "Groupe scolaire Selmer Commissariat" },
    { area: "Marcory", place: "EPP Marcory — près de l'église Ste Thérèse" },
    { area: "Anoumabo", place: "École St Pierre d'Anoumabo" },
  ],
  north: [
    { area: "Cocody", place: "EPP Pilote (Cocody Sud)" },
    { area: "Angré", place: "EPP Groupement 4000, Angré Bâtim" },
    { area: "Riviéra II", place: "EPP Sogefiha 1" },
    { area: "Faya", place: "EPP Laurier 9" },
    { area: "Abobo", place: "EPP Habitat 1" },
    { area: "Songon", place: "EPP Songon M'Brathé 1" },
    { area: "Bingerville", place: "EPP Les Plateaux 4" },
    { area: "Dokui", place: "Azur 2000 — La Colombe" },
    { area: "Adjamé", place: "EPP Adjamé Liberté 3" },
    { area: "Yopougon Niangon", place: "EPP Niangon Nord" },
    { area: "Yopougon Nouveau Quartier", place: "EPP Nouveau Quartier" },
  ],
  interior: [
    { area: "Grand-Bassam", place: "EPP Le Phare", city: "Grand-Bassam" },
    { area: "Yamoussoukro", place: "EPP Zaher (220 logements)", city: "Yamoussoukro" },
    { area: "Yamoussoukro", place: "EPP Kokpenou (SOPIM Cité)", city: "Yamoussoukro" },
    { area: "Bouaké", place: "EPP TSF Bassa", city: "Bouaké" },
    { area: "Bouaké", place: "EPP CNPS A", city: "Bouaké" },
    { area: "Arrah", place: "EPP Centre 3", city: "Arrah" },
  ],
};

export const zoneOrder: ZoneKey[] = ["south", "north", "interior"];

export const totalBases = Object.values(basesByZone).reduce((n, list) => n + list.length, 0);

/** Positions (en % de l'image de la carte dorée) des épingles. */
export type MapPin = { key: string; label: string; x: number; y: number; count: number; primary?: boolean };

export const mapPins: MapPin[] = [
  { key: "abidjan", label: "Abidjan", x: 64, y: 72.5, count: 17, primary: true },
  { key: "bassam", label: "Grand-Bassam", x: 67.5, y: 75, count: 1 },
  { key: "yakro", label: "Yamoussoukro", x: 51, y: 57, count: 2 },
  { key: "bouake", label: "Bouaké", x: 54, y: 47.5, count: 2 },
  { key: "arrah", label: "Arrah", x: 64.5, y: 59, count: 1 },
];
