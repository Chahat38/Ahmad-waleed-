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
    id: 'prototype',
    title: 'VR Welding Training Sim',
    tag: 'META QUEST · UNITY 6 · FUSION 2',
    video: pPrototype,
    poster: posterPrototype,
    desc: 'Standalone multiplayer welding simulator for Quest 2/3/3S with realistic torch physics and scoring.',
    detail: [
      'Full training loop — briefing, hands-on welding practice, graded evaluation and debrief.',
      'Photon Fusion 2 shared-mode sessions so trainees and instructors join the same sim.',
      '45–50% runtime performance improvement via batching, atlasing and occlusion culling.'
    ]
  },
  {
    id: 'bowling',
    title: 'VR Bowling Multiplayer',
    tag: 'META QUEST · PUN2 · PHYSICS',
    video: pBowling,
    poster: posterBowling,
    desc: 'Social VR bowling alley with room-scale throwing physics and real-time multiplayer lanes.',
    detail: [
      'PUN2 networking with synchronized ball physics and lane state across clients.',
      'Velocity-based throw detection tuned against real bowling feel on Quest controllers.',
      'Latency-compensated scoring so every client agrees on pin falls.'
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
    id: 'ecommerce',
    title: 'AR Ecommerce Try-On',
    tag: 'AR FOUNDATION · RETAIL',
    video: pEcommerce,
    poster: posterEcommerce,
    desc: 'Product preview AR for online stores — drop items into your space before you buy.',
    detail: [
      'Catalog-driven placement with scale/rotate gestures and shadow catching.',
      'Lightweight asset pipeline keeps models under budget for fast mobile loads.',
      'Deep-link ready so product pages can launch straight into AR view.'
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
