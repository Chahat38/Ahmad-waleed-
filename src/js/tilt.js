export function initTilt() {
  if (matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.t-card, .v-card, .vol-card').forEach(card => {
    let raf = 0;
    card.addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--tiltX', (-py * 5).toFixed(2) + 'deg');
        card.style.setProperty('--tiltY', (px * 7).toFixed(2) + 'deg');
      });
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
    });
  });
}
