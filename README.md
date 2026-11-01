# ATELIER KADJA — Catalogue éditorial

Site catalogue de la maison de mode ivoirienne Atelier Kadja, publié sur `atelierkadja.com`.

Dernière mise à jour technique : 1er novembre 2026.

## Architecture actuelle

- `index.html` : entrée historique du site.
- `fr/` : catalogue et pages en français.
- `en/` : catalogue et pages en anglais.
- `styles.css` : feuille de styles commune.
- `script.js` : navigation, interactions, recherche, sélecteur de langue et installation PWA.
- `sw.js` : service worker et cache hors connexion.
- `manifest.json`, `fr/manifest.json`, `en/manifest.json` : manifestes PWA.
- `images/` : photographies et vidéos du catalogue.
- `icons/` : identité visuelle et icônes d'application.

Le dépôt contient actuellement 79 fichiers HTML physiques à la racine et dans les dossiers de langue. Les pages de collection, fiches produits et galeries conservent leurs URL dédiées.

## Navigation et langues

La navigation est disponible en français et en anglais. Le script commun normalise les entrées Blazers et les intitulés de la famille Pantalons, y compris sur les anciennes pages dont le menu n'a pas encore été harmonisé dans le HTML.

Les pages anglaises doivent conserver des libellés, placeholders, métadonnées et liens cohérents en anglais. Les pages françaises gardent les noms commerciaux et descriptions d'origine.

## Catalogue et médias

Les chemins de médias sont sensibles à la casse et aux caractères accentués. Ne pas renommer ou convertir un fichier sans mettre à jour toutes ses références. Les photographies produits doivent rester celles fournies par la maison ; ne pas substituer des images génériques aux visuels du catalogue.

Les vidéos d'accueil sont volumineuses. Les requêtes vidéo et les en-têtes HTTP Range restent servies par le réseau afin de préserver le streaming natif. Les images et les pages consultées peuvent être mises en cache pour une consultation hors connexion.

## PWA et cache

Le service worker utilise un nom de cache versionné. Il :
- précharge un noyau de pages et ressources essentielles sans faire échouer toute l'installation si une ressource facultative est indisponible ;
- ignore les paramètres de version pour retrouver les ressources déjà en cache ;
- met les pages HTML à jour depuis le réseau et conserve une copie pour une consultation hors connexion ;
- ne détourne pas les requêtes vidéo ou byte-range ;
- supprime uniquement les anciens caches Atelier Kadja.

Le manifeste principal et les manifestes FR/EN doivent déclarer les dimensions réelles des icônes. `icons/kadja-mark.png` est une source carrée de 512 × 512 pixels.

## SEO et publication

- Domaine personnalisé : `atelierkadja.com` (fichier `CNAME`).
- Robots : `robots.txt`.
- Sitemap XML : `sitemap.xml`, synchronisé sur les pages localisées publiées.
- Les pages doivent conserver des URL canonical et hreflang cohérentes.

## Contrôles

L'audit statique est disponible avec :

```bash
python3 scripts/check-site.py
node --check script.js
```

Valider également les fichiers JSON des manifestes et le XML du sitemap avant publication.

## Déploiement

Le site est publié depuis la branche `main` avec GitHub Pages et le domaine personnalisé. Après une mise à jour du service worker, vérifier le chargement d'une page, l'installation PWA, le menu mobile et la consultation hors connexion après une première visite.
