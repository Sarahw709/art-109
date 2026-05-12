/**
 * Webcam → canvas: mosaic, strip warp, black boxes, tear glitches.
 * Intensity ramps from subtle to extreme over CHAOS_RAMP_MS so the reflection
 * slowly becomes unrecognizable.
 */
(function () {
  const video = document.getElementById("webcam");
  const canvas = document.getElementById("display");
  if (!video || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  const small = document.createElement("canvas");
  const smallCtx = small.getContext("2d", { alpha: false });
  const mosaicFull = document.createElement("canvas");
  const mosaicCtx = mosaicFull.getContext("2d", { alpha: false });
  const composite = document.createElement("canvas");
  const compositeCtx = composite.getContext("2d", { alpha: false });

  /** @type {{ x: number; y: number; w: number; h: number; until: number }[]} */
  let blackBoxes = [];
  let lastBoxTick = 0;

  /** @type {{ y0: number; srcY: number; stripH: number; until: number } | null} */
  let tear = null;

  /** Wall-clock ramp start (set when feed is ready). */
  let chaosStartMs = null;
  const CHAOS_RAMP_MS = 270000;

  function chaosProgress(tMs) {
    if (chaosStartMs === null) chaosStartMs = tMs;
    const u = Math.min(1, (tMs - chaosStartMs) / CHAOS_RAMP_MS);
    return u * u * (3 - 2 * u);
  }

  function syncSizes() {
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;
    for (const c of [canvas, mosaicFull, composite]) {
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
    }
  }

  /** Mosaic block size scales with chaos (finer when calm, huge blocks when extreme). */
  function renderMosaic(tSec, w, h, chaos) {
    const phase = 0.5 + 0.5 * Math.sin(tSec * 0.55);
    const maxBlock = 2 + phase * (4 + chaos * 22);
    const block = Math.max(2, Math.floor(maxBlock));
    const sw = Math.ceil(w / block);
    const sh = Math.ceil(h / block);
    small.width = sw;
    small.height = sh;
    smallCtx.drawImage(video, 0, 0, w, h, 0, 0, sw, sh);
    mosaicCtx.imageSmoothingEnabled = false;
    mosaicCtx.drawImage(small, 0, 0, sw, sh, 0, 0, w, h);
  }

  function refreshBlackBoxes(tMs, w, h, chaos) {
    const tickMs = Math.max(55, 220 - chaos * 165);
    if (tMs - lastBoxTick < tickMs) return;
    lastBoxTick = tMs;

    const spawnP = 0.04 + chaos * chaos * 0.26;
    if (Math.random() < spawnP || (blackBoxes.length === 0 && chaos > 0.12)) {
      const n =
        chaos < 0.18 ? 1 : 1 + Math.floor(Math.random() * (1 + chaos * 5));
      blackBoxes = [];
      for (let i = 0; i < n; i++) {
        const bw = w * (0.06 + chaos * (0.12 + Math.random() * 0.32));
        const bh = h * (0.05 + chaos * (0.1 + Math.random() * 0.28));
        const x = Math.random() * Math.max(1, w - bw);
        const upperBias = Math.random() < 0.55;
        const yMax = upperBias ? Math.max(bh, h * 0.5) : h;
        const y = Math.random() * Math.max(1, yMax - bh);
        blackBoxes.push({
          x,
          y,
          w: bw,
          h: bh,
          until: tMs + 140 + Math.random() * (900 - chaos * 400),
        });
      }
    }
    blackBoxes = blackBoxes.filter((b) => b.until > tMs);
  }

  function drawWarpStripes(tSec, w, h, strength, chaos) {
    const stripBase = 2 + Math.floor(3 * (0.5 + 0.5 * Math.sin(tSec * 1.2)));
    const stripH = Math.max(1, Math.floor(stripBase * (1 - chaos * 0.55)));
    const wave = 0.024 + chaos * 0.055;
    const timeMul = 2.2 + chaos * 4.5;
    const ampBase = 4 + 26 * (0.5 + 0.5 * Math.sin(tSec * 0.37));
    const amp = strength * ampBase * (0.35 + chaos * 0.95);
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < h; y += stripH) {
      const sh = Math.min(stripH, h - y);
      const off = Math.sin(y * wave + tSec * timeMul) * amp;
      ctx.drawImage(composite, 0, y, w, sh, off, y, w, sh);
    }
  }

  function updateTear(tMs, tSec, w, h, chaos) {
    const wobble = Math.sin(tSec * 1.6) + Math.sin(tSec * 2.8);
    const thresh = 1.55 - chaos * 0.55;
    const spawnChance = 0.08 + chaos * chaos * 0.52;

    if (!tear || tMs > tear.until) {
      if (wobble > thresh && Math.random() < spawnChance) {
        const stripH = 2 + Math.floor(Math.random() * (6 + chaos * 14));
        const y0 = Math.floor(Math.random() * Math.max(1, h - stripH - 2));
        const deltaMag = 6 + Math.floor(Math.random() * (22 + chaos * 36));
        const deltaY = Math.random() < 0.5 ? -deltaMag : deltaMag;
        const srcY = Math.max(0, Math.min(h - stripH, y0 + deltaY));
        tear = {
          y0,
          srcY,
          stripH,
          until: tMs + 60 + Math.random() * (100 + chaos * 120),
        };
      } else if (wobble < 0.75 - chaos * 0.35) {
        tear = null;
      }
    }
  }

  function drawTear(w, h) {
    if (!tear) return;
    const { y0, srcY, stripH } = tear;
    ctx.drawImage(composite, 0, srcY, w, stripH, 0, y0, w, stripH);
  }

  function tick(tMs) {
    requestAnimationFrame(tick);
    if (video.readyState < 2) return;

    syncSizes();
    const w = canvas.width;
    const h = canvas.height;
    if (!w || !h) return;

    const chaos = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : chaosProgress(tMs);
    const tSec = tMs * 0.001;

    const pixelAmount = Math.min(1, Math.max(0, Math.pow(chaos, 0.88)));
    const warpStrength = Math.min(1, Math.pow(chaos, 1.02));
    const blockAlpha = Math.min(1, Math.pow(chaos, 0.82));

    renderMosaic(tSec, w, h, chaos);

    compositeCtx.imageSmoothingEnabled = true;
    compositeCtx.drawImage(video, 0, 0, w, h);
    if (pixelAmount > 0.008) {
      compositeCtx.globalAlpha = pixelAmount;
      compositeCtx.drawImage(mosaicFull, 0, 0, w, h);
      compositeCtx.globalAlpha = 1;
    }

    if (warpStrength > 0.03) {
      drawWarpStripes(tSec, w, h, warpStrength, chaos);
    } else {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(composite, 0, 0, w, h);
    }

    updateTear(tMs, tSec, w, h, chaos);
    drawTear(w, h);

    if (chaos > 0.06) {
      refreshBlackBoxes(tMs, w, h, chaos);
      ctx.fillStyle = "#000";
      for (const b of blackBoxes) {
        ctx.globalAlpha = blockAlpha;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
      ctx.globalAlpha = 1;
    } else {
      blackBoxes = [];
    }
  }

  function start() {
    const kick = () => requestAnimationFrame(tick);
    if (video.videoWidth > 0) kick();
    else video.addEventListener("loadeddata", kick, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
