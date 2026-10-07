export type Laureate = {
  rank: number;
  name: string;
  series: "A" | "C" | "D";
  points: number;
  mention: "TB" | "B";
};

/** Les 35 meilleurs bacheliers Excellence Group — session 2026. */
export const laureates2026: Laureate[] = [
  { rank: 1, name: "Angora Eva", series: "D", points: 329, mention: "TB" },
  { rank: 2, name: "Yeo Yomoyaha", series: "C", points: 325, mention: "TB" },
  { rank: 3, name: "Kobenan Nelly", series: "D", points: 323, mention: "TB" },
  { rank: 4, name: "Kouame Assena", series: "D", points: 323, mention: "TB" },
  { rank: 5, name: "Koffi Kissi Anne", series: "D", points: 312, mention: "B" },
  { rank: 6, name: "Kourouma Kouassi Mari Yvan", series: "D", points: 311, mention: "B" },
  { rank: 7, name: "Niamke Christ", series: "A", points: 309, mention: "B" },
  { rank: 8, name: "Kouassi Adjoua Yohanna Odelia", series: "D", points: 300, mention: "B" },
  { rank: 9, name: "Atse Marie", series: "D", points: 296, mention: "B" },
  { rank: 10, name: "Camara Ahoua Sockna", series: "A", points: 296, mention: "B" },
  { rank: 11, name: "Kouadio N'Da Christ", series: "D", points: 295, mention: "B" },
  { rank: 12, name: "Diaby Mohammed", series: "A", points: 295, mention: "B" },
  { rank: 13, name: "Achi Mohayé Tania", series: "D", points: 293, mention: "B" },
  { rank: 14, name: "Yoh Grace Prunelle", series: "D", points: 293, mention: "B" },
  { rank: 15, name: "Lé Irié Divine Ophir", series: "D", points: 293, mention: "B" },
  { rank: 16, name: "Sogodogo Seydou", series: "D", points: 292, mention: "B" },
  { rank: 17, name: "Kablan Désirée Emmanuella", series: "A", points: 292, mention: "B" },
  { rank: 18, name: "Ouattara Yasmine", series: "D", points: 291, mention: "B" },
  { rank: 19, name: "Irie Bi Prince", series: "D", points: 290, mention: "B" },
  { rank: 20, name: "Traoré Raïna", series: "D", points: 290, mention: "B" },
  { rank: 21, name: "Emmanuel Ayala", series: "A", points: 289, mention: "B" },
  { rank: 22, name: "N'Guessan Ebrotié", series: "C", points: 288, mention: "B" },
  { rank: 23, name: "Kouamé Marie Maya", series: "C", points: 288, mention: "B" },
  { rank: 24, name: "Koffi N'Guessan Henoc", series: "D", points: 287, mention: "B" },
  { rank: 25, name: "Kone Samira", series: "D", points: 285, mention: "B" },
  { rank: 26, name: "Zanklan Winner", series: "A", points: 285, mention: "B" },
  { rank: 27, name: "Sidibé Fatima", series: "D", points: 285, mention: "B" },
  { rank: 28, name: "Bognompke Love Marie Kenza", series: "C", points: 285, mention: "B" },
  { rank: 29, name: "Adiko Grace Eden", series: "D", points: 283, mention: "B" },
  { rank: 30, name: "Kouassi Deborah Amon", series: "D", points: 283, mention: "B" },
  { rank: 31, name: "Djato Abenan", series: "D", points: 282, mention: "B" },
  { rank: 32, name: "Koffi Yeboua Samira", series: "D", points: 281, mention: "B" },
  { rank: 33, name: "Kouassi Eva", series: "A", points: 281, mention: "B" },
  { rank: 34, name: "Bouabre Grâce", series: "D", points: 280, mention: "B" },
  { rank: 35, name: "Kouassi Merveille", series: "D", points: 280, mention: "B" },
];
