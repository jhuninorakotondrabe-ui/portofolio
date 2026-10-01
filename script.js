/* ===== 1. PÉTALES DE SAKURA (chute infinie) ===== */
const canvas = document.getElementById("petales");
const ctx = canvas.getContext("2d");
let L, H;
const NB_PETALES = 45; // 👉 change le nombre de pétales ici
const petales = [];

function redim() {
  L = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
addEventListener("resize", redim);
redim();

// Crée un pétale (au hasard sur l'écran au début, en haut ensuite)
function nouveau(enHaut) {
  return {
    x: Math.random() * L,
    y: enHaut ? -20 : Math.random() * H,
    t: 5 + Math.random() * 8, // taille
    vy: 0.6 + Math.random() * 1.1, // vitesse de chute
    vx: 0.2 + Math.random() * 0.6, // dérive vers la droite (vent)
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.04, // rotation
    ph: Math.random() * 6.28, // phase du balancement
    a: 0.5 + Math.random() * 0.45, // transparence
  };
}
for (let i = 0; i < NB_PETALES; i++) petales.push(nouveau(false));

function dessiner(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(Math.cos(p.ph), 1); // effet de retournement 3D
  ctx.globalAlpha = p.a;
  ctx.fillStyle = "#f7a8bd";
  ctx.beginPath();
  ctx.moveTo(0, -p.t);
  ctx.bezierCurveTo(p.t, -p.t * 0.6, p.t * 0.8, p.t * 0.6, 0, p.t);
  ctx.bezierCurveTo(-p.t * 0.8, p.t * 0.6, -p.t, -p.t * 0.6, 0, -p.t);
  ctx.fill();
  ctx.restore();
}

function boucle() {
  ctx.clearRect(0, 0, L, H);
  petales.forEach((p, i) => {
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.ph) * 0.5;
    p.ph += 0.02;
    p.rot += p.vr;
    // Sorti de l'écran → il revient en haut (donc infini)
    if (p.y > H + 20 || p.x > L + 20) petales[i] = nouveau(true);
    dessiner(p);
  });
  requestAnimationFrame(boucle);
}
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) boucle();

/* ===== 2. MACHINE À ÉCRIRE ===== */
const mots = ["développeur web", "créatif", "autodidacte", "passionné de code"]; // 👉 modifie ici
const cible = document.getElementById("typing");
let m = 0,
  c = 0,
  efface = false;
function ecrire() {
  const mot = mots[m];
  cible.textContent = mot.slice(0, (c += efface ? -1 : 1));
  let delai = efface ? 45 : 90;
  if (!efface && c === mot.length) {
    efface = true;
    delai = 1600;
  } else if (efface && c === 0) {
    efface = false;
    m = (m + 1) % mots.length;
    delai = 400;
  }
  setTimeout(ecrire, delai);
}
ecrire();

/* ===== 3. MENU : lien actif au scroll + barre du haut ===== */
const liens = document.querySelectorAll(".side-nav a, .topnav nav a");
const sections = document.querySelectorAll("section[id]");
const topnav = document.querySelector(".topnav");
const sidebar = document.querySelector(".sidebar");

const espion = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting)
        liens.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + e.target.id
          )
        );
    }),
  { threshold: 0.5 }
);
sections.forEach((s) => espion.observe(s));

addEventListener("scroll", () =>
  topnav.classList.toggle("scrolled", scrollY > 40)
);

// Menu mobile
document.querySelector(".burger").onclick = () =>
  sidebar.classList.toggle("ouvert");
document
  .querySelectorAll(".side-nav a")
  .forEach((a) => (a.onclick = () => sidebar.classList.remove("ouvert")));

// Bouton retour en haut
document.querySelector(".haut").onclick = () => scrollTo({ top: 0 });

/* ===== 4. APPARITION AU SCROLL + BARRES + COMPTEURS ===== */
const revele = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("vu");
      const barre = el.querySelector("[data-niveau]");
      if (barre) barre.style.width = barre.dataset.niveau + "%";
      el.querySelectorAll("[data-cible]").forEach(compter);
      revele.unobserve(el);
    }),
  { threshold: 0.2 }
);
document.querySelectorAll(".reveal").forEach((el) => revele.observe(el));

function compter(n) {
  const fin = +n.dataset.cible;
  let v = 0;
  const pas = setInterval(() => {
    n.textContent = ++v;
    if (v >= fin) clearInterval(pas);
  }, 1400 / fin);
}

/* ===== 5. FILTRES DES PROJETS ===== */
document.querySelectorAll(".filtres button").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".filtres button")
        .forEach((x) => x.classList.toggle("on", x === b));
      document
        .querySelectorAll(".carte")
        .forEach((c) =>
          c.classList.toggle(
            "cache",
            b.dataset.f !== "tous" && c.dataset.cat !== b.dataset.f
          )
        );
    })
);

/* ===== 6. FORMULAIRE DE CONTACT (ouvre le mail du visiteur) ===== */
const EMAIL = "salut.dev@gmail.com"; // 👉 mets ton vrai email
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target,
    retour = document.getElementById("retour");
  if (
    !f.nom.value.trim() ||
    !/\S+@\S+\.\S+/.test(f.email.value) ||
    !f.message.value.trim()
  ) {
    retour.style.color = "#e8556d";
    retour.textContent = "Remplis correctement tous les champs.";
    return;
  }
  retour.style.color = "#7bd88f";
  retour.textContent = "Merci ! Ton application mail va s'ouvrir.";
  location.href = `mailto:${EMAIL}?subject=Message de ${encodeURIComponent(
    f.nom.value
  )}&body=${encodeURIComponent(f.message.value + "\n\n" + f.email.value)}`;
});
