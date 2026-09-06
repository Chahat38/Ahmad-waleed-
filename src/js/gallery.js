import { PORTFOLIO } from '../data/media.js';
import { requestPlay, releasePause } from './videoManager.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initGallery() {
  const track = document.getElementById('pgTrack');
  if (!track) return;

  const cards = [];
  const vids = [];

  function ensureSrc(vid) {
    if (!vid.src && vid.dataset.src) { vid.src = vid.dataset.src; vid.load(); }
  }

  PORTFOLIO.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'v-card';
    if (!p.video) card.classList.add('no-video');
    card.innerHTML = `
      <div class="v-media">
        <video muted loop playsinline preload="metadata" poster="${p.poster}"></video>
        <span class="v-num">0${i + 1}</span>
        <span class="v-scan"></span>
        <button class="v-play" type="button" aria-label="Play / pause video">
          <svg class="ico-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg class="ico-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
        </button>
      </div>
      <div class="v-info">
        <span class="v-tag">${p.tag}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <button class="v-cta" type="button">View Details<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>`;
    track.appendChild(card);
    cards.push(card);

    const vid = card.querySelector('video');
    if (p.video) vid.dataset.src = p.video;
    vids.push(vid);

    const media = card.querySelector('.v-media');
    media.addEventListener('click', () => {
      if (!p.video) return;
      ensureSrc(vid);
      if (vid.paused) {
        delete vid.dataset.userPaused;
        requestPlay(vid);
      } else {
        vid.dataset.userPaused = '1';
        vid.pause();
      }
    });

    const playBtn = card.querySelector('.v-play');
    if (!p.video) playBtn.style.display = 'none';
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      ensureSrc(vid);
      if (vid.paused) {
        delete vid.dataset.userPaused;
        requestPlay(vid);
      } else {
        vid.dataset.userPaused = '1';
        vid.pause();
      }
    });
    vid.addEventListener('play', () => playBtn.classList.add('playing'));
    vid.addEventListener('pause', () => playBtn.classList.remove('playing'));

    card.querySelector('.v-cta').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-detail', {
        detail: { title: p.title, tag: p.tag, body: p.detail, img: '', link: '' }
      }));
    });
  });

  const isDesktop = () => matchMedia('(min-width: 861px)').matches;
  let st = null;
  const bar = document.getElementById('pgBar');

  function buildDesktop() {
    const getDist = () => Math.max(0, track.scrollWidth - innerWidth);

    st = gsap.to(track, {
      x: () => -getDist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top top',
        end: () => '+=' + (getDist() + innerHeight * 0.15),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onRefresh: focusCenter,
        onUpdate: self => {
          if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          const skew = gsap.utils.clamp(-5, 5, self.getVelocity() / -400);
          cards.forEach(c => setSkew(c, skew));
          focusCenter();
        }
      }
    });

    return st;
  }

  const rotSet = new WeakMap();
  function setRot(card, val) {
    if (!rotSet.has(card)) rotSet.set(card, gsap.quickSetter(card, 'rotationY', 'deg'));
    rotSet.get(card)(val);
  }

  const skewTos = new WeakMap();
  function setSkew(card, val) {
    if (!skewTos.has(card)) skewTos.set(card, gsap.quickTo(card, 'skewX', { duration: 0.4, ease: 'power2.out' }));
    skewTos.get(card)(val);
  }

  const zSet = new WeakMap();
  function setFront(card, z) {
    if (!zSet.has(card)) zSet.set(card, gsap.quickSetter(card, 'z', 'px'));
    zSet.get(card)(z);
  }

  function focusCenter() {
    const cx = innerWidth / 2;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const d = r.left + r.width / 2 - cx;
      const norm = Math.max(-1, Math.min(1, d / (innerWidth * 0.55)));
      setRot(card, norm * -16);
      card.style.opacity = (1 - Math.min(0.5, Math.abs(norm) * 0.75)).toFixed(3);
      const center = Math.abs(d) < r.width * 0.48;
      card.classList.toggle('is-center', center);
      setFront(card, center ? 46 : 0);
      if (center) {
        ensureSrc(vids[i]);
        if (!vids[i].dataset.userPaused) requestPlay(vids[i]);
      } else {
        releasePause(vids[i]);
      }
    });
  }

  let mobileIO = null;
  function buildMobile() {
    mobileIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const i = cards.indexOf(en.target);
        const vid = vids[i];
        if (!vid) return;
        if (en.isIntersecting) {
          ensureSrc(vid);
          if (!vid.dataset.userPaused) requestPlay(vid);
        } else {
          releasePause(vid);
        }
      });
    }, { threshold: 0.35 });
    cards.forEach(c => mobileIO.observe(c));
  }
  function teardownMobile() {
    if (mobileIO) { mobileIO.disconnect(); mobileIO = null; }
    vids.forEach(v => releasePause(v));
  }

  const teardown = () => {
    if (st) { st.scrollTrigger && st.scrollTrigger.kill(); st = null; }
  };
  addEventListener('resize', () => {
    if (isDesktop() && !st) buildDesktop();
    else if (!isDesktop() && st) teardown();
    if (!isDesktop() && !mobileIO) buildMobile();
    else if (isDesktop() && mobileIO) teardownMobile();
  });
  addEventListener('load', () => {
    if (st && st.scrollTrigger) st.scrollTrigger.refresh();
    if (isDesktop()) requestAnimationFrame(() => focusCenter());
  });

  if (isDesktop()) buildDesktop();
  else buildMobile();
}
