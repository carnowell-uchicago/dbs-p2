import { createGame } from "../shared/engine.js";

const W = 360, H = 640, TOP = 70, BOT = 66;
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surface: "#3c3c3c", white: "#ffffff", gray: "#d4d4d4", orange: "#ff8c1a" };
const NUMC = ["", "#0a7fb0", "#2f8f35", "#d92b1a", "#6a3fb5", "#b05a00", "#008b8b", "#2d2d2d", "#6b6b6b"];
// Medium is 8 wide x 12 tall so plots stay >= 44 CSS px on a 390 phone.
const SIZES = [
  { name: "Easy", cols: 8, rows: 8, mines: 10, k: 1, par: 90 },
  { name: "Medium", cols: 8, rows: 12, mines: 20, k: 2, par: 180 },
  { name: "Hard", cols: 12, rows: 16, mines: 36, k: 3, par: 300 },
];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let sizeIdx = 0, s;

const cfg = () => SIZES[sizeIdx];
function layout() {
  const z = cfg(), cs = Math.min((W - 4) / z.cols, (H - TOP - BOT) / z.rows);
  return { cs, ox: (W - cs * z.cols) / 2, oy: TOP + (H - TOP - BOT - cs * z.rows) / 2 };
}
function init() {
  const z = cfg(), n = z.cols * z.rows;
  s = { z, n, mine: new Uint8Array(n), num: new Uint8Array(n), rev: new Uint8Array(n), flag: new Uint8Array(n), t0: new Int32Array(n),
    placed: false, t: 0, revealed: 0, flags: 0, cx: 0, cy: 0, kb: false, flash: 0, mode: 0, press: null, end: 0, win: false, hit: -1, shake: 0, parts: [], frame: 0, ink: 0 };
  s.cx = z.cols >> 1; s.cy = z.rows >> 1;
}
const idx = (c, r) => r * s.z.cols + c;
const inb = (c, r) => c >= 0 && r >= 0 && c < s.z.cols && r < s.z.rows;
function nbrs(c, r) { const o = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && inb(c + dx, r + dy)) o.push([c + dx, r + dy]); return o; }

function solvable(c0, r0) {
  const { cols, rows } = s.z, st = new Int8Array(s.n); // 0 unknown, 1 open, 2 mine
  const open = (c, r) => { const q = [[c, r]]; st[idx(c, r)] = 1; while (q.length) { const [a, b] = q.pop(); if (!s.num[idx(a, b)]) for (const [x, y] of nbrs(a, b)) if (!st[idx(x, y)]) { st[idx(x, y)] = 1; q.push([x, y]); } } };
  open(c0, r0);
  for (let prog = 1; prog;) {
    prog = 0; const cons = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = idx(c, r); if (st[i] !== 1 || !s.num[i]) continue;
      const u = [], ns = nbrs(c, r); let m = 0;
      for (const [a, b] of ns) { const j = idx(a, b); if (st[j] === 2) m++; else if (!st[j]) u.push(j); }
      if (!u.length) continue;
      const k = s.num[i] - m;
      if (k === 0) { for (const j of u) { open(j % cols, (j / cols) | 0); } prog = 1; }
      else if (k === u.length) { for (const j of u) st[j] = 2; prog = 1; }
      else cons.push({ u, k });
    }
    if (prog) continue;
    for (const A of cons) for (const B of cons) {
      if (A === B || A.u.length >= B.u.length || !A.u.every((j) => B.u.includes(j))) continue;
      const d = B.u.filter((j) => !A.u.includes(j)), dk = B.k - A.k;
      if (dk === 0) { for (const j of d) if (!st[j]) open(j % cols, (j / cols) | 0); prog = 1; }
      else if (dk === d.length) { for (const j of d) st[j] = 2; prog = 1; }
    }
  }
  for (let i = 0; i < s.n; i++) if (!s.mine[i] && st[i] !== 1) return false;
  return true;
}
function place(g, c0, r0) {
  const skip = new Set([idx(c0, r0), ...nbrs(c0, r0).map(([c, r]) => idx(c, r))]);
  // Re-roll the garden (up to a budget) until it can be cleared without guessing.
  for (let tries = 0; tries < (s.z.k === 3 ? 400 : 150); tries++) {
    s.mine.fill(0); let left = s.z.mines;
    while (left > 0) { const i = Math.floor(g.rng() * s.n); if (!s.mine[i] && !skip.has(i)) { s.mine[i] = 1; left--; } }
    for (let r = 0; r < s.z.rows; r++) for (let c = 0; c < s.z.cols; c++) s.num[idx(c, r)] = nbrs(c, r).filter(([a, b]) => s.mine[idx(a, b)]).length;
    s.tries = tries + 1; s.gf = solvable(c0, r0);
    if (s.gf) break;
  }
  s.placed = true;
}
function burst(i, g, n, col) {
  if (reduce) n = Math.ceil(n / 3);
  const { cs, ox, oy } = layout(), x = ox + (i % s.z.cols + 0.5) * cs, y = oy + (Math.floor(i / s.z.cols) + 0.5) * cs;
  for (let k = 0; k < n; k++) { const a = g.rng() * 6.28, v = 40 + g.rng() * 90; s.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: 0.5 + g.rng() * 0.3, col }); }
}
function reveal(g, c, r) {
  const i0 = idx(c, r);
  if (s.rev[i0] || s.flag[i0]) return;
  if (!s.placed) place(g, c, r);
  if (s.mine[i0]) return lose(g, i0);
  const q = [[c, r, 0]], seen = new Set([i0]); let got = 0;
  while (q.length) {
    const [a, b, d] = q.shift(), i = idx(a, b);
    s.rev[i] = 1; s.t0[i] = s.frame + d * 2; got++; s.revealed++;
    if (s.flag[i]) { s.flag[i] = 0; s.flags--; }
    if (got < 4) burst(i, g, 4, "#8a5a3a");
    if (!s.num[i]) for (const [x, y] of nbrs(a, b)) { const j = idx(x, y); if (!seen.has(j) && !s.rev[j] && !s.flag[j] && !s.mine[j]) { seen.add(j); q.push([x, y, d + 1]); } }
  }
  g.score = s.revealed * 10 * s.z.k;
  g.sound(got > 3 ? "score" : "click");
  if (s.revealed === s.n - s.z.mines) { s.end = reduce ? 40 : 100; s.win = true; s.cele = 1; g.sound("win"); }
}
function chord(g, c, r) {
  const i = idx(c, r);
  if (!s.rev[i] || !s.num[i]) return;
  const ns = nbrs(c, r);
  if (ns.filter(([a, b]) => s.flag[idx(a, b)]).length !== s.num[i]) return;
  for (const [a, b] of ns) reveal(g, a, b);
}
function lose(g, i) {
  s.hit = i; s.end = 55; s.win = false; s.shake = reduce ? 0 : 10; s.flash = reduce ? 0 : 0.3;
  let k = 0; for (let j = 0; j < s.n; j++) if (s.mine[j]) { s.t0[j] = s.frame + (j === i ? 0 : 6 + k++ * 3); s.rev[j] = j === i ? 2 : s.rev[j]; }
  burst(i, g, 14, "#ff3c28"); g.sound("hit");
}
function toggleFlag(g, c, r) {
  const i = idx(c, r);
  if (s.rev[i]) return chord(g, c, r);
  s.flag[i] ^= 1; s.flags += s.flag[i] ? 1 : -1; g.sound("click");
}
const act = (g, c, r, flagMode) => (flagMode ? toggleFlag(g, c, r) : s.rev[idx(c, r)] ? chord(g, c, r) : reveal(g, c, r));

function cellAt(x, y) {
  const { cs, ox, oy } = layout(), c = Math.floor((x - ox) / cs), r = Math.floor((y - oy) / cs);
  return inb(c, r) && x >= ox && y >= oy ? [c, r] : null;
}
const modeBtn = { x: 100, y: H - 58, w: 160, h: 48 };
const hitMode = (x, y) => x >= modeBtn.x && x <= modeBtn.x + modeBtn.w && y >= modeBtn.y && y <= modeBtn.y + modeBtn.h;

const g = createGame({
  width: W, height: H, background: C.dark, title: "Carrot Sweeper",
  help: ["Dig carrots, avoid moles", "Click dig · right-click flag", "Tap dig · hold flag · arrows+Space"],
  init,
  update(g) {
    s.frame++;
    if (s.end) { if (--s.end === 0) { if (s.win) win(g); else g.over("A mole got you!"); } }
    else {
      if (s.placed) s.t += 1 / 60;
      const p = s.press;
      if (p && !p.done && performance.now() - p.t > 350) { p.done = true; act(g, p.c, p.r, s.mode === 0); navigator.vibrate?.(15); }
      const ip = g.input;
      let moved = false;
      if (ip.pressed("ArrowLeft") && s.cx > 0) { s.cx--; moved = true; }
      if (ip.pressed("ArrowRight") && s.cx < s.z.cols - 1) { s.cx++; moved = true; }
      if (ip.pressed("ArrowUp") && s.cy > 0) { s.cy--; moved = true; }
      if (ip.pressed("ArrowDown") && s.cy < s.z.rows - 1) { s.cy++; moved = true; }
      if (moved) s.kb = true;
      if (ip.pressed("Space") || ip.pressed("Enter")) { s.kb = true; act(g, s.cx, s.cy, s.mode === 1); }
      if (ip.pressed("KeyF")) { s.kb = true; toggleFlag(g, s.cx, s.cy); }
      if (ip.pressed("KeyM")) s.mode ^= 1;
    }
    if (s.win && s.end && !reduce && s.end % 2 === 0) for (let k = 0; k < 3; k++) s.parts.push({ x: g.rng() * W, y: -6, vx: (g.rng() - 0.5) * 50, vy: 40 + g.rng() * 60, life: 1.6, col: [C.red, C.blue, C.yellow, C.green, C.orange][k + (s.end >> 1) % 3], big: 1 });
    if (s.shake > 0) s.shake *= 0.9;
    if (s.flash > 0) s.flash -= 1 / 60;
    for (const p of s.parts) { p.x += p.vx / 60; p.y += p.vy / 60; p.vy += 4; p.life -= 1 / 60; }
    s.parts = s.parts.filter((p) => p.life > 0);
  },
  draw,
});
function win(g) {
  const bonus = Math.round(500 * s.z.k + Math.max(0, s.z.par - s.t) * 5 * s.z.k);
  g.score += bonus; g.best = Math.max(g.best, g.score);
  g.phase = "over"; g.message = `Garden cleared in ${fmt(s.t)}!`; g.sound("win");
}
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

// Pointer input (capture so we see the phase before the engine reacts).
let down = null;
g.canvas.addEventListener("pointerdown", (e) => {
  if (g.phase !== "playing" || s.end) return;
  const r = g.canvas.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
  s.kb = false;
  if (hitMode(x, y)) { s.mode ^= 1; g.sound("click"); return; }
  const cell = cellAt(x, y); if (!cell) return;
  if (e.pointerType === "mouse") act(g, cell[0], cell[1], e.button === 2 || (e.button === 0 && s.mode === 1));
  else if (e.isPrimary) { s.press = { c: cell[0], r: cell[1], t: performance.now(), done: false }; down = { x: e.clientX, y: e.clientY }; }
}, true);
g.canvas.addEventListener("pointermove", (e) => { if (s?.press && down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 14) s.press = null; });
const endPress = (e) => {
  const p = s.press; s.press = null;
  if (p && !p.done && e.type === "pointerup" && g.phase === "playing" && !s.end) act(g, p.c, p.r, s.mode === 1);
};
g.canvas.addEventListener("pointerup", endPress);
g.canvas.addEventListener("pointercancel", () => { s.press = null; });
addEventListener("keydown", (e) => {
  const k = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2 }[e.code];
  if (k !== undefined && (g.phase === "title" || g.phase === "over")) { sizeIdx = k; g.start(); }
});

// Size buttons (real HTML buttons) shown on the title and game-over screens.
const bar = document.createElement("div");
bar.style.cssText = "position:fixed;left:0;display:none;gap:8px;justify-content:center;width:100vw;pointer-events:none";
SIZES.forEach((z, i) => {
  const b = document.createElement("button");
  b.innerHTML = `<b>${i + 1} ${z.name}</b><br><span style="font-size:12px;opacity:.85">${z.cols}×${z.rows} · ${z.mines} moles</span>`;
  b.style.cssText = "pointer-events:auto;min-width:96px;min-height:52px;padding:4px 8px;border-radius:12px;border:2px solid #919191;font:500 14px system-ui,sans-serif;color:#fff;cursor:pointer;line-height:1.25";
  b.onclick = () => { sizeIdx = i; g.start(); b.blur(); };
  b.addEventListener("keydown", (e) => { if (e.code === "Enter" || e.code === "Space") e.stopPropagation(); });
  b.className = "sz"; bar.appendChild(b);
});
const st = document.createElement("style");
st.textContent = ".sz:focus-visible{outline:3px solid #ffd400;outline-offset:2px}";
document.head.appendChild(st); document.body.appendChild(bar);
(function place_() {
  const show = g.phase === "title" || g.phase === "over", r = g.canvas.getBoundingClientRect();
  bar.style.display = show ? "flex" : "none";
  if (show) { bar.style.top = r.top + r.height * (g.phase === "over" ? 0.7 : 0.68) + "px"; [...bar.children].forEach((b, i) => { b.style.background = i === sizeIdx ? C.green : C.surface; b.style.color = i === sizeIdx ? C.dark : C.white; }); }
  requestAnimationFrame(place_);
})();

function carrot(ctx, x, y, sz, a = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.fillStyle = C.green;
  for (const r of [-0.5, 0, 0.5]) { ctx.save(); ctx.translate(0, -sz * 0.35); ctx.rotate(r); ctx.beginPath(); ctx.ellipse(0, -sz * 0.22, sz * 0.09, sz * 0.24, 0, 0, 7); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = C.orange; ctx.beginPath(); ctx.moveTo(-sz * 0.24, -sz * 0.36); ctx.lineTo(sz * 0.24, -sz * 0.36); ctx.lineTo(0, sz * 0.5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#c4600a"; ctx.lineWidth = Math.max(1, sz * 0.05);
  for (const yy of [-0.18, 0.04]) { ctx.beginPath(); ctx.moveTo(-sz * 0.12, sz * yy); ctx.lineTo(sz * 0.02, sz * yy); ctx.stroke(); }
  ctx.restore();
}
function mole(ctx, x, y, sz) {
  ctx.fillStyle = "#6b4226"; ctx.beginPath(); ctx.arc(x, y, sz * 0.38, 0, 7); ctx.fill();
  ctx.fillStyle = "#8a5a3a"; ctx.beginPath(); ctx.arc(x, y + sz * 0.08, sz * 0.26, 0, 7); ctx.fill();
  ctx.fillStyle = "#ff8fa0"; ctx.beginPath(); ctx.arc(x, y + sz * 0.08, sz * 0.1, 0, 7); ctx.fill();
  ctx.fillStyle = C.white; for (const d of [-1, 1]) { ctx.beginPath(); ctx.arc(x + d * sz * 0.16, y - sz * 0.12, sz * 0.08, 0, 7); ctx.fill(); }
  ctx.fillStyle = C.dark; for (const d of [-1, 1]) { ctx.beginPath(); ctx.arc(x + d * sz * 0.16, y - sz * 0.11, sz * 0.04, 0, 7); ctx.fill(); }
}
function flagIcon(ctx, x, y, sz) {
  ctx.fillStyle = C.dark; ctx.fillRect(x - sz * 0.2, y - sz * 0.34, sz * 0.07, sz * 0.66); ctx.fillRect(x - sz * 0.3, y + sz * 0.28, sz * 0.5, sz * 0.08);
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(x - sz * 0.14, y - sz * 0.34); ctx.lineTo(x + sz * 0.28, y - sz * 0.15); ctx.lineTo(x - sz * 0.14, y + sz * 0.04); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.dark; ctx.lineWidth = 1.2; ctx.stroke();
}
function txt(ctx, t, x, y, size, col, align = "left", w = 700) {
  ctx.font = `${w} ${Math.max(size, 12 / g.scale)}px ${g.font}`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(t, x, y);
}

function draw(g, ctx) {
  if (!s) return;
  const { cs, ox, oy } = layout(), z = s.z, pt = g.input.pointer;
  ctx.save();
  if (s.shake > 0.3 && g.canShake) ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
  // HUD
  const left = z.mines - s.flags, safeLeft = s.n - z.mines - s.revealed;
  txt(ctx, fmt(s.t), 12, 24, 26, C.white);
  txt(ctx, z.name, 12, 52, 14, C.gray, "left", 600);
  // Counters stay left of x ≈ 190: the mute/pause/full-screen buttons cover the top-right.
  mole(ctx, 88, 24, 24); txt(ctx, String(left), 106, 24, 20, C.white);
  carrot(ctx, 150, 24, 22, 0.6); txt(ctx, String(safeLeft), 166, 24, 20, C.white);
  txt(ctx, "Score " + g.score, 88, 52, 14, C.gray, "left", 600);
  // board
  ctx.fillStyle = C.surface; ctx.beginPath(); ctx.roundRect(ox - 4, oy - 4, cs * z.cols + 8, cs * z.rows + 8, 10); ctx.fill();
  const hover = g.phase === "playing" && !s.kb && !s.end && !s.press ? cellAt(pt.x, pt.y) : null;
  const gap = Math.max(1.5, cs * 0.05), rad = cs * 0.16;
  for (let r = 0; r < z.rows; r++) for (let c = 0; c < z.cols; c++) {
    const i = idx(c, r), x = ox + c * cs + gap, y = oy + r * cs + gap, w = cs - gap * 2, cx = x + w / 2, cy = y + w / 2;
    const shown = s.rev[i] && s.frame >= s.t0[i] || (s.mine[i] && s.end && s.frame >= s.t0[i] && !s.win);
    const age = s.frame - s.t0[i];
    if (shown) {
      const pop = age < 8 && !reduce ? 0.8 + 0.2 * Math.sin((age / 8) * 1.57) : 1;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(pop, pop); ctx.translate(-cx, -cy);
      ctx.fillStyle = i === s.hit ? C.red : C.gray; ctx.beginPath(); ctx.roundRect(x, y, w, w, rad); ctx.fill();
      if (s.mine[i]) { const pk = reduce ? 1 : Math.min(1, age / 10), bob = i === s.hit && !reduce ? Math.sin(s.frame * 0.4) * 2 : 0; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, w); ctx.clip(); mole(ctx, cx, cy + (1 - pk) * w * 0.6 + bob, w); ctx.restore(); }
      else if (s.num[i]) { const done = nbrs(c, r).filter(([a, b]) => s.flag[idx(a, b)]).length === s.num[i]; ctx.globalAlpha = done ? 0.45 : 1; txt(ctx, String(s.num[i]), cx, cy + 1, w * 0.62, NUMC[s.num[i]], "center", 800); ctx.globalAlpha = 1; }
      else { const k = reduce ? 1 : age < 14 ? 1 + 0.5 * Math.sin((age / 14) * 3.14) : 1; carrot(ctx, cx, cy - (k - 1) * w * 0.5, w * 0.6 * k, 0.5); }
      ctx.restore();
    } else {
      const hl = (hover && hover[0] === c && hover[1] === r) || (s.kb && s.cx === c && s.cy === r) || (s.press && s.press.c === c && s.press.r === r);
      ctx.fillStyle = hl ? "#5fc863" : C.green; ctx.beginPath(); ctx.roundRect(x, y, w, w, rad); ctx.fill();
      ctx.fillStyle = hl ? "#7ad97f" : "#5fc863"; ctx.beginPath(); ctx.roundRect(x, y, w, w * 0.45, [rad, rad, 0, 0]); ctx.fill();
      ctx.fillStyle = "#2f8a37"; ctx.fillRect(x + rad, y + w - 3, w - rad * 2, 3);
      if (s.flag[i]) { flagIcon(ctx, cx, cy, w); if (s.end && !s.win && !s.mine[i]) { txt(ctx, "×", cx, cy, w * 0.8, C.red, "center", 800); } }
    }
    if (s.press && !s.press.done && s.press.c === c && s.press.r === r) {
      const f = Math.min(1, (performance.now() - s.press.t) / 350);
      ctx.strokeStyle = C.white; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, w * 0.38, -1.57, -1.57 + f * 6.28); ctx.stroke();
    }
  }
  if (s.kb && g.phase === "playing") { ctx.strokeStyle = C.white; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(ox + s.cx * cs + 1, oy + s.cy * cs + 1, cs - 2, cs - 2, rad + 1); ctx.stroke(); }
  for (const p of s.parts) { ctx.globalAlpha = Math.min(1, p.life * 3); ctx.fillStyle = p.col; ctx.fillRect(p.x - 2, p.y - 2, p.big ? 6 : 4, p.big ? 4 : 4); }
  ctx.globalAlpha = 1;
  // mode toggle
  const m = modeBtn;
  ctx.fillStyle = s.mode ? C.yellow : C.green; ctx.beginPath(); ctx.roundRect(m.x, m.y, m.w, m.h, 12); ctx.fill();
  ctx.strokeStyle = C.white; ctx.lineWidth = 2; ctx.stroke();
  if (s.mode) flagIcon(ctx, m.x + 32, m.y + m.h / 2, 34); else { ctx.fillStyle = C.dark; ctx.fillRect(m.x + 31, m.y + 11, 4, 22); ctx.beginPath(); ctx.moveTo(m.x + 22, m.y + 30); ctx.lineTo(m.x + 44, m.y + 30); ctx.lineTo(m.x + 33, m.y + 40); ctx.fill(); }
  txt(ctx, s.mode ? "Flag mode" : "Dig mode", m.x + 56, m.y + m.h / 2, 16, C.dark, "left", 800);
  if (s.win && s.end) { ctx.fillStyle = "rgba(45,45,45,.8)"; ctx.beginPath(); ctx.roundRect(40, 280, 280, 70, 14); ctx.fill(); txt(ctx, "Garden cleared!", W / 2, 315, 28, C.yellow, "center"); }
  ctx.restore();
  if (s.flash > 0) { ctx.fillStyle = `rgba(255,60,40,${s.flash})`; ctx.fillRect(0, 0, W, H); }
}

// Test hooks
const T = g.test;
// Real play gets a fresh seed each round; tests pin it with keepSeed + reseed.
T.keepSeed = false;
T.state = () => ({ size: sizeIdx, cols: s.z.cols, rows: s.z.rows, mines: s.z.mines, placed: s.placed, revealed: s.revealed, flags: s.flags, t: +s.t.toFixed(1), mode: s.mode, end: s.end, cursor: [s.cx, s.cy], win: s.win });
T.moles = () => s.mine.reduce((a, m, i) => (m ? [...a, [i % s.z.cols, Math.floor(i / s.z.cols)]] : a), []);
T.flagged = (c, r) => !!s.flag[idx(c, r)];
T.isRev = (c, r) => !!s.rev[idx(c, r)];
T.num = (c, r) => s.num[idx(c, r)];
T.cellXY = (c, r) => { const { cs, ox, oy } = layout(), b = g.canvas.getBoundingClientRect(); return [b.left + ((ox + (c + 0.5) * cs) / W) * b.width, b.top + ((oy + (r + 0.5) * cs) / H) * b.height, (cs / W) * b.width]; };
T.modeXY = () => { const b = g.canvas.getBoundingClientRect(); return [b.left + ((modeBtn.x + modeBtn.w / 2) / W) * b.width, b.top + ((modeBtn.y + modeBtn.h / 2) / H) * b.height]; };
T.solvable = () => s.gf;
T.measure = (k, n) => { const old = sizeIdx; sizeIdx = k; let fb = 0, tr = 0; for (let a = 0; a < n; a++) { init(); const z = s.z; place(g, Math.floor(g.rng() * z.cols), Math.floor(g.rng() * z.rows)); if (!s.gf) fb++; tr += s.tries; } sizeIdx = old; init(); return { fb, avgTries: tr / n }; };
