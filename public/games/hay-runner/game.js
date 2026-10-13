import { createGame } from "../shared/engine.js";

const W = 360, H = 640, G = 440; // logical size, ground line
const DX = 90, STAND = 52, DUCK = 28, LOW = G - 40; // donkey x, hitbox heights, lower edge of overhead hazards
const HOP = 400, GRAV = 2000, JUMP = 640, ROUND = 300; // sundown at 300 s
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surface: "#3c3c3c", white: "#ffffff", gray: "#d4d4d4" };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`; };
// sky keyframes: [progress, top, bottom]
const SKY = [[0, "#ffe14d", "#fff3b0"], [0.45, "#ffb347", "#ffe29a"], [0.75, "#e8504a", "#ffa04a"], [1, "#222d52", "#6b3d73"]];
function sky(p) {
  let i = 0; while (i < SKY.length - 2 && p > SKY[i + 1][0]) i++;
  const [p0, t0, b0] = SKY[i], [p1, t1, b1] = SKY[i + 1], k = Math.min(1, Math.max(0, (p - p0) / (p1 - p0)));
  return [mix(t0, t1, k), mix(b0, b1, k)];
}

let s;
function init(g) {
  s = { t: 0, dist: 0, py: 0, pv: 0, duck: false, ground: true, buf: 0, lives: 3, bales: 0, inv: 0, shake: 0, hint: 0,
    obs: [], bales_: [], floats: [], dust: [], nextD: 160, last: "", swipeY: 0, zone: false, run: 0, flash: 0, tip: 0, tipped: false, toast: 0, mins: 0, held: false, peak: 0, air: 0, bonus: 0 };
}
const speedAt = (t) => 190 + 190 * Math.min(1, Math.pow(t / 240, 0.9));

function spawn(g, type, x) {
  const sp = speedAt(s.t), r = g.rng;
  const fence = (w, bx) => { s.obs.push({ type: "fence", x: bx, w, h: 40 }); return w; };
  if (type === "fence") { fence(18, x); for (let i = 0; i < 3; i++) s.bales_.push({ x: x - 24 + i * 32 + 6, y: G - 84 - (i === 1 ? 14 : 0) }); return 70; }
  if (type === "wide") { const w = Math.round(sp * 0.16); fence(w, x); for (let i = 0; i < 4; i++) s.bales_.push({ x: x + w * (i / 3) - 4, y: G - 92 - (i % 3 ? 0 : 0) - (i === 1 || i === 2 ? 12 : 0) }); return w; }
  if (type === "bird") { s.obs.push({ type: "bird", x, w: 34, y: G - 80, h: 40, ph: r() * 6 }); return 40; }
  if (type === "branch") { s.obs.push({ type: "branch", x, w: 26, y: 0, h: LOW, sway: r() * 6 }); for (let i = 0; i < 3; i++) s.bales_.push({ x: x - 36 + i * 36 + 6, y: G - 14 }); return 30; }
  const arc = (bx) => { for (let i = 0; i < 3; i++) s.bales_.push({ x: bx - 24 + i * 32 + 6, y: G - 84 - (i === 1 ? 14 : 0) }); };
  if (type === "double") { const d = Math.round(sp * 0.6); fence(18, x); fence(18, x + d); arc(x); arc(x + d); return d + 40; }
  if (type === "combo") { // fence, then a bird: hop, land, duck
    const t1 = (x - DX) / sp + 0.75; fence(18, x); arc(x);
    s.obs.push({ type: "bird", x: DX + (sp + 70) * t1, w: 34, y: G - 80, h: 40, ph: r() * 6 }); return Math.round(sp * 0.75) + 50;
  }
  if (type === "row") { const n = 3 + Math.floor(r() * 3); for (let i = 0; i < n; i++) s.bales_.push({ x: x + i * 34, y: G - 14 }); return n * 34; }
  return 0;
}
function pick(g) {
  const t = s.t, r = g.rng();
  let type;
  if (t < 10) type = r < 0.8 ? "fence" : "row";
  else if (t < 25) type = r < 0.5 ? "fence" : r < 0.7 ? "wide" : r < 0.85 ? "branch" : "row";
  else if (t < 45) type = r < 0.28 ? "fence" : r < 0.42 ? "wide" : r < 0.62 ? "bird" : r < 0.82 ? "branch" : "row";
  else type = r < 0.2 ? "fence" : r < 0.32 ? "wide" : r < 0.46 ? "bird" : r < 0.6 ? "branch" : r < 0.72 ? "double" : r < 0.72 + Math.min(0.12, (t - 45) / 300) ? "combo" : "row";
  if (type === s.last && type !== "row" && g.rng() < 0.5) type = type === "fence" || type === "double" ? "branch" : "fence";
  s.last = type;
  return type;
}

function hit(g) {
  if (s.inv > 0) return;
  s.lives--; s.flash = 0.45; s.inv = 1.3; s.shake = reduce ? 0 : 0.25;
  g.sound("hit");
  if (s.lives <= 0) g.over(`Caught at ${s.t < 60 ? Math.round(s.t) + " s" : Math.floor(s.t / 60) + "m " + Math.round(s.t % 60) + "s"} · ${s.bales} hay`);
  else if (s.ground) { s.pv = 260; s.ground = false; }
}

function update(g, dt) {
  const inp = g.input, ptr = inp.pointer;
  s.t += dt;
  const sp = speedAt(s.t);
  s.dist += sp * dt; s.run += sp * dt;
  s.shake = Math.max(0, s.shake - dt); s.inv = Math.max(0, s.inv - dt); s.buf = Math.max(0, s.buf - dt);

  // Input: keyboard, tap = jump, swipe down / bottom-left zone = duck.
  const inZone = (y, x) => x < 120 && y > 520;
  let jump = inp.pressed("Space") || inp.pressed("ArrowUp") || inp.pressed("KeyW");
  let duck = inp.down("ArrowDown") || inp.down("KeyS");
  if (ptr.pressed) {
    s.swipeY = ptr.y; s.zone = inZone(ptr.y, ptr.x);
    if (!s.zone) jump = true;
  }
  if (ptr.down) { if (s.zone || ptr.y - s.swipeY > 30) duck = true; } else s.zone = false;
  const held = inp.down("Space") || inp.down("ArrowUp") || inp.down("KeyW") || (ptr.down && !s.zone && !duck);
  if (jump) s.buf = 0.12;
  s.duck = duck;
  if (s.ground && s.buf > 0) { s.pv = JUMP; s.ground = false; s.buf = 0; s.peak = 0; s.air = 0; g.sound("jump"); }
  if (!s.ground) {
    s.air += dt;
    if (!held && s.air > 0.08 && s.pv > HOP) s.pv = HOP; // let go early for a lower hop
    s.pv -= GRAV * (duck ? 1.8 : 1) * dt; s.py += s.pv * dt;
    s.peak = Math.max(s.peak, s.py);
    if (s.py <= 0) { s.py = 0; s.pv = 0; s.ground = true; if (!reduce) for (let i = 0; i < 4; i++) s.dust.push({ x: DX - 10 + i * 8, y: G, vx: -40 - i * 25, vy: -30 - i * 8, l: 0.35 }); }
  }

  // World
  while (s.dist >= s.nextD) {
    const x = W + 30 + (s.dist - s.nextD), len = spawn(g, s.t < 2.2 && s.obs.length + s.bales_.length === 0 ? "fence" : pick(g), x);
    const f = Math.max(0.7, 1.35 - s.t / 300);
    s.nextD = s.dist + len + sp * (0.85 + g.rng() * 0.45) * f + 40 + (s.t < 10 ? 120 : 0);
  }
  s.flash = Math.max(0, s.flash - dt); s.tip = Math.max(0, s.tip - dt); s.toast = Math.max(0, s.toast - dt);
  const mins = Math.floor(s.t / 60); if (mins > s.mins) { s.mins = mins; s.toast = 2.2; }
  if (!s.tipped && s.obs.some((o) => o.type !== "fence" && o.x > DX && o.x < W - 20)) { s.tipped = true; s.tip = 3; }
  const box = { x: DX - 16, w: 32, y: G - s.py - (s.duck && s.ground ? DUCK : STAND), h: s.duck && s.ground ? DUCK : STAND };
  for (const o of s.obs) {
    o.x -= (o.type === "bird" ? sp + 70 : sp) * dt;
    const oy = o.type === "fence" ? G - o.h : o.y, oh = o.h;
    const m = o.type === "bird" ? 5 : 3;
    if (o.x < box.x + box.w && o.x + o.w > box.x && s.inv === 0) { // tightest clearance while overhead or beside
      const above = oy - (box.y + box.h);
      if (above >= 0 && !s.ground) o.gap = Math.min(o.gap === undefined ? 99 : o.gap, above);
    }
    if (o.gap !== undefined && !o.paid && o.x + o.w < box.x) {
      o.paid = true;
      if (o.gap < 10 && s.inv === 0) { s.bonus += 25; g.sound("score"); s.floats.push({ x: DX - 20, y: box.y - 30, l: 0.9, t: "Close! +25" }); }
    }
    if (o.x + m < box.x + box.w && o.x + o.w - m > box.x && oy + m < box.y + box.h && oy + oh - m > box.y) hit(g);
  }
  for (const b of s.bales_) {
    b.x -= sp * dt;
    if (!b.got && b.x < box.x + box.w + 6 && b.x + 24 > box.x - 6 && b.y - 12 < box.y + box.h + 4 && b.y + 12 > box.y - 4) {
      b.got = true; s.bales++; g.sound("score");
      s.floats.push({ x: b.x, y: b.y - 14, l: 0.7, t: "+10" });
      if (s.bales % 10 === 0 && s.lives < 3) { s.lives++; g.sound("win"); s.floats.push({ x: DX, y: box.y - 20, l: 1, t: "+1 life" }); }
    }
  }
  s.obs = s.obs.filter((o) => o.x + o.w > -60);
  s.bales_ = s.bales_.filter((b) => b.x > -40 && !b.got);
  for (const f of s.floats) { f.l -= dt; f.y -= 30 * dt; }
  s.floats = s.floats.filter((f) => f.l > 0);
  for (const d of s.dust) { d.l -= dt; d.x += d.vx * dt; d.y += d.vy * dt; }
  s.dust = s.dust.filter((d) => d.l > 0);
  g.score = Math.floor(Math.max(0, s.dist - 200) / 20) + s.bales * 10 + s.bonus; // distance counts after a short run-up
}

function ring(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke(); }

function donkey(ctx, g, p) {
  const duck = s.duck && s.ground, air = !s.ground;
  const ph = s.run / 18, sw = air ? 0.5 : Math.sin(ph) * 0.7;
  const blink = reduce ? 0.5 : Math.floor(s.inv * 12) % 2 ? 0.35 : 1;
  ctx.save();
  ctx.translate(DX, G - s.py); ctx.scale(1.25, 1.25);
  if (s.inv > 0) ctx.globalAlpha = blink;
  const night = Math.max(0, (p - 0.55) / 0.45);
  ctx.strokeStyle = night > 0 ? mix(C.dark, C.white, Math.min(1, night)) : C.dark; ctx.lineWidth = 1.5;
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.fillStyle = C.surface;
  const by = duck ? -15 : -26;
  const leg = (x, a) => { ctx.beginPath(); ctx.moveTo(x, by + 4); ctx.lineTo(x + Math.sin(a) * 9 - (air ? 3 : 0), duck ? -2 : 0); const o = ctx.strokeStyle; ctx.lineWidth = 8; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = C.surface; ctx.stroke(); ctx.strokeStyle = o; };
  const outline = ctx.strokeStyle;
  leg(-11, sw); leg(10, sw + 3); leg(-7, -sw); leg(14, -sw + 3);
  ctx.strokeStyle = outline; ctx.lineWidth = 1.5;
  // tail
  ctx.beginPath(); ctx.moveTo(-17, by - 2); ctx.quadraticCurveTo(-26, by + 2 + Math.sin(ph * 2) * 2, -24, by + 12); ctx.lineWidth = 3; ctx.strokeStyle = C.surface; ctx.stroke();
  ctx.strokeStyle = outline; ctx.lineWidth = 1.5;
  // body
  ctx.beginPath(); ctx.ellipse(-1, by, 20, 10.5, 0, 0, 7); ctx.fill(); ctx.stroke();
  // neck + head
  const hx = duck ? 28 : 22, hy = duck ? -17 : -43;
  ctx.beginPath(); ctx.moveTo(10, by - 6); ctx.lineTo(hx - 6, hy - 2); ctx.lineTo(hx + 2, hy + 6); ctx.lineTo(16, by + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(hx + 3, hy + 1, 9, 6, duck ? 0.3 : 0.15, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.gray; ctx.beginPath(); ctx.ellipse(hx + 9, hy + 3, 4, 3.2, 0, 0, 7); ctx.fill();
  ctx.fillStyle = C.surface;
  for (const [ex, tilt] of [[hx - 3, duck ? -1.3 : -0.3], [hx + 3, duck ? -1.1 : 0.15]]) { ctx.beginPath(); ctx.ellipse(ex, hy - (duck ? 4 : 9), 2.8, 8.5, tilt, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(hx + 4, hy - 1, 1.6, 0, 7); ctx.fill();
  ctx.restore();
}

function bale(ctx, x, y) {
  ctx.fillStyle = C.yellow; ctx.strokeStyle = C.dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x, y - 9, 24, 18, 3); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 8, y - 9); ctx.lineTo(x + 8, y + 9); ctx.moveTo(x + 16, y - 9); ctx.lineTo(x + 16, y + 9); ctx.stroke();
}

function heart(ctx, x, y, on) {
  ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.bezierCurveTo(x - 12, y - 2, x - 6, y - 10, x, y - 4); ctx.bezierCurveTo(x + 6, y - 10, x + 12, y - 2, x, y + 6);
  ctx.fillStyle = on ? C.red : "rgba(255,255,255,0.25)"; ctx.fill(); ctx.strokeStyle = C.dark; ctx.lineWidth = 2; ctx.stroke();
}

function draw(g, ctx) {
  const p = Math.min(1, s.t / ROUND), sx = s.shake > 0 ? (Math.random() - 0.5) * 6 : 0, sy = s.shake > 0 ? (Math.random() - 0.5) * 6 : 0;
  ctx.save(); ctx.translate(sx, sy);
  const [top, bot] = sky(p);
  const gr = ctx.createLinearGradient(0, 0, 0, G); gr.addColorStop(0, top); gr.addColorStop(1, bot);
  ctx.fillStyle = gr; ctx.fillRect(-10, -10, W + 20, H + 20);
  // stars
  if (p > 0.82) { ctx.fillStyle = C.white; ctx.globalAlpha = Math.min(1, (p - 0.82) * 6); for (let i = 0; i < 26; i++) { const x = (i * 97) % W, y = (i * 53) % 260; ctx.fillRect(x, y, 2, 2); } ctx.globalAlpha = 1; }
  // sun sinks toward the horizon and turns orange
  const sunY = 90 + p * (G - 90 - 20) * 0.95;
  ctx.fillStyle = mix(C.white, "#ff7a3c", Math.min(1, p * 1.4)); ctx.beginPath(); ctx.arc(284, sunY, 30, 0, 7); ctx.fill();
  // clouds
  ctx.fillStyle = `rgba(255,255,255,${0.85 - p * 0.6})`;
  for (let i = 0; i < 4; i++) { const x = ((i * 190 - s.dist * 0.08) % 760 + 760) % 760 - 100, y = 70 + i * 55; ctx.beginPath(); ctx.roundRect(x, y, 70, 18, 9); ctx.roundRect(x + 14, y - 10, 36, 18, 9); ctx.fill(); }
  // hills (parallax)
  const hills = (off, k, amp, base, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, G); for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, base - amp * (0.5 + 0.5 * Math.sin((x + s.dist * k) / 70 + off)) - amp * 0.4 * Math.sin((x + s.dist * k) / 31 + off * 2)); ctx.lineTo(W, G); ctx.fill(); };
  const dim = mix("#5fc566", "#1c2a3f", p * 0.85);
  hills(1, 0.12, 40, G - 40, mix("#8fd68a", "#2b3a5c", p * 0.85));
  hills(4, 0.3, 26, G - 6, dim);
  // ground
  ctx.fillStyle = mix(C.green, "#17304a", p * 0.8); ctx.fillRect(-10, G, W + 20, H - G + 10);
  ctx.fillStyle = mix("#6fd472", "#23496a", p * 0.8); ctx.fillRect(-10, G, W + 20, 8);
  ctx.fillStyle = mix("#3a9a3e", "#12283e", p * 0.8);
  for (let i = 0; i < 12; i++) { const x = (((i * 61) - s.dist * 1.0) % 400 + 400) % 400 - 20; ctx.fillRect(x, G + 24 + (i * 37) % 70, 22, 4); }
  // dust
  ctx.fillStyle = "rgba(255,255,255,0.7)"; for (const d of s.dust) ctx.fillRect(d.x, d.y - 3, 4, 4);
  // obstacles
  for (const o of s.obs) {
    ctx.lineWidth = 2; ctx.strokeStyle = C.dark; ctx.fillStyle = C.white;
    if (o.type === "fence") {
      const h = o.h, post = (x) => { ctx.beginPath(); ctx.rect(x, G - h, 6, h); ctx.fill(); ctx.stroke(); };
      ctx.beginPath(); ctx.rect(o.x, G - h + 8, o.w, 6); ctx.rect(o.x, G - h + 22, o.w, 6); ctx.fill(); ctx.stroke();
      post(o.x); post(o.x + o.w - 6); if (o.w > 40) post(o.x + o.w / 2 - 3);
    } else if (o.type === "bird") {
      const fl = reduce ? 0 : Math.sin(s.t * 14 + o.ph) * 9, cy = o.y + 20;
      ctx.beginPath(); ctx.ellipse(o.x + 17, cy, 16, 9, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(o.x + 10, cy - 3); ctx.lineTo(o.x + 22, cy - 3); ctx.lineTo(o.x + 15, cy - 16 + fl); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(o.x + 2, cy - 2); ctx.lineTo(o.x - 8, cy + 1); ctx.lineTo(o.x + 2, cy + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.dark; ctx.fillRect(o.x + 6, cy - 4, 3, 3);
    } else {
      const sw = reduce ? 0 : Math.sin(s.t * 2 + o.sway) * 2;
      ctx.fillStyle = "#6b4a2b"; ctx.beginPath(); ctx.moveTo(o.x + 7, -4); ctx.lineTo(o.x + 19, -4); ctx.lineTo(o.x + 17 + sw, LOW - 22); ctx.lineTo(o.x + 9 + sw, LOW - 22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.green;
      for (const [dx, dy, r] of [[-2, -8, 11], [22, -10, 11], [10, 4, 13], [10, -20, 10]]) ring(ctx, o.x + 13 + sw + dx - 4, LOW + dy - 12, r);
    }
  }
  for (const b of s.bales_) bale(ctx, b.x, b.y);
  donkey(ctx, g, p);
  ctx.font = `700 15px ${g.font}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const f of s.floats) { ctx.globalAlpha = Math.min(1, f.l * 2); ctx.fillStyle = C.white; ctx.strokeStyle = C.dark; ctx.lineWidth = 3; ctx.strokeText(f.t, f.x + 12, f.y); ctx.fillText(f.t, f.x + 12, f.y); }
  ctx.globalAlpha = 1; ctx.restore();

  // HUD (top-right stays clear)
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  const fs = Math.max(20, 12 / g.scale);
  ctx.font = `800 ${fs}px ${g.font}`; ctx.lineWidth = 4; ctx.strokeStyle = C.dark; ctx.fillStyle = C.white;
  ctx.strokeText(`${g.score}`, 14, 34); ctx.fillText(`${g.score}`, 14, 34);
  for (let i = 0; i < 3; i++) heart(ctx, 24 + i * 28, 56, i < s.lives);
  if (s.flash > 0) { ctx.strokeStyle = `rgba(255,60,40,${Math.min(1, s.flash * 2) * (reduce ? 0.35 : 0.8)})`; ctx.lineWidth = 28; ctx.strokeRect(0, 0, W, H); }
  const touch = matchMedia("(pointer:coarse)").matches || g.touched;
  const say = (txt, y, a) => { ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `700 ${Math.max(16, 12 / g.scale)}px ${g.font}`; ctx.lineWidth = 4; ctx.strokeStyle = C.dark; ctx.fillStyle = C.white; ctx.globalAlpha = a; ctx.strokeText(txt, W / 2, y); ctx.fillText(txt, W / 2, y); ctx.globalAlpha = 1; };
  if (g.phase === "playing" && s.tip > 0) say(touch ? "Hold DUCK or swipe down" : "Hold ↓ to duck", 190, Math.min(1, s.tip * 2));
  if (g.phase === "playing" && s.toast > 0) say(`${s.mins} min`, 110, Math.min(1, s.toast * 2));
  // touch duck zone
  if (g.phase !== "title" && touch) {
    ctx.fillStyle = s.duck && s.zone ? "rgba(255,255,255,0.45)" : s.tip > 0 && !reduce && Math.floor(s.t * 4) % 2 ? "rgba(255,212,0,0.6)" : "rgba(45,45,45,0.45)";
    ctx.beginPath(); ctx.roundRect(8, 530, 110, 90, 14); ctx.fill();
    ctx.fillStyle = C.white; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `700 ${Math.max(16, 12 / g.scale)}px ${g.font}`;
    ctx.fillText("▼ DUCK", 63, 575);
  }
  if (g.phase === "playing" && s.t < 7) {
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `700 ${Math.max(16, 12 / g.scale)}px ${g.font}`;
    ctx.lineWidth = 4; ctx.strokeStyle = C.dark; ctx.fillStyle = C.white;
    ctx.globalAlpha = Math.min(1, (7 - s.t)); ctx.strokeText("Hop fences, duck branches, grab hay", W / 2, 150); ctx.fillText("Hop fences, duck branches, grab hay", W / 2, 150); ctx.globalAlpha = 1;
  }
}

const g = createGame({ width: W, height: H, background: C.dark, init, update, draw, title: "Hay Runner",
  help: ["Space / tap: jump", "↓ / swipe down / DUCK zone: duck", "Hop fences, duck branches, grab hay", "P: pause"] });
addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") g.touched = true; }, true);

g.test.keepSeed = false;
g.test.state = () => ({ bonus: s.bonus, py: Math.round(s.py), ground: s.ground, duck: s.duck && s.ground, lives: s.lives, bales: s.bales, speed: Math.round(speedAt(s.t)), t: +s.t.toFixed(1), p: +Math.min(1, s.t / ROUND).toFixed(2),
  obs: s.obs.map((o) => ({ type: o.type, x: Math.round(o.x) })), hay: s.bales_.length });
g.test.peak = () => Math.round(s.peak); g.test.state2 = () => ({ tip: s.tip, flash: s.flash, mins: s.mins });
g.test.clear = () => { s.obs = []; s.bales_ = []; s.nextD = s.dist + 99999; };
g.test.place = (type, x = W + 20) => { g.test.clear(); spawn(g, type === "ground" ? "row" : type, x); };
g.test.setTime = (t) => { s.t = t; };
