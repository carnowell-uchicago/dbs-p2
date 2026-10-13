import { createGame } from "../shared/engine.js";
const W = 360, H = 640, X0 = 40, X1 = 320, PY = 470, SC = 1.3, D = 19000, BASE = 92, BOOSTV = 178;
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surf: "#3c3c3c", white: "#fff", gray: "#d4d4d4" };
const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const LANES = [0, 1, 2, 3, 4].map((i) => 75 + i * 52.5);
const BTN = { x: 306, y: 574, r: 40 };
const HCOL = [C.red, C.blue, C.white, C.surf];
const ord = (n) => ["", "1st", "2nd", "3rd", "4th", "5th"][n];
let P, hares, items, t, tog, steer, shake, pulse, fin, place, popups, lastPlace, gain, kick, flash, tpop, names;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sy = (d) => PY - (d - P.d) * SC;

function init(g) {
  g.reseed(g.test.seed || Math.floor(Math.random() * 1e9));
  const r = () => g.rng();
  P = { d: 0, x: LANES[2], spd: 0, boost: 60, spin: 0, ang: 0, boosting: false, inv: 0, vx: 0, flame: 0 };
  hares = [0, 1, 3, 4].map((l, i) => ({ d: -4 * i, x: LANES[l], tx: LANES[l], v: 0, base: 101 + r() * 9, surge: 1, st: 2, eat: 0, col: HCOL[i], fin: false, rt: 1, hop: r() * 6 }));
  items = [];
  for (let d = 650; d < D - 500;) {
    const k = r(), hard = d > 1500;
    const type = k < 0.3 ? "lettuce" : k < 0.52 ? "carrot" : !hard ? "lettuce" : k < 0.78 ? "rock" : "puddle";
    items.push({ type, d, x: X0 + 28 + r() * (X1 - X0 - 56), hit: false });
    d += Math.max(70, 190 - d / 140) * (0.6 + r() * 0.8);
  }
  t = 0; tog = false; steer = false; shake = 0; pulse = 0; fin = 0; place = 5; popups = []; lastPlace = 5; gain = 0; kick = 0; flash = 0; tpop = null; names = ["You", "Rusty", "Bluebell", "Snowy", "Smoky"];
  hares.forEach((h, i) => { h.nm = names[i + 1]; h.ft = 0; });
}

function rank() { let n = 1; for (const h of hares) if (h.d > P.d) n++; return n; }

function update(g, dt) {
  const I = g.input, ptr = I.pointer;
  if (g.frame < 150) { P.flame += dt; return; }
  if (!fin) t += dt;
  // controls
  const bt = botMove(), kb = I.down("ArrowUp") || I.down("KeyW") || (bt && bt.boost);
  if (ptr.pressed) {
    if (Math.hypot(ptr.x - BTN.x, ptr.y - BTN.y) < BTN.r + 8) { tog = !tog; steer = false; }
    else if (ptr.y > H * 0.35) steer = true;
  }
  if (!ptr.down) steer = false;
  const wasB = P.boosting;
  P.boosting = !fin && (kb || tog) && P.boost > 0 && P.spin <= 0;
  if (P.boost <= 0) tog = false;
  if (P.boosting && !wasB) g.sound({ freq: 220, dur: 0.18, type: "sawtooth", vol: 0.12, slide: 500 });
  P.boost = clamp(P.boost + (P.boosting ? -30 : 3.5) * dt, 0, 100);
  // steering
  let want = 0;
  if (!fin && P.spin <= 0) {
    if (I.down("ArrowLeft") || I.down("KeyA")) want -= 210;
    if (I.down("ArrowRight") || I.down("KeyD")) want += 210;
    if (bt) want = clamp((bt.x - P.x) * 8, -210, 210);
    if (steer && Math.abs(ptr.x - P.x) > 3) want = clamp((ptr.x - P.x) * 8, -280, 280);
  }
  P.vx += (want - P.vx) * Math.min(1, dt * 12);
  P.x = clamp(P.x + P.vx * dt, X0 + 16, X1 - 16);
  // items
  let tgt = P.boosting ? BOOSTV : BASE, inPud = false;
  P.inv = Math.max(0, P.inv - dt);
  for (const it of items) {
    if (it.hit) continue;
    const dx = Math.abs(it.x - P.x), dy = Math.abs(it.d - P.d) * SC;
    if (it.type === "puddle") {
      if (dx < 34 && dy < 16) { inPud = true; if (P.boosting && P.spin <= 0 && P.inv <= 0) spinOut(g); }
    } else if (dx < 22 && dy < 20) {
      if (it.type === "lettuce") { it.hit = true; P.boost = Math.min(100, P.boost + 24); g.score += 10; g.sound("score"); popups.push({ x: it.x, d: it.d, s: "+FUEL", t: 0 }); }
      else if (it.type === "carrot") { it.hit = true; g.score += 5; g.sound("click"); }
      else if (it.type === "rock" && P.inv <= 0) {
        it.hit = true; P.inv = 0.8;
        if (P.boosting) spinOut(g); else { P.spd *= 0.4; shake = 5; g.sound("hit"); }
      }
    }
  }
  if (inPud) tgt *= 0.6;
  if (P.spin > 0) { P.spin -= dt; P.ang += dt * 14; tgt = 30; if (P.spin <= 0) P.ang = 0; }
  P.spd += clamp(tgt - P.spd, -170 * dt, (P.boosting ? 200 : 110) * dt);
  P.d += P.spd * dt; P.flame += dt;
  shake = Math.max(0, shake - dt * 14);
  pulse = Math.max(0, pulse - dt * 3); flash = Math.max(0, flash - dt * 2.5);
  kick += ((P.boosting ? 1 : 0) - kick) * Math.min(1, dt * 5);
  // hares
  const ramp = Math.min(1, 0.82 + t / 45 * 0.18);
  for (const h of hares) {
    if (h.fin) { h.d += 60 * dt; continue; }
    h.st -= dt;
    if (h.st <= 0) {
      h.st = 2 + g.rng() * 3; h.surge = 0.94 + g.rng() * 0.14;
      let best = null;
      for (const it of items) if (!it.hit && it.type === "carrot" && it.d > h.d && it.d < h.d + 150 && g.rng() < 0.7) { best = it; break; }
      h.tx = best ? best.x : LANES[Math.floor(g.rng() * 5)] + (g.rng() - 0.5) * 24;
    }
    h.x += clamp(h.tx - h.x, -55 * dt, 55 * dt);
    if (h.eat > 0) { h.eat -= dt; h.v = 0; }
    else {
      const gap = h.d - P.d, band = gap > 260 ? 0.93 : gap < -220 ? 1.07 : 1;
      h.v = h.base * h.surge * ramp * band;
      for (const it of items) if (!it.hit && it.type === "carrot" && it.d > h.d - 4 && it.d < h.d + 10 && Math.abs(it.x - h.x) < 20) { it.hit = true; h.eat = 1.4; popups.push({ x: h.x, d: h.d, s: "nom!", t: 0, c: "#fff" }); g.sound({ freq: 520, dur: 0.05, type: "square", vol: 0.05 }); }
    }
    h.d += h.v * dt; h.hop += dt * 8;
    const dd = (h.d - P.d) * SC;
    if (Math.abs(dd) < 36 && Math.abs(h.x - P.x) < 26) { const s = h.x < P.x ? -1 : 1; h.x += s * 40 * dt; P.x = clamp(P.x - s * 40 * dt, X0 + 16, X1 - 16); }
    if (h.d >= D) { h.fin = true; h.ft = t; }
  }
  const rk = rank(); if (rk !== lastPlace) { if (rk < lastPlace) { g.sound("score"); tpop = { s: "Passed!", c: C.yellow, t: 0 }; } else if (!fin && t > 4) tpop = { s: "Passed by a hare", c: C.red, t: 0 }; pulse = 1; lastPlace = rk; }
  if (tpop) { tpop.t += dt; if (tpop.t > 1.1) tpop = null; }
  for (const p of popups) p.t += dt; popups = popups.filter((p) => p.t < 0.8);
  // finish
  if (!fin && P.d >= D) {
    fin = 0.01; P.ft = t; place = 1 + hares.filter((h) => h.fin).length;
    const bonus = [0, 1000, 700, 450, 250, 100][place], tb = Math.max(0, Math.round((210 - t) * 4));
    g.score += bonus + tb; gain = bonus + tb;
    g.sound(place <= 2 ? "win" : "lose");
  }
  if (fin) { fin += dt; if (fin > 3.6) g.over(`${ord(place)} place in ${fmt(t)}`); }
}
let botMode = 0;
function botMove() {
  if (!botMode || fin) return null;
  let tx = P.x, boost = false, danger = null, want = null;
  for (const it of items) {
    if (it.hit || it.d < P.d - 10 || it.d > P.d + 170) continue;
    const bad = it.type === "rock" || it.type === "puddle";
    if (botMode === 3 && bad && Math.abs(it.x - P.x) < 46 && !danger) danger = it;
    if (!bad && it.type === "lettuce" && !want && it.d < P.d + 130) want = it;
  }
  if (danger) tx = danger.x < P.x ? Math.min(X1 - 20, danger.x + 55) : Math.max(X0 + 20, danger.x - 55);
  else if (botMode === 3 && want) tx = want.x;
  if (botMode === 2) boost = P.boost >= 99 || (P.boosting && P.boost > 1);
  if (botMode === 3) {
    let ahead = false;
    for (const it of items) if (!it.hit && (it.type === "rock" || it.type === "puddle") && it.d > P.d && it.d < P.d + 90 && Math.abs(it.x - tx) < 40) ahead = true;
    boost = !ahead && !danger && P.boost > 3 && (P.boost > 30 || P.boosting);
  }
  return { boost, x: tx };
}
function spinOut(g) { P.spin = 1.1; P.inv = 1.2; tog = false; P.boost = Math.max(0, P.boost - 10); shake = 8; flash = 1; popups.push({ x: P.x, d: P.d + 30, s: "SPIN OUT!", t: 0, c: C.red }); g.sound("hit"); }
const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

function txt(c, s, x, y, size, col, al = "left", w = "700") { c.font = `${w} ${size}px ${FONT}`; c.fillStyle = col; c.textAlign = al; c.textBaseline = "middle"; c.fillText(s, x, y); }

function drawHare(c, h) {
  const y = sy(h.d), b = h.eat > 0 ? 0 : Math.sin(h.hop) * 1.5;
  if (y < -40 || y > H + 40) return;
  c.save(); c.translate(h.x, y + b);
  c.fillStyle = "rgba(0,0,0,.2)"; c.beginPath(); c.ellipse(2, 3, 12, 17, 0, 0, 7); c.fill();
  c.fillStyle = C.gray; c.strokeStyle = C.dark; c.lineWidth = 1.6;
  c.beginPath(); c.ellipse(-5, -22, 3, 9, -0.2, 0, 7); c.ellipse(5, -22, 3, 9, 0.2, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(0, 2, 11, 16, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = h.col; c.fillRect(-10, -2, 20, 9); c.strokeRect(-10, -2, 20, 9);
  c.fillStyle = C.gray; c.beginPath(); c.arc(0, -12, 7, 0, 7); c.fill(); c.stroke();
  c.fillStyle = C.dark; c.fillRect(-4, -14, 2, 2); c.fillRect(2, -14, 2, 2);
  c.fillStyle = C.white; c.beginPath(); c.arc(0, 18, 4, 0, 7); c.fill();
  if (h.eat > 0) { const m = Math.sin(h.eat * 30) * 2; c.fillStyle = "#ff8a1c"; c.beginPath(); c.moveTo(-5, -19 + m); c.lineTo(5, -19 + m); c.lineTo(0, -9); c.fill(); c.fillStyle = C.green; c.fillRect(-3, -24 + m, 6, 5); c.fillStyle = "#ffb35c"; for (let i = 0; i < 3; i++) c.fillRect(-12 + i * 12 + m * 2, -8 - ((h.eat * 20 + i * 5) % 10), 3, 3); }
  c.restore();
}
function drawTort(c, g) {
  const y = PY; c.save(); c.translate(P.x + (shake && g.canShake ? (Math.random() - 0.5) * shake * (reduce ? 0.2 : 0.7) : 0), y); c.rotate(P.ang + P.vx / 2000);
  if (P.boosting || (g.frame < 150 && g.input.down("ArrowUp"))) {
    const f = 30 + 14 * Math.abs(Math.sin(P.flame * 40)) * (reduce ? 0.3 : 1) + 8;
    c.fillStyle = C.red; c.beginPath(); c.moveTo(-8, 22); c.lineTo(0, 22 + f); c.lineTo(8, 22); c.fill();
    c.fillStyle = C.yellow; c.beginPath(); c.moveTo(-4, 22); c.lineTo(0, 22 + f * 0.6); c.lineTo(4, 22); c.fill();
  }
  c.fillStyle = "rgba(0,0,0,.2)"; c.beginPath(); c.ellipse(3, 4, 20, 25, 0, 0, 7); c.fill();
  c.fillStyle = "#2f8f3a"; c.strokeStyle = C.dark; c.lineWidth = 2;
  for (const [lx, ly] of [[-19, -12], [19, -12], [-18, 14], [18, 14]]) { c.beginPath(); c.ellipse(lx, ly, 7, 5, 0, 0, 7); c.fill(); c.stroke(); }
  c.fillStyle = C.green; c.beginPath(); c.arc(0, -28, 8, 0, 7); c.fill(); c.stroke();
  c.fillStyle = C.dark; c.fillRect(-4, -31, 2.5, 2.5); c.fillRect(2, -31, 2.5, 2.5);
  c.beginPath(); c.ellipse(0, 0, 18, 24, 0, 0, 7); c.fillStyle = C.green; c.fill(); c.stroke();
  c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, -12); c.lineTo(9, -5); c.lineTo(9, 7); c.lineTo(0, 13); c.lineTo(-9, 7); c.lineTo(-9, -5); c.closePath(); c.stroke();
  c.fillStyle = C.gray; c.fillRect(-5, 4, 10, 16); c.strokeRect(-5, 4, 10, 16);
  c.fillStyle = C.red; c.fillRect(-5, 17, 10, 4);
  c.restore();
}
function drawItem(c, it) {
  const y = sy(it.d); if (y < -40 || y > H + 40 || it.hit) return;
  c.save(); c.translate(it.x, y);
  if (it.type === "rock") { c.fillStyle = "#8a8a8a"; c.strokeStyle = C.dark; c.lineWidth = 2; c.beginPath(); c.moveTo(-15, 8); c.lineTo(-11, -9); c.lineTo(2, -14); c.lineTo(14, -6); c.lineTo(15, 9); c.closePath(); c.fill(); c.stroke(); c.fillStyle = C.gray; c.fillRect(-6, -6, 8, 4); }
  else if (it.type === "puddle") { c.fillStyle = C.blue; c.strokeStyle = "#0788ad"; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 30, 14, 0, 0, 7); c.fill(); c.stroke(); c.strokeStyle = C.white; c.beginPath(); c.arc(-8, -2, 6, 3.4, 5); c.stroke(); }
  else if (it.type === "lettuce") { c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fill(); c.fillStyle = C.green; c.strokeStyle = C.dark; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 10, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(0, -8); c.lineTo(0, 8); c.stroke(); }
  else { c.fillStyle = "#ff8a1c"; c.strokeStyle = C.dark; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, -8); c.lineTo(6, -8); c.lineTo(0, 12); c.closePath(); c.fill(); c.stroke(); c.fillStyle = C.green; c.fillRect(-3, -14, 6, 6); }
  c.restore();
}

function draw(g, c) {
  c.fillStyle = "#37a23c"; c.fillRect(0, 0, W, H);
  const kz = reduce ? 0 : kick * 0.05;
  c.save(); c.translate(W / 2, PY); c.scale(1 + kz, 1 + kz); c.translate(-W / 2, -PY);
  const off = P.d * SC;
  // grass bushes
  for (let i = -2; i < 12; i++) {
    const k = Math.floor(P.d / 110) + i, y = PY - (k * 110 - P.d) * SC, s = (k * 7919) % 5;
    c.fillStyle = "#2f8f3a";
    c.beginPath(); c.arc(14 + s * 4, y, 11, 0, 7); c.arc(W - 14 - ((k * 31) % 4) * 4, y - 40, 12, 0, 7); c.fill();
  }
  c.fillStyle = C.yellow; c.fillRect(X0, 0, X1 - X0, H);
  for (let k = Math.floor(P.d / 30) - 3; k < Math.floor(P.d / 30) + 25; k++) {
    const y = PY - (k * 30 - P.d) * SC; c.fillStyle = k % 2 ? C.red : C.white;
    c.fillRect(X0 - 8, y - 20, 8, 39); c.fillRect(X1, y - 20, 8, 39);
  }
  c.fillStyle = "rgba(255,255,255,.85)";
  for (let l = 1; l < 5; l++) { const x = X0 + (l * (X1 - X0)) / 5; for (let k = Math.floor(P.d / 50) - 2; k < Math.floor(P.d / 50) + 14; k++) c.fillRect(x - 1.5, PY - (k * 50 - P.d) * SC - 20, 3, 28); }
  // start / finish
  for (const [d, n] of [[0, 0], [D, 1]]) {
    const y = sy(d); if (y < -30 || y > H + 30) continue;
    for (let i = 0; i < 14; i++) for (let j = 0; j < 2; j++) { c.fillStyle = (i + j) % 2 ? C.dark : C.white; c.fillRect(X0 + i * 20, y - 20 + j * 10, 20, 10); }
    if (n) txt(c, "FINISH", W / 2, y - 34, 14, C.dark, "center", "800");
  }
  items.forEach((it) => drawItem(c, it));
  popups.forEach((p) => txt(c, p.s, p.x, sy(p.d) - 16 - p.t * 30, 12, p.c || C.dark, "center", "800"));
  for (const h of hares) if (h.d <= P.d) drawHare(c, h);
  drawTort(c, g);
  for (const h of hares) if (h.d > P.d) drawHare(c, h);
  if (P.boosting && !reduce) { c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = 2; for (let i = 0; i < 10; i++) { const x = X0 + 10 + ((i * 53 + g.frame * 7) % (X1 - X0 - 20)), y = (g.frame * 26 + i * 107) % H; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 34); c.stroke(); } }
  c.restore();
  if (P.spin > 0) for (let i = 0; i < 3; i++) { const a = P.flame * 9 + i * 2.1; txt(c, "★", P.x + Math.cos(a) * 24, PY - 34 + Math.sin(a) * 8, 14, C.yellow, "center"); }
  if (flash > 0) { c.fillStyle = `rgba(255,60,40,${flash * (reduce ? 0.12 : 0.3)})`; c.fillRect(0, 0, W, H); }
  if (tpop) { const a = Math.min(1, (1.1 - tpop.t) * 3); c.globalAlpha = a; c.fillStyle = "rgba(45,45,45,.88)"; c.beginPath(); c.roundRect(W / 2 - 92, 88 - tpop.t * 14, 184, 36, 12); c.fill(); txt(c, tpop.s, W / 2, 112 - tpop.t * 14, 22 * (1 + Math.max(0, 0.3 - tpop.t)), tpop.c, "center", "800"); c.globalAlpha = 1; }
  // HUD
  const rk = rank(), pu = 1 + pulse * 0.25;
  c.fillStyle = "rgba(45,45,45,.9)"; c.beginPath(); c.roundRect(8, 8, 108, 44, 10); c.fill();
  c.save(); c.translate(18, 30); c.scale(pu, pu); txt(c, ord(rk), 0, 0, 26, rk === 1 ? C.yellow : C.white, "left", "800"); c.restore();
  txt(c, "of 5", 74, 32, 13, C.gray, "left", "600");
  c.fillStyle = "rgba(45,45,45,.9)"; c.beginPath(); c.roundRect(8, 58, 118, 22, 8); c.fill();
  txt(c, `${fmt(t)}  ·  ${g.score} pts`, 16, 69, 13, C.white, "left", "600");
  // progress strip
  c.fillStyle = "rgba(45,45,45,.9)"; c.beginPath(); c.roundRect(120, 14, 116, 24, 12); c.fill();
  c.fillStyle = C.gray; c.fillRect(130, 25, 96, 3);
  for (const h of hares) { c.fillStyle = h.col; c.beginPath(); c.arc(130 + 96 * clamp(h.d / D, 0, 1), 26.5, 4, 0, 7); c.fill(); }
  c.fillStyle = C.green; c.strokeStyle = C.white; c.lineWidth = 2; c.beginPath(); c.arc(130 + 96 * clamp(P.d / D, 0, 1), 26.5, 6, 0, 7); c.fill(); c.stroke();
  // boost button
  c.fillStyle = "rgba(45,45,45,.88)"; c.beginPath(); c.arc(BTN.x, BTN.y, BTN.r, 0, 7); c.fill();
  c.lineWidth = 7; c.strokeStyle = "#555"; c.beginPath(); c.arc(BTN.x, BTN.y, BTN.r - 4, 0, 7); c.stroke();
  c.strokeStyle = P.boost < 20 ? C.red : P.boosting ? C.yellow : C.blue; c.beginPath(); c.arc(BTN.x, BTN.y, BTN.r - 4, -Math.PI / 2, -Math.PI / 2 + (P.boost / 100) * Math.PI * 2); c.stroke();
  if (P.boost >= 99 && !P.boosting) { c.strokeStyle = `rgba(255,212,0,${reduce ? 0.8 : 0.4 + 0.4 * Math.sin(g.frame / 6)})`; c.lineWidth = 3; c.beginPath(); c.arc(BTN.x, BTN.y, BTN.r + 3, 0, 7); c.stroke(); }
  txt(c, "BOOST", BTN.x, BTN.y - 2, 13, P.boosting ? C.yellow : C.white, "center", "800");
  txt(c, tog ? "ON" : P.boost >= 99 ? "FULL" : Math.round(P.boost) + "%", BTN.x, BTN.y + 13, 12, C.gray, "center", "700");
  if (g.phase === "playing" || g.phase === "paused") {
    if (g.frame < 150) { const n = Math.ceil((150 - g.frame) / 42); txt(c, g.frame >= 126 ? "GO!" : String(Math.min(3, n)), W / 2, 250, 72, C.dark, "center", "800"); c.fillStyle = "rgba(255,255,255,.8)"; c.beginPath(); c.roundRect(14, 304, 332, 32, 10); c.fill(); txt(c, "Hold ↑ or tap BOOST. Pick up lettuce for fuel.", W / 2, 320, 13, C.dark, "center", "700"); }
    else if (t < 8 && !fin) { c.fillStyle = "rgba(255,255,255,.8)"; c.beginPath(); c.roundRect(60, 136, 240, 28, 10); c.fill(); } if (g.frame >= 150 && t < 8 && !fin) txt(c, "Boost past the hares!", W / 2, 150, 14, C.dark, "center", "800");
    if (fin) {
      const rows = [{ nm: "You", d: D, ft: P.ft, me: 1 }, ...hares.map((h) => ({ nm: h.nm, d: h.d, ft: h.fin ? h.ft : 0, hr: h.col }))].sort((a, b) => (b.ft > 0) - (a.ft > 0) || (a.ft && b.ft ? a.ft - b.ft : b.d - a.d));
      c.fillStyle = "rgba(45,45,45,.92)"; c.beginPath(); c.roundRect(30, 150, 300, 250, 14); c.fill();
      txt(c, `FINISH! ${ord(place)}`, W / 2, 180, 30, place <= 3 ? C.yellow : C.white, "center", "800");
      rows.forEach((q, i) => { const y = 218 + i * 28; if (q.me) { c.fillStyle = C.green; c.beginPath(); c.roundRect(40, y - 12, 280, 25, 8); c.fill(); }
        const k = q.me ? C.dark : C.white; txt(c, ord(i + 1), 52, y, 14, k, "left", "800"); if (q.hr) { c.fillStyle = q.hr; c.strokeStyle = C.gray; c.lineWidth = 1.5; c.beginPath(); c.arc(100, y, 6, 0, 7); c.fill(); c.stroke(); }
        txt(c, q.nm, 114, y, 14, k, "left", "700"); txt(c, q.ft ? fmt(q.ft) : "racing", 308, y, 14, q.me ? C.dark : C.gray, "right", "600"); });
      txt(c, `+${gain} pts`, W / 2, 378, 16, C.yellow, "center", "800");
    }
  }
}

const g = createGame({ width: W, height: H, background: C.dark, init, update, draw, title: "Turbo Tortoise",
  help: ["↑ (hold) or tap BOOST: rocket boost", "← → or drag the lower half: steer", "Boost drains: grab lettuce to refuel", "Rocks and puddles spin you out if boosting"] });
g.test.seed = 0;
g.test.keepSeed = false;
g.test.state = () => ({ d: Math.round(P.d), spd: Math.round(P.spd), boost: Math.round(P.boost), x: Math.round(P.x), place: rank(), boosting: P.boosting, spin: P.spin > 0, t: +t.toFixed(1), D, fin: !!fin, finPlace: place, score: g.score });
g.test.put = (type, dx) => { items.push({ type, d: P.d + dx, x: P.x, hit: false }); };
g.test.setBoost = (v) => { P.boost = v; };
g.test.finishAs = (r) => { P.d = D - 40; hares.forEach((h, i) => { h.d = i < r - 1 ? D + 5 : P.d - 300; h.fin = i < r - 1; h.ft = t - 1 - i; h.v = 0; h.base = 0; }); };
g.test.setBot = (m) => { botMode = m; };
g.test.ff = (n) => { for (let i = 0; i < n && !fin; i++) update(g, 1 / 60); return g.test.state(); };
g.test.pop = (sx, col) => { tpop = { s: sx, c: col, t: 0 }; };
g.test.hold = () => { hares.forEach((h) => { h.base = 0; }); };
