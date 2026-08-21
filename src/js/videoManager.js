const MAX_PLAYING = 3;
const playing = new Set();
const queue = [];

function start(vid) {
  playing.add(vid);
  vid.play().catch(() => {});
}

export function requestPlay(vid) {
  if (playing.has(vid)) return;
  const qi = queue.indexOf(vid);
  if (qi !== -1) queue.splice(qi, 1);
  if (playing.size >= MAX_PLAYING) {
    queue.push(vid);
    return;
  }
  start(vid);
}

export function releasePause(vid) {
  if (!playing.has(vid)) return;
  playing.delete(vid);
  vid.pause();
  while (queue.length && playing.size < MAX_PLAYING) {
    start(queue.shift());
  }
}
