/* ============ MOBILE-ONLY AMBIENT FX ============
   Keeps the phone view lively without heavy 3D work:
   scroll progress bar + gentle hero glow pulse + touch press feedback.
   Everything is gated to small screens + motion preference. */

export function initMobileFx() {
  if (!matchMedia('(max-width: 1024px)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* 1 — gradient scroll progress bar */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  const max = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const update = () => {
    const p = max() > 0 ? Math.min(1, scrollY / max()) : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);

  /* 2 — gentle parallax drift on section headings while scrolling */
  const heads = document.querySelectorAll('.section-head');
  heads.forEach(h => {
    const depth = h.closest('#volunteering, #certificates') ? 26 : 40;
    h.style.willChange = 'transform';
    const tick = () => {
      const r = h.getBoundingClientRect();
      const mid = r.top + r.height / 2 - innerHeight / 2;
      const k = Math.max(-1, Math.min(1, mid / (innerHeight / 2)));
      h.style.transform = `translateY(${(-k * depth * 0.35).toFixed(1)}px)`;
    };
    addEventListener('scroll', tick, { passive: true });
    tick();
  });
}