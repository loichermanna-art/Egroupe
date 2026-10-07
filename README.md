# Excellence Group (E-Group) — Site web

Site vitrine d'**Excellence Group**, structure ivoirienne de formation créée en 2011
(cours de renforcement scolaire & universitaire, développement personnel, entrepreneuriat).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — système graphique (couleurs, échelle typographique, motifs) dans `src/app/globals.css`
- Aucune bibliothèque d'animation : transitions CSS courtes uniquement
- Polices auto-hébergées : *Source Serif 4* (titres, citations) + *Inter* (texte, interface) via `@fontsource-variable`
- i18n maison : routes `/fr` (défaut) et `/en`, redirection automatique via `src/proxy.ts`

## Principes de design

- Palette limitée issue de la charte : rouge `#B20603`, bordeaux `#8F0219`, or en accent, fonds papier/crème, texte encre.
- Typographie à taille réaliste (H1 30–48 px, H2 24–34 px), hiérarchie claire, titres descriptifs plutôt que slogans.
- Mise en page sur filets et grilles plutôt qu'en cartes ; en-têtes de section volontairement variés (empilé / scindé) ; un seul bloc de couleur (résultats).
- Visuels réels uniquement : photo de l'équipe, affiches officielles des événements, carte vectorielle exacte de la Côte d'Ivoire (`src/data/map-ci.ts`).
- Pas d'animation au défilement ni de compteurs : seulement des transitions de 150 ms sur les états (hover, actif, onglets, menu).
- Informations datées rendues honnêtement : badge « prochain rendez-vous » uniquement si une date future est connue (`nextDate` dans `src/data/events.ts`), sinon renvoi vers les réseaux sociaux.

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
  app/[lang]/        layout (fonts, metadata, nav, footer), page d'accueil, 404
  components/
    layout/          Navbar (barre utilitaire + navigation, section active, menu mobile), Footer
    sections/        Hero (+ repères chiffrés), About, Pillars, Results, Bases (+ BasesExplorer), Events, Learning, Testimonials, FinalCta
    ui/              Button, SectionHeader, MapCI (carte SVG), BrandIcons
  data/              site (contacts, liens), stats (taux BAC/BEPC), laureates, bases (+ coordonnées), events, map-ci (contour du pays)
  i18n/              config, dictionnaires fr/en, getDictionary
  lib/               utils (cn, formats)
public/images/       logos, photo d'équipe, affiches des événements, image Open Graph
docs/                brief complet + dossier de présentation source
```

## Contenu & sources

- `docs/BRIEF-EXCELLENCE-GROUP.md` — synthèse complète de la structure (identité, offre, bases, statistiques, événements, contacts, charte graphique). **À lire en premier.**
- `docs/Presentation-EGroup-1.pdf`, `docs/Presentation-EGroup-2.pdf` — dossier de présentation officiel (source).
- `docs/source-pages/` — rendu image des pages du dossier.
- Les textes du site sont centralisés dans `src/i18n/dictionaries/{fr,en}.ts` ; les données (bases, résultats, lauréats, événements) dans `src/data/`.

## Variables d'environnement

- `NEXT_PUBLIC_SITE_URL` (optionnel) — URL publique utilisée pour les balises canonical / Open Graph (défaut : `https://excellencegroup.ci`).
