import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let gltfLoader = null;
function getLoader() {
  if (!gltfLoader) gltfLoader = new GLTFLoader();
  return gltfLoader;
}

export function createLazyGLBScene(el, modelUrl, { targetSize = 3, spin = 0, bob = 0, onTick } = {}) {
  let renderer = null, scene, camera, group = null;
  let raf = 0, running = false, inited = false, t0 = performance.now();

  function setState(s) {
    el.classList.remove('is-loading', 'is-ready', 'is-failed');
    el.classList.add('is-' + s);
  }

  function fitCamera() {
    if (!renderer || !group) return;
    const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;

    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const fov = camera.fov * Math.PI / 180;
    const margin = 1.24;
    const halfH = (size.y / 2) * margin;
    const halfW = (size.x / 2) * margin;
    const distH = halfH / Math.tan(fov / 2);
    const distW = halfW / (Math.tan(fov / 2) * camera.aspect);
    const dist = Math.max(distH, distW);

    camera.position.set(center.x, center.y, center.z + dist);
    camera.lookAt(center.x, center.y, center.z);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
  }

  function loop(now) {
    const t = (now - t0) / 1000;
    if (group) {
      if (spin) group.rotation.y = t * spin;
      if (bob && group.userData.baseY !== undefined) {
        group.position.y = group.userData.baseY + Math.sin(t * 1.4) * bob;
      }
      onTick?.(group, t);
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }

  function start() { if (running || !renderer) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; running = false; }

  function loadModel() {
    setState('loading');
    getLoader().load(modelUrl,
      gltf => {
        group = gltf.scene;
        const box = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3(), center = new THREE.Vector3();
        box.getSize(size); box.getCenter(center);
        const scale = targetSize / (Math.max(size.x, size.y, size.z) || 1);
        group.scale.setScalar(scale);
        group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        group.userData.baseY = group.position.y;
        group.updateMatrixWorld(true);
        scene.add(group);
        fitCamera();
        requestAnimationFrame(fitCamera);
        setTimeout(fitCamera, 350);
        setState('ready');
        start();
      },
      undefined,
      err => {
        console.error('[3D] load failed:', modelUrl, err);
        setState('failed');
      }
    );
  }

  function init() {
    inited = true;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.prepend(renderer.domElement);
    } catch (err) {
      console.warn('[3D] WebGL unavailable:', err);
      setState('failed');
      return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2cc, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0xff8c42, 1.8); rim.position.set(-4, -2, -3);
    const fill = new THREE.DirectionalLight(0xffb37a, 1.0); fill.position.set(2, -3, 2);
    scene.add(key, rim, fill);

    addEventListener('resize', fitCamera, { passive: true });

    loadModel();

    el.addEventListener('click', () => {
      if (!el.classList.contains('is-failed') || group) return;
      if (group) scene.remove(group);
      group = null;
      loadModel();
    });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { inited ? start() : init(); }
      else stop();
    });
  }, { rootMargin: '200px' });
  io.observe(el);

  setState('loading');
}
