/* =========================================================
   KHUSHII BIRTHDAY EXPERIENCE
   Made with ❤️ by Govind

   Features:
   - Multi-song system
   - Scroll based music switching
   - Birthday countdown
   - Reveal animations
   - Gift modal
   - Confetti
   - Mobile + Desktop support
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const openingScreen = document.getElementById("opening-screen");
const mainContent = document.getElementById("main-content");

const beginBtn = document.getElementById("begin-btn");
const countNumber = document.getElementById("count-number");

const birthdayMusic = document.getElementById("birthday-music");

const giftBtn = document.getElementById("gift-btn");
const giftModal = document.getElementById("gift-modal");
const closeGift = document.getElementById("close-gift");

const confettiContainer =
    document.querySelector(".confetti-container");


/* =========================================================
   MUSIC SYSTEM
========================================================= */

const MUSIC = {

    birthday: "assets/music/birthday.mp3",

    memories: "assets/music/memories.mp3",

    friendship: "assets/music/friendship.mp3",

    ias: "assets/music/ias.mp3",

    driver: "assets/music/driver.mp3",

    final: "assets/music/final-birthday.mp3"

};


let currentTrack = null;

let musicStarted = false;

let musicChanging = false;


/* ---------------------------------------------------------
   Set music volume
--------------------------------------------------------- */

birthdayMusic.volume = 0.65;


/* ---------------------------------------------------------
   Safely play audio
--------------------------------------------------------- */

async function safePlayMusic() {

    try {

        await birthdayMusic.play();

        musicStarted = true;

    } catch (error) {

        console.log(
            "Music waiting for user interaction."
        );

    }

}


/* ---------------------------------------------------------
   Change music track
--------------------------------------------------------- */

async function changeMusic(trackName) {

    if (!MUSIC[trackName]) {
        return;
    }

    const newTrack = MUSIC[trackName];


    /* Same song already playing */

    if (
        currentTrack === trackName &&
        !birthdayMusic.paused
    ) {
        return;
    }


    /* Prevent rapid switching */

    if (musicChanging) {
        return;
    }

    musicChanging = true;


    /* If first song */

    if (!currentTrack) {

        currentTrack = trackName;

        birthdayMusic.src = newTrack;

        birthdayMusic.load();

        birthdayMusic.volume = 0.65;

        await safePlayMusic();

        musicChanging = false;

        return;
    }


    /* Fade out current song */

    const originalVolume = birthdayMusic.volume;

    let volume = originalVolume;


    const fadeOut = setInterval(() => {

        volume -= 0.08;

        if (volume <= 0) {

            volume = 0;

            birthdayMusic.volume = 0;

            clearInterval(fadeOut);


            /* Change source */

            currentTrack = trackName;

            birthdayMusic.src = newTrack;

            birthdayMusic.load();


            safePlayMusic().then(() => {

                let newVolume = 0;


                const fadeIn = setInterval(() => {

                    newVolume += 0.08;


                    if (newVolume >= 0.65) {

                        newVolume = 0.65;

                        clearInterval(fadeIn);

                        birthdayMusic.volume = 0.65;

                        musicChanging = false;

                        return;
                    }


                    birthdayMusic.volume = newVolume;

                }, 35);

            });

        }


        birthdayMusic.volume = volume;

    }, 35);

}


/* ---------------------------------------------------------
   Start birthday music after user interaction
--------------------------------------------------------- */

function startBirthdayMusic() {

    currentTrack = null;

    changeMusic("birthday");

}


/* =========================================================
   BEGIN EXPERIENCE
========================================================= */

if (beginBtn) {

    beginBtn.addEventListener("click", () => {

        /* Start audio immediately from user interaction */

        startBirthdayMusic();


        /* Show main content */

        if (mainContent) {
            mainContent.classList.remove("hidden");
        }


        /* Hide opening screen */

        if (openingScreen) {

            openingScreen.classList.add(
                "opening-complete"
            );

            setTimeout(() => {

                openingScreen.style.display = "none";

            }, 900);

        }


        /* Start countdown */

        startCountdown();


        /* Initialize reveal system */

        setTimeout(() => {

            initRevealObserver();

        }, 300);


        /* Scroll slightly to hero */

        setTimeout(() => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }, 100);

    });

}


/* =========================================================
   COUNTDOWN
========================================================= */

function startCountdown() {

    if (!countNumber) {
        return;
    }


    const sequence = [
        "3",
        "2",
        "1",
        "❤️"
    ];


    let index = 0;


    countNumber.textContent = sequence[index];


    const timer = setInterval(() => {

        index++;


        if (index >= sequence.length) {

            clearInterval(timer);


            countNumber.classList.add(
                "count-finished"
            );


            setTimeout(() => {

                countNumber.textContent = "";

            }, 1200);


            return;
        }


        countNumber.classList.remove(
            "count-pop"
        );


        void countNumber.offsetWidth;


        countNumber.textContent =
            sequence[index];


        countNumber.classList.add(
            "count-pop"
        );

    }, 1000);

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

let revealObserver = null;


function initRevealObserver() {

    const revealElements =
        document.querySelectorAll(".reveal");


    if (!revealElements.length) {
        return;
    }


    /* Prevent duplicate observers */

    if (revealObserver) {
        revealObserver.disconnect();
    }


    revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "revealed"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

}


/* =========================================================
   SECTION MUSIC SYSTEM
========================================================= */

let musicObserver = null;


function initMusicObserver() {

    const sections =
        document.querySelectorAll(
            "[data-music]"
        );


    if (!sections.length) {
        return;
    }


    /* -----------------------------------------------------
       Intersection observer
    ----------------------------------------------------- */

    musicObserver =
        new IntersectionObserver(
            (entries) => {

                /*
                   Pick the section which is most visible.
                */

                let bestEntry = null;


                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    if (
                        !bestEntry ||
                        entry.intersectionRatio >
                            bestEntry.intersectionRatio
                    ) {

                        bestEntry = entry;

                    }

                });


                if (bestEntry) {

                    const track =
                        bestEntry.target.dataset.music;


                    if (track) {

                        changeMusic(track);

                    }

                }

            },
            {
                threshold: [
                    0.25,
                    0.4,
                    0.55,
                    0.7
                ],

                rootMargin:
                    "-10% 0px -35% 0px"
            }
        );


    sections.forEach((section) => {

        musicObserver.observe(section);

    });

}


/* ---------------------------------------------------------
   Better section detection on mobile
--------------------------------------------------------- */

let musicScrollTimeout = null;


function detectActiveSection() {

    if (!musicStarted) {
        return;
    }


    const sections =
        document.querySelectorAll(
            "[data-music]"
        );


    if (!sections.length) {
        return;
    }


    const viewportCenter =
        window.innerHeight * 0.42;


    let closestSection = null;

    let closestDistance = Infinity;


    sections.forEach((section) => {

        const rect =
            section.getBoundingClientRect();


        const sectionCenter =
            rect.top +
            rect.height / 2;


        const distance =
            Math.abs(
                sectionCenter -
                viewportCenter
            );


        if (
            distance < closestDistance
        ) {

            closestDistance = distance;

            closestSection = section;

        }

    });


    if (closestSection) {

        const track =
            closestSection.dataset.music;


        if (track) {

            changeMusic(track);

        }

    }

}


window.addEventListener(
    "scroll",
    () => {

        clearTimeout(
            musicScrollTimeout
        );


        musicScrollTimeout =
            setTimeout(
                detectActiveSection,
                180
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   INIT MUSIC OBSERVER
========================================================= */

setTimeout(() => {

    initMusicObserver();

}, 800);


/* =========================================================
   HERO PARTICLES
========================================================= */

function createHeroParticles() {

    const container =
        document.querySelector(
            ".hero-particles"
        );


    if (!container) {
        return;
    }


    const particleCount =
        window.innerWidth < 600
            ? 18
            : 35;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.className =
            "hero-particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.animationDelay =
            `${Math.random() * 5}s`;


        particle.style.animationDuration =
            `${5 + Math.random() * 7}s`;


        container.appendChild(
            particle
        );

    }

}


createHeroParticles();


/* =========================================================
   CARD STAGGER ANIMATION
========================================================= */

function staggerCards() {

    const groups = [
        ".memory-grid",
        ".appreciation-grid",
        ".timeline",
        ".universe-grid"
    ];


    groups.forEach((selector) => {

        const cards =
            document.querySelectorAll(
                `${selector} .reveal`
            );


        cards.forEach(
            (card, index) => {

                card.style.transitionDelay =
                    `${index * 90}ms`;

            }
        );

    });

}


staggerCards();


/* =========================================================
   GIFT MODAL
========================================================= */

function openGift() {

    if (!giftModal) {
        return;
    }


    /* Final song */

    changeMusic("final");


    /* Open modal */

    giftModal.classList.remove(
        "hidden"
    );


    requestAnimationFrame(() => {

        giftModal.classList.add(
            "show"
        );

    });


    /* Prevent background scroll */

    document.body.classList.add(
        "modal-open"
    );


    /* Confetti */

    createConfetti();

}


function closeGiftModal() {

    if (!giftModal) {
        return;
    }


    giftModal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );


    setTimeout(() => {

        giftModal.classList.add(
            "hidden"
        );

    }, 400);

}


if (giftBtn) {

    giftBtn.addEventListener(
        "click",
        openGift
    );

}


if (closeGift) {

    closeGift.addEventListener(
        "click",
        closeGiftModal
    );

}


/* ---------------------------------------------------------
   Close modal by clicking outside
--------------------------------------------------------- */

if (giftModal) {

    giftModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                giftModal
            ) {

                closeGiftModal();

            }

        }
    );

}


/* ---------------------------------------------------------
   Escape key
--------------------------------------------------------- */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            giftModal &&
            giftModal.classList.contains("show")
        ) {

            closeGiftModal();

        }

    }
);


/* =========================================================
   CONFETTI
========================================================= */

function createConfetti() {

    if (!confettiContainer) {
        return;
    }


    /* Clear previous confetti */

    confettiContainer.innerHTML = "";


    const count =
        window.innerWidth < 600
            ? 70
            : 120;


    const shapes = [
        "●",
        "◆",
        "★",
        "♥",
        "✦"
    ];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const piece =
            document.createElement("span");


        piece.className =
            "confetti-piece";


        piece.textContent =
            shapes[
                Math.floor(
                    Math.random() *
                    shapes.length
                )
            ];


        piece.style.left =
            `${Math.random() * 100}%`;


        piece.style.animationDelay =
            `${Math.random() * 2}s`;


        piece.style.animationDuration =
            `${3 + Math.random() * 4}s`;


        piece.style.fontSize =
            `${8 + Math.random() * 14}px`;


        confettiContainer.appendChild(
            piece
        );

    }

}


/* =========================================================
   PARALLAX HERO
========================================================= */

const heroGlow =
    document.querySelector(
        ".hero-glow"
    );


/*
   Only enable stronger parallax on devices
   where pointer movement makes sense.
*/

if (
    heroGlow &&
    window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches
) {

    window.addEventListener(
        "mousemove",
        (event) => {

            const x =
                (event.clientX /
                    window.innerWidth -
                    0.5) *
                20;


            const y =
                (event.clientY /
                    window.innerHeight -
                    0.5) *
                20;


            heroGlow.style.transform =
                `translate(${x}px, ${y}px)`;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   TOUCH / CLICK HEART EFFECT
========================================================= */

function createFloatingHeart(
    x,
    y
) {

    const heart =
        document.createElement(
            "div"
        );


    heart.className =
        "floating-click-heart";


    heart.textContent =
        Math.random() > 0.5
            ? "♥"
            : "✦";


    heart.style.left =
        `${x}px`;


    heart.style.top =
        `${y}px`;


    document.body.appendChild(
        heart
    );


    setTimeout(() => {

        heart.remove();

    }, 1200);

}


/* ---------------------------------------------------------
   Desktop click effect
--------------------------------------------------------- */

document.addEventListener(
    "click",
    (event) => {

        /*
           Don't create hearts when clicking
           buttons or modal controls.
        */

        if (
            event.target.closest(
                "button"
            )
        ) {
            return;
        }


        createFloatingHeart(
            event.clientX,
            event.clientY
        );

    }
);


/* =========================================================
   MOBILE SAFE HEIGHT
========================================================= */

/*
   Fixes the common mobile browser
   100vh address-bar problem.

   This doesn't change the design;
   it simply exposes the real viewport height.
*/

function updateViewportHeight() {

    document.documentElement.style
        .setProperty(
            "--real-vh",
            `${window.innerHeight * 0.01}px`
        );

}


updateViewportHeight();


window.addEventListener(
    "resize",
    updateViewportHeight
);


/* =========================================================
   PREVENT ACCIDENTAL HORIZONTAL OVERFLOW
========================================================= */

function checkOverflow() {

    /*
       We don't modify layout here.
       This is only a safety check for development.
    */

    if (
        document.documentElement
            .scrollWidth >
        window.innerWidth + 5
    ) {

        console.warn(
            "Horizontal overflow detected. Check responsive CSS."
        );

    }

}


window.addEventListener(
    "load",
    checkOverflow
);

window.addEventListener(
    "resize",
    checkOverflow
);


/* =========================================================
   HANDLE PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (!birthdayMusic) {
            return;
        }


        /*
           When the user leaves the tab,
           browser may pause audio itself.

           When they return, try continuing.
        */

        if (
            document.visibilityState ===
            "visible" &&
            musicStarted
        ) {

            safePlayMusic();

        }

    }
);


/* =========================================================
   INITIAL PAGE STATE
========================================================= */

if (mainContent) {

    /*
       Main content starts hidden until
       BEGIN YOUR SURPRISE is pressed.
    */

    mainContent.classList.add(
        "hidden"
    );

}


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%c❤️ Made for Khushii by Govind ❤️",
    "font-size:18px;font-weight:bold;"
);

console.log(
    "Birthday Experience Loaded Successfully."
);