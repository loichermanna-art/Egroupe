# Excellence Group (E-Group) — Site web

Site vitrine d'**Excellence Group**, structure ivoirienne de formation créée en 2011
(cours de renforcement scolaire & universitaire, développement personnel, entrepreneuriat).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — système graphique (couleurs, échelle typographique, motifs) dans `src/app/globals.css`
- **Motion** (`motion/react`) pour les entrées, les transitions d'état et les tracés SVG · **Lenis** pour le défilement lissé
- Polices auto-hébergées : *Source Serif 4* (titres, citations) + *Inter* (texte, interface) via `@fontsource-variable`
- i18n maison : routes `/fr` (défaut) et `/en`, redirection automatique via `src/proxy.ts`

## Principes de design

- Palette limitée issue de la charte : rouge `#B20603`, bordeaux `#8F0219`, or en accent, fonds papier/crème, texte encre.
- Typographie à taille réaliste (H1 30–48 px, H2 24–34 px), hiérarchie claire, titres descriptifs plutôt que slogans.
- Mise en page sur filets et grilles plutôt qu'en cartes ; en-têtes de section volontairement variés (empilé / scindé) ; un seul bloc de couleur (résultats).
- Visuels réels uniquement : photo de l'équipe, affiches officielles des événements, carte vectorielle de la Côte d'Ivoire issue de Natural Earth 1:10m (`src/data/map-ci.ts`).
- Motion design « cinématique » mais au service du contenu : voir la section dédiée ci-dessous.
- Informations datées rendues honnêtement : badge « prochain rendez-vous » uniquement si une date future est connue (`nextDate` dans `src/data/events.ts`), sinon renvoi vers les réseaux sociaux.

## Motion design

Couche de mouvement ajoutée par-dessus la charte, sans changer la mise en page ni les textes (`src/components/motion/`) :

- **Intro** (`Preloader`) : la feuille de cahier — la réglure se trace, la marge rouge descend, la devise « Discipline, Travail et Réussite » s'écrit mot à mot (signature avec l'emblème en bas), puis la feuille remonte ; ≈ 3,2 s, jouée **une fois par session** (`sessionStorage` `eg-intro-seen`), simple fondu ensuite. Timings en tête de `useEffect` dans `Preloader.tsx` (sortie 2 300 ms, page libérée 2 750 ms).
- **Défilement lissé** (`SmoothScroll`, Lenis) : ordinateur uniquement, natif sur mobile ; les ancres internes tiennent compte de la hauteur de l'en-tête (`--header-h`) ; verrouillage pendant l'intro et le menu mobile.
- **Curseur personnalisé** (`Cursor`) : point + anneau à ressort, en mode « différence » ; uniquement si `(hover: hover) and (pointer: fine)`. Sur un élément portant `data-cursor="…"` (boutons WhatsApp / Appeler), l'anneau devient une pastille rouge qui affiche le mot (textes `cursor.*` des dictionnaires).
- **Le cahier d'écolier** (fil conducteur de la page) :
  - **Marge** (`Margin`) : filet rouge fixe à gauche de la page (`--margin-x`), qui se remplit avec la progression du défilement (ressort) et passe à l'or devant les fonds sombres (éléments marqués `data-margin-dark` : bloc résultats, pied de page). Le contenu est aligné à `--margin-x + --margin-gap` (classe `wrap`, variables dans `globals.css`).
  - **Stylo du correcteur** (`PenMark`, `PenUnderline`, `CircledCounter`) : traits SVG « à main levée » qui se tracent (`pathLength`) — cercle rouge autour de « 90,02 % » dans le bandeau du hero et cercle or sur le taux BAC du bloc résultats (une fois le compteur arrivé à sa valeur), soulignement du programme en cours de lecture, du premier lauréat et de la devise du pied de page.
  - **Programmes épinglés** (`Pillars` + `PillarsList`) : sur grand écran le titre reste épinglé pendant que les quatre programmes défilent ; celui qui passe au milieu de l'écran est « lu » (net, souligné au stylo), les autres s'estompent à 42 %. Tous nets sur mobile et en animations réduites.
  - **Piste des événements** (`Events` + `EventsTrack`) : sur ordinateur (≥ 64 rem de large et ≥ 44 rem de haut), la section est épinglée et le défilement vertical fait glisser les cinq rendez-vous à l'horizontale (affiche + texte) ; ailleurs, liste verticale habituelle. Seuils en tête du composant.
  - **Bouton magnétique** (`Magnetic`) : le bouton WhatsApp (hero et contact) suit légèrement le pointeur (± 10 px, ressort) ; ordinateur uniquement.
- **Révélations à l'entrée dans l'écran** (`Reveal`, `Stagger`/`Item`, `Rule`, `RevealImage`) : montée + fondu, filets qui se tracent, images dévoilées par masque avec léger zoom ; **titres révélés ligne par ligne** derrière un masque (`SplitLines`, lignes mesurées dans le DOM réel) ; compteurs (`Counter`) ; parallaxe légère sur la photo (`Parallax`).
- **États animés** : soulignement de la section active et des onglets (`layoutId`), fondu croisé des séries de résultats et des zones de bases, courbe de résultats et contour de la carte qui se tracent (`pathLength`), épingles qui se posent, menu mobile en cascade, en-tête qui s'efface au défilement vers le bas.
- **Carte 3D immersive** (`ui/MapCI.tsx`) : plan incliné en perspective (`perspective` CSS + `rotateX`, angle de 38° en vue d'ensemble à 55° en vue rapprochée, léger balancement au repos), relief en épaisseur sous le contour, brume d'horizon, repères dressés (ombre au sol, tige, tête) dont la taille suit la profondeur. À l'ouverture, la caméra descend sur Abidjan pendant que le plan s'incline et que le contour se trace ; elle vole ensuite (zoom + déplacement, trajectoire qui « prend de la hauteur » entre deux points éloignés) vers la zone, la ville ou la base choisie ; au niveau pays on voit les villes, au niveau ville les 23 bases nommées, la lagune Ébrié et l'océan posés au sol. Zoom par boutons, double-clic, glisser-déposer à la souris ; `viewBox` SVG animé (net à tout niveau de zoom) ; les repères restent des éléments 2D placés à la position projetée de leur point au sol (fonction `project`, mêmes paramètres que la scène CSS), ce qui évite les aplatissements de `preserve-3d`. Contour Natural Earth 1:10m (`src/data/map-ci.ts`, généré) ; coordonnées des bases au niveau du quartier dans `src/data/bases.ts` (`lat`/`lng`, à affiner avec les relevés GPS de la structure). Réglages en tête de fichier : `TILT_FAR`/`TILT`, `PERSPECTIVE`, `PLANE`, `K_MIN`, `START_K`.

Garde-fous :

- `prefers-reduced-motion: reduce` → intro réduite à un fondu, pas de Lenis, pas de curseur, pas de parallaxe, pas d'épinglage ni d'estompage, traits de stylo affichés directement, éléments visibles sans animation.
- **SEO / sans JavaScript** : tout le texte (titres compris) est rendu côté serveur ; les éléments préparés pour l'animation portent `data-motion` / `data-motion-tree` / `data-pen` et une règle `html:not(.js) […]` les rend visibles si le script ne s'exécute pas (l'intro `data-preloader` est alors masquée) (`<html class="js">` est posé par un script inline dans `<head>`).
- **Mobile** : pas de Lenis, pas de curseur, pas de parallaxe, pas d'épinglage (programmes et événements en listes verticales) ; uniquement des révélations courtes, la marge et les traits de stylo.

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
    motion/          MotionProvider (contexte intro / reduced-motion / pointeur), SmoothScroll (Lenis), Preloader, Cursor, Margin, Magnetic, PenMark, Reveal, SplitLines, Counter, Parallax
    layout/          Navbar (barre utilitaire + navigation, section active, menu mobile), Footer
    sections/        Hero (+ repères chiffrés), About, Pillars (+ PillarsList), Results, Bases (+ BasesExplorer), Events (+ EventsTrack), Learning, Testimonials, FinalCta
    ui/              Button, SectionHeader, MapCI (carte 3D), BrandIcons
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

- `NEXT_PUBLIC_SITE_URL` (optionnel) — URL publique utilisée pour les balises canonical / Open Graph, le `sitemap.xml` et le `robots.txt`.
  Si elle est absente, le site utilise le domaine de production Vercel (`VERCEL_PROJECT_PRODUCTION_URL`, injecté automatiquement), puis `https://excellencegroup.ci` par défaut.
  Modèle : `.env.example` (copier en `.env.local` si besoin ; les fichiers `.env*` sont ignorés par Git).

## Responsive & mobile

- Approche *mobile-first* : chaque composant possède une présentation téléphone (320 → 430 px), tablette (768 px) et bureau (≥ 1024 px) sans perte d'information
  (tableau des lauréats → liste à deux lignes, événements → liste illustrée, carte des bases placée au-dessus de la liste et cadrée plus serré sur Abidjan).
- Zones tactiles ≥ 44 px pour la navigation, les onglets, les boutons de la carte et les liens du pied de page ; marges latérales et menu mobile tiennent compte des
  encoches (`env(safe-area-inset-*)`, `viewport-fit=cover`).
- Les effets réservés au bureau (défilement lissé, curseur, sections épinglées, parallaxe) sont désactivés sur écran tactile ou en `prefers-reduced-motion` ;
  l'effet de caméra de la carte (zoom + déplacement) reste actif partout.

## Déployer sur Vercel

Le projet est un site Next.js standard : aucune configuration particulière (ni `vercel.json`, ni variable obligatoire) n'est nécessaire.

1. Sur [vercel.com](https://vercel.com) → **Add New… → Project**, choisir le dépôt GitHub `loichermanna-art/Egroupe`.
2. Vercel détecte **Next.js** automatiquement : *Framework Preset* `Next.js`, *Build Command* `next build`, *Output* par défaut, *Install Command* `npm install`.
   Laisser le *Root Directory* vide (le `package.json` est à la racine). Node.js 20 ou supérieur (`engines` dans `package.json`).
3. (Optionnel) Onglet **Environment Variables** : `NEXT_PUBLIC_SITE_URL = https://votre-domaine.ci` si le site est servi sous un domaine personnalisé.
4. **Deploy**. Chaque `git push` sur la branche de production (par défaut `main`) redéploie le site ; les autres branches et les *pull requests*
   obtiennent une URL de prévisualisation (`*.vercel.app`).
5. Domaine personnalisé : **Settings → Domains → Add**, puis chez le registrar un enregistrement `A` (`76.76.21.21`) pour l'apex
   ou un `CNAME` vers `cname.vercel-dns.com` pour `www`. Le certificat HTTPS est émis automatiquement.

Vérification locale avant un déploiement : `npm run typecheck && npm run lint && npm run build` (identique à ce que Vercel exécute).
La racine `/` redirige vers `/fr` ou `/en` selon la langue du navigateur (`src/proxy.ts`) ; `/robots.txt` et `/sitemap.xml` sont générés par `src/app/robots.ts` et `src/app/sitemap.ts`.
