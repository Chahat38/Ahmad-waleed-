import reel1 from '../assets/media/reel-1.mp4';
import reel2 from '../assets/media/reel-2.mp4';
import reel3 from '../assets/media/reel-3.mp4';
import reel4 from '../assets/media/reel-4.mp4';
import pPrototype from '../assets/media/p-prototype.mp4';
import pBowling from '../assets/media/p-bowling.mp4';
import pComic from '../assets/media/p-comic.mp4';
import pPetrobo from '../assets/media/p-petrobo.mp4';
import pEffects from '../assets/media/p-effects.mp4';
import pEcommerce from '../assets/media/p-ecommerce.mp4';
import pMarker from '../assets/media/p-marker.mp4';

import posterReel1 from '../assets/posters/reel-1.jpg';
import posterReel2 from '../assets/posters/reel-2.jpg';
import posterReel3 from '../assets/posters/reel-3.jpg';
import posterReel4 from '../assets/posters/reel-4.jpg';
import posterPrototype from '../assets/posters/p-prototype.jpg';
import posterBowling from '../assets/posters/p-bowling.jpg';
import posterComic from '../assets/posters/p-comic.jpg';
import posterPetrobo from '../assets/posters/p-petrobo.jpg';
import posterEffects from '../assets/posters/p-effects.jpg';
import posterEcommerce from '../assets/posters/p-ecommerce.jpg';
import posterMarker from '../assets/posters/p-marker.jpg';

export const cinema = {
  reel1: [reel1, posterReel1],
  reel2: [reel2, posterReel2],
  reel3: [reel3, posterReel3],
  reel4: [reel4, posterReel4]
};

export const PORTFOLIO = [
  {
    id: 'tourguide',
    title: 'AR Tourist Guide — Historical Buildings',
    tag: 'AR FOUNDATION · UNITY · XRCC 2026',
    video: pPrototype,
    poster: posterPrototype,
    desc: 'Award-winning AR tourist guide from XR Creator Con (XRCC) 2026 — point your phone at a heritage building and the "Visitor Companion" reveals visitor counts, historical info, ratings and more.',
    detail: [
      'Award Recipient at XR Creator Con (XRCC) 2026 — "Visitor Companion: See More, Miss Nothing" use case category.',
      'Camera-triggered AR overlays on historical buildings with visitor count, ratings and historical background.',
      'Unity + AR Foundation pipeline targeting mobile, tuned for quick point-and-scan usage at heritage sites.'
    ]
  },
  {
    id: 'bowling',
    title: 'AR Bowling Game (Final Year Project)',
    tag: 'UNITY · C# · VUFORIA · ARCORE / ARKIT · ANDROID',
    video: pBowling,
    poster: posterBowling,
    desc: 'Native Android/mobile AR bowling game with plane detection, realistic physics, interactive scoring, TextMesh Pro UI, and mobile performance optimization.',
    detail: [
      'Plane detection and realistic physics for AR lanes.',
      'Interactive scoring with TextMesh Pro UI.',
      'Cross-platform ARCore / ARKit support and mobile performance optimization.'
    ]
  },
  {
    id: 'ecommerce',
    title: 'AR E-Commerce Try-On',
    tag: 'UNITY · TIKTOK EFFECT HOUSE · ANDROID (NATIVE)',
    video: pEcommerce,
    poster: posterEcommerce,
    desc: 'AR try-on experience for jewelry and watches using live-camera 3D overlays, linked with e-commerce APIs for a real-time shopping experience.',
    detail: [
      'Live-camera 3D overlays for jewelry and watch try-on.',
      'Linked with e-commerce APIs for a real-time shopping experience.',
      'Unity + TikTok Effect House pipeline targeting native Android.'
    ]
  },
  {
    id: 'comic',
    title: 'Comic AR Face Effect',
    tag: 'AR FOUNDATION · FACE TRACKING',
    video: pComic,
    poster: posterComic,
    desc: 'Real-time comic-book face filter with ink outlines and halftone shading driven by face tracking.',
    detail: [
      'AR Foundation face subsystem driving a stylized shader stack in real time.',
      'Custom cel/ink post-processing tuned to hold 60fps on mid-range Android devices.',
      'Shareable capture flow so users can export clips straight from the app.'
    ]
  },
  {
    id: 'petrobo',
    title: 'Pet Robo AR Companion',
    tag: 'ARCORE · INTERACTION',
    video: pPetrobo,
    poster: posterPetrobo,
    desc: 'A robotic pet that lives on your desk — place it, feed it, play with it through AR touch.',
    detail: [
      'Plane detection and anchoring keep the pet stable across sessions.',
      'State machine drives idle, follow, feed and play behaviours with animation blending.',
      'Touch raycasting interaction with haptic-style feedback cues.'
    ]
  },
  {
    id: 'effects',
    title: 'Immersive Event AR FX',
    tag: 'VUFORIA · MARKER AR',
    video: pEffects,
    poster: posterEffects,
    desc: 'Marker-triggered stage effects for live events — scan the marker, watch the venue come alive.',
    detail: [
      'Vuforia image targets printed across event branding trigger unique effect scenes.',
      'Particle systems and audio synced to each marker for a coordinated show.',
      'Optimized draw calls so the effects run smoothly on borrowed event devices.'
    ]
  },
  {
    id: 'marker',
    title: 'Marker AR Immersive Event',
    tag: 'VUFORIA · EVENT TECH',
    video: pMarker,
    poster: posterMarker,
    desc: 'Large-scale marker AR for immersive events — posters become portals into 3D worlds.',
    detail: [
      'Multiple simultaneous image targets tracked with extended tracking.',
      'Portal-style reveal transitions anchored to printed artwork.',
      'Built for walk-up-and-scan usability — no onboarding needed.'
    ]
  }
];