import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============ CERTIFICATES — 3D ROTATING RING (no pin) ============
   Ring rotates while the certificate section naturally passes through
   the viewport. No ScrollTrigger pinning → sections can never overlap. */
export function initCertRing() {
  const stage = document.getElementById('certStage');
  const ring = document.getElementById('certRing');
  if (!stage || !ring) return;

  const cards = gsap.utils.toArray('.xp-card', ring);
  const N = cards.length;
  if (!N) return;

  const idxEl = document.getElementById('certIndex');
  const dotsWrap = document.getElementById('certDots');
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < N; i++) {
      const d = document.createElement('i');
      if (!i) d.classList.add('on');
      dotsWrap.appendChild(d);
    }
  }
  const dots = dotsWrap ? [...dotsWrap.children] : [];

  const desk = matchMedia('(min-width: 861px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let radius = 0;

  function layout() {
    if (desk.matches) {
      radius = Math.round(cards[0].offsetWidth / (2 * Math.tan(Math.PI / N))) + 54;
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${(i * 360) / N}deg) translateZ(${radius}px)`;
      });
    } else {
      cards.forEach(c => { c.style.transform = ''; });
    }
  }
  layout();
  addEventListener('resize', layout, { passive: true });

  function setActive() {
    const step = 360 / N;
    const active = ((Math.round(-state.rot / step) % N) + N) % N;
    if (idxEl) idxEl.textContent = String(active + 1).padStart(2, '0');
    cards.forEach((c, i) => c.classList.toggle('is-active', i === active));
    dots.forEach((d, i) => d.classList.toggle('on', i === active));
  }

  /* whole ring pushed back by its radius → front card lands at z≈0,
     nothing ever pokes out of the stage box into neighbouring sections */
  const state = { rot: 30 };
  function renderRing() {
    ring.style.transform = `translateZ(${-radius}px) rotateY(${state.rot}deg)`;
    setActive();
  }

  if (desk.matches && !reduced) {
    gsap.to(state, {
      rot: 30 - 360,
      ease: 'none',
      onUpdate: renderRing,
      scrollTrigger: {
        trigger: '#certificate',
        start: 'top 55%',
        end: 'bottom 60%',
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });
    renderRing();
  }

  gsap.from(stage, {
    scale: 0.85, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: stage, start: 'top 78%', toggleActions: 'play none none reverse' }
  });
}

/* ============ VOLUNTEERING — MISSION DOSSIERS (no pin) ============
   Each folder's flap unseals as its card passes through the viewport.
   Pure scrub, no pinning → sections stay strictly sequential. */
export function initDossiers() {
  const field = document.getElementById('dosField');
  if (!field) return;

  const cards = gsap.utils.toArray('.dos-card', field);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!cards.length) return;

  if (reduced) {
    gsap.set('.dos-flap', { rotationY: -150 });
    gsap.set('.dos-content', { opacity: 1, y: 0, scale: 1 });
    return;
  }

  cards.forEach(card => {
    const flap = card.querySelector('.dos-flap');
    const content = card.querySelector('.dos-content');
    if (!flap || !content) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        end: 'center 46%',
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    })
      .fromTo(flap,
        { rotationY: 14 },
        { rotationY: -150, ease: 'power1.inOut' })
      .fromTo(content,
        { y: 30, scale: 0.97, opacity: 0.25 },
        { y: 0, scale: 1, opacity: 1, ease: 'power1.out' },
        0.12);
  });
}
