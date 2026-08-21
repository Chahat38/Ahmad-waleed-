import avatarUrl from './assets/models/ahmed-avatar.glb';
import headsetUrl from './assets/models/vr-headset.glb';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initNav } from './js/nav.js';
import { initTypewriter, initCursorGlow } from './js/effects.js';
import { initStats } from './js/stats.js';
import { initSkills } from './js/skills.js';
import { initBgVideos } from './js/bgVideo.js';
import { initGallery } from './js/gallery.js';
import { initScrollFX } from './js/scrollFx.js';
import { initCertRing, initDossiers } from './js/sections3d.js';
import { initPopup } from './js/popup.js';
import { initTilt } from './js/tilt.js';
import { initFabs } from './js/fabs.js';
import { initHeroScene, initAboutScene, initFixedVRScene, initFooterStarfield } from './js/three/scenes.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
initTypewriter();
initCursorGlow();
initStats();
initSkills();
initBgVideos();
initGallery();
initPopup();
initTilt();
initFabs();
initScrollFX();
initCertRing();
initDossiers();

initHeroScene(avatarUrl);
initAboutScene(headsetUrl);
initFixedVRScene(headsetUrl);
initFooterStarfield();

/* recalc all pins once fonts/media settle — prevents section overlap */
addEventListener('load', () => ScrollTrigger.refresh());
