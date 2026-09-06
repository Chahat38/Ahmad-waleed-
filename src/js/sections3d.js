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

  const desk = matchMedia('(min-width: 1290px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let radius = 0;

  function buildCertBack(card, i) {
    if (!card.classList.contains('cert-face') || card.querySelector('.cert-back')) return;
    const serial = card.querySelector('.cert-serial');
    const org = card.querySelector('.cert-org');
    const logo = card.querySelector('.cert-logo');
    const back = document.createElement('div');
    back.className = 'cert-back';
    back.innerHTML = `
      <span class="cert-back-ribbon">VERIFIED CREDENTIAL</span>
      <div class="cert-back-hol"><i></i><i></i><i></i></div>
      <div class="cert-back-core">
        <b class="cert-back-id">${serial ? serial.textContent.trim() : ''}</b>
        <span class="cert-back-name">${logo ? logo.textContent.trim() : 'AW'}</span>
        <span class="cert-back-org">${org ? org.textContent.trim() : ''}</span>
      </div>
      <div class="cert-back-bars"><i></i><i></i><i></i></div>
      <span class="cert-back-strip">SIGNED · SEALED · ${String(i + 1).padStart(2, '0')}/06</span>`;
    card.appendChild(back);
  }

  function layout() {
    if (desk.matches) {
      const w = cards[0].offsetWidth;
      radius = Math.round(w / (2 * Math.tan(Math.PI / N))) + 54;
      /* grow the ring tall enough so photo + caption never clip.
         tallest image box = width / 1.27 (worst photo aspect), plus
         photo padding (36), caption incl. its padding (~150) and the
         card frame (12). Extra room is harmless — it just becomes
         quiet space under the caption. */
      const imgW = w - 48;
      const imgH = imgW / 1.27;
      const needed = Math.ceil(imgH + 36 + 150 + 12);
      ring.style.height = Math.max(needed, 440) + 'px';
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${(i * 360) / N}deg) translateZ(${radius}px)`;
      });
    } else {
      ring.style.height = '';
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
    /* never apply the 3D transform while in the responsive (flat) layout —
       otherwise a resized window leaves the ring skewed / upside-down */
    if (!desk.matches) { ring.style.transform = ''; return; }
    ring.style.transform = `translateZ(${-radius}px) rotateY(${state.rot}deg)`;
    setActive();
  }

  /* SCROLL-DRIVEN ROTATION — no timers, no CSS animation loops: the ring's
     angle is bound to the certificate section's passage through the viewport
     (scrub). Scroll → it turns; stop scrolling → it holds perfectly still. */
  function initScrollSpin() {
    gsap.to(state, {
      rot: 30 - 360,
      ease: 'none',
      scrollTrigger: {
        trigger: document.getElementById('certificate'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate: renderRing
      }
    });
    renderRing();
  }

  if (desk.matches && !reduced) {
    cards.forEach((card, i) => buildCertBack(card, i));
    initScrollSpin();

    gsap.from(stage, {
      scale: 0.85, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: stage, start: 'top 78%', toggleActions: 'play none none reverse' }
    });
  } else {
    /* responsive / reduced-motion: flat, upright stack where every
       certificate stays fully readable. A light scroll-scrub makes each
       card rise, straighten and sharpen as it enters the viewport, then
       gently step aside as the next card takes over — pure scrub, so a
       card can never get stuck invisible. */
    setActive();
    if (reduced) {
      cards.forEach(c => { c.style.opacity = '1'; });
    } else {
      cards.forEach(card => {
        gsap.fromTo(card,
          { y: 150, rotateX: -16, scale: 0.92, autoAlpha: 0 },
          { y: 0, rotateX: 0, scale: 1, autoAlpha: 1, ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card, start: 'top 94%', end: 'top 42%',
              scrub: 0.7, toggleActions: 'play none none reverse',
              invalidateOnRefresh: true
            } });
        gsap.to(card, {
          y: -110, rotateX: 8, scale: 0.94, autoAlpha: 0.25, ease: 'none',
          scrollTrigger: {
            trigger: card, start: 'top 5%', end: 'top -26%',
            scrub: 0.8, invalidateOnRefresh: true
          }
        });
      });
    }
  }

  /* guard against resizing across the desktop / responsive breakpoint:
     entering desktop restarts the scroll-positioned rotation, leaving it
     resets the ring back to a clean upright flat stack (no skew/"ulta") */
  addEventListener('resize', () => {
    layout();
    if (!desk.matches) {
      ring.style.transform = '';
      cards.forEach(c => { c.style.transform = ''; });
    }
  }, { passive: true });

  /* hold each certificate photo at its real aspect ratio so object-fit:
     contain never needs to crop — the card takes the scan's own shape */
  cards.forEach(card => {
    const img = card.querySelector('.cert-img');
    const ph = card.querySelector('.cert-photo');
    if (!ph || !img) return;
    const apply = () => { if (img.naturalWidth > 0) ph.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`; };
    if (img.complete) apply(); else img.addEventListener('load', apply, { once: true });
  });

  /* Awards must NOT appear until every certificate has revealed:
     on desktop that means the ring has fully rotated through,
     on mobile it means the last stacked cert card has passed. */
  const strip = document.getElementById('awardsStrip');
  if (strip && !reduced) {
    gsap.from(strip, {
      y: 48, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: desk.matches ? stage : cards[cards.length - 1],
        start: () => (desk.matches ? 'bottom 62%' : 'bottom 80%'),
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true
      }
    });
  }
}

/* ============ VOLUNTEERING — MISSION DOSSIERS (no pin) ============
   Each folder's flap unseals as its card passes through the viewport.
   Pure scrub, no pinning → sections stay strictly sequential. */
export function initDossiers() {
  const field = document.getElementById('dosField');
  if (!field) return;

  const cards = gsap.utils.toArray('.dos-card', field);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desk = matchMedia('(min-width: 1025px)');
  if (!cards.length) return;

  if (reduced || !desk.matches) {
    gsap.set('.dos-flap', { rotationY: -150 });
    gsap.set('.dos-content', { opacity: 1, y: 0, scale: 1 });
    cards.forEach(card => {
      gsap.from(card, {
        y: 56, opacity: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' }
      });
    });
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
