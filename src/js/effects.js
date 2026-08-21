const ROLES = ['AR DEVELOPER', 'VR DEVELOPER', 'XR ENGINEER', 'UNITY DEVELOPER', 'TECHNICAL LEAD'];

export function initTypewriter() {
  const el = document.getElementById('eyebrowType');
  if (!el) return;
  let ri = 0, ci = ROLES[0].length, deleting = false;

  function tick() {
    const word = ROLES[ri];
    ci += deleting ? -1 : 1;
    el.textContent = word.slice(0, ci);
    let delay = deleting ? 38 : 74;
    if (!deleting && ci >= word.length) { delay = 1700; deleting = true; }
    else if (deleting && ci <= 0) { deleting = false; ri = (ri + 1) % ROLES.length; delay = 420; }
    setTimeout(tick, delay);
  }
  tick();
}

export function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || matchMedia('(hover: none)').matches) return;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;

  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

  (function loop() {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.transform = `translate3d(${x - 190}px, ${y - 190}px, 0)`;
    requestAnimationFrame(loop);
  })();
}
