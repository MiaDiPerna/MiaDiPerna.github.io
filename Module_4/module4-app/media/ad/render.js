// Usage: node render.js stills 2.6 9.8 21.3 41.9   -> stills/scene-N.png
//        node render.js video                       -> seatsync-ad.mp4 (with music)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const FF = require('ffmpeg-static');
const FPS = 60, DUR = 45;
const url = require('url').pathToFileURL(path.resolve(__dirname, 'seatsync-ad.html')).href;

(async () => {
  const mode = process.argv[2];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true);
  const stage = await page.$('#stage');
  if (mode === 'stills') {
    require('fs').mkdirSync(path.join(__dirname, 'stills'), { recursive: true });
    const ts = process.argv.slice(3).map(Number);
    for (let i = 0; i < ts.length; i++) {
      await page.evaluate(t => seek(t), ts[i]);
      const out = path.join(__dirname, 'stills', process.argv[3 + i].includes('_') ? process.argv[3 + i] : `still-${String(ts[i]).replace('.', '_')}s.png`);
      await stage.screenshot({ path: out });
      console.log(out);
    }
  } else {
    const silent = path.join(__dirname, 'video-silent.mp4');
    const ff = spawn(FF, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
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
  await browser.close();
})();
