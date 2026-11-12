// Renders the quick-version ad (prompt 1) to seatsync-ad-quick.mp4.
// Usage: node render.js            -> video with its synthesized score
//        node render.js stills 2 9 -> stills/still-<t>s.png
const path = require('path'), fs = require('fs'), { spawn, spawnSync } = require('child_process');
const { chromium } = require('c:/Users/dipernam/Desktop/MiaDiPerna.github.io/Module_4/module4-app/media/ad/node_modules/playwright');
const FF = 'C:/Users/dipernam/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FPS = 30, W = 1920, H = 1080;
const here = (...p) => path.join(__dirname, ...p);
const url = require('url').pathToFileURL(here('seatsync-ad.html')).href;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(url);
  await page.waitForFunction(() => window.Player && Player.current);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.getElementById('controls').style.display = 'none';
    window.onresize = null;
    const s = document.getElementById('stage'); s.style.transform = 'none';
  });
  const END = await page.evaluate(() => Player.END);
  const shot = (t, opts) => page.evaluate((t) => { Player.show(t); document.getElementById('stage').style.transform = 'none'; }, t)
    .then(() => page.screenshot({ clip: { x: 0, y: 0, width: W, height: H }, ...opts }));

  if (process.argv[2] === 'stills') {
    fs.mkdirSync(here('stills'), { recursive: true });
    for (const a of process.argv.slice(3)) { const p = here('stills', `still-${a.replace('.', '_')}s.png`); await shot(+a, { path: p }); console.log(p); }
    await browser.close(); return;
  }

  // 1. Score: replay the page's Web Audio synth into an OfflineAudioContext, save as WAV.
  const wav = await page.evaluate(async () => {
    // Audio is private to the player's closure; rebuild the same graph via the player's own start(),
    // by swapping in an offline context through the AudioContext constructor.
    const sr = 48000, len = Math.ceil(sr * (Player.END + 0.3));
    const off = new OfflineAudioContext(2, len, sr);
    off.resume = () => Promise.resolve();
    window.AudioContext = function () { return off; };
    // The player's Play button schedules the whole score into whatever AudioContext it gets.
    document.getElementById('play').click();
    const buf = await off.startRendering();
    document.getElementById('play').click(); // pause the UI clock only after the score is rendered
    const ch = [buf.getChannelData(0), buf.getChannelData(1)], n = buf.length;
    const out = new DataView(new ArrayBuffer(44 + n * 4));
    const str = (o, s) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
    str(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); str(8, 'WAVEfmt '); out.setUint32(16, 16, true);
    out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, sr, true); out.setUint32(28, sr * 4, true);
    out.setUint16(32, 4, true); out.setUint16(34, 16, true); str(36, 'data'); out.setUint32(40, n * 4, true);
    let peak = 0;
    for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) { const v = Math.max(-1, Math.min(1, ch[c][i])); peak = Math.max(peak, Math.abs(v)); out.setInt16(44 + (i * 2 + c) * 2, v * 32767, true); }
    const bytes = new Uint8Array(out.buffer); let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return { b64: btoa(s), peak };
  });
  console.log('score peak', wav.peak.toFixed(3));
  fs.writeFileSync(here('score.wav'), Buffer.from(wav.b64, 'base64'));

  // 2. Frames piped to ffmpeg, muxed with the score (offline graph starts 0.05s late, so trim that).
  const ff = spawn(FF, ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-ss', '0.05', '-i', here('score.wav'), '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', here('seatsync-ad-quick.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(END * FPS);
  for (let f = 0; f < N; f++) {
    const buf = await shot(f / FPS, { type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`frame ${f}/${N}`);
  }
  ff.stdin.end();
  const code = await new Promise((r) => ff.on('close', r));
  fs.unlinkSync(here('score.wav'));
  console.log('ffmpeg exit', code);
  await browser.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
