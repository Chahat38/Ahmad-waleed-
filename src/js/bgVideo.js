import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinema } from '../data/media.js';

gsap.registerPlugin(ScrollTrigger);

export function initBgVideos() {
  document.querySelectorAll('video[data-cinema]').forEach(v => {
    const entry = cinema[v.dataset.cinema];
    if (!entry) return;
    const [src, poster] = entry;
    v.poster = poster;
    const section = v.closest('section') || v.parentElement;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) { v.src = src; v.load(); }
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '250px' });
    io.observe(section);

    gsap.fromTo(v,
      { scale: 1.22, yPercent: -6 },
      {
        scale: 1.05, yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      });
  });
}
