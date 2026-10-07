# Excellence Group (E-Group) — Site web

Site vitrine d'**Excellence Group**, structure ivoirienne de formation créée en 2011
(cours de renforcement scolaire & universitaire, développement personnel, entrepreneuriat).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (tokens de la charte dans `src/app/globals.css`)
- **motion** (animations, scroll-linked) · **Lenis** (défilement fluide)
- Polices auto-hébergées : *Playfair Display* (titres) + *Outfit* (texte) via `@fontsource-variable`
- i18n maison : routes `/fr` (défaut) et `/en`, redirection automatique via `src/proxy.ts`

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000 → redirige vers /fr
npm run build      # build de production (pages /fr et /en pré-rendues)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Structure

```
src/
  app/[lang]/        layout (fonts, metadata, preloader, nav, footer), page d'accueil, 404
  components/
    layout/          Preloader, Navbar, Footer, Cursor (curseur personnalisé)
    sections/        Hero, Marquee, About, Pillars, Results, Bases, Events, Learning, Testimonials, FinalCta
    ui/              Button, Magnetic, Reveal/SplitWords, Counter, SectionHeader, ScrollWords, BrandIcons
    providers/       SmoothScroll (Lenis)
  data/              site (contacts, liens), stats (taux BAC/BEPC), laureates, bases, events
  i18n/              config, dictionnaires fr/en, getDictionary
  lib/               utils (cn, formats), intro (état du preloader), hooks
public/images/       logos, photo d'équipe, illustrations, affiches des événements, image OG
docs/                brief complet + dossier de présentation source
```

## Contenu & sources

- `docs/BRIEF-EXCELLENCE-GROUP.md` — synthèse complète de la structure (identité, offre, bases, statistiques, événements, contacts, charte graphique). **À lire en premier.**
- `docs/Presentation-EGroup-1.pdf`, `docs/Presentation-EGroup-2.pdf` — dossier de présentation officiel (source).
- `docs/source-pages/` — rendu image des pages du dossier.
- Les textes du site sont centralisés dans `src/i18n/dictionaries/{fr,en}.ts` ; les données (bases, résultats, lauréats, événements) dans `src/data/`.

## Variables d'environnement

- `NEXT_PUBLIC_SITE_URL` (optionnel) — URL publique utilisée pour les balises canonical / Open Graph (défaut : `https://excellencegroup.ci`).
