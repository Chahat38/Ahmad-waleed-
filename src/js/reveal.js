import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
  const els = gsap.utils.toArray('[data-reveal]');
  if (!els.length) return;

  gsap.set(els, { opacity: 0, y: 36, rotateX: -8, transformPerspective: 900 });

  ScrollTrigger.batch(els, {
    start: 'top 88%',
    once: true,
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: true
      });
    }
  });
}
