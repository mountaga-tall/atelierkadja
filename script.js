/* ==========================================================================
   ATELIER KADJA - SCRIPT PRINCIPAL
   ========================================================================== */

(() => {
  'use strict';

  const hideLoader = () => {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    loader.classList.add('hidden');
    window.setTimeout(() => {
      if (loader.parentNode) {
        loader.setAttribute('aria-hidden', 'true');
      }
    }, 800);
  };

  const initLoader = () => {
    window.setTimeout(hideLoader, 3000);
    if (document.readyState === 'complete') {
      window.setTimeout(hideLoader, 350);
    } else {
      window.addEventListener('load', () => {
        window.setTimeout(hideLoader, 350);
      }, { once: true });
      window.setTimeout(hideLoader, 700);
    }
  };

  const initHero = () => {
    const hero = document.querySelector('.hero');
    const video = document.querySelector('.hero-video');
    const soundBtn = document.querySelector('.sound-toggle');

    if (!hero) return;

    if (video) {
      const markVideoAsFailed = () => {
        hero.classList.add('video-failed');
      };

      video.addEventListener('error', markVideoAsFailed);
      video.addEventListener('stalled', () => {
        if (video.readyState === 0) markVideoAsFailed();
      });

      window.setTimeout(() => {
        if (video.readyState < 2) markVideoAsFailed();
      }, 5000);

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
      soundBtn.setAttribute('aria-label', muted ? 'Activer le son' : 'Désactiver le son');
      soundBtn.setAttribute('aria-pressed', String(!muted));
    };

    video.muted = true;
    updateSoundUi();

    soundBtn.addEventListener('click', async () => {
      try {
        video.muted = !video.muted;
        if (!video.muted) await video.play();
      } catch (error) {
        video.muted = true;
        console.warn('Impossible d’activer le son de la vidéo.', error);
      } finally {
        updateSoundUi();
      }
    });

    video.play().catch(() => {});
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

  const initAssiriCarousel = () => {
    const carousel = document.querySelector('.assiri-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.assiri-slide');
    const prevBtn = carousel.querySelector('.assiri-prev');
    const nextBtn = carousel.querySelector('.assiri-next');
    const counter = carousel.querySelector('.assiri-carousel-counter');
    let currentIndex = 0;

    const updateSlide = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlide(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide(currentIndex);
      });
    }
  };

  const initReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

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
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }, { once: true });
  };

  const init = () => {
    initLoader();
    initHero();
    initProductSliders();
    initReveal();
    initSmoothNavigation();
    initServiceWorker();
    initAssiriCarousel();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
