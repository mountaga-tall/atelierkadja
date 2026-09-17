/* ==========================================================================
   ATELIER KADJA - SCRIPT PRINCIPAL
   Version corrigée : loader, hero vidéo, son, sliders, reveal et PWA
   ========================================================================== */

(() => {
  'use strict';

  const hideLoader = () => {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    loader.classList.add('hidden');

    // Nettoyage après la transition CSS.
    window.setTimeout(() => {
      if (loader.parentNode) {
        loader.setAttribute('aria-hidden', 'true');
      }
    }, 800);
  };

  const initLoader = () => {
    // Ne jamais laisser l'écran de chargement bloquer le site.
    window.setTimeout(hideLoader, 3000);

    if (document.readyState === 'complete') {
      window.setTimeout(hideLoader, 350);
    } else {
      window.addEventListener('load', () => {
        window.setTimeout(hideLoader, 350);
      }, { once: true });

      // Le DOM est déjà utilisable : le contenu peut apparaître sans
      // attendre toutes les images externes.
      window.setTimeout(hideLoader, 700);
    }
  };

  const initHero = () => {
    const hero = document.querySelector('.hero');
    const video = document.querySelector('.hero-video');
    const soundBtn = document.querySelector('.sound-toggle');

    if (!hero) return;

    // Fallback visuel si la vidéo est absente, illisible ou vide.
    if (video) {
      const markVideoAsFailed = () => {
        hero.classList.add('video-failed');
      };

      video.addEventListener('error', markVideoAsFailed);
      video.addEventListener('stalled', () => {
        // On laisse une vidéo déjà en lecture continuer.
        if (video.readyState === 0) {
          markVideoAsFailed();
        }
      });

      // Si aucune donnée n'arrive après quelques secondes, le fallback
      // (images/herot1.png) reste visible.
      window.setTimeout(() => {
        if (video.readyState < 2) {
          markVideoAsFailed();
        }
      }, 5000);

      // Après récupération des données, on retire l'état d'échec.
      video.addEventListener('loadeddata', () => {
        hero.classList.remove('video-failed');
      });
    }

    if (!video || !soundBtn) return;

    const icon = soundBtn.querySelector('i');

    const updateSoundUi = () => {
      const muted = video.muted;

      if (icon) {
        icon.className = muted
          ? 'fa-solid fa-volume-xmark'
          : 'fa-solid fa-volume-high';
      }

      soundBtn.setAttribute(
        'aria-label',
        muted ? 'Activer le son' : 'Désactiver le son'
      );
      soundBtn.setAttribute('aria-pressed', String(!muted));
    };

    // Autoplay avec son est bloqué par les navigateurs : on démarre muet
    // puis le bouton permet d'activer le son après interaction.
    video.muted = true;
    updateSoundUi();

    soundBtn.addEventListener('click', async () => {
      try {
        video.muted = !video.muted;
        if (!video.muted) {
          await video.play();
        }
      } catch (error) {
        // Si le navigateur refuse le son, on revient à l'état muet.
        video.muted = true;
        console.warn('Impossible d’activer le son de la vidéo.', error);
      } finally {
        updateSoundUi();
      }
    });

    // Certains navigateurs suspendent l'autoplay après chargement.
    video.play().catch(() => {
      // Le poster/fallback reste affiché : aucune erreur bloquante.
    });
  };

  const initProductSliders = () => {
    const productSliders = document.querySelectorAll('.tshirt-slider');

    productSliders.forEach((slider) => {
      const slides = slider.querySelectorAll('.tshirt-slide');

      if (slides.length <= 1) return;

      let currentIndex = 0;
      let isAnimating = false;

      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === 0);
      });

      const showSlide = (newIndex) => {
        if (isAnimating || newIndex === currentIndex) return;

        isAnimating = true;
        slides[currentIndex].classList.remove('active');
        slides[newIndex].classList.add('active');
        currentIndex = newIndex;

        window.setTimeout(() => {
          isAnimating = false;
        }, 500);
      };

      const nextSlide = () => {
        showSlide((currentIndex + 1) % slides.length);
      };

      slider.addEventListener('mouseenter', nextSlide);
      slider.addEventListener('click', (event) => {
        event.preventDefault();
        nextSlide();
      });

      let touchStartX = 0;
      let touchEndX = 0;

      slider.addEventListener('touchstart', (event) => {
        if (event.changedTouches.length) {
          touchStartX = event.changedTouches[0].screenX;
        }
      }, { passive: true });

      slider.addEventListener('touchend', (event) => {
        if (!event.changedTouches.length) return;

        touchEndX = event.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) < 40) {
          nextSlide();
          return;
        }

        if (swipeDistance < 0) {
          nextSlide();
        } else {
          showSlide((currentIndex - 1 + slides.length) % slides.length);
        }
      }, { passive: true });
    });
  };

  const initReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    // Affichage immédiat des éléments déjà visibles.
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const revealPoint = 100;

      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('resize', revealOnScroll, { passive: true });
    revealOnScroll();
  };

  const initSmoothNavigation = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  };

  const initServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré :', registration.scope);
        })
        .catch((error) => {
          // Un SW absent ne doit jamais empêcher le site de fonctionner.
          console.warn('Service Worker non disponible :', error);
        });
    }, { once: true });
  };

  const init = () => {
    initLoader();
    initHero();
    initProductSliders();
    initReveal();
    initSmoothNavigation();
    initServiceWorker();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
