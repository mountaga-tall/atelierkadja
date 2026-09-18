/* ==========================================================
   ATELIER KADJA
   LUXURY INTERACTION ENGINE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       VARIABLES GLOBALES
    ====================================================== */

    const body = document.body;

    const header =
        document.querySelector("header");

    const hero =
        document.querySelector(".hero");

    const heroVideo =
        document.querySelector(".hero-video");

    const heroContent =
        document.querySelector(".hero-content");

    const soundBtn =
        document.querySelector(".sound-toggle");

    const soundIcon =
        soundBtn?.querySelector("i");

    const loader =
        document.querySelector(".loader");


    /* ======================================================
       1. CUSTOM CURSOR
    ====================================================== */

    const supportsFinePointer =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;


    if (supportsFinePointer) {

        const cursor =
            document.createElement("div");

        cursor.className =
            "custom-cursor";

        body.appendChild(cursor);


        let cursorX = 0;
        let cursorY = 0;

        let targetX = 0;
        let targetY = 0;


        document.addEventListener(
            "mousemove",
            (event) => {

                targetX =
                    event.clientX;

                targetY =
                    event.clientY;

            },
            { passive: true }
        );


        const moveCursor = () => {

            cursorX +=
                (targetX - cursorX) * .22;

            cursorY +=
                (targetY - cursorY) * .22;

            cursor.style.left =
                `${cursorX}px`;

            cursor.style.top =
                `${cursorY}px`;

            requestAnimationFrame(
                moveCursor
            );

        };

        moveCursor();


        document.addEventListener(
            "mousedown",
            () => {

                cursor.style.transform =
                    "translate(-50%, -50%) scale(.65)";

            }
        );


        document.addEventListener(
            "mouseup",
            () => {

                cursor.style.transform =
                    "translate(-50%, -50%) scale(1)";

            }
        );


        const interactiveElements =
            document.querySelectorAll(
                "a, button, .card, .look-card"
            );


        interactiveElements.forEach(
            (element) => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        cursor.style.width =
                            "20px";

                        cursor.style.height =
                            "20px";

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        cursor.style.width =
                            "12px";

                        cursor.style.height =
                            "12px";

                    }
                );

            }
        );

    }


    /* ======================================================
       2. REVEAL ANIMATIONS
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            "section.reveal, .card"
        );


    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "active"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: .05,
                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    revealElements.forEach(
        (element) => {

            if (
                !element.classList.contains(
                    "reveal"
                )
            ) {

                element.classList.add(
                    "reveal"
                );

            }


            revealObserver.observe(
                element
            );

        }
    );


    /* ======================================================
       3. CASCADE DES CARTES
    ====================================================== */

    document
        .querySelectorAll(".collection-grid")
        .forEach((grid) => {

            const cards =
                grid.querySelectorAll(
                    ".card"
                );


            cards.forEach(
                (card, index) => {

                    card.style.transitionDelay =
                        `${Math.min(index * 70, 420)}ms`;

                }
            );

        });


    /* ======================================================
       4. HERO VIDEO
    ====================================================== */

    if (heroVideo) {

        heroVideo.muted = true;

        heroVideo.playsInline = true;


        const playHeroVideo = () => {

            heroVideo
                .play()
                .catch(() => {});

        };


        playHeroVideo();


        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    playHeroVideo();

                }

            }
        );


        const mediaQuery =
            window.matchMedia(
                "(max-width: 1024px)"
            );


        const reloadHeroVideo =
            () => {

                heroVideo.load();

                playHeroVideo();

            };


        if (
            mediaQuery.addEventListener
        ) {

            mediaQuery.addEventListener(
                "change",
                reloadHeroVideo
            );

        } else {

            mediaQuery.addListener(
                reloadHeroVideo
            );

        }

    }


    /* ======================================================
       5. HEADER + HERO PARALLAX
    ====================================================== */

    let ticking = false;


    const updateScrollEffects =
        () => {

            const scrollY =
                window.scrollY;


            /* HEADER */

            if (header) {

                header.classList.toggle(
                    "scrolled",
                    scrollY > 70
                );

            }


            /* HERO */

            if (
                hero &&
                heroContent
            ) {

                const compactScreen =
                    window.innerWidth <= 1024;

                if (compactScreen) {
                    heroContent.style.transform = "translateY(0)";
                    heroContent.style.opacity = "";
                } else {
                    const heroHeight =
                        hero.offsetHeight;

                    const progress =
                        Math.min(
                            scrollY /
                            Math.max(heroHeight, 1),
                            1
                        );

                    const movement =
                        Math.min(scrollY * .20, 150);

                    heroContent.style.transform =
                        `translateY(${movement}px)`;

                    heroContent.style.opacity =
                        Math.max(0, 1 - progress * 1.35);
                }

            }


            /* VIDEO ZOOM */

            if (
                heroVideo &&
                window.innerWidth > 1024
            ) {

                const zoom =
                    Math.min(
                        1 + scrollY * .00012,
                        1.10
                    );

                heroVideo.style.transform =
                    `scale(${zoom})`;

            } else if (heroVideo) {
                heroVideo.style.transform = "scale(1)";
            }


            ticking = false;

        };


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateScrollEffects
                );

                ticking = true;

            }

        },
        {
            passive: true
        }
    );


    updateScrollEffects();


    /* ======================================================
       6. SOUND BUTTON
    ====================================================== */

    if (
        heroVideo &&
        soundBtn &&
        soundIcon
    ) {

        soundBtn.addEventListener(
            "click",
            () => {

                heroVideo.muted =
                    !heroVideo.muted;


                if (
                    heroVideo.muted
                ) {

                    soundIcon.className =
                        "fa-solid fa-volume-xmark";


                    soundBtn.setAttribute(
                        "aria-label",
                        "Activer le son"
                    );

                } else {

                    soundIcon.className =
                        "fa-solid fa-volume-high";


                    soundBtn.setAttribute(
                        "aria-label",
                        "Couper le son"
                    );


                    heroVideo
                        .play()
                        .catch(() => {});

                }

            }
        );

    }


    /* ======================================================
       7. T-SHIRTS
       RECTO / VERSO
    ====================================================== */

    const tshirtSliders =
        document.querySelectorAll(
            ".tshirt-slider"
        );


    tshirtSliders.forEach(
        (slider) => {

            const slides =
                slider.querySelectorAll(
                    ".tshirt-slide"
                );


            if (
                slides.length <= 1
            ) {

                return;

            }


            const cardImage =
                slider.closest(
                    ".card-image"
                );


            if (!cardImage) {
                return;
            }


            let dotsContainer =
                cardImage.querySelector(
                    ".tshirt-dots"
                );


            if (!dotsContainer) {

                dotsContainer =
                    document.createElement(
                        "div"
                    );

                dotsContainer.className =
                    "tshirt-dots";

                cardImage.appendChild(
                    dotsContainer
                );

            }


            dotsContainer.innerHTML =
                "";


            const dots = [];


            slides.forEach(
                (slide, index) => {

                    const dot =
                        document.createElement(
                            "button"
                        );


                    dot.type =
                        "button";


                    dot.className =
                        "tshirt-dot";


                    dot.setAttribute(
                        "aria-label",
                        index === 0
                            ? "Voir le recto"
                            : "Voir le verso"
                    );


                    if (
                        index === 0
                    ) {

                        dot.classList.add(
                            "active"
                        );

                    }


                    dot.addEventListener(
                        "click",
                        (event) => {

                            event.preventDefault();

                            event.stopPropagation();


                            slider.scrollTo({

                                left:
                                    slide.offsetLeft,

                                behavior:
                                    "smooth"

                            });

                        }
                    );


                    dotsContainer.appendChild(
                        dot
                    );

                    dots.push(dot);

                }
            );


            const updateDots =
                () => {

                    const current =
                        Math.round(
                            slider.scrollLeft /
                            slider.clientWidth
                        );


                    dots.forEach(
                        (dot, index) => {

                            dot.classList.toggle(
                                "active",
                                index === current
                            );

                        }
                    );

                };


            slider.addEventListener(
                "scroll",
                updateDots,
                {
                    passive: true
                }
            );


            slider.addEventListener(
                "dragstart",
                (event) => {

                    event.preventDefault();

                }
            );


            updateDots();

        }
    );


    /* ======================================================
       8. PAUSE CAROUSELS SI ONGLET INACTIF
    ====================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            const tracks =
                document.querySelectorAll(
                    ".carousel-track"
                );


            tracks.forEach(
                (track) => {

                    if (
                        document.hidden
                    ) {

                        track.style.animationPlayState =
                            "paused";

                    } else {

                        track.style.animationPlayState =
                            "";

                    }

                }
            );

        }
    );


    /* ======================================================
       9. SMOOTH NAVIGATION
    ====================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {

                            return;

                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior:
                                "smooth",
                            block:
                                "start"
                        });

                    }
                );

            }
        );


    /* ======================================================
       10. PRELOADER
    ====================================================== */

    if (loader) {

        const hideLoader =
            () => {

                loader.classList.add(
                    "loader-hidden"
                );


                setTimeout(
                    () => {

                        if (
                            loader.parentNode
                        ) {

                            loader.remove();

                        }

                    },
                    950
                );

            };


        if (
            document.readyState ===
            "complete"
        ) {

            setTimeout(
                hideLoader,
                350
            );

        } else {

            window.addEventListener(
                "load",
                () => {

                    setTimeout(
                        hideLoader,
                        350
                    );

                },
                {
                    once: true
                }
            );

        }

    }


    /* ======================================================
       11. PROTECTION CONTRE LES IMAGES
       Empêche le drag accidentel
    ====================================================== */

    document
        .querySelectorAll("img")
        .forEach(
            (image) => {

                image.addEventListener(
                    "dragstart",
                    (event) => {

                        event.preventDefault();

                    }
                );

            }
        );


});


/* ==========================================================
   PATCH ATELIER KADJA — MOBILE / COMMANDE WHATSAPP / PERF
   ========================================================== */

(() => {
    const initKadjaPatch = () => {
        const MOBILE_BREAKPOINT = 1024;
        const header = document.querySelector("header");
        const nav = header?.querySelector("nav");

        /* ------------------------------------------------------
           1. MENU MOBILE
           ------------------------------------------------------ */
        if (header && nav && !header.querySelector(".nav-toggle")) {
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "nav-toggle";
            toggle.setAttribute("aria-controls", "kadja-main-nav");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Ouvrir le menu");
            toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';

            nav.id = "kadja-main-nav";
            header.appendChild(toggle);

            const setMenuState = (open) => {
                header.classList.toggle("nav-open", open);
                body.classList.toggle("nav-menu-open", open);
                toggle.setAttribute("aria-expanded", String(open));
                toggle.setAttribute(
                    "aria-label",
                    open ? "Fermer le menu" : "Ouvrir le menu"
                );
                toggle.innerHTML = open
                    ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
                    : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
            };

            const closeMenu = () => setMenuState(false);

            toggle.addEventListener("click", () => {
                setMenuState(!header.classList.contains("nav-open"));
            });

            nav.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
                        closeMenu();
                    }
                });
            });

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    closeMenu();
                }
            });

            document.addEventListener("click", (event) => {
                if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches &&
                    header.classList.contains("nav-open") &&
                    !header.contains(event.target)) {
                    closeMenu();
                }
            });

            window.addEventListener("resize", () => {
                if (!window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
                    closeMenu();
                }
            }, { passive: true });
        }

        /* ------------------------------------------------------
           2. COMMANDES WHATSAPP INTELLIGENTES
           ------------------------------------------------------ */
        const whatsappNumber = "2250759013832";

        document.querySelectorAll(".product-card .card-content > a").forEach((link) => {
            const label = (link.textContent || "").trim().toLowerCase();

            if (!label.includes("commander") || link.dataset.whatsappReady === "1") {
                return;
            }

            const card = link.closest(".product-card, .card");
            const title = card?.querySelector(".card-content h3")?.textContent
                ?.replace(/\s+/g, " ")
                .trim();

            const strong = card?.querySelector(".card-content strong")?.textContent
                ?.replace(/\s+/g, " ")
                .trim();

            if (!title) return;

            const price = strong ? ` (${strong.replace(/^prix\s*:\s*/i, "")})` : "";
            const message =
                `Bonjour Atelier Kadja, je souhaite commander : ${title}${price}. ` +
                `Pouvez-vous me confirmer la disponibilité et les modalités ?`;

            link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.setAttribute("aria-label", `Commander ${title} sur WhatsApp`);
            link.dataset.whatsappReady = "1";
        });

        /* ------------------------------------------------------
           3. OPTIMISATION IMAGES
           ------------------------------------------------------ */
        document.querySelectorAll("img").forEach((img, index) => {
            if (!img.hasAttribute("decoding")) {
                img.setAttribute("decoding", "async");
            }

            if (index > 0 && !img.hasAttribute("loading")) {
                img.setAttribute("loading", "lazy");
            }
        });

        /* ------------------------------------------------------
           4. MOTION : PAUSE DES CARROUSELS SI RÉDUIT
           ------------------------------------------------------ */
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const applyMotionPreference = () => {
            document.querySelectorAll(".carousel-track").forEach((track) => {
                track.style.animationPlayState = reducedMotion.matches
                    ? "paused"
                    : "";
            });
        };

        applyMotionPreference();

        if (reducedMotion.addEventListener) {
            reducedMotion.addEventListener("change", applyMotionPreference);
        } else if (reducedMotion.addListener) {
            reducedMotion.addListener(applyMotionPreference);
        }

        /* ------------------------------------------------------
           5. EMPÊCHER LE DRAG D'IMAGES DE CASSER LES GALERIES
           ------------------------------------------------------ */
        document.querySelectorAll(".tshirt-slider, .carousel-container").forEach((el) => {
            el.addEventListener("touchstart", () => {}, { passive: true });
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initKadjaPatch, { once: true });
    } else {
        initKadjaPatch();
    }
})();
