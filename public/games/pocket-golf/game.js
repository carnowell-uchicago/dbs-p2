import { createGame } from "../shared/engine.js";
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surf: "#3c3c3c", white: "#fff", gray: "#d4d4d4" };
const W = 360, H = 640, L = 20, R = 340, T = 80, B = 560, CAP = 8, BR = 5, CR = 10;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
// Holes: p par, t tee, c cup, w walls [x,y,w,h], s sand, a water, b bumpers [x,y,r], m windmills [x,y,len,omega], l slopes [x,y,w,h,ax,ay]
const HOLES = [
 { p: 2, t: [180, 520], c: [180, 130] },
 { p: 3, t: [100, 520], c: [260, 130], w: [[20, 320, 200, 16]] },
 { p: 2, t: [180, 520], c: [180, 130], s: [[20, 300, 320, 50]] },
 { p: 3, t: [180, 520], c: [180, 130], a: [[110, 270, 140, 110]] },
 { p: 3, t: [180, 520], c: [180, 125], b: [[120, 300, 18], [240, 300, 18], [180, 220, 18]] },
 { p: 3, t: [180, 520], c: [180, 120], m: [[180, 320, 75, 1.6]] },
 { p: 3, t: [180, 520], c: [180, 130], l: [[20, 230, 320, 170, 100, 0]] },
 { p: 4, t: [60, 520], c: [300, 130], w: [[20, 330, 220, 16], [120, 200, 220, 16]] },
 { p: 3, t: [180, 520], c: [180, 120], w: [[20, 250, 130, 200], [210, 250, 130, 200]], b: [[180, 190, 14]] },
 { p: 3, t: [180, 520], c: [180, 120], a: [[20, 210, 110, 50], [230, 210, 110, 50]], s: [[130, 210, 100, 50]] },
 { p: 3, t: [180, 520], c: [180, 115], b: [[120, 400, 16], [240, 400, 16], [180, 320, 16], [120, 240, 16], [240, 240, 16]], w: [[150, 150, 60, 14]] },
 { p: 3, t: [180, 520], c: [180, 115], m: [[110, 340, 50, 1.8], [250, 230, 50, -2]] },
 { p: 3, t: [180, 520], c: [180, 115], a: [[20, 170, 130, 50], [210, 170, 130, 50]], l: [[20, 250, 320, 120, 0, 110]] },
 { p: 3, t: [180, 520], c: [180, 115], w: [[150, 200, 60, 260]], s: [[120, 90, 120, 60]] },
 { p: 4, t: [300, 525], c: [300, 130], w: [[20, 460, 200, 14], [140, 360, 200, 14], [20, 260, 200, 14]] },
 { p: 3, t: [180, 520], c: [180, 115], a: [[20, 260, 90, 200], [250, 260, 90, 200]], m: [[180, 360, 50, 1.7]] },
 { p: 3, t: [180, 520], c: [180, 115], b: [[100, 360, 16], [260, 360, 16], [180, 290, 16]], l: [[20, 150, 320, 80, 110, 0]], s: [[20, 430, 120, 60]] },
 { p: 4, t: [180, 525], c: [180, 110], w: [[20, 300, 110, 16], [230, 300, 110, 16]], m: [[180, 390, 55, 2]], a: [[20, 170, 100, 60], [240, 170, 100, 60]], s: [[130, 140, 100, 30]] },
];
const I = (a) => a || [];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let S; // state
function winAng(m, t) { return t * m[3]; }
// one physics substep; returns "water" | "sink" | null. b ball, t time (s)
function step(h, b, t, dt) {
  const ax0 = I(h.l).reduce((s, q) => (inR(b, q) ? s + q[4] : s), 0), ay0 = I(h.l).reduce((s, q) => (inR(b, q) ? s + q[5] : s), 0);
  b.vx += ax0 * dt; b.vy += ay0 * dt;
  b.x += b.vx * dt; b.y += b.vy * dt;
  const sand = I(h.s).some((q) => inR(b, q));
  const f = Math.pow(sand ? 0.962 : 0.9865, dt * 60);
  b.vx *= f; b.vy *= f;
  const sp = Math.hypot(b.vx, b.vy);
  if (sp > 0 && sp < 14 && !ax0 && !ay0) { b.vx = b.vy = 0; }
  if (b.x < L + BR) { b.x = L + BR; b.vx = Math.abs(b.vx) * 0.8; }
  if (b.x > R - BR) { b.x = R - BR; b.vx = -Math.abs(b.vx) * 0.8; }
  if (b.y < T + BR) { b.y = T + BR; b.vy = Math.abs(b.vy) * 0.8; }
  if (b.y > B - BR) { b.y = B - BR; b.vy = -Math.abs(b.vy) * 0.8; }
  for (const w of I(h.w)) {
    const cx = clamp(b.x, w[0], w[0] + w[2]), cy = clamp(b.y, w[1], w[1] + w[3]);
    let dx = b.x - cx, dy = b.y - cy, d = Math.hypot(dx, dy);
    if (d < BR) {
      if (d < 0.001) { dx = b.x - (w[0] + w[2] / 2); dy = b.y - (w[1] + w[3] / 2); d = Math.hypot(dx, dy) || 1; }
      bounce(b, dx / d, dy / d, BR - d + 0.01, 0.82, 0, 0);
    }
  }
  for (const q of I(h.b)) {
    const dx = b.x - q[0], dy = b.y - q[1], d = Math.hypot(dx, dy);
    if (d < q[2] + BR) { bounce(b, dx / d, dy / d, q[2] + BR - d, 1.25, 0, 0); b.hit = 1; }
  }
  for (const m of I(h.m)) {
    const a = winAng(m, t), ux = Math.cos(a), uy = Math.sin(a);
    const k = clamp((b.x - m[0]) * ux + (b.y - m[1]) * uy, -m[2], m[2]);
    const px = m[0] + ux * k, py = m[1] + uy * k;
    let dx = b.x - px, dy = b.y - py, d = Math.hypot(dx, dy);
    if (d < BR + 3) {
      if (d < 0.001) { dx = -uy; dy = ux; d = 1; }
      bounce(b, dx / d, dy / d, BR + 3 - d, 0.9, -(py - m[1]) * m[3], (px - m[0]) * m[3]);
    }
  }
  for (const q of I(h.a)) if (inR(b, q)) return "water";
  const dx = h.c[0] - b.x, dy = h.c[1] - b.y, d = Math.hypot(dx, dy), v = Math.hypot(b.vx, b.vy);
  if (d < CR && v < 260) return "sink";
  if (d < CR + 8 && v < 140) { b.vx += dx * 3 * dt * 20; b.vy += dy * 3 * dt * 20; }
  return null;
}
function bounce(b, nx, ny, push, e, sx, sy) {
  b.x += nx * push; b.y += ny * push;
  const rv = (b.vx - sx) * nx + (b.vy - sy) * ny;
  if (rv < 0) { b.vx -= (1 + e) * rv * nx; b.vy -= (1 + e) * rv * ny; b.bump = 1; }
}
function inR(b, q) { return b.x > q[0] && b.x < q[0] + q[2] && b.y > q[1] && b.y < q[1] + q[3]; }
const SUB = 4, VMAX = 520;
function simulate(h, x, y, ang, pow, t0) {
  const b = { x, y, vx: Math.cos(ang) * pow * VMAX, vy: Math.sin(ang) * pow * VMAX };
  let best = 1e9;
  for (let i = 0; i < 60 * 14 * SUB; i++) {
    const t = t0 + i / (60 * SUB), r = step(h, b, t, 1 / (60 * SUB));
    if (r === "sink") return { sunk: true, d: 0 };
    if (r === "water") return { sunk: false, d: 1e9 };
    best = Math.min(best, Math.hypot(b.x - h.c[0], b.y - h.c[1]));
    if (!b.vx && !b.vy && i > 20) break;
  }
  return { sunk: false, d: best, x: b.x, y: b.y };
}

function loadHole(g, i) {
  const h = HOLES[i]; S.h = i; S.hole = h;
  S.ball = { x: h.t[0], y: h.t[1], vx: 0, vy: 0 };
  S.last = [h.t[0], h.t[1]]; S.strokes = 0; S.mode = "aim"; S.t = 0; S.timer = 0; S.drag = null;
  S.ang = Math.atan2(h.c[1] - h.t[1], h.c[0] - h.t[0]); S.pow = 0.55; S.fx = []; S.msg = ""; S.trail = []; S.intro = 1.6;
}
function putt(g, ang, pow) {
  S.last = [S.ball.x, S.ball.y];
  S.ball.vx = Math.cos(ang) * pow * VMAX; S.ball.vy = Math.sin(ang) * pow * VMAX;
  S.strokes++; S.mode = "roll"; S.trail = []; S.ang = ang; S.pow = pow; S.drag = null; g.sound("hit");
}
function finish(g, picked) {
  const h = S.hole, n = S.strokes, d = n - h.p;
  S.results.push({ p: h.p, n });
  const pts = n === 1 ? 250 : Math.max(10, 100 - 50 * d);
  if (!picked) g.score += pts; else g.score += 10;
  S.msg = picked ? "Stroke limit!" : n === 1 ? "Hole in one!" : d <= -2 ? "Eagle!" : d === -1 ? "Birdie!" : d === 0 ? "Par" : d === 1 ? "Bogey" : d === 2 ? "Double bogey" : "+" + d;
  S.pts = picked ? 10 : pts; S.sub = picked ? `Ball picked up after ${CAP} strokes  +10` : "";
  if (!picked && (n === 1 || d <= -1)) { const nn = reduce ? 10 : 40; for (let i = 0; i < nn; i++) { const a = g.rng() * 6.283, v = 60 + g.rng() * 160; S.fx.push({ x: h.c[0], y: h.c[1], vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: 0.8 + g.rng() * 0.8, c: [C.red, C.yellow, C.blue, C.white][i % 4] }); } S.cel = reduce ? 0 : 1; } S.mode = "result"; S.timer = 0;
  g.sound(!picked && d <= 0 ? "win" : "score");
}
function next(g) {
  if (S.h >= 17) { S.mode = "card"; S.timer = 0; return; }
  loadHole(g, S.h + 1);
}
function aimOf(g) {
  const p = g.input.pointer;
  if (S.drag) { const dx = S.drag[0] - p.x, dy = S.drag[1] - p.y, l = Math.hypot(dx, dy); return { ang: Math.atan2(dy, dx), pow: clamp(l / 130, 0, 1), l }; }
  return { ang: S.ang, pow: S.pow, l: 99 };
}
const g = createGame({
  width: W, height: H, background: C.dark, title: "Pocket Golf",
  help: ["Drag back from anywhere, release to putt", "Keys: arrows aim and power, Space putts"],
  init(g) { S = { results: [], t: 0 }; g.score = 0; loadHole(g, 0); },
  update(g, dt) {
    const k = (c) => g.input.down(c), pr = (c) => g.input.pressed(c), p = g.input.pointer;
    S.timer += dt; S.t += dt; if (S.intro > 0) S.intro -= dt;
    for (const f of S.fx) { f.life -= dt; f.x += f.vx * dt; f.y += f.vy * dt; }
    S.fx = S.fx.filter((f) => f.life > 0);
    if (S.mode === "aim") {
      if (k("ArrowLeft")) S.ang -= 1.4 * dt; if (k("ArrowRight")) S.ang += 1.4 * dt;
      if (k("ArrowUp")) S.pow = clamp(S.pow + 0.7 * dt, 0.05, 1); if (k("ArrowDown")) S.pow = clamp(S.pow - 0.7 * dt, 0.05, 1);
      if (p.pressed) S.drag = [p.x, p.y];
      if (S.drag && p.released) { const a = aimOf(g); if (a.l > 14) putt(g, a.ang, Math.max(a.pow, 0.06)); else S.drag = null; }
      else if (pr("Space") || pr("Enter")) putt(g, S.ang, S.pow);
    } else if (S.mode === "roll") {
      const b = S.ball; let r = null;
      for (let i = 0; i < SUB && !r; i++) r = step(S.hole, b, S.t, dt / SUB);
      if (S.trail.length > 40) S.trail.shift(); if (S.t % 0.03 < dt) S.trail.push([b.x, b.y]);
      if (b.bump) { b.bump = 0; g.sound({ freq: 300, dur: 0.04, type: "square", vol: 0.15 }); for (let i = 0; i < 3; i++) S.fx.push({ x: b.x, y: b.y, vx: (g.rng() - 0.5) * 60, vy: (g.rng() - 0.5) * 60, life: 0.3, c: C.white }); }
      if (r === "sink") { S.mode = "sink"; S.timer = 0; b.vx = b.vy = 0; b.x = S.hole.c[0]; b.y = S.hole.c[1]; }
      else if (r === "water") {
        g.sound("lose"); for (let i = 0; i < 10; i++) S.fx.push({ x: b.x, y: b.y, vx: (g.rng() - 0.5) * 120, vy: -g.rng() * 100, life: 0.5, c: C.blue });
        b.x = S.last[0]; b.y = S.last[1]; b.vx = b.vy = 0; S.strokes++; S.mode = "aim"; S.flash = "Splash! +1";S.flashT = 1.3;
        if (S.strokes >= CAP) finish(g, true);
      } else if (!b.vx && !b.vy) { S.mode = "aim"; S.flash = ""; if (S.strokes >= CAP) finish(g, true); else S.ang = Math.atan2(S.hole.c[1] - b.y, S.hole.c[0] - b.x); }
    } else if (S.mode === "sink") {
      if (S.timer === dt) g.sound("score");
      if (S.timer > 0.4) finish(g, false);
    } else if (S.mode === "result") {
      if (S.timer > 0.3 && (S.timer > 2 || p.pressed || pr("Space") || pr("Enter"))) next(g);
    } else if (S.mode === "card") {
      if (S.timer > 0.5 && (p.pressed || pr("Space") || pr("Enter"))) {
        const tot = S.results.reduce((s, r) => s + r.n, 0), par = S.results.reduce((s, r) => s + r.p, 0), d = tot - par;
        g.over(`Round done: ${tot} strokes (${d > 0 ? "+" : ""}${d})`);
      }
    }
    if (S.flashT > 0) S.flashT -= dt;
  },
  draw(g, x) {
    const fs = (n) => Math.max(n, 12.5 / g.scale);
    const txt = (s, X, Y, size, col, al) => { x.font = `700 ${fs(size)}px system-ui,sans-serif`; x.fillStyle = col; x.textAlign = al || "left"; x.textBaseline = "middle"; x.fillText(s, X, Y); };
    const h = S.hole, b = S.ball;
    x.fillStyle = C.dark; x.fillRect(0, 0, W, H);
    x.fillStyle = C.surf; x.fillRect(L - 6, T - 6, R - L + 12, B - T + 12);
    x.fillStyle = C.green; x.fillRect(L, T, R - L, B - T);
    x.fillStyle = "rgba(255,255,255,.07)"; for (let i = 0; i < 8; i += 2) x.fillRect(L, T + i * 60, R - L, 60);
    for (const q of I(h.s)) { x.fillStyle = "#e8cf6a"; x.fillRect(...q); x.fillStyle = "rgba(0,0,0,.12)"; for (let i = 0; i < 18; i++) x.fillRect(q[0] + ((i * 53) % q[2]), q[1] + ((i * 31) % q[3]), 2, 2); }
    for (const q of I(h.a)) { x.fillStyle = C.blue; x.fillRect(...q); x.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 4; i++) x.fillRect(q[0] + 8 + ((i * 41 + S.t * 14) % Math.max(10, q[2] - 30)), q[1] + 10 + ((i * 29) % Math.max(10, q[3] - 14)), 14, 2); }
    for (const q of I(h.l)) {
      x.fillStyle = "rgba(0,0,0,.14)"; x.fillRect(...q); x.strokeStyle = "rgba(255,255,255,.55)"; x.lineWidth = 2;
      const dir = Math.atan2(q[5], q[4]), ux = Math.cos(dir), uy = Math.sin(dir);
      for (let X = q[0] + 25; X < q[0] + q[2]; X += 50) for (let Y = q[1] + 25; Y < q[1] + q[3]; Y += 50) {
        x.beginPath(); x.moveTo(X - ux * 8 - uy * 7, Y - uy * 8 + ux * 7); x.lineTo(X + ux * 8, Y + uy * 8); x.lineTo(X - ux * 8 + uy * 7, Y - uy * 8 - ux * 7); x.stroke();
      }
    }
    x.fillStyle = C.dark; x.beginPath(); x.arc(h.t[0], h.t[1], 9, 0, 7); x.fill(); x.fillStyle = "rgba(255,255,255,.25)"; x.beginPath(); x.arc(h.t[0], h.t[1], 6, 0, 7); x.fill();
    x.fillStyle = "#1c1c1c"; x.beginPath(); x.arc(h.c[0], h.c[1], CR, 0, 7); x.fill();
    for (const w of I(h.w)) { x.fillStyle = C.dark; x.fillRect(w[0] - 2, w[1] - 2, w[2] + 4, w[3] + 4); x.fillStyle = C.gray; x.fillRect(...w); }
    for (const q of I(h.b)) { x.fillStyle = C.dark; x.beginPath(); x.arc(q[0], q[1], q[2] + 2, 0, 7); x.fill(); x.fillStyle = C.red; x.beginPath(); x.arc(q[0], q[1], q[2], 0, 7); x.fill(); x.fillStyle = C.yellow; x.beginPath(); x.arc(q[0], q[1], q[2] * 0.4, 0, 7); x.fill(); }
    for (const m of I(h.m)) {
      const a = winAng(m, S.t), ux = Math.cos(a) * m[2], uy = Math.sin(a) * m[2];
      x.lineCap = "round"; x.strokeStyle = C.dark; x.lineWidth = 10; x.beginPath(); x.moveTo(m[0] - ux, m[1] - uy); x.lineTo(m[0] + ux, m[1] + uy); x.stroke();
      x.strokeStyle = C.white; x.lineWidth = 6; x.stroke(); x.lineCap = "butt";
      x.fillStyle = C.red; x.beginPath(); x.arc(m[0], m[1], 8, 0, 7); x.fill();
    }
    if (S.mode === "roll") for (let i = 0; i < S.trail.length; i++) { x.fillStyle = "rgba(255,255,255," + (0.05 + 0.3 * i / S.trail.length) + ")"; x.beginPath(); x.arc(S.trail[i][0], S.trail[i][1], 1.5 + 2.5 * i / S.trail.length, 0, 7); x.fill(); }
    // flag
    x.fillStyle = C.white; x.fillRect(h.c[0] - 1, h.c[1] - 40, 2, 40); x.fillStyle = C.red; x.beginPath(); x.moveTo(h.c[0] + 1, h.c[1] - 40); x.lineTo(h.c[0] + 20, h.c[1] - 33); x.lineTo(h.c[0] + 1, h.c[1] - 26); x.fill();
    // aim
    if (S.mode === "aim" && g.phase === "playing") {
      const a = aimOf(g), len = 30 + a.pow * 130, ux = Math.cos(a.ang), uy = Math.sin(a.ang);
      x.fillStyle = C.white;
      for (let d = 12; d < len; d += 12) { x.beginPath(); x.arc(b.x + ux * d, b.y + uy * d, 2.2, 0, 7); x.fill(); }
      x.strokeStyle = a.pow > 0.8 ? C.red : C.yellow; x.lineWidth = 3; x.beginPath(); x.moveTo(b.x + ux * len, b.y + uy * len); x.lineTo(b.x + ux * (len - 9) - uy * 6, b.y + uy * (len - 9) + ux * 6); x.moveTo(b.x + ux * len, b.y + uy * len); x.lineTo(b.x + ux * (len - 9) + uy * 6, b.y + uy * (len - 9) - ux * 6); x.stroke();
      if (S.drag) { const p = g.input.pointer; x.strokeStyle = "rgba(255,255,255,.5)"; x.lineWidth = 2; x.beginPath(); x.moveTo(S.drag[0], S.drag[1]); x.lineTo(p.x, p.y); x.stroke(); x.fillStyle = "rgba(255,255,255,.5)"; x.beginPath(); x.arc(S.drag[0], S.drag[1], 6, 0, 7); x.fill(); }
    }
    if (S.mode !== "sink" && S.mode !== "result") {
      x.fillStyle = "rgba(0,0,0,.3)"; x.beginPath(); x.arc(b.x + 1.5, b.y + 2, BR, 0, 7); x.fill();
      x.fillStyle = C.white; x.beginPath(); x.arc(b.x, b.y, BR, 0, 7); x.fill();
    }
    for (const f of S.fx) { x.fillStyle = f.c; x.globalAlpha = clamp(f.life * 3, 0, 1); x.fillRect(f.x - 2, f.y - 2, 4, 4); x.globalAlpha = 1; }
    // HUD
    const diff = S.results.reduce((s, r) => s + r.n - r.p, 0);
    txt(`Hole ${S.h + 1}/18`, 12, 20, 16, C.white); txt(`Par ${h.p}`, 12, 42, 14, C.gray);
    txt(`Strokes ${S.strokes}`, 12, 62, 14, C.yellow); if (S.h) txt(`Total ${diff > 0 ? "+" : ""}${diff}`, 120, 62, 14, C.gray);
    txt(`Score ${g.score}`, 120, 42, 14, C.white);
    // power meter
    const a = S.mode === "aim" ? aimOf(g) : { pow: S.pow };
    x.fillStyle = C.surf; x.fillRect(60, 586, 240, 16); x.fillStyle = a.pow > 0.8 ? C.red : C.yellow; x.fillRect(60, 586, 240 * a.pow, 16);
    txt("Power", 180, 614, 12, C.gray, "center");
    if (S.flashT > 0) txt(S.flash, 180, 330, 22, C.white, "center");
    if (S.h === 0 && S.mode === "aim" && !S.strokes && g.phase === "playing") txt("Drag back from anywhere, release to putt", 180, 575, 12, C.white, "center");
    if (S.intro > 0 && S.mode === "aim" && g.phase === "playing") { x.globalAlpha = clamp(S.intro * 2, 0, 1); x.fillStyle = "rgba(45,45,45,.85)"; x.fillRect(80, 290, 200, 70); txt(`Hole ${S.h + 1}`, 180, 315, 26, C.white, "center"); txt(`Par ${h.p}`, 180, 345, 16, C.yellow, "center"); x.globalAlpha = 1; }
    if (S.mode === "result") {
      x.fillStyle = "rgba(45,45,45,.96)"; x.fillRect(40, 240, 280, 130);
      txt(S.msg, 180, 285, 28, C.yellow, "center"); txt(S.sub || `${S.strokes} stroke${S.strokes > 1 ? "s" : ""} on par ${h.p}  +${S.pts}`, 180, 325, S.sub ? 13 : 15, C.white, "center"); txt("Tap to continue", 180, 352, 12, C.gray, "center");
    }
    if (S.mode === "card") {
      x.fillStyle = C.dark; x.fillRect(0, 0, W, H);
      txt("Scorecard", 180, 80, 26, C.yellow, "center");
      S.results.forEach((r, i) => {
        const col = i < 9 ? 0 : 1, row = i % 9, X = 30 + col * 170, Y = 130 + row * 44, d = r.n - r.p;
        x.fillStyle = C.surf; x.fillRect(X, Y - 18, 150, 38);
        x.fillStyle = r.n === 1 || d < 0 ? C.green : d === 0 ? C.gray : d === 1 ? C.yellow : C.red; x.fillRect(X, Y - 18, 6, 38);
        txt(`${i + 1}`, X + 16, Y, 15, C.white); txt(`Par ${r.p}`, X + 44, Y, 13, C.gray); txt(`${r.n}`, X + 135, Y, 17, C.white, "right");
      });
      const tot = S.results.reduce((s, r) => s + r.n, 0), par = S.results.reduce((s, r) => s + r.p, 0), d = tot - par;
      txt(`${tot} strokes · ${d > 0 ? "+" : ""}${d} vs par ${par}`, 180, 550, 18, C.white, "center"); txt(`Score ${g.score}`, 180, 580, 16, C.yellow, "center");
      if (S.timer > 0.5) txt("Tap to finish", 180, 612, 12, C.gray, "center");
    }
  },
});
g.keepSeed = true;
g.test.state = () => ({ hole: S.h + 1, par: S.hole.p, strokes: S.strokes, mode: S.mode, ball: [Math.round(S.ball.x), Math.round(S.ball.y)], cup: S.hole.c, tee: S.hole.t, results: S.results.length, score: g.score });
// Brute-force a putt that sinks (or gets closest) from the current spot.
g.test.plan = () => {
  const h = S.hole, b = S.ball; let best = { d: 1e9 };
  const base = Math.atan2(h.c[1] - b.y, h.c[0] - b.x);
  for (let da = -3; da <= 3; da += 0.04) for (let p = 0.1; p <= 1; p += 0.045) {
    const r = simulate(h, b.x, b.y, base + da, p, S.t);
    if (r.sunk) return { ang: base + da, pow: p, sunk: true };
    if (r.d < best.d) best = { ang: base + da, pow: p, d: r.d };
  }
  return best;
};
g.test.putt = (a, p) => putt(g, a, p);
g.test.skip = () => { S.strokes = 3; finish(g, false); };
g.test.finishAll = () => { while (S.results.length < 18) { S.strokes = S.hole.p; finish(g, false); S.h = Math.min(S.h + 1, 17); S.hole = HOLES[S.h]; } S.mode = "card"; S.timer = 1; };
// Per-hole solvability: share of tee shots (angle x power grid) that sink, at several windmill phases.
g.test.holes = () => HOLES.map((h, i) => { let n = 0, tot = 0, first = null;
  for (const t0 of [0, 0.7, 1.9]) for (let a = 0; a < 6.283; a += 0.03) for (let p = 0.1; p <= 1; p += 0.05) { tot++; if (simulate(h, h.t[0], h.t[1], a, p, t0).sunk) { n++; if (!first) first = [a, p]; } }
  return { hole: i + 1, par: h.p, sunk: n, tot, pct: +(100 * n / tot).toFixed(2) }; });
// Two-putt check for holes with no direct sink: any landing spot (t0 phase) from which a sink exists.
g.test.twoPutt = (i) => { const h = HOLES[i], seen = new Set(); let ok = 0, tries = 0;
  for (let a = 0; a < 6.283; a += 0.12) for (let p = 0.2; p <= 1; p += 0.2) { const r = simulate(h, h.t[0], h.t[1], a, p, 0); if (r.sunk || r.x === undefined) continue;
    const k = Math.round(r.x / 12) + "," + Math.round(r.y / 12); if (seen.has(k)) continue; seen.add(k); tries++;
    let f = false; for (let a2 = 0; a2 < 6.283 && !f; a2 += 0.06) for (let p2 = 0.1; p2 <= 1; p2 += 0.1) if (simulate(h, r.x, r.y, a2, p2, 1).sunk) { f = true; break; }
    if (f) ok++; }
  return { hole: i + 1, spots: tries, ok }; };
g.test.load = (i) => loadHole(g, i);
