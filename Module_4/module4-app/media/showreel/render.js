// Render showreel.html -> showreel.mp4 (1080x1080, 60fps, H.264 + synthesized AAC audio).
// Usage:  node render.js          full render
//         node render.js stills   write stills/ at 0,3,6,9,12,14.98 s
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const { chromium } = require('c:/Users/dipernam/Desktop/MiaDiPerna.github.io/Module_4/module4-app/media/ad/node_modules/playwright');

const DIR = __dirname;
const FFMPEG = 'C:/Users/dipernam/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const W = 1080, H = 1080, FPS = 60, DUR = 15;

/* ------------------------------------------------------------------
   Audio: a 120 BPM cue synthesized sample-by-sample, synced to the cuts.
   ------------------------------------------------------------------ */
function synth() {
  const SR = 48000, N = Math.ceil(DUR * SR);
  const L = new Float32Array(N), R = new Float32Array(N);
  const sendL = new Float32Array(N), sendR = new Float32Array(N); // delay send
  let seed = 99;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function add(t0, len, fn, pan = 0, gain = 1, send = 0) {
    const s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
    const gl = Math.cos((pan + 1) * Math.PI / 4) * gain, gr = Math.sin((pan + 1) * Math.PI / 4) * gain;
    const st = {};
    for (let i = 0; i < n; i++) {
      const j = s0 + i; if (j < 0 || j >= N) continue;
      const v = fn(i / SR, st);
      L[j] += v * gl; R[j] += v * gr;
      if (send) { sendL[j] += v * gl * send; sendR[j] += v * gr * send; }
    }
  }
  const kick = (t0, g = 1) => add(t0, .45, (t, s) => {
    s.ph = (s.ph || 0) + (48 + 130 * Math.exp(-t * 32)) / SR;
    return Math.sin(s.ph * 2 * Math.PI) * Math.exp(-t * 7) * 1.0 + rnd() * Math.exp(-t * 300) * .3;
  }, 0, g);
  const hat = (t0, pan, g = 1) => add(t0, .06, (t, s) => { const x = rnd(); const y = x - (s.p || 0); s.p = x; return y * Math.exp(-t * 70) * .18; }, pan, g);
  const clap = (t0, g = 1) => add(t0, .3, (t, s) => {
    const x = rnd(); s.lp = (s.lp || 0) + (x - (s.lp || 0)) * .35; const bp = x - s.lp;
    const env = Math.exp(-t * 16) * (t < .02 ? (Math.floor(t * 300) % 2 ? .6 : 1) : 1);
    return (bp * .5 + Math.sin(t * 2 * Math.PI * 190) * .15 * Math.exp(-t * 30)) * env;
  }, .1, g, .25);
  const pluck = (t0, m, pan, g = .2, send = .4) => add(t0, .4, (t, s) => {
    const f = mtof(m); const ph = t * f;
    const tri = 1 - 4 * Math.abs((ph % 1) - .5);
    return (tri * .7 + Math.sin(ph * 4 * Math.PI) * .3 * Math.exp(-t * 30)) * Math.exp(-t * 11);
  }, pan, g, send);
  const bass = (t0, m, len = .24, g = .32) => add(t0, len, (t, s) => {
    const f = mtof(m); const saw = 2 * ((t * f) % 1) - 1;
    const cut = .02 + .25 * Math.exp(-t * 18);
    s.y = (s.y || 0) + (saw - (s.y || 0)) * cut; s.y2 = (s.y2 || 0) + (s.y - (s.y2 || 0)) * cut;
    const env = Math.min(1, t * 400) * Math.exp(-t * 5) * Math.min(1, (len - t) * 80);
    return (s.y2 * 1.4 + Math.sin(t * f * 2 * Math.PI) * .5) * env;
  }, 0, g);
  const pad = (t0, len, notes, g = .05, pan = 0) => add(t0, len, (t, s) => {
    let v = 0;
    for (const m of notes) { const f = mtof(m); for (const d of [-.12, .12]) v += 2 * ((t * f * (1 + d / 100 * 3)) % 1) - 1; }
    s.y = (s.y || 0) + (v - (s.y || 0)) * .04;
    const env = Math.min(1, t / .25) * Math.min(1, (len - t) / .3);
    return s.y * env;
  }, pan, g, .3);
  const riser = (t0, len, g = .35) => add(t0, len, (t, s) => {
    const k = t / len; const x = rnd();
    s.y = (s.y || 0) + (x - (s.y || 0)) * (.02 + .5 * k * k);
    s.ph = (s.ph || 0) + (200 + 1800 * k * k) / SR;
    return (s.y * .9 + Math.sin(s.ph * 2 * Math.PI) * .12) * k * k;
  }, 0, g, .2);
  const whoosh = (t0, len, g = .3) => add(t0, len, (t, s) => {
    const k = t / len; const x = rnd();
    s.y = (s.y || 0) + (x - (s.y || 0)) * (.03 + .3 * Math.sin(k * Math.PI));
    return s.y * Math.sin(k * Math.PI);
  }, 0, g, .3);
  const impact = (t0, g = 1) => {
    add(t0, 1.6, (t, s) => { s.ph = (s.ph || 0) + (30 + 70 * Math.exp(-t * 6)) / SR; return Math.sin(s.ph * 2 * Math.PI) * Math.exp(-t * 2.2) * .9; }, 0, g);
    add(t0, 1.2, (t, s) => { const x = rnd(); s.y = (s.y || 0) + (x - (s.y || 0)) * .08; return s.y * Math.exp(-t * 4) * 1.4; }, 0, g, .5);
  };
  const blip = (t0, f, g = .2, pan = 0) => add(t0, .12, t => Math.sin(t * f * 2 * Math.PI) * Math.exp(-t * 40), pan, g, .4);
  const tick = (t0, pan) => add(t0, .03, (t, s) => { const x = rnd(); const y = x - (s.p || 0); s.p = x; return y * Math.exp(-t * 200) * .35; }, pan, 1, .5);

  // chords: Am, F, C, G (one per bar of 2 s)
  const CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
  const chordAt = t => CH[Math.floor(t / 2) % 4];

  // 0–2  ORIGIN
  blip(.05, 880, .25); whoosh(.35, .6, .35);
  for (let i = 0; i < 6; i++) tick(.72 + i * .05 + .08, -.5 + i * .2);
  for (let i = 0; i < 8; i++) tick(.95 + i * .04 + .08, .5 - i * .14);
  pad(0, 2, [45, 57, 64], .035);
  riser(1.4, .6, .3);
  // 2–11.5  groove
  for (let t = 2; t < 11.5 - 1e-6; t += .5) {
    const b = Math.round((t - 2) / .5);
    kick(t);
    if (t >= 4 && b % 2 === 1) clap(t, .9);
    hat(t + .25, b % 2 ? .3 : -.3);
    if (t >= 4) { hat(t + .125, -.4, .5); hat(t + .375, .4, .5); }
    const root = chordAt(t)[0] - 12;
    bass(t, root); bass(t + .25, root + (b % 4 === 3 ? 7 : 12), .2, .22);
  }
  // kinetic words: a stab on each word
  for (let k = 0; k < 4; k++) pluck(2 + k * .5, [69, 72, 76, 81][k], k % 2 ? .4 : -.4, .22);
  pad(2, 11, [57, 64, 67], .03, -.2);
  // arps in GRID and FLUID
  for (const [a, b] of [[4, 6.25], [9, 11.25]]) {
    let n = 0;
    for (let t = a; t < b - 1e-6; t += .125, n++) {
      const c = chordAt(t); const notes = [c[0] + 12, c[1] + 12, c[2] + 12, c[0] + 24];
      pluck(t, notes[n % 4], n % 2 ? .5 : -.5, .13, .45);
    }
  }
  // knot: drawing-on shimmer
  for (let i = 0; i < 12; i++) blip(6.5 + i * .07, 1200 + i * 90, .06, Math.sin(i) * .6);
  // transitions
  riser(3.5, .5, .25); impact(4, .55);
  riser(5.9, .6, .3); impact(6.5, .6);
  whoosh(8.55, .5, .35); impact(9, .55);
  riser(10.9, .6, .35);
  // 11.5–13  MONTAGE: kick on every cut + stab
  for (let k = 0; k < 6; k++) {
    const t = 11.5 + k * .25;
    kick(t, 1); hat(t + .125, k % 2 ? .5 : -.5, .8);
    const c = CH[k % 4];
    for (const m of c) pluck(t, m + 12, (k % 2 ? .3 : -.3), .1, .3);
    bass(t, c[0] - 12, .22, .3);
  }
  riser(12.5, .5, .4);
  // 13–15  RESOLVE
  impact(13, 1);
  [13.15, 13.23, 13.31].forEach((t, i) => blip(t, [1318.5, 1567.98, 1975.5][i], .18, (i - 1) * .6));
  pad(13, 2, [45, 57, 64, 71, 76], .05);
  for (let i = 0; i < 8; i++) tick(13.38 + i * .045 + .06, -.5 + i * .14);

  // stereo ping-pong delay on the send (dotted eighth)
  const D = Math.floor(.375 * SR);
  for (let i = D; i < N; i++) {
    sendL[i] += sendR[i - D] * .38; sendR[i] += sendL[i - D] * .38;
  }
  // mix, gentle saturation, fade-out at the very end
  let peak = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR; const fade = Math.min(1, (DUR - t) / .4);
    L[i] = Math.tanh((L[i] + sendL[i] * .5) * 1.1) * fade;
    R[i] = Math.tanh((R[i] + sendR[i] * .5) * 1.1) * fade;
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  }
  const norm = .89 / peak;
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(clampS(L[i] * norm) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(clampS(R[i] * norm) * 32767), 46 + i * 4);
  }
  return buf;
}
const clampS = x => Math.max(-1, Math.min(1, x));

async function openPage() {
  let browser;
  try { browser = await chromium.launch({ channel: 'chrome' }); }
  catch (e) { browser = await chromium.launch(); }
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file:///' + path.join(DIR, 'showreel.html').replace(/\\/g, '/'));
  await page.waitForFunction(() => window.__ready === true);
  return { browser, page };
}
const shot = (page) => page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });

async function stills() {
  const { browser, page } = await openPage();
  fs.mkdirSync(path.join(DIR, 'stills'), { recursive: true });
  const extra = process.argv.slice(3).map(Number);
  for (const t of (extra.length ? extra : [0, 3, 6, 9, 12, 14.98])) {
    await page.evaluate(t => window.seek(t), t);
    const name = extra.length ? `check_${t}.png` : `still_${String(Math.floor(t)).padStart(2, '0')}s.png`;
    fs.writeFileSync(path.join(DIR, 'stills', name), await shot(page));
    console.log('wrote', name);
  }
  await browser.close();
}

async function render() {
  const wav = path.join(os.tmpdir(), `showreel-audio-${process.pid}.wav`);
  fs.writeFileSync(wav, synth());
  const { browser, page } = await openPage();
  const out = path.join(DIR, 'showreel.mp4');
  const ff = spawn(FFMPEG, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-i', wav,
    '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  const frames = DUR * FPS;
  for (let f = 0; f < frames; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    const png = await shot(page);
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) process.stdout.write(`frame ${f}/${frames}\n`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
  fs.unlinkSync(wav);
  console.log('wrote', out);
}

(process.argv[2] === 'stills' ? stills() : render()).catch(e => { console.error(e); process.exit(1); });
