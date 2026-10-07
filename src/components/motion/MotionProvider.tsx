"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

/* ------------------------------------------------------------------
   Contexte de mouvement
   - introDone : l'intro (preloader) est terminée → les entrées peuvent jouer
   - reduced   : l'utilisateur préfère réduire les animations
   - fine      : pointeur précis + survol (ordinateur) → curseur, parallaxe, Lenis
------------------------------------------------------------------- */

type MotionContextValue = {
  introDone: boolean;
  finishIntro: () => void;
  reduced: boolean;
  fine: boolean;
};

const MotionContext = createContext<MotionContextValue>({
  introDone: true,
  finishIntro: () => {},
  reduced: false,
  fine: false,
});

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const finishIntro = useCallback(() => setIntroDone(true), []);

  const value = useMemo(() => ({ introDone, finishIntro, reduced, fine }), [introDone, finishIntro, reduced, fine]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionContext() {
  return useContext(MotionContext);
}

/** Courbes partagées par tout le site. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_EXPO = [0.76, 0, 0.24, 1] as const;
