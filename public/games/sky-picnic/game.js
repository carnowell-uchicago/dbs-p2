import { createGame } from "../shared/engine.js";
const W = 360, H = 640, BX = 140, TOP = 100, C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", white: "#fff", gray: "#d4d4d4" };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CEN = [150, 250, 350, 445, 545], BANDS = [100, 200, 300, 400, 490, 600], GOAL = 12;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let s, G0;
function genWinds(n, first, dir) {
  const mult = Math.min(1 + 0.03 * n, 1.3), sg = [1, 1, -1, -1].sort(() => G0.rng() - 0.5);
  const w = sg.map((d) => d * (first ? 50 + G0.rng() * 30 : 30 + G0.rng() * 75) * mult);
  if (n < 3) { const j = w.findIndex((v, k) => k !== 3 && v * dir > 0); if (w[3] * dir < 0 && j >= 0) [w[3], w[j]] = [w[j], w[3]]; }
  w.push((G0.rng() < 0.5 ? -1 : 1) * 14); return w;
}
function newLeg() {
  const n = s.delivered, dist = Math.min(520 + 55 * n, 1050), dir = n < 2 || G0.rng() < 0.7 ? 1 : -1, from = s.kitchen;
  const tx = from.x + dir * dist;
  s.isl = s.isl.filter((i) => i === from || Math.abs(i.x - tx) > 170);
  s.target = { x: tx, top: 535 + G0.rng() * 25, hw: 74, kind: "picnic" };
  s.isl.push(s.target);
  for (let i = 1; i <= 2; i++) s.isl.push({ x: from.x + dir * dist * (i / 3) + (G0.rng() - 0.5) * 80, top: 545 + G0.rng() * 30, hw: 40, kind: "stone" });
  s.legT = s.timer = dist / 40 + 24 + (n ? Math.min(s.timer * 0.5, 15) : 0); s.started = false; s.wt = genWinds(n, n === 0, dir);
  s.isl = s.isl.filter((i) => Math.abs(i.x - tx) < 2600);
}
function init(gg) { G0 = gg;
  s = { x: 0, y: 540, vx: 0, vy: 0, b: 0, ground: true, delivered: 0, started: false, timer: 30, legT: 30, ws: [0, 0, 0, 0, 0], wt: [0, 0, 0, 0, 0], isl: [], birds: [], t: 0, hold: 0, flash: 0, msg: "", msgT: 0, bump: 0, streak: [] , hit: 0};
  s.kitchen = { x: 0, top: 540, hw: 70, kind: "kitchen" }; s.isl.push(s.kitchen);
  newLeg(); s.ws = s.wt.slice();
  for (let i = 0; i < 5; i++) { s.streak.push([]); for (let k = 0; k < 6; k++) s.streak[i].push([Math.random() * W, BANDS[i] + 10 + Math.random() * (BANDS[i + 1] - BANDS[i] - 20)]); }
  gg.score = 0; say("Rise, then ride a YELLOW wind to the picnic", 6);
}
function say(m, t = 2.5) { s.msg = m; s.msgT = t; }
// Wind is constant across each band drawn on the gauge (BANDS), blending only
// within EDGE px of a band boundary so crossing layers isn't a hard jolt.
const EDGE = 10;
function windAt(y) {
  for (let i = 1; i < 5; i++) {
    const b = BANDS[i];
    if (y < b - EDGE) return s.ws[i - 1];
    if (y <= b + EDGE) { const u = (y - (b - EDGE)) / (2 * EDGE), e = u * u * (3 - 2 * u); return s.ws[i - 1] + (s.ws[i] - s.ws[i - 1]) * e; }
  }
  return s.ws[4];
}
function warm(d, why) { s.timer = Math.max(0, s.timer + d); if (d < 0) { s.flash = reduce ? 0.12 : 0.3; } if (why) say(why, 1.6); }
function update(gg, dt) {
  const inp = gg.input, p = inp.pointer, ph = p.down && p.y < H / 2, pv = p.down && p.y >= H / 2;
  let heat = inp.down("ArrowUp") || inp.down("KeyW") || ph, vent = inp.down("ArrowDown") || inp.down("KeyS") || pv;
  if (G0.test.botOn) { const b = bot(); heat = b > 0; vent = b < 0; }
  s.t += dt; s.msgT -= dt; s.flash = Math.max(0, s.flash - dt); s.hit = Math.max(0, s.hit - dt);
  for (let i = 0; i < 5; i++) s.ws[i] += (s.wt[i] - s.ws[i]) * dt * 0.6;
  const adx = Math.abs(s.target.x - s.x), over = adx < s.target.hw - 12 && !s.ground, tgt = heat && !vent ? 1 : vent && !heat ? -1 : over ? -0.45 : -0.12;
  s.b += clamp(tgt - s.b, -2.4 * dt, 2.2 * dt);
  s.vy += (-s.b * (s.b < 0 ? 110 : 85) - s.vy * 0.9 * 0 ) * dt; s.vy -= s.vy * 0.9 * dt * 1; // inertia + drag
  const sgn = Math.sign(s.target.x - s.x), calm = adx < 62 ? 0.04 : clamp(0.2 + (adx - 62) / 250, 0.2, 1), pull = adx < 170 ? sgn * 24 * Math.min(1, adx / 62) : 0, wnd = windAt(s.y) * calm + pull;
  s.vx += ((s.ground ? 0 : wnd) - s.vx) * dt * (s.ground ? 5 : adx < 300 ? 2.2 : 1.1);
  if (!s.ground && !s.started) s.started = true;
  s.x += s.vx * dt; s.y += s.vy * dt;
  if (s.y < TOP) { s.y = TOP; s.vy = Math.max(0, s.vy); }
  s.ground = false;
  for (const i of s.isl) if (Math.abs(s.x - i.x) < i.hw - 8 && s.y >= i.top && s.y < i.top + 55) {
    if (s.vy > 32) { s.y = i.top - 1; s.vy = -s.vy * 0.3 - 6; s.b = 0; warm(-5, "Bump! Land gently."); gg.sound("hit"); s.bump = 0.25; }
    else { s.y = i.top; s.vy = Math.min(s.vy, 0); s.ground = s.vy >= -1; }
    if (s.y === i.top && i === s.target) s.hold += dt; else s.hold = 0;
    s.cur = i; break;
  }
  if (!s.ground) s.hold = 0;
  if (s.y > 590) { s.y = 589; s.vy = -50; s.b = 0.5; warm(-4, "Splash! Mind the sea."); gg.sound("hit"); }
  if (s.hold > 0.7) deliver(gg);
  if (s.started && !s.won) { s.timer -= dt; if (s.timer <= 0) { gg.sound("lose"); gg.over("The lunch went cold!"); return; } }
  // birds
  if (gg.frame > 600 && gg.frame % Math.max(150, 330 - s.delivered * 14) === 0) { const d = G0.rng() < 0.5 ? 1 : -1; s.birds.push({ x: s.x - d * 260, y: 130 + G0.rng() * 330, v: d * (40 + G0.rng() * 40), hit: false }); }
  for (const b of s.birds) {
    b.x += b.v * dt;
    if (!b.hit && Math.hypot(b.x - s.x, b.y - (s.y - 50)) < 26) { b.hit = true; b.v *= 1.8; b.y -= 1; s.vy += 25; warm(-3, "Bird! Warmth lost."); gg.sound("hit"); }
  }
  s.birds = s.birds.filter((b) => Math.abs(b.x - s.x) < 320);
  for (let i = 0; i < 5; i++) for (const k of s.streak[i]) { k[0] += (s.ws[i] - s.vx) * dt * 1.4; if (k[0] < -40) k[0] += W + 80; if (k[0] > W + 40) k[0] -= W + 80; }
  s.bump = Math.max(0, s.bump - dt);
}
function deliver(gg) {
  const gent = Math.round(clamp(40 - Math.abs(s.lastVy || 0), 0, 40)), left = Math.ceil(s.timer);
  const pts = 100 + s.delivered * 20 + left * 4; gg.score += pts; s.delivered++; s.hold = 0;
  gg.sound("score"); say(`Delivered! +${pts}`, 3);
  if (s.delivered >= GOAL) { s.won = true; gg.score += 500; gg.sound("win"); gg.over("Picnic party! All lunches delivered, +500"); return; }
  s.kitchen = s.target; s.timer += 7; newLeg();
}
function bot() {
  const dx = s.target.x - s.x, dir = Math.sign(dx), ad = Math.abs(dx);
  let best = 0, bs = -1;
  let top = 0; for (let i = 0; i < 4; i++) top = Math.max(top, s.ws[i] * dir);
  let bd = -1e9; for (let i = 0; i < 4; i++) { const v = s.ws[i] * dir - 0.2 * Math.abs(CEN[i] - s.y) + (i === s.bi ? 8 : 0); if (v > bd) { bd = v; best = i; } } s.bi = best;
  if (dir !== s.ldir) s.latch = false; s.ldir = dir; if (ad < 46 + Math.max(0, s.vx * dir) * (Math.max(0, s.target.top - s.y) / 40) * 0.5) s.latch = true;
  if (s.ground && s.cur !== s.target) { s.latch = false; return 1; }
  if (s.latch && ad > 70) s.latch = false;
  const near = s.latch;
  let want = near ? s.target.top + 4 : CEN[best]; s.dbg = [want, near, best];
  if (!near) { let bu = 0, bc = 1e9; for (const a of [0, 1, -1]) { let y = s.y, v = s.vy, b = s.b, c = 0; for (let k = 0; k < 240; k++) { const tg = k < 45 ? (a ? a : -0.12) : -0.12; b += clamp(tg - b, -0.04, 0.037); v += (-b * (b < 0 ? 110 : 85) - v * 0.9) / 60; y += v / 60; if (k > 100) c += Math.abs(y - want) + Math.abs(v) * 0.6; } c += a ? 15 : 0; if (c < bc) { bc = c; bu = a; } } return bu; }
  const e = want - s.y, cap = near ? (e > 200 ? 75 : e > 70 ? 45 : 22) : 80, tvy = clamp(e * 0.6, -cap, cap), pv = s.vy - s.b * 60;
  return pv > tvy + 6 ? 1 : pv < tvy - 6 ? -1 : 0;
}
// ---------- drawing
function cloud(c, x, y, k, a) { c.fillStyle = `rgba(255,255,255,${a})`; c.beginPath(); c.ellipse(x, y, 34 * k, 11 * k, 0, 0, 7); c.ellipse(x - 16 * k, y + 2, 20 * k, 9 * k, 0, 0, 7); c.ellipse(x + 18 * k, y + 3, 22 * k, 8 * k, 0, 0, 7); c.fill(); }
function island(c, i, sx) {
  const hw = i.hw, t = i.top;
  c.fillStyle = "#8a5a32"; c.beginPath(); c.moveTo(sx - hw, t); c.lineTo(sx + hw, t); c.quadraticCurveTo(sx + hw * 0.5, t + 40, sx, t + 62); c.quadraticCurveTo(sx - hw * 0.5, t + 40, sx - hw, t); c.fill();
  c.fillStyle = C.green; c.beginPath(); c.roundRect(sx - hw - 4, t - 8, hw * 2 + 8, 14, 7); c.fill();
  c.fillStyle = "#2f8f3a"; c.beginPath(); c.roundRect(sx - hw, t - 2, hw * 2, 6, 3); c.fill();
  const tree = (x, h) => { c.fillStyle = "#6b4423"; c.fillRect(x - 2, t - 8 - h * 0.4, 4, h * 0.4); c.fillStyle = "#2f8f3a"; c.beginPath(); c.arc(x, t - 8 - h * 0.6, h * 0.35, 0, 7); c.fill(); };
  if (i.kind === "kitchen") {
    c.fillStyle = C.white; c.fillRect(sx - 52, t - 38, 36, 30); c.fillStyle = C.red; c.beginPath(); c.moveTo(sx - 56, t - 38); c.lineTo(sx - 34, t - 56); c.lineTo(sx - 12, t - 38); c.fill();
    c.fillStyle = C.yellow; c.fillRect(sx - 42, t - 28, 10, 10); c.fillStyle = C.dark; c.fillRect(sx - 24, t - 54, 6, 14);
    c.fillStyle = "rgba(255,255,255,.8)"; c.beginPath(); c.arc(sx - 20, t - 62 - ((s.t * 8) % 10), 4, 0, 7); c.fill(); tree(sx + 48, 36);
  } else if (i.kind === "picnic") {
    c.fillStyle = C.red; c.fillRect(sx - 22, t - 6, 44, 6); c.fillStyle = C.white; for (let k = 0; k < 5; k++) c.fillRect(sx - 22 + k * 9, t - 6, 4.5, 6);
    [[-34, C.yellow], [34, C.blue], [-48, C.green]].forEach(([dx, col], k) => { const bob = Math.sin(s.t * 3 + k) * 2; c.fillStyle = col; c.fillRect(sx + dx - 4, t - 22 + bob, 8, 14); c.fillStyle = "#f2c9a0"; c.beginPath(); c.arc(sx + dx, t - 27 + bob, 5, 0, 7); c.fill(); });
    c.strokeStyle = C.dark; c.lineWidth = 2; c.beginPath(); c.moveTo(sx + 50, t - 6); c.lineTo(sx + 50, t - 44); c.stroke(); c.fillStyle = C.yellow; c.beginPath(); c.moveTo(sx + 50, t - 44); c.lineTo(sx + 72 + Math.sin(s.t * 4) * 2, t - 38); c.lineTo(sx + 50, t - 32); c.fill();
  } else { tree(sx - hw * 0.4, 30); tree(sx + hw * 0.45, 22); }
}
function balloon(c, x, y, b, big) {
  const k = big || 1; c.save(); c.translate(x, y); c.scale(k, k);
  const sw = s ? Math.sin(s.t * 2) * 1.5 : 0;
  c.strokeStyle = C.dark; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-10, -18); c.lineTo(-18, -44); c.moveTo(10, -18); c.lineTo(18, -44); c.stroke();
  c.fillStyle = C.red; c.beginPath(); c.moveTo(0, -100); c.bezierCurveTo(28, -100, 36, -80, 30, -62); c.bezierCurveTo(25, -50, 14, -44, 10, -42); c.lineTo(-10, -42); c.bezierCurveTo(-14, -44, -25, -50, -30, -62); c.bezierCurveTo(-36, -80, -28, -100, 0, -100); c.fill();
  c.fillStyle = C.white; c.beginPath(); c.moveTo(0, -100); c.bezierCurveTo(12, -100, 15, -78, 12, -62); c.bezierCurveTo(10, -50, 8, -46, 6, -42); c.lineTo(-6, -42); c.bezierCurveTo(-8, -46, -10, -50, -12, -62); c.bezierCurveTo(-15, -78, -12, -100, 0, -100); c.fill();
  c.fillStyle = C.dark; c.fillRect(-8, -44, 16, 3);
  if (b > 0.15) { c.fillStyle = C.yellow; c.beginPath(); c.moveTo(-4, -41); c.quadraticCurveTo(0, -41 - 14 * b - Math.random() * 3, 4, -41); c.fill(); }
  c.fillStyle = C.yellow; c.strokeStyle = C.dark; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-12 + sw, -20, 24, 18, 3); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(-12 + sw, -12); c.lineTo(12 + sw, -12); c.stroke();
  c.restore();
}
function bird(c, x, y, v) { const f = Math.sin(s.t * 12 + x) * 5; c.strokeStyle = C.dark; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 10, y - f); c.quadraticCurveTo(x - 4, y - 4, x, y); c.quadraticCurveTo(x + 4, y - 4, x + 10, y - f); c.stroke(); }
// Logical y where the top-right score may start: below the engine's mute/pause
// buttons when they overlap the canvas (short, wide-ish phone windows).
let hudTop = 8;
function measureBar() {
  const bar = document.querySelector('button[aria-label$="sound"]')?.parentElement, cv = document.querySelector("canvas");
  if (!bar || !cv) return;
  const b = bar.getBoundingClientRect(), r = cv.getBoundingClientRect();
  hudTop = b.bottom > r.top && b.left < r.right ? Math.max(8, ((b.bottom - r.top) * W) / r.width + 6) : 8;
}
addEventListener("resize", () => requestAnimationFrame(measureBar));
requestAnimationFrame(measureBar);
function txt(c, t, x, y, size, col = C.white, al = "left") { c.font = `700 ${size}px system-ui,sans-serif`; c.textAlign = al; c.fillStyle = col; c.fillText(t, x, y); }
function draw(gg, c) {
  const fs = Math.max(12, 12 / gg.scale) , cam = s.x - BX;
  c.fillStyle = C.blue; c.fillRect(0, 0, W, H); c.fillStyle = "rgba(255,255,255,.12)"; c.fillRect(0, 380, W, 260); c.fillStyle = "rgba(255,255,255,.1)"; c.fillRect(0, 500, W, 140);
  for (let i = 0; i < 6; i++) cloud(c, ((i * 190 + 60 - cam * 0.25) % 1140 + 1140) % 1140 - 100, 70 + (i * 97) % 380, 1 + (i % 3) * 0.3, 0.8);
  const sea = c.createLinearGradient(0, 590, 0, H); sea.addColorStop(0, "#0a9ccc"); sea.addColorStop(1, "#08709a"); c.fillStyle = sea; c.fillRect(0, 590, W, 50);
  c.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 8; i++) c.fillRect(((i * 61 - cam * 0.8) % 400 + 400) % 400 - 20, 600 + (i % 3) * 12, 24, 2);
  for (let i = 0; i < 5; i++) { const sp = s.ws[i]; c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 2; c.lineCap = "round"; for (const k of s.streak[i]) { const L = Math.abs(sp) * 0.5 + 8; c.beginPath(); c.moveTo(k[0], k[1]); c.lineTo(k[0] + Math.sign(sp || 1) * L, k[1]); c.stroke(); } c.lineCap = "butt"; }
  for (const i of s.isl) { const sx = i.x - cam; if (sx > -120 && sx < W + 120) island(c, i, sx); }
  for (const b of s.birds) bird(c, b.x - cam, b.y, b.v);
  const ox = reduce ? 0 : (s.bump ? (Math.random() - 0.5) * 4 : 0);
  balloon(c, BX + ox, s.y, s.b);
  // target pointer
  const tx = s.target.x - cam, d = Math.round(Math.abs(s.target.x - s.x) / 10);
  if (tx < 30 || tx > W - 30) { const r = tx > W / 2, ax = r ? W - 14 : 14; c.fillStyle = C.yellow; c.beginPath(); c.moveTo(ax + (r ? 8 : -8), 520); c.lineTo(ax - (r ? 8 : -8), 508); c.lineTo(ax - (r ? 8 : -8), 532); c.fill(); c.fillStyle = "rgba(45,45,45,.6)"; c.beginPath(); c.roundRect(r ? W - 58 : 48, 538, 52, 18, 5); c.fill(); txt(c, d + " m", r ? W - 10 : 54, r ? 551 : 551, fs, C.yellow, r ? "right" : "left"); }
  else { c.fillStyle = C.yellow; c.beginPath(); c.moveTo(tx, s.target.top - 70); c.lineTo(tx - 7, s.target.top - 82); c.lineTo(tx + 7, s.target.top - 82); c.fill(); }
  // wind gauge
  c.fillStyle = "rgba(45,45,45,.38)"; c.beginPath(); c.roundRect(4, TOP - 6, 40, 506, 8); c.fill();
  const tdir = Math.sign(s.target.x - s.x);
  for (let i = 0; i < 5; i++) { const sp = s.ws[i], my = (BANDS[i] + BANDS[i + 1]) / 2, n = sp ? clamp(Math.round(Math.abs(sp) / 40), 1, 3) : 0, dir = Math.sign(sp); if (i) { c.fillStyle = "rgba(255,255,255,.4)"; c.fillRect(8, BANDS[i], 32, 1); }
    c.fillStyle = dir === tdir && Math.abs(sp) > 20 ? C.yellow : "rgba(255,255,255,.75)";
    for (let k = 0; k < n; k++) { const cx = 24 + dir * (k - (n - 1) / 2) * 9; c.beginPath(); c.moveTo(cx + dir * 6, my); c.lineTo(cx - dir * 4, my - 8); c.lineTo(cx - dir * 4, my + 8); c.fill(); }
    if (!n) c.fillRect(20, my - 2, 8, 4); }
  c.fillStyle = C.red; c.strokeStyle = C.white; c.lineWidth = 2; c.beginPath(); c.arc(24, s.y - 40, 5, 0, 7); c.fill(); c.stroke();
  // HUD
  const pct = s.timer / s.legT; c.fillStyle = "rgba(45,45,45,.55)"; c.beginPath(); c.roundRect(8, 8, 190, 22, 6); c.fill();
  c.fillStyle = pct > 0.5 ? C.green : pct > 0.25 ? C.yellow : C.red; c.beginPath(); c.roundRect(10, 10, Math.max(4, 186 * clamp(pct, 0, 1)), 18, 5); c.fill();
  txt(c, `Warmth ${Math.ceil(s.timer)}s`, 16, 24, fs, pct > 0.25 && pct <= 0.5 ? C.dark : pct > 0.5 ? C.dark : C.white);
  c.fillStyle = "rgba(45,45,45,.6)"; c.beginPath(); c.roundRect(4, 36, 122, 36, 8); c.fill();
  txt(c, `Lunch ${Math.min(s.delivered + 1, GOAL)}/${GOAL}`, 8, 50, fs);
  txt(c, `Picnic ${d} m ${s.target.x > s.x ? "→" : "←"}`, 8, 66, fs, C.yellow);
  const big = Math.round(fs * 1.35), label = `Score ${gg.score}`;
  c.font = `700 ${big}px system-ui,sans-serif`; const sw = c.measureText(label).width + 16;
  c.fillStyle = "rgba(45,45,45,.6)"; c.beginPath(); c.roundRect(W - 4 - sw, hudTop, sw, big + 10, 8); c.fill();
  txt(c, label, W - 12, hudTop + big + 1, big, C.white, "right");
  if (s.flash > 0) { c.fillStyle = `rgba(255,60,40,${s.flash * (reduce ? 0.3 : 0.5)})`; c.fillRect(0, 0, W, H); }
  if (s.msgT > 0 && gg.phase !== "title") { const w = c.measureText(s.msg).width; c.font = `700 ${fs}px system-ui,sans-serif`; const mw = c.measureText(s.msg).width + 20; c.fillStyle = "rgba(45,45,45,.75)"; c.beginPath(); c.roundRect(W / 2 - mw / 2 + 20, 112, mw, 26, 8); c.fill(); txt(c, s.msg, W / 2 + 20, 130, fs, C.white, "center"); }
  if (gg.phase === "playing" && gg.frame < 900 || (gg.phase === "playing" && "ontouchstart" in window)) { txt(c, "▲ HOLD TO HEAT", W / 2 + 20, 200, fs, "rgba(255,255,255,.85)", "center"); txt(c, "▼ HOLD TO VENT", W / 2 + 20, 440, fs, "rgba(255,255,255,.85)", "center"); }
}
const g = createGame({ width: W, height: H, background: C.blue, init, update, draw, title: "Sky Picnic",
  help: ["↑ / hold upper half: heat (rise)", "↓ / hold lower half: vent (sink)", "Ride winds at different heights to the picnic", "Land gently before the lunch gets cold", "P: pause"] });
g.test.state = () => ({ x: Math.round(s.x), y: Math.round(s.y), vy: +s.vy.toFixed(1), vx: +s.vx.toFixed(1), timer: +s.timer.toFixed(1), delivered: s.delivered, ground: s.ground, tdx: Math.round(s.target.x - s.x), winds: s.ws.map(Math.round), dbg: s.dbg });
g.test.place = (dx, y, vy = 0) => { s.x = s.target.x - dx; s.y = y; s.vy = vy; s.vx = 0; s.b = 0; s.ground = false; };
g.test.calm = () => { s.wt = [0, 0, 0, 0, 0]; s.ws = [0, 0, 0, 0, 0]; };
g.test.setTimer = (t) => { s.timer = t; };
g.test.sim = (sec) => { g.test.botOn = true; const n = sec * 60, log = []; for (let k = 0; k < n && g.phase === "playing"; k++) { const d0 = s.delivered; update(g, 1 / 60); if (s.delivered > d0) log.push([d0 + 1, +(k / 60).toFixed(0), Math.round(s.timer)]); } g.test.botOn = false; return { log, delivered: s.delivered, phase: g.phase, timer: +s.timer.toFixed(1), x: Math.round(s.x), y: Math.round(s.y), tdx: Math.round(s.target.x - s.x) }; };
