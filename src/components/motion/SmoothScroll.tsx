"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import Lenis from "lenis";

import { useMotionContext } from "./MotionProvider";

type ScrollApi = {
  /** Défile vers une cible (sélecteur `#id`, élément ou position) en tenant compte de l'en-tête. */
  scrollTo: (target: string | HTMLElement | number, opts?: { immediate?: boolean }) => void;
  /** Verrouille / déverrouille le défilement (menu mobile, intro). */
  lock: () => void;
  unlock: () => void;
};

const ScrollContext = createContext<ScrollApi>({
  scrollTo: () => {},
  lock: () => {},
  unlock: () => {},
});

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const h = parseInt(raw, 10);
  return -((Number.isFinite(h) ? h : 72) + 16);
}

/**
 * Défilement lissé (Lenis) sur ordinateur uniquement ; natif sur mobile et
 * lorsque l'utilisateur préfère réduire les animations. Prend aussi en charge
 * les liens d'ancre de la page (décalage de l'en-tête) et le hash initial.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { reduced, fine, introDone } = useMotionContext();
  const lenisRef = useRef<Lenis | null>(null);
  const smooth = fine && !reduced;

  useEffect(() => {
    if (!smooth) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    if (document.documentElement.hasAttribute("data-intro")) lenis.stop();
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [smooth]);

  const scrollTo = useCallback<ScrollApi["scrollTo"]>((target, opts) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: headerOffset(), immediate: opts?.immediate, duration: 1.1 });
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (typeof el === "number") {
      window.scrollTo({ top: el, behavior: opts?.immediate ? "instant" : "smooth" });
    } else if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + headerOffset();
      window.scrollTo({ top, behavior: opts?.immediate ? "instant" : "smooth" });
    }
  }, []);

  const lock = useCallback(() => {
    document.documentElement.setAttribute("data-locked", "");
    lenisRef.current?.stop();
  }, []);
  const unlock = useCallback(() => {
    document.documentElement.removeAttribute("data-locked");
    if (!document.documentElement.hasAttribute("data-intro")) lenisRef.current?.start();
  }, []);

  // Liens d'ancre internes : on reprend la main pour appliquer le décalage de l'en-tête
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      scrollTo(el);
      // Lien d'évitement : le focus doit suivre (l'élément porte tabindex="-1")
      if (el.hasAttribute("tabindex")) el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [scrollTo]);

  // Démarre Lenis à la fin de l'intro et corrige la position si l'URL contient un hash
  useEffect(() => {
    if (!introDone) return;
    if (!document.documentElement.hasAttribute("data-locked")) lenisRef.current?.start();
    const hash = window.location.hash;
    if (hash.length > 1) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        const t = setTimeout(() => scrollTo(el, { immediate: true }), 50);
        return () => clearTimeout(t);
      }
    }
  }, [introDone, scrollTo]);

  const api = useMemo(() => ({ scrollTo, lock, unlock }), [scrollTo, lock, unlock]);
  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export function useSmoothScroll() {
  return useContext(ScrollContext);
}
