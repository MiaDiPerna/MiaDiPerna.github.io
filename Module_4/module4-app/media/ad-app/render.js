// Usage: node render.js stills 1 5 9 12 17 19   -> stills/still-Ns.png
//        node render.js video                    -> seatsync-app-ad.mp4 (with music)
// Serves module4-app/ over a local server so the ad page can drive the real app in its iframe.
const path = require('path'), fs = require('fs'), http = require('http');
const { spawn } = require('child_process');
const NM = path.resolve(__dirname, '../ad/node_modules');
const { chromium } = require(NM + '/playwright');
const FF = require(NM + '/ffmpeg-static');
const ROOT = path.resolve(__dirname, '../..');
const AUDIO = path.resolve(__dirname, '../ad/audio');
const FPS = 60;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

const run = (args) => new Promise((ok, bad) => spawn(FF, args, { stdio: 'inherit' }).on('close', c => c ? bad(new Error('ffmpeg ' + c)) : ok()));

(async () => {
  await new Promise(r => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/media/ad-app/seatsync-app-ad.html`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true);
  const stage = await page.$('#stage');
  const mode = process.argv[2];

  if (mode === 'stills') {
    fs.mkdirSync(path.join(__dirname, 'stills'), { recursive: true });
    const ts = process.argv.slice(3).map(Number).sort((a, b) => a - b);
    // Step through every frame up to each still so the app's actions run in order.
    let f = 0;
    for (const t of ts) {
      for (; f / FPS <= t; f++) await page.evaluate(x => seek(x), f / FPS);
      const out = path.join(__dirname, 'stills', `still-${String(t).replace('.', '_')}s.png`);
      await stage.screenshot({ path: out }); console.log(out);
    }
  } else {
    const DUR = await page.evaluate(() => window.DURATION);
    const TAPS = await page.evaluate(() => window.TAPS);
    const DINGS = await page.evaluate(() => window.DINGS);
    const silent = path.join(__dirname, 'video-silent.mp4');
    if (mode !== 'mux') {
    const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS), silent], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = FPS * DUR;
    for (let f = 0; f < N; f++) {
      await page.evaluate(t => seek(t), f / FPS);
      const buf = await stage.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 300 === 0) console.log(`frame ${f}/${N}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    }

    // Sound: the full ad's song bed, a soft click on each tap, a ding on the 10% warning and the flagged payout.
    const F = 'aformat=sample_rates=48000:channel_layouts=stereo';
    const ms = (t) => Math.round(t * 1000);
    let fc = `[1:a]${F},atrim=start=75.367:duration=${DUR},asetpts=PTS-STARTPTS,afade=t=in:d=0.3,afade=t=out:st=${DUR - 1.2}:d=1.2,volume=0.7[mus];`;
    fc += `[2:a]${F},atrim=0.19:0.55,asetpts=PTS-STARTPTS,volume=0.6,asplit=${TAPS.length}` + TAPS.map((_, i) => `[k${i}]`).join('') + ';';
    TAPS.forEach((t, i) => { fc += `[k${i}]adelay=${ms(t)}|${ms(t)}[ck${i}];`; });
    fc += `[3:a]${F},volume=0.75,asplit=${DINGS.length}` + DINGS.map((_, i) => `[d${i}]`).join('') + ';';
    DINGS.forEach((t, i) => { fc += `[d${i}]adelay=${ms(t + 0.05)}|${ms(t + 0.05)}[dg${i}];`; });
    const ins = ['[mus]', ...TAPS.map((_, i) => `[ck${i}]`), ...DINGS.map((_, i) => `[dg${i}]`)];
    fc += `${ins.join('')}amix=inputs=${ins.length}:normalize=0:duration=first,atrim=0:${DUR},loudnorm=I=-16:TP=-1.5,aresample=48000[a]`;
    await run(['-y', '-v', 'error', '-i', silent, '-i', path.join(AUDIO, 'cand_swing.mp3'), '-i', path.join(AUDIO, 'click.mp3'), '-i', path.join(AUDIO, 'ding.mp3'),
      '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-t', String(DUR), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
      path.join(__dirname, 'seatsync-app-ad.mp4')]);
    fs.unlinkSync(silent);
    console.log('done');
  }
  await browser.close(); server.close();
})();
