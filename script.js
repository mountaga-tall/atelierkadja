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
  const reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
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
  // Infinite glass carousels, one independent rail per section
  // ---------------------------------------------------------
  const initInfiniteRail = (rail, index) => {
    if (!rail || rail.dataset.infiniteReady === 'true') return;
    const items = [...rail.children];
    if (items.length < 2) return;

    rail.dataset.infiniteReady = 'true';
    rail.classList.add('infinite-rail');
    rail.setAttribute('aria-label', rail.getAttribute('aria-label') || `Collection défilante ${index + 1}`);

    const shell = document.createElement('div');
    shell.className = 'infinite-shell';
    rail.parentNode.insertBefore(shell, rail);
    shell.appendChild(rail);

    const controls = document.createElement('div');
    controls.className = 'rail-controls';
    controls.innerHTML = `
      <button type="button" data-rail-prev aria-label="Collection précédente">←</button>
      <span class="rail-status"><b>AUTO</b> · GLASS RAIL</span>
      <button type="button" data-rail-next aria-label="Collection suivante">→</button>
    `;
    shell.appendChild(controls);

    const bar = document.createElement('div');
    bar.className = 'rail-scrollbar';
    bar.innerHTML = '<span></span>';
    shell.appendChild(bar);

    const note = document.createElement('span');
    note.className = 'rail-note';
    note.textContent = 'Défiler · pause au survol · glisser sur mobile';
    shell.appendChild(note);

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.dataset.carouselClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(control => { control.setAttribute('tabindex', '-1'); });
      fragment.appendChild(clone);
    });
    rail.appendChild(fragment);

    let paused = false;
    let dragging = false;
    let raf = null;
    let last = performance.now();
    let loopPoint = 0;
    let baseSpeed = rail.classList.contains('mosaic') ? 20 : 16;

    const measure = () => {
      const firstOriginal = rail.querySelector(':scope > :not([data-carousel-clone="true"])');
      const firstClone = rail.querySelector('[data-carousel-clone="true"]');
      if (!firstOriginal || !firstClone) return;
      // The first clone starts exactly one complete original set later.
      loopPoint = firstClone.offsetLeft - firstOriginal.offsetLeft;
      if (loopPoint < 1) return;
      const available = rail.clientWidth;
      baseSpeed = Math.max(10, Math.min(26, 8 + available / 130));
    };

    const wrap = () => {
      if (loopPoint > 0 && rail.scrollLeft >= loopPoint) rail.scrollLeft -= loopPoint;
      else if (loopPoint > 0 && rail.scrollLeft < 0) rail.scrollLeft += loopPoint;
    };

    const tick = now => {
      const dt = Math.min(48, now - last);
      last = now;
      if (!paused && !dragging && !document.hidden && !reduceMotion) {
        rail.scrollLeft += baseSpeed * (dt / 1000);
        wrap();
      }
      const max = Math.max(1, rail.scrollWidth - rail.clientWidth);
      const ratio = loopPoint > 0 ? (rail.scrollLeft % loopPoint) / loopPoint : rail.scrollLeft / max;
      const barSpan = bar.querySelector('span');
      if (barSpan) barSpan.style.transform = `translateX(${Math.min(340, ratio * 340)}%)`;
      raf = requestAnimationFrame(tick);
    };

    const setPaused = value => {
      paused = value;
      shell.classList.toggle('is-paused', value);
    };

    rail.addEventListener('mouseenter', () => setPaused(true));
    rail.addEventListener('mouseleave', () => setPaused(false));
    rail.addEventListener('focusin', () => setPaused(true));
    rail.addEventListener('focusout', () => setPaused(false));
    window.addEventListener('resize', measure, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) paused = true; else paused = false; });

    let startX = 0;
    let startScroll = 0;
    rail.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      paused = true;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add('is-interacting');
      rail.setPointerCapture?.(event.pointerId);
    });
    rail.addEventListener('pointermove', event => {
      if (!dragging) return;
      rail.scrollLeft = startScroll - (event.clientX - startX);
      wrap();
    });
    const stopDrag = () => {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove('is-interacting');
      setPaused(false);
    };
    rail.addEventListener('pointerup', stopDrag);
    rail.addEventListener('pointercancel', stopDrag);

    controls.querySelector('[data-rail-prev]')?.addEventListener('click', () => {
      setPaused(true);
      rail.scrollBy({ left: -Math.min(520, rail.clientWidth * .78), behavior: reduceMotion ? 'auto' : 'smooth' });
      window.setTimeout(() => setPaused(false), 900);
    });
    controls.querySelector('[data-rail-next]')?.addEventListener('click', () => {
      setPaused(true);
      rail.scrollBy({ left: Math.min(520, rail.clientWidth * .78), behavior: reduceMotion ? 'auto' : 'smooth' });
      window.setTimeout(() => setPaused(false), 900);
    });

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener('beforeunload', () => { if (raf) cancelAnimationFrame(raf); }, { once: true });
  };

  $$('.product-grid, .subcategory-grid, .mosaic').forEach((rail, index) => {
    initInfiniteRail(rail, index);
  });

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
