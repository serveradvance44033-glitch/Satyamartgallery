/* PARTICLES GENERATOR */
const particles = document.getElementById("particles");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const particlesVisible = particles && getComputedStyle(particles).display !== "none";

// Skip creating decorative nodes when the layer is hidden or motion is reduced.
if (particlesVisible && !reducedMotion) {
    for (let i = 0; i < 55; i++) {
        const p = document.createElement("span");
        p.className = "particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration = (6 + Math.random() * 12) + "s";
        p.style.animationDelay = Math.random() * 12 + "s";
        p.style.opacity = .15 + Math.random() * .5;
        particles.appendChild(p);
    }
}

/* SCROLL REVEAL OBSERVER */
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: .12 });

document.documentElement.classList.add("reveal-enabled");
document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});
}

/* OPENING INTRO CONTROLLER */
window.addEventListener("load", () => {
    const intro = document.getElementById("intro");

    setTimeout(() => {
        if (intro) {
            intro.style.pointerEvents = "none";
        }
    }, 4300);
});


/* THREE-LINE MENU (mobile) */
(function () {
    const toggle = document.getElementById("menuToggle");
    const menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    function setMenu(open) {
        menu.classList.toggle("open", open);
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", () => {
        setMenu(!menu.classList.contains("open"));
    });

    menu.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && menu.classList.contains("open")) {
            setMenu(false);
            toggle.focus();
        }
    });

    document.addEventListener("click", event => {
        if (menu.classList.contains("open") && !event.target.closest("#siteNav")) setMenu(false);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1000) setMenu(false);
    });
})();
