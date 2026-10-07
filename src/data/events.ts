export type EventKey = "motivation" | "afterbac" | "orientation" | "brevetes" | "eclosion";

export type EventMedia = {
  key: EventKey;
  /** Affiche principale (portrait ou carré). */
  poster: { src: string; width: number; height: number };
  /** Affiches secondaires pour la pile / le collage. */
  extras: { src: string; width: number; height: number }[];
  accent: string;
};

export const eventMedia: Record<EventKey, EventMedia> = {
  motivation: {
    key: "motivation",
    poster: { src: "/images/events/motivation-day-2026-arene-des-champions.jpg", width: 729, height: 911 },
    extras: [
      { src: "/images/events/motivation-day-2024-repousse-tes-limites.jpg", width: 763, height: 1080 },
      { src: "/images/events/motivation-day-2025.jpg", width: 864, height: 864 },
    ],
    accent: "#fdd401",
  },
  afterbac: {
    key: "afterbac",
    poster: { src: "/images/events/after-bac-2026.jpg", width: 795, height: 795 },
    extras: [
      { src: "/images/events/after-bac-2025.jpg", width: 795, height: 795 },
      { src: "/images/events/after-bac-2024.jpg", width: 1075, height: 806 },
    ],
    accent: "#e5c25b",
  },
  orientation: {
    key: "orientation",
    poster: { src: "/images/events/semaine-orientation-2022.jpg", width: 1080, height: 810 },
    extras: [{ src: "/images/events/journee-carriere-2022.jpg", width: 1200, height: 848 }],
    accent: "#f3dc8a",
  },
  brevetes: {
    key: "brevetes",
    poster: { src: "/images/events/gala-des-brevetes.jpg", width: 1080, height: 1080 },
    extras: [],
    accent: "#d4a93a",
  },
  eclosion: {
    key: "eclosion",
    poster: { src: "/images/events/eclosion-8.jpg", width: 918, height: 918 },
    extras: [
      { src: "/images/events/eclosion-7.jpg", width: 1200, height: 848 },
      { src: "/images/events/eclosion-6-2023.jpg", width: 1113, height: 787 },
    ],
    accent: "#e5c25b",
  },
};

export const eventOrder: EventKey[] = ["motivation", "afterbac", "orientation", "brevetes", "eclosion"];
