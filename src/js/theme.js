export function initTheme() {
  const btn = document.getElementById('themeToggle');
  const meta = document.querySelector('meta[name="theme-color"]');

  const syncMeta = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    meta?.setAttribute('content', dark ? '#07080c' : '#ffffff');
  };
  syncMeta();

  btn?.addEventListener('click', () => {
    const root = document.documentElement;
    root.classList.add('theme-fade');
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('aw-theme', next); } catch {}
    syncMeta();
    setTimeout(() => root.classList.remove('theme-fade'), 450);
  });
}
