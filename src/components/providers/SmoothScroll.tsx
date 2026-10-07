"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Défilement fluide (Lenis) — inertie douce façon agences premium.
 * Désactivé automatiquement pour les utilisateurs préférant moins d'animations.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 1.25,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.4,
        anchors: { offset: -72 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
