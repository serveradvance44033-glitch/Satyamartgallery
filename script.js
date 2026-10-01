/* PARTICLES GENERATOR */
const particles = document.getElementById("particles");

for (let i = 0; i < 55; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (6 + Math.random() * 12) + "s";
    p.style.animationDelay = Math.random() * 12 + "s";
    p.style.opacity = .15 + Math.random() * .5;
    particles.appendChild(p);
}

/* SCROLL REVEAL OBSERVER */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: .12 });

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});

/* BUTTON RIPPLE EFFECT */
document.querySelectorAll(".btn, .wa-button, .nav-cta").forEach(btn => {
    btn.addEventListener("click", function(e) {
        const r = document.createElement("span");
        r.className = "ripple";

        const box = btn.getBoundingClientRect();
        const size = Math.max(box.width, box.height);

        r.style.width = size + "px";
        r.style.height = size + "px";
        r.style.left = (e.clientX - box.left - size / 2) + "px";
        r.style.top = (e.clientY - box.top - size / 2) + "px";

        btn.appendChild(r);

        setTimeout(() => r.remove(), 600);
    });
});

/* OPENING INTRO CONTROLLER */
window.addEventListener("load", () => {
    const intro = document.getElementById("intro");

    setTimeout(() => {
        if (intro) {
            intro.style.pointerEvents = "none";
        }
    }, 4300);
});
