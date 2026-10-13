import { createGame } from "../shared/engine.js";

const W = 360, H = 640, PR = 6, SPEED = 175, GM = 250000, HOME_Y = 410;
const COLS = ["#0ab9e6", "#45b649", "#d4d4d4", "#ff3c28"];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let S, g;
const TAU = Math.PI * 2;
const rnd = (a, b) => a + g.rng() * (b - a);

function addPlanet() {
  const i = S.planets.length, prev = S.planets[i - 1];
  const r = Math.max(13, 27 - i * 0.4) + (i ? rnd(-2, 3) : 3);
  const x = i ? Math.max(62, Math.min(W - 62, prev.x0 + rnd(-120, 120))) : W / 2;
  const y = i ? prev.y - rnd(100, 135) : 0;
  const p = { i, x, x0: x, y, r, col: COLS[i % 4 === 3 && i % 8 ? 2 : (i * 7 + (i >> 2)) % 4],
    w: (Math.min(3.4, 1.9 + i * 0.03) + rnd(0, 0.25)) * (i % 2 ? 1 : -1),
    amp: i >= 10 ? Math.min(55, 20 + (i - 10) * 3) * (g.rng() < 0.6 ? 1 : 0) : 0, f: rnd(0.5, 0.9), ph: rnd(0, TAU) };
  S.planets.push(p);
  if (i) {
    const mx = (p.x0 + prev.x0) / 2, my = (p.y + prev.y) / 2;
    if (i >= 5 && g.rng() < Math.min(0.65, 0.12 * (i - 4)))
      S.hazards.push({ x0: Math.max(50, Math.min(W - 50, mx + rnd(-30, 30))), x: mx, y: my + rnd(-10, 10), amp: rnd(30, 60), f: rnd(0.8, 1.4), ph: rnd(0, TAU) });
    else if (g.rng() < 0.55) S.stars.push({ x: Math.max(30, Math.min(W - 30, mx + (g.rng() < 0.5 ? -1 : 1) * rnd(35, 60))), y: my + rnd(-15, 15), got: false });
  }
}
const pos = (p) => ({ x: p.x + Math.cos(S.ang) * S.rad, y: p.y + Math.sin(S.ang) * S.rad });

// Physics step shared by the game and the path preview. v = {x,y,vx,vy,t,from}
function step(v, planets) {
  const dt = 1 / 60;
  for (const p of planets) {
    if (p.i === v.from && v.t < 0.5) continue;
    const dx = p.x - v.x, dy = p.y - v.y, d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
    if (d > 170) continue;
    const a = (GM * (p.r / 20)) / (d2 + 600) / d;
    v.vx += dx * a * dt; v.vy += dy * a * dt;
  }
  const sp = Math.hypot(v.vx, v.vy);
  if (sp > SPEED * 1.35) { v.vx *= SPEED * 1.35 / sp; v.vy *= SPEED * 1.35 / sp; }
  v.x += v.vx * dt; v.y += v.vy * dt; v.t += dt;
  for (const p of planets) if (!(p.i === v.from && v.t < 0.3) && Math.hypot(p.x - v.x, p.y - v.y) < p.r + PR + 3 + Math.max(0, 4 - (S.best || 0) * 0.5)) return p;
  return null;
}
function launchState() {
  const p = S.planets[S.idx], q = pos(p), a = S.ang + (S.dir * Math.PI) / 2;
  return { x: q.x, y: q.y, vx: Math.cos(a) * SPEED, vy: Math.sin(a) * SPEED, t: 0, from: p.i };
}
function simulate(maxSteps) {
  const v = launchState(), path = [], mv = S.planets.filter((p) => p.amp), sx = mv.map((p) => p.x);
  const fin = (r) => { mv.forEach((p, k) => (p.x = sx[k])); return r; };
  for (let k = 0; k < maxSteps; k++) {
    const tt = S.t + v.t;
    for (const p of mv) p.x = p.x0 + p.amp * Math.sin(tt * p.f + p.ph);
    const hit = step(v, S.planets);
    if (k % 4 === 0) path.push([v.x, v.y]);
    if (hit) return fin({ path, land: hit.i });
    for (const h of S.hazards) if (Math.hypot(h.x0 + h.amp * Math.sin(tt * h.f + h.ph) - v.x, h.y - v.y) < 15) return fin({ path, land: -1 });
    if (v.y > S.cam + H + 30 || v.x < -40 || v.x > W + 40 || v.y < S.cam - 200 || v.t > 8) break;
  }
  return fin({ path, land: -1 });
}

function float(x, y, text, col) { S.floats.push({ x, y, text, col, t: 0 }); }
function loseLife() {
  if (S.best < 3) { S.combo = 0; S.flash = 0.6; g.sound("click"); S.mode = "orbit"; S.trail = []; S.grace = 40; float(S.planets[S.idx].x, S.planets[S.idx].y - 40, "Free retry", "#d4d4d4"); return; }
  S.lives--; S.combo = 0; S.flash = 1; if (!reduce) S.shake = 10;
  g.sound("hit");
  if (S.lives <= 0) { g.over("Lost in space"); return; }
  S.mode = "orbit"; S.trail = []; S.grace = 60;
}
function land(p) {
  const dx = S.v.x - p.x, dy = S.v.y - p.y;
  S.ang = Math.atan2(dy, dx);
  S.dir = Math.sign(dx * S.v.vy - dy * S.v.vx) || 1;
  S.rad = Math.hypot(dx, dy);
  S.mode = "orbit"; S.trail = [];
  if (p.i > S.best) {
    S.best = p.i; S.hops++;
    S.combo++;
    const bonus = (S.v.t < 1.6 ? 5 : 0) + Math.min(S.combo - 1, 5) * 2;
    if (S.combo >= 2) float(p.x, p.y - p.r - 30, "Combo x" + S.combo, "#0ab9e6");
    if (S.hops % 8 === 0 && S.lives < 3) { S.lives++; float(p.x, p.y - p.r - 28, "+1 life", "#ff3c28"); }
    g.score += 10 + bonus; g.sound("score");
    float(p.x, p.y - p.r - 10, "+" + (10 + bonus), "#ffd400");
  } else g.sound("click");
  S.idx = p.i;
  for (let k = 0; k < (reduce ? 4 : 12); k++) { const a = (k / 12) * TAU + rnd(0, 0.5), sp = rnd(40, 110); S.parts.push({ x: S.v.x, y: S.v.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, t: 0, c: p.col }); }
  S.ring = { x: p.x, y: p.y, r: p.r, t: 0 };
}

let ctxUpdate;
createGame({
  width: W, height: H, background: "#2d2d2d",
  title: "Orbit Hopper",
  help: ["Space / click / tap: launch off your orbit", "Land on the next planet. Gravity bends your path."],
  init(gm) {
    g = gm;
    S = { planets: [], hazards: [], stars: [], floats: [], parts: [], ring: null, combo: 0, trail: [], idx: 0, best: 0, hops: 0, ang: -Math.PI / 2, dir: 1, rad: 0, mode: "orbit",
      lives: 3, cam: -HOME_Y, t: 0, flash: 0, shake: 0, grace: 0, v: null, bg: Array.from({ length: 50 }, () => [rnd(0, W), rnd(0, 900), rnd(0.6, 1.6)]) };
    for (let k = 0; k < 8; k++) addPlanet();
    S.planets[0].r = 26; S.planets[0].col = COLS[0]; S.planets[0].w = 2; S.rad = 42;
    g.score = 0;
    g.test.state = () => ({ score: g.score, lives: S.lives, mode: S.mode, idx: S.idx, hops: S.hops, planets: S.planets.length });
    const robust = () => { const a0 = S.ang; let ok = true; for (const k of [0, 2, 5]) { S.ang = a0 + S.dir * Math.abs(S.planets[S.idx].w) * k / 60; if (simulate(360).land <= S.idx) ok = false; } S.ang = a0; return ok; };
    g.test.bench = (mode, n, maxF) => {
      const out = [];
      for (let k = 1; k <= n; k++) {
        g.reseed(k); g.start();
        let f = 0, since = 0;
        while (g.phase === "playing" && f < maxF) {
          if (S.mode === "orbit") { since++; if (mode === "bot" ? robust() : mode === "rand" ? g.rng() < 1 / 100 : false) S.fp = true; }
          if (S.fp) S.pred = simulate(500).land; const m0 = S.mode, i0 = S.idx, l0 = S.lives; g.frame += 1; ctxUpdate(g, 1 / 60); f++; if (m0 === "fly" && S.mode === "orbit") { const b = S.hops > 0 ? Math.min(S.idx, 12) : 0; (g.test.log = g.test.log || []).push([i0, S.idx, l0 - S.lives, S.pred, S.hops]); }
        }
        out.push([S.hops, g.score, f]);
      }
      g.reseed(1); g.start(); return out;
    };
    g.test.window = () => { const out = []; for (let i = 0; i < 7; i++) { S.idx = i; S.rad = S.planets[i].r + 16; let good = 0, N = 120, bad = 0; for (let k = 0; k < N; k++) { S.ang = (k / N) * TAU; S.dir = k % 1 ? 1 : 1; const l = simulate(500).land; if (l > i) good++; } out.push(good); } S.idx = 0; return out; };
    g.test.wouldHit = () => S.mode === "orbit" && simulate(360).land > S.idx;
  },
  update: (ctxUpdate = (gm, dt) => {
    S.t += dt;
    const cur = S.planets[S.idx];
    for (const p of S.planets) if (p.amp) p.x = p.x0 + p.amp * Math.sin(S.t * p.f + p.ph);
    for (const h of S.hazards) h.x = h.x0 + h.amp * Math.sin(S.t * h.f + h.ph);
    S.flash = Math.max(0, S.flash - dt * 2); S.shake = Math.max(0, S.shake - 0.5); if (S.grace) S.grace--;
    const press = S.fp || gm.input.pressed("Space") || gm.input.pointer.pressed; S.fp = false;
    if (S.mode === "orbit") {
      S.ang += Math.abs(cur.w) * S.dir * dt;
      if (Math.abs(S.rad - (cur.r + 16)) > 0.5) S.rad += ((cur.r + 16) - S.rad) * 0.15;
      if (press && gm.frame > 8) {
        S.v = launchState(); S.mode = "fly"; S.trail = []; gm.sound("jump");
      }
    } else {
      const v = S.v, hit = step(v, S.planets);
      S.trail.push([v.x, v.y]); if (S.trail.length > 16) S.trail.shift();
      if (hit) land(hit);
      else {
        for (const s of S.stars) if (!s.got && Math.hypot(s.x - v.x, s.y - v.y) < 16) { s.got = true; gm.score += 5; gm.sound({ freq: 880, dur: 0.08, type: "triangle", vol: 0.12 }); float(s.x, s.y - 8, "+5", "#ffd400"); }
        for (const h of S.hazards) if (Math.hypot(h.x - v.x, h.y - v.y) < 15) { loseLife(); return; }
        if (v.y > S.cam + H + 30 || v.x < -40 || v.x > W + 40 || v.y < S.cam - 200 || v.t > 8) loseLife();
      }
    }
    // Camera only climbs.
    const target = S.planets[S.idx].y - HOME_Y;
    if (target < S.cam) S.cam += (target - S.cam) * 0.08;
    while (S.planets[S.planets.length - 1].y > S.cam - 300) addPlanet();
    S.hazards = S.hazards.filter((h) => h.y < S.cam + H + 80);
    S.stars = S.stars.filter((s) => !s.got && s.y < S.cam + H + 60);
    for (const q of S.parts) { q.t += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.94; q.vy *= 0.94; } S.parts = S.parts.filter((q) => q.t < 0.5);
    if (S.ring && (S.ring.t += dt) > 0.4) S.ring = null;
    for (const f of S.floats) f.t += dt; S.floats = S.floats.filter((f) => f.t < 0.9);
  }),
  draw(gm, ctx) {
    const fs = (px) => `700 ${Math.max(px, 12 / gm.scale)}px system-ui,sans-serif`;
    if (!S) return;
    ctx.save();
    if (S.shake && gm.canShake) ctx.translate(rnd(-1, 1) * S.shake * 0.4, rnd(-1, 1) * S.shake * 0.4);
    ctx.fillStyle = "#fff";
    for (const [x, y, s] of S.bg) {
      const sy = ((y - S.cam * 0.2 * s) % 700 + 700) % 700 - 30;
      ctx.globalAlpha = 0.25 + 0.2 * s / 1.6; ctx.fillRect(x, sy, s, s);
    }
    ctx.globalAlpha = 1;
    const cy = S.cam;
    // preview path
    const cur = S.planets[S.idx];
    if (gm.phase === "playing" && S.mode === "orbit") {
      const sim = simulate(S.hops < 3 ? 220 : S.hops < 6 ? 120 : 45), hint = S.hops < 6;
      ctx.strokeStyle = hint && sim.land > S.idx ? "#45b649" : "#fff"; ctx.globalAlpha = hint ? 0.5 : 0.3; ctx.lineWidth = 2; ctx.setLineDash([3, 6]);
      ctx.beginPath(); sim.path.forEach(([x, y], k) => (k ? ctx.lineTo(x, y - cy) : ctx.moveTo(x, y - cy))); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    for (const p of S.planets) {
      const y = p.y - cy; if (y < -80 || y > H + 80) continue;
      if (p.i === S.idx) { ctx.strokeStyle = "#d4d4d4"; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.5; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.arc(p.x, y, p.r + 16, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
      else if (p.i === S.idx + 1) { ctx.strokeStyle = "#ffd400"; ctx.globalAlpha = 0.35 + (reduce ? 0 : 0.2 * Math.sin(S.t * 4)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, y, p.r + 8, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
      ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, TAU); ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(p.x - p.r, y - p.r * 0.3, p.r * 2, p.r * 0.28);
      ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.beginPath(); ctx.arc(p.x + p.r * 0.45, y + p.r * 0.35, p.r, 0, TAU); ctx.fill(); ctx.restore();
    }
    for (const s of S.stars) {
      const y = s.y - cy; ctx.fillStyle = "#ffd400"; ctx.beginPath();
      for (let k = 0; k < 8; k++) { const r = k % 2 ? 3.5 : 9, a = (k * Math.PI) / 4 + (reduce ? 0 : S.t); ctx.lineTo(s.x + Math.cos(a) * r, y + Math.sin(a) * r); }
      ctx.fill();
    }
    for (const h of S.hazards) {
      const y = h.y - cy; ctx.fillStyle = "#ff3c28"; ctx.beginPath();
      for (let k = 0; k < 16; k++) { const r = k % 2 ? 8 : 14, a = (k * Math.PI) / 8 + S.t * 1.5; ctx.lineTo(h.x + Math.cos(a) * r, y + Math.sin(a) * r); }
      ctx.fill(); ctx.fillStyle = "#2d2d2d"; ctx.beginPath(); ctx.arc(h.x, y, 6, 0, TAU); ctx.fill();
    }
    // player
    let px, py;
    if (S.mode === "orbit") { const q = pos(cur); px = q.x; py = q.y; }
    else { px = S.v.x; py = S.v.y; }
    S.trail.forEach(([x, y], k) => { ctx.globalAlpha = (k / S.trail.length) * 0.6; ctx.fillStyle = "#ffd400"; ctx.beginPath(); ctx.arc(x, y - cy, 1 + (k / S.trail.length) * 4, 0, TAU); ctx.fill(); });
    ctx.globalAlpha = S.grace && S.grace % 10 < 5 ? 0.4 : 1;
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px, py - cy, PR, 0, TAU); ctx.fill();
    ctx.fillStyle = "#ffd400"; ctx.beginPath(); ctx.arc(px, py - cy, 2.5, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    for (const q of S.parts) { ctx.globalAlpha = 1 - q.t / 0.5; ctx.fillStyle = q.c; ctx.fillRect(q.x - 1.5, q.y - cy - 1.5, 3, 3); }
    if (S.ring && !reduce) { ctx.globalAlpha = 0.7 * (1 - S.ring.t / 0.4); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(S.ring.x, S.ring.y - cy, S.ring.r + 4 + S.ring.t * 70, 0, TAU); ctx.stroke(); }
    for (const f of S.floats) { ctx.globalAlpha = 1 - f.t / 0.9; ctx.fillStyle = f.col; ctx.font = fs(14); ctx.textAlign = "center"; ctx.fillText(f.text, f.x, f.y - cy - f.t * 30); }
    ctx.globalAlpha = 1;
    ctx.restore();
    if (S.flash && !reduce) { ctx.fillStyle = `rgba(255,60,40,${S.flash * 0.25})`; ctx.fillRect(0, 0, W, H); }
    // HUD
    ctx.fillStyle = "rgba(45,45,45,.82)"; ctx.beginPath(); ctx.roundRect(4, 8, 96, 76, 10); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = fs(22); ctx.fillText(String(gm.score), 14, 34);
    ctx.fillStyle = "#b4b4b4"; ctx.font = fs(12); ctx.fillText("BEST " + Math.max(gm.best, gm.score), 14, 54);
    for (let k = 0; k < 3; k++) { ctx.fillStyle = k < S.lives ? "#ff3c28" : "#555"; ctx.beginPath(); ctx.arc(20 + k * 20, 72, 6, 0, TAU); ctx.fill(); }
    if (S.combo >= 2) { ctx.textAlign = "left"; ctx.fillStyle = "#0ab9e6"; ctx.font = fs(14); ctx.fillText("x" + S.combo, 66, 34); }
    if (gm.phase === "playing" && S.mode === "orbit" && S.hops < 3) {
      ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.font = fs(15);
      ctx.fillText("Tap or Space to launch", W / 2, H - 40);
      ctx.fillStyle = "#b4b4b4"; ctx.font = fs(12); ctx.fillText("Green path = you will land", W / 2, H - 20);
    }
  },
});
