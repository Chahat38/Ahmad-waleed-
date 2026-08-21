import * as THREE from 'three';
import { createLazyGLBScene } from './lazyScene.js';

export function initHeroScene(avatarUrl) {
  const el = document.getElementById('heroAvatarCanvas');
  if (el) createLazyGLBScene(el, avatarUrl, { targetSize: 4.0, spin: 0, bob: 0 });
}

export function initAboutScene(headsetUrl) {
  const el = document.getElementById('aboutCanvas');
  if (el) createLazyGLBScene(el, headsetUrl, { targetSize: 3.3, spin: 0.35 });
}

export function initFixedVRScene(headsetUrl) {
  const el = document.getElementById('fixedVRCanvas');
  if (el) createLazyGLBScene(el, headsetUrl, { targetSize: 2.6, spin: 0.55 });
}

export function initFooterStarfield() {
  const el = document.getElementById('footerCanvas');
  if (!el) return;

  let renderer = null, scene, camera, points;
  let raf = 0, running = false;

  function resize() {
    if (!renderer) return;
    const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function loop() {
    points.rotation.y += 0.0004;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  function start() { if (running || !renderer) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; running = false; }

  function init() {
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      el.appendChild(renderer.domElement);
    } catch { return; }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 8;

    const count = 700;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xe86d22, size: 0.05, transparent: true,
      opacity: 0.4, depthWrite: false
    });
    points = new THREE.Points(geo, mat);
    scene.add(points);

    resize();
    addEventListener('resize', resize, { passive: true });
    start();
  }

  new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? (renderer ? start() : init()) : stop());
  }, { rootMargin: '150px' }).observe(el);
}
