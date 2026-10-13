import { createGame } from "../shared/engine.js";
const W = 360, H = 640, U = 26, G = 470, PX0 = 70, PW = 220, FIELD = 560, SLACK = 5, SPREAD = 80;
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surface: "#3c3c3c", white: "#ffffff" };
const COLS = [C.yellow, C.red, C.white, C.green, "#ff9a3c", "#b79cff"];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SH = {
  O: ["XX", "XX"], I2: ["XX"], I3: ["XXX"], I4: ["XXXX"], I5: ["XXXXX"], L: ["X.", "X.", "XX"], J: [".X", ".X", "XX"], T: ["XXX", ".X."],
  S: [".XX", "XX."], Z: ["XX.", ".XX"], U: ["X.X", "XXX"], P: [".X.", "XXX", ".X."], B: ["X..", "X..", "XXX"], ST: ["X..", "XX.", "XXX"], C: ["XX", "X.", "XX"], H: ["X.X", "XXX", "X.X"]
};
const TIER = [["O", "O", "I2", "I3", "I3"], ["O", "I2", "I3", "I4", "L", "J", "T", "S", "Z"], ["I3", "I4", "L", "J", "T", "S", "Z", "U", "P", "I5", "B", "ST", "C", "H"]];
const cellsOf = (k) => { const c = []; SH[k].forEach((row, y) => [...row].forEach((ch, x) => ch === "X" && c.push([x, y]))); return c; };
const dims = (c) => [Math.max(...c.map((a) => a[0])) + 1, Math.max(...c.map((a) => a[1])) + 1];
const rot = (c) => { const h = dims(c)[1]; return c.map(([x, y]) => [h - 1 - y, x]); };
const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };

let s;
function pick(g) {
  const n = s.n; const pool = n < 4 ? TIER[0].slice(0, 3) : n < 12 ? TIER[0].concat(TIER[1]) : n < 24 ? TIER[1].concat(TIER[2]) : TIER[2].concat(TIER[2], TIER[1].slice(4));
  const k = pool[Math.floor(g.rng() * pool.length)];
  return { k, cells: cellsOf(k), col: COLS[s.n % COLS.length] };
}
let rotQ = 0;
addEventListener("keydown", (e) => { if (!e.repeat && (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "KeyX")) rotQ = 1; });
function init(g) { rotQ = 0;
  s = { blocks: [], rects: [{ x: PX0, y: G, w: PW, h: 80, o: -1 }], n: 0, cam: 0, camT: 0, mode: "hover", strikes: 0, bonus: 0, floats: [], t: 0, timer: 0, tip: 7, shake: 0, vy: 0, top: G, margin: 99, drag: null, topple: null, cur: null, nxt: null, wobbled: 0 };
  s.cur = pick(g); s.n = 0; s.nxt = pick(g); place0(g); g.score = 0;
}
// Each block appears at a random spot up to SPREAD either side of center (still
// over the pedestal), so it has to be lined up rather than dropped straight down.
function place0(g) {
  const [w] = dims(s.cur.cells), off = (g.rng() * 2 - 1) * SPREAD;
  s.cur.px = Math.max(0, Math.min(W - w * U, (W - w * U) / 2 + off)); s.cur.py = 84 - s.cam; s.timer = limit();
}
const limit = () => (s.n < 4 ? Infinity : Math.max(4, 14 - s.n * 0.3));
function next(g) {
  s.cur = s.nxt; s.nxt = pick(g); s.mode = "hover"; place0(g); s.vy = 0;
}
const dropIt = (g) => { if (s.mode === "hover") { s.mode = "fall"; s.vy = 260; g.sound("click"); } };
function rotateCur(g) {
  if (s.mode !== "hover") return;
  const [w0] = dims(s.cur.cells); s.cur.cells = rot(s.cur.cells); const [w1] = dims(s.cur.cells);
  s.cur.px = Math.max(0, Math.min(W - w1 * U, s.cur.px + (w0 - w1) * U / 2)); g.sound({ freq: 520, dur: 0.04, type: "square", vol: 0.05 });
}
const cellRects = (b) => b.cells.map(([cx, cy]) => ({ x: b.px + cx * U, y: b.py + cy * U, w: U, h: U }));

function supports(rs, idx) {
  const out = [];
  for (const r of rs) for (const q of s.rects) {
    if (q.o === idx || q.o > idx) continue;
    if (Math.abs(r.y + U - q.y) > 0.6) continue;
    const lo = Math.max(r.x, q.x), hi = Math.min(r.x + U, q.x + q.w);
    if (hi - lo > 0.5) out.push({ p: q.o, lo, hi });
  }
  return out;
}
function evaluate(B = s.blocks) {
  const amp = B.map(() => 0); let off = -1, minM = 99;
  for (let i = 0; i < B.length; i++) {
    const S = [i]; for (let q = i + 1; q < B.length; q++) if (B[q].sup.some((u) => S.includes(u.p))) S.push(q);
    let cx = 0, cn = 0, lo = Infinity, hi = -Infinity;
    for (const m of S) { for (const r of B[m].rects) { cx += r.x + U / 2; cn++; } for (const u of B[m].sup) if (!S.includes(u.p)) { lo = Math.min(lo, u.lo); hi = Math.max(hi, u.hi); } }
    const com = cx / cn, m = Math.min(com - lo, hi - com);
    B[i].m = m; B[i].com = com; B[i].lo = lo; B[i].hi = hi; B[i].S = S;
    if (m < -SLACK) off = i; else if (S.length) minM = Math.min(minM, m);
    const a = Math.max(0, Math.min(1, (9 - m) / (9 + SLACK))); if (m >= -SLACK) for (const k of S) amp[k] = Math.max(amp[k], a);
  }
  B.forEach((b, i) => (b.amp = amp[i]));
  return { off, minM };
}
// Dry run: where would cells land at px, and how stable is the tower afterwards?
function trial(cells, px) {
  let lim = Infinity;
  for (const [cx, cy] of cells) { const x0 = px + cx * U; for (const r of s.rects) if (x0 + U > r.x + 0.01 && x0 < r.x + r.w - 0.01) lim = Math.min(lim, r.y - (cy + 1) * U); }
  if (!isFinite(lim)) return null;
  const rs = cells.map(([cx, cy]) => ({ x: px + cx * U, y: lim + cy * U, w: U, h: U })), idx = s.blocks.length;
  const B = s.blocks.map((b) => ({ rects: b.rects, sup: b.sup })); B.push({ rects: rs, sup: supports(rs, idx) });
  const ev = evaluate(B); return { py: lim, rects: rs, off: ev.off >= 0, m: ev.off >= 0 ? -9 : ev.minM, top: Math.min(lim, s.top) };
}
function bestMove() {
  let best = null, cells = s.cur.cells;
  for (let r = 0; r < 4; r++, cells = rot(cells)) {
    const w = dims(cells)[0];
    for (let px = 0; px <= W - w * U; px += 2) {
      const t = trial(cells, px); if (!t || t.off) continue;
      const sc = Math.min(t.m, 14) * 10 - (G - t.top) * 0.02 - Math.abs(px + w * U / 2 - W / 2) * 0.01;
      if (!best || sc > best.sc) best = { sc, r, px, m: t.m };
    }
  }
  return best;
}
function land(g) {
  const c = s.cur, rs = cellRects(c), idx = s.blocks.length;
  const blk = { cells: c.cells, col: c.col, rects: rs, sup: supports(rs, idx), flash: 1, amp: 0, k: c.k, phase: g.rng() * 6 };
  const hadTower = s.blocks.length > 0;
  s.blocks.push(blk); for (const r of rs) s.rects.push({ ...r, o: idx });
  s.n++;
  const ev = evaluate();
  if (ev.off >= 0) { startTopple(g, ev.off); return; }
  const top = Math.min(...s.rects.map((r) => r.y)); s.top = top; s.camT = Math.max(0, 340 - top);
  const hu = Math.floor((G - top) / U + 0.01);
  if (hadTower && blk.sup.length) {
    const lo = Math.min(...blk.sup.map((u) => u.lo)), hi = Math.max(...blk.sup.map((u) => u.hi));
    const com = rs.reduce((a, r) => a + r.x + U / 2, 0) / rs.length;
    if (Math.abs(com - (lo + hi) / 2) < 5) { s.bonus += 5; float("Centered +5", com, rs[0].y, C.yellow); g.sound("score"); }
  }
  g.score = hu * 10 + s.bonus; s.margin = ev.minM;
  g.sound("hit"); s.tip = 0; s.shake = reduce ? 0 : 0.12;
  if (ev.minM < 3 && s.n > 2) float("Wobbly!", W / 2, 120, C.red);
  next(g);
}
function float(t, x, wy, col) { s.floats.push({ t, x: Math.max(60, Math.min(W - 60, x)), y: wy + s.cam, l: 1.2, col }); }
function startTopple(g, i) {
  const b = s.blocks[i], dir = b.com < b.lo ? -1 : 1, px = dir < 0 ? b.lo : b.hi;
  const py = Math.min(...b.sup.map(() => 0), 0) || 0;
  s.mode = "topple"; s.topple = { S: b.S, dir, px, py: Math.max(...b.S.flatMap((k) => s.blocks[k].rects.map((r) => r.y + U))) , t: 0 }; s.topple.py = Math.max(...b.rects.map((r) => r.y + U));
  g.sound("lose");
}
function update(g, dt) {
  const inp = g.input, ptr = inp.pointer;
  s.t += dt; s.cam += (s.camT - s.cam) * Math.min(1, dt * 4); if (s.cam > s.camT - 0.05 && s.cam < s.camT + 0.05) s.cam = s.camT;
  s.shake = Math.max(0, s.shake - dt); s.tip = Math.max(0, s.tip - dt);
  for (const f of s.floats) { f.l -= dt; f.y -= 22 * dt; } s.floats = s.floats.filter((f) => f.l > 0);
  for (const b of s.blocks) b.flash = Math.max(0, b.flash - dt * 3);
  if (s.mode === "topple") {
    const T = s.topple; T.t += dt; if (T.t > 1.9) { g.over(`Toppled at ${Math.floor((G - s.top) / U)}`); } return;
  }
  const c = s.cur, ready = g.frame > 10;
  if (s.mode === "hover") {
    const [w] = dims(c.cells); let moved = false;
    if (inp.down("ArrowLeft") || inp.down("KeyA")) { c.px -= 190 * dt; moved = true; }
    if (inp.down("ArrowRight") || inp.down("KeyD")) { c.px += 190 * dt; moved = true; }
    if (inp.pressed("ArrowUp") || inp.pressed("KeyW") || inp.pressed("KeyX") || rotQ > 0) { rotQ = 0; rotateCur(g); }
    if (ready && (inp.pressed("ArrowDown") || inp.pressed("Space") || inp.pressed("KeyS"))) dropIt(g);
    if (ptr.pressed && ready) {
      if (ptr.y >= 568 && ptr.y <= 632) { if (ptr.x < 180) rotateCur(g); else dropIt(g); s.drag = null; }
      else if (ptr.y < FIELD) s.drag = { x: ptr.x, y: ptr.y, px: c.px, t: s.t, moved: false };
    }
    if (s.drag && ptr.down) {
      const dx = ptr.x - s.drag.x, dy = ptr.y - s.drag.y;
      if (Math.abs(dx) > 6) s.drag.moved = true;
      if (s.drag.moved) c.px = s.drag.px + dx;
      if (dy > 55 && dy > Math.abs(dx) * 1.5) { dropIt(g); s.drag = null; }
    } else if (s.drag) { if (!s.drag.moved && s.t - s.drag.t < 0.3 && Math.abs(ptr.y - s.drag.y) < 8) rotateCur(g); s.drag = null; }
    c.px = Math.max(0, Math.min(W - w * U, c.px)); c.py = 84 - s.cam;
    if (g.test.bot && ready) { const b = bestMove(); if (b) { for (let i = 0; i < b.r; i++) c.cells = rot(c.cells); c.px = b.px; } dropIt(g); return; }
    s.timer -= dt; if (s.timer <= 0) dropIt(g);
    return;
  }
  // falling
  s.vy = Math.min(950, s.vy + 2600 * dt);
  let lim = Infinity;
  for (const [cx, cy] of c.cells) {
    const x0 = c.px + cx * U, x1 = x0 + U, cb = c.py + (cy + 1) * U;
    for (const r of s.rects) if (x1 > r.x + 0.01 && x0 < r.x + r.w - 0.01 && r.y >= cb - 0.5) lim = Math.min(lim, r.y - (cy + 1) * U);
  }
  const ny = c.py + s.vy * dt;
  if (ny >= lim) { c.py = lim; land(g); return; }
  c.py = ny;
  if (c.py > G + 140) { s.strikes++; g.sound("hit"); float("Missed!", c.px + 30, G - s.cam + 60, C.red); if (s.strikes >= 3) { s.mode = "x"; g.over("Three blocks lost"); } else next(g); }
}

function drawBlock(ctx, b, ox, oy, alpha) {
  ctx.fillStyle = b.col; ctx.strokeStyle = C.dark; ctx.lineWidth = 2;
  for (const r of b.rects || cellRects(b)) { ctx.fillRect(r.x + ox, r.y + oy, U, U); ctx.strokeRect(r.x + ox + 1, r.y + oy + 1, U - 2, U - 2); }
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  for (const r of b.rects || cellRects(b)) ctx.fillRect(r.x + ox + 4, r.y + oy + 4, U - 8, 3);
  if (b.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${b.flash * (reduce ? 0.25 : 0.6)})`; for (const r of b.rects) ctx.fillRect(r.x + ox, r.y + oy, U, U); }
}
function txt(ctx, g, t, x, y, size, col, al = "left") {
  ctx.textAlign = al; ctx.textBaseline = "middle"; ctx.font = `800 ${Math.max(size, 12 / g.scale)}px ${g.font}`;
  ctx.lineWidth = 4; ctx.strokeStyle = C.dark; ctx.strokeText(t, x, y); ctx.fillStyle = col; ctx.fillText(t, x, y);
}
function draw(g, ctx) {
  const hp = Math.min(1, (G - s.top) / (U * 40));
  const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, mix(C.blue, "#16324a", hp)); gr.addColorStop(1, mix("#8fe3f7", "#2a5f86", hp));
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  if (hp > 0.4) { ctx.fillStyle = C.white; ctx.globalAlpha = (hp - 0.4); for (let i = 0; i < 22; i++) ctx.fillRect((i * 83) % W, (i * 47 + s.cam * 0.1) % FIELD, 2, 2); ctx.globalAlpha = 1; }
  ctx.fillStyle = `rgba(255,255,255,${0.7 - hp * 0.5})`;
  for (let i = 0; i < 4; i++) { const x = ((i * 130 + s.t * 6) % 480) - 80, y = ((i * 170 + s.cam * 0.3) % 560); ctx.beginPath(); ctx.roundRect(x, y, 64, 16, 8); ctx.roundRect(x + 12, y - 9, 32, 16, 8); ctx.fill(); }
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, FIELD); ctx.clip();
  let sx = s.shake > 0 && g.canShake ? (Math.random() - 0.5) * 3 : 0;
  ctx.translate(sx, s.cam);
  // pedestal
  ctx.fillStyle = C.surface; ctx.fillRect(PX0, G, PW, 90); ctx.fillStyle = C.dark; ctx.fillRect(PX0, G, PW, 8);
  ctx.fillStyle = "#4a4a4a"; for (let i = 0; i < 6; i++) ctx.fillRect(PX0 + 16 + i * 36, G + 24, 20, 6);
  // guide
  if (s.mode === "hover" && g.phase === "playing") {
    const [w, h] = dims(s.cur.cells); ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(s.cur.px, s.cur.py + h * U, w * U, FIELD - s.cam - s.cur.py - h * U);
  }
  if (s.mode === "hover" && g.phase === "playing") {
    const t = trial(s.cur.cells, s.cur.px);
    if (t) {
      const col = t.off ? C.red : t.m < 4 ? "#ff9a3c" : C.green; s.risk = t.off ? 2 : t.m < 4 ? 1 : 0; s.rm = t.off ? -1 : t.m;
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
      for (const r of t.rects) { ctx.globalAlpha = 0.28; ctx.fillRect(r.x, r.y, U, U); ctx.globalAlpha = 0.9; ctx.strokeRect(r.x + 1, r.y + 1, U - 2, U - 2); } ctx.globalAlpha = 1;
    } else s.risk = 3;
  }
  const T = s.topple;
  s.blocks.forEach((b, i) => {
    if (T && T.S.includes(i)) return;
    const wob = reduce ? 0 : Math.sin(s.t * 14 + b.phase) * b.amp * 1.6;
    drawBlock(ctx, b, wob, 0);
    if (b.amp > 0.5 && reduce) { ctx.strokeStyle = C.red; ctx.lineWidth = 2; for (const r of b.rects) ctx.strokeRect(r.x + 3, r.y + 3, U - 6, U - 6); }
  });
  if (T) {
    const t = T.t, a = T.dir * Math.min(1.9, 1.3 * t * t + 0.1 * t), fall = t > 0.5 ? 700 * (t - 0.5) * (t - 0.5) : 0;
    ctx.save(); ctx.translate(T.px, T.py + fall); ctx.rotate(a); ctx.translate(-T.px, -T.py);
    for (const k of T.S) drawBlock(ctx, s.blocks[k], 0, 0); ctx.restore();
  } else if (g.phase !== "title" && s.mode !== "x") drawBlock(ctx, { ...s.cur, flash: 0 }, 0, 0);
  ctx.restore();
  ctx.save(); ctx.translate(0, 0);
  for (const f of s.floats) { ctx.globalAlpha = Math.min(1, f.l * 2); txt(ctx, g, f.t, f.x, f.y, 16, f.col, "center"); } ctx.globalAlpha = 1; ctx.restore();
  // HUD
  txt(ctx, g, `${g.score}`, 14, 28, 22, C.white);
  txt(ctx, g, `Height ${Math.max(0, Math.floor((G - s.top) / U))} m`, 14, 52, 14, C.yellow);
  for (let i = 0; i < 3; i++) { ctx.fillStyle = i < s.strikes ? C.red : "rgba(45,45,45,0.45)"; ctx.fillRect(14 + i * 14, 66, 10, 10); }
  txt(ctx, g, "NEXT", 168, 18, 12, C.white, "center");
  const nc = s.nxt.cells, [nw, nh] = dims(nc), cs = 10; ctx.fillStyle = s.nxt.col; ctx.strokeStyle = C.dark; ctx.lineWidth = 1.5;
  for (const [x, y] of nc) { ctx.fillRect(168 - nw * cs / 2 + x * cs, 28 + y * cs, cs, cs); ctx.strokeRect(168 - nw * cs / 2 + x * cs, 28 + y * cs, cs, cs); }
  if (g.phase === "playing" && s.mode === "hover" && s.n > 0) {
    const R = s.risk, col = [C.green, "#ff9a3c", C.red, C.red][R], v = R === 3 ? 0 : R === 2 ? 0.06 : Math.max(0.12, Math.min(1, s.rm / 14));
    ctx.fillStyle = "rgba(45,45,45,0.55)"; ctx.fillRect(14, 84, 72, 8); ctx.fillStyle = col; ctx.fillRect(14, 84, 72 * v, 8);
    txt(ctx, g, ["STEADY", "SHAKY", "TOPPLES", "MISS"][R], 14, 104, 12, col);
  }
  // timer bar + buttons
  const lim = limit();
  if (isFinite(lim) && s.mode === "hover") { ctx.fillStyle = "rgba(45,45,45,0.5)"; ctx.fillRect(0, FIELD, W, 5); ctx.fillStyle = s.timer < 2 ? C.red : C.yellow; ctx.fillRect(0, FIELD, W * Math.max(0, s.timer / lim), 5); }
  if (g.phase !== "title") {
    const btn = (x, label, col) => { ctx.fillStyle = C.dark; ctx.beginPath(); ctx.roundRect(x, 568, 160, 60, 12); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(x + 8, 574, 144, 5); ctx.fillStyle = C.white; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `800 ${Math.max(16, 12 / g.scale)}px ${g.font}`; ctx.fillText(label, x + 80, 604); };
    btn(12, "↻ ROTATE", C.blue); btn(188, "▼ DROP", C.red);
  }
  if (g.phase === "playing" && s.tip > 0 && s.n < 3) {
    const touch = matchMedia("(pointer:coarse)").matches || g.touched;
    ctx.globalAlpha = Math.min(1, s.tip); txt(ctx, g, touch ? "Drag to move · tap to rotate" : "← → move · ↑ rotate · Space drop", W / 2, 250, 15, C.white, "center"); ctx.globalAlpha = 1;
  }
}

const g = createGame({ width: W, height: H, background: C.dark, init, update, draw, title: "Tumble Tower",
  help: ["← → move · ↑ rotate · ↓ / Space drop", "Touch: drag to move, tap ROTATE / DROP", "Keep each block's weight over what holds it", "P: pause"] });
addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") g.touched = true; }, true);
// Real play gets a fresh seed each round; tests pin it with keepSeed + reseed.
g.test.keepSeed = false; g.test.bot = false;
g.test.state = () => ({ risk: s.risk, n: s.n, mode: s.mode, strikes: s.strikes, px: Math.round(s.cur.px), cw: dims(s.cur.cells)[0], ch: dims(s.cur.cells)[1], k: s.cur.k, height: Math.floor((G - s.top) / U), margin: Math.round(s.margin), bonus: s.bonus, cells: s.cur.cells.length, last: s.blocks.length ? Math.round(s.blocks[s.blocks.length - 1].com || 180) : 180, cc: Math.round(s.cur.cells.reduce((a, c) => a + c[0] * U + U / 2, 0) / s.cur.cells.length), timer: Math.round(s.timer * 10) / 10, ctr: (() => { const y = Math.min(...s.rects.map((r) => r.y)), t = s.rects.filter((r) => r.y === y); return Math.round((Math.min(...t.map((r) => r.x)) + Math.max(...t.map((r) => r.x + r.w))) / 2); })() });
g.test.force = (k) => { const [w0] = dims(s.cur.cells); s.cur.k = k; s.cur.cells = cellsOf(k); const [w1] = dims(s.cur.cells); s.cur.px = Math.max(0, Math.min(W - w1 * U, s.cur.px + (w0 - w1) * U / 2)); s.timer = 99; };
g.test.at = (cx) => { const [w] = dims(s.cur.cells); s.cur.px = cx - w * U / 2; };
g.test.put = (px) => { s.cur.px = px; };
