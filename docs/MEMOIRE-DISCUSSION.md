# Mémoire de la discussion — Site Excellence Group (E-Group)

*Document de reprise : ce qui a été demandé, décidé, construit et ce qui reste à faire.*
*Dernière mise à jour : 8 octobre 2026 · branche `arena/3004943d-egroupe` · PR #1 ouverte vers `main`.*

---

## 1. Le projet en une phrase

Créer, dans le dépôt GitHub `loichermanna-art/Egroupe`, le site web d'**Excellence Group (E-Group)**, structure ivoirienne de formation (cours de renforcement scolaire et universitaire, développement personnel, entrepreneuriat) créée en 2011 à Abidjan — en commençant par une **page d'accueil bilingue FR/EN** de très haute qualité, les autres pages venant ensuite, une par une.

---

## 2. Chronologie de la discussion

| Étape | Demande du client | Ce qui a été fait | Commit |
|---|---|---|---|
| 1 | Faire d'abord les recherches (documents, internet, réseaux sociaux) **avant** de coder. | Deux dossiers de présentation PDF récupérés (via Gmail, les pièces jointes du chat n'arrivant pas), pages extraites en images, recherches web/réseaux. Rédaction d'un brief complet `docs/BRIEF-EXCELLENCE-GROUP.md`. | `1f7c6bd` |
| 2 | Choix du périmètre : stack laissée à l'agent, **MVP page d'accueil d'abord**, site **FR + EN**, autres fonctionnalités « après on verra ». | Mise en place Next.js 16 + Tailwind v4 + TypeScript, i18n maison (`/fr`, `/en`), page d'accueil complète en 9 sections, données structurées dans `src/data`. | `caf3c76` |
| 3 | Refonte : supprimer l'esthétique « générée par IA » selon une consigne en 10 points (identité de marque réelle, pas de cartes partout ni de dégradés/verre, typographie réaliste H1 30–48 px / H2 24–34 px, palette limitée, composants variés, images réelles uniquement, navigation simple, vrai responsive, états d'interface réels, rien d'ajouté « pour faire design »). Tout le contenu et la logique doivent être conservés. | Première passe : thème sombre, lueurs, dégradés, titres géants, préchargeur, curseur, marquee, illustrations IA retirés ; palette charte (rouge, bordeaux, or, papier). | `ebfc09c` |
| 4 | Encore trop « généré ». | Seconde passe : titres descriptifs plutôt que slogans, en-têtes de section variés, suppression des animations de défilement et compteurs, grilles sur filets, zéro décoration gratuite. PR #1 ouverte. | `f01e278` |
| 5 | « **Passons au motion design** » : niveau **cinématique** (références : lisa.locomotive.ca, realevate.agency, sobha-privy-collection.com, cerebrium.ai), avec **préchargeur + défilement lissé + curseur personnalisé** (ordinateur seulement), **sans toucher** à la charte, la typographie, la mise en page, les textes ni la logique. Accessibilité, SEO et performance mobile à préserver. | Couche motion complète (`src/components/motion/`) : intro une fois par session, Lenis, curseur, révélations ligne par ligne, tracés SVG, compteurs, parallaxe, états animés. | `6d7d607` |
| 6 | Carte des bases : la caméra doit **voler vers la base sélectionnée** (zoom + déplacement). | Carte à caméra : contour réel Natural Earth 1:10m, 23 bases géolocalisées (niveau quartier), vol zoom + déplacement, niveaux pays / ville, zoom boutons, double-clic, glisser. | `6d50aed` |
| 7 | La carte doit **déjà être un plan 3D immersif zoomé sur Abidjan avant tout clic** (pas la vue plate du pays). | Scène en perspective : plan incliné (38° → 55° selon le zoom), relief, brume d'horizon, repères dressés, ouverture caméra sur Abidjan pendant que le contour se trace. | `1df153a` |
| 8 | Relancer le serveur pour voir l'aperçu. | Dépendances réinstallées (l'environnement avait été remis à zéro), serveur `npm run dev` relancé sur le port 3000. | — |
| 9 | Rédiger ce document de mémoire. | Présent fichier. | `0eb88de` |
| 10 | Le client colle un prototype externe « kit cahier d'écolier » (marge rouge, stylo du correcteur, programmes épinglés, piste d'événements horizontale, bouton magnétique, curseur à mots, préchargeur cahier) et demande de l'expliquer, puis choisit l'option **A : greffer les idées dans nos composants** (pas de reproduction littérale). | Greffe complète en Next.js, FR + EN, rendu serveur, `prefers-reduced-motion` respecté, Lenis conservé, carte 3D intacte, panneau « Specs » du prototype non repris, indice de défilement volontairement non ajouté. Préchargeur réécrit en feuille de cahier (ancienne version emblème récupérable dans le commit `0eb88de`). | `90c1d90` |
| 11 | Trois demandes : **conserver l'effet de déplacement / immersion / zoom de la carte**, rendre le projet **déployable sur Vercel** (déjà relié à GitHub) et expliquer les étapes, et faire l'**adaptation mobile complète** (mobile-first, menu hamburger, tableaux/graphiques/formulaires/onglets/images adaptés, largeurs 320 / 375 / 390–430 / 768 / 1024+, aucun débordement horizontal, encoches, cibles tactiles 44 px, animations lourdes évitées sur mobile, bureau inchangé, rien de retiré). | Audit en navigateur headless (Chromium) à 320 / 375 / 390 / 430 / 768 / 1024 / 1440 en FR et EN : débordement horizontal nul partout, zéro erreur console. **Bug majeur corrigé au passage** : les images « révélées » (`RevealImage`) n'apparaissaient jamais (bureau et mobile) car l'élément observé par `IntersectionObserver` était masqué par son propre `clip-path`. Navigation mobile retravaillée, tableau des lauréats en liste, événements en liste illustrée, carte en premier sur mobile avec cadrage serré sur Abidjan, étiquettes et boutons adaptés, pied de page tactile, safe-area. Vercel : `getSiteUrl()`, `robots.ts`, `sitemap.ts`, `engines.node`, `.env.example`, README (déploiement + responsive). Build vérifié depuis un clone propre (`npm ci && next build`). | `79db4fb` |

---

## 3. Consignes permanentes du client

- Travailler **dans le dépôt existant** `/home/user/Egroupe` (GitHub `loichermanna-art/Egroupe`), sur la branche `arena/3004943d-egroupe` ; PR #1 vers `main`.
- **Communiquer en français.**
- Rechercher et documenter avant de coder (fait).
- Stack au choix de l'agent, mais résultat au niveau « de la qualité du site que je veux ».
- **MVP accueil d'abord**, puis les pages une par une ; formulaire d'inscription, carte interactive avancée, graphiques, galerie : « après on verra » (la carte a finalement été développée à la demande).
- Site **FR et EN** (sélecteur de langue, contenu traduit).
- **Pas d'esthétique « générée »** : pas de typographie géante, pas de verre/dégradés/lueurs, pas d'illustrations IA ou 3D décoratives, navigation simple, vrai responsive, états d'interface réels, rien d'ajouté artificiellement. Conserver toute l'information et la logique.
- **Motion design cinématique** assumé (préchargeur, Lenis, curseur ordinateur) — cette demande remplace l'ancienne consigne « micro-interactions très discrètes » — en gardant charte et typographie, et en respectant `prefers-reduced-motion`, le SEO (texte rendu côté serveur) et la performance mobile.
- **Kit « cahier d'écolier »** : option A choisie — greffer les idées dans nos composants (textes FR + EN, timings adaptés au site), pas de reproduction littérale du prototype ; charte et typographie inchangées ; carte 3D intacte.

---

## 4. Ce que l'on sait d'Excellence Group (données utilisées sur le site)

**Identité.** Excellence Group (E-Group), fondé en 2011 à Abidjan ; base historique École Nord-Est à Koumassi. Trois piliers : cours de renforcement (collège, lycée, université), développement personnel, entrepreneuriat ; une fondation (E-Group Fondation) ; une plateforme en ligne **EG Learning** (`app.excellencegroup.ci`, application EgroupLearning). Slogans : « L'excellence au rythme de notre vie. » · « Discipline, Travail et Réussite ».

**Chiffres clés (session 2025-2026).** BAC 90,02 % (94,03 % en 2025) ; BEPC 93,75 % (95,91 % en 2025) ; 2 147 bacheliers ; 4 mentions Très Bien, plus de 31 Bien, plus de 500 Assez Bien ; première lauréate ANGORA EVA (série D, 329 points). Séries complètes depuis 2011-2012 (BAC) et 2014-2015 (BEPC) dans `src/data/stats.ts` ; lauréats dans `src/data/laureates.ts`.

**Bases d'étude : 23.** Abidjan Sud 6 · Abidjan Nord 11 · Intérieur 6 (Grand-Bassam, Yamoussoukro, Bouaké, Arrah…). Coordonnées au niveau du quartier dans `src/data/bases.ts` (à affiner avec des relevés GPS).

**Événements.** Motivation Day, After BAC, Semaine de l'orientation, Gala des Brevetés, **ÉCLOSION** (8ᵉ édition le 25 juillet 2026 — date passée : le site n'affiche un badge « prochain rendez-vous » que si `nextDate` est futur dans `src/data/events.ts`). 17 affiches officielles dans `public/images/events/`.

**Contacts et réseaux.** WhatsApp / téléphone +225 07 58 43 99 90 (`wa.me/2250758439990`), second numéro +225 01 52 75 88 95 ; Facebook `ExcellenceGroup1` (96 % de recommandations) ; Instagram `@group.excellence` (≈ 6 500 abonnés) ; TikTok et LinkedIn renseignés dans `src/data/site.ts` mais **URL à confirmer**. Horaires : lun/mar/jeu/ven 18 h–21 h, mer/dim 15 h–19 h, sam 8 h–19 h. Témoignages utilisés : Junior Devis Ahi, Nelly Ogah, Enoc Malan (+ un quatrième).

**Sources.** `docs/Presentation-EGroup-1.pdf`, `docs/Presentation-EGroup-2.pdf` (pages en images dans `docs/source-pages/`), ancien site `egroup-learning.com`, pages Facebook/Instagram, Abidjan.net.

---

## 5. État technique actuel

**Stack.** Next.js 16.4 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4 (jetons dans `src/app/globals.css`), Motion (`motion/react`) 14, Lenis 1.3, polices auto-hébergées Source Serif 4 + Inter (`@fontsource-variable`), icônes Lucide (fonctionnelles uniquement) + icônes de marque maison (`ui/BrandIcons.tsx`). i18n maison : dictionnaires `src/i18n/dictionaries/{fr,en}.ts`, redirection `/` → `/fr` dans `src/proxy.ts`.

**Charte retenue.** Rouge `#B20603`, bordeaux `#8F0219` / `#5E0412`, or `#B8902B` (texte `#8C6A14`, pâle `#F6EFD9`), fonds papier `#FAF7F1` et crème `#F2EBDD`, encre `#1B1517` (+ `#4B4246`, `#7E7377`), filets `#E3DBCF` / `#CFC5B5`. Rayons 2 px / 6 px. Mise en page sur filets et grilles, un seul bloc de couleur (résultats).

**Page d'accueil (9 sections, ancres).** Hero (`top`) → À propos (`about`) → Programmes (`programs`) → Résultats (`results`, courbe BAC/BEPC + lauréats) → Bases (`bases`, carte 3D + liste par zone) → Événements (`events`) → EG Learning (`learning`) → Témoignages (`testimonials`) → Inscriptions / contact (`contact`). Barre de navigation avec section active et menu mobile ; pied de page ; page 404.

**Couche motion** (`src/components/motion/`) : `MotionProvider` (contexte intro / reduced-motion / pointeur fin, `useMediaQuery`), `SmoothScroll` (Lenis, ordinateur seulement, ancres avec décalage d'en-tête), `Preloader` (feuille de cahier : réglure, marge, devise mot à mot ; une fois par session, `sessionStorage` `eg-intro-seen`), `Cursor` (+ pastille à mot via `data-cursor`), `Margin` (marge rouge fixe qui se remplit au défilement, or devant `data-margin-dark`), `Magnetic` (bouton WhatsApp), `PenMark` / `PenUnderline` / `CircledCounter` (traits de stylo SVG), `Reveal` (+ `Stagger`, `Item`, `Rule`, `RevealImage`, `useReveal`), `SplitLines` (titres ligne par ligne), `Counter` (avec `onComplete`), `Parallax`. Sections : `Pillars` + `PillarsList` (titre épinglé, programme actif net et souligné, autres à 42 %), `Events` + `EventsTrack` (piste horizontale épinglée sur ordinateur, liste verticale ailleurs). Garde-fous : `prefers-reduced-motion`, rendu serveur de tout le texte, règles CSS « sans JavaScript » (`data-motion`, `data-motion-tree`, `data-pen`, `data-preloader`, `data-zoom-layer`).

**Réglages du « cahier ».** Position de la marge et retrait du contenu : `--margin-x` / `--margin-gap` dans `src/app/globals.css` (12 px + 16 px sur mobile, 44 px + 44 px à partir de 48 rem). Timings de l'intro : `Preloader.tsx`. Opacité des programmes en retrait (0,42) : `PillarsList.tsx`. Seuils d'épinglage des événements (64 rem de large, 44 rem de haut) : `EventsTrack.tsx`. Force du bouton magnétique (10 px) : `Magnetic.tsx`. Couleurs du stylo (rouge `#b20603`, or `#d9b45a`) : `PenMark.tsx`.

**Carte 3D** (`src/components/ui/MapCI.tsx`, pilotée par `sections/BasesExplorer.tsx`) : plan SVG incliné en perspective (`perspective` CSS + `rotateX`), angle 38° en vue d'ensemble → 55° en vue rapprochée, léger balancement au repos, relief sous le contour, brume d'horizon, repères dressés positionnés par projection mathématique (`project()`), `viewBox` animé (net à tout zoom). Ouverture : contour qui se trace + inclinaison + descente de la caméra sur Abidjan ; puis vols vers zone / ville / base, zoom ±, double-clic, glisser à la souris, retour à la vue d'ensemble. Réglages en tête de fichier : `TILT_FAR`, `TILT`, `PERSPECTIVE`, `PLANE`, `K_MIN`, `START_K`.

**Responsive / mobile** (étape 11). Marges latérales et menu tiennent compte des encoches (`--margin-x` avec `env(safe-area-inset-*)`, `viewport-fit=cover` dans `layout.tsx`). `Navbar` : sous 1024 px, bascule de langue + téléphone (≥ 390 px) + hamburger de 44 px, panneau avec tous les liens, « S'inscrire », WhatsApp / appel et choix de langue, défilement verrouillé, fermeture par Échap / clic / lien. `Results` : sous 640 px le tableau des lauréats devient une liste à deux lignes (toutes les colonnes conservées), courbe redimensionnée par `ResizeObserver`, onglets 44 px. `EventsTrack` (`ListRow`) : grille affiche + titre + méta sous 1024 px ou sans pointeur fin. `BasesExplorer` / `MapCI` : carte affichée **avant** la liste sous 1024 px (`order-first`), cadrage d'ouverture plus serré sur Abidjan quand l'écran est étroit (`FILL_NARROW` 0,8 contre 0,55), zoom rapproché ×1,25 sur une base, étiquettes mises à l'échelle selon la largeur de la scène (`labelScale`) et masquées plus tôt sur petite scène, boutons de zoom 44 px sur écran tactile (`pointer-coarse:`) ; l'effet de caméra (vol zoom + déplacement, plan 3D) est **identique** sur mobile. `Footer` : liens de 40 px de haut minimum. Les effets réservés au pointeur fin (Lenis, curseur, programmes épinglés, piste horizontale, magnétisme) restent désactivés sur tactile.

**Vercel.** Aucune configuration spécifique : `getSiteUrl()` (`src/lib/site-url.ts`) choisit `NEXT_PUBLIC_SITE_URL`, sinon `VERCEL_PROJECT_PRODUCTION_URL` (injectée par Vercel), sinon `https://excellencegroup.ci` ; `src/app/robots.ts` et `src/app/sitemap.ts` génèrent `/robots.txt` et `/sitemap.xml` (alternates fr / en / x-default) ; `engines.node >= 20.9` ; `.env.example` versionné (`!.env.example` dans `.gitignore`). Étapes détaillées dans le README (« Déployer sur Vercel »).

**Qualité.** `npm run typecheck`, `npm run lint` et `npm run build` passent ; pages `/fr` et `/en` pré-rendues ; README à jour (stack, principes, motion, structure).

---

## 6. Informations toujours attendues du client

1. Nom du fondateur / « Coach » et de l'équipe dirigeante (photos, titres).
2. Adresse officielle du siège et e-mail de contact.
3. Politique d'affichage des tarifs (afficher ou non, lesquels).
4. URL exactes TikTok et LinkedIn.
5. Logo au format SVG (les PNG fournis ont un libellé blanc, utilisable sur fond sombre seulement ; `icon-512.png` sert sur fond clair).
6. Photos supplémentaires (cours en base, Motivation Day, etc.).
7. Dates des prochains événements (pour réactiver le badge « prochain rendez-vous »).
8. **Coordonnées GPS précises des 23 bases** (celles en place sont au niveau du quartier).
9. Retour visuel sur la carte 3D : angle d'inclinaison (55° volontairement « rasant », 45° plus lisible), densité de la brume, taille des repères.

---

## 7. Suite envisagée

- Retour visuel du client sur la greffe du cahier (intro, marge, programmes épinglés, piste des événements, pastille du curseur) ; ajustements de timings/seuils si besoin.
- Ajuster la carte 3D selon le retour visuel du client.
- Pages suivantes, une par une : programmes détaillés, résultats complets, bases (page dédiée), événements / galerie, EG Learning, contact / inscription (formulaire à définir), mentions légales.
- Fonctionnalités reportées : formulaire d'inscription, galerie d'événements, graphiques avancés.
- Intégrer les informations manquantes dès réception (équipe, adresse, e-mail, logo SVG, photos).
- Vérifier sur de vrais téléphones (iOS Safari / Android Chrome, encoches, mode paysage) ce que le navigateur headless ne couvre pas, puis importer le dépôt dans Vercel (étapes dans le README).
- Fusionner la PR #1 quand le client valide.

---

## 8. Notes pratiques pour reprendre le travail

- Démarrer : `npm install` puis `npm run dev` (port 3000, `-H 0.0.0.0`) ; l'environnement de travail peut être remis à zéro entre deux sessions (dépendances, serveur, historique git local) : toujours `git fetch origin && git reset -q origin/arena/3004943d-egroupe` avant de committer, jamais de `push --force`.
- Réseau sortant limité à GitHub et npm : pas de polices Google à la volée (d'où `@fontsource-variable`), navigateur de test possible via les paquets npm `puppeteer-core` + `@sparticuz/chromium` (installés hors dépôt, dans `/tmp/browser`, avec la variable `AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x` ; pour simuler un pointeur fin sur bureau : `--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2`, sinon Chromium headless se déclare sans souris et les effets « bureau » sont désactivés) ; les erreurs navigateur remontent aussi dans les logs du serveur de dev lorsque l'aperçu est ouvert.
- ESLint (config Next 16) interdit `setState` directement dans un `useEffect` et les composants définis dans le rendu ; `lucide-react` v1 n'a plus d'icônes de marque.
- Les valeurs de dictionnaire passées aux composants client doivent être sérialisables (les fonctions restent côté serveur).
- `IntersectionObserver` / `useInView` : ne jamais observer un élément masqué par son propre `clip-path` ou une taille nulle (ratio 0 → jamais « visible ») ; observer un conteneur non masqué (`RevealImage`).
- Carte : ne pas rendre les repères enfants du plan 3D (`preserve-3d` est aplati par `opacity`/`overflow`) — ils sont projetés mathématiquement ; `perspective: 200cqw` suppose un conteneur `@container` de même largeur.
