export type ZoneKey = "south" | "north" | "interior";

export type LabelSide = "left" | "right" | "top" | "bottom";

export type Base = {
  /** Identifiant stable (ancres, état de la carte). */
  id: string;
  area: string;
  place: string;
  city?: string;
  /**
   * Position approximative (niveau quartier, ±1 km) — à affiner avec les
   * coordonnées GPS exactes fournies par la structure.
   */
  lat: number;
  lng: number;
  /** Côté de l'étiquette sur la carte, pour éviter les chevauchements. */
  labelSide: LabelSide;
  /** Zoom minimal à partir duquel l'étiquette est affichée (bases très proches). */
  labelMinK?: number;
};

export const basesByZone: Record<ZoneKey, Base[]> = {
  south: [
    { id: "anani", area: "Anani", place: "Groupe scolaire la Nouvelle Jérusalem", lat: 5.27, lng: -3.935, labelSide: "right", labelMinK: 12 },
    { id: "koumassi-nord-est", area: "Koumassi Nord-Est", place: "EPP Nord-Est", lat: 5.3, lng: -3.95, labelSide: "right" },
    { id: "koumassi-sicogi", area: "Koumassi Sicogi", place: "EPP Sicogi Est", lat: 5.292, lng: -3.956, labelSide: "bottom", labelMinK: 12 },
    { id: "port-bouet", area: "Port-Bouët", place: "Groupe scolaire Selmer Commissariat", lat: 5.252, lng: -3.968, labelSide: "bottom" },
    { id: "marcory", area: "Marcory", place: "EPP Marcory — près de l'église Ste Thérèse", lat: 5.298, lng: -3.982, labelSide: "top" },
    { id: "anoumabo", area: "Anoumabo", place: "École St Pierre d'Anoumabo", lat: 5.303, lng: -3.999, labelSide: "left" },
  ],
  north: [
    { id: "cocody", area: "Cocody", place: "EPP Pilote (Cocody Sud)", lat: 5.338, lng: -3.996, labelSide: "left", labelMinK: 12 },
    { id: "angre", area: "Angré", place: "EPP Groupement 4000, Angré Bâtim", lat: 5.396, lng: -3.978, labelSide: "right" },
    { id: "riviera-2", area: "Riviéra II", place: "EPP Sogefiha 1", lat: 5.362, lng: -3.966, labelSide: "bottom", labelMinK: 12 },
    { id: "faya", area: "Faya", place: "EPP Laurier 9", lat: 5.372, lng: -3.936, labelSide: "right" },
    { id: "abobo", area: "Abobo", place: "EPP Habitat 1", lat: 5.42, lng: -4.02, labelSide: "top" },
    { id: "songon", area: "Songon", place: "EPP Songon M'Brathé 1", lat: 5.31, lng: -4.255, labelSide: "right" },
    { id: "bingerville", area: "Bingerville", place: "EPP Les Plateaux 4", lat: 5.356, lng: -3.887, labelSide: "right" },
    { id: "dokui", area: "Dokui", place: "Azur 2000 — La Colombe", lat: 5.393, lng: -3.998, labelSide: "left", labelMinK: 12 },
    { id: "adjame", area: "Adjamé", place: "EPP Adjamé Liberté 3", lat: 5.357, lng: -4.022, labelSide: "left", labelMinK: 12 },
    { id: "yopougon-niangon", area: "Yopougon Niangon", place: "EPP Niangon Nord", lat: 5.328, lng: -4.095, labelSide: "left" },
    {
      id: "yopougon-nouveau-quartier",
      area: "Yopougon Nouveau Quartier",
      place: "EPP Nouveau Quartier",
      lat: 5.352,
      lng: -4.075,
      labelSide: "left",
      labelMinK: 12,
    },
  ],
  interior: [
    { id: "grand-bassam", area: "Grand-Bassam", place: "EPP Le Phare", city: "Grand-Bassam", lat: 5.209, lng: -3.743, labelSide: "right" },
    { id: "yamoussoukro-zaher", area: "Yamoussoukro", place: "EPP Zaher (220 logements)", city: "Yamoussoukro", lat: 6.812, lng: -5.283, labelSide: "left" },
    {
      id: "yamoussoukro-kokpenou",
      area: "Yamoussoukro",
      place: "EPP Kokpenou (SOPIM Cité)",
      city: "Yamoussoukro",
      lat: 6.835,
      lng: -5.262,
      labelSide: "right",
    },
    { id: "bouake-tsf", area: "Bouaké", place: "EPP TSF Bassa", city: "Bouaké", lat: 7.705, lng: -5.02, labelSide: "right" },
    { id: "bouake-cnps", area: "Bouaké", place: "EPP CNPS A", city: "Bouaké", lat: 7.68, lng: -5.04, labelSide: "left" },
    { id: "arrah", area: "Arrah", place: "EPP Centre 3", city: "Arrah", lat: 6.673, lng: -3.968, labelSide: "right" },
  ],
};

export const zoneOrder: ZoneKey[] = ["south", "north", "interior"];

export const totalBases = Object.values(basesByZone).reduce((n, list) => n + list.length, 0);

/** Villes où Excellence Group est implanté (coordonnées géographiques réelles). */
export type MapPin = { key: string; label: string; lat: number; lng: number; count: number; primary?: boolean };

export const mapPins: MapPin[] = [
  { key: "abidjan", label: "Abidjan", lat: 5.345, lng: -4.024, count: 17, primary: true },
  { key: "bassam", label: "Grand-Bassam", lat: 5.211, lng: -3.738, count: 1 },
  { key: "yakro", label: "Yamoussoukro", lat: 6.827, lng: -5.289, count: 2 },
  { key: "bouake", label: "Bouaké", lat: 7.694, lng: -5.03, count: 2 },
  { key: "arrah", label: "Arrah", lat: 6.673, lng: -3.97, count: 1 },
];

/** Villes repères affichées en gris pour situer la carte. */
export const referenceCities: { label: string; lat: number; lng: number }[] = [
  { label: "Korhogo", lat: 9.458, lng: -5.629 },
  { label: "Man", lat: 7.412, lng: -7.554 },
  { label: "Daloa", lat: 6.877, lng: -6.45 },
  { label: "San-Pédro", lat: 4.748, lng: -6.636 },
];

/** Toponymes affichés uniquement une fois la carte zoomée sur Abidjan. */
export const areaLabels: { key: "abidjan" | "lagoon" | "ocean"; lat: number; lng: number }[] = [
  { key: "abidjan", lat: 5.352, lng: -4.052 },
  { key: "lagoon", lat: 5.289, lng: -4.17 },
  { key: "ocean", lat: 5.2, lng: -4.09 },
];

/* ---------------- Caméra ---------------- */

/** Zoom maximal de la carte (au-delà, le contour 1:10m devient trop grossier). */
export const MAP_MAX_ZOOM = 20;

/** Zoom appliqué lorsqu'on « vole » vers une base. */
export const baseZoom: Record<ZoneKey, number> = { south: 16, north: 16, interior: 12 };
