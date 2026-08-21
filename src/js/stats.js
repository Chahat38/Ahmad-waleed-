export function initStats() {
  const wrap = document.getElementById('heroStats');
  if (!wrap) return;
  const nums = wrap.querySelectorAll('.hstat-num');

  function run() {
    nums.forEach(el => {
      const target = +el.closest('.hstat').dataset.count;
      const suffix = el.closest('.hstat').dataset.suffix || '';
      const t0 = performance.now(), dur = 1400;
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) run();
      else nums.forEach(el => { el.textContent = '0'; });
    });
  }, { threshold: 0.4 });
  io.observe(wrap);
}
