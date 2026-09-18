/* ==========================================================================
   ATELIER KADJA — SCRIPT PRINCIPAL PREMIUM
   ========================================================================== */

(() => {
    "use strict";

    /* ======================================================================
       CONFIG
    ====================================================================== */

    const CONFIG = {
        loaderDuration: 850,
        revealThreshold: 0.14,
        galleryTransition: 560,
        magneticStrength: 0.18,
        parallaxStrength: 0.045
    };

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ======================================================================
       HELPERS
    ====================================================================== */

    const qs = (selector, parent = document) =>
        parent.querySelector(selector);

    const qsa = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    /* ======================================================================
       BODY LOADED
    ====================================================================== */

    const markBodyLoaded = () => {
        window.setTimeout(() => {
            document.body.classList.add("loaded");
        }, 100);
    };

    /* ======================================================================
       LOADER
    ====================================================================== */

    const initLoader = () => {
        const loader = qs(".loader");

        if (!loader) {
            markBodyLoaded();
            return;
        }

        const hideLoader = () => {
            loader.classList.add("hidden");
            document.body.classList.add("loader-complete");
            markBodyLoaded();

            window.setTimeout(() => {
                loader.setAttribute("aria-hidden", "true");
            }, 1000);
        };

        const start = performance.now();

        const finish = () => {
            const elapsed = performance.now() - start;
            const remaining = Math.max(
                0,
                CONFIG.loaderDuration - elapsed
            );

            window.setTimeout(hideLoader, remaining);
        };

        if (document.readyState === "complete") {
            finish();
        } else {
            window.addEventListener("load", finish, {
                once: true
            });

            window.setTimeout(finish, 1600);
        }
    };

    /* ======================================================================
       HEADER
    ====================================================================== */

    const initHeader = () => {
        const header = qs(".site-header");

        if (!header) return;

        const updateHeader = () => {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 45
            );
        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            {
                passive: true
            }
        );
    };

    /* ======================================================================
       MOBILE MENU
    ====================================================================== */

    const initMobileMenu = () => {
        const header = qs(".site-header");
        const toggle = qs(".menu-toggle");
        const menu = qs("#mobile-navigation");

        if (!header || !toggle || !menu) return;

        const mobileLinks = qsa(
            "#mobile-navigation a"
        );

        const openMenu = () => {
            header.classList.add("menu-is-open");
            menu.classList.add("open");
            document.body.classList.add("menu-open");

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );

            toggle.setAttribute(
                "aria-label",
                "Fermer le menu"
            );

            menu.setAttribute(
                "aria-hidden",
                "false"
            );
        };

        const closeMenu = () => {
            header.classList.remove("menu-is-open");
            menu.classList.remove("open");
            document.body.classList.remove("menu-open");

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            toggle.setAttribute(
                "aria-label",
                "Ouvrir le menu"
            );

            menu.setAttribute(
                "aria-hidden",
                "true"
            );
        };

        toggle.addEventListener(
            "click",
            () => {
                const isOpen =
                    toggle.getAttribute("aria-expanded") ===
                    "true";

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }
        );

        mobileLinks.forEach((link) => {
            link.addEventListener(
                "click",
                () => {
                    closeMenu();
                }
            );
        });

        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Escape") {
                    closeMenu();
                }
            }
        );
    };

    /* ======================================================================
       SMOOTH NAVIGATION
    ====================================================================== */

    const initSmoothNavigation = () => {
        const links = qsa(
            'a[href^="#"]'
        );

        links.forEach((link) => {
            link.addEventListener(
                "click",
                (event) => {
                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        qs(targetId);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    const header =
                        qs(".site-header");

                    const offset =
                        header
                            ? header.offsetHeight
                            : 0;

                    const top =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        offset;

                    window.scrollTo({
                        top: Math.max(top, 0),
                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth"
                    });
                }
            );
        });
    };

    /* ======================================================================
       ACTIVE NAVIGATION
    ====================================================================== */

    const initActiveNavigation = () => {
        const sections = qsa(
            "main section[id]"
        );

        const navLinks = qsa(
            "[data-nav-link]"
        );

        if (
            !sections.length ||
            !navLinks.length
        ) {
            return;
        }

        const linkMap = new Map();

        navLinks.forEach((link) => {
            const id =
                link.getAttribute("href");

            if (id) {
                linkMap.set(id.slice(1), link);
            }
        });

        const observer =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        navLinks.forEach((link) => {
                            link.classList.remove(
                                "active"
                            );
                        });

                        const active =
                            linkMap.get(
                                entry.target.id
                            );

                        if (active) {
                            active.classList.add(
                                "active"
                            );
                        }
                    });
                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px",
                    threshold: 0
                }
            );

        sections.forEach((section) => {
            observer.observe(section);
        });
    };

    /* ======================================================================
       HERO VIDEO
    ====================================================================== */

    const initHeroVideo = () => {
        const hero = qs(".hero");
        const video = qs(".hero-video");
        const soundButton =
            qs(".sound-toggle");

        if (!hero) return;

        if (!video) {
            hero.classList.add(
                "video-failed"
            );
            return;
        }

        const markFailed = () => {
            hero.classList.add(
                "video-failed"
            );
        };

        const markReady = () => {
            hero.classList.remove(
                "video-failed"
            );
        };

        video.addEventListener(
            "error",
            markFailed
        );

        video.addEventListener(
            "loadeddata",
            markReady
        );

        video.addEventListener(
            "canplay",
            markReady
        );

        window.setTimeout(() => {
            if (
                video.readyState <
                HTMLMediaElement.HAVE_CURRENT_DATA
            ) {
                markFailed();
            }
        }, 6000);

        video.muted = true;

        if (soundButton) {
            const icon =
                qs("i", soundButton);

            const updateSoundUI = () => {
                const muted =
                    video.muted;

                if (icon) {
                    icon.className =
                        muted
                            ? "fa-solid fa-volume-xmark"
                            : "fa-solid fa-volume-high";
                }

                soundButton.setAttribute(
                    "aria-label",
                    muted
                        ? "Activer le son"
                        : "Désactiver le son"
                );

                soundButton.setAttribute(
                    "aria-pressed",
                    String(!muted)
                );
            };

            updateSoundUI();

            soundButton.addEventListener(
                "click",
                async () => {
                    try {
                        video.muted =
                            !video.muted;

                        if (
                            !video.muted
                        ) {
                            await video.play();
                        } else {
                            await video.play();
                        }
                    } catch (error) {
                        video.muted = true;

                        console.warn(
                            "Lecture audio impossible.",
                            error
                        );
                    }

                    updateSoundUI();
                }
            );
        }

        video.play().catch(() => {});
    };

    /* ======================================================================
       PARALLAX HERO
    ====================================================================== */

    const initHeroParallax = () => {
        const hero =
            qs(".hero");

        const video =
            qs(".hero-video");

        const content =
            qs(".hero-content");

        if (
            !hero ||
            reducedMotion
        ) {
            return;
        }

        let ticking = false;

        const update = () => {
            ticking = false;

            const scrollY =
                window.scrollY;

            if (
                scrollY >
                hero.offsetHeight
            ) {
                return;
            }

            if (video) {
                video.style.transform =
                    `translate3d(-50%, calc(-50% + ${scrollY * CONFIG.parallaxStrength}px), 0) scale(1.02)`;
            }

            if (content) {
                content.style.transform =
                    `translate3d(0, ${scrollY * 0.07}px, 0)`;
            }
        };

        window.addEventListener(
            "scroll",
            () => {
                if (ticking) return;

                ticking = true;

                window.requestAnimationFrame(
                    update
                );
            },
            {
                passive: true
            }
        );
    };

    /* ======================================================================
       SCROLL PROGRESS
    ====================================================================== */

    const initScrollProgress = () => {
        const progress =
            qs(".scroll-progress span");

        if (!progress) return;

        const update = () => {
            const docHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const ratio =
                docHeight > 0
                    ? window.scrollY /
                      docHeight
                    : 0;

            progress.style.width =
                `${clamp(ratio, 0, 1) * 100}%`;
        };

        update();

        window.addEventListener(
            "scroll",
            update,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            update,
            {
                passive: true
            }
        );
    };

    /* ======================================================================
       REVEAL EFFECT
    ====================================================================== */

    const initReveal = () => {
        const elements =
            qsa(
                ".reveal-section, .reveal-item, .reveal-fast"
            );

        if (!elements.length) {
            return;
        }

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            elements.forEach((element) => {
                element.classList.add(
                    "is-visible"
                );
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {
                    entries.forEach((entry) => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold:
                        CONFIG.revealThreshold,
                    rootMargin:
                        "0px 0px -70px 0px"
                }
            );

        elements.forEach((element) => {
            observer.observe(element);
        });
    };

    /* ======================================================================
       GALLERY SLIDERS
    ====================================================================== */

    const initGalleries = () => {
        const galleries =
            qsa("[data-gallery]");

        galleries.forEach((gallery) => {

            const slides =
                qsa(
                    ".gallery-slide",
                    gallery
                );

            const prev =
                qs(
                    ".gallery-prev",
                    gallery
                );

            const next =
                qs(
                    ".gallery-next",
                    gallery
                );

            const dotsContainer =
                qs(
                    ".gallery-dots",
                    gallery
                );

            if (
                slides.length <= 1
            ) {
                if (prev) {
                    prev.hidden = true;
                }

                if (next) {
                    next.hidden = true;
                }

                return;
            }

            let index = 0;
            let busy = false;

            if (dotsContainer) {

                slides.forEach(
                    (_, slideIndex) => {

                        const dot =
                            document.createElement(
                                "button"
                            );

                        dot.type = "button";
                        dot.className =
                            "gallery-dot";

                        dot.setAttribute(
                            "aria-label",
                            `Afficher la photo ${slideIndex + 1}`
                        );

                        dot.addEventListener(
                            "click",
                            () => {
                                show(
                                    slideIndex
                                );
                            }
                        );

                        dotsContainer.appendChild(
                            dot
                        );
                    }
                );
            }

            const dots =
                qsa(
                    ".gallery-dot",
                    gallery
                );

            const updateUI = () => {

                slides.forEach(
                    (slide, slideIndex) => {
                        slide.classList.toggle(
                            "active",
                            slideIndex === index
                        );
                    }
                );

                dots.forEach(
                    (dot, dotIndex) => {
                        dot.classList.toggle(
                            "active",
                            dotIndex === index
                        );
                    }
                );
            };

            const show = (
                newIndex,
                direction = 1
            ) => {

                if (
                    busy ||
                    newIndex === index
                ) {
                    return;
                }

                busy = true;

                index =
                    (
                        newIndex +
                        slides.length
                    ) %
                    slides.length;

                updateUI();

                window.setTimeout(
                    () => {
                        busy = false;
                    },
                    reducedMotion
                        ? 20
                        : CONFIG.galleryTransition
                );
            };

            const goNext = () => {
                show(index + 1, 1);
            };

            const goPrev = () => {
                show(index - 1, -1);
            };

            if (prev) {
                prev.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        goPrev();
                    }
                );
            }

            if (next) {
                next.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        goNext();
                    }
                );
            }

            let startX = 0;
            let startY = 0;

            gallery.addEventListener(
                "touchstart",
                (event) => {
                    if (
                        !event.changedTouches.length
                    ) {
                        return;
                    }

                    startX =
                        event.changedTouches[0].screenX;

                    startY =
                        event.changedTouches[0].screenY;
                },
                {
                    passive: true
                }
            );

            gallery.addEventListener(
                "touchend",
                (event) => {

                    if (
                        !event.changedTouches.length
                    ) {
                        return;
                    }

                    const endX =
                        event.changedTouches[0].screenX;

                    const endY =
                        event.changedTouches[0].screenY;

                    const dx =
                        endX - startX;

                    const dy =
                        endY - startY;

                    if (
                        Math.abs(dx) >
                            42 &&
                        Math.abs(dx) >
                            Math.abs(dy)
                    ) {
                        if (dx < 0) {
                            goNext();
                        } else {
                            goPrev();
                        }
                    }
                },
                {
                    passive: true
                }
            );

            updateUI();
        });
    };

    /* ======================================================================
       LIGHTBOX
    ====================================================================== */

    const initLightbox = () => {
        const lightbox =
            qs("#lightbox");

        const image =
            qs("#lightbox-image");

        const caption =
            qs("#lightbox-caption");

        const closeButton =
            qs(".lightbox-close");

        const backdrop =
            qs(".lightbox-backdrop");

        const triggers =
            qsa(
                ".image-lightbox"
            );

        if (
            !lightbox ||
            !image
        ) {
            return;
        }

        let lastFocusedElement =
            null;

        const open = (
            src,
            title = ""
        ) => {

            lastFocusedElement =
                document.activeElement;

            image.src = src;
            image.alt = title;

            if (caption) {
                caption.textContent =
                    title;
            }

            lightbox.classList.add(
                "open"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "lightbox-open"
            );

            window.setTimeout(
                () => {
                    if (closeButton) {
                        closeButton.focus();
                    }
                },
                100
            );
        };

        const close = () => {

            lightbox.classList.remove(
                "open"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "lightbox-open"
            );

            window.setTimeout(
                () => {
                    image.src = "";

                    if (
                        lastFocusedElement &&
                        typeof
                            lastFocusedElement.focus ===
                            "function"
                    ) {
                        lastFocusedElement.focus();
                    }
                },
                300
            );
        };

        triggers.forEach(
            (trigger) => {

                trigger.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();

                        const src =
                            trigger.dataset.image;

                        const title =
                            trigger.dataset.title ||
                            "";

                        if (!src) return;

                        open(
                            src,
                            title
                        );
                    }
                );
            }
        );

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                close
            );
        }

        if (backdrop) {
            backdrop.addEventListener(
                "click",
                close
            );
        }

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    lightbox.classList.contains(
                        "open"
                    )
                ) {
                    close();
                }
            }
        );
    };

    /* ======================================================================
       MAGNETIC BUTTONS
    ====================================================================== */

    const initMagnetic = () => {

        if (
            reducedMotion ||
            !window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {
            return;
        }

        const elements =
            qsa(".magnetic");

        elements.forEach(
            (element) => {

                element.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            element.getBoundingClientRect();

                        const x =
                            event.clientX -
                            rect.left -
                            rect.width / 2;

                        const y =
                            event.clientY -
                            rect.top -
                            rect.height / 2;

                        element.style.transform =
                            `translate3d(${x * CONFIG.magneticStrength}px, ${y * CONFIG.magneticStrength}px, 0)`;
                    }
                );

                element.addEventListener(
                    "pointerleave",
                    () => {
                        element.style.transform =
                            "";
                    }
                );
            }
        );
    };

    /* ======================================================================
       CURSOR
    ====================================================================== */

    const initCursor = () => {

        if (
            reducedMotion ||
            !window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {
            return;
        }

        const cursor =
            qs(".cursor-glow");

        if (!cursor) return;

        let x = 0;
        let y = 0;

        let currentX = 0;
        let currentY = 0;

        const animate = () => {

            currentX +=
                (x - currentX) *
                0.18;

            currentY +=
                (y - currentY) *
                0.18;

            cursor.style.left =
                `${currentX}px`;

            cursor.style.top =
                `${currentY}px`;

            requestAnimationFrame(
                animate
            );
        };

        document.addEventListener(
            "pointermove",
            (event) => {
                x = event.clientX;
                y = event.clientY;
            },
            {
                passive: true
            }
        );

        const interactiveElements =
            qsa(
                "a, button, [data-tilt]"
            );

        interactiveElements.forEach(
            (element) => {

                element.addEventListener(
                    "pointerenter",
                    () => {
                        document.body.classList.add(
                            "cursor-hover"
                        );
                    }
                );

                element.addEventListener(
                    "pointerleave",
                    () => {
                        document.body.classList.remove(
                            "cursor-hover"
                        );
                    }
                );
            }
        );

        animate();
    };

    /* ======================================================================
       CARD TILT
    ====================================================================== */

    const initTiltCards = () => {

        if (
            reducedMotion ||
            !window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {
            return;
        }

        const cards =
            qsa("[data-tilt]");

        cards.forEach(
            (card) => {

                card.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            card.getBoundingClientRect();

                        const px =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width;

                        const py =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height;

                        const rotateY =
                            (px - 0.5) * 5;

                        const rotateX =
                            (0.5 - py) * 5;

                        card.style.transform =
                            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                    }
                );

                card.addEventListener(
                    "pointerleave",
                    () => {
                        card.style.transform =
                            "";
                    }
                );
            }
        );
    };

    /* ======================================================================
       YEAR
    ====================================================================== */

    const initYear = () => {

        const yearElement =
            qs("#current-year");

        if (!yearElement) return;

        yearElement.textContent =
            String(
                new Date().getFullYear()
            );
    };

    /* ======================================================================
       IMAGE ERROR HANDLING
    ====================================================================== */

    const initImageHandling = () => {

        const images =
            qsa("img");

        images.forEach(
            (image) => {

                image.addEventListener(
                    "error",
                    () => {

                        image.classList.add(
                            "image-error"
                        );

                        image.style.opacity =
                            "0";
                    }
                );
            }
        );
    };

    /* ======================================================================
       RESIZE
    ====================================================================== */

    const initResize = () => {

        let timer = null;

        window.addEventListener(
            "resize",
            () => {

                window.clearTimeout(
                    timer
                );

                timer =
                    window.setTimeout(
                        () => {
                            document
                                .querySelectorAll(
                                    "[style*='transform']"
                                )
                                .forEach(
                                    (element) => {
                                        if (
                                            !element.matches(
                                                ".hero-content, .hero-video"
                                            )
                                        ) {
                                            return;
                                        }

                                        if (
                                            !window.matchMedia(
                                                "(pointer: fine)"
                                            ).matches
                                        ) {
                                            element.style.transform =
                                                "";
                                        }
                                    }
                                );
                        },
                        180
                    );
            }
        );
    };

    /* ======================================================================
       PAGE VISIBILITY
    ====================================================================== */

    const initVisibility = () => {

        document.addEventListener(
            "visibilitychange",
            () => {

                const video =
                    qs(".hero-video");

                if (!video) return;

                if (
                    document.hidden
                ) {
                    video.pause();
                } else {
                    video.play().catch(
                        () => {}
                    );
                }
            }
        );
    };

    /* ======================================================================
       INIT
    ====================================================================== */

    const init = () => {

        initLoader();
        initHeader();
        initMobileMenu();
        initSmoothNavigation();
        initActiveNavigation();

        initHeroVideo();
        initHeroParallax();

        initScrollProgress();
        initReveal();

        initGalleries();
        initLightbox();

        initMagnetic();
        initCursor();
        initTiltCards();

        initYear();
        initImageHandling();
        initResize();
        initVisibility();
    };

    /* ======================================================================
       DOM READY
    ====================================================================== */

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );
    } else {
        init();
    }

})();
