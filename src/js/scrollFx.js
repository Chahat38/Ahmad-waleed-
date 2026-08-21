import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* play on enter, reverse when scrolling back above the start line → re-triggers both ways */
const replay = (trigger, start = 'top 82%') => ({ trigger, start, toggleActions: 'play none none reverse' });

export function initScrollFX() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  heroFX();
  aboutFX();
  skillsFX();
  volunteeringIntroFX();
  footerFX();
  hudFrame();
}

/* ================= HERO ================= */
function heroFX() {
  const end = 'bottom 35%';
  gsap.to('.hero-name-left', {
    xPercent: -55, rotateY: 18, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end, scrub: true }
  });
  gsap.to('.hero-name-right', {
    xPercent: 55, rotateY: -18, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end, scrub: true }
  });
  gsap.to('.hero-model-layer', {
    y: 140, scale: 0.8, rotate: 5, opacity: 0.2, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end, scrub: true }
  });
  gsap.to('.hero-text, .hero-stats-wrap, .hero .status-chip, .hero .eyebrow', {
    y: 70, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 55%', scrub: true }
  });

  /* entrance — replays every time you scroll back to the top */
  gsap.from('.hero .status-chip', {
    y: -30, opacity: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: replay('.hero', 'top top')
  });
  gsap.from('.hero-name-left', {
    xPercent: -60, opacity: 0, rotateY: 30, transformPerspective: 900,
    duration: 1.1, delay: 0.15, ease: 'power4.out',
    scrollTrigger: replay('.hero', 'top top')
  });
  gsap.from('.hero-name-right', {
    xPercent: 60, opacity: 0, rotateY: -30, transformPerspective: 900,
    duration: 1.1, delay: 0.15, ease: 'power4.out',
    scrollTrigger: replay('.hero', 'top top')
  });
  gsap.from('.hero-model-layer', {
    scale: 0.4, opacity: 0, duration: 1.2, delay: 0.3, ease: 'power4.out',
    scrollTrigger: replay('.hero', 'top top')
  });
  gsap.from('.hstat', {
    y: 44, opacity: 0, stagger: 0.08, duration: 0.7, delay: 0.5, ease: 'power3.out',
    scrollTrigger: replay('#heroStats', 'top 95%')
  });

  /* pointer parallax on the big words */
  if (matchMedia('(hover: hover)').matches) {
    const l = document.querySelector('.hero-name-left');
    const r = document.querySelector('.hero-name-right');
    addEventListener('pointermove', e => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      gsap.to(l, { x: nx * -14, y: ny * -8, duration: 0.7, ease: 'power2.out' });
      gsap.to(r, { x: nx * 14, y: ny * 8, duration: 0.7, ease: 'power2.out' });
    }, { passive: true });
  }
}

/* ================= ABOUT — satellites docking around core ================= */
function aboutFX() {
  gsap.from('#aboutCanvas', {
    scale: 0.55, opacity: 0, rotate: -12, duration: 1.1, ease: 'power4.out',
    scrollTrigger: replay('#aboutWrap', 'top 78%')
  });

  const dirs = [[-140, -70], [140, -70], [-140, 70], [140, 70], [0, -120]];
  document.querySelectorAll('.orbit-note').forEach((note, i) => {
    const [dx, dy] = dirs[i % dirs.length];
    gsap.from(note, {
      x: dx, y: dy, rotate: i % 2 ? 9 : -9, scale: 0.82, opacity: 0,
      duration: 0.95, delay: 0.15 + (i % 2) * 0.14, ease: 'power3.out',
      scrollTrigger: replay('#aboutWrap', 'top 74%')
    });
  });
}

/* ================= SKILLS — HUD modules locking in ================= */
function skillsFX() {
  gsap.from('.skills-console-card', {
    x: -80, rotateY: 16, transformPerspective: 900, opacity: 0,
    duration: 1, ease: 'power3.out',
    scrollTrigger: replay('.skills-command-grid', 'top 80%')
  });

  gsap.utils.toArray('.skill-panel').forEach((panel, i) => {
    gsap.fromTo(panel,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0.35 },
      {
        clipPath: 'inset(0 0% 0 0)', opacity: 1,
        duration: 0.95, delay: i * 0.16, ease: 'power4.inOut',
        scrollTrigger: replay(panel, 'top 84%')
      });
  });

  document.querySelectorAll('.skill-row').forEach((row, i) => {
    gsap.from(row, {
      x: -30, opacity: 0, duration: 0.45, delay: (i % 9) * 0.05, ease: 'power2.out',
      scrollTrigger: replay(row, 'top 92%')
    });
  });

  gsap.utils.toArray('.skills-proof-strip > div').forEach((el, i) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.6, delay: i * 0.07, ease: 'power3.out',
      scrollTrigger: replay(el.parentElement, 'top 88%')
    });
  });
}

/* ================= VOLUNTEERING intro + links (dossier flaps run in sections3d) ================= */
function volunteeringIntroFX() {
  gsap.from('.impact-intro', {
    y: 64, opacity: 0, duration: 0.85, ease: 'power3.out',
    scrollTrigger: replay('.impact-intro', 'top 85%')
  });

  gsap.from('.community-links', {
    y: 42, opacity: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: replay('.community-links', 'top 90%')
  });
}

/* ================= FOOTER ================= */
function footerFX() {
  gsap.from('.footer-col', {
    y: 54, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
    scrollTrigger: replay('footer', 'top 82%')
  });
}

/* ================= FIXED VR HUD FRAME ================= */
function hudFrame() {
  const hud = document.createElement('div');
  hud.className = 'vr-hud-frame';
  hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML = '<i></i><i></i><i></i><i></i>';
  document.body.appendChild(hud);
}
