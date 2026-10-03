(() => {
  'use strict';
  // ---------------------------------------------------------
  // FR / EN language switcher and lightweight static translation
  // ---------------------------------------------------------

  const pathParts = location.pathname.split('/').filter(Boolean);
  const locale = pathParts[0] === 'en' ? 'en' : 'fr';
  const currentFile = (
    pathParts[0] === 'en' || pathParts[0] === 'fr'
      ? pathParts[1]
      : pathParts[pathParts.length - 1]
  ) || 'index.html';

  const localeTranslations = {
    'ATELIER KADJA | Catalogue': 'ATELIER KADJA | Catalog',
    'ATELIER KADJA | Robes longues': 'ATELIER KADJA | Long dresses',
    'Maison de Mode Ivoirienne · Abidjan': 'Ivorian Fashion House · Abidjan',
    'Rechercher sur tout le site': 'Search the entire site',
    'Rechercher sur le site…': 'Search the site…',
    'Accueil': 'Home',
    'Nouveautés': 'New arrivals',
    'Chemises, Tops & tee-shirt': 'Shirts, Tops & T-shirts',
    'Tee-shirts': 'T-shirts',
    'Chemises': 'Shirts',
    'à venir': 'coming soon',
    'Robes volantes': 'Flowing dresses',
    'Robes longues': 'Long dresses',
    'Robes midi': 'Midi dresses',
    'Robes courtes': 'Short dresses',
    'Robes': 'Dresses',
    'Ensembles': 'Sets',
    'Caftans atypiques': 'Distinctive caftans',
    'Caftans brodés': 'Embroidered caftans',
    'Caftans simples': 'Simple caftans',
    'Caftans': 'Caftans',
    'Pantalons': 'Trousers',
    'Maillots de bain': 'Swimwear',
    'Jupes': 'Skirts',
    'Blazers': 'Blazers',
    'Maroquinerie': 'Leather goods',
    'Sacs': 'Bags',
    'Ceintures': 'Belts',
    'Portefeuilles': 'Wallets',
    'Petite maroquinerie': 'Small leather goods',
    'Accessoires': 'Accessories',
    'Combinaisons': 'Jumpsuits',
    'Survêtements': 'Tracksuits',
    'Voir tout le Coming Soon': 'View all Coming Soon',
    'Explorer toutes les familles de collections ↗': 'Explore all collection families ↗',
    'La Maison': 'The House',
    'Sur mesure': 'Made-to-measure',
    'Contact': 'Contact',
    'Commander': 'Order',
    'Commander ↗': 'Order ↗',
    'Découvrir ↗': 'Discover ↗',
    'Découvrir les nouveautés ↗': 'Discover new arrivals ↗',
    'Voir les nouveautés ↗': 'View new arrivals ↗',
    'Le vestiaire Kadja': 'The Kadja wardrobe',
    'Des pièces pensées comme des chapitres.': 'Pieces imagined as chapters.',
    'Collections disponibles': 'Available collections',
    'Explorer les univers': 'Explore the worlds',
    'Tout voir ↗': 'View all ↗',
    'Pièces essentielles': 'Essential pieces',
    'Les prochaines lignes de la maison.': "The house's next lines.",
    'À venir': 'Coming soon',
    'Une création, une histoire, un échange.': 'A creation, a story, an exchange.',
    "L'élégance contemporaine imaginée à Abidjan.": 'Contemporary elegance imagined in Abidjan.',
    'Explorer': 'Explore',
    'Plan du site': 'Site map',
    'Suivre la maison': 'Follow the house',
    'Catalogue digital': 'Digital catalog',
    'Menu': 'Menu',
    'WhatsApp': 'WhatsApp',
    'Maison de Mode Ivoirienne': 'Ivorian Fashion House',
    'Nouveauté': 'New arrival',
    '01 · Nouveauté': '01 · New arrival',
    '04 · La maison': '04 · The House',
    'Des silhouettes conçues comme des pièces fortes': 'Silhouettes designed as statement pieces',
    'Les dernières silhouettes de la maison': "The house's latest silhouettes",
    'Ensembles pantalon + chemise': 'Trouser + shirt sets',
    'Robes volantes et robes longues': 'Flowing and long dresses',
    'Voir les nouveautés': 'View new arrivals',
    'Robe · Silhouettes longues': 'Dresses · Long silhouettes',
    'Robes · Silhouettes longues': 'Dresses · Long silhouettes',
    '7 robes présentées séparément, une photo dédiée par produit.': '7 dresses presented individually, with one dedicated photo per product.',
    'Longue robe volante en mesh imprimée motifs Bogolan rose.': 'Long flowing mesh dress printed with pink Bogolan motifs.',
    'Longue robe droite en mesh imprimée motifs Bogolan rose.': 'Long straight mesh dress printed with pink Bogolan motifs.',
    'Longue robe droite en mesh imprimée motifs Bogolan noir.': 'Long straight mesh dress printed with black Bogolan motifs.',
    'Longue robe volante en mesh imprimée motifs Bogolan marron.': 'Long flowing mesh dress printed with brown Bogolan motifs.',
    'Longue robe droite en mesh imprimée motifs Bogolan marron.': 'Long straight mesh dress printed with brown Bogolan motifs.',
    'Longue robe volante aux manches bouffantes réalisées avec l’imprimé Bogolan marron.': 'Long flowing dress with puff sleeves made from brown Bogolan print.',
    'Longue robe volante en mesh imprimée motifs Bogolan bleu.': 'Long flowing mesh dress printed with blue Bogolan motifs.',
    'Compléments': 'Complements',
    'Tout le Coming Soon': 'All Coming Soon',
    'Voir le Coming Soon ↗': 'View Coming Soon ↗',
    'Explorer ↗': 'Explore ↗',
    'Rechercher': 'Search',
    'Résultats': 'Results',
    'Aucun résultat': 'No results',
    'Fermer le menu': 'Close menu',
    'Ouvrir le menu': 'Open menu',
    'Navigation principale': 'Main navigation',
    'Navigation mobile': 'Mobile navigation',
    'Réseaux sociaux': 'Social media',
    'Contacter Atelier Kadja sur WhatsApp': 'Contact Atelier Kadja on WhatsApp',
    'Voir la fiche': 'View details',
    'Prix': 'Price',
    'Disponibilité': 'Availability',
    'Disponible': 'Available',
    'Sur réservation': 'By reservation',
    // Search and PWA translations
    "Aucun résultat. Essayez un autre terme.": "No results. Try another term.",
    "Voir la page": "View page",
    "Installer l’app Atelier Kadja": "Install the Atelier Kadja app",
    "Accédez au catalogue depuis votre écran d’accueil.": "Access the catalog from your home screen.",
    "Ajoutez Atelier Kadja à votre écran d’accueil depuis le menu du navigateur.": "Add Atelier Kadja to your home screen from your browser menu.",
    "Installer Atelier Kadja": "Install Atelier Kadja",
    // Accessibility and dynamic-message translations
    "Galerie photo": "Photo gallery",
    "Fermer": "Close",
    "Afficher la photo": "View photo",
    "Je souhaite échanger avec la maison au sujet de ma demande.": "I would like to discuss my request with the house.",
    "Rendez-vous · commande · information": "Appointment · order · information",
    "Votre demande": "Your request",
    "Votre demande, directement sur WhatsApp.": "Your request, directly on WhatsApp.",
    "Informations produit": "Product information",
    "Prochaine sélection": "Next selection",
    "à préparer": "to be prepared",
    "en préparation": "in preparation",
    "Le vestiaire robes": "The dress wardrobe",
    "Robe longue 01": "Long dress 01",
    "Robe longue 02": "Long dress 02",
    "Robe longue 03": "Long dress 03",
    "Robe longue 04": "Long dress 04",
    "Robe longue 05": "Long dress 05",
    "Robe longue 06": "Long dress 06",
    "les photos sont regroupées": "the photos are grouped",
    "sur la page dédiée": "on the dedicated page",
    "sans doublon": "without duplication",
    "information non renseignée": "information not provided",
    "informations commerciales non renseignées": "commercial information not provided",
    "4 vues": "4 views",
    "2 vues": "2 views",
    "1 vue": "1 view",
    // Final page-specific translations
    "Ensemble Assiri": "Assiri set",
    "Caftan Typique 01": "Typical Caftan 01",
    "Caftan Typique 02": "Typical Caftan 02",
    "Caftan Typique 03": "Typical Caftan 03",
    "Caftan Typique 04": "Typical Caftan 04",
    "Caftan Brodé 01": "Embroidered Caftan 01",
    "Caftan Brodé 02": "Embroidered Caftan 02",
    "Caftan Brodé 03": "Embroidered Caftan 03",
    "Caftan Brodé 04": "Embroidered Caftan 04",
    "Caftan Brodé 05": "Embroidered Caftan 05",
    "4 vues dans une galerie dédiée · informations commerciales non renseignées.": "4 views in a dedicated gallery · commercial information not provided.",
    "Robe à dos nu · Dempé batik · 2 vues": "Open-back dress · Dempé batik · 2 views",
    "Robe volante en imprimé indigo": "Flowing dress in indigo print",
    "Deux coloris · 25 000 FCFA · chaque coloris garde ses vues dans sa galerie.": "Two colorways · 25,000 FCFA · each colorway keeps its views in its gallery.",
    "Voir les 10 looks ↗": "View the 10 looks ↗",
    "10 looks · pantalon + chemise manches longues.": "10 looks · trousers + long-sleeve shirt.",
    "4 coloris · 100% coton · coupe confortable. Chaque coloris garde ses vues recto/verso dans sa galerie.": "4 colorways · 100% cotton · comfortable fit. Each colorway keeps its front/back views in its gallery.",
    // Additional full-site translations
    "Collections": "Collections",
    "Le pantalon est présenté à travers les ensembles qui l’intègrent, sans recopier les produits sur plusieurs pages.": "Trousers are presented through the sets that include them, without duplicating products across pages.",
    "Une page d’index compacte : chaque ensemble possède sa fiche et sa galerie propres.": "A compact index page: each set has its own dedicated page and gallery.",
    "Sous-collections": "Sub-collections",
    "Une collection dédiée": "A dedicated collection",
    "Chaque sous-collection garde ses photos sur sa propre page pour éviter les répétitions et alléger la navigation.": "Each sub-collection keeps its photos on its own page to avoid repetition and keep navigation light.",
    "Collection": "Collection",
    "4 modèles · prix sur demande.": "4 designs · price on request.",
    "5 modèles · prix sur demande.": "5 designs · price on request.",
    "Voir la collection ↗": "View collection ↗",
    "Rubrique à venir.": "Coming soon.",
    "Voir la liste à venir ↗": "View coming soon ↗",
    "Top 01 · pièce actuellement référencée.": "Top 01 · currently listed piece.",
    "Un point d’entrée unique pour les chemises, tops et tee-shirts. Les produits disponibles gardent leur galerie sur leur page dédiée.": "A single entry point for shirts, tops and T-shirts. Available products keep their galleries on their dedicated pages.",
    "4 coloris · 100% coton · galeries recto/verso.": "4 colorways · 100% cotton · front/back galleries.",
    "Identité & vision": "Identity & vision",
    "Une signature ivoirienne associée à une allure contemporaine.": "An Ivorian signature paired with a contemporary look.",
    "Identité": "Identity",
    "Positionnement :": "Positioning:",
    "Localisation :": "Location:",
    "Abidjan, Côte d'Ivoire": "Abidjan, Côte d’Ivoire",
    "Signature :": "Signature:",
    "Promesse": "Promise",
    "Un vestiaire raffiné": "A refined wardrobe",
    "Des silhouettes où l’identité ivoirienne rencontre une allure moderne, avec une attention particulière portée aux matières, aux coupes et aux détails.": "Silhouettes where Ivorian identity meets a modern look, with special attention to fabrics, cuts and details.",
    "Vision": "Vision",
    "Une mode pensée comme une œuvre.": "Fashion conceived as a work of art.",
    "Pour chaque silhouette, la maison recherche un équilibre entre": "For every silhouette, the house seeks a balance between",
    "identité": "identity",
    "simplicité": "simplicity",
    "présence": "presence",
    "Univers": "World",
    "Les signatures de la maison": "The house signatures",
    "Parlons de votre prochaine silhouette.": "Let’s talk about your next silhouette.",
    "Un échange direct avec Atelier Kadja pour une commande, une question, un rendez-vous ou une création sur mesure.": "A direct conversation with Atelier Kadja for an order, a question, an appointment or a made-to-measure creation.",
    "Atelier Kadja": "Atelier Kadja",
    "Remplissez le formulaire. À l’envoi, WhatsApp s’ouvre avec un message prérempli contenant vos informations et votre demande.": "Fill out the form. When submitted, WhatsApp opens with a pre-filled message containing your information and request.",
    "E-mail": "Email",
    "Adresse": "Address",
    "Formulaire de contact": "Contact form",
    "Décrivez votre demande.": "Tell us about your request.",
    "Nom complet": "Full name",
    "Téléphone": "Phone",
    "Objet": "Subject",
    "Choisir un motif": "Choose a reason",
    "Commande": "Order",
    "Rendez-vous": "Appointment",
    "Projet sur mesure": "Made-to-measure project",
    "Autre demande": "Other request",
    "Votre message": "Your message",
    "Envoyer sur WhatsApp": "Send on WhatsApp",
    "L’envoi prépare automatiquement votre message dans WhatsApp. Aucune donnée n’est stockée sur ce site.": "Sending automatically prepares your message in WhatsApp. No data is stored on this website.",
    "Explorer la maison": "Explore the house",
    "Continuez votre découverte.": "Continue your discovery.",
    "Chaque lien ouvre un univers, une collection ou un service Atelier Kadja.": "Each link opens a world, collection or Atelier Kadja service.",
    "Nous trouver": "Find us",
    "Abidjan · Côte d’Ivoire": "Abidjan · Côte d’Ivoire",
    "Ouvrir dans Maps ↗": "Open in Maps ↗",
    "Créations sur mesure": "Made-to-measure creations",
    "Une création pensée pour vous, directement avec la maison.": "A creation designed for you, directly with the house.",
    "Votre projet": "Your project",
    "Un échange direct avec Atelier Kadja": "A direct conversation with Atelier Kadja",
    "Une demande personnalisée peut être traitée directement via WhatsApp.": "A custom request can be handled directly via WhatsApp.",
    "Motifs de contact : rendez-vous, commande, information ou projet sur mesure.": "Contact reasons: appointment, order, information or made-to-measure project.",
    "WhatsApp officiel": "Official WhatsApp",
    "Parler de mon projet": "Discuss my project",
    "Robes légères": "Light dresses",
    "Chaque modèle garde toutes ses vues dans sa propre fiche.": "Each model keeps all its views on its own page.",
    "Deux coloris · 25 000 FCFA.": "Two colorways · 25,000 FCFA.",
    "Robe à dos nu · Dempé batik · 20 000 FCFA.": "Open-back dress · Dempé batik · 20,000 FCFA.",
    "Marron": "Brown",
    "Rouge Orange": "Red Orange",
    "Bleu": "Blue",
    "Rose": "Pink",
    "Noir": "Black",
    "Blanc": "White",
    "Vert": "Green",
    "Jaune": "Yellow",
    "Rouge": "Red",
    "Bordeaux": "Burgundy",
    "Violet": "Purple",
    "Orange": "Orange",
    "Brique": "Brick",
    "Fuchsia": "Fuchsia",
    "Beige": "Beige",
    "Argenté": "Silver",
    "Monokini en bogolan": "Bogolan monokini",
    "Maillot de bain 1 pièce en imprimé bogolan marron": "One-piece swimsuit in brown Bogolan print",
    "Le bikini noir": "The black bikini",
    "Maillot de bain 2 pièces noir avec détails anneau circulaire argenté": "Black two-piece bikini with silver circular ring detail",
    "Le bikini bogolan": "The Bogolan bikini",
    "Maillot de bain 2 pièces imprimé bogolan marron": "Two-piece bikini in brown Bogolan print",
    "Une sélection dédiée aux maillots de bain Atelier Kadja.": "A dedicated selection of Atelier Kadja swimwear.",
    "Le Top 01 est présenté ici dans sa propre rubrique. Les maillots de bain restent dans leur famille dédiée.": "Top 01 is presented here in its own section. Swimwear remains in its dedicated category.",
    "pièce disponible dans le catalogue": "piece available in the catalog",
    "Un point d’entrée unique": "A single entry point",
    "Ensemble Anéna": "Anéna set",
    "Beige × Bordeaux × Vert · ensemble pantalon × top crop manches courtes · bandes asoké aux poches": "Beige × Burgundy × Green · trouser set × short-sleeve cropped top · Asoké bands on the pockets",
    "Ensemble pantalon × top manches longues": "Trouser set × long-sleeve top",
    "Ensemble pantalon × top crop manches courtes": "Trouser set × short-sleeve cropped top",
    "ensemble pantalon × top manches longues": "trouser set × long-sleeve top",
    "ensemble pantalon × top crop manches courtes": "trouser set × short-sleeve cropped top",
    "bandes asoké aux poches": "Asoké bands on the pockets",
    "Ensemble pantalon × chemise manches longues": "Trouser set × long-sleeve shirt",
    "10 looks · 35 000 FCFA · chaque look conserve toutes ses vues.": "10 looks · 35,000 FCFA · each look keeps all its views.",
    "2 vues dans une seule galerie.": "2 views in one gallery.",
    "4 vues regroupées dans une seule galerie · 40 000 FCFA.": "4 views grouped in one gallery · 40,000 FCFA.",
    "Ensemble 2 pièces pantalon + haut top avec en garniture le pagne koko dunda.": "Two-piece trouser set + top with Koko Dunda fabric trim.",
    "L’ensemble Sawa": "The Sawa set",
    "Galerie Sawa · 4 vues.": "Sawa gallery · 4 views.",
    "2 coloris · 25 000 FCFA · chaque coloris garde ses vues dans sa galerie.": "2 colorways · 25,000 FCFA · each colorway keeps its views in its gallery.",
    "Une seule page pour tout le Coming Soon.": "One page for the entire Coming Soon.",
    "Les ancres permettent d’arriver directement à une rubrique sans multiplier les pages.": "Anchors let visitors jump directly to a section without multiplying pages.",
    "Navigation": "Navigation",
    "Toutes les pages utiles, sans répéter les produits dans plusieurs rubriques.": "All useful pages, without duplicating products across multiple sections.",
    "Rubriques à venir": "Coming soon sections",
    "Toutes les rubriques encore en préparation sont réunies ici. Une seule page remplace les multiples entrées “Coming Soon” du site.": "All sections still in preparation are gathered here. One page replaces the multiple “Coming Soon” entries across the site.",
    "La prochaine sélection de chemises sera publiée dans cette rubrique.": "The next shirt selection will be published in this section.",
    "Une future ligne dédiée à la maroquinerie sera présentée ici.": "A future leather-goods line will be presented here.",
    "Vestiaire": "Wardrobe",
    "Déjà disponible": "Already available",
    "Le service sur mesure possède sa propre page : il ne doit pas être classé comme “Coming Soon”.": "The made-to-measure service has its own page: it should not be classified as “Coming Soon”.",
    "Découvrir le sur mesure ↗": "Discover made-to-measure ↗",
    "Règles estimées": "Estimated period",
    "Fertilité estimée": "Estimated fertility",
    "Ovulation estimée": "Estimated ovulation",
    "Robe Fatila": "Fatila dress",
    "Robe Lewa · Marron": "Lewa dress · Brown",
    "Robe Lewa · Rouge Orange": "Lewa dress · Red Orange",
    "Marron · imprimé indigo · 100% coton & crêpe simple": "Brown · indigo print · 100% cotton & simple crepe",
    "Rouge Orange · imprimé indigo & crêpe simple · 2 vues": "Red Orange · indigo print & simple crepe · 2 views",
    "Robes volantes et robes longues disponibles. Les robes midi et courtes sont regroupées dans le Coming Soon.": "Flowing and long dresses are available. Midi and short dresses are grouped in Coming Soon.",
    "Lewa et Fatila · fiches dédiées et galeries complètes.": "Lewa and Fatila · dedicated pages and complete galleries.",
    "8 pièces issues de la galerie Robes longues.": "8 pieces from the Long dresses gallery.",
    "Découvrir l'univers Atelier Kadja, le service sur mesure ou demander une information.": "Discover the Atelier Kadja world, the made-to-measure service or request information.",
    "Une maison de mode ivoirienne qui compose des silhouettes contemporaines, entre matières, coupes, imprimés et présence.": "An Ivorian fashion house creating contemporary silhouettes through fabrics, cuts, prints and presence.",
    "Chemises, robes midi et courtes, caftans simples, maroquinerie, accessoires et autres pièces en préparation.": "Shirts, midi and short dresses, simple caftans, leather goods, accessories and other pieces in preparation.",
    "3 photos": "3 photos",
    "2 photos": "2 photos",
    "1 photo": "1 photo",
    "vue(s)": "view(s)",
    "Prix sur demande": "Price on request",
    "Sur demande": "On request",
    'Adiré Atelier Kadja : 10 looks, 35 000 FCFA, avec toutes les vues regroupées par look.': 'Adiré Atelier Kadja: 10 looks, 35,000 FCFA, with all views grouped by look.',
    'Ensemble Anéna Atelier Kadja : pantalon et top crop manches courtes, 35 000 FCFA.': 'Anéna set Atelier Kadja: trousers and short-sleeve cropped top, 35,000 FCFA.',
    'Caftans atypiques Atelier Kadja : 4 modèles, prix sur demande, galeries dédiées.': 'Distinctive caftans Atelier Kadja: 4 designs, price on request, dedicated galleries.',
    'Caftans brodés Atelier Kadja : 5 modèles, prix sur demande, galeries dédiées.': 'Embroidered caftans Atelier Kadja: 5 designs, price on request, dedicated galleries.',
    'Caftans Atelier Kadja : atypiques, brodés et prochainement simples.': 'Atelier Kadja caftans: distinctive, embroidered, and simple styles coming soon.',
    'Chemises, Tops & tee-shirt — index des pièces essentielles Atelier Kadja.': 'Shirts, Tops & T-shirts — index of essential Atelier Kadja pieces.',
    'Toutes les rubriques Atelier Kadja encore en préparation, regroupées sur une seule page.': 'All Atelier Kadja sections still in preparation, gathered on one page.',
    'Coordonnées officielles et contact de la Maison de Mode Ivoirienne ATELIER KADJA.': 'Official contact details for Ivorian Fashion House ATELIER KADJA.',
    'Ensembles Atelier Kadja : Adiré, Assiri, Anéna et Sawa set, avec fiches et galeries dédiées.': 'Atelier Kadja sets: Adiré, Assiri, Anéna and Sawa set, with dedicated pages and galleries.',
    'Robe Fatila Atelier Kadja : dos nu, Dempé batik, 20 000 FCFA.': 'Fatila Atelier Kadja dress: open back, Dempé batik, 20,000 FCFA.',
    'Catalogue digital Atelier Kadja — Maison de Mode Ivoirienne à Abidjan.': 'Atelier Kadja digital catalog — Ivorian Fashion House in Abidjan.',
    'Identité, vision et univers de la Maison de Mode Ivoirienne ATELIER KADJA.': 'Identity, vision and world of Ivorian Fashion House ATELIER KADJA.',
    'Robes Lewa Atelier Kadja : deux coloris, 25 000 FCFA, galeries dédiées.': 'Lewa Atelier Kadja dresses: two colorways, 25,000 FCFA, dedicated galleries.',
    'Nouveautés Atelier Kadja — Adiré, 10 looks et galeries dédiées.': 'Atelier Kadja new arrivals — Adiré, 10 looks and dedicated galleries.',
    'Pantalons Atelier Kadja : accès aux ensembles et à leurs galeries dédiées.': 'Atelier Kadja trousers: access to sets and their dedicated galleries.',
    'Robes longues Atelier Kadja : 7 robes avec noms, prix et visuels dédiés.': 'Atelier Kadja long dresses: 7 dresses with names, prices and dedicated visuals.',
    'Robes Atelier Kadja : robes volantes et robes longues disponibles, midi et courtes à venir.': 'Atelier Kadja dresses: flowing and long dresses available, midi and short styles coming soon.',
    'Sawa set Atelier Kadja : galerie dédiée avec 4 vues, 40 000 FCFA.': 'Sawa set Atelier Kadja: dedicated gallery with 4 views, 40,000 FCFA.',
    'Service sur mesure ATELIER KADJA — rendez-vous, commande et projets personnalisés via WhatsApp.': 'ATELIER KADJA made-to-measure service — appointments, orders and bespoke projects via WhatsApp.',
    'Tee-shirts Atelier Kadja : 4 coloris en 100% coton, avec galerie dédiée par coloris.': 'Atelier Kadja T-shirts: 4 colors in 100% cotton, with a dedicated gallery for each color.',
    'Top et pièces essentielles ATELIER KADJA.': 'Tops and essential pieces ATELIER KADJA.',
    'Sur iPhone/iPad : touchez <strong>Partager</strong> <strong>▢↑</strong>, puis <strong>Ajouter à l’écran d’accueil</strong>.': 'On iPhone/iPad: tap <strong>Share</strong> <strong>▢↑</strong>, then <strong>Add to Home Screen</strong>.',
    'Ouvrez le menu ⋮ du navigateur, puis choisissez « Ajouter à l’écran d’accueil » ou « Installer l’application ».': 'Open the browser menu ⋮, then choose “Add to Home Screen” or “Install app”.'

  };

  const localeSwitch = () => {
    const next = locale === 'en' ? 'fr' : 'en';
    const file = currentFile || 'index.html';
    return '/' + next + '/' + (file === 'index.html' ? 'index.html' : file);
  };

  const translateString = value => {
    if (!value || locale !== 'en') return value;

    let result = value;
    result = result.replace(/(\d+)\s+modèles/g, '$1 designs');
    result = result.replace(/(\d+)\s+coloris/g, '$1 colorways');
    result = result.replace(/(\d+)\s+vues?/g, '$1 views');
    result = result.replace(/(\d+)\s+vue\(s\)/g, '$1 view(s)');
    result = result.replace(/(\d+)\s+pièces/g, '$1 pieces');

    Object.keys(localeTranslations)
      .sort((a, b) => b.length - a.length)
      .forEach(key => {
        const lowerInitial = key
          ? key.charAt(0).toLowerCase() + key.slice(1)
          : key;

        result = result.split(key).join(localeTranslations[key]);

        if (lowerInitial !== key) {
          result = result.split(lowerInitial).join(
            localeTranslations[key].charAt(0).toLowerCase() +
            localeTranslations[key].slice(1)
          );
        }
      });

    return result;
  };


  const translatePage = () => {
    if (locale !== 'en') return;
    document.title = translateString(document.title);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(textNode => {
      const value = textNode.nodeValue || '';
      const translated = translateString(value);
      if (translated !== value) textNode.nodeValue = translated;
    });

    document.querySelectorAll('[placeholder],[aria-label],[title],img[alt],meta[name="description"],meta[property="og:title"],meta[property="og:description"]').forEach(el => {
      ['placeholder','aria-label','title','alt','content'].forEach(attr => {
        if (el.hasAttribute(attr)) el.setAttribute(attr, translateString(el.getAttribute(attr)));
      });
    });

    document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const marker = href.indexOf('?text=');
      if (marker === -1) return;
      const base = href.slice(0, marker);
      const query = href.slice(marker + 6);
      try {
        const translatedMessage = translateString(decodeURIComponent(query));
        link.setAttribute('href', base + '?text=' + encodeURIComponent(translatedMessage));
      } catch (_) {}
    });

    document.documentElement.lang = 'en';
  };

  const addLocaleSwitcher = () => {
    if (document.querySelector('[data-locale-switcher]')) return;

    const link = document.createElement('a');
    link.href = localeSwitch();
    link.setAttribute('data-locale-switcher', '');
    link.setAttribute('aria-label', locale === 'en' ? 'Switch to French' : 'Switch to English');
    link.title = locale === 'en' ? 'Switch to French' : 'Passer en anglais';
    link.innerHTML = '<span class="locale-option ' + (locale === 'fr' ? 'is-active' : '') + '">FR</span><span class="locale-divider">/</span><span class="locale-option ' + (locale === 'en' ? 'is-active' : '') + '">EN</span>';
    link.style.cssText = 'position:fixed;top:96px;right:18px;z-index:9998;display:flex;align-items:center;gap:3px;padding:4px 6px;border:1px solid rgba(17,17,17,.14);border-radius:999px;background:rgba(255,255,255,.9);box-shadow:0 10px 26px rgba(17,17,17,.1);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);font:600 10px/1 system-ui,sans-serif;letter-spacing:.08em;color:#111;text-decoration:none';
    link.querySelectorAll('.locale-option').forEach(option => {
      option.style.cssText = 'padding:6px 7px;border-radius:999px;color:#5c5750;transition:.2s ease';
      if (option.classList.contains('is-active')) {
        option.style.background = '#111';
        option.style.color = '#fff';
      }
    });
    const divider = link.querySelector('.locale-divider');
    divider.style.cssText = 'color:#9a948a';
    document.body.appendChild(link);
  };

  document.documentElement.lang = locale;
  addLocaleSwitcher();

  if (locale === 'en') {
    translatePage();
    const translationObserver = new MutationObserver(() => translatePage());
    translationObserver.observe(document.body, { subtree: true, childList: true });
    window.addEventListener('beforeunload', () => translationObserver.disconnect(), { once: true });
  }


  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const siteLoader = $('[data-site-loader]');
  if (siteLoader) {
    window.setTimeout(() => {
      siteLoader.classList.add('is-done');
      siteLoader.setAttribute('aria-hidden', 'true');
    }, 1100);
  }

  // ---------------------------------------------------------
  // Graceful asset fallback
  // ---------------------------------------------------------

  $$('img').forEach(img => {
    img.addEventListener('error', () => {
      const parent = img.closest(
        '.product-media, .product-views, .subcategory-media, .mosaic-card, .editorial-media, .editorial-quick-card, .hero-media'
      );

      if (parent) parent.classList.add('media-broken');
      if (img.closest('.brand-mark')) {
        img.closest('.brand-mark').classList.add('asset-missing');
      }
    }, { once: true });
  });

  $$('video').forEach(video => {
    video.addEventListener('error', () => {
      video.parentElement?.classList.add('media-broken-video');
    }, { once: true });
  });

  $$('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const header = $('[data-header]');
  const progress = $('.site-progress span');
  const cursorGlow = $('.cursor-glow');

  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0
      ? Math.min(1, Math.max(0, window.scrollY / scrollable))
      : 0;

    if (progress) {
      progress.style.width = `${ratio * 100}%`;
    }

    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  // ---------------------------------------------------------
  // Mobile navigation
  // ---------------------------------------------------------

  const navToggle = $('.nav-toggle');
  const siteMenu = $('#site-menu');
  const mobileMenuTrigger = $('.mobile-menu-trigger');

  const openMobileMenu = () => {
    if (!navToggle || !siteMenu) return;

    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fermer le menu');
    siteMenu.classList.add('is-open');
    document.body.classList.add('menu-open');
  };

  const closeMobileMenu = () => {
    if (!navToggle || !siteMenu) return;

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    siteMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (navToggle && siteMenu) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      if (open) closeMobileMenu();
      else openMobileMenu();
    });

    $$('a', siteMenu).forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  mobileMenuTrigger?.addEventListener('click', () => {
    if (!siteMenu || !navToggle) return;

    const open = navToggle.getAttribute('aria-expanded') === 'true';
    if (open) closeMobileMenu();
    else openMobileMenu();

    if (!open) {
      window.setTimeout(() => {
        document.querySelector('[data-site-search-input]')?.focus?.();
      }, 80);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Active main navigation based on current file.
  const current = location.pathname.split('/').pop() || 'index.html';

  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:')
    ) {
      return;
    }

    const target = href.split('/').pop();
    if (target === current) {
      link.classList.add('is-active');
    }
  });

  // ---------------------------------------------------------
  // Autoplay videos — mobile/desktop
  // ---------------------------------------------------------

  const autoplayVideos = $$('video[data-autoplay]');

  const playVideo = video => {
    if (!video || document.hidden) return;

    // Keep autoplay eligible on mobile browsers (especially Android/iOS).
    // Only initialize muted state when autoplay has not been initialized yet,
    // so a deliberate user unmute is not silently undone later.
    if (video.dataset.autoplayReady !== 'true') {
      video.muted = true;
      video.defaultMuted = true;
      video.dataset.autoplayReady = 'true';
    }

    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');

    const attempt = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {
          // Browser autoplay policies can reject play() without a media error.
        });
      }
    };

    if (video.readyState < 2) {
      video.addEventListener('loadeddata', attempt, { once: true });
      if (!video.dataset.loadRequested) {
        video.dataset.loadRequested = 'true';
        try {
          video.load();
        } catch (_) {}
      }
    } else {
      attempt();
    }
  };

  autoplayVideos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');

    const isEditorial = !!video.closest('.editorial-slide');
    const isQuickCard = !!video.closest('.editorial-quick-card');
    const isUniverse = !!video.closest('.mosaic-card-video');

    if (isEditorial) {
      video.preload = 'auto';
    } else if (isQuickCard || isUniverse) {
      video.preload = 'metadata';
    }

    // Keep the first visual available while the MP4 is loading.
    if (!video.getAttribute('poster')) {
      video.setAttribute('poster', 'images/CHEMISES, TEE-SHIRTS & TOPS/herot1.webp');
    }

    const mediaBox = video.closest(
      '.editorial-media, .editorial-quick-card, .hero-media, .mosaic-card-video'
    );

    const markPlaying = () => {
      mediaBox?.classList.add('video-is-playing');
    };

    const markStopped = () => {
      mediaBox?.classList.remove('video-is-playing');
    };

    const retry = () => playVideo(video);

    video.addEventListener('playing', markPlaying, { passive: true });
    video.addEventListener('pause', markStopped, { passive: true });
    video.addEventListener('loadedmetadata', retry, { once: true });
    video.addEventListener('canplay', retry, { passive: true });
    video.addEventListener('error', () => {
      mediaBox?.classList.add('media-broken-video');
    }, { once: true });

    playVideo(video);

    if ((isQuickCard || isUniverse) && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            playVideo(video);
          } else {
            video.pause();
          }
        });
      }, {
        rootMargin: '180px 0px',
        threshold: 0.01
      });

      observer.observe(video);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      autoplayVideos.forEach(playVideo);
    }
  });

  // ---------------------------------------------------------
  // Hero video controls preserved for pages that use them
  // ---------------------------------------------------------

  const heroVideo = $('.hero-video');

  if (heroVideo) {
    const heroMedia = heroVideo.closest('.hero-media');
    const controls = heroMedia?.querySelector('.video-controls');

    if (controls) {
      const playBtn = controls.querySelector('[data-video-play]');
      const muteBtn = controls.querySelector('[data-video-mute]');

      const refresh = () => {
        if (playBtn) {
          playBtn.textContent = heroVideo.paused ? '▶' : 'Ⅱ';
          playBtn.setAttribute(
            'aria-label',
            heroVideo.paused
              ? 'Lire la vidéo'
              : 'Mettre la vidéo en pause'
          );
        }

        if (muteBtn) {
          muteBtn.textContent = heroVideo.muted ? '🔇' : '🔊';
          muteBtn.setAttribute(
            'aria-label',
            heroVideo.muted
              ? 'Activer le son'
              : 'Couper le son'
          );
        }
      };

      playBtn?.addEventListener('click', event => {
        event.preventDefault();

        if (heroVideo.paused) {
          playVideo(heroVideo);
        } else {
          heroVideo.pause();
        }
      });

      muteBtn?.addEventListener('click', event => {
        event.preventDefault();

        heroVideo.muted = !heroVideo.muted;

        if (!heroVideo.muted) {
          heroVideo.volume = 1;
        }

        refresh();
      });

      heroVideo.addEventListener('play', refresh, { passive: true });
      heroVideo.addEventListener('pause', refresh, { passive: true });
      heroVideo.addEventListener('volumechange', refresh, { passive: true });

      refresh();
    }
  }

  // ---------------------------------------------------------
  // Editorial home
  // ---------------------------------------------------------

  const editorialSlides = $$('.editorial-slide');
  const editorialLinks = $$('.editorial-index a');

  if (editorialSlides.length && editorialLinks.length && 'IntersectionObserver' in window) {
    const editorialObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        editorialLinks.forEach(link => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    }, {
      threshold: 0.55
    });

    editorialSlides.forEach(slide => editorialObserver.observe(slide));
  }

  // ---------------------------------------------------------
  // Reveal on scroll
  // ---------------------------------------------------------

  const revealItems = $$(`
    .editorial-intro,
    .editorial-collections,
    .editorial-coming,
    .editorial-house,
    .editorial-quick-card,
    .section,
    .page-hero,
    .product-card,
    .subcategory-card,
    .info-card,
    .contact-card,
    .explore-panel
  `.replace(/\n\s+/g, ' ').trim());

  revealItems.forEach((el, i) => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = `${Math.min((i % 6) * 40, 220)}ms`;
    }
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: .08,
      rootMargin: '0px 0px -40px 0px'
    });

    $$('[data-reveal]').forEach(el => io.observe(el));
  } else {
    $$('[data-reveal]').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  // ---------------------------------------------------------
  // Premium card tilt — mouse only
  // ---------------------------------------------------------

  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (finePointer && !reduceMotion) {
    $$('.wow-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width;
        const y = (event.clientY - r.top) / r.height;
        const rx = (0.5 - y) * 3.8;
        const ry = (x - 0.5) * 4.8;

        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---------------------------------------------------------
  // Magnetic CTAs
  // ---------------------------------------------------------

  if (finePointer && !reduceMotion) {
    $$('.btn, .nav-order, .whatsapp-float').forEach(el => {
      el.addEventListener('pointermove', event => {
        const r = el.getBoundingClientRect();
        const dx = (event.clientX - (r.left + r.width / 2)) * .08;
        const dy = (event.clientY - (r.top + r.height / 2)) * .08;

        el.style.transform =
          `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ---------------------------------------------------------
  // Cursor glow
  // ---------------------------------------------------------

  if (cursorGlow && finePointer && !reduceMotion) {
    let raf = null;
    let x = 0;
    let y = 0;

    const paint = () => {
      cursorGlow.style.left = `${x}px`;
      cursorGlow.style.top = `${y}px`;
      raf = null;
    };

    window.addEventListener('pointermove', event => {
      x = event.clientX;
      y = event.clientY;
      cursorGlow.style.opacity = '1';

      if (!raf) {
        raf = requestAnimationFrame(paint);
      }
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // ---------------------------------------------------------
  // WhatsApp contact form
  // ---------------------------------------------------------

  const form = $('#contact-form');

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const subject = String(data.get('subject') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !phone || !subject || !message) {
        form.classList.remove('form-shake');
        void form.offsetWidth;
        form.classList.add('form-shake');
        return;
      }

      const text = locale === 'en'
        ? [
            'Hello Atelier Kadja,',
            '',
            'Name: ' + name,
            'Phone: ' + phone,
            'Subject: ' + subject,
            '',
            'Message:',
            message,
            '',
            'I would like to discuss my request with the house.'
          ].join('\\n')
        : [
            'Bonjour Atelier Kadja,',
            '',
            'Nom : ' + name,
            'Téléphone : ' + phone,
            'Objet : ' + subject,
            '',
            'Message :',
            message,
            '',
            'Je souhaite échanger avec la maison au sujet de ma demande.'
          ].join('\\n');

      const url =
        `https://wa.me/2250759013832?text=${encodeURIComponent(text)}`;

      window.open(url, '_blank', 'noopener');
    });
  }

  // ---------------------------------------------------------
  // Product galleries / lightbox
  // ---------------------------------------------------------

  let lightbox = null;
  let lightboxItems = [];
  let lightboxIndex = 0;

  const createLightbox = () => {
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.className = 'kadja-lightbox';
    lightbox.hidden = true;

    lightbox.innerHTML = `
      <div class="lightbox-backdrop" data-lightbox-close></div>

      <div
        class="lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="${locale === 'en' ? 'Photo gallery' : 'Galerie photo'}">

        <button
          type="button"
          class="lightbox-close"
          data-lightbox-close
          aria-label="${locale === 'en' ? 'Close' : 'Fermer'}">
          ×
        </button>

        <button
          type="button"
          class="lightbox-prev"
          data-lightbox-prev
          aria-label="${locale === 'en' ? 'Previous photo' : 'Photo précédente'}">
          ‹
        </button>

        <figure class="lightbox-figure">
          <img data-lightbox-image alt="">
          <figcaption data-lightbox-caption></figcaption>
        </figure>

        <button
          type="button"
          class="lightbox-next"
          data-lightbox-next
          aria-label="${locale === 'en' ? 'Next photo' : 'Photo suivante'}">
          ›
        </button>

        <div
          class="lightbox-thumbs"
          data-lightbox-thumbs></div>
      </div>
    `;

    document.body.appendChild(lightbox);

    lightbox
      .querySelectorAll('[data-lightbox-close]')
      .forEach(btn => btn.addEventListener('click', closeLightbox));

    lightbox
      .querySelector('[data-lightbox-prev]')
      ?.addEventListener('click', () => moveLightbox(-1));

    lightbox
      .querySelector('[data-lightbox-next]')
      ?.addEventListener('click', () => moveLightbox(1));

    document.addEventListener('keydown', event => {
      if (!lightbox || lightbox.hidden) return;

      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        moveLightbox(-1);
      }

      if (event.key === 'ArrowRight') {
        moveLightbox(1);
      }
    });

    return lightbox;
  };

  const toGalleryItem = item => {
    if (typeof item === 'string') {
      return { src: item, alt: '' };
    }

    if (item instanceof HTMLImageElement) {
      return {
        src: item.dataset.gallerySrc || item.currentSrc || item.src,
        alt: item.alt || ''
      };
    }

    return item || { src: '', alt: '' };
  };

  const galleryItemsFor = card => {
    if (!card) return [];

    const items = [];

    card
      .querySelectorAll('.product-gallery-data [data-gallery-src]')
      .forEach(img => {
        const item = toGalleryItem(img);

        if (
          item.src &&
          !items.some(existing => existing.src === item.src)
        ) {
          items.push(item);
        }
      });

    if (!items.length) {
      card
        .querySelectorAll(
          '.product-views > img, .product-media > img, .subcategory-media > img, .mosaic-card > img'
        )
        .forEach(img => {
          const item = toGalleryItem(img);

          if (
            item.src &&
            !items.some(existing => existing.src === item.src)
          ) {
            items.push(item);
          }
        });
    }

    return items;
  };

  const renderLightbox = () => {
    if (!lightbox || !lightboxItems.length) return;

    const item = lightboxItems[lightboxIndex];
    const img = lightbox.querySelector('[data-lightbox-image]');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    const thumbs = lightbox.querySelector('[data-lightbox-thumbs]');

    img.src = item.src;
    img.alt = item.alt || `Photo ${lightboxIndex + 1}`;
    caption.textContent = item.alt || '';

    thumbs.replaceChildren(
      ...lightboxItems.map((it, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className =
          `lightbox-thumb${i === lightboxIndex ? ' is-active' : ''}`;
        button.setAttribute(
          'aria-label',
          locale === 'en' ? `View photo ${i + 1}` : `Afficher la photo ${i + 1}`
        );

        const thumb = document.createElement('img');
        thumb.src = it.src;
        thumb.alt = '';

        button.appendChild(thumb);

        button.addEventListener('click', () => {
          lightboxIndex = i;
          renderLightbox();
        });

        return button;
      })
    );
  };

  const openLightbox = (images, index = 0) => {
    createLightbox();

    lightboxItems = images
      .map(toGalleryItem)
      .filter(item => item.src);

    if (!lightboxItems.length) return;

    lightboxIndex = Math.max(
      0,
      Math.min(index, lightboxItems.length - 1)
    );

    renderLightbox();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
  };

  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
  };

  const moveLightbox = direction => {
    if (!lightboxItems.length) return;

    lightboxIndex =
      (lightboxIndex + direction + lightboxItems.length) %
      lightboxItems.length;

    renderLightbox();
  };

  $$('[data-gallery-card]').forEach(card => {
    const cover = card.querySelector(
      '.product-views > img, .product-media > img, .subcategory-media > img'
    );

    const trigger = card.querySelector('[data-gallery-trigger]');

    const open = event => {
      event?.preventDefault?.();

      const items = galleryItemsFor(card);
      const currentIndex = Number(card.dataset.galleryIndex || 0);
      openLightbox(items, Number.isFinite(currentIndex) ? currentIndex : 0);
    };

    cover?.addEventListener('click', open);

    cover?.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        open(event);
      }
    });

    trigger?.addEventListener('click', open);

    if (cover) {
      cover.style.cursor = 'zoom-in';
    }
  });

  $$('.mosaic-card img, .subcategory-media img, .product-media img')
    .forEach(img => {
      if (img.closest('[data-gallery-card]')) return;

      img.style.cursor = 'zoom-in';

      img.addEventListener('click', event => {
        event.preventDefault();
        openLightbox([img], 0);
      });
    });

  // ---------------------------------------------------------
  // Product cover carousels
  // Gallery data stays hidden until the lightbox opens, while the
  // visible cover gently rotates through the same gallery. Pauses on
  // hover/focus/touch and is disabled for reduced-motion users.
  // ---------------------------------------------------------

  if (!reduceMotion) {
    $$('[data-gallery-card]').forEach(card => {
      const cover = card.querySelector('.product-views > img');
      const gallery = galleryItemsFor(card);

      if (!cover || gallery.length < 2) return;

      let index = gallery.findIndex(item => item.src === cover.currentSrc || item.src === cover.src);
      if (index < 0) index = 0;

      let timer = null;
      let paused = false;
      let touchPauseTimer = null;
      card.dataset.galleryIndex = String(index);

      const preload = src => {
        if (!src) return;
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      };

      const show = nextIndex => {
        index = (nextIndex + gallery.length) % gallery.length;
        card.dataset.galleryIndex = String(index);
        const item = gallery[index];
        if (!item?.src || item.src === cover.src) return;

        preload(gallery[(index + 1) % gallery.length]?.src);
        cover.classList.add('is-carousel-changing');

        window.setTimeout(() => {
          cover.src = item.src;
          if (item.alt) cover.alt = item.alt;
          cover.classList.remove('is-carousel-changing');
        }, 120);
      };

      const stop = () => {
        paused = true;
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      };

      const start = () => {
        if (paused || timer) return;
        timer = window.setInterval(() => {
          if (!document.hidden && !paused) show(index + 1);
        }, 4200);
      };

      const pauseTouch = () => {
        stop();
        if (touchPauseTimer) window.clearTimeout(touchPauseTimer);
        touchPauseTimer = window.setTimeout(() => {
          paused = false;
          start();
        }, 1400);
      };

      card.addEventListener('mouseenter', stop, { passive: true });
      card.addEventListener('mouseleave', () => {
        paused = false;
        start();
      }, { passive: true });
      card.addEventListener('focusin', stop, { passive: true });
      card.addEventListener('focusout', event => {
        if (!card.contains(event.relatedTarget)) {
          paused = false;
          start();
        }
      }, { passive: true });
      cover.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch') pauseTouch();
      }, { passive: true });

      preload(gallery[(index + 1) % gallery.length]?.src);
      start();
    });
  }

  // ---------------------------------------------------------
  // Seamless infinite rails
  // IMPORTANT: .mosaic is no longer used by the index page.
  // Collection pages can keep using .mosaic / .subcategory-grid.
  // ---------------------------------------------------------

  const initInfiniteRail = (rail) => {
    if (!rail || rail.dataset.infiniteReady === 'true') return;

    const originals = [...rail.children];

    if (originals.length < 2) return;

    rail.dataset.infiniteReady = 'true';
    rail.classList.add('infinite-rail');

    const shell = document.createElement('div');
    shell.className = 'infinite-shell simple-rail-shell';

    rail.parentNode.insertBefore(shell, rail);
    shell.appendChild(rail);

    const markClone = clone => {
      clone.dataset.railClone = 'true';

      clone
        .querySelectorAll(
          'a,button,input,select,textarea,[tabindex]'
        )
        .forEach(el => {
          el.tabIndex = -1;
        });

      return clone;
    };

    originals
      .map(card => markClone(card.cloneNode(true)))
      .reverse()
      .forEach(clone => {
        rail.insertBefore(clone, rail.firstChild);
      });

    originals
      .map(card => markClone(card.cloneNode(true)))
      .forEach(clone => {
        rail.appendChild(clone);
      });

    let setWidth = 0;
    let paused = false;
    let interacting = false;
    let raf = null;
    let last = performance.now();

    const isSmall = window.matchMedia('(max-width:640px)').matches;
    const speed = isSmall ? 36 : 30;

    const measure = () => {
      const firstOriginal = rail.children[originals.length];
      const firstAfter = rail.children[originals.length * 2];

      if (!firstOriginal || !firstAfter) return;

      setWidth = Math.max(
        1,
        firstAfter.offsetLeft - firstOriginal.offsetLeft
      );

      rail.scrollLeft = setWidth;
    };

    const normalize = () => {
      if (!setWidth) return;

      const lower = setWidth * 0.35;
      const upper = setWidth * 1.65;

      if (rail.scrollLeft < lower) {
        rail.scrollLeft += setWidth;
      } else if (rail.scrollLeft > upper) {
        rail.scrollLeft -= setWidth;
      }
    };

    const loop = now => {
      const dt = Math.min(48, now - last);
      last = now;

      if (
        !paused &&
        !interacting &&
        !document.hidden &&
        setWidth > 0
      ) {
        rail.scrollLeft += speed * dt / 1000;
        normalize();
      }

      raf = requestAnimationFrame(loop);
    };

    const setPaused = value => {
      paused = value;
      shell.classList.toggle('is-paused', value);
    };

    shell.addEventListener('mouseenter', () => setPaused(true));
    shell.addEventListener('mouseleave', () => setPaused(false));

    shell.addEventListener('focusin', () => setPaused(true));

    shell.addEventListener('focusout', event => {
      if (!shell.contains(event.relatedTarget)) {
        setPaused(false);
      }
    });

    rail.addEventListener('scroll', normalize, { passive: true });

    rail.addEventListener('pointerdown', () => {
      interacting = true;
      setPaused(true);
    }, { passive: true });

    rail.addEventListener('pointerup', () => {
      interacting = false;
      setPaused(false);
      normalize();
    }, { passive: true });

    rail.addEventListener('pointercancel', () => {
      interacting = false;
      setPaused(false);
      normalize();
    }, { passive: true });

    rail.addEventListener('touchstart', () => {
      interacting = true;
      setPaused(true);
    }, { passive: true });

    rail.addEventListener('touchend', () => {
      interacting = false;
      setPaused(false);
      normalize();
    }, { passive: true });

    const onResize = () => measure();

    window.addEventListener('resize', onResize, { passive: true });

    measure();
    raf = requestAnimationFrame(loop);

    window.addEventListener('beforeunload', () => {
      window.removeEventListener('resize', onResize);

      if (raf) {
        cancelAnimationFrame(raf);
      }
    }, { once: true });
  };

  // Keep rails on category pages, not on the new editorial index.
  $$('.subcategory-grid, body:not([data-page="index"]) .mosaic')
    .forEach(rail => initInfiniteRail(rail));

  // ---------------------------------------------------------
  // Global search index
  // ---------------------------------------------------------

  const SEARCH_INDEX = [{"title":"Adiré","url":"adire.html","description":"Adiré Atelier Kadja : 10 looks, 35 000 FCFA, avec toutes les vues regroupées par look.","text":"Nouveautés · Adiré Adiré 10 looks · 20 photos · ensembles pantalon + chemise manches longues en adiré coton. 3 photos Adiré 01 Rouge Noir Beige · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA 3 photos ↗ Commander ↗ 3 photos Adiré 02 Bleu Noir Rose · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA 3 photos ↗ Commander ↗ 3 photos Adiré 03 Brique Noir Vert · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA 3 photos ↗ Commander ↗ 2 photos Adiré 04 Fuchsia Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 2 photos Adiré 05 Rouge Noir Orange · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 2 photos Adiré 06 Vert Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 2 photos Adiré 07 Jaune Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 1 photo Adiré 08 Bordeaux Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA 1 photo ↗ Commander ↗ 1 photo Adiré 09 Violet Noir Bleu · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA 1 photo ↗ Commander ↗ 1 photo Adiré 10 Marron Noir Orange · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA 1 photo ↗ Commander ↗"},{"title":"Anéna","url":"anena.html","description":"Ensemble Anéna Atelier Kadja : pantalon et top crop manches courtes, 35 000 FCFA.","text":"Ensembles · Anéna Anéna Ensemble pantalon × top crop manches courtes · bandes asoké aux poches · 35 000 FCFA. 1 photo Ensemble Anéna Beige × Bordeaux × Vert · ensemble pantalon × top crop manches courtes · bandes asoké aux poches 35 000 FCFA 1 photo ↗ Commander ↗"},{"title":"Assiri","url":"assiri.html","description":"Ensemble Assiri Atelier Kadja : pantalon et top manches longues, 25 000 FCFA.","text":"Ensembles · Assiri Assiri Ensemble pantalon × top manches longues · Dempé · 25 000 FCFA · 2 vues dans une seule galerie. 2 photos Ensemble Assiri Rouge orangé × Rose · ensemble pantalon × top manches longues · Dempé · 2 vues 25 000 FCFA 2 photos ↗ Commander ↗"},{"title":"Caftans atypiques","url":"caftans-atypiques.html","description":"Caftans atypiques Atelier Kadja : 4 modèles, prix sur demande, galeries dédiées.","text":"Caftans · Atypiques Caftans atypiques 4 modèles · prix sur demande. Chaque modèle garde toutes ses vues dans sa galerie. 3 photos Caftan Typique 01 Sur demande · 3 vue(s) Sur demande 3 photos ↗ Commander ↗ 3 photos Caftan Typique 02 Sur demande · 3 vue(s) Sur demande 3 photos ↗ Commander ↗ 2 photos Caftan Typique 03 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Typique 04 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗"},{"title":"Caftans brodés","url":"caftans-brodes.html","description":"Caftans brodés Atelier Kadja : 5 modèles, prix sur demande, galeries dédiées.","text":"Caftans · Brodés Caftans brodés 5 modèles · prix sur demande. Chaque modèle garde toutes ses vues dans sa galerie. 2 photos Caftan Brodé 01 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Brodé 02 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Brodé 03 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Brodé 04 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 1 photo Caftan Brodé 05 Sur demande · 1 vue(s) Sur demande 1 photo ↗ Commander ↗"},{"title":"Caftans","url":"caftans.html","description":"Caftans Atelier Kadja : atypiques, brodés et prochainement simples.","text":"Une collection dédiée Caftans Chaque sous-collection garde ses photos sur sa propre page pour éviter les répétitions et alléger la navigation. Collection Caftans atypiques 4 modèles · prix sur demande. Voir la collection ↗ Collection Caftans brodés 5 modèles · prix sur demande. Voir la collection ↗ Collection Caftans simples Rubrique à venir. Voir la liste à venir ↗"},{"title":"Chemises, Tops & tee-shirt","url":"chemises-tee-shirts-tops.html","description":"Chemises, Tops & tee-shirt — index des pièces essentielles Atelier Kadja.","text":"Pièces essentielles Chemises, Tops & tee-shirt Un point d’entrée unique pour les chemises, tops et tee-shirts. Les produits disponibles gardent leur galerie sur leur page dédiée. Collection Tee-shirts 4 coloris · 100% coton · galeries recto/verso. Voir la collection ↗ Collection Tops Top 01 · pièce actuellement référencée. Voir la collection ↗ Collection Chemises Rubrique à venir · les prochaines références seront publiées ici. Voir la liste à venir ↗"},{"title":"Coming Soon","url":"coming-soon.html","description":"Toutes les rubriques Atelier Kadja encore en préparation, regroupées sur une seule page.","text":"À venir Coming Soon Toutes les rubriques encore en préparation sont réunies ici. Une seule page remplace les multiples entrées “Coming Soon” du site. Pièces essentielles Chemises La prochaine sélection de chemises sera publiée dans cette rubrique. Robes Robes midi Rubrique en préparation. Robes Robes courtes Rubrique en préparation. Caftans Caftans simples Rubrique en préparation. Maroquinerie Maroquinerie Une future ligne dédiée à la maroquinerie sera présentée ici. Maroquinerie Sacs Rubrique en préparation. Maroquinerie Ceintures Rubrique en préparation. Maroquinerie Portefeuilles Rubrique en préparation. Maroquinerie Petite maroquinerie Rubrique en préparation. Accessoires Accessoires Rubrique en préparation. Vestiaire Jupes Rubrique en préparation. Vestiaire Blazers Rubrique en préparation. Vestiaire Combinaisons Rubrique en préparation. Vestiaire Survêtements Rubrique en préparation. Déjà disponible Sur mesure Le service sur mesure possède sa propre page : il ne doit pas être classé comme “Coming Soon”. Découvrir le sur mesure ↗"},{"title":"Parlons de votre prochaine silhouette.","url":"contact.html","description":"Coordonnées officielles et contact de la Maison de Mode Ivoirienne ATELIER KADJA.","text":"Rendez-vous · commande · information Parlons de votre prochaine silhouette. Un échange direct avec Atelier Kadja pour une commande, une question, un rendez-vous ou une création sur mesure. Atelier Kadja Votre demande, directement sur WhatsApp. Remplissez le formulaire. À l’envoi, WhatsApp s’ouvre avec un message prérempli contenant vos informations et votre demande. WhatsApp +225 07 59 01 38 32 ↗ E-mail latelierkadja@outlook.fr ↗ Adresse Cocody Angré 8e Tranche — Abidjan Formulaire de contact Décrivez votre demande. Nom complet Téléphone Objet Choisir un motif Commande Informations produit Rendez-vous Projet sur mesure Autre demande Votre message Envoyer sur WhatsApp ↗ L’envoi prépare automatiquement votre message dans WhatsApp. Aucune donnée n’est stockée sur ce site. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ Nous trouver Cocody Angré 8e Tranche Abidjan · Côte d’Ivoire Ouvrir dans Maps ↗"},{"title":"Ensembles","url":"ensembles.html","description":"Ensembles Atelier Kadja : Adiré, Assiri, Anéna et Sawa set, avec fiches et galeries dédiées.","text":"Ensembles pantalons Ensembles Une page d’index compacte : chaque ensemble possède sa fiche et sa galerie propres. Collection Adiré 10 looks · 35 000 FCFA · chaque look conserve toutes ses vues. Voir la collection ↗ Collection Assiri Ensemble pantalon × top manches longues · 25 000 FCFA. Voir la collection ↗ Collection Anéna Ensemble pantalon × top crop manches courtes · 35 000 FCFA. Voir la collection ↗ Collection Sawa set 4 vues dans une galerie dédiée · 40 000 FCFA. Voir la collection ↗"},{"title":"Fatila","url":"fatila.html","description":"Robe Fatila Atelier Kadja : dos nu, Dempé batik, 20 000 FCFA.","text":"Robes volantes · Fatila Fatila Robe à dos nu · Dempé batik · 20 000 FCFA · 2 vues dans une seule galerie. 2 photos Robe Fatila Robe à dos nu · Dempé batik · 2 vues 20 000 FCFA 2 photos ↗ Commander ↗"},{"title":"ATELIER KADJA","url":"index.html","description":"Catalogue digital Atelier Kadja — Maison de Mode Ivoirienne à Abidjan.","text":"Maison de Mode Ivoirienne · Abidjan ATELIER KADJA L’élégance contemporaine imaginée à Abidjan. Adiré Robes Caftans Nouveautés Ensembles Pièces essentielles À venir La Maison Sur mesure Contact Explorer les univers."},{"title":"La Maison","url":"la-maison.html","description":"Identité, vision et univers de la Maison de Mode Ivoirienne ATELIER KADJA.","text":"Identité & vision La Maison Une signature ivoirienne associée à une allure contemporaine. Identité ATELIER KADJA Positionnement : Maison de Mode Ivoirienne Localisation : Abidjan, Côte d'Ivoire Signature : « L'élégance contemporaine imaginée à Abidjan. » Promesse Un vestiaire raffiné Des silhouettes où l’identité ivoirienne rencontre une allure moderne, avec une attention particulière portée aux matières, aux coupes et aux détails. Vision Une mode pensée comme une œuvre. Pour chaque silhouette, la maison recherche un équilibre entre identité , simplicité et présence . Univers Les signatures de la maison Adiré Tee-shirts Robes Ensembles Caftans Pièces essentielles Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"},{"title":"Lewa","url":"lewa.html","description":"Robes Lewa Atelier Kadja : deux coloris, 25 000 FCFA, galeries dédiées.","text":"Robes volantes · Lewa Lewa Deux coloris · 25 000 FCFA · chaque coloris garde ses vues dans sa galerie. 1 photo Robe Lewa · Marron Marron · imprimé indigo · 100% coton & crêpe simple 25 000 FCFA 1 photo ↗ Commander ↗ 2 photos Robe Lewa · Rouge Orange Rouge Orange · imprimé indigo & crêpe simple · 2 vues 25 000 FCFA 2 photos ↗ Commander ↗"},{"title":"Maillots de bain","url":"maillots-de-bain.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"Maillots de bain Maillots de bain Une sélection dédiée aux maillots de bain Atelier Kadja. Monokini en bogolan · 25 000 FCFA. Le bikini noir · 15 000 FCFA. Le bikini bogolan · 25 000 FCFA. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"},{"title":"Nouveautés","url":"nouveautes.html","description":"Nouveautés Atelier Kadja — Adiré, 10 looks et galeries dédiées.","text":"Nouveautés Adiré La nouveauté actuellement mise en avant : 10 looks Adiré, chacun avec sa galerie complète. 10 looks · 20 photos Adiré Pantalon + chemise manches longues en adiré coton · 35 000 FCFA. Toutes les photos sont regroupées sur la page dédiée, sans doublon sur cette page de nouveautés. Voir les 10 looks ↗"},{"title":"Pantalons","url":"pantalons.html","description":"Pantalons Atelier Kadja : accès aux ensembles et à leurs galeries dédiées.","text":"Sous-collections Pantalons Le pantalon est présenté à travers les ensembles qui l’intègrent, sans recopier les produits sur plusieurs pages. Collection Adiré 10 looks · pantalon + chemise manches longues. Voir la collection ↗ Collection Assiri Ensemble pantalon × top manches longues. Voir la collection ↗ Collection Anéna Ensemble pantalon × top crop manches courtes. Voir la collection ↗ Collection Sawa set Galerie Sawa · 4 vues · 40 000 FCFA. Voir la collection ↗"},{"title":"Robes longues","url":"robes-longues.html","description":"Robes longues Atelier Kadja : 7 robes avec noms, prix et visuels dédiés.","text":"Robes · Silhouettes longues Robes longues 7 robes présentées séparément, une photo dédiée par produit. Kelly Rose · Robe longue 01 · longue robe volante en mesh imprimée motifs Bogolan rose · 35 000 FCFA. Nely Rose · Robe longue 01 — visuel 2 · longue robe droite en mesh imprimée motifs Bogolan rose · 25 000 FCFA. Nely Noire · Robe longue 02 · longue robe droite en mesh imprimée motifs Bogolan noir · 25 000 FCFA. Kelly Marron · Robe longue 03 · longue robe volante en mesh imprimée motifs Bogolan marron · 35 000 FCFA. Nelly Marron · Robe longue 04 · longue robe droite en mesh imprimée motifs Bogolan marron · 25 000 FCFA. Assana · Robe longue 05 · longue robe volante aux manches bouffantes réalisées avec l’imprimé Bogolan marron · 50 000 FCFA. Kelly Bleu · Robe longue 06 · longue robe volante en mesh imprimée motifs Bogolan bleu · 35 000 FCFA."},{"title":"Robes volantes","url":"robes-volantes.html","description":"Robes volantes Atelier Kadja : Lewa et Fatila.","text":"Robes légères Robes volantes Chaque modèle garde toutes ses vues dans sa propre fiche. Collection Lewa Deux coloris · 25 000 FCFA. Voir la collection ↗ Collection Fatila Robe à dos nu · Dempé batik · 20 000 FCFA. Voir la collection ↗"},{"title":"Robes","url":"robes.html","description":"Robes Atelier Kadja : robes volantes et robes longues disponibles, midi et courtes à venir.","text":"Le vestiaire robes Robes Robes volantes et robes longues disponibles. Les robes midi et courtes sont regroupées dans le Coming Soon. Collection Robes volantes Lewa et Fatila · fiches dédiées et galeries complètes. Voir la collection ↗ Collection Robes longues 7 robes issues de la galerie Robes longues. Voir la collection ↗ Collection Robes midi Rubrique à venir. Voir la liste à venir ↗ Collection Robes courtes Rubrique à venir. Voir la liste à venir ↗"},{"title":"Sawa set","url":"sawa-set.html","description":"Sawa set Atelier Kadja : galerie dédiée avec 4 vues, 40 000 FCFA.","text":"Ensembles · Sawa Sawa set 4 vues regroupées dans une seule galerie · 40 000 FCFA. 4 photos Sawa set Galerie Sawa · 4 vues · 40 000 FCFA 4 photos ↗ Commander ↗"},{"title":"Plan du site","url":"sitemap.html","description":"Plan du site Atelier Kadja — toutes les pages du catalogue et de la maison.","text":"Navigation Plan du site Toutes les pages utiles, sans répéter les produits dans plusieurs rubriques. Accueil ↗ Nouveautés ↗ Chemises, Tops & tee-shirt ↗ Tee-shirts ↗ Tops ↗ Robes ↗ Robes volantes ↗ Lewa ↗ Fatila ↗ Robes longues ↗ Ensembles ↗ Adiré ↗ Assiri ↗ Anéna ↗ Sawa set ↗ Caftans ↗ Caftans atypiques ↗ Caftans brodés ↗ Pantalons ↗ Maillots de bain ↗ Sur mesure ↗ La Maison ↗ Contact ↗ Coming Soon ↗ Plan du site ↗ Rubriques à venir Une seule page pour tout le Coming Soon. Les ancres permettent d’arriver directement à une rubrique sans multiplier les pages. Voir le Coming Soon ↗"},{"title":"Créations sur mesure","url":"sur-mesure.html","description":"Service sur mesure ATELIER KADJA — rendez-vous, commande et projets personnalisés via WhatsApp.","text":"Sur mesure Créations sur mesure Une création pensée pour vous, directement avec la maison. Votre projet Un échange direct avec Atelier Kadja Une demande personnalisée peut être traitée directement via WhatsApp. Motifs de contact : rendez-vous, commande, information ou projet sur mesure. WhatsApp officiel +225 07 59 01 38 32 Parler de mon projet Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"},{"title":"Tee-shirts","url":"tee-shirts.html","description":"Tee-shirts Atelier Kadja : 4 coloris en 100% coton, avec galerie dédiée par coloris.","text":"Chemises, Tops & tee-shirt Tee-shirts 4 coloris · 100% coton · coupe confortable. Chaque coloris garde ses vues recto/verso dans sa galerie. 2 photos T-Shirt · Rose Rose · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗ 2 photos T-Shirt · Blanc Blanc · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗ 2 photos T-Shirt · Bleu Bleu · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗ 2 photos T-Shirt · Noir Noir · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗"},{"title":"Tops","url":"tops.html","description":"Top et pièces essentielles ATELIER KADJA.","text":"Chemises, Tops & tee-shirt Tops Le Top 01 est présenté ici dans sa propre rubrique. Les maillots de bain restent dans leur famille dédiée. Chemises, Tops & tee-shirt Top 01 Top 01 · pièce disponible dans le catalogue Commander ↗ Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"}];

  const highlight = value => String(value).replace(
    /[&<>"']/g,
    c => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#039;'
    }[c])
  );

  const normalizeSearch = value =>
    value
      .toLocaleLowerCase('fr-FR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const renderSearch = (wrap, query) => {
    const results = wrap.querySelector('[data-site-search-results]');
    if (!results) return;

    const q = normalizeSearch(query.trim());

    if (!q) {
      results.hidden = true;
      results.innerHTML = '';
      return;
    }

    const terms = q.split(/\s+/).filter(Boolean);

    const found = SEARCH_INDEX
      .map(page => {
        const translatedTitle = translateString(page.title);
        const translatedDescription = translateString(page.description);
        const translatedText = translateString(page.text);
        const hay = normalizeSearch(
          page.title + ' ' + page.description + ' ' + page.text + ' ' +
          translatedTitle + ' ' + translatedDescription + ' ' + translatedText
        );
        const titleHay = normalizeSearch(page.title + ' ' + translatedTitle);

        const score = terms.reduce(
          (n, term) =>
            n +
            (hay.includes(term)
              ? (titleHay.includes(term) ? 4 : 1)
              : 0),
          0
        );

        return {
          ...page,
          title: translatedTitle,
          description: translatedDescription,
          score
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    results.innerHTML = found.length
      ? found.map(item => {
          const target = '/' + locale + '/' + item.url.replace(/^\/+/, '');
          return [
            '<a class="site-search-result" href="',
            target,
            '">',
            '<strong>',
            highlight(item.title),
            '</strong>',
            '<span>',
            highlight(item.description || translateString('Voir la page')),
            '</span>',
            '<b>↗</b>',
            '</a>'
          ].join('');
        }).join('')
      : '<div class="site-search-empty">' +
        translateString('Aucun résultat. Essayez un autre terme.') +
        '</div>';

    results.hidden = false;
  };

  $$('[data-site-search-wrap]').forEach(wrap => {
    const form = wrap.querySelector('[data-site-search-form]');
    const input = wrap.querySelector('[data-site-search-input]');

    form?.addEventListener('submit', event => {
      event.preventDefault();
      renderSearch(wrap, input?.value || '');

      if (input?.value.trim()) {
        input.focus();
      }
    });

    input?.addEventListener('input', () => {
      renderSearch(wrap, input.value);
    });

    document.addEventListener('click', event => {
      if (!wrap.contains(event.target)) {
        const results = wrap.querySelector('[data-site-search-results]');
        if (results) {
          results.hidden = true;
        }
      }
    });
  });

  // ---------------------------------------------------------
  // PWA install prompt
  // ---------------------------------------------------------

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (
      navigator.platform === 'MacIntel' &&
      navigator.maxTouchPoints > 1
    );

  const isMobile =
    /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
    navigator.maxTouchPoints > 1;

  let deferredInstallPrompt = null;
  let installPromptShown = false;

  const createInstallBanner = ({
    ios = false,
    fallback = false
  } = {}) => {
    if (
      !isMobile ||
      isStandalone ||
      document.querySelector('.app-install-banner')
    ) {
      return null;
    }

    const banner = document.createElement('aside');
    banner.className =
      `app-install-banner${ios ? ' app-install-ios' : ''}`;

    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Installer Atelier Kadja');

    const helper = ios
      ? '<span>Sur iPhone/iPad : touchez <strong>Partager</strong>, puis <strong>Ajouter à l’écran d’accueil</strong>.</span>'
      : fallback
        ? '<span>Ajoutez Atelier Kadja à votre écran d’accueil depuis le menu du navigateur.</span>'
        : '<span>Accédez au catalogue depuis votre écran d’accueil.</span>';

    banner.innerHTML = `
      <div class="app-install-icon">
        <img src="icons/icon-192.png" alt="Logo Atelier Kadja">
      </div>

      <div class="app-install-copy">
        <strong>Installer l’app Atelier Kadja</strong>
        ${helper}
      </div>

      <button
        type="button"
        class="app-install-button"
        data-install-app>
        ${ios || fallback ? 'Comment faire' : 'Installer'}
      </button>

      <button
        type="button"
        class="app-install-close"
        aria-label="${locale === 'en' ? 'Close' : 'Fermer'}">
        ×
      </button>
    `;

    document.body.appendChild(banner);

    const close = () => {
      banner.classList.remove('is-visible');

      window.setTimeout(() => {
        banner.remove();
      }, 350);

      try {
        sessionStorage.setItem(
          'kadja-install-dismissed',
          '1'
        );
      } catch (_) {}
    };

    banner
      .querySelector('.app-install-close')
      ?.addEventListener('click', close);

    banner
      .querySelector('[data-install-app]')
      ?.addEventListener('click', async () => {
        if (!ios && !fallback && deferredInstallPrompt) {
          deferredInstallPrompt.prompt();

          try {
            await deferredInstallPrompt.userChoice;
          } catch (_) {}

          deferredInstallPrompt = null;
          close();
          return;
        }

        if (ios) {
          banner
            .querySelector('.app-install-copy span')
            .innerHTML =
              'Sur iPhone/iPad : touchez <strong>Partager</strong> <strong>▢↑</strong>, puis <strong>Ajouter à l’écran d’accueil</strong>.';
        } else {
          banner
            .querySelector('.app-install-copy span')
            .textContent =
              'Ouvrez le menu ⋮ du navigateur, puis choisissez « Ajouter à l’écran d’accueil » ou « Installer l’application ».';
        }
      });

    requestAnimationFrame(() => {
      banner.classList.add('is-visible');
    });

    installPromptShown = true;
    return banner;
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;

    if (
      !installPromptShown &&
      !isStandalone &&
      isMobile
    ) {
      createInstallBanner();
    }
  });

  window.addEventListener('appinstalled', () => {
    const banner = document.querySelector('.app-install-banner');
    banner?.remove();
    deferredInstallPrompt = null;
  });

  if (isMobile && !isStandalone) {
    let dismissed = false;

    try {
      dismissed =
        sessionStorage.getItem('kadja-install-dismissed') === '1';
    } catch (_) {}

    if (!dismissed) {
      window.setTimeout(() => {
        if (installPromptShown) return;

        if (isIOS) {
          createInstallBanner({ ios: true });
        } else if (!deferredInstallPrompt) {
          createInstallBanner({ fallback: true });
        }
      }, 1100);
    }
  }

  // ---------------------------------------------------------
  // Generic anchor scrolling
  // ---------------------------------------------------------

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = $(anchor.getAttribute('href'));

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });

      closeMobileMenu();
    });
  });

})();
