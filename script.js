// ================= NAV =================
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', ()=> navList.classList.toggle('open'));
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> navList.classList.remove('open')));

// Navbar starts blended into the hero (transparent, part of it); once the page
// scrolls past that opening view, it detaches into a floating glass panel.
const headerEl = document.querySelector('header');
if(headerEl){
  const setScrolled = ()=> headerEl.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', setScrolled, {passive:true});
  setScrolled();
}

// ================= Global scroll-driven "world" state =================
// A single shared scroll-velocity value that every 3D scene reads to spin up
// while the user is actively scrolling — the shapes visibly react to your
// input instead of just spinning at a flat constant rate, which is what makes
// scrolling feel like it's driving a 3D world rather than just a page.
window.__scrollVelocity = 0;
let __lastScrollY = window.scrollY;
(function scrollVelocityLoop(){
  const dy = window.scrollY - __lastScrollY;
  __lastScrollY = window.scrollY;
  window.__scrollVelocity = window.__scrollVelocity * 0.9 + dy * 0.1;
  requestAnimationFrame(scrollVelocityLoop);
})();

// Thin glowing progress bar across the very top — always-on feedback for how
// far through the site you are, game-loading-bar style.
(function scrollProgressBar(){
  const bar = document.createElement('div');
  bar.id = 'scrollProgressBar';
  document.body.appendChild(bar);
  function update(){
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();

// Fixed HUD readout in the corner — "02 / 07 — SKILLS" style — showing which
// section currently owns the viewport, updating live as you scroll. Reinforces
// the game-HUD / AR-overlay identity of the whole site.
(function sectionHud(){
  const sections = Array.from(document.querySelectorAll('.stack-section'));
  if(!sections.length) return;
  const hud = document.createElement('div');
  hud.id = 'sectionHud';
  hud.innerHTML = '<span class="hud-index">01</span><span class="hud-sep">/</span><span class="hud-total">' +
    String(sections.length).padStart(2,'0') + '</span><span class="hud-name"></span>';
  document.body.appendChild(hud);
  const indexEl = hud.querySelector('.hud-index');
  const nameEl = hud.querySelector('.hud-name');
  function update(){
    const vhMid = window.innerHeight * 0.5;
    let active = 0, bestDist = Infinity;
    sections.forEach((s,i)=>{
      const r = s.getBoundingClientRect();
      const dist = Math.abs((r.top + r.height/2) - vhMid);
      if(dist < bestDist){ bestDist = dist; active = i; }
    });
    indexEl.textContent = String(active+1).padStart(2,'0');
    nameEl.textContent = (sections[active].querySelector('h2, h1')?.textContent || sections[active].id || '').trim();
  }
  window.addEventListener('scroll', ()=> requestAnimationFrame(update), {passive:true});
  window.addEventListener('resize', update);
  update();
})();

// ================= HERO word-by-word reveal =================
document.querySelectorAll('.hero h1 .word').forEach((w,i)=>{
  w.style.animationDelay = (0.15 + i*0.09) + 's';
});

// ================= HERO: typewriter role cycler =================
(function typewriter(){
  const el = document.getElementById('eyebrowType');
  if(!el) return;
  const roles = ['XR / AR / VR UNITY DEVELOPER','META QUEST BUILDER','PHOTON MULTIPLAYER ENGINEER'];
  let r = 0, i = 0, deleting = false;
  function tick(){
    const full = roles[r];
    el.textContent = deleting ? full.slice(0, i--) : full.slice(0, i++);
    let delay = deleting ? 35 : 55;
    if(!deleting && i > full.length){ deleting = true; delay = 1400; }
    else if(deleting && i < 0){ deleting = false; i = 0; r = (r+1) % roles.length; delay = 400; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1600);
})();

// ================= Cursor glow (desktop only) =================
if(window.matchMedia('(pointer: fine)').matches){
  const glow = document.getElementById('cursorGlow');
  if(glow){
    document.addEventListener('mousemove', (e)=>{
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', ()=>{ glow.style.opacity = '0'; });
  }
}

// ================= Resilience: if Three.js somehow failed to load, show flat
// video backgrounds instead of leaving every section blank. Every section's
// raw <video> is deliberately shrunk to 2px/opacity:0 in CSS (see
// .section-video-bg-source) because Three.js normally re-projects it onto a
// canvas — if that canvas never arrives, this puts the plain video back on
// screen so the site still looks alive rather than empty black panels. =================
window.addEventListener('load', ()=>{
  if(typeof THREE !== 'undefined') return;
  console.warn('Three.js did not load — using flat video backgrounds (no 3D scrub/parallax/models).');
  document.querySelectorAll('.section-video-bg-source').forEach(v=>{
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:.32;object-fit:cover;';
    v.loop = true;
    v.play().catch(()=>{});
  });
});

// ================= Icon set (shared) =================
const icons = {
  ar: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="3"/><circle cx="8.5" cy="13" r="2"/><circle cx="15.5" cy="13" r="2"/><path d="M9 7l1.5-3h3L15 7"/></svg>',
  cube: '<svg viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>',
  play: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3V9z"/></svg>',
  hand: '<svg viewBox="0 0 24 24"><path d="M7 11V6a1.5 1.5 0 013 0v4"/><path d="M10 10V4a1.5 1.5 0 013 0v6"/><path d="M13 10V6a1.5 1.5 0 013 0v6"/><path d="M16 12V9a1.5 1.5 0 013 0v6c0 3-2 6-6 6h-2c-3 0-5-1.5-6.5-4L3 14"/></svg>',
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>'
};

// ================= PORTFOLIO VID: real project videos orbiting the VR avatar =================
// type:'local' uses an uploaded clip as both the card thumbnail and the popup player.
// type:'youtube' uses the official YouTube thumbnail on the card, and embeds the video in
// the popup — these are placeholder demo clips (marked "reference clip") until Ahmed swaps
// in his own captured footage for these two projects.
const videos = [
  {icon:icons.hand, title:'PTTI VR Training Suite', sub:'Welding · Manufacturing · Drywall', type:'local', src:'assets/videos/reel-1.mp4',
    detail:'Three standalone VR training simulations for Meta Quest 2/3/3S, built end‑to‑end in Unity 6.||Welding, Manufacturing Facility and Drywall & Carpentry modules, each with guided step‑by‑step tasks.||Photon Fusion 2 / PUN2 multiplayer lets a trainer and trainee share one session in real time.||Contributed to a 45–50% improvement in app size and FPS on standalone Quest hardware.'},
  {icon:icons.globe, title:'AR Historical Tourist Guide', sub:'Vuforia · Android', type:'local', src:'assets/videos/reel-2.mp4',
    detail:'Native Android AR app that overlays historical info on real landmarks using Vuforia image‑target recognition.||Includes audio guidance and interactive navigation, with mobile‑optimized 3D assets built in Blender.||Award recipient — "Visitor Companion: See More, Miss Nothing" category, XR Creator Con (XRCC) 2026.'},
  {icon:icons.play, title:'AR Bowling Game', sub:'Final Year Project', type:'local', src:'assets/videos/reel-3.mp4',
    detail:'Markerless AR bowling built on ARCore/ARKit plane detection — the lane spawns on any flat surface.||Realistic physics tuning for pin knock‑down feel and ball roll, with TextMesh Pro scoring UI.||Final year capstone project at KUST, playtested for a full semester on Android.'},
  {icon:icons.cube, title:'AR E-Commerce Try-On', sub:'Jewelry & Watches · TikTok Effect House', type:'local', src:'assets/videos/reel-4.mp4',
    detail:'Live‑camera AR try‑on for jewelry and watches, built with TikTok Effect House for Android.||Linked with e‑commerce APIs so a product page can drive a real‑time "Try in AR" shopping experience.||Focus on realistic scale and lighting so the product reads as physically present.'},
  {icon:icons.ar, title:'Car Simulation Game', sub:'Unity 3D · Vehicle Physics — reference clip', type:'youtube', yt:'HCuJi2pntOw',
    detail:'Realistic car simulation focused on vehicle physics and dynamics in Unity 3D, using .fbx assets and C# vehicle control scripting.||Reference clip shown — swap this for Ahmed\'s own captured gameplay footage.'},
  {icon:icons.cube, title:'2D-to-3D Drawing Tool', sub:'Custom Shaders — reference clip', type:'youtube', yt:'3zxTigjJr24',
    detail:'AR tool that converts a flat 2D sketch into a shaded, real‑time 3D visualization, aimed at artists, students and designers.||Uses custom shaders for edge detection and depth‑faking on the extrusion.||Reference clip shown — swap this for Ahmed\'s own captured gameplay footage.'}
];

const videoOrbitWrap = document.getElementById('videoOrbitWrap');
videos.forEach((v, i)=>{
  const item = document.createElement('div');
  item.className = 'video-grid-item';
  const thumbInner = v.type === 'local'
    ? `<video src="${v.src}" muted loop playsinline autoplay preload="metadata"></video>`
    : `<img src="https://img.youtube.com/vi/${v.yt}/hqdefault.jpg" alt="${v.title} reference clip" loading="lazy">`;
  const detailAttrs = v.type === 'local'
    ? `data-detail-video="${v.src}"`
    : `data-detail-yt="${v.yt}"`;
  const cornerTag = v.type === 'youtube'
    ? '<span class="ref-clip-tag">Reference clip</span>'
    : '<span class="live-tag"><span class="live-dot"></span>Preview</span>';
  item.innerHTML = `
    <div class="video-node" data-detail-title="${v.title}" data-detail-tag="${v.sub}" data-detail-body="${v.detail}" ${detailAttrs}>
      ${thumbInner}
      <div class="video-scrim"></div>
      <span class="video-index">${String(i+1).padStart(2,'0')}</span>
      ${cornerTag}
      <div class="media-play-badge">${icons.play}</div>
      <div class="video-copy">
        <span class="video-sub">${v.sub}</span>
        <h4>${v.title}</h4>
        <button class="watch-btn" type="button">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> View Details
        </button>
      </div>
    </div>`;
  videoOrbitWrap.appendChild(item);
});
const videoNodes = document.querySelectorAll('.video-node');

// ================= Shared orbit engine (used by About) =================
// Positions the WRAPPER (.orbit-item) every frame. The wrapper's transform is never
// touched by CSS animations, so it can't be fought over by entrance keyframes.
function createOrbit(nodeList, {radiusDesktop, radiusMobile, yFlatten=1, speed=0.0028, startAngle=0}){
  let angle = startAngle;
  function layout(){
    const isMobile = window.innerWidth <= 860;
    // On narrow phones, radiusMobile can still be wider than the viewport itself —
    // clamp it to a fraction of the actual screen width so orbiting cards never
    // get clipped off-screen.
    const radius = isMobile ? Math.min(radiusMobile, window.innerWidth * 0.4) : radiusDesktop;
    const n = nodeList.length;
    nodeList.forEach((node,i)=>{
      const a = angle + (i * (2*Math.PI/n));
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius * yFlatten;
      node.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px)`;
    });
  }
  layout();
  window.addEventListener('resize', layout);
  (function loop(){
    angle += speed;
    layout();
    requestAnimationFrame(loop);
  })();
}

const aboutOrbitItems = document.querySelectorAll('#aboutWrap .orbit-item');
createOrbit(aboutOrbitItems, {radiusDesktop:270, radiusMobile:175, yFlatten:0.68, speed:0.0016, startAngle:0.6});

// ================= Per-card varied entrance animations =================
// Each card in a group gets a different keyframe (cycles through 6 variants)
// so no two neighbouring cards animate in identically.
const entranceKeyframes = ['cardIn0','cardIn1','cardIn2','cardIn3','cardIn4','cardIn5'];
function applyVariedEntrance(list, {duration=0.85, stagger=0.09, baseDelay=0}={}){
  list.forEach((el,i)=>{
    el.dataset.enterAnim = entranceKeyframes[i % entranceKeyframes.length];
    el.dataset.enterDelay = (baseDelay + i*stagger).toFixed(2);
    el.dataset.enterDuration = duration;
  });
}
function playEntrance(el){
  if(!el.dataset.enterAnim) return;
  // force a reflow so the animation restarts even if it already ran once
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = `${el.dataset.enterAnim} ${el.dataset.enterDuration}s cubic-bezier(.16,.9,.28,1) ${el.dataset.enterDelay}s forwards`;
}
function resetEntrance(el){
  if(!el.dataset.enterAnim) return;
  el.style.animation = 'none';
  el.style.opacity = '0';
}

applyVariedEntrance(videoNodes, {duration:0.9, stagger:0.12});
applyVariedEntrance(document.querySelectorAll('.vol-item'), {duration:0.85, stagger:0.15});
applyVariedEntrance(document.querySelectorAll('.orbit-note'), {duration:0.85, stagger:0.12});

// ================= PORTFOLIO VID: DNA / HELIX cinematic orbit =================
// The six project videos form two rotating strands around a luminous center spine.
// Scroll drives the helix phase and camera depth; the videos themselves keep playing
// continuously instead of being frozen by scroll-scrubbing.
(function portfolioDNAHelix(){
  const wrap = document.getElementById('videoOrbitWrap');
  const cards = Array.from(document.querySelectorAll('#videoOrbitWrap .video-grid-item'));
  if(!wrap || !cards.length) return;

  // Keep every local project clip playing whenever it is available.
  cards.forEach(card=>{
    const vid = card.querySelector('video');
    if(!vid) return;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    const start = ()=>vid.play().catch(()=>{});
    if(vid.readyState >= 2) start();
    else vid.addEventListener('loadeddata', start, {once:true});

    if('IntersectionObserver' in window){
      new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting) start();
          else vid.pause();
        });
      }, {threshold:0.04, rootMargin:'180px 0px 180px 0px'}).observe(card);
    }
  });

  // Decorative center spine.
  const spine = document.createElement('div');
  spine.className = 'dna-spine';
  spine.innerHTML = '<span class="dna-core"></span><span class="dna-pulse p1"></span><span class="dna-pulse p2"></span><span class="dna-pulse p3"></span>';
  wrap.prepend(spine);

  let phase = 0;
  let targetPhase = 0;
  let lastScroll = window.scrollY;

  function updateTarget(){
    const rect = wrap.getBoundingClientRect();
    const centerOffset = (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5));
    const velocity = window.__scrollVelocity || 0;
    targetPhase = centerOffset * 0.0045 + velocity * 0.045;
  }
  window.addEventListener('scroll', updateTarget, {passive:true});
  window.addEventListener('resize', updateTarget);
  updateTarget();

  function tick(){
    const mobile = window.innerWidth <= 860;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const radius = mobile ? Math.min(w * 0.28, 125) : Math.min(w * 0.22, 235);
    const stepY = mobile ? 190 : 220;
    const pairCount = Math.ceil(cards.length / 2);
    const totalHeight = (pairCount - 1) * stepY;
    const scrollSpin = (window.__scrollVelocity || 0) * 0.018;

    phase += (targetPhase - phase) * 0.055;
    phase += scrollSpin * 0.18;

    cards.forEach((card, i)=>{
      const pair = Math.floor(i / 2);
      const strand = i % 2;
      const y = (pair - (pairCount - 1)/2) * stepY;

      // Opposite sides of the spine, with a phase offset that creates the DNA twist.
      const a = phase + (strand ? Math.PI : 0);
      const x = Math.sin(a) * radius;
      const z = Math.cos(a) * radius;
      const depth = (z + radius) / (2 * radius);
      const scale = 0.82 + depth * 0.20;
      const rotY = Math.cos(a) * -18;
      const rotZ = Math.sin(a) * 3.5;

      card.style.transform =
        `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) ` +
        `rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`;
      card.style.zIndex = String(20 + Math.round(depth * 30));
      card.style.opacity = String(0.64 + depth * 0.36);
    });

    // Spine glow responds to scroll speed.
    const energy = Math.min(1, Math.abs(window.__scrollVelocity || 0) / 18);
    spine.style.setProperty('--dna-energy', energy.toFixed(3));

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


// ================= SAFE CINEMATIC SCROLL CONTROLLER =================
(function safeCinematicScroll(){
  window.__cinematic3D=window.__cinematic3D||{
    progress:0,velocity:0,direction:1,section:null,mouseX:0,mouseY:0
  };
  let lastY=window.scrollY,lastT=performance.now();

  function onScroll(){
    const now=performance.now(), y=window.scrollY;
    const dt=Math.max(8,now-lastT);
    const raw=((y-lastY)/dt)*1000;
    const v=Math.max(-25,Math.min(25,raw));
    window.__cinematic3D.velocity += (v-window.__cinematic3D.velocity)*.16;
    window.__cinematic3D.direction=v>=0?1:-1;
    window.__scrollVelocity=window.__cinematic3D.velocity;
    lastY=y;lastT=now;
  }
  addEventListener('scroll',onScroll,{passive:true});

  // Mouse state is data-only. It never transforms normal page sections.
  if(matchMedia?.('(pointer:fine)').matches){
    addEventListener('pointermove',e=>{
      window.__cinematic3D.mouseX=e.clientX/innerWidth*2-1;
      window.__cinematic3D.mouseY=e.clientY/innerHeight*2-1;
    },{passive:true});
  }

  function update(){
    window.__cinematic3D.progress=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();

// ================= THREE.JS SAFE RESIZE =================
(function safeThreeResize(){
  function resizeCanvas(id){
    const el=document.getElementById(id);
    if(!el)return;
    const parent=el.parentElement;
    if(!parent)return;
    // Trigger layout only on the 3D canvas itself. Never transform its ancestors.
    const r=parent.getBoundingClientRect();
    if(r.width>0 && r.height>0){
      el.style.visibility='visible';
      el.style.opacity='1';
    }
  }

  function refresh(){
    ['heroAvatarCanvas','aboutCanvas','skillsCanvas','certificateCanvas','volunteerCanvas','heroCanvas']
      .forEach(resizeCanvas);
    window.dispatchEvent(new Event('three-layout-ready'));
  }

  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,0),{once:true});
  else setTimeout(refresh,0);

  addEventListener('load',()=>setTimeout(refresh,40),{once:true});
  addEventListener('resize',()=>setTimeout(refresh,40),{passive:true});
  setTimeout(refresh,250);
  setTimeout(refresh,1000);
})();

// ================= PORTFOLIO SPRING HELIX =================
(function portfolioSpring(){
  const wrap=document.getElementById('videoOrbitWrap');
  const cards=[...document.querySelectorAll('#videoOrbitWrap .video-grid-item')];
  if(!wrap||!cards.length)return;

  cards.forEach(card=>{
    const v=card.querySelector('video');
    if(!v)return;
    v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';
    const play=()=>v.play().catch(()=>{});
    if(v.readyState>=2)play();
    else v.addEventListener('loadeddata',play,{once:true});
    v.addEventListener('canplay',play,{passive:true});
  });

  let phase=0,targetPhase=0;
  function updateTarget(){
    const r=wrap.getBoundingClientRect();
    targetPhase=(innerHeight/2-(r.top+r.height/2))*.003+
      (window.__scrollVelocity||0)*.035;
  }
  addEventListener('scroll',updateTarget,{passive:true});
  addEventListener('resize',updateTarget,{passive:true});
  updateTarget();

  function frame(){
    phase+=(targetPhase-phase)*.05;
    const mobile=innerWidth<=760;
    const radius=mobile?Math.min(wrap.clientWidth*.25,90):Math.min(wrap.clientWidth*.19,210);
    const step=mobile?180:205;
    const spread=(cards.length-1)*step;

    cards.forEach((card,i)=>{
      const a=phase+i*.88;
      const x=Math.sin(a)*radius;
      const z=Math.cos(a)*radius;
      const y=(i/(Math.max(1,cards.length-1))-.5)*spread+Math.sin(a*.65)*20;
      const depth=(z+radius)/(2*radius);
      const scale=.86+depth*.16;
      card.style.transform=
        `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) `+
        `rotateY(${-Math.cos(a)*22}deg) rotateZ(${Math.sin(a)*3}deg) scale(${scale})`;
      card.style.zIndex=100+Math.round(depth*100);
      card.style.opacity=.84+depth*.16;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ================= 3D MODEL VISIBILITY =================
(function modelVisibility(){
  const ids=['heroAvatarCanvas','aboutCanvas','skillsCanvas','certificateCanvas','volunteerCanvas'];
  function wake(){
    ids.forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      el.style.visibility='visible';
      el.style.opacity='1';
      el.style.display='block';
      const p=el.parentElement;
      if(p){
        p.style.visibility='visible';
        p.style.opacity='1';
        p.style.overflow='visible';
      }
    });
  }
  wake();setTimeout(wake,100);setTimeout(wake,500);setTimeout(wake,1200);
})();


(function portfolioSpring(){
  const wrap=document.getElementById('videoOrbitWrap');
  const cards=[...document.querySelectorAll('#videoOrbitWrap .video-grid-item')];
  if(!wrap||!cards.length)return;

  cards.forEach((card,i)=>{
    const v=card.querySelector('video');
    if(!v)return;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;
    v.preload='auto';
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');
    v.style.visibility='visible';
    v.style.display='block';

    const play=()=>v.play().catch(()=>{});
    if(v.readyState>=2)play();
    else v.addEventListener('loadeddata',play,{once:true});
    v.addEventListener('canplay',play,{passive:true});

    // Never allow a browser visibility optimization to leave the portfolio
    // video visually blank.
    if('IntersectionObserver' in window){
      new IntersectionObserver(entries=>{
        entries.forEach(e=>{
          if(e.isIntersecting) play();
        });
      },{threshold:.01,rootMargin:'300px 0px'}).observe(card);
    }
  });

  let phase=0,targetPhase=0;
  function update(){
    const r=wrap.getBoundingClientRect();
    const center=innerHeight/2-(r.top+r.height/2);
    targetPhase=center*.003+(window.__scrollVelocity||0)*.035;
  }
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update);
  update();

  function frame(){
    phase+=(targetPhase-phase)*.055;

    const mobile=innerWidth<=760;
    const radius=mobile?Math.min(wrap.clientWidth*.26,90):Math.min(wrap.clientWidth*.20,220);
    const step=mobile?185:205;
    const spread=(cards.length-1)*step;

    cards.forEach((card,i)=>{
      const a=phase+i*.88;
      const x=Math.sin(a)*radius;
      const z=Math.cos(a)*radius;
      const y=(i/(Math.max(1,cards.length-1))-.5)*spread+Math.sin(a*.65)*22;

      // Keep depth visually strong but never make videos too small/faint.
      const depth=(z+radius)/(2*radius);
      const scale=.86+depth*.18;
      const opacity=.82+depth*.18;
      const rotateY=-Math.cos(a)*24;
      const rotateZ=Math.sin(a)*3;

      card.style.transform=
        `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px)`+
        ` rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
      card.style.zIndex=100+Math.round(depth*100);
      card.style.opacity=opacity;
      card.style.filter=`brightness(${.90+depth*.10}) saturate(${1.02+depth*.08})`;
      card.style.visibility='visible';
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();



// ================= 3D MODEL VISIBILITY / CAMERA FRAMING =================
(function ensureModelsVisible(){
  const ids=['heroAvatarCanvas','aboutCanvas','skillsCanvas','certificateCanvas','volunteerCanvas'];
  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.style.display='block';
    el.style.visibility='visible';
    el.style.opacity='1';
    el.style.pointerEvents='none';
    const parent=el.parentElement;
    if(parent){
      parent.style.visibility='visible';
      parent.style.opacity='1';
      parent.style.overflow='visible';
    }
  });

  // Re-check after Three.js/GLTF async loading and after resize.
  const refresh=()=>{
    ids.forEach(id=>{
      const el=document.getElementById(id);
      if(el){
        el.style.visibility='visible';
        el.style.opacity='1';
      }
    });
  };
  setTimeout(refresh,500);
  setTimeout(refresh,1500);
  window.addEventListener('resize',refresh,{passive:true});
})();


// ================= HERO 3D HUD + META QUEST FIX =================
(function hero3DInterface(){
  const hero=document.getElementById('heroAvatarCanvas')?.closest('section') || document.querySelector('main section');
  const hud=hero?.querySelector('.hero-3d-hud');
  const model=document.getElementById('heroAvatarCanvas');
  if(!hero||!hud)return;
  let tx=0,ty=0,cx=0,cy=0;
  if(window.matchMedia?.('(pointer:fine)').matches){
    hero.addEventListener('pointermove',e=>{
      const r=hero.getBoundingClientRect();
      tx=(e.clientX-r.left)/r.width*2-1; ty=(e.clientY-r.top)/r.height*2-1;
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{tx=0;ty=0},{passive:true});
  }
  function frame(t){
    cx+=(tx-cx)*.055; cy+=(ty-cy)*.055;
    hud.style.setProperty('--hud-x',`${cx*16}px`); hud.style.setProperty('--hud-y',`${cy*12}px`);
    hud.style.setProperty('--hud-rx',`${cy*-2.5}deg`); hud.style.setProperty('--hud-ry',`${cx*3.5}deg`);
    hud.style.setProperty('--hud-pulse',`${.55+Math.sin(t*.0014)*.18}`);
    if(model){model.style.setProperty('--model-mx',`${cx*10}px`);model.style.setProperty('--model-my',`${cy*7}px`);}
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

(function metaQuestModelFix(){
  const canvas=document.getElementById('aboutCanvas'); if(!canvas)return;
  const stage=canvas.closest('.model-canvas')||canvas.parentElement;
  if(stage){stage.classList.add('vr-model-stage');stage.style.visibility='visible';stage.style.opacity='1';stage.style.overflow='visible';}
  const wake=()=>{canvas.style.visibility='visible';canvas.style.opacity='1';canvas.style.display='block';canvas.style.transform='scale(1.18)';};
  wake();setTimeout(wake,400);setTimeout(wake,1200);addEventListener('resize',wake,{passive:true});
})();

// ================= Generic scroll reveal — replays every time a section re-enters view =================
const revealTargets = [
  ...document.querySelectorAll('.t-row'),
  document.getElementById('aboutWrap'),
  document.getElementById('certWrap'),
  document.getElementById('videoOrbitWrap'),
  ...document.querySelectorAll('.vol-item')
].filter(Boolean);

// One-shot: once a card/row has revealed itself, it stays revealed. Sections taller
// than the viewport (Experience's timeline especially) used to sit right at the
// 0.22 threshold while scrolling through their own middle, so the old toggle-on/
// toggle-off version kept adding and removing "in-view" many times a second —
// that rapid flicker is the "blinking" bug. Revealing once and unobserving fixes it.
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const target = entry.target;
    if(entry.isIntersecting){
      target.classList.add('in-view');
      target.querySelectorAll('[data-enter-anim]').forEach(playEntrance);
      if(target.dataset.enterAnim) playEntrance(target);
      revealObserver.unobserve(target);
    }
  });
}, {threshold:0.22, rootMargin:'-6% 0px -6% 0px'});

revealTargets.forEach(t => revealObserver.observe(t));

// ================= Certificates — fan the deck out every time it re-enters view =================
const certCards = document.querySelectorAll('.cert-card');
function collapseCerts(){
  certCards.forEach(card=>{
    card.style.transition = 'none';
    card.style.transform = 'translate(0,0) rotate(0deg) scale(.72)';
    card.dataset.fanTransform = card.style.transform;
    void card.offsetWidth;
    card.style.transition = '';
  });
}
collapseCerts();
const certWrap = document.getElementById('certWrap');
const certObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      // Below 860px the deck switches to a plain static stacked column (see CSS),
      // so skip the desktop fan-out transform entirely — applying those wide
      // x-offsets on a narrow phone was pushing cards off the edge of the screen.
      const isMobile = window.innerWidth <= 860;
      const n = certCards.length;
      certCards.forEach((card,i)=>{
        if(isMobile){
          card.style.transform = 'none';
          card.style.zIndex = '';
          return;
        }
        const off = i - (n-1)/2;
        const angle = off * 11;
        const x = off * 100;
        const y = Math.abs(off) * 22;
        setTimeout(()=>{
          card.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(1)`;
          card.dataset.fanTransform = card.style.transform;
          card.style.zIndex = 10 - Math.abs(off);
        }, i*90);
      });
      certObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.25, rootMargin:'-6% 0px -6% 0px'});
if(certWrap) certObserver.observe(certWrap);

// ================= Skills — HUD stat-line bars fill in when scrolled into view =================
const skillsStatsEl = document.getElementById('skillsStats');
if(skillsStatsEl){
  const skillRows = skillsStatsEl.querySelectorAll('.skill-row');
  // Animated icon per skill row — cycles through the shared icon set so rows
  // read as distinct little HUD chips rather than plain text, each with a
  // subtle floating/tilt animation.
  const skillIconCycle = [icons.cube, icons.ar, icons.hand, icons.globe, icons.play];
  document.querySelectorAll('.skill-row-top').forEach((row, i)=>{
    const span = document.createElement('span');
    span.className = 'skill-icon';
    span.style.setProperty('--i', i % skillIconCycle.length);
    span.innerHTML = skillIconCycle[i % skillIconCycle.length];
    row.prepend(span);
  });

  const skillsStatsObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        skillsStatsEl.classList.add('in-view');
        skillRows.forEach(row=>{
          const fill = row.querySelector('.skill-bar-fill');
          if(fill) fill.style.width = (row.dataset.level || 0) + '%';
        });
        skillsStatsObserver.unobserve(skillsStatsEl);
      }
    });
  }, {threshold:0.2, rootMargin:'-6% 0px -6% 0px'});
  skillsStatsObserver.observe(skillsStatsEl);
}

// ================= Volunteering — staggered diagonal path =================
const volItems = document.querySelectorAll('.vol-item');
const volOffsets = [0, 42, 14];
volItems.forEach((item,i)=>{
  item.style.marginLeft = volOffsets[i % volOffsets.length] + '%';
});

// ================= Three.js — shared tiny renderer helper =================
function mountScene(containerId, build){
  const el = document.getElementById(containerId);
  if(!el || typeof THREE === 'undefined') return;
  const w = el.clientWidth || 240, h = el.clientHeight || 240;
  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  el.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 100);
  camera.position.z = 4.2;
  const ctx = build(scene, camera, THREE);

  // Only pay the GPU cost of rendering while this scene is actually on screen —
  // this is the single biggest win for scroll smoothness, since up to 5 WebGL
  // renderers were previously drawing every frame regardless of visibility.
  let visible = true;
  if('IntersectionObserver' in window){
    visible = false;
    new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{ visible = entry.isIntersecting; });
    }, {rootMargin:'20% 0px 20% 0px'}).observe(el);
  }

  function resize(){
    const nw = el.clientWidth || w, nh = el.clientHeight || h;
    renderer.setSize(nw, nh);
    camera.aspect = nw/nh; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  function loop(t){
    if(ctx && ctx.tick) ctx.tick(t);
    if(visible) renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  return {scene, camera, renderer};
}

// ================= Three.js — shared GLB model loader =================
// Loads a .glb, centers + rescales it to a consistent visual size (source models
// come in at wildly different native scales/origins), lights it since GLB meshes
// use PBR materials that render black without lights, and hands back the loaded
// group so callers can drive rotation/scroll-linked transforms on it.
function mountGLBScene(containerId, glbUrl, {targetSize=2.2, spin=0.00018, onLoaded, onTick}={}){
  if(typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') return null;
  const state = {group:null, ready:false};
  mountScene(containerId, (scene, camera, THREE)=>{
    const hemi = new THREE.HemisphereLight(0xbfb6ff, 0x0a0a12, 1.35);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.65);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4bd8e0, 1.1);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    camera.position.z = 5.2;

    const loader = new THREE.GLTFLoader();
    loader.load(glbUrl, (gltf)=>{
      const group = gltf.scene;
      const box = new THREE.Box3().setFromObject(group);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = targetSize / maxDim;
      group.userData.baseScale = scale;
      group.scale.setScalar(scale);
      group.position.set(-center.x*scale, -center.y*scale, -center.z*scale);
      scene.add(group);
      state.group = group;
      state.ready = true;
      if(onLoaded) onLoaded(group);
    }, undefined, (err)=>{ console.warn('GLB failed to load:', glbUrl, err); });

    return { tick(t){
      if(state.group){
        state.group.rotation.y = t*spin + (window.__scrollVelocity||0) * 0.025;
        if(onTick) onTick(state.group, t);
      }
    }};
  });
  return state;
}




mountScene('expCanvas', (scene, camera, THREE)=>{
  const count = 140;
  const positions = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    positions[i*3]   = (Math.random()-0.5)*0.5;
    positions[i*3+1] = (Math.random()-0.5)*20;
    positions[i*3+2] = (Math.random()-0.5)*1.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({color:0x8b7bff, size:0.045, transparent:true, opacity:0.75});
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  camera.position.z = 6;
  return { tick(t){
    points.rotation.y = t*0.00012;
    const timelineEl = document.getElementById('timelineWrap');
    if(timelineEl){
      const rect = timelineEl.getBoundingClientRect();
      const progress = 1 - (rect.top + rect.height/2) / window.innerHeight;
      points.position.y = -progress*6 + 3;
    }
  }};
});

// ---- About: VR headset 3D model at the center, orbit-notes rotate around it ----
mountGLBScene('aboutCanvas', 'assets/models/vr-headset.glb', {targetSize:4.25, spin:0.00022});

// ---- Hero: Ahmed's 3D avatar model, scroll-linked into the About headset ----
// As the hero scrolls out of view, the avatar spins up, shrinks and fades —
// timed so it feels like it's handing off to the VR headset model that's
// simultaneously fading in at the center of the About section below.
let heroScrollProgress = 0;
(function trackHeroScroll(){
  const heroSection = document.getElementById('home');
  const nameRow = document.getElementById('heroNameRow');
  if(!heroSection) return;
  function update(){
    const rect = heroSection.getBoundingClientRect();
    heroScrollProgress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
    // The whole "AHMED [model] WALEED" line tilts back into 3D space and
    // recedes/fades as you scroll past it — driven straight off scroll
    // progress so it reads as a Three.js-style perspective exit, not a
    // plain CSS fade.
    if(nameRow){
      const p = heroScrollProgress;
      if(window.innerWidth <= 860){
        // Simpler fade on mobile — the deep rotateX/translateZ reads as
        // clipping/overflow on narrow, stacked layouts.
        nameRow.style.transform = `translateY(${-p*40}px) scale(${1-p*0.1})`;
      } else {
        const rotX = p * 34;         // tips away from the viewer
        const rotY = (window.__scrollVelocity||0) * -1.4; // reacts to scroll direction/speed
        const tz = -p * 340;
        const ty = -p * 70;
        const scale = 1 - p * 0.22;
        nameRow.style.transform =
          `perspective(1500px) translate3d(0px, ${ty}px, ${tz}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      }
      nameRow.style.opacity = String(Math.max(0, 1 - p * 1.5));
    }
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  (function raf(){ update(); requestAnimationFrame(raf); })(); // scroll velocity keeps easing after scroll stops
})();

mountGLBScene('heroAvatarCanvas', 'assets/models/ahmed-avatar.glb', {
  targetSize: 4.10,
  spin: 0.00032,
  onTick(group, t){
    const p = heroScrollProgress;
    group.rotation.y += p * 2.4;               // spins away as it hands off
    const base = group.userData.baseScale || 1;
    group.scale.setScalar(base * (1 - p * 0.5));
    // Gentle always-on idle bob + tilt so the avatar visibly breathes/lives
    // instead of reading as a static/"still" render.
    const bob = Math.sin(t*0.0011) * 0.08;
    const tilt = Math.sin(t*0.0007) * 0.05;
    group.position.y = (group.userData.baseY || 0) + p * 0.6 + bob;
    group.rotation.z = tilt;
    const frame = document.getElementById('heroModelLayer');
    if(frame) frame.style.opacity = String(Math.max(0, 1 - p * 1.7));
  }
});


// ---- Cinematic scroll-driven video backgrounds ----
// Every section's clip is rendered on a full-bleed Three.js plane (not a flat
// <video> tag) so it can behave like an actual cinematic shot instead of a
// looping background loop:
//  - the video is SCRUBBED by scroll (currentTime follows scroll progress
//    through the section), like a scroll-driven cinematic reveal
//  - the camera does a subtle dolly (push-in) as the section comes to center
//  - letterbox bars close in to full-frame at the center of each section and
//    open back up as it leaves, like a scene opening/closing
//  - the shot itself carries a vignette, fine film grain and a touch of
//    chromatic aberration + tilt-shift blur at the edges of the transition
//  - mouse still adds a light parallax tilt on top of all of it
const VIDEO_BG_VERT = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uWaveAmp;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x*9.0 + uTime*0.55) * cos(pos.y*7.0 + uTime*0.4);
    wave += sin((pos.x+pos.y)*5.0 - uTime*0.3) * 0.5;
    float dMouse = distance(uv, uMouse*0.5 + 0.5);
    float bulge = smoothstep(0.55, 0.0, dMouse);
    pos.z += wave*uWaveAmp*0.4 + bulge*uWaveAmp*1.6;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const VIDEO_BG_FRAG = `
  uniform sampler2D uMap;
  uniform vec2 uCoverScale;
  uniform vec2 uCoverOffset;
  uniform vec3 uTint;
  uniform float uTintStrength;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uVignette;
  uniform float uGrain;
  uniform float uAberration;
  uniform float uFocus;
  varying vec2 vUv;

  vec3 sampleCover(vec2 uv){
    vec2 c = clamp(uv*uCoverScale + uCoverOffset, 0.001, 0.999);
    return texture2D(uMap, c).rgb;
  }

  void main(){
    vec2 uv = vUv;
    vec2 dir = uv - 0.5;

    // fine chromatic aberration — pulls red/blue apart slightly from the edges in
    float ca = uAberration;
    float r = sampleCover(uv + dir*ca).r;
    float g = sampleCover(uv).g;
    float b = sampleCover(uv - dir*ca).b;
    vec3 tex = vec3(r,g,b);

    // tilt-shift style soft blur that only kicks in during scroll transitions
    // (uFocus rises as a section enters/leaves) — reads as a rack-focus pull
    if(uFocus > 0.01){
      vec3 blur = vec3(0.0);
      for(int i=-2;i<=2;i++){
        vec2 off = dir*float(i)*0.01*uFocus;
        blur += sampleCover(uv+off);
      }
      blur /= 5.0;
      tex = mix(tex, blur, uFocus*0.85);
    }

    vec3 color = mix(tex, tex*uTint, uTintStrength);

    // vignette
    float vig = smoothstep(0.85, 0.2, length(dir));
    color *= mix(1.0, vig, uVignette);

    // fine film grain, animated so it flickers like real film stock
    float grain = fract(sin(dot(uv*(uTime*0.7+1.0), vec2(12.9898,78.233))) * 43758.5453);
    color += (grain - 0.5) * uGrain;

    gl_FragColor = vec4(color, uOpacity);
  }
`;

function mountFullBleedVideoBG(videoId, sceneId, {hue=0x8b7bff, tintStrength=0.28, waveAmp=0.5, opacity=0.95, parallax=0.045, sectionId, scrub=true, dolly=0.9, bars=0.03}={}){
  const video = document.getElementById(videoId);
  if(video){ video.muted = true; video.loop = true; video.playsInline = true; }
  const sceneEl = document.getElementById(sceneId);
  if(!video || !sceneEl) return;
  const sectionEl = sectionId ? document.getElementById(sectionId) : sceneEl.closest('section');

  // Letterbox bars — plain black frames that live inside the same absolutely
  // positioned wrapper as the video/canvas, so they're always clipped to this
  // section and always sit below the section's own text (which sits at a
  // higher z-index further down the DOM).
  const wrap = sceneEl.parentElement;
  const barTop = document.createElement('div');
  const barBottom = document.createElement('div');
  barTop.className = 'cine-bar cine-bar-top';
  barBottom.className = 'cine-bar cine-bar-bottom';
  wrap.appendChild(barTop);
  wrap.appendChild(barBottom);

  mountScene(sceneId, (scene, camera, THREE)=>{
    const map = new THREE.VideoTexture(video);
    map.minFilter = THREE.LinearFilter;
    map.magFilter = THREE.LinearFilter;

    const mat = new THREE.ShaderMaterial({
      uniforms:{
        uMap:{value:map},
        uTime:{value:0},
        uMouse:{value:new THREE.Vector2(0,0)},
        uWaveAmp:{value:waveAmp},
        uCoverScale:{value:new THREE.Vector2(1,1)},
        uCoverOffset:{value:new THREE.Vector2(0,0)},
        uTint:{value:new THREE.Color(hue)},
        uTintStrength:{value:tintStrength},
        uOpacity:{value:opacity},
        uVignette:{value:0.4},
        uGrain:{value:0.028},
        uAberration:{value:0.0018},
        uFocus:{value:0},
      },
      vertexShader:VIDEO_BG_VERT,
      fragmentShader:VIDEO_BG_FRAG,
      transparent:true,
    });
    const geo = new THREE.PlaneGeometry(1, 1, 64, 40);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const BASE_Z = 5;
    camera.fov = 50;
    camera.position.z = BASE_Z;
    camera.updateProjectionMatrix();

    // Size the plane to fill the camera frustum at BASE_Z (plus padding, so the
    // dolly zoom and tilt never reveal an edge), and compute object-fit:cover
    // UV scale/offset for the raw clip's native aspect.
    function fitPlane(){
      const w = sceneEl.clientWidth || 1, h = sceneEl.clientHeight || 1;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      const vFov = camera.fov * Math.PI/180;
      const frustumH = 2*Math.tan(vFov/2)*BASE_Z;
      const frustumW = frustumH*camera.aspect;
      const pad = 1.3;
      mesh.scale.set(frustumW*pad, frustumH*pad, 1);

      const vw = video.videoWidth || 16, vh = video.videoHeight || 9;
      const videoAspect = vw/vh, boxAspect = w/h;
      let sx=1, sy=1;
      if(boxAspect > videoAspect) sy = videoAspect/boxAspect; else sx = boxAspect/videoAspect;
      mat.uniforms.uCoverScale.value.set(sx, sy);
      mat.uniforms.uCoverOffset.value.set((1-sx)/2, (1-sy)/2);
    }
    fitPlane();
    window.addEventListener('resize', fitPlane);

    // Scroll now directs the shot: once metadata is ready, playback is handed
    // over to scroll position (video.currentTime), so scrolling through a
    // section plays through its clip like a scrubbed cinematic reveal instead
    // of a passive autoplay loop. Falls back to a normal muted loop until then.
    let duration = 0, scrubReady = false;
    function armPlayback(){
      duration = video.duration || 0;
      // Backgrounds stay alive continuously. This avoids the frozen-frame effect
      // caused by scroll-driven currentTime seeking on some browsers/file:// loads.
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(()=>{});
      scrubReady = false;
    }
    if(video.readyState >= 1) armPlayback();
    else video.addEventListener('loadedmetadata', armPlayback, {once:true});
    video.addEventListener('canplay', ()=>video.play().catch(()=>{}), {passive:true});

    const reveal = ()=> sceneEl.classList.add('ready');
    if(video.readyState >= 2) reveal();
    else video.addEventListener('loadeddata', reveal, {once:true});

    // Mouse parallax, scoped to this section (whole document for the hero)
    let mx=0, my=0, rotY=0, rotX=0;
    const targetEl = sectionId ? sectionEl : document;
    targetEl.addEventListener('mousemove', (e)=>{
      const rect = sectionId ? sectionEl.getBoundingClientRect() : {left:0, top:0, width:window.innerWidth, height:window.innerHeight};
      mx = ((e.clientX-rect.left)/rect.width - 0.5)*2;
      my = ((e.clientY-rect.top)/rect.height - 0.5)*2;
    });
    targetEl.addEventListener('mouseleave', ()=>{ mx=0; my=0; });

    let smoothProgress = 0.5, lastSeek = -1;

    return { tick(t){
      mat.uniforms.uTime.value = t*0.001;
      mat.uniforms.uMouse.value.set(mx, my);

      rotY += (mx*parallax - rotY)*0.045;
      rotX += (-my*parallax - rotX)*0.045;
      mesh.rotation.y = rotY;
      mesh.rotation.x = rotX;

      if(sectionEl){
        const rect = sectionEl.getBoundingClientRect();
        // 0 = section top just hitting viewport bottom (entering),
        // 1 = section bottom just leaving viewport top (exiting)
        const total = rect.height + window.innerHeight;
        const rawProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / total));
        smoothProgress += (rawProgress - smoothProgress) * 0.09;

        // centered: -1 (above) .. 0 (centered) .. 1 (below)
        const centered = (rect.top + rect.height/2 - window.innerHeight/2) / (window.innerHeight*0.5);
        const clampedCentered = Math.max(-1, Math.min(1, centered));
        const edgeAmount = Math.abs(clampedCentered); // 0 at center, 1 at edges

        // camera dolly: pushes in as the section reaches center, pulls back
        // toward the edges — a real cinematic zoom, not a static frame
        camera.position.z = BASE_Z - (1 - edgeAmount) * dolly;
        camera.updateProjectionMatrix();

        mesh.rotation.x += clampedCentered*0.1;

        // letterbox bars close in fully at the center of the section (full
        // frame reveal) and open up toward its edges (entering/leaving)
        const barPct = edgeAmount*edgeAmount*bars*100;
        barTop.style.height = barPct+'%';
        barBottom.style.height = barPct+'%';

        // rack-focus blur peaks right at the edges of the transition
        mat.uniforms.uFocus.value = edgeAmount*edgeAmount*0.6;

        // Video playback is intentionally continuous. Scroll controls the
        // cinematic camera, parallax, depth and letterbox instead of freezing
        // the actual footage on a single frame.
      }
    }};
  });
}

mountFullBleedVideoBG('heroVideo',       'heroVideoScene',   {hue:0x8b7bff, tintStrength:0.16, waveAmp:0.55, parallax:0.06, dolly:0.6, bars:0.02, opacity:1, scrub:false});
mountFullBleedVideoBG('aboutBgVideo',    'aboutVideoScene',  {hue:0x4bd8e0, tintStrength:0.22, waveAmp:0.45, sectionId:'about', opacity:1, scrub:false});
mountFullBleedVideoBG('portfolioBgVideo','portfolioBgScene', {hue:0xff2ee0, tintStrength:0.22, waveAmp:0.55, sectionId:'portfolio', opacity:1, scrub:false});
mountFullBleedVideoBG('expBgVideo',      'expVideoScene',    {hue:0x8b7bff, tintStrength:0.2,  waveAmp:0.5,  sectionId:'experience', opacity:1, scrub:false});
mountFullBleedVideoBG('certBgVideo',     'certVideoScene',   {hue:0xbaff29, tintStrength:0.18, waveAmp:0.4,  sectionId:'certificate', opacity:1, scrub:false});
mountFullBleedVideoBG('skillsBgVideo',   'skillsVideoScene', {hue:0x4bd8e0, tintStrength:0.2,  waveAmp:0.5,  sectionId:'skills', opacity:1, scrub:false});
mountFullBleedVideoBG('volBgVideo',      'volVideoScene',    {hue:0xff2ee0, tintStrength:0.22, waveAmp:0.45, sectionId:'volunteering', opacity:1, scrub:false});

// ---- Hero visual: subtle parallax tilt following the mouse (whole visual group) ----
const heroVisual = document.querySelector('.hero-model-layer');
if(heroVisual){
  document.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    heroVisual.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  });
}

// ================= Universal mouse-follow 3D tilt for every card =================
// Each element gets its own rotateX/rotateY based on cursor position inside it.
// getBase() lets a card keep a transform it already owns (e.g. the certificate
// fan-out position) — the tilt is appended on top of that base, never replacing it.
function enableTilt(elements, {max=10, lift=1.03, perspective=1000, getBase=()=>''} = {}){
  elements.forEach(el=>{
    if(!el || el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    let raf = null;
    function apply(rx, ry, scale){
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        const base = getBase(el);
        el.style.transform = `${base} perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`.trim();
      });
    }
    el.addEventListener('mousemove', (e)=>{
      const r = el.getBoundingClientRect();
      if(!r.width || !r.height) return;
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (px*100).toFixed(1)+'%');
      el.style.setProperty('--my', (py*100).toFixed(1)+'%');
      apply((0.5 - py) * max, (px - 0.5) * max, lift);
    });
    el.addEventListener('mouseleave', ()=> apply(0, 0, 1));
  });
}

// Cards that enter via a CSS @keyframes "cardIn*" animation hold their end value
// with fill-mode:forwards, which otherwise fights any inline transform we try to
// set for the tilt. Once the entrance animation finishes we drop it (its final
// frame is always visually the identity transform) so the tilt can take over.
function releaseAfterEntrance(elements){
  elements.forEach(el=>{
    el.addEventListener('animationend', ()=>{
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });
}

if(window.matchMedia('(pointer: fine)').matches){
  releaseAfterEntrance(document.querySelectorAll('.video-node, .orbit-note, .vol-item'));

  enableTilt(document.querySelectorAll('.t-card'), {max:7, lift:1.02, perspective:1200});
  enableTilt(document.querySelectorAll('.orbit-note'), {max:9, lift:1.03});
  enableTilt(document.querySelectorAll('.video-node'), {max:10, lift:1.04});
  enableTilt(document.querySelectorAll('.vol-item'), {max:7, lift:1.02});
  enableTilt(document.querySelectorAll('.hstat'), {max:8, lift:1.03});
  enableTilt(document.querySelectorAll('.media-frame'), {max:12, lift:1.03});
  enableTilt(document.querySelectorAll('.cert-card'), {
    max:9, lift:1.05, perspective:1200,
    getBase: (el)=> el.dataset.fanTransform || ''
  });
}

// ================= Scroll-triggered section reveals: continuous 3D scrub =================
// Instead of a one-shot "fade in once" trigger, each section's 3D transform is
// driven directly by scroll position every frame — like a scroll-scrubbed video
// timeline. This is what makes it read as a controlled 3D world rather than a
// series of pop-in animations, and it can never "blink" because there's no
// discrete on/off state to flicker between, only a smooth continuous value.
const stackSections = Array.from(document.querySelectorAll('.stack-section'));
if(stackSections.length){
  // Same visual flavor per section as the original design, just expressed as a
  // continuous function of progress (0 = just entering from below, 1 = settled)
  // instead of two fixed CSS states.
  const sectionVariants = [
    null, // 1: hero — always settled, untouched
    {tx:-80, rotY:-8},                 // 2: slide from left + rotate
    {tx:80, scale:0.92},               // 3: slide from right + scale
    {rotX:-15, scale:0.95},            // 4: rotate + scale
    {ty:100, skewY:3},                 // 5: rise + skew
    {tx:-60, scale:0.9},               // 6: slide from left + scale
    {rotX:20, ty:80},                  // 7: rotate + rise
  ];
  const easeOutCubic = t => 1 - Math.pow(1-t, 3);

  stackSections.forEach((section, i)=>{
    const variant = sectionVariants[i];
    if(!variant){ section.style.opacity = '1'; section.style.transform = 'none'; return; }
    section.style.transition = 'none'; // fully JS-driven now, no CSS transition fighting the scrub
    section.dataset.scrubVariant = i;
  });

  function scrubSections(){
    const vh = window.innerHeight;
    stackSections.forEach((section, i)=>{
      const variant = sectionVariants[i];
      if(!variant) return;
      const rect = section.getBoundingClientRect();
      // 0 while still below the fold, 1 once settled near the top of the viewport
      const raw = (vh * 0.92 - rect.top) / (vh * 0.62);
      const p = easeOutCubic(Math.min(1, Math.max(0, raw)));
      const inv = 1 - p;
      const tx = (variant.tx || 0) * inv;
      const ty = (variant.ty || 0) * inv;
      const rotX = (variant.rotX || 0) * inv;
      const rotY = (variant.rotY || 0) * inv;
      const skewY = (variant.skewY || 0) * inv;
      const scale = variant.scale !== undefined ? (variant.scale + (1-variant.scale)*p) : 1;
      section.style.opacity = String(p);
      section.style.transform =
        `translate3d(${tx}px, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) skewY(${skewY}deg) scale(${scale})`;
    });
  }
  scrubSections();
  window.addEventListener('scroll', ()=> requestAnimationFrame(scrubSections), {passive:true});
  window.addEventListener('resize', scrubSections);
}

// ================= DETAIL POPUP =================
// Every CTA card (experience, certificates, portfolio videos) can carry
// data-detail-title / data-detail-tag / data-detail-body (pipe "||" separated bullets)
// and, optionally, data-detail-video. Clicking its CTA opens this shared panel;
// clicking again / the close button / the overlay / Escape closes it.
(function detailPopup(){
  const overlay = document.getElementById('detailOverlay');
  const panel = document.getElementById('detailPanel');
  const closeBtn = document.getElementById('detailClose');
  const titleEl = document.getElementById('detailTitle');
  const tagEl = document.getElementById('detailTag');
  const bodyEl = document.getElementById('detailBody');
  if(!overlay) return;

  let activeVideo = null;

  function open(source){
    const title = source.dataset.detailTitle || '';
    const tag = source.dataset.detailTag || '';
    const body = source.dataset.detailBody || '';
    const videoSrc = source.dataset.detailVideo || '';
    const ytId = source.dataset.detailYt || '';

    titleEl.textContent = title;
    tagEl.textContent = tag;
    bodyEl.innerHTML = '';

    if(videoSrc){
      const v = document.createElement('video');
      v.src = videoSrc; v.controls = true; v.muted = true; v.playsInline = true; v.autoplay = true; v.loop = true;
      v.className = 'detail-video';
      bodyEl.appendChild(v);
      activeVideo = v;
    } else if(ytId){
      const wrap = document.createElement('div');
      wrap.className = 'detail-video detail-yt-wrap';
      wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0" title="Reference clip" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      bodyEl.appendChild(wrap);
    }

    body.split('||').map(s=>s.trim()).filter(Boolean).forEach(line=>{
      const li = document.createElement('li');
      li.textContent = line;
      bodyEl.appendChild(li);
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if(activeVideo){ activeVideo.pause(); activeVideo = null; }
    bodyEl.innerHTML = ''; // also stops any playing YouTube iframe
  }

  // Delegate: any element with a data-detail-title ancestor click (t-card, cert-card,
  // video-node) OR any explicit .t-cta/.cert-cta/.watch-btn button opens the panel.
  document.addEventListener('click', (e)=>{
    const ctaBtn = e.target.closest('.t-cta, .cert-cta, .watch-btn');
    if(ctaBtn){
      const card = ctaBtn.closest('[data-detail-title]');
      if(card){ e.preventDefault(); open(card); }
    }
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
})();

// ================= FLOATING SOCIAL BUTTON — blooms into a ring, GitHub sits on top =================
(function fabSocial(){
  const wrap = document.getElementById('fabSocial');
  const main = document.getElementById('fabSocialMain');
  const ring = document.getElementById('fabSocialRing');
  if(!wrap || !main || !ring) return;

  const nodes = Array.from(ring.querySelectorAll('.fab-node'));
  const radius = window.innerWidth <= 640 ? 92 : 112;
  // Spread the icons across an upward arc so GitHub (index 0) lands directly on top.
  const spreadDeg = 200; // total arc width
  const startDeg = -90 - spreadDeg/2; // centered on "up"
  nodes.forEach((node, i)=>{
    const t = nodes.length === 1 ? 0.5 : i/(nodes.length-1);
    const deg = startDeg + spreadDeg * t;
    const rad = deg * Math.PI/180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    node.style.setProperty('--tx', x.toFixed(1) + 'px');
    node.style.setProperty('--ty', y.toFixed(1) + 'px');
    node.style.transitionDelay = (i * 0.035) + 's';
  });

  let open = false;
  function setOpen(v){
    open = v;
    wrap.classList.toggle('open', open);
    main.setAttribute('aria-expanded', String(open));
  }
  main.addEventListener('click', (e)=>{ e.stopPropagation(); setOpen(!open); });
  document.addEventListener('click', (e)=>{ if(open && !wrap.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') setOpen(false); });
})();

// ================= FLOATING VIDEO BUBBLE — real looping clip, tap to cycle/mute =================
(function fabVideo(){
  const bubble = document.getElementById('fabVideo');
  const vid = document.getElementById('fabVideoEl');
  if(!bubble || !vid) return;
  const clips = ['assets/videos/reel-2.mp4','assets/videos/reel-3.mp4','assets/videos/reel-1.mp4','assets/videos/reel-4.mp4'];
  let i = 0;
  vid.play().catch(()=>{});
  bubble.addEventListener('click', ()=>{
    i = (i+1) % clips.length;
    vid.src = clips[i];
    vid.play().catch(()=>{});
    bubble.classList.add('pulse');
    setTimeout(()=> bubble.classList.remove('pulse'), 380);
  });
})();

// ================= Footer: slow drifting starfield behind the footer content =================
mountScene('footerCanvas', (scene, camera, THREE)=>{
  const count = 220;
  const positions = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    positions[i*3]   = (Math.random()-0.5)*14;
    positions[i*3+1] = (Math.random()-0.5)*7;
    positions[i*3+2] = (Math.random()-0.5)*6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({color:0x4bd8e0, size:0.03, transparent:true, opacity:0.55});
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  camera.position.z = 5;
  return { tick(t){
    points.rotation.y = t*0.00006;
    points.rotation.x = Math.sin(t*0.00004)*0.06;
  }};
});

// ================= HERO STATS: count up once the stat bar scrolls into view =================
(function heroStats(){
  const bar = document.getElementById('heroStats');
  if(!bar) return;
  const stats = Array.from(bar.querySelectorAll('.hstat'));
  stats.forEach(el=>{
    const iconKey = el.dataset.icon;
    if(iconKey && icons[iconKey]){
      const span = document.createElement('span');
      span.className = 'hstat-icon';
      span.innerHTML = icons[iconKey];
      el.prepend(span);
    }
  });
  let done = false;
  function run(){
    if(done) return;
    done = true;
    stats.forEach(el=>{
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const numEl = el.querySelector('.hstat-num');
      const duration = 1100;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        numEl.textContent = Math.round(target * eased) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) run(); });
  }, {threshold:0.4}).observe(bar);
})();

// ================= Scroll gate: hold each section until its background clip finishes =================
// Every section below the hero owns a full-bleed clip that's scrubbed by scroll
// position (see mountFullBleedVideoBG above). Once a section is centered and
// filling the viewport, this gate slows *forward* scrolling right down — instead
// of hard-blocking it, which can trap people — so the clip actually gets to play
// through before the next section rushes in. Scrolling back up is always free,
// and once a clip has finished once it's marked cleared and never gates again.
(function scrollVideoGate(){
  const gateDefs = [
    {sectionId:'about',        videoId:'aboutBgVideo'},
    {sectionId:'skills',       videoId:'skillsBgVideo'},
    {sectionId:'experience',   videoId:'expBgVideo'},
    {sectionId:'certificate',  videoId:'certBgVideo'},
    {sectionId:'portfolio',    videoId:'portfolioBgVideo'},
    {sectionId:'volunteering', videoId:'volBgVideo'},
  ];
  const gates = gateDefs.map(g=>{
    const section = document.getElementById(g.sectionId);
    const video = document.getElementById(g.videoId);
    if(!section || !video) return null;
    return {section, video, cleared:false};
  }).filter(Boolean);
  if(!gates.length) return;

  function findActiveGate(){
    const vh = window.innerHeight;
    for(const g of gates){
      if(g.cleared) continue;
      const rect = g.section.getBoundingClientRect();
      // Only engage once the section is essentially filling the screen —
      // i.e. its clip is the one actually on display right now.
      if(rect.top <= vh * 0.12 && rect.bottom >= vh * 0.88) return g;
    }
    return null;
  }

  function isFinished(g){
    const dur = g.video.duration;
    if(!dur || isNaN(dur)) return true; // metadata not ready yet — never trap on that
    return g.video.currentTime >= dur - 0.18;
  }

  function handleForward(e, delta){
    if(delta <= 0) return; // never gate scrolling back up
    const g = findActiveGate();
    if(!g) return;
    if(isFinished(g)){ g.cleared = true; return; }
    e.preventDefault();
    window.scrollBy(0, delta * 0.12);
  }

  window.addEventListener('wheel', (e)=> handleForward(e, e.deltaY), {passive:false});

  let touchY = 0;
  window.addEventListener('touchstart', (e)=>{ touchY = e.touches[0].clientY; }, {passive:true});
  window.addEventListener('touchmove', (e)=>{
    const y = e.touches[0].clientY;
    const dy = touchY - y;
    touchY = y;
    handleForward(e, dy);
  }, {passive:false});
})();
