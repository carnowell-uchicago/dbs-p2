import { createGame } from "../shared/engine.js";
const WIDE = innerWidth > innerHeight * 1.15, W = WIDE ? 640 : 360, H = WIDE ? 360 : 640, C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surf: "#3c3c3c", white: "#fff", gray: "#d4d4d4" };
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const LAPS = 3, ROAD = 92, HALF = ROAD / 2, MAXV = 300, OFFV = 120, LIMIT = 200;
// Closed track: Catmull-Rom through hand-placed control points (two hairpins).
const CP = [[0,600],[450,610],[900,600],[1250,580],[1450,500],[1470,360],[1330,280],[1000,300],[750,340],[560,260],[560,100],[700,-40],[950,-120],[1250,-110],[1390,-200],[1250,-330],[900,-330],[500,-300],[200,-210],[-100,-150],[-210,0],[-250,200],[-160,400],[-90,560]];
const SX = [], SY = [], SA = [];
for (let i = 0; i < CP.length; i++) {
  const p = (k) => CP[(i + k + CP.length) % CP.length];
  for (let s = 0; s < 14; s++) {
    const t = s / 14, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    SX.push(f(p(-1)[0], p(0)[0], p(1)[0], p(2)[0])); SY.push(f(p(-1)[1], p(0)[1], p(1)[1], p(2)[1]));
  }
}
const N = SX.length;
for (let i = 0; i < N; i++) { const j = (i + 1) % N; SA.push(Math.atan2(SY[j] - SY[i], SX[j] - SX[i])); }
const path = new Path2D(); SX.forEach((x, i) => (i ? path.lineTo(x, SY[i]) : path.moveTo(x, SY[i]))); path.closePath();
const near = (x, y, from) => { let bi = from, bd = 1e12; for (let k = -16; k <= 16; k++) { const i = (from + k + N) % N, d = (SX[i] - x) ** 2 + (SY[i] - y) ** 2; if (d < bd) { bd = d; bi = i; } } return [bi, Math.sqrt(bd)]; };
const fmt = (f) => { const s = f / 60; return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60).toFixed(2); };

let ghost = null, bestLap = 1e9; // session memory only
let car, lap, prog, last, lapF, rt, rec, parts, touch, latch, flash, msgT, msg, shake, boost;
const g = createGame({
  width: W, height: H, background: C.dark, title: "Gridline Racer",
  help: ["Arrows/WASD: steer, gas, brake", "Hold Shift to drift; release after ~0.7 s for a boost", "Touch: tap sides to steer + DRIFT"],
  init(g) {
    car = { x: SX[0] - 30, y: SY[0], a: SA[0], vx: 0, vy: 0, off: false, drift: false, dt: 0 };
    lap = 0; prog = -2; last = N - 2; lapF = 0; rt = 0; rec = []; parts = []; touch = false; latch = false; flash = 0; msgT = 0; msg = ""; shake = 0; boost = 0;
    car.x = SX[N - 2]; car.y = SY[N - 2]; car.a = SA[N - 2];
    g.score = 0;
  },
  update(g, dt) {
    const k = g.input, c = car;
    const key = (...a) => a.some((x) => k.down(x));
    if (key("ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS")) touch = false;
    const p = k.pointer, bx = W - 46, by = H - 56;
    const inBtn = (p.x - bx) ** 2 + (p.y - by) ** 2 < 44 * 44;
    if (p.pressed && inBtn) latch = !latch;
    let steer = (key("ArrowRight", "KeyD") ? 1 : 0) - (key("ArrowLeft", "KeyA") ? 1 : 0);
    if (p.down && !inBtn) { touch = true; steer = p.x < W / 2 ? -1 : 1; }
    const go = rt >= 120; // 2 s countdown, then lights out
    if (!go && g.frame % 40 === 0) g.sound({ freq: 440, dur: 0.08, type: "square", vol: 0.1 });
    if (g.frame === 120) g.sound({ freq: 880, dur: 0.25, type: "square", vol: 0.12 });
    rt++;
    const gas = go && (key("ArrowUp", "KeyW") || touch), brake = go && key("ArrowDown", "KeyS");
    const drift = go && (key("ShiftLeft", "ShiftRight") || latch) && Math.hypot(c.vx, c.vy) > 110;
    const hx = Math.cos(c.a), hy = Math.sin(c.a);
    let fwd = c.vx * hx + c.vy * hy, lx = c.vx - fwd * hx, ly = c.vy - fwd * hy;
    const sp = Math.hypot(c.vx, c.vy), sf = Math.min(1, sp / MAXV);
    if (go) {
      const turn = steer * (2.7 - 1.1 * sf) * Math.min(1, sp / 80) * (drift ? 1.5 : 1) * (fwd < 0 ? -1 : 1);
      c.a += turn * dt;
    }
    const mx = (c.off ? OFFV : MAXV) * (boost > 0 ? 1.18 : 1);
    if (gas) fwd += (boost > 0 ? 420 : 250) * dt; else fwd *= Math.exp(-0.7 * dt);
    if (brake) fwd -= 460 * dt;
    if (fwd > mx) fwd -= (fwd - mx) * Math.min(1, (c.off ? 3.5 : 1.5) * dt * 2);
    if (c.off && fwd > 40) fwd *= Math.exp(-0.5 * dt);
    if (fwd < -90) fwd = -90;
    if (drift) fwd *= Math.exp(-0.18 * dt);
    const grip = drift ? 2.6 : 9;
    lx *= Math.exp(-grip * dt); ly *= Math.exp(-grip * dt);
    const nhx = Math.cos(c.a), nhy = Math.sin(c.a);
    c.vx = nhx * fwd + lx; c.vy = nhy * fwd + ly;
    c.x += c.vx * dt; c.y += c.vy * dt;
    if (drift) { c.dt += dt; if (parts.length < 60 && g.frame % 2 === 0) parts.push({ x: c.x - nhx * 10, y: c.y - nhy * 10, l: 0.5 }); }
    else { if (c.drift && c.dt > 0.7) { boost = 0.9; flash = 0.2; g.sound({ freq: 520, dur: 0.15, type: "triangle", vol: 0.1, slide: 300 }); msg = "BOOST"; msgT = 0.8; } c.dt = 0; }
    c.drift = drift; boost = Math.max(0, boost - dt);
    for (const q of parts) q.l -= dt; parts = parts.filter((q) => q.l > 0);
    const [i, d] = near(c.x, c.y, last);
    const was = c.off; c.off = d > HALF;
    if (c.off && !was && sp > 100) { shake = 0.25; g.sound({ freq: 110, dur: 0.12, type: "sawtooth", vol: 0.1 }); }
    if (c.off && g.frame % 12 === 0 && sp > 60) g.sound({ freq: 90, dur: 0.05, type: "square", vol: 0.04 });
    if (d > 330) { c.x = SX[i]; c.y = SY[i]; c.a = SA[i]; c.vx = c.vy = 0; msg = "BACK ON TRACK"; msgT = 1; }
    let dl = i - last; if (dl > N / 2) dl -= N; if (dl < -N / 2) dl += N;
    prog += dl; last = i;
    if (go) { lapF++; rec.push(c.x, c.y, c.a); }
    if (msgT > 0) msgT -= dt; flash = Math.max(0, flash - dt); shake = Math.max(0, shake - dt);
    if (prog >= N * (lap + 1) - 0 && go) {
      lap++;
      const lt = lapF; let note = "LAP " + lap + "  " + fmt(lt);
      if (lt < bestLap) { bestLap = lt; ghost = rec; note += "  BEST"; }
      msg = note; msgT = 2.2; flash = 0.25; g.sound("score"); lapF = 0; rec = [];
      if (lap >= LAPS) {
        const T = (rt - 120) / 60; g.score = Math.max(0, Math.round((150 - T) * 20));
        g.sound("win"); g.over("Race " + fmt(rt - 120) + " · best lap " + fmt(bestLap)); return;
      }
    }
    if ((rt - 120) / 60 > LIMIT) { g.score = 0; g.over("Out of time"); }
  },
  draw(g, x) {
    const c = car || { x: SX[0], y: SY[0], a: 0, vx: 0, vy: 0 };
    const sp = Math.hypot(c.vx, c.vy);
    const cx = c.x + c.vx * 0.35, cy = c.y + c.vy * 0.35;
    const sh = !calm && g.canShake && (shake > 0 || (c.off && sp > 60)) ? (Math.random() - 0.5) * (shake > 0 ? 6 : 2) : 0;
    x.fillStyle = "#222"; x.fillRect(0, 0, W, H);
    x.save(); x.translate(W / 2 - cx + sh, H * (WIDE ? 0.52 : 0.58) - cy + sh);
    // grid ground
    x.strokeStyle = "#313a40"; x.lineWidth = 1; x.beginPath();
    const gx0 = Math.floor((cx - W) / 80) * 80, gy0 = Math.floor((cy - H) / 80) * 80;
    for (let gx = gx0; gx < cx + W; gx += 80) { x.moveTo(gx, cy - H); x.lineTo(gx, cy + H); }
    for (let gy = gy0; gy < cy + H; gy += 80) { x.moveTo(cx - W, gy); x.lineTo(cx + W, gy); }
    x.stroke();
    x.lineJoin = "round"; x.lineCap = "round";
    x.strokeStyle = C.blue; x.lineWidth = ROAD + 8; x.stroke(path);
    x.strokeStyle = "#383838"; x.lineWidth = ROAD; x.stroke(path);
    x.strokeStyle = "rgba(255,212,0,.55)"; x.lineWidth = 2; x.setLineDash([16, 18]); x.stroke(path); x.setLineDash([]);
    // start line
    x.save(); x.translate(SX[0], SY[0]); x.rotate(SA[0]);
    for (let r = 0; r < 8; r++) for (let q = 0; q < 2; q++) { x.fillStyle = (r + q) % 2 ? C.dark : C.white; x.fillRect(q * 7 - 7, -HALF + r * (ROAD / 8), 7, ROAD / 8); }
    x.restore();
    for (const q of parts) { x.fillStyle = `rgba(212,212,212,${q.l})`; x.beginPath(); x.arc(q.x, q.y, 6 * (1.4 - q.l), 0, 7); x.fill(); }
    if (ghost && lap < LAPS) { const gi = Math.min(lapF, ghost.length / 3 - 1) * 3; if (gi >= 0 && ghost.length) { x.globalAlpha = 0.5; carShape(x, ghost[gi], ghost[gi + 1], ghost[gi + 2], C.blue, false); x.globalAlpha = 1; } }
    carShape(x, c.x, c.y, c.a, C.red, boost > 0);
    x.restore();
    // HUD
    x.textBaseline = "alphabetic"; x.fillStyle = "rgba(45,45,45,.75)"; x.fillRect(0, 0, 170, 62);
    x.fillStyle = C.white; x.font = "bold 16px system-ui,sans-serif"; x.textAlign = "left";
    x.fillText("LAP " + Math.min(lap + 1, LAPS) + "/" + LAPS, 10, 22);
    x.font = "14px system-ui,sans-serif"; x.fillText(fmt(lapF), 10, 42);
    x.fillStyle = C.gray; x.fillText(bestLap < 1e9 ? "BEST " + fmt(bestLap) : "no ghost yet", 10, 58);
    x.fillStyle = C.gray; x.font = "12px system-ui,sans-serif"; x.textAlign = "left"; x.fillText("SPEED", 10, H - 26); x.fillStyle = C.surf; x.fillRect(10, H - 20, 110, 8); x.fillStyle = car && car.off ? C.yellow : C.green; x.fillRect(10, H - 20, 110 * Math.min(1, sp / 340), 8);
    // minimap
    x.save(); x.translate(10, 70); x.fillStyle = "rgba(45,45,45,.7)"; x.fillRect(-4, -4, 94, 56);
    x.translate(4 + 250 * 0.05, 4 + 330 * 0.05); x.scale(0.05, 0.05); x.lineJoin = "round";
    x.strokeStyle = C.gray; x.lineWidth = 44; x.stroke(path);
    x.fillStyle = C.red; x.beginPath(); x.arc(c.x, c.y, 90, 0, 7); x.fill();
    if (ghost) { const gi = Math.min(lapF, ghost.length / 3 - 1) * 3; if (gi >= 0 && ghost.length) { x.fillStyle = C.blue; x.beginPath(); x.arc(ghost[gi], ghost[gi + 1], 70, 0, 7); x.fill(); } }
    x.restore(); x.textAlign = "left";
    // drift button
    const bx = W - 46, by = H - 56, on = latch || (car && car.drift);
    x.beginPath(); x.arc(bx, by, 36, 0, 7); x.fillStyle = on ? C.yellow : "rgba(255,255,255,.14)"; x.fill();
    x.strokeStyle = C.white; x.lineWidth = 2; x.stroke();
    if (car && car.drift) { const ch = Math.min(1, car.dt / 0.7); x.strokeStyle = ch >= 1 ? C.green : C.yellow; x.lineWidth = 6; x.beginPath(); x.arc(bx, by, 41, -Math.PI / 2, -Math.PI / 2 + ch * 6.283); x.stroke(); if (ch >= 1) { x.fillStyle = C.green; x.font = "bold 13px system-ui,sans-serif"; x.textAlign = "center"; x.fillText("RELEASE!", bx - 6, by - 52); } }
    x.fillStyle = on ? C.dark : C.white; x.font = "bold 13px system-ui,sans-serif"; x.textAlign = "center"; x.fillText("DRIFT", bx, by + 5);
    if (g.phase === "playing" || g.phase === "paused") {
      if (rt < 120 && car) { const n = 3 - Math.floor(rt / 40); x.fillStyle = C.white; x.font = "bold 72px system-ui,sans-serif"; x.fillText(String(n), W / 2, H * 0.4); }
      else if (rt < 170) { x.fillStyle = C.green; x.font = "bold 56px system-ui,sans-serif"; x.fillText("GO!", W / 2, H * 0.4); }
      if (rt < 400 && !(car && car.off)) { x.fillStyle = "rgba(255,255,255,.55)"; x.font = "13px system-ui,sans-serif"; x.fillText("Tap or hold Shift to drift through hairpins", W / 2, H - (WIDE ? 24 : 100)); }
      if (msgT > 0) { x.fillStyle = C.yellow; x.font = "bold 20px system-ui,sans-serif"; x.fillText(msg, W / 2, WIDE ? 40 : 130); }
      if (car && car.off && rt > 120) { x.fillStyle = C.yellow; x.font = "bold 14px system-ui,sans-serif"; x.fillText("OFF TRACK", W / 2, WIDE ? 62 : 110); }
      if (flash > 0 && !calm) { x.fillStyle = `rgba(255,255,255,${flash})`; x.fillRect(0, 0, W, H); }
    }
  },
});
function carShape(x, px, py, a, col, boosted) {
  x.save(); x.translate(px, py); x.rotate(a);
  if (boosted) { x.fillStyle = C.yellow; x.beginPath(); x.moveTo(-13, -5); x.lineTo(-26, 0); x.lineTo(-13, 5); x.fill(); }
  x.fillStyle = C.dark; x.fillRect(-9, -11, 6, 4); x.fillRect(-9, 7, 6, 4); x.fillRect(6, -11, 6, 4); x.fillRect(6, 7, 6, 4);
  x.fillStyle = col; x.beginPath(); x.roundRect(-13, -8, 28, 16, 4); x.fill();
  x.fillStyle = C.white; x.fillRect(1, -5, 6, 10);
  x.restore();
}
g.test.keepSeed = true;
g.test.state = () => ({ lap, prog, speed: Math.round(Math.hypot(car.vx, car.vy)), x: car.x, y: car.y, a: car.a, off: car.off, drift: car.drift, rt, ghost: !!ghost, bestLap, N, W, H, shake });
g.test.at = (idx, off = 0, v = 150) => { const i = (idx + N) % N, a = SA[i]; car.x = SX[i] - Math.sin(a) * off; car.y = SY[i] + Math.cos(a) * off; car.a = a; car.vx = Math.cos(a) * v; car.vy = Math.sin(a) * v; last = i; };
g.test.nearEnd = () => { prog = N * (lap + 1) - 6; g.test.at(N - 6, 0, 150); };
