import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCertificates() {
  const wrap = document.getElementById('certWrap');
  if (!wrap) return;
  const cards = [...wrap.querySelectorAll('.cert-card')];
  const N = cards.length;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top 78%',
      end: '+=70%',
      scrub: 0.6
    }
  });

  cards.forEach((card, i) => {
    const mid = (N - 1) / 2;
    const off = i - mid;
    const tilt = (i % 2 ? 1 : -1) * (3 + i * 1.2);
    tl.fromTo(card,
      { opacity: 0, y: 110, rotate: tilt - 8, scale: 0.82 },
      { opacity: 1, y: Math.abs(off) * 24, rotate: off * 6 + tilt * 0.4, scale: 1 - Math.abs(off) * 0.03, ease: 'power2.out' },
      i * 0.09
    );
  });

  cards.forEach((card, i) => {
    card.style.zIndex = String(N - i);
    card.addEventListener('mouseenter', () => { card.style.zIndex = '50'; });
    card.addEventListener('mouseleave', () => { card.style.zIndex = String(N - i); });
  });
}
