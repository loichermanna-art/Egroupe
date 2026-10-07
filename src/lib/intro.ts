"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

export const INTRO_KEY = "eg-intro-seen";

/* ------------------------------------------------------------------ */
/* Petit store synchrone partagé entre le Preloader et le Hero          */
/* ------------------------------------------------------------------ */
const listeners = new Set<() => void>();
let finished = false;

function emit() {
  listeners.forEach((l) => l());
}

function alreadySeen() {
  try {
    return !!window.sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

export const introStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /** L'intro doit-elle être affichée en ce moment ? */
  isPlaying(reduced: boolean) {
    if (finished || reduced) return false;
    return !alreadySeen();
  },
  /** Termine l'intro : mémorise la visite et notifie les abonnés. */
  finish() {
    if (finished) return;
    finished = true;
    try {
      window.sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* stockage indisponible : on ignore */
    }
    document.documentElement.dataset.intro = "done";
    emit();
  },
};

/**
 * `true` tant que l'écran d'introduction est affiché.
 * Côté serveur on considère l'intro active (le hero reste masqué jusqu'à l'hydratation,
 * et un script inline masque le preloader pour les visiteurs qui l'ont déjà vu).
 */
export function useIntroPlaying(): boolean {
  const reduced = useReducedMotion();
  return useSyncExternalStore(
    introStore.subscribe,
    () => introStore.isPlaying(!!reduced),
    () => true,
  );
}

/** `true` lorsque l'intro est terminée (ou non jouée). */
export function useIntroDone(): boolean {
  return !useIntroPlaying();
}
