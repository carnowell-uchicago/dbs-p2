import { createGame } from "../shared/engine.js";

const WIDE = window.innerWidth / window.innerHeight > 1.15;
const W = WIDE ? 640 : 360, H = WIDE ? 360 : 640;
const BAR = WIDE ? 64 : 76, FH = H - BAR;
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surf: "#3c3c3c", white: "#fff", gray: "#d4d4d4" };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const PATHS = WIDE
  ? [[-12, 250], [100, 250], [100, 74], [240, 74], [240, 200], [390, 200], [390, 110], [510, 110], [510, 225], [575, 225]]
  : [[-12, 500], [60, 500], [60, 400], [300, 400], [300, 300], [60, 300], [60, 205], [300, 205], [300, 130], [165, 130], [165, 92]];
const CASTLE = PATHS[PATHS.length - 1];
const AVOID = WIDE ? [[0, 0, 230, 34], [520, 0, 640, 62]] : [[0, 0, 240, 28], [240, 0, 360, 64]];
const MODES = ["First", "Strong", "Close"];
const TT = [
  { n: "Archer", cost: 50, range: 72, rate: 0.45, dmg: 8, col: C.yellow, spd: 320, info: "fast" },
  { n: "Cannon", cost: 90, range: 64, rate: 1.5, dmg: 24, col: C.red, spd: 230, splash: 30, info: "splash" },
  { n: "Frost", cost: 70, range: 58, rate: 1.1, dmg: 3, col: C.blue, info: "slows" },
  { n: "Ballista", cost: 120, range: 140, rate: 1.7, dmg: 48, col: C.white, spd: 520, info: "far" },
];
const EN = {
  grunt: { hp: 30, sp: 38, r: 7, rew: 4, life: 1, col: C.dark },
  runner: { hp: 18, sp: 68, r: 5.5, rew: 3, life: 1, col: C.white },
  brute: { hp: 130, sp: 26, r: 10, rew: 9, life: 2, col: C.surf },
  boss: { hp: 1500, sp: 20, r: 14, rew: 70, life: 6, col: C.dark },
};

// path geometry
const segs = []; let plen = 0;
for (let i = 1; i < PATHS.length; i++) { const a = PATHS[i - 1], b = PATHS[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push({ a, b, l, s: plen }); plen += l; }
function pathAt(d) { for (const s of segs) if (d <= s.s + s.l) { const t = (d - s.s) / s.l; return [s.a[0] + (s.b[0] - s.a[0]) * t, s.a[1] + (s.b[1] - s.a[1]) * t]; } return CASTLE; }
function segDist(p, s) { const dx = s.b[0] - s.a[0], dy = s.b[1] - s.a[1]; let t = ((p[0] - s.a[0]) * dx + (p[1] - s.a[1]) * dy) / (s.l * s.l); t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - s.a[0] - dx * t, p[1] - s.a[1] - dy * t); }
const pdist = (p) => Math.min(...segs.map((s) => segDist(p, s)));
function genSpots() {
  const cand = [];
  for (const s of segs) for (let t = 12; t < s.l; t += 20) {
    const x = s.a[0] + (s.b[0] - s.a[0]) * t / s.l, y = s.a[1] + (s.b[1] - s.a[1]) * t / s.l, nx = -(s.b[1] - s.a[1]) / s.l, ny = (s.b[0] - s.a[0]) / s.l;
    for (const k of [-1, 1]) cand.push([x + nx * 30 * k, y + ny * 30 * k]);
  }
  const ok = cand.filter((p) => p[0] > 16 && p[0] < W - 16 && p[1] > 16 && p[1] < FH - 16 && pdist(p) >= 25 && Math.hypot(p[0] - CASTLE[0], p[1] - CASTLE[1]) > 36 && !AVOID.some((r) => p[0] > r[0] - 14 && p[0] < r[2] + 14 && p[1] > r[1] - 14 && p[1] < r[3] + 14));
  const pts = []; for (let d = 0; d < plen; d += 8) pts.push(pathAt(d));
  const cov = new Array(pts.length).fill(0), N = WIDE ? 15 : 14, out = [];
  const near = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 70;
  while (out.length < N) {
    let best = null, bs = -1;
    for (const p of ok) {
      if (out.some((q) => Math.hypot(q.x - p[0], q.y - p[1]) < 36)) continue;
      let sc = 0; pts.forEach((q, i) => { if (near(p, q)) sc += 1 / (1 + cov[i] * 1.5); });
      if (sc > bs) { bs = sc; best = p; }
    }
    if (!best) break;
    pts.forEach((q, i) => { if (near(best, q)) cov[i]++; });
    out.push({ x: best[0], y: best[1], t: null });
  }
  return out;
}
const spots = genSpots();
addEventListener("resize", () => { if ((innerWidth / innerHeight > 1.15) !== WIDE && (g.phase === "title" || g.phase === "over")) location.reload(); });

let S, cur, armed, hint, hintT, shake, cursorOn;
const fx = [];
const stats = (t) => { const T = TT[t.k], l = t.lv - 1; return { dmg: T.dmg * (1 + 0.6 * l), range: T.range * (1 + 0.08 * l), rate: T.rate * Math.pow(0.9, l) }; };
const upCost = (t) => Math.round(TT[t.k].cost * 0.75 * t.lv);
const worth = (t) => { let v = TT[t.k].cost; for (let l = 1; l < t.lv; l++) v += Math.round(TT[t.k].cost * 0.75 * l); return v; };
const say = (m) => { hint = m; hintT = 150; };

function waveList(n, g) {
  const L = []; const add = (t, c) => { for (let i = 0; i < c; i++) L.push(t); };
  add("grunt", 5 + n); if (n >= 3) add("runner", 2 + (n >> 1)); if (n >= 6) add("brute", (n - 4) >> 1);
  if (n === 10) add("boss", 1); if (n === 20) add("boss", 2);
  for (let i = L.length - 1; i > 0; i--) { const j = Math.floor(g.rng() * (i + 1)); [L[i], L[j]] = [L[j], L[i]]; }
  return L;
}
function launch(g, early) {
  if (S.wave >= 20) return;
  S.wave++;
  const gap = Math.max(0.55, 1.1 - S.wave * 0.025), base = S.pend.length ? S.pend[S.pend.length - 1].t + 2 : 0;
  waveList(S.wave, g).forEach((k, i) => S.pend.push({ k, t: base + i * gap, w: S.wave }));
  S.paid = false; S.cd = 24;
  if (early) { const b = S.pend.length > 0 && S.en.length ? 10 : Math.ceil(S.cd0); S.coins += b; say(`Early call +${b}`); fx.push({ x: W / 2, y: 40, t: 1, s: `+${b}`, c: C.yellow }); }
  g.sound("click");
}
function build(g, i, k) {
  const sp = spots[i], T = TT[k];
  if (sp.t) return false;
  if (S.coins < T.cost) { say(`Need ${T.cost - S.coins} more coins`); g.sound("hit"); return false; }
  S.coins -= T.cost; sp.t = { k, lv: 1, cd: 0.3, flash: 0, mode: 0 }; g.sound("score"); return true;
}
function upgrade(g, i) {
  const t = spots[i].t; if (!t) return;
  if (t.lv >= 3) return say("Max level");
  const c = upCost(t); if (S.coins < c) { say(`Need ${c - S.coins} more coins`); return g.sound("hit"); }
  S.coins -= c; t.lv++; t.flash = 0.4; g.sound("score");
}
function sell(g, i) { const t = spots[i].t; if (!t) return; const v = Math.floor(worth(t) * 0.6); S.coins += v; spots[i].t = null; say(`Sold +${v}`); g.sound("click"); }

function hit(e, dmg, g) {
  e.hp -= dmg; e.fl = 0.08;
  if (e.hp <= 0 && !e.dead) { e.dead = true; S.coins += e.def.rew; g.score += 10; S.kills++; g.sound("hit"); fx.push({ x: e.x, y: e.y - 8, t: 0.7, s: `+${e.def.rew}`, c: C.yellow }); for (let i = 0; i < 5; i++) fx.push({ x: e.x, y: e.y, vx: (g.rng() - 0.5) * 80, vy: (g.rng() - 0.5) * 80, t: 0.4, c: e.def.col === C.white ? C.gray : C.white, p: 1 }); }
}
function step(g, dt) {
  S.time += dt;
  if (S.pend.length === 0 && S.wave < 20) { S.cd -= dt; S.cd0 = S.cd; if (S.cd <= 0) launch(g, false); }
  for (const p of S.pend) p.t -= dt;
  while (S.pend.length && S.pend[0].t <= 0) {
    const p = S.pend.shift(), d = EN[p.k], m = (1 + 0.21 * (p.w - 1)) * Math.pow(1.045, p.w);
    S.en.push({ k: p.k, def: d, d: 0, x: -12, y: PATHS[0][1], hp: d.hp * m * (p.k === "boss" ? 1 : 1), max: d.hp * m, slow: 0, sf: 1, fl: 0 });
  }
  for (const e of S.en) {
    e.slow = Math.max(0, e.slow - dt); e.fl = Math.max(0, e.fl - dt);
    e.d += e.def.sp * (e.slow > 0 ? e.sf : 1) * dt;
    [e.x, e.y] = pathAt(e.d);
    if (e.d >= plen) { e.dead = true; e.leak = true; S.lives -= e.def.life; S.flash = 0.4; if (!reduce) shake = 6; g.sound("lose"); }
  }
  for (const sp of spots) {
    const t = sp.t; if (!t) continue;
    t.cd -= dt; t.flash = Math.max(0, t.flash - dt);
    if (t.cd > 0) continue;
    const st = stats(t), T = TT[t.k];
    let best = null;
    for (const e of S.en) if (!e.dead && Math.hypot(e.x - sp.x, e.y - sp.y) <= st.range && (!best || (t.mode === 1 ? e.hp > best.hp : t.mode === 2 ? Math.hypot(e.x - sp.x, e.y - sp.y) < Math.hypot(best.x - sp.x, best.y - sp.y) : e.d > best.d))) best = e;
    if (!best) continue;
    t.cd = st.rate; t.aim = Math.atan2(best.y - sp.y, best.x - sp.x);
    if (t.k === 2) {
      const f = [0.5, 0.4, 0.3][t.lv - 1];
      for (const e of S.en) if (!e.dead && Math.hypot(e.x - sp.x, e.y - sp.y) <= st.range) { hit(e, st.dmg, g); e.slow = 1.8; e.sf = f; }
      fx.push({ x: sp.x, y: sp.y, t: 0.35, r: st.range, ring: 1, c: C.blue });
    } else S.pr.push({ x: sp.x, y: sp.y, tg: best, k: t.k, dmg: st.dmg, lx: best.x, ly: best.y });
  }
  for (const p of S.pr) {
    const T = TT[p.k]; if (!p.tg.dead) { p.lx = p.tg.x; p.ly = p.tg.y; }
    const dx = p.lx - p.x, dy = p.ly - p.y, d = Math.hypot(dx, dy), mv = T.spd * dt;
    if (d <= mv + 2) {
      p.done = true;
      if (T.splash) { for (const e of S.en) if (!e.dead && Math.hypot(e.x - p.lx, e.y - p.ly) <= T.splash) hit(e, p.dmg, g); fx.push({ x: p.lx, y: p.ly, t: 0.3, r: T.splash, ring: 1, c: C.red }); }
      else if (!p.tg.dead) hit(p.tg, p.dmg, g);
    } else { p.x += dx / d * mv; p.y += dy / d * mv; p.a = Math.atan2(dy, dx); }
  }
  S.pr = S.pr.filter((p) => !p.done); S.en = S.en.filter((e) => !e.dead);
  for (const f of fx) { f.t -= dt; if (f.p) { f.x += f.vx * dt; f.y += f.vy * dt; } else if (f.s) f.y -= 18 * dt; }
  for (let i = fx.length - 1; i >= 0; i--) if (fx[i].t <= 0) fx.splice(i, 1);
  S.flash = Math.max(0, S.flash - dt);
  if (S.lives <= 0) { S.lives = 0; return g.over("The hill has fallen"); }
  if (S.pend.length === 0 && S.en.length === 0) {
    if (!S.paid && S.wave > 0) { S.paid = true; const b = 15 + 2 * S.wave; S.coins += b; g.score += S.wave * 50; fx.push({ x: W / 2, y: 60, t: 1.2, s: `Wave ${S.wave} cleared +${b}`, c: C.white }); if (S.wave < 20) g.sound("score"); }
    if (S.wave >= 20) { g.score += S.lives * 50 + 500; g.sound("win"); g.over("You held the hill!"); }
  }
}

function bar() {
  const b = [], y = FH + (BAR - (WIDE ? 48 : 56)) / 2, h = WIDE ? 48 : 56, gap = 4;
  const sel = cur >= 0 && spots[cur] && spots[cur].t;
  const row = (items, ws) => { let x = (W - ws.reduce((a, c) => a + c, 0) - gap * (ws.length - 1)) / 2; items.forEach((it, i) => { b.push({ x, y, w: ws[i], h, ...it }); x += ws[i] + gap; }); };
  const nxt = { id: "next", lab: S.wave >= 20 ? "All sent" : "Next wave", sub: S.wave >= 20 ? "" : S.pend.length ? "+10 early" : `+${Math.max(0, Math.ceil(S.cd))} early`, col: C.green, on: S.wave < 20 };
  const spd = { id: "spd", lab: `${S.spd}×`, sub: "speed", col: C.surf, on: true };
  if (sel) {
    const t = spots[cur].t, T = TT[t.k];
    row([{ id: "up", lab: t.lv >= 3 ? "Max level" : `Upgrade ${upCost(t)}`, sub: `${T.n} Lv${t.lv}`, col: C.yellow, on: t.lv < 3 && S.coins >= upCost(t), dark: 1 }, { id: "sell", lab: `Sell ${Math.floor(worth(t) * 0.6)}`, sub: "X", col: C.red, on: true }, { id: "mode", lab: MODES[t.mode], sub: "target", col: C.surf, on: true }, nxt, spd], WIDE ? [130, 100, 70, 130, 56] : [84, 60, 52, 84, 48]);
  } else row([0, 1, 2, 3].map((k) => ({ id: "t" + k, k, lab: TT[k].n, sub: `${k + 1}·${TT[k].cost}`, col: TT[k].col, on: S.coins >= TT[k].cost, dark: 1 })).concat([nxt, spd]), WIDE ? [84, 84, 84, 84, 128, 56] : [52, 52, 52, 52, 80, 48]);
  return b;
}
function cycle(g) { const t = spots[cur] && spots[cur].t; if (!t) return; t.mode = (t.mode + 1) % 3; say(`Targets: ${MODES[t.mode]}`); g.sound("click"); }
function act(g, id) {
  if (id[0] === "t") { armed = +id[1]; cur = -1; g.sound("click"); }
  else if (id === "next") launch(g, true);
  else if (id === "spd") S.spd = S.spd === 1 ? 2 : 1;
  else if (id === "up") upgrade(g, cur);
  else if (id === "sell") { sell(g, cur); cur = -1; }
  else if (id === "mode") cycle(g);
}
function nearSpot(x, y, r) { let bi = -1, bd = r; spots.forEach((s, i) => { const d = Math.hypot(s.x - x, s.y - y); if (d < bd) { bd = d; bi = i; } }); return bi; }
function moveCursor(dx, dy) {
  if (cur < 0) { cur = nearSpot(CASTLE[0], CASTLE[1], 1e9); return; }
  const c = spots[cur]; let bi = -1, bs = 1e9;
  spots.forEach((s, i) => { if (i === cur) return; const vx = s.x - c.x, vy = s.y - c.y, fwd = vx * dx + vy * dy; if (fwd <= 4) return; const side = Math.abs(vx * dy - vy * dx), sc = Math.hypot(vx, vy) + side; if (sc < bs) { bs = sc; bi = i; } });
  if (bi >= 0) cur = bi;
}

const g = createGame({
  width: W, height: H, background: "#2f7d33", title: "Hilltop Defense",
  help: ["Build towers beside the path", "Tap a spot to build, tap a tower", "Keys: 1-4 pick, arrows+Enter, T target, N wave", "Hold 20 waves"],
  init(g) {
    S = { coins: 170, lives: 20, wave: 0, cd: 36, cd0: 36, pend: [], en: [], pr: [], spd: 1, time: 0, kills: 0, paid: true, flash: 0 };
    spots.forEach((s) => (s.t = null)); fx.length = 0; cur = -1; armed = 0; shake = 0; hint = "Tap a gold spot to build an Archer"; hintT = 400;
    g.score = 0; g.reseed(7);
  },
  update(g) {
    const inp = g.input, ptr = inp.pointer;
    for (let k = 0; k < 4; k++) if (inp.pressed("Digit" + (k + 1))) { armed = k; g.sound("click"); }
    for (const [c, dx, dy] of [["ArrowLeft", -1, 0], ["ArrowRight", 1, 0], ["ArrowUp", 0, -1], ["ArrowDown", 0, 1]]) if (inp.pressed(c)) moveCursor(dx, dy);
    if (inp.pressed("KeyN") || inp.pressed("Space")) launch(g, true);
    if (inp.pressed("KeyF")) S.spd = S.spd === 1 ? 2 : 1;
    if (inp.pressed("KeyT")) cycle(g);
    if (cur >= 0 && inp.pressed("KeyX")) { sell(g, cur); }
    if (cur >= 0 && (inp.pressed("Enter") || inp.pressed("KeyU"))) { if (spots[cur].t) upgrade(g, cur); else build(g, cur, armed); }
    if (ptr.pressed) {
      const b = bar().find((q) => ptr.x >= q.x && ptr.x <= q.x + q.w && ptr.y >= q.y && ptr.y <= q.y + q.h);
      if (ptr.y >= FH - 4 && !b) {} else if (b) { if (b.on) act(g, b.id); else if (b.id[0] === "t") say(`Need ${TT[b.k].cost - S.coins} more coins`); }
      else {
        const i = nearSpot(ptr.x, ptr.y, 26);
        if (i < 0) cur = -1;
        else if (spots[i].t) cur = i;
        else { if (build(g, i, armed)) cur = -1; else cur = i; }
      }
    }
    for (let k = 0; k < S.spd; k++) if (g.phase === "playing") step(g, 1 / 60);
    hintT--; shake = Math.max(0, shake - 0.5);
  },
  draw(g, ctx) {
    if (!S) return;
    ctx.save();
    if (shake > 0 && g.canShake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    // ground
    ctx.fillStyle = "#3a9a40"; ctx.fillRect(-10, -10, W + 20, FH + 10);
    ctx.fillStyle = "#43ad49";
    for (let i = 0; i < 30; i++) { const x = (i * 97) % W, y = (i * 61 + 13) % FH; ctx.fillRect(x, y, 10, 2); ctx.fillRect(x + 3, y - 2, 2, 5); }
    // path
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    const tracePath = () => { ctx.beginPath(); PATHS.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); };
    ctx.lineWidth = 30; ctx.strokeStyle = C.dark; tracePath(); ctx.stroke();
    ctx.lineWidth = 24; ctx.strokeStyle = C.gray; tracePath(); ctx.stroke();
    // castle
    const [cx, cy] = CASTLE;
    ctx.fillStyle = "#2f8a36"; ctx.beginPath(); ctx.ellipse(cx, cy + 8, 46, 28, 0, 0, 7); ctx.fill();
    ctx.fillStyle = C.white; ctx.strokeStyle = C.dark; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 20, cy + 12); ctx.lineTo(cx - 20, cy - 14); ctx.lineTo(cx - 14, cy - 14); ctx.lineTo(cx - 14, cy - 20); ctx.lineTo(cx - 8, cy - 20); ctx.lineTo(cx - 8, cy - 14); ctx.lineTo(cx - 3, cy - 14); ctx.lineTo(cx - 3, cy - 20); ctx.lineTo(cx + 3, cy - 20); ctx.lineTo(cx + 3, cy - 14); ctx.lineTo(cx + 8, cy - 14); ctx.lineTo(cx + 8, cy - 20); ctx.lineTo(cx + 14, cy - 20); ctx.lineTo(cx + 14, cy - 14); ctx.lineTo(cx + 20, cy - 14); ctx.lineTo(cx + 20, cy + 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.dark; ctx.beginPath(); ctx.moveTo(cx - 6, cy + 12); ctx.lineTo(cx - 6, cy + 2); ctx.quadraticCurveTo(cx, cy - 6, cx + 6, cy + 2); ctx.lineTo(cx + 6, cy + 12); ctx.fill();
    ctx.fillRect(cx - 1, cy - 38, 2, 18); ctx.fillStyle = S.flash > 0 && !reduce ? C.white : C.red; ctx.beginPath(); ctx.moveTo(cx + 1, cy - 38); ctx.lineTo(cx + 14, cy - 33); ctx.lineTo(cx + 1, cy - 28); ctx.fill();
    // spots
    const hov = nearSpot(g.input.pointer.x, g.input.pointer.y, 20);
    const showR = cur >= 0 ? cur : hov >= 0 && g.input.pointer.y < FH && cur < 0 ? hov : -1;
    spots.forEach((s, i) => {
      if (s.t) return;
      ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, 7); ctx.fillStyle = "rgba(45,45,45,.55)"; ctx.fill();
      ctx.lineWidth = 2; if (S.wave === 0 && !reduce && !spots.some((q) => q.t)) { ctx.save(); ctx.globalAlpha = 0.3 + 0.3 * Math.sin(S.time * 4 + i); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); } ctx.strokeStyle = i === cur ? C.white : C.yellow; ctx.setLineDash(i === cur ? [] : [4, 3]); ctx.stroke(); ctx.setLineDash([]);
    });
    // range
    if (showR >= 0) {
      const s = spots[showR], r = s.t ? stats(s.t).range : TT[armed].range;
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 7); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.stroke();
    }
    // towers
    spots.forEach((s, i) => {
      const t = s.t; if (!t) return; const T = TT[t.k];
      ctx.fillStyle = C.dark; ctx.beginPath(); ctx.arc(s.x, s.y + 2, 15, 0, 7); ctx.fill();
      ctx.fillStyle = t.flash > 0 ? C.white : T.col; ctx.beginPath(); ctx.arc(s.x, s.y, 13, 0, 7); ctx.fill();
      ctx.strokeStyle = i === cur ? C.white : C.dark; ctx.lineWidth = i === cur ? 3 : 2; ctx.stroke();
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(t.aim || -1.57); ctx.fillStyle = C.dark;
      if (t.k === 0) ctx.fillRect(0, -2, 13, 4); else if (t.k === 1) ctx.fillRect(-1, -4, 14, 8); else if (t.k === 3) { ctx.fillRect(-2, -2, 17, 4); ctx.fillRect(2, -8, 3, 16); } else { ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill(); ctx.fillStyle = C.white; ctx.fillRect(-1, -4, 2, 8); ctx.fillRect(-4, -1, 8, 2); }
      ctx.restore();
      ctx.fillStyle = C.dark; for (let l = 0; l < t.lv; l++) { ctx.beginPath(); ctx.arc(s.x - (t.lv - 1) * 4 + l * 8, s.y + 19, 2.5, 0, 7); ctx.fillStyle = C.yellow; ctx.fill(); ctx.strokeStyle = C.dark; ctx.lineWidth = 1; ctx.stroke(); }
    });
    // cursor ring for keyboard on towers handled via cur. enemies
    for (const e of S.en) {
      const r = e.def.r;
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(e.x, e.y + r * 0.8, r, r * 0.45, 0, 0, 7); ctx.fill();
      ctx.fillStyle = e.fl > 0 ? C.white : e.def.col; ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, 7); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = e.slow > 0 ? C.blue : e.k === "runner" ? C.dark : C.white; ctx.stroke();
      if (e.k === "brute") { ctx.fillStyle = C.red; ctx.fillRect(e.x - r + 2, e.y - 2, r * 2 - 4, 4); }
      if (e.k === "boss") { ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(e.x - 9, e.y - r + 1); ctx.lineTo(e.x - 9, e.y - r - 6); ctx.lineTo(e.x - 3, e.y - r - 1); ctx.lineTo(e.x, e.y - r - 7); ctx.lineTo(e.x + 3, e.y - r - 1); ctx.lineTo(e.x + 9, e.y - r - 6); ctx.lineTo(e.x + 9, e.y - r + 1); ctx.fill(); }
      ctx.fillStyle = e.k === "runner" ? C.dark : C.white; ctx.fillRect(e.x - 3, e.y - 2, 2, 2); ctx.fillRect(e.x + 1, e.y - 2, 2, 2);
      if (e.hp < e.max) { const w = Math.max(14, r * 2); ctx.fillStyle = C.dark; ctx.fillRect(e.x - w / 2 - 1, e.y - r - 6, w + 2, 5); ctx.fillStyle = C.green; ctx.fillRect(e.x - w / 2, e.y - r - 5, w * Math.max(0, e.hp / e.max), 3); }
    }
    for (const p of S.pr) { const T = TT[p.k]; ctx.fillStyle = p.k === 1 ? C.dark : T.col; ctx.strokeStyle = C.dark; ctx.lineWidth = 1.5; if (p.k === 3) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a || 0); ctx.fillStyle = C.white; ctx.fillRect(-7, -1.5, 14, 3); ctx.strokeRect(-7, -1.5, 14, 3); ctx.restore(); } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.k === 1 ? 4.5 : 3, 0, 7); ctx.fill(); ctx.stroke(); } }
    for (const f of fx) {
      ctx.globalAlpha = Math.min(1, f.t * 2.5);
      if (f.ring) { ctx.strokeStyle = f.c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 - f.t / 0.35 * 0.0) * Math.min(1, 1.3 - f.t), 0, 7); ctx.stroke(); }
      else if (f.p) { ctx.fillStyle = f.c; ctx.fillRect(f.x - 1.5, f.y - 1.5, 3, 3); }
      else { ctx.fillStyle = f.c; ctx.strokeStyle = C.dark; ctx.lineWidth = 3; ctx.font = `700 ${Math.max(12, 12 / g.scale)}px system-ui,sans-serif`; ctx.textAlign = "center"; ctx.strokeText(f.s, f.x, f.y); ctx.fillText(f.s, f.x, f.y); }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // HUD
    const fs = Math.max(12, 12 / g.scale); ctx.font = `700 ${fs}px system-ui,sans-serif`; ctx.textBaseline = "middle"; ctx.textAlign = "left";
    const hud = (x, y, s, col) => { ctx.strokeStyle = C.dark; ctx.lineWidth = 3; ctx.strokeText(s, x, y); ctx.fillStyle = col; ctx.fillText(s, x, y); };
    hud(6, 12, `♥ ${S.lives}`, C.red === 0 ? C.white : "#ff8a7a"); hud(WIDE ? 62 : 56, 12, `● ${S.coins}`, C.yellow);
    hud(WIDE ? 130 : 112, 12, `Wave ${Math.max(1, S.wave)}/20`, C.white);
    if (S.wave < 20 && S.pend.length === 0 && S.en.length === 0 || S.wave === 0) hud(WIDE ? 6 : 6, WIDE ? 26 : 26, `Wave ${S.wave + 1} in ${Math.max(0, Math.ceil(S.cd))}s`, C.gray);
    const sel = cur >= 0 && spots[cur] && spots[cur].t;
    {
      let line = "";
      if (sel) { const t = spots[cur].t, st = stats(t), T = TT[t.k]; line = `${T.n} Lv${t.lv}: ${Math.round(st.dmg)} dmg, ${(1 / st.rate).toFixed(1)}/s, range ${Math.round(st.range)}, ${T.info}`; }
      else if (S.wave < 20 && S.pend.length === 0 && S.en.length === 0) {
        const c = {}; for (const k of waveList(S.wave + 1, { rng: () => 0.5 })) c[k] = (c[k] || 0) + 1;
        line = "Next: " + Object.keys(c).map((k) => `${c[k]} ${k}`).join(", ");
      } else if (cur < 0 && !hintT) { const T = TT[armed]; line = `${T.n}: ${T.dmg} dmg, range ${T.range}, ${T.info}`; }
      if (line && hintT <= 0 || sel) { ctx.textAlign = "center"; hud(W / 2, FH - 12, line, C.white); }
    }
    if (hintT > 0 && !sel) { ctx.textAlign = "center"; hud(W / 2, FH - 12, hint, C.white); }
    // bar
    ctx.fillStyle = C.dark; ctx.fillRect(0, FH, W, BAR);
    ctx.textAlign = "center";
    for (const b of bar()) {
      ctx.globalAlpha = b.on ? 1 : 0.5;
      const act = (b.id[0] === "t" && +b.id[1] === armed) || (b.id === "spd" && S.spd === 2);
      ctx.fillStyle = b.col; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 8); ctx.fill();
      if (act) { ctx.strokeStyle = C.white; ctx.lineWidth = 3; ctx.stroke(); }
      const dark = b.dark || b.col === C.green; ctx.fillStyle = dark ? C.dark : C.white;
      ctx.font = `700 ${fs}px system-ui,sans-serif`; ctx.fillText(b.lab, b.x + b.w / 2, b.y + b.h * (b.sub ? 0.35 : 0.5));
      if (b.sub) { ctx.font = `600 ${fs}px system-ui,sans-serif`; ctx.fillText(b.sub, b.x + b.w / 2, b.y + b.h * 0.72); }
      ctx.globalAlpha = 1;
    }
  },
});

g.test.state = () => ({ coins: S.coins, lives: S.lives, wave: S.wave, enemies: S.en.length, pend: S.pend.length, towers: spots.filter((s) => s.t).map((s) => ({ k: s.t.k, lv: s.t.lv })), cur, armed, spd: S.spd, kills: S.kills, modes: spots.map((s) => s.t ? s.t.mode : -1), spots: spots.map((s) => [Math.round(s.x), Math.round(s.y)]), wide: WIDE });
g.test.sim = (sec) => { for (let i = 0; i < sec * 60 && g.phase === "playing"; i++) step(g, 1 / 60); };
g.test.cash = (n) => (S.coins += n);
g.test.setWave = (n) => { S.wave = n; };
g.test.bot = () => { // greedy: build best spots, upgrade, call waves
  const cv = (p) => { let n = 0; for (let d = 0; d < plen; d += 8) { const q = pathAt(d); if (Math.hypot(q[0] - p.x, q[1] - p.y) < 70) n++; } return n; };
  const order = spots.map((s, i) => i).sort((a, b) => cv(spots[b]) - cv(spots[a])); let k = 0;
  for (let n = 0; n < 100000 && g.phase === "playing"; n++) {
    if (n % 30 === 0) {
      const empty = order.filter((i) => !spots[i].t), cnt = spots.filter((s) => s.t).length;
      const want = [0, 1, 0, 2, 3, 1, 0, 3, 1, 2][cnt % 10];
      if (empty.length && S.coins >= TT[want].cost && cnt < 8 + (S.wave >> 1)) build(g, empty[0], want);
      else { const up = spots.map((s, i) => i).filter((i) => spots[i].t && spots[i].t.lv < 3).sort((a, b) => spots[a].t.lv - spots[b].t.lv)[0]; if (up !== undefined && S.coins >= upCost(spots[up].t)) upgrade(g, up); else if (empty.length && S.coins >= TT[want].cost) build(g, empty[0], want); }
    }
    step(g, 1 / 60);
  }
  return { wave: S.wave, lives: S.lives, phase: g.phase, t: Math.round(S.time) };
};
