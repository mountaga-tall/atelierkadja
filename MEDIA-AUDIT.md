# Audit médias — Atelier Kadja

- Médias locaux présents dans l’archive : **95 fichiers**.
- Les chemins média utilisés par les pages ont été réalignés sur les noms réellement présents.
- Le dossier vidéo des nouveautés est physiquement normalisé en `images/NOUVEAUTES/` pour éviter les problèmes de casse/encodage.
- Les références média `raw.githubusercontent.com` ont été remplacées par des chemins locaux lorsque les fichiers correspondants sont présents dans le dépôt.
- Anéna utilise `images/ENSEMBLES/Pantalons/Anena/img_5044.jpg.webp`.
- Les galeries gardent leurs vues secondaires et le carrousel de couverture automatique est piloté par JavaScript avec pause au survol/focus.

## Vérification

`python3 scripts/check-site.py` doit retourner :

- 25 pages HTML
- 0 lien HTML local cassé
- 0 média local manquant
- 0 URL média raw GitHub restante


## Audit v10

Le contrôle statique de l’archive v10 confirme que les références locales des pages pointent vers des fichiers réellement présents. Le marqueur `icons/kadja-mark.png` manquant dans la version précédente est inclus. Le chemin vidéo des nouveautés est ASCII et les vidéos H.264 des univers restent compatibles avec les navigateurs mobiles modernes.
