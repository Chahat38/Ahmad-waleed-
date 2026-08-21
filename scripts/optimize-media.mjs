import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC_SITE = join(ROOT, '..', 'portfolio-ahmed-waleed-updated');
const MEDIA = join(ROOT, 'src', 'assets', 'media');
const POSTERS = join(ROOT, 'src', 'assets', 'posters');
const IMG = join(ROOT, 'src', 'assets', 'img');
const MODELS = join(ROOT, 'src', 'assets', 'models');

[MEDIA, POSTERS, IMG, MODELS].forEach(d => mkdirSync(d, { recursive: true }));

const FF = ffmpegInstaller.path;
let done = 0;

function run(args, label) {
  const r = spawnSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { timeout: 240000 });
  done++;
  const ok = r.status === 0;
  console.log(`[${String(done).padStart(2)}] ${ok ? 'OK  ' : 'FAIL'} ${label}`);
  if (!ok) console.log(r.stderr?.toString()?.slice(0, 500));
  return ok;
}

const videoArgs = w => [
  '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
  '-vf', `scale='min(${w},iw)':-2`, '-crf', '25', '-preset', 'medium',
  '-movflags', '+faststart', '-an'
];

const reel = f => join(SRC_SITE, 'assets', 'videos', f);
const pv = f => join(SRC_SITE, 'assets', 'portfolio video', f);

const videoJobs = [
  ['reel-1.mp4', reel('reel-1.mp4'), 1080],
  ['reel-2.mp4', reel('reel-2.mp4'), 1080],
  ['reel-3.mp4', reel('reel-3.mp4'), 1080],
  ['reel-4.mp4', reel('reel-4.mp4'), 1080],
  ['p-prototype.mp4', pv('Prototype-Video1 (1).mp4'), 1080],
  ['p-bowling.mp4', pv('bowling Game (3) (1).mp4'), 1080],
  ['p-comic.mp4', pv('comic ar effect.mp4'), 720],
  ['p-petrobo.mp4', pv('Pet Robo Effect.mp4'), 720],
  ['p-effects.mp4', pv('effects.mp4'), 720],
  ['p-ecommerce.mp4', pv('AR Ecommerce Solution (1).gif'), 720],
  ['p-marker.mp4', pv('Marker base ar for immersive event (1).gif'), 720]
];

for (const [name, src, w] of videoJobs) {
  if (!existsSync(src)) { console.log('SKIP missing source:', name); continue; }
  run(['-i', src, ...videoArgs(w), join(MEDIA, name)], name);
}

for (const [name] of videoJobs) {
  const src = join(MEDIA, name);
  if (!existsSync(src)) continue;
  run(
    ['-ss', '0.4', '-i', src, '-vframes', '1', '-vf', "scale='min(720,iw)':-2", '-q:v', '6', join(POSTERS, name.replace('.mp4', '.jpg'))],
    name + ' → poster'
  );
}

const profileSrc = join(SRC_SITE, 'profile.jpeg');
if (existsSync(profileSrc)) {
  run(['-i', profileSrc, '-vf', "scale='min(900,iw)':-2", '-c:v', 'libwebp', '-quality', '82', join(IMG, 'profile.webp')], 'profile.webp');
}

copyFileSync(join(SRC_SITE, 'assets', 'models', 'ahmed-avatar.glb'), join(MODELS, 'ahmed-avatar.glb'));
copyFileSync(join(SRC_SITE, 'assets', 'models', 'vr-headset.glb'), join(MODELS, 'vr-headset.glb'));
console.log('Models copied.');

console.log('\nOutput sizes:');
for (const dir of [MEDIA, POSTERS]) {
  for (const f of readdirSync(dir).sort()) {
    console.log(`  ${dir.split('assets')[1]}/${f}: ${(statSync(join(dir, f)).size / 1048576).toFixed(2)} MB`);
  }
}
