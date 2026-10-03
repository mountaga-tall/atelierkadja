# ATELIER KADJA — Catalogue éditorial

Version corrigée et auditée du site multi-pages Atelier Kadja, pensée pour un rendu éditorial mode sur ordinateur et mobile.

## Architecture

Le dépôt contient 25 pages HTML, un `styles.css`, un `script.js`, un manifeste PWA et un service worker.

L'accueil utilise une présentation éditoriale plein écran : chaque visuel et son texte vivent dans la même zone cliquable. Les pages de collections conservent leurs galeries, leurs fiches et leurs rails horizontaux lorsqu'ils sont prévus.

### Ordre de navigation principal

- Accueil
- Nouveautés
- Collections
- La Maison
- Sur mesure
- Contact

Les rubriques à venir sont regroupées dans `coming-soon.html` avec leurs ancres.

## Correctifs appliqués

### Accueil desktop / mobile

- Header de l'accueil placé en surimpression des visuels.
- Sections éditoriales en `100svh` pour que la photographie occupe réellement l'écran.
- Toute la zone image + texte est cliquable.
- Texte positionné dans le même conteneur que le média afin de rester ancré au visuel.
- Mobile avec navigation fixe en bas de l'écran.
- Repère/logo graphique en contour sur les visuels mobile.

### Galeries produits

- Les galeries complètes restent stockées dans `data-gallery-src`.
- Une seule image est affichée dans la carte à la fois.
- La couverture passe automatiquement à la vue suivante lorsque plusieurs vues existent.
- Le changement s'arrête au survol, au focus et temporairement après une interaction tactile.
- Un clic sur la couverture ouvre la vraie galerie à la vue actuellement affichée.
- `prefers-reduced-motion` désactive l'automatisme.

### Médias et chemins

- Correction du dossier vidéo des nouveautés : `images/NOUVEAUTES/` (nom ASCII pour éviter les problèmes d'URL, de casse et d'encodage).
- Correction du fichier Anéna : `images/ENSEMBLES/Pantalons/Anena/img_5044.jpg.webp`.
- Suppression des URL `raw.githubusercontent.com` pour les médias qui sont maintenant présents localement dans le dépôt.
- Les fichiers médias réellement présents dans l'archive sont utilisés avec des chemins relatifs au dépôt.

### PWA / cache

- `icons/icon-192.png` est réellement en 192×192.
- `icons/icon-512.png` est réellement en 512×512.
- `icons/kadja-mark.png` sert de marque transparente pour les interfaces où un fond clair/sombre est géré par CSS.
- Cache du service worker versionné en `atelier-kadja-v10`.
- Le service worker ne transforme pas une ressource média absente en `index.html`.

### SEO / publication

- `CNAME` : `atelierkadja.com`.
- `robots.txt` référence `https://atelierkadja.com/sitemap.xml`.
- `sitemap.xml` utilise `https://atelierkadja.com/`.
- Les liens internes restent relatifs et ne dépendent pas du nom du dépôt GitHub.

## Vérification

Le script d'audit contrôle les pages HTML, les liens locaux, les médias locaux et les anciennes URL GitHub :

```bash
python3 scripts/check-site.py
```

État attendu de la version corrigée :

```text
HTML pages: 25
Broken local HTML links: 0
Missing local media/assets: 0
Remaining raw GitHub media URLs: 0
```

Le contrôle JavaScript peut aussi être effectué avec :

```bash
node --check script.js
```

## Déploiement GitHub Pages

Le dépôt peut être publié avec GitHub Pages. Les chemins étant relatifs, le site reste compatible avec un dépôt dont le nom change.

Le domaine personnalisé est déjà indiqué par `CNAME`.

## Médias présents dans cette archive

Les photographies et vidéos référencées par les pages sont incluses dans cette archive corrigée. Les fichiers sont conservés dans leurs dossiers de travail et ne sont pas remplacés par des images inventées.


## Audit complémentaire v10

- `icons/kadja-mark.png` est maintenant réellement présent dans l’archive.
- Les deux vidéos de l’univers utilisent le dossier ASCII `images/NOUVEAUTES/`.
- Les vidéos bénéficient de `muted`, `autoplay`, `playsinline` et `webkit-playsinline`.
- Le JavaScript relance proprement la lecture après chargement du média et lors du retour dans la fenêtre.
- Les écrans mobiles courts ne sont plus forcés à une hauteur minimale de 620 px pour les univers plein écran.
- `hero.mp4` a été contrôlée : elle était en HEVC/H.265 et doit être réencodée en H.264 si elle est réutilisée sur des appareils anciens. La version web actuelle n’en dépend pas, mais le fichier a été réencodé en H.264 pour rester exploitable sur les appareils mobiles qui ne prennent pas en charge HEVC.


## Versions FR / EN

Le site dispose désormais de deux chemins de langue pour chaque page HTML :

- `/fr/index.html`, `/fr/nouveautes.html`, etc. pour la version française.
- `/en/index.html`, `/en/nouveautes.html`, etc. pour la version anglaise.

Une pastille FR/EN est affichée sur l'ensemble du site. Elle conserve la page courante lorsque l'on change de langue. Le contenu historique reste accessible à la racine pour compatibilité avec les anciens liens.

Le sélecteur utilise `localized-loader.js` pour charger la page source et réécrire les liens internes vers la langue active, tandis que `script.js` applique les traductions d'interface.
