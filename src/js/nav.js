export function initNav() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const list = document.getElementById('navList');
  const links = [...list.querySelectorAll('a')];

  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });

  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
}
