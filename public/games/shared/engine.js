// LazyDonkeyGames shared engine. Tiny, dependency-free, ES2017.
// API (import from "../shared/engine.js"):
//   const g = createGame({ width, height, background, init, update, draw, title, help })
//     width/height  logical size; the canvas letterboxes and scales sharply (DPR-aware)
//     init(g)       reset state for a new round (called once on load, then on start/restart)
//     update(g, dt) fixed 60 Hz step while phase === "playing" (dt = 1/60 s)
//     draw(g, ctx)  draw every frame in logical units, in every phase (overlays are drawn on top)
//     title, help   shown on the title screen; help is one short line per control
//   g.phase         "title" | "playing" | "paused" | "over"
//   g.score, g.best (session only, never saved), g.frame (steps since round start)
//   g.over(msg?)    end the round; g.start() start/restart
//   g.input.down(code) / g.input.pressed(code)  KeyboardEvent.code; pressed = this step only
//   g.input.pointer {x, y, down, pressed, released} in logical units (mouse + touch)
//   g.sound(name)   "jump" | "hit" | "score" | "click" | "win" | "lose", or {freq, dur, type, vol, slide}
//   g.rng()         seeded random in [0,1); g.reseed(n)
//   g.test          object the game fills with test hooks (lose() is added for you)
// Start: Enter/Space or tap. Pause: P or Esc (and automatically when the tab is hidden).
// g.scale is CSS px per logical unit: keep on-screen text >= 12px (size >= 12 / g.scale).
// The mute/pause buttons sit over the top-right corner: keep HUD out of it.
// Exposes window.__game = g for tests. Nothing is stored.

// Fallback for ctx.roundRect (missing before iOS 16 / Firefox 112). Radii: number or [all] /
// [tl-br, tr-bl] / [tl, tr-bl, br] / [tl, tr, br, bl], as in the spec.
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r = 0) {
    const a = Array.isArray(r) ? r.map((v) => (typeof v === "number" ? v : v.x || 0)) : [r];
    const [tl, tr, br, bl] = a.length === 1 ? [a[0], a[0], a[0], a[0]] : a.length === 2 ? [a[0], a[1], a[0], a[1]] : a.length === 3 ? [a[0], a[1], a[2], a[1]] : a;
    const m = Math.min(Math.abs(w) / 2, Math.abs(h) / 2), c = (v) => Math.max(0, Math.min(v || 0, m));
    this.moveTo(x + c(tl), y);
    this.arcTo(x + w, y, x + w, y + h, c(tr));
    this.arcTo(x + w, y + h, x, y + h, c(br));
    this.arcTo(x, y + h, x, y, c(bl));
    this.arcTo(x, y, x + w, y, c(tl));
    this.closePath();
  };
}

const COLORS = { dark: "#2d2d2d", surface: "#3c3c3c", white: "#ffffff", muted: "#b4b4b4", red: "#d92b1a" };
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export function createGame(opts) {
  const W = opts.width, H = opts.height;
  document.body.style.cssText = `margin:0;height:100dvh;display:grid;place-items:center;background:${COLORS.dark};overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none`;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", opts.title);
  canvas.style.cssText = "display:block;touch-action:none;outline:none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let scale = 1, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    canvas.style.width = `${Math.floor(W * scale)}px`;
    canvas.style.height = `${Math.floor(H * scale)}px`;
    canvas.width = Math.floor(W * scale * dpr);
    canvas.height = Math.floor(H * scale * dpr);
  }
  window.addEventListener("resize", resize);
  resize();

  // Input
  const keys = new Set(), fresh = new Set();
  const pointer = { x: 0, y: 0, down: false, pressed: false, released: false };
  const toLogical = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * W;
    pointer.y = ((e.clientY - r.top) / r.height) * H;
  };
  window.addEventListener("keydown", (e) => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    if (e.target instanceof HTMLButtonElement && (e.code === "Space" || e.code === "Enter")) return;
    unlockAudio();
    if (!e.repeat) fresh.add(e.code);
    keys.add(e.code);
    if (e.code === "KeyP" || e.code === "Escape") togglePause();
    else if ((e.code === "Enter" || e.code === "Space") && (g.phase === "title" || g.phase === "over")) g.start();
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
  window.addEventListener("blur", () => keys.clear());
  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    unlockAudio();
    canvas.setPointerCapture?.(e.pointerId);
    toLogical(e);
    pointer.down = pointer.pressed = true;
    if (g.phase === "title" || g.phase === "over") { g.start(); pointer.pressed = false; }
    else if (g.phase === "paused") togglePause();
  });
  canvas.addEventListener("pointermove", (e) => toLogical(e));
  const up = (e) => { toLogical(e); if (pointer.down) pointer.released = true; pointer.down = false; };
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  // Audio: synthesized blips, silent until the first gesture.
  let actx = null, muted = false;
  function unlockAudio() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { actx = null; } }
    if (actx && actx.state === "suspended") actx.resume();
  }
  const presets = {
    jump: { freq: 520, slide: 880, dur: 0.12, type: "square", vol: 0.08 },
    hit: { freq: 180, slide: 60, dur: 0.25, type: "sawtooth", vol: 0.1 },
    score: { freq: 880, slide: 1320, dur: 0.08, type: "triangle", vol: 0.1 },
    click: { freq: 660, dur: 0.04, type: "square", vol: 0.05 },
    win: { freq: 660, slide: 1320, dur: 0.35, type: "triangle", vol: 0.12 },
    lose: { freq: 330, slide: 110, dur: 0.5, type: "triangle", vol: 0.12 },
  };
  function sound(s) {
    if (muted || !actx || actx.state !== "running") return;
    const p = typeof s === "string" ? presets[s] : s;
    if (!p) return;
    const t = actx.currentTime, o = actx.createOscillator(), v = actx.createGain();
    o.type = p.type || "square";
    o.frequency.setValueAtTime(p.freq, t);
    if (p.slide) o.frequency.exponentialRampToValueAtTime(p.slide, t + p.dur);
    v.gain.setValueAtTime(p.vol ?? 0.08, t);
    v.gain.exponentialRampToValueAtTime(0.0001, t + p.dur);
    o.connect(v).connect(actx.destination);
    o.start(t);
    o.stop(t + p.dur + 0.02);
  }

  // HTML buttons (keyboard-reachable): mute and pause.
  const bar = document.createElement("div");
  bar.style.cssText = "position:fixed;top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));display:flex;gap:8px";
  const btnCss = `width:44px;height:44px;border-radius:999px;border:1px solid #919191;background:${COLORS.surface};color:#fff;font:600 18px ${FONT};cursor:pointer`;
  const mkBtn = (label, text, fn) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", label); b.textContent = text; b.style.cssText = btnCss;
    b.addEventListener("click", (e) => { unlockAudio(); fn(); b.blur(); e.stopPropagation(); });
    b.addEventListener("focus", () => (b.style.outline = "3px solid #00c3e3"));
    b.addEventListener("blur", () => (b.style.outline = "none"));
    bar.appendChild(b);
    return b;
  };
  const muteBtn = mkBtn("Mute sound", "♪", () => {
    muted = !muted;
    muteBtn.setAttribute("aria-label", muted ? "Unmute sound" : "Mute sound");
    muteBtn.style.opacity = muted ? "0.5" : "1";
  });
  const pauseBtn = mkBtn("Pause", "II", () => togglePause());
  document.body.appendChild(bar);

  function togglePause() {
    if (g.phase === "playing") g.phase = "paused";
    else if (g.phase === "paused") g.phase = "playing";
    pauseBtn.setAttribute("aria-label", g.phase === "paused" ? "Resume" : "Pause");
    pauseBtn.textContent = g.phase === "paused" ? "▶" : "II";
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden && g.phase === "playing") togglePause(); });

  // Seeded RNG (mulberry32) so tests can replay a round.
  let seed = 1;
  const rng = () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const g = {
    W, H, ctx, canvas, colors: COLORS, font: FONT,
    get scale() { return scale; },
    phase: "title", score: 0, best: 0, frame: 0, message: "",
    input: { down: (c) => keys.has(c), pressed: (c) => fresh.has(c), pointer },
    sound, rng, reseed: (n) => { seed = n; },
    test: {},
    start() {
      g.score = 0; g.frame = 0; g.message = "";
      if (!g.test.keepSeed) seed = (Math.random() * 2 ** 31) | 0;
      opts.init(g);
      g.phase = "playing";
      fresh.clear();
    },
    over(msg = "Game over") {
      if (g.phase !== "playing") return;
      g.phase = "over"; g.message = msg;
      g.best = Math.max(g.best, g.score);
      sound("lose");
    },
  };
  g.test.lose = () => g.over();
  window.__game = g;

  // Split text into lines that fit `max` wide at the current font, breaking at
  // " · " first and at spaces only when one part is still too wide.
  function wrap(text, max) {
    const out = [];
    for (const part of String(text).split(" · ")) {
      const prev = out.length ? out[out.length - 1] : null;
      if (prev !== null && ctx.measureText(prev + " · " + part).width <= max) { out[out.length - 1] = prev + " · " + part; continue; }
      let line = "";
      for (const word of part.split(" ")) {
        const t = line ? line + " " + word : word;
        if (line && ctx.measureText(t).width > max) { out.push(line); line = word; } else line = t;
      }
      out.push(line);
    }
    return out;
  }
  // Fit one overlay line in the frame. In order: one line, shrunk to at most
  // 85%; two lines (whole " · " parts) at the largest size that fits; else wrap
  // at `min`. A single
  // word that is still too wide (a huge number) shrinks until it fits.
  function fit(text, size, min, weight, max) {
    const at = (z) => { ctx.font = `${weight} ${z}px ${FONT}`; return wrap(text, max); };
    const widest = (lines) => Math.max(...lines.map((l) => ctx.measureText(l).width));
    let z = size, lines = at(z);
    const one = ctx.measureText(text).width;
    if (one > max && one * 0.85 <= max) { z = Math.max(min, size * max / one * 0.99); lines = at(z); }
    // With " · " parts, also shrink until no part has to break mid-phrase.
    const parts = String(text).split(" · ");
    const broken = () => parts.length > 1 && parts.some((p) => ctx.measureText(p).width > max);
    while ((lines.length > 2 || broken()) && z > min) { z = Math.max(min, z * 0.95); lines = at(z); }
    if (widest(lines) > max) { z *= max / widest(lines); lines = at(z); }
    // Balance wrapped lines: the narrowest width that keeps the same line count,
    // so a short last word ("+500") doesn't sit alone.
    if (lines.length > 1) {
      // Never narrower than the widest " · " part, so parts stay whole.
      let lo = Math.max(max / 2, parts.length > 1 ? widest(parts) : 0), hi = max;
      for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (wrap(text, mid).length > lines.length) lo = mid; else hi = mid; }
      lines = wrap(text, hi);
    }
    return { size: z, lines };
  }

  function overlay(title, sub) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Sizes in logical units, but never under 28px / 14px on screen unless a
    // line has to shrink to fit (then not under 20px / 12px).
    const max = W - 32;
    const big = Math.max(Math.round(Math.min(W, H) / 9), 28 / scale);
    const small = Math.max(big * 0.38, 14 / scale);
    const head = fit(title, big, 20 / scale, 700, max);
    const lh = head.size * 1.1;
    // Extra title lines grow upward and downward from the usual spot.
    let y = H * 0.36 - (head.lines.length - 1) * lh / 2;
    ctx.fillStyle = COLORS.white;
    head.lines.forEach((l, i) => ctx.fillText(l, W / 2, y + i * lh));
    // About 0.9 of the title size when nothing shrank, more room once it has.
    y += (head.lines.length - 1) * lh + head.size * 0.55 + small * 0.9;
    // Every sub line shares one size, so a long one doesn't look like a heading.
    let subSize = small;
    for (const s of sub) subSize = Math.min(subSize, fit(s, small, 12 / scale, 500, max).size);
    sub.forEach((s, i) => {
      const { lines } = fit(s, subSize, subSize, 500, max);
      ctx.fillStyle = i === sub.length - 1 ? COLORS.white : COLORS.muted;
      for (const l of lines) { ctx.fillText(l, W / 2, y); y += subSize * 1.3; }
      y += subSize * 0.3;
    });
  }

  // Fixed-step loop; render every animation frame.
  const STEP = 1 / 60;
  let last = performance.now(), acc = 0;
  function frame(now) {
    acc = Math.min(acc + (now - last) / 1000, 0.25);
    last = now;
    while (acc >= STEP) {
      if (g.phase === "playing") { opts.update(g, STEP); g.frame++; }
      fresh.clear(); pointer.pressed = pointer.released = false;
      acc -= STEP;
    }
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    ctx.fillStyle = opts.background || COLORS.dark;
    ctx.fillRect(0, 0, W, H);
    opts.draw(g, ctx);
    if (g.phase === "title") overlay(opts.title, [...(opts.help || []), "Press Enter or tap to start"]);
    else if (g.phase === "paused") overlay("Paused", ["Press P or tap to resume"]);
    else if (g.phase === "over") overlay(g.message, [`Score ${g.score} · Best ${g.best}`, "Press Enter or tap to play again"]);
    requestAnimationFrame(frame);
  }
  opts.init(g); // so the title screen draws the scene behind it
  requestAnimationFrame(frame);
  return g;
}
