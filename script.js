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
  const reduceMotion = false;
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
  // Product galleries — each product owns its own gallery.
  // Visible slots adapt to the real number of photos (2, 3, 4...).
  // Photos rotate automatically, pause on hover/focus, and never enter
  // a blank cloned zone. Clicking any photo opens the real full gallery.
  // ---------------------------------------------------------
  const initProductPhotoCarousel = viewport => {
    if (!viewport || viewport.dataset.photoCarouselReady === 'true') return;
    const images = [...viewport.children].filter(el => el.tagName === 'IMG');
    const total = images.length;
    viewport.dataset.photoCarouselReady = 'true';
    viewport.style.setProperty('--photo-count', Math.max(1, total));
    if (total <= 1) {
      if (images[0]) images[0].style.display = 'block';
      return;
    }

    viewport.classList.add('photo-carousel');
    const track = document.createElement('div');
    track.className = 'photo-carousel-track';
    images.forEach((img, i) => {
      const slide = document.createElement('button');
      slide.type = 'button';
      slide.className = 'photo-carousel-slide';
      slide.dataset.galleryIndex = String(i);
      slide.setAttribute('aria-label', `Voir la photo ${i + 1} sur ${total}`);
      slide.appendChild(img);
      track.appendChild(slide);
    });
    viewport.replaceChildren(track);

    const dots = document.createElement('div');
    dots.className = 'photo-carousel-dots';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'photo-dot' + (i === 0 ? ' is-active' : '');
      dots.appendChild(dot);
    }
    viewport.appendChild(dots);

    let paused = false;
    let timer = null;
    let current = 0;
    let touchStartX = null;

    const updateDots = () => {
      dots.querySelectorAll('.photo-dot').forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    };
    const rotate = direction => {
      if (paused) return;
      if (direction > 0) track.appendChild(track.firstElementChild);
      else track.insertBefore(track.lastElementChild, track.firstElementChild);
      current = (current + direction + total) % total;
      updateDots();
    };
    const schedule = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => rotate(1), 2800);
    };
    const setPaused = value => { paused = value; viewport.classList.toggle('is-paused', value); };

    viewport.addEventListener('mouseenter', () => setPaused(true));
    viewport.addEventListener('mouseleave', () => setPaused(false));
    viewport.addEventListener('focusin', () => setPaused(true));
    viewport.addEventListener('focusout', event => {
      if (!viewport.contains(event.relatedTarget)) setPaused(false);
    });
    viewport.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0]?.clientX ?? null; setPaused(true); }, { passive: true });
    viewport.addEventListener('touchend', e => {
      const endX = e.changedTouches[0]?.clientX ?? null;
      if (touchStartX !== null && endX !== null && Math.abs(endX - touchStartX) > 35) {
        setPaused(false);
        rotate(endX < touchStartX ? 1 : -1);
      } else {
        setPaused(false);
      }
      touchStartX = null;
    }, { passive: true });
    schedule();
  };

  $$('.product-views').forEach(initProductPhotoCarousel);

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
  const openLightbox = (images, index) => {
    createLightbox();
    lightboxItems = images.map(img => ({ src: img.currentSrc || img.src, alt: img.alt }));
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
  $$('.product-views img, .product-media img, .subcategory-media img, .mosaic-card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', event => {
      event.preventDefault();
      const container = img.closest('.product-views, .product-media, .subcategory-media, .mosaic-card');
      const images = container ? $$('img', container).filter(el => el.src) : [img];
      openLightbox(images, Math.max(0, images.indexOf(img)));
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
  const SEARCH_INDEX = [{"title":"Adiré","url":"adire.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Adiré Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Adiré ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Nouveautés · Adiré Adiré 10 looks · 20 photos · ensembles pantalon + chemise manches longues en adiré coton. 35 000 FCFA Chaque ensemble · Adiré coton · pantalon + chemise manches longues Adiré 01 Rouge Noir Beige · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA Commander ↗ Adiré 02 Bleu Noir Rose · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA Commander ↗ Adiré 03 Brique Noir Vert · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA Commander ↗ Adiré 04 Fuchsia Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 05 Rouge Noir Orange · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 06 Vert Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 07 Jaune Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 08 Bordeaux Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA Commander ↗ Adiré 09 Violet Noir Bleu · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA Commander ↗ Adiré 10 Marron Noir Orange · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA Commander ↗ Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Anéna","url":"anena.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Anéna Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Anéna ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Ensemble pantalon × top crop manches courtes Anéna Collection Beige × Bordeaux × Vert · bandes asoké aux poches · 35 000 FCFA Ensemble pantalon × top crop manches courtes · bandes asoké aux poches · 35 000 FCFA. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Assiri","url":"assiri.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Assiri Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Assiri ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Ensemble pantalon × top manches longues Assiri Collection Rouge orangé × Rose · Dempé · 25 000 FCFA Ensemble pantalon × top manches longues · Dempé · 25 000 FCFA. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Caftans atypiques","url":"caftans-atypiques.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Caftans atypiques Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Caftans atypiques ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ 4 modèles · sur demande Caftans atypiques Collection Caftan Typique 01 Sur demande · informations matière/couleur/composition non renseignées. Collection Caftan Typique 02 Sur demande · informations matière/couleur/composition non renseignées. Collection Caftan Typique 03 Sur demande · informations matière/couleur/composition non renseignées. Collection Caftan Typique 04 Sur demande · informations matière/couleur/composition non renseignées. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Caftans brodés","url":"caftans-brodes.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Caftans brodés Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Caftans brodés ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ 5 modèles · sur demande Caftans brodés Collection Caftan Brodé 01 Sur demande · informations matière/couleur/composition non renseignées. Collection Caftan Brodé 02 Sur demande · informations matière/couleur/composition non renseignées. Collection Caftan Brodé 03 Sur demande · informations matière/couleur/composition non renseignées. Collection Caftan Brodé 04 Sur demande · informations matière/couleur/composition non renseignées. Collection Caftan Brodé 05 Sur demande · informations matière/couleur/composition non renseignées. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Caftans","url":"caftans.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Caftans Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Caftans ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Une collection dédiée aux caftans Caftans Deux univers : Caftans typiques et Caftans brodés. Prix sur demande. Caftan Typique 01 Sur demande · 3 vue(s) Sur demande Commander ↗ Caftan Typique 02 Sur demande · 3 vue(s) Sur demande Commander ↗ Caftan Typique 03 Sur demande · 2 vue(s) Sur demande Commander ↗ Caftan Typique 04 Sur demande · 2 vue(s) Sur demande Commander ↗ Caftan Brodé 01 Sur demande · 2 vue(s) Sur demande Commander ↗ Caftan Brodé 02 Sur demande · 2 vue(s) Sur demande Commander ↗ Caftan Brodé 03 Sur demande · 2 vue(s) Sur demande Commander ↗ Caftan Brodé 04 Sur demande · 2 vue(s) Sur demande Commander ↗ Caftan Brodé 05 Sur demande · 1 vue(s) Sur demande Commander ↗ Les matières, compositions et couleurs des caftans ne sont pas renseignées dans les informations fournies. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Chemises, Tops & Détails","url":"chemises-tee-shirts-tops.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Chemises, Tops & Détails Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Chemises, Tops & Détails ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Famille mode Chemises, Tops & Détails Collection Tee-shirts · 4 couleurs · 2 vues Ligne disponible dans le catalogue. Collection Tops · 1 pièce en galerie Ligne disponible dans le catalogue. Catalogue COMING SOON À venir Chemises Aucun visuel actuellement disponible. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"COMING SOON | ATELIER KADJA","url":"coming-soon.html","description":"Cette rubrique Atelier Kadja arrive bientôt.","text":"COMING SOON | ATELIER KADJA Cette rubrique Atelier Kadja arrive bientôt. COMING SOON | ATELIER KADJA ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ ATELIER KADJA COMING SOON Rubrique en préparation COMING SOON Cette sélection arrive prochainement. Les collections déjà disponibles restent accessibles depuis le menu Collections. Retour aux collections Contacter la maison ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital"},{"title":"Contact","url":"contact.html","description":"Coordonnées officielles et contact de la Maison de Mode Ivoirienne ATELIER KADJA.","text":"ATELIER KADJA | Contact Coordonnées officielles et contact de la Maison de Mode Ivoirienne ATELIER KADJA. ATELIER KADJA | Contact ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Rendez-vous · commande · information Parlons de votre prochaine silhouette. Un échange direct avec Atelier Kadja pour une commande, une question, un rendez-vous ou une création sur mesure. Atelier Kadja Votre demande, directement sur WhatsApp. Remplissez le formulaire. À l’envoi, WhatsApp s’ouvre avec un message prérempli contenant vos informations et votre demande. WhatsApp +225 07 59 01 38 32 ↗ E-mail latelierkadja@outlook.fr ↗ Adresse Cocody Angré 8e Tranche — Abidjan Formulaire de contact Décrivez votre demande. Nom complet Téléphone Objet Choisir un motif Commande Informations produit Rendez-vous Projet sur mesure Autre demande Votre message Envoyer sur WhatsApp ↗ L’envoi prépare automatiquement votre message dans WhatsApp. Aucune donnée n’est stockée sur ce site. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ Nous trouver Cocody Angré 8e Tranche Abidjan · Côte d’Ivoire Ouvrir dans Maps ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Ensembles","url":"ensembles.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Ensembles Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Ensembles ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Ensembles pantalons Ensembles Adiré · Assiri · Anéna · Sawa. Les détails commerciaux sont affichés lorsqu’ils sont renseignés. Adiré · Adiré 01 Rouge Noir Beige · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 02 Bleu Noir Rose · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 03 Brique Noir Vert · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 04 Fuchsia Noir Jaune · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 05 Rouge Noir Orange · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 06 Vert Noir Jaune · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 07 Jaune Noir Blanc · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 08 Bordeaux Noir Blanc · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 09 Violet Noir Bleu · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Adiré · Adiré 10 Marron Noir Orange · pantalon + chemise manches longues · adiré coton 35 000 FCFA Commander ↗ Ensemble Assiri Rouge orangé × Rose · ensemble pantalon × top manches longues · Dempé · 2 vues 25 000 FCFA Commander ↗ Ensemble Anéna Beige × Bordeaux × Vert · ensemble pantalon × top crop manches courtes · bandes asoké aux poches 35 000 FCFA Commander ↗ Sawa set Galerie Sawa · informations commerciales non renseignées Commander ↗ La documentation fournie détaille commercialement les 10 Adiré, Assiri et Anéna. Les informations prix/matière du Sawa set ne sont pas renseignées dans cette source. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Fatila","url":"fatila.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Fatila Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Fatila ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Robe à dos nu · Dempé batik Fatila Collection 20 000 FCFA · 2 vues Robe à dos nu · Dempé batik · 20 000 FCFA. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Catalogue","url":"index.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Catalogue Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Catalogue ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ ▶ 🔇 Maison de Mode Ivoirienne L'élégance contemporaine imaginée à Abidjan. Un vestiaire raffiné où les matières, les coupes et les détails rencontrent une signature ivoirienne et une allure contemporaine. Voir le catalogue Créer sur mesure La maison Une mode pensée comme une œuvre. Atelier Kadja est une Maison de Mode Ivoirienne basée à Abidjan. Chaque silhouette recherche un équilibre entre identité, simplicité et présence . La promesse de la maison : des silhouettes où l’identité ivoirienne rencontre une allure moderne. Découvrir l'univers de la maison ↗ Catalogue Collections disponibles Retrouvez ici uniquement les univers qui disposent déjà de contenus à découvrir. Collection Caftans 9 modèles · prix sur demande Collection Chemises, Tops & Détails Tee-shirts · tops · chemises à venir Collection Ensembles Adiré · Assiri · Anéna · Sawa Collection Maillots de bain 3 pièces présentées en galerie À découvrir Nouveautés Adiré · 10 looks · 20 photos Collection Robes Robes volantes · robes longues · autres pièces À venir Coming soon Les rubriques ci-dessous sont volontairement regroupées à la fin du catalogue pour laisser les collections disponibles au premier plan. Catalogue COMING SOON À venir Combinaisons Rubrique en préparation Service COMING SOON À venir Créations sur mesure Présentation détaillée à venir Catalogue COMING SOON À venir Maroquinerie Rubrique en préparation Catalogue COMING SOON À venir Survêtements Rubrique en préparation Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ Sur mesure Une création pensée pour vous. Rendez-vous, commande, information ou projet sur mesure : les demandes sont traitées directement via WhatsApp. WhatsApp officiel +225 07 59 01 38 32 Écrire sur WhatsApp ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"La Maison","url":"la-maison.html","description":"Identité, vision et univers de la Maison de Mode Ivoirienne ATELIER KADJA.","text":"ATELIER KADJA | La Maison Identité, vision et univers de la Maison de Mode Ivoirienne ATELIER KADJA. ATELIER KADJA | La Maison ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Identité & vision La Maison Une signature ivoirienne associée à une allure contemporaine. Identité ATELIER KADJA Positionnement : Maison de Mode Ivoirienne Localisation : Abidjan, Côte d'Ivoire Signature : « L'élégance contemporaine imaginée à Abidjan. » Promesse Un vestiaire raffiné Des silhouettes où l’identité ivoirienne rencontre une allure moderne, avec une attention particulière portée aux matières, aux coupes et aux détails. Vision Une mode pensée comme une œuvre. Pour chaque silhouette, la maison recherche un équilibre entre identité , simplicité et présence . Univers Les signatures de la maison Adiré T-Shirts Robes Ensembles Caftans Pièces essentielles Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Lewa","url":"lewa.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Lewa Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Lewa ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Robes volantes Lewa Collection Marron · 25 000 FCFA Robe volante · 25 000 FCFA. Collection Rouge Orange · 25 000 FCFA Robe volante · 25 000 FCFA. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Maillots de bain","url":"maillots-de-bain.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Maillots de bain Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Maillots de bain ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Maillots de bain Maillots de bain Une sélection dédiée aux maillots de bain Atelier Kadja. Maillot 01 Galerie · aucune information commerciale renseignée Commander ↗ Maillot 02 Galerie · aucune information commerciale renseignée Commander ↗ Maillot 03 Galerie · aucune information commerciale renseignée Commander ↗ Aucun prix, couleur, matière ou composition n’est indiqué pour ces trois pièces dans les informations fournies. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Nouveautés — Adiré","url":"nouveautes.html","description":"Nouveautés ATELIER KADJA — collection Adiré, 10 looks et 20 photos.","text":"ATELIER KADJA | Nouveautés — Adiré Nouveautés ATELIER KADJA — collection Adiré, 10 looks et 20 photos. ATELIER KADJA | Nouveautés — Adiré ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Nouveautés · Adiré Nouveautés · Adiré 10 looks · 20 photos · ensembles pantalon + chemise manches longues en adiré coton. 35 000 FCFA Chaque ensemble · Adiré coton · pantalon + chemise manches longues Adiré 01 Rouge Noir Beige · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA Commander ↗ Adiré 02 Bleu Noir Rose · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA Commander ↗ Adiré 03 Brique Noir Vert · Pantalon + chemise manches longues · Adiré coton · 3 vue(s) 35 000 FCFA Commander ↗ Adiré 04 Fuchsia Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 05 Rouge Noir Orange · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 06 Vert Noir Jaune · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 07 Jaune Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 2 vue(s) 35 000 FCFA Commander ↗ Adiré 08 Bordeaux Noir Blanc · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA Commander ↗ Adiré 09 Violet Noir Bleu · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA Commander ↗ Adiré 10 Marron Noir Orange · Pantalon + chemise manches longues · Adiré coton · 1 vue(s) 35 000 FCFA Commander ↗ Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Pantalons","url":"pantalons.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Pantalons Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Pantalons ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Adiré · Assiri · Anéna · Sawa Pantalons Collection Adiré Voir les ensembles pantalons. Collection Assiri Voir les ensembles pantalons. Collection Anéna Voir les ensembles pantalons. Collection Sawa set Voir les ensembles pantalons. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Robes Volantes","url":"robes-volantes.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Robes Volantes Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Robes Volantes ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Robes volantes · Lewa et Fatila Robes Volantes Collection Lewa Marron · 25 000 FCFA Fiche disponible dans la rubrique Robes. Collection Lewa Rouge Orange · 25 000 FCFA Fiche disponible dans la rubrique Robes. Collection Fatila · 20 000 FCFA Fiche disponible dans la rubrique Robes. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Robes","url":"robes.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Robes Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Robes ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Robes volantes & robes longues Robes Une lecture plus ample de la féminité Atelier Kadja, des pièces légères aux silhouettes longues. Robe Lewa · Marron Marron · imprimé indigo · 100% coton & crêpe simple 25 000 FCFA Commander ↗ Robe Lewa · Rouge Orange Rouge Orange · imprimé indigo & crêpe simple · 2 vues 25 000 FCFA Commander ↗ Robe Fatila Robe à dos nu · Dempé batik · 2 vues 20 000 FCFA Commander ↗ Robe 01 Galerie · informations commerciales non renseignées Commander ↗ Robe longue 01 Galerie · informations commerciales non renseignées Commander ↗ Robe longue 02 Galerie · informations commerciales non renseignées Commander ↗ Robe longue 03 Galerie · informations commerciales non renseignées Commander ↗ Robe longue 04 Galerie · informations commerciales non renseignées Commander ↗ Robe longue 05 Galerie · informations commerciales non renseignées Commander ↗ Robe longue 06 Galerie · informations commerciales non renseignées Commander ↗ Robe longue 07 Galerie · informations commerciales non renseignées Commander ↗ Robe volante · galerie Pièce présente dans la galerie · informations commerciales non renseignées Commander ↗ Les fiches commerciales détaillées sont disponibles uniquement pour Lewa Marron, Lewa Rouge Orange et Fatila dans les informations fournies. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Sawa set","url":"sawa-set.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | Sawa set Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | Sawa set ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Galerie de pièces disponibles Sawa set Collection 4 vues · informations commerciales non renseignées Galerie Sawa · informations commerciales non renseignées. Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Créations sur mesure","url":"sur-mesure.html","description":"Service sur mesure ATELIER KADJA — rendez-vous, commande et projets personnalisés via WhatsApp.","text":"ATELIER KADJA | Créations sur mesure Service sur mesure ATELIER KADJA — rendez-vous, commande et projets personnalisés via WhatsApp. ATELIER KADJA | Créations sur mesure ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Sur mesure Créations sur mesure Une création pensée pour vous, directement avec la maison. Votre projet Un échange direct avec Atelier Kadja Une demande personnalisée peut être traitée directement via WhatsApp. Motifs de contact : rendez-vous, commande, information ou projet sur mesure. WhatsApp officiel +225 07 59 01 38 32 Parler de mon projet Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"T-Shirts","url":"tee-shirts.html","description":"Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne.","text":"ATELIER KADJA | T-Shirts Catalogue digital ATELIER KADJA — Maison de Mode Ivoirienne. ATELIER KADJA | T-Shirts ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Ligne essentielle T-Shirts 100% coton · confort · simplicité · identité Atelier Kadja. T-Shirt · Rose Rose · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA Commander ↗ T-Shirt · Blanc Blanc · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA Commander ↗ T-Shirt · Bleu Bleu · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA Commander ↗ T-Shirt · Noir Noir · 100% coton · coupe confortable · 2 vues · recto + verso 25 000 FCFA Commander ↗ Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Top","url":"tops.html","description":"Top et pièces essentielles ATELIER KADJA.","text":"ATELIER KADJA | Top Top et pièces essentielles ATELIER KADJA. ATELIER KADJA | Top ATELIER KADJA Accueil Nouveautés Collections + Chemises, Tops & Détails Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements La Maison Sur mesure Contact Commander ↗ Chemises, Tops & Détails Tops Le Top 01 est présenté ici dans sa propre rubrique. Les maillots de bain restent dans leur famille dédiée. Chemises, Tops & Détails Top 01 Top 01 · pièce disponible dans le catalogue Commander ↗ Explorer la maison Continuez votre découverte. Chaque lien ouvre un univers, une collection ou un service Atelier Kadja. Nouveautés ↗ Ensembles ↗ Robes ↗ Caftans ↗ T-Shirts ↗ Sur mesure ↗ La Maison ↗ Contact ↗ ATELIER KADJA Maison de Mode Ivoirienne · Abidjan L'élégance contemporaine imaginée à Abidjan. W +225 07 59 01 38 32 Explorer Accueil Nouveautés La Maison Sur mesure Contact Collections Adiré T-Shirts Chemises Tops Robes Robes volantes Robes longues Robes midi Robes courtes Ensembles Assiri Anéna Sawa set Caftans Caftans atypiques Caftans brodés Caftans simples Maillots de bain Maroquinerie Sacs Ceintures Portefeuilles Petite maroquinerie Accessoires Jupes Pantalons Blazers Combinaisons Survêtements Suivre la maison latelierkadja@outlook.fr ↗ © ATELIER KADJA Cocody Angré 8e Tranche — Abidjan Catalogue digital WhatsApp"},{"title":"Plan du site | ATELIER KADJA","url":"sitemap.html","description":"Plan du site Atelier Kadja — toutes les pages du catalogue et de la maison.","text":"Plan du site Atelier Kadja toutes les pages catalogue maison navigation"}];
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
