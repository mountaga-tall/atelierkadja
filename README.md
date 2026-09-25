# ATELIER KADJA — Catalogue v6

Version refactorisée du catalogue multi-pages Atelier Kadja.

## Ce qui a été corrigé

### Navigation et structure
- `Chemises, Tops & Détails` a été remplacé partout par **`Chemises, Tops & tee-shirt`**.
- Les rubriques **Coming Soon** sont regroupées sur une seule page : `coming-soon.html`.
- Les liens Coming Soon utilisent des ancres (`#chemises`, `#robes-midi`, etc.) au lieu de multiplier les pages.
- `Sur mesure` reste une page disponible et n'est plus présenté comme “Coming Soon”.
- Ajout de la sous-page `robes-longues.html`.
- Les pages catégories (`ensembles.html`, `caftans.html`, `robes.html`, `pantalons.html`, `chemises-tee-shirts-tops.html`) ne recopient plus les fiches produits.

### Produits et galeries
- Les fiches `Adiré`, `Tee-shirts`, `Assiri`, `Anéna`, `Sawa set`, `Lewa`, `Fatila`, `Caftans atypiques`, `Caftans brodés` et `Robes longues` conservent toutes leurs photos dans leur galerie respective.
- Une seule photo de couverture est chargée dans chaque carte produit.
- Les autres vues sont stockées en `data-gallery-src` et chargées uniquement quand la galerie est ouverte.
- Les carrousels automatiques de cartes produits ont été supprimés afin d'éviter les répétitions visuelles et les effets de déplacement inutiles.
- Les doublons de fiches produits entre pages ont été supprimés : chaque fiche produit n'apparaît plus qu'une fois dans une page produit dédiée.

### JavaScript / PWA
- Correction de la détection `prefers-reduced-motion`.
- La lightbox lit désormais les galeries complètes sans afficher plusieurs photos dans la carte.
- Le service worker a été durci : il ne renvoie plus `index.html` en guise de fallback pour une image/vidéo manquante.
- Le cache PWA a été versionné en `atelier-kadja-v6`.
- `manifest.json` ne référence plus le logo JPEG absent ; il utilise les icônes réellement présentes dans `icons/`.

### Vérifications
- **25 pages HTML** sont présentes.
- **0 lien local HTML cassé** détecté.
- Les cartes produits contrôlées ont **1 seule image visible**.
- **0 référence `photo-carousel`** restante dans le JavaScript/CSS final.
- Un script `scripts/check-site.py` permet de refaire l'audit des liens et médias.

## Médias de l'archive

Point important : l'archive fournie ne contient pas les photographies/vidéos du catalogue dans `images/`. Les dossiers sont présents, mais les fichiers médias référencés par le HTML ne sont pas inclus dans le ZIP.

Le rapport complet est dans `MEDIA-AUDIT.md`. Les chemins existants dans le code ont été conservés et contrôlés sans inventer de nouveaux fichiers. Il faudra remettre les médias réels dans `images/` avant publication.

## GitHub / nom du dépôt

L'archive fournie ne contient pas de dossier `.git`, de remote Git ni de nom de dépôt GitHub exploitable. Cette version utilise donc des liens locaux/relatifs et ne dépend pas du nom du dépôt.

Le domaine public n'a pas été inventé : `sitemap.xml` contient le marqueur `SITE_BASE_URL` à remplacer par le vrai domaine avant mise en production. `robots.txt` ne contient pas de fausse URL de sitemap.

## Lancer un contrôle

```bash
python3 scripts/check-site.py
```

Le contrôle signale les médias absents sans considérer leur absence comme un lien HTML cassé. Il peut donc être utilisé dès maintenant, puis relancé après avoir remis les vrais fichiers dans `images/`.

## Publication GitHub Pages

Cette archive est prête à être déposée dans un nouveau dépôt GitHub. Le changement de nom du dépôt n'impose pas de modification des liens internes, puisqu'ils sont relatifs.
