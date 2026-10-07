export type RatePoint = { session: string; short: string; rate: number };

/** Taux de réussite au Baccalauréat (élèves Excellence Group), par session. */
export const bacRates: RatePoint[] = [
  { session: "2011-2012", short: "12", rate: 50 },
  { session: "2012-2013", short: "13", rate: 69.44 },
  { session: "2013-2014", short: "14", rate: 80.1 },
  { session: "2014-2015", short: "15", rate: 88.9 },
  { session: "2015-2016", short: "16", rate: 95.91 },
  { session: "2016-2017", short: "17", rate: 87.5 },
  { session: "2017-2018", short: "18", rate: 90.63 },
  { session: "2018-2019", short: "19", rate: 87.43 },
  { session: "2019-2020", short: "20", rate: 85.59 },
  { session: "2020-2021", short: "21", rate: 90.63 },
  { session: "2021-2022", short: "22", rate: 80 },
  { session: "2022-2023", short: "23", rate: 82.17 },
  { session: "2023-2024", short: "24", rate: 82.08 },
  { session: "2024-2025", short: "25", rate: 94.03 },
  { session: "2025-2026", short: "26", rate: 90.02 },
];

/** Taux de réussite au BEPC (élèves Excellence Group), par session. */
export const bepcRates: RatePoint[] = [
  { session: "2014-2015", short: "15", rate: 70 },
  { session: "2015-2016", short: "16", rate: 87.5 },
  { session: "2016-2017", short: "17", rate: 92 },
  { session: "2017-2018", short: "18", rate: 94.17 },
  { session: "2018-2019", short: "19", rate: 91.03 },
  { session: "2019-2020", short: "20", rate: 95.2 },
  { session: "2020-2021", short: "21", rate: 88 },
  { session: "2021-2022", short: "22", rate: 80 },
  { session: "2022-2023", short: "23", rate: 84.12 },
  { session: "2023-2024", short: "24", rate: 86.65 },
  { session: "2024-2025", short: "25", rate: 95.91 },
  { session: "2025-2026", short: "26", rate: 93.75 },
];
