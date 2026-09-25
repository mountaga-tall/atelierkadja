(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // ---------------------------------------------------------
  // Global helpers
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // Graceful asset fallback
  // ---------------------------------------------------------
  $$('img').forEach(img => {
    img.addEventListener('error', () => {
      const parent = img.closest('.product-media, .product-views, .subcategory-media, .mosaic-card, .editorial-hero-media, .hero-media');
      if (parent) parent.classList.add('media-broken');
      if (img.closest('.brand-mark')) img.closest('.brand-mark').classList.add('asset-missing');
    }, { once: true });
  });
  $$('video').forEach(video => {
    video.addEventListener('error', () => video.parentElement?.classList.add('media-broken-video'), { once: true });
  });

  $$( '[data-year]' ).forEach(el => { el.textContent = new Date().getFullYear(); });

  const header = $('[data-header]');
  const progress = $('.site-progress span');
  const cursorGlow = $('.cursor-glow');

  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  // ---------------------------------------------------------
  // Mobile navigation
  // ---------------------------------------------------------
  const navToggle = $('.nav-toggle');
  const siteMenu = $('#site-menu');
  if (navToggle && siteMenu) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      siteMenu.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
      navToggle.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
    });

    $$('a', siteMenu).forEach(link => link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteMenu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }));
  }

  // Active main navigation based on current file.
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
    const target = href.split('/').pop();
    if (target === current) link.classList.add('is-active');
  });

  // ---------------------------------------------------------
  // Hero video: play / pause / mute
  // ---------------------------------------------------------
  $$('video[data-autoplay]').forEach(video => {
    video.muted = true;
    video.playsInline = true;
    const play = () => video.play().catch(() => {});
    play();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) play(); });

    const controls = $('.video-controls', video.closest('.hero-media') || document);
    if (!controls) return;

    const playBtn = $('[data-video-play]', controls);
    const muteBtn = $('[data-video-mute]', controls);

    const refresh = () => {
      if (playBtn) {
        playBtn.textContent = video.paused ? '▶' : 'Ⅱ';
        playBtn.setAttribute('aria-label', video.paused ? 'Lire la vidéo' : 'Mettre la vidéo en pause');
      }
      if (muteBtn) {
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
        muteBtn.setAttribute('aria-label', video.muted ? 'Activer le son' : 'Couper le son');
      }
    };
    playBtn?.addEventListener('click', () => video.paused ? video.play().catch(() => {}) : video.pause());
    muteBtn?.addEventListener('click', () => { video.muted = !video.muted; if (!video.muted) video.volume = 1; refresh(); });
    video.addEventListener('play', refresh);
    video.addEventListener('pause', refresh);
    video.addEventListener('volumechange', refresh);
    refresh();
  });

  // ---------------------------------------------------------
  // Reveal on scroll
  // ---------------------------------------------------------
  const revealItems = $$('.section, .page-hero, .product-card, .subcategory-card, .info-card, .contact-card, .explore-panel');
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
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));
  } else {
    $$('[data-reveal]').forEach(el => el.classList.add('is-visible'));
  }

  // ---------------------------------------------------------
  // Premium card tilt (mouse only, disabled on touch/reduced motion)
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
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---------------------------------------------------------
  // Subtle magnetic interactions on primary CTAs
  // ---------------------------------------------------------
  if (finePointer && !reduceMotion) {
    $$('.btn, .nav-order, .whatsapp-float').forEach(el => {
      el.addEventListener('pointermove', event => {
        const r = el.getBoundingClientRect();
        const dx = (event.clientX - (r.left + r.width / 2)) * .08;
        const dy = (event.clientY - (r.top + r.height / 2)) * .08;
        el.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // ---------------------------------------------------------
  // Cursor glow
  // ---------------------------------------------------------
  if (cursorGlow && finePointer && !reduceMotion) {
    let raf = null;
    let x = 0, y = 0;
    const paint = () => {
      cursorGlow.style.left = `${x}px`;
      cursorGlow.style.top = `${y}px`;
      raf = null;
    };
    window.addEventListener('pointermove', event => {
      x = event.clientX;
      y = event.clientY;
      cursorGlow.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
    window.addEventListener('pointerleave', () => { cursorGlow.style.opacity = '0'; });
  }

  // ---------------------------------------------------------
  // WhatsApp contact form: pre-filled message, no backend.
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

      const text = [
        'Bonjour Atelier Kadja,',
        '',
        `Nom : ${name}`,
        `Téléphone : ${phone}`,
        `Objet : ${subject}`,
        '',
        'Message :',
        message,
        '',
        'Je souhaite échanger avec la maison au sujet de ma demande.'
      ].join('\n');

      const url = `https://wa.me/2250759013832?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
    });
  }


  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // Product galleries — one cover photo per card; the rest stay
  // in lightweight data attributes until the user opens the gallery.
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // Real full-screen product gallery / lightbox.
  // ---------------------------------------------------------
  let lightbox = null;
  const createLightbox = () => {
    if (lightbox) return lightbox;
    lightbox = document.createElement('div');
    lightbox.className = 'kadja-lightbox';
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Galerie photo">
        <button type="button" class="lightbox-close" data-lightbox-close aria-label="Fermer">×</button>
        <button type="button" class="lightbox-prev" data-lightbox-prev aria-label="Photo précédente">‹</button>
        <figure class="lightbox-figure"><img data-lightbox-image alt=""><figcaption data-lightbox-caption></figcaption></figure>
        <button type="button" class="lightbox-next" data-lightbox-next aria-label="Photo suivante">›</button>
        <div class="lightbox-thumbs" data-lightbox-thumbs></div>
      </div>`;
    document.body.appendChild(lightbox);
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(btn => btn.addEventListener('click', closeLightbox));
    lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => moveLightbox(-1));
    lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => moveLightbox(1));
    document.addEventListener('keydown', event => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    });
    return lightbox;
  };
  let lightboxItems = [], lightboxIndex = 0;
  const renderLightbox = () => {
    if (!lightbox || !lightboxItems.length) return;
    const item = lightboxItems[lightboxIndex];
    const img = lightbox.querySelector('[data-lightbox-image]');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    img.src = item.src;
    img.alt = item.alt || `Photo ${lightboxIndex + 1}`;
    caption.textContent = item.alt || '';
    const thumbs = lightbox.querySelector('[data-lightbox-thumbs]');
    thumbs.replaceChildren(...lightboxItems.map((it, i) => {
      const b = document.createElement('button'); b.type='button'; b.className='lightbox-thumb'+(i===lightboxIndex?' is-active':''); b.setAttribute('aria-label',`Afficher la photo ${i+1}`);
      const t=document.createElement('img'); t.src=it.src; t.alt=''; b.appendChild(t); b.addEventListener('click',()=>{lightboxIndex=i;renderLightbox();}); return b;
    }));
  };
  const toGalleryItem = item => {
    if (typeof item === 'string') return { src: item, alt: '' };
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
    card.querySelectorAll('.product-gallery-data [data-gallery-src]').forEach(img => {
      const item = toGalleryItem(img);
      if (item.src && !items.some(existing => existing.src === item.src)) items.push(item);
    });
    if (!items.length) {
      card.querySelectorAll('.product-views > img, .product-media > img, .subcategory-media > img, .mosaic-card > img').forEach(img => {
        const item = toGalleryItem(img);
        if (item.src && !items.some(existing => existing.src === item.src)) items.push(item);
      });
    }
    return items;
  };

  const openLightbox = (images, index = 0) => {
    createLightbox();
    lightboxItems = images.map(toGalleryItem).filter(item => item.src);
    if (!lightboxItems.length) return;
    lightboxIndex = Math.max(0, Math.min(index, lightboxItems.length - 1));
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
    lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
    renderLightbox();
  };

  $$('[data-gallery-card]').forEach(card => {
    const cover = card.querySelector('.product-views > img, .product-media > img, .subcategory-media > img');
    const trigger = card.querySelector('[data-gallery-trigger]');
    const open = event => {
      event?.preventDefault?.();
      const items = galleryItemsFor(card);
      openLightbox(items, 0);
    };
    cover?.addEventListener('click', open);
    cover?.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') open(event);
    });
    trigger?.addEventListener('click', open);
    if (cover) cover.style.cursor = 'zoom-in';
  });

  $$('.mosaic-card img, .subcategory-media img, .product-media img').forEach(img => {
    if (img.closest('[data-gallery-card]')) return;
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', event => {
      event.preventDefault();
      openLightbox([img], 0);
    });
  });



  // ---------------------------------------------------------
  // Simplified collection rails: only dedicated category/media rails
  // move automatically. Product grids remain independent product cards.
  // ---------------------------------------------------------
  const initInfiniteRail = (rail, index) => {
    if (!rail || rail.dataset.infiniteReady === 'true') return;
    const items = [...rail.children];
    if (items.length < 2) return;
    rail.dataset.infiniteReady = 'true';
    rail.classList.add('infinite-rail');
    const shell = document.createElement('div');
    shell.className = 'infinite-shell simple-rail-shell';
    rail.parentNode.insertBefore(shell, rail);
    shell.appendChild(rail);

    let paused = false;
    let raf = null;
    let last = performance.now();
    const speed = 22;
    const measure = () => { rail.scrollLeft = Math.min(rail.scrollWidth - rail.clientWidth, Math.max(0, rail.scrollLeft)); };
    const loop = now => {
      const dt = Math.min(48, now-last); last = now;
      if (!paused && !document.hidden) {
        rail.scrollLeft += speed * dt / 1000;
        if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2) rail.scrollLeft = 0;
      }
      raf=requestAnimationFrame(loop);
    };
    const setPaused = v => { paused=v; shell.classList.toggle('is-paused',v); };
    shell.addEventListener('mouseenter',()=>setPaused(true)); shell.addEventListener('mouseleave',()=>setPaused(false));
    shell.addEventListener('focusin',()=>setPaused(true)); shell.addEventListener('focusout',e=>{if(!shell.contains(e.relatedTarget))setPaused(false)});
    rail.addEventListener('touchstart',()=>setPaused(true),{passive:true}); rail.addEventListener('touchend',()=>setPaused(false),{passive:true});
    window.addEventListener('resize',measure,{passive:true}); measure(); raf=requestAnimationFrame(loop);
    window.addEventListener('beforeunload',()=>raf&&cancelAnimationFrame(raf),{once:true});
  };
  $$('.subcategory-grid, .mosaic').forEach((rail, index) => initInfiniteRail(rail, index));

  // ---------------------------------------------------------
  // Global search: one index, one search experience, every page.
  // ---------------------------------------------------------
  const SEARCH_INDEX = [{"title":"Adiré","url":"adire.html","description":"Adiré Atelier Kadja : 10 looks, 35 000 FCFA, avec toutes les vues regroupées par look.","text":"Nouveautés · Adiré Adiré 10 looks · 20 photos · ensembles pantalon + chemise manches longues en adiré coton. Nouveautés · Adiré Adiré 10 looks · 20 photos · ensembles pantalon + chemise manches longues en adiré coton. 3 photos Adiré 01 Rouge Noir Beige · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA 3 photos ↗ Commander ↗ 3 photos Adiré 02 Bleu Noir Rose · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA 3 photos ↗ Commander ↗ 3 photos Adiré 03 Brique Noir Vert · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA 3 photos ↗ Commander ↗ 2 photos Adiré 04 Fuchsia Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 2 photos Adiré 05 Rouge Noir Orange · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 2 photos Adiré 06 Vert Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 2 photos Adiré 07 Jaune Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA 2 photos ↗ Commander ↗ 1 photo Adiré 08 Bordeaux Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA 1 photo ↗ Commander ↗ 1 photo Adiré 09 Violet Noir Bleu · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA 1 photo ↗ Commander ↗ 1 photo Adiré 10 Marron Noir Orange · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA 1 photo ↗ Commander ↗"},{"title":"Anéna","url":"anena.html","description":"Ensemble Anéna Atelier Kadja : pantalon et top crop manches courtes, 35 000 FCFA.","text":"Ensembles · Anéna Anéna Ensemble pantalon × top crop manches courtes · bandes asoké aux poches · 35 000 FCFA. Ensembles · Anéna Anéna Ensemble pantalon × top crop manches courtes · bandes asoké aux poches · 35 000 FCFA. 1 photo Ensemble Anéna Beige × Bordeaux × Vert · ensemble pantalon × top crop manches courtes · bandes asoké aux poches 35 000 FCFA 1 photo ↗ Commander ↗"},{"title":"Assiri","url":"assiri.html","description":"Ensemble Assiri Atelier Kadja : pantalon et top manches longues, 25 000 FCFA.","text":"Ensembles · Assiri Assiri Ensemble pantalon × top manches longues · Dempé · 25 000 FCFA · 2 vues dans une seule galerie. Ensembles · Assiri Assiri Ensemble pantalon × top manches longues · Dempé · 25 000 FCFA · 2 vues dans une seule galerie. 2 photos Ensemble Assiri Rouge orangé × Rose · ensemble pantalon × top manches longues · Dempé · 2 vues 25 000 FCFA 2 photos ↗ Commander ↗"},{"title":"Caftans atypiques","url":"caftans-atypiques.html","description":"Caftans atypiques Atelier Kadja : 4 modèles, prix sur demande, galeries dédiées.","text":"Caftans · Atypiques Caftans atypiques 4 modèles · prix sur demande. Chaque modèle garde toutes ses vues dans sa galerie. Caftans · Atypiques Caftans atypiques 4 modèles · prix sur demande. Chaque modèle garde toutes ses vues dans sa galerie. 3 photos Caftan Typique 01 Sur demande · 3 vue(s) Sur demande 3 photos ↗ Commander ↗ 3 photos Caftan Typique 02 Sur demande · 3 vue(s) Sur demande 3 photos ↗ Commander ↗ 2 photos Caftan Typique 03 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Typique 04 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗"},{"title":"Caftans brodés","url":"caftans-brodes.html","description":"Caftans brodés Atelier Kadja : 5 modèles, prix sur demande, galeries dédiées.","text":"Caftans · Brodés Caftans brodés 5 modèles · prix sur demande. Chaque modèle garde toutes ses vues dans sa galerie. Caftans · Brodés Caftans brodés 5 modèles · prix sur demande. Chaque modèle garde toutes ses vues dans sa galerie. 2 photos Caftan Brodé 01 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Brodé 02 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Brodé 03 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 2 photos Caftan Brodé 04 Sur demande · 2 vue(s) Sur demande 2 photos ↗ Commander ↗ 1 photo Caftan Brodé 05 Sur demande · 1 vue(s) Sur demande 1 photo ↗ Commander ↗"},{"title":"Caftans","url":"caftans.html","description":"Caftans Atelier Kadja : atypiques, brodés et prochainement simples.","text":"Une collection dédiée Caftans Chaque sous-collection garde ses photos sur sa propre page pour éviter les répétitions et alléger la navigation. Collection Caftans atypiques 4 modèles · prix sur demande. Voir la collection ↗ Collection Caftans brodés 5 modèles · prix sur demande. Voir la collection ↗ Collection Caftans simples Rubrique à venir. Voir la liste à venir ↗"},{"title":"Chemises, Tops & tee-shirt","url":"chemises-tee-shirts-tops.html","description":"Chemises, Tops & tee-shirt — index des pièces essentielles Atelier Kadja.","text":"Pièces essentielles Chemises, Tops & tee-shirt Un point d’entrée unique pour les chemises, tops et tee-shirts. Les produits disponibles gardent leur galerie sur leur page dédiée. Collection Tee-shirts 4 coloris · 100% coton · galeries recto/verso. Voir la collection ↗ Collection Tops Top 01 · pièce actuellement référencée. Voir la collection ↗ Collection Chemises Rubrique à venir · les prochaines références seront publiées ici. Voir la liste à venir ↗"},{"title":"Coming Soon","url":"coming-soon.html","description":"Toutes les rubriques Atelier Kadja encore en préparation, regroupées sur une seule page.","text":"À venir Coming Soon Toutes les rubriques encore en préparation sont réunies ici. Une seule page remplace les multiples entrées “Coming Soon” du site. Pièces essentielles Chemises La prochaine sélection de chemises sera publiée dans cette rubrique. Robes Robes midi Rubrique en préparation. Robes Robes courtes Rubrique en préparation. Caftans Caftans simples Rubrique en préparation. Maroquinerie Maroquinerie Une future ligne dédiée à la maroquinerie sera présentée ici. Maroquinerie Sacs Rubrique en préparation. Maroquinerie Ceintures Rubrique en préparation. Maroquinerie Portefeuilles Rubrique en préparation. Maroquinerie Petite maroquinerie Rubrique en préparation. Accessoires Accessoires Rubrique en préparation. Vestiaire Jupes Rubrique en préparation. Vestiaire Blazers Rubrique en préparation. Vestiaire Combinaisons Rubrique en préparation. Vestiaire Survêtements Rubrique en préparation. Déjà disponible Sur mesure Le service sur mesure possède sa propre page : il ne doit pas être classé comme “Coming Soon”. Découvrir le sur mesure ↗"},{"title":"Parlons de votre prochaine silhouette.","url":"contact.html","description":"Coordonnées officielles et contact de la Maison de Mode Ivoirienne ATELIER KADJA.","text":"Rendez-vous · commande · information Parlons de votre prochaine silhouette. Un échange direct avec Atelier Kadja pour une commande, une question, un rendez-vous ou une création sur mesure. Atelier Kadja Votre demande, directement sur WhatsApp. Remplissez le formulaire. À l’envoi, WhatsApp s’ouvre avec un message prérempli contenant vos informations et votre demande. WhatsApp +225 07 59 01 38 32 ↗ E-mail latelierkadja@outlook.fr ↗ Adresse Cocody Angré 8e Tranche — Abidjan Formulaire de contact Décrivez votre demande. Nom complet Téléphone Objet Choisir un motif Commande Informations produit Rendez-vous Projet sur mesure Autre demande Votre message Envoyer sur WhatsApp ↗ L’envoi prépare automatiquement votre message dans WhatsApp. Aucune donnée n’est stockée sur ce site. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ Nous trouver Cocody Angré 8e Tranche Abidjan · Côte d’Ivoire Ouvrir dans Maps ↗"},{"title":"Ensembles","url":"ensembles.html","description":"Ensembles Atelier Kadja : Adiré, Assiri, Anéna et Sawa set, avec fiches et galeries dédiées.","text":"Ensembles pantalons Ensembles Une page d’index compacte : chaque ensemble possède sa fiche et sa galerie propres. Collection Adiré 10 looks · 35 000 FCFA · chaque look conserve toutes ses vues. Voir la collection ↗ Collection Assiri Ensemble pantalon × top manches longues · 25 000 FCFA. Voir la collection ↗ Collection Anéna Ensemble pantalon × top crop manches courtes · 35 000 FCFA. Voir la collection ↗ Collection Sawa set 4 vues dans une galerie dédiée · informations commerciales non renseignées. Voir la collection ↗"},{"title":"Fatila","url":"fatila.html","description":"Robe Fatila Atelier Kadja : dos nu, Dempé batik, 20 000 FCFA.","text":"Robes volantes · Fatila Fatila Robe à dos nu · Dempé batik · 20 000 FCFA · 2 vues dans une seule galerie. Robes volantes · Fatila Fatila Robe à dos nu · Dempé batik · 20 000 FCFA · 2 vues dans une seule galerie. 2 photos Robe Fatila Robe à dos nu · Dempé batik · 2 vues 20 000 FCFA 2 photos ↗ Commander ↗"},{"title":"ATELIER KADJA","url":"index.html","description":"Catalogue digital Atelier Kadja — Maison de Mode Ivoirienne à Abidjan.","text":"Maison de Mode Ivoirienne · Abidjan ATELIER KADJA L’élégance contemporaine imaginée à Abidjan. Voir les nouveautés ↗ Découvrir la maison ↗ Le vestiaire Kadja Des pièces pensées comme des chapitres. Un catalogue plus simple : chaque collection a sa page d’entrée, chaque modèle garde sa galerie, et les rubriques à venir sont regroupées au même endroit. Collections disponibles Explorer les univers Ensembles ↗ Chemises, Tops & tee-shirt ↗ Robes ↗ Caftans ↗ Maillots de bain ↗ Nouveautés ↗ À venir Une seule page pour les prochaines rubriques. Chemises, robes midi et courtes, caftans simples, maroquinerie, accessoires et autres lignes en préparation sont réunis dans le Coming Soon. Voir toutes les rubriques ↗ La maison Une création, une histoire, un échange. Découvrir l’univers Atelier Kadja, le service sur mesure ou demander une information. La Maison ↗ Sur mesure ↗ Contact ↗"},{"title":"La Maison","url":"la-maison.html","description":"Identité, vision et univers de la Maison de Mode Ivoirienne ATELIER KADJA.","text":"Identité & vision La Maison Une signature ivoirienne associée à une allure contemporaine. Identité ATELIER KADJA Positionnement : Maison de Mode Ivoirienne Localisation : Abidjan, Côte d'Ivoire Signature : « L'élégance contemporaine imaginée à Abidjan. » Promesse Un vestiaire raffiné Des silhouettes où l’identité ivoirienne rencontre une allure moderne, avec une attention particulière portée aux matières, aux coupes et aux détails. Vision Une mode pensée comme une œuvre. Pour chaque silhouette, la maison recherche un équilibre entre identité , simplicité et présence . Univers Les signatures de la maison Adiré Tee-shirts Robes Ensembles Caftans Pièces essentielles Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"},{"title":"Lewa","url":"lewa.html","description":"Robes Lewa Atelier Kadja : deux coloris, 25 000 FCFA, galeries dédiées.","text":"Robes volantes · Lewa Lewa Deux coloris · 25 000 FCFA · chaque coloris garde ses vues dans sa galerie. Robes volantes · Lewa Lewa Deux coloris · 25 000 FCFA · chaque coloris garde ses vues dans sa galerie. 1 photo Robe Lewa · Marron Marron · imprimé indigo · 100% coton & crêpe simple 25 000 FCFA 1 photo ↗ Commander ↗ 2 photos Robe Lewa · Rouge Orange Rouge Orange · imprimé indigo & crêpe simple · 2 vues 25 000 FCFA 2 photos ↗ Commander ↗"},{"title":"Maillots de bain","url":"maillots-de-bain.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"Maillots de bain Maillots de bain Une sélection dédiée aux maillots de bain Atelier Kadja. Maillot 01 Galerie · aucune information commerciale renseignée Commander ↗ Maillot 02 Galerie · aucune information commerciale renseignée Commander ↗ Maillot 03 Galerie · aucune information commerciale renseignée Commander ↗ Aucun prix, couleur, matière ou composition n’est indiqué pour ces trois pièces dans les informations fournies. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"},{"title":"Adiré","url":"nouveautes.html","description":"Nouveautés Atelier Kadja — Adiré, 10 looks et galeries dédiées.","text":"Nouveautés Adiré La nouveauté actuellement mise en avant : 10 looks Adiré, chacun avec sa galerie complète. 10 looks · 20 photos Adiré Pantalon + chemise manches longues en adiré coton · 35 000 FCFA. Toutes les photos sont regroupées sur la page dédiée, sans doublon sur cette page de nouveautés. Voir les 10 looks ↗"},{"title":"Pantalons","url":"pantalons.html","description":"Pantalons Atelier Kadja : accès aux ensembles et à leurs galeries dédiées.","text":"Sous-collections Pantalons Le pantalon est présenté à travers les ensembles qui l’intègrent, sans recopier les produits sur plusieurs pages. Collection Adiré 10 looks · pantalon + chemise manches longues. Voir la collection ↗ Collection Assiri Ensemble pantalon × top manches longues. Voir la collection ↗ Collection Anéna Ensemble pantalon × top crop manches courtes. Voir la collection ↗ Collection Sawa set Galerie Sawa · 4 vues. Voir la collection ↗"},{"title":"Robes longues","url":"robes-longues.html","description":"Robes longues Atelier Kadja : 8 pièces de la galerie existante.","text":"Robes · Silhouettes longues Robes longues 8 pièces présentées en galerie · informations commerciales non renseignées. Robes · Silhouettes longues Robes longues 8 pièces présentées en galerie · informations commerciales non renseignées. 1 photo Robe longue 01 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗ 1 photo Robe longue 02 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗ 1 photo Robe longue 03 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗ 1 photo Robe longue 04 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗ 1 photo Robe longue 05 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗ 1 photo Robe longue 06 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗ 1 photo Robe longue 07 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗ 1 photo Robe longue 08 Galerie · informations commerciales non renseignées Sur demande 1 photo ↗ Commander ↗"},{"title":"Robes volantes","url":"robes-volantes.html","description":"Robes volantes Atelier Kadja : Lewa, Fatila et galerie dédiée.","text":"Robes légères Robes volantes Chaque modèle garde toutes ses vues dans sa propre fiche. Collection Lewa Deux coloris · 25 000 FCFA. Voir la collection ↗ Collection Fatila Robe à dos nu · Dempé batik · 20 000 FCFA. Voir la collection ↗ Collection Robe volante · galerie Visuel de galerie sans fiche commerciale associée. Revoir cette galerie ↗"},{"title":"Robes","url":"robes.html","description":"Robes Atelier Kadja : robes volantes et robes longues disponibles, midi et courtes à venir.","text":"Le vestiaire robes Robes Robes volantes et robes longues disponibles. Les robes midi et courtes sont regroupées dans le Coming Soon. Collection Robes volantes Lewa et Fatila · fiches dédiées et galeries complètes. Voir la collection ↗ Collection Robes longues 8 pièces issues de la galerie Robes longues. Voir la collection ↗ Collection Robes midi Rubrique à venir. Voir la liste à venir ↗ Collection Robes courtes Rubrique à venir. Voir la liste à venir ↗"},{"title":"Sawa set","url":"sawa-set.html","description":"Sawa set Atelier Kadja : galerie dédiée avec 4 vues.","text":"Ensembles · Sawa Sawa set 4 vues regroupées dans une seule galerie · informations commerciales non renseignées. Ensembles · Sawa Sawa set 4 vues regroupées dans une seule galerie · informations commerciales non renseignées. 4 photos Sawa set Galerie Sawa · informations commerciales non renseignées Sur demande 4 photos ↗ Commander ↗"},{"title":"Plan du site","url":"sitemap.html","description":"Plan du site Atelier Kadja — toutes les pages du catalogue et de la maison.","text":"Navigation Plan du site Toutes les pages utiles, sans répéter les produits dans plusieurs rubriques. Accueil ↗ Nouveautés ↗ Chemises, Tops & tee-shirt ↗ Tee-shirts ↗ Tops ↗ Robes ↗ Robes volantes ↗ Lewa ↗ Fatila ↗ Robes longues ↗ Ensembles ↗ Adiré ↗ Assiri ↗ Anéna ↗ Sawa set ↗ Caftans ↗ Caftans atypiques ↗ Caftans brodés ↗ Pantalons ↗ Maillots de bain ↗ Sur mesure ↗ La Maison ↗ Contact ↗ Coming Soon ↗ Plan du site ↗ Rubriques à venir Une seule page pour tout le Coming Soon. Les ancres permettent d’arriver directement à une rubrique sans multiplier les pages. Voir le Coming Soon ↗"},{"title":"Créations sur mesure","url":"sur-mesure.html","description":"Service sur mesure ATELIER KADJA — rendez-vous, commande et projets personnalisés via WhatsApp.","text":"Sur mesure Créations sur mesure Une création pensée pour vous, directement avec la maison. Votre projet Un échange direct avec Atelier Kadja Une demande personnalisée peut être traitée directement via WhatsApp. Motifs de contact : rendez-vous, commande, information ou projet sur mesure. WhatsApp officiel +225 07 59 01 38 32 Parler de mon projet Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"},{"title":"Tee-shirts","url":"tee-shirts.html","description":"Tee-shirts Atelier Kadja : 4 coloris en 100% coton, avec galerie dédiée par coloris.","text":"Chemises, Tops & tee-shirt Tee-shirts 4 coloris · 100% coton · coupe confortable. Chaque coloris garde ses vues recto/verso dans sa galerie. Chemises, Tops & tee-shirt Tee-shirts 4 coloris · 100% coton · coupe confortable. Chaque coloris garde ses vues recto/verso dans sa galerie. 2 photos T-Shirt · Rose Rose · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗ 2 photos T-Shirt · Blanc Blanc · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗ 2 photos T-Shirt · Bleu Bleu · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗ 2 photos T-Shirt · Noir Noir · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA 2 photos ↗ Commander ↗"},{"title":"Tops","url":"tops.html","description":"Top et pièces essentielles ATELIER KADJA.","text":"Chemises, Tops & tee-shirt Tops Le Top 01 est présenté ici dans sa propre rubrique. Les maillots de bain restent dans leur famille dédiée. Chemises, Tops & tee-shirt Top 01 Top 01 · pièce disponible dans le catalogue Commander ↗ Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ Tee-shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗"}];
  const highlight = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalizeSearch = value => value.toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const renderSearch = (wrap, query) => {
    const results = wrap.querySelector('[data-site-search-results]');
    const q=normalizeSearch(query.trim());
    if (!q) { results.hidden=true; results.innerHTML=''; return; }
    const terms=q.split(/\s+/).filter(Boolean);
    const found=SEARCH_INDEX.map(page=>{
      const hay=normalizeSearch(`${page.title} ${page.description} ${page.text}`);
      const score=terms.reduce((n,t)=>n+(hay.includes(t)?(normalizeSearch(page.title).includes(t)?4:1):0),0);
      return {...page,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
    results.innerHTML=found.length ? found.map(x=>`<a class="site-search-result" href="${x.url}"><strong>${highlight(x.title)}</strong><span>${highlight(x.description||'Voir la page')}</span><b>↗</b></a>`).join('') : '<div class="site-search-empty">Aucun résultat. Essayez un autre terme.</div>';
    results.hidden=false;
  };
  $$('[data-site-search-wrap]').forEach(wrap=>{
    const form=wrap.querySelector('[data-site-search-form]'), input=wrap.querySelector('[data-site-search-input]');
    form?.addEventListener('submit',e=>{e.preventDefault();renderSearch(wrap,input.value); if(input.value.trim()) input.focus();});
    input?.addEventListener('input',()=>renderSearch(wrap,input.value));
    document.addEventListener('click',e=>{ if(!wrap.contains(e.target)) { const r=wrap.querySelector('[data-site-search-results]'); if(r) r.hidden=true; }});
  });


  // ---------------------------------------------------------
  // PWA install prompt — Android/Chromium + iOS Safari guidance
  // ---------------------------------------------------------
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
  let deferredInstallPrompt = null;
  let installPromptShown = false;

  const createInstallBanner = ({ ios = false, fallback = false } = {}) => {
    if (!isMobile || isStandalone || document.querySelector('.app-install-banner')) return null;
    const banner = document.createElement('aside');
    banner.className = `app-install-banner${ios ? ' app-install-ios' : ''}`;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Installer Atelier Kadja');
    const helper = ios
      ? '<span>Dans Safari : touchez <strong>Partager</strong>, puis <strong>Sur l’écran d’accueil</strong>.</span>'
      : fallback
        ? '<span>Ajoutez Atelier Kadja à votre écran d’accueil depuis le menu du navigateur.</span>'
        : '<span>Accédez au catalogue depuis votre écran d’accueil.</span>';
    banner.innerHTML = `<div class="app-install-icon" aria-hidden="true">AK</div><div class="app-install-copy"><strong>Installer l’app Atelier Kadja</strong>${helper}</div><button type="button" class="app-install-button" data-install-app>${ios || fallback ? 'Comment faire' : 'Installer'}</button><button type="button" class="app-install-close" aria-label="Fermer">×</button>`;
    document.body.appendChild(banner);
    const close = () => {
      banner.classList.remove('is-visible');
      window.setTimeout(() => banner.remove(), 350);
      try { sessionStorage.setItem('kadja-install-dismissed', '1'); } catch (_) {}
    };
    banner.querySelector('.app-install-close')?.addEventListener('click', close);
    banner.querySelector('[data-install-app]')?.addEventListener('click', async () => {
      if (!ios && !fallback && deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        try { await deferredInstallPrompt.userChoice; } catch (_) {}
        deferredInstallPrompt = null;
        close();
        return;
      }
      if (ios) {
        banner.querySelector('.app-install-copy span').innerHTML = 'Dans Safari : touchez <strong>Partager</strong> <strong>▢↑</strong>, puis <strong>Sur l’écran d’accueil</strong>.';
      } else {
        banner.querySelector('.app-install-copy span').textContent = 'Ouvrez le menu ⋮ du navigateur, puis choisissez « Ajouter à l’écran d’accueil » ou « Installer l’application ». ';
      }
    });
    requestAnimationFrame(() => banner.classList.add('is-visible'));
    installPromptShown = true;
    return banner;
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!installPromptShown && !isStandalone && isMobile) {
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
    try { dismissed = sessionStorage.getItem('kadja-install-dismissed') === '1'; } catch (_) {}
    if (!dismissed) {
      window.setTimeout(() => {
        if (installPromptShown) return;
        if (isIOS) createInstallBanner({ ios: true });
        else if (!deferredInstallPrompt) createInstallBanner({ fallback: true });
      }, 1100);
    }
  }

  // ---------------------------------------------------------
  // Generic tiny entrance for anchors and focus states.
  // ---------------------------------------------------------
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
