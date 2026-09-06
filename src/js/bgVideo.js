import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinema } from '../data/media.js';

gsap.registerPlugin(ScrollTrigger);

export function initBgVideos() {
  document.querySelectorAll('video[data-cinema]').forEach(v => {
    const entry = cinema[v.dataset.cinema];
    if (!entry) return;
    const [src, poster] = entry;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.poster = poster;
    const section = v.closest('section') || v.parentElement;

    const retryOnInteraction = () => {
      if (v.paused && v.getAttribute('src')) v.play().catch(() => {});
      document.removeEventListener('pointerdown', retryOnInteraction);
      document.removeEventListener('keydown', retryOnInteraction);
      document.removeEventListener('touchstart', retryOnInteraction);
    };
    let inView = false;
    const tryPlay = () => {
      v.play().catch(() => {
        document.addEventListener('pointerdown', retryOnInteraction, { once: true });
        document.addEventListener('touchstart', retryOnInteraction, { once: true });
        document.addEventListener('keydown', retryOnInteraction, { once: true });
      });
    };

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        inView = e.isIntersecting;
        if (inView && !document.hidden) {
          if (!v.getAttribute('src')) { v.src = src; v.load(); }
          tryPlay();
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '250px' });
    io.observe(section);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) v.pause();
      else if (inView) tryPlay();
    });

    gsap.fromTo(v,
      { scale: 1.22, yPercent: -6 },
      {
        scale: 1.05, yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      });
  });
}
