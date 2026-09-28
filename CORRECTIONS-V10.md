# Audit et corrections — Atelier Kadja v10

## Sources contrôlées

- Archive `atelierkadja-main.zip` fournie dans la conversation.
- Dépôt public `mountaga-tall/atelierkadja` et site associé consultés pour vérifier la cohérence générale avec la version publiée.
- Dernières exigences de la conversation : rendu éditorial desktop/mobile, images entièrement cliquables, texte ancré dans le visuel, logo contouré sur mobile, navigation mobile fixe, galeries conservées, carrousels automatiques discrets et aucun rail infini sur l'accueil.

## Bugs corrigés dans l'archive

1. Le chemin `images/NOUVEAUTÉS/newcoll1.mp4` ne correspondait pas au dossier réellement présent. Le dossier est maintenant `images/NOUVEAUTES/` avec `Newcoll1.mp4` et `Newcoll2.mp4`.
2. Le média Anéna référencé comme `IMG_5044.webp` était faux. Le fichier réel `img_5044.jpg.webp` est maintenant utilisé.
3. Les références médias `raw.githubusercontent.com` ont été supprimées lorsqu'un fichier correspondant est présent localement.
4. L'accueil a été sécurisé pour ne plus être transformé en rail horizontal infini.
5. Le header de l'accueil est en surimpression et les blocs éditoriaux occupent l'écran.
6. Toute la zone de chaque visuel éditorial est un lien unique, avec le texte ancré dans ce même lien.
7. Une navigation mobile basse est présente sur les 25 pages.
8. Le bouton Menu mobile donne désormais le focus au vrai champ `[data-site-search-input]`.
9. Les couvertures des cartes avec plusieurs vues tournent automatiquement, s'arrêtent au survol/focus/toucher et respectent `prefers-reduced-motion`.
10. Un clic sur une couverture ouvre la galerie à la vue actuellement visible, plutôt qu'à la première vue systématiquement.
11. Le loader JS est cohérent avec son fallback CSS afin de ne pas conserver inutilement l'écran d'introduction pendant plusieurs secondes.
12. Le logo de header mobile est inversé en blanc afin de rester visible sur fond sombre, tout en conservant une marque noire sur fond clair desktop.
13. Les icônes PWA sont réellement dimensionnées en 192×192 et 512×512.
14. Le service worker est versionné en v9 et le nouveau fichier de marque est inclus dans son app shell.
15. `robots.txt` et `sitemap.xml` utilisent le domaine réel configuré par `CNAME`.
16. Le cache-busting de `script.js` est aligné sur la version v10 dans les 25 pages.
17. L'index de recherche a été corrigé pour refléter notamment le prix de Sawa set et les informations des trois maillots de bain.
18. Le README et le rapport média ont été remis en cohérence avec les médias réellement présents dans l'archive.

## Contrôles exécutés

```text
HTML pages: 25
Broken local HTML links: 0
Missing local media/assets: 0
Remaining raw GitHub media URLs: 0
Mobile nav / cache checks: 0
PWA checks: 0
node --check script.js: OK
```

## Limite de validation visuelle

Une automatisation navigateur locale a été tentée mais l'environnement d'exécution bloque le chargement des pages locales (`ERR_BLOCKED_BY_ADMINISTRATOR`). La validation visuelle pixel par pixel n'est donc pas déclarée comme effectuée. Les corrections ci-dessus reposent sur l'inspection statique des 25 pages, des CSS/JS, des médias présents et du service worker.

## Déploiement

Le ZIP peut être utilisé comme nouvelle base du dépôt GitHub Pages. Une fois publié, effectuer un rechargement forcé/vider le cache PWA si une ancienne version du service worker est déjà installée.


## Correctifs v10 supplémentaires

- Ajout réel de `icons/kadja-mark.png`.
- Normalisation physique du dossier vidéo en `images/NOUVEAUTES/`.
- Renforcement de l’autoplay mobile avec `webkit-playsinline` et nouvelle tentative après `loadeddata`.
- Bump des versions CSS/JS vers v10 pour empêcher le maintien d’anciens fichiers en cache.
- Service worker passé de `atelier-kadja-v9` à `atelier-kadja-v10`.
- Hauteur mobile des univers ajustée pour les appareils à faible hauteur d’écran.
