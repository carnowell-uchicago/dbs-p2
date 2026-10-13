import { createGame } from "../shared/engine.js";
const W = 360, H = 640, MX = 0, MY = 70, MS = 360;
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surface: "#3c3c3c", white: "#ffffff", gray: "#d4d4d4" };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const STEP = 0.14, DIRS = { l: [-1, 0], r: [1, 0], u: [0, -1], d: [0, 1] };
// on-screen controls
const BTN = { u: [80, 478], d: [80, 574], l: [28, 526], r: [132, 526] }, BS = 52, SW = { x: 288, y: 526, r: 44 };
let s;

function genMaze(g, n) {
  const T = 2 * n + 1, m = [];
  for (let y = 0; y < T; y++) m.push(new Array(T).fill(1));
  const st = [[1, 1]]; m[1][1] = 0;
  while (st.length) {
    const [x, y] = st[st.length - 1], opts = [];
    for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) { const a = x + dx, b = y + dy; if (a > 0 && b > 0 && a < T - 1 && b < T - 1 && m[b][a]) opts.push([dx, dy]); }
    if (!opts.length) { st.pop(); continue; }
    const [dx, dy] = opts[Math.floor(g.rng() * opts.length)];
    m[y + dy / 2][x + dx / 2] = 0; m[y + dy][x + dx] = 0; st.push([x + dx, y + dy]);
  }
  // loops make dodging possible
  for (let i = 0; i < n * 1.5; i++) {
    const x = 1 + Math.floor(g.rng() * (T - 2)), y = 1 + Math.floor(g.rng() * (T - 2));
    if (m[y][x] && (x + y) % 2 === 1 && x > 0 && y > 0 && x < T - 1 && y < T - 1) m[y][x] = 0;
  }
  return m;
}
function bfs(m, sx, sy) {
  const T = m.length, d = m.map((r) => r.map(() => -1)); d[sy][sx] = 0; const q = [[sx, sy]];
  for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [dx, dy] of Object.values(DIRS)) { const a = x + dx, b = y + dy; if (!m[b][a] && d[b][a] < 0) { d[b][a] = d[y][x] + 1; q.push([a, b]); } } }
  return { d, cells: q };
}
function newFloor(g) {
  const n = Math.min(4 + s.floor, 8); s.n = n; s.T = 2 * n + 1; s.ts = MS / s.T;
  s.m = genMaze(g, n);
  const b = bfs(s.m, 1, 1), far = b.cells[b.cells.length - 1]; s.stairs = { x: far[0], y: far[1] };
  const mx = b.d[far[1]][far[0]];
  const mid = b.cells.filter((c) => b.d[c[1]][c[0]] > mx * 0.4 && (c[0] !== far[0] || c[1] !== far[1]));
  const k = mid[Math.floor(g.rng() * mid.length)]; s.key = { x: k[0], y: k[1] }; s.hasKey = false;
  s.px = 1; s.py = 1; s.fx = 1; s.fy = 1; s.cd = 0; s.face = "d";
  s.slimes = []; s.drops = []; s.idle = 0;
  const cand = b.cells.filter((c) => b.d[c[1]][c[0]] > 6 && !(c[0] === far[0] && c[1] === far[1]) && !(c[0] === k[0] && c[1] === k[1]));
  const cnt = Math.min(1 + Math.floor(s.floor * 1.2), 9);
  for (let i = 0; i < cnt && cand.length; i++) { const c = cand.splice(Math.floor(g.rng() * cand.length), 1)[0]; s.slimes.push({ x: c[0], y: c[1], t: 2 + g.rng(), px: c[0], py: c[1], sq: 0 }); }
  s.banner = 2.2; s.bannerTxt = "Floor " + s.floor;
  s.hint = s.floor === 1 ? "Find the key, then the stairs" : "";
}
function init(g) {
  s = { floor: 1, hearts: 3, inv: 0, swing: 0, swCd: 0, shake: 0, flash: 0, parts: [], pop: [], t: 0, q: null, sx: 0, sy: 0, held: null, comboT: 0, combo: 0, hitF: 0, msg: 0, msgTxt: "", banner: 0 };
  newFloor(g);
}
const open = (x, y) => x >= 0 && y >= 0 && x < s.T && y < s.T && !s.m[y][x];
const slimeAt = (x, y) => s.slimes.find((m) => m.x === x && m.y === y);
function burst(x, y, col, n = 8) { if (reduce) n = 3; for (let i = 0; i < n; i++) s.parts.push({ x, y, vx: (Math.random() - .5) * 120, vy: (Math.random() - .5) * 120, t: .4, col }); }
function say(t) { s.msgTxt = t; s.msg = 1.6; }
function hurt(g) {
  if (s.inv > 0) return;
  s.hearts--; s.inv = 1.4; s.shake = reduce ? 0 : .25; s.flash = reduce ? .08 : .2; g.sound("hit");
  if (s.hearts <= 0) g.over("The slimes got you on floor " + s.floor);
}
const cen = (x, y) => [MX + (x + .5) * s.ts, MY + (y + .5) * s.ts];
function inRect(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }
function wantDir(g) {
  const I = g.input;
  if (I.down("ArrowLeft") || I.down("KeyA")) return "l"; if (I.down("ArrowRight") || I.down("KeyD")) return "r";
  if (I.down("ArrowUp") || I.down("KeyW")) return "u"; if (I.down("ArrowDown") || I.down("KeyS")) return "d";
  const p = I.pointer;
  if (p.down) {
    for (const k in BTN) if (inRect(p, BTN[k][0] - 4, BTN[k][1] - 4, BS + 8, BS + 8)) return k;
    if (p.y > MY - 20 && p.y < 460) { // swipe
      if (p.pressed) { s.sx = p.x; s.sy = p.y; }
      const dx = p.x - s.sx, dy = p.y - s.sy;
      if (Math.hypot(dx, dy) > 18) { s.q = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "r" : "l") : (dy > 0 ? "d" : "u"); s.sx = p.x; s.sy = p.y; s.qt = 0.4; }
    }
  }
  if (s.q && s.qt > 0) { const q = s.q; s.q = null; return q; }
  return null;
}
function swing(g) {
  if (s.swCd > 0) return; s.swCd = .35; s.swing = .2; let hit = 0;
  for (let i = s.slimes.length - 1; i >= 0; i--) {
    const m = s.slimes[i];
    if (Math.abs(m.x - s.px) + Math.abs(m.y - s.py) <= 1) { s.slimes.splice(i, 1); hit++; if (s.hearts < 3 && g.rng() < 0.3) s.drops.push({ x: m.x, y: m.y }); s.combo = s.comboT > 0 ? s.combo + 1 : 1; s.comboT = 2.5; const pts = 25 * Math.min(s.combo, 4); g.score += pts; const [cx, cy] = cen(m.x, m.y); burst(cx, cy, C.green, 10); s.pop.push({ x: cx, y: cy, t: .7, txt: "+" + pts + (s.combo > 1 ? " x" + Math.min(s.combo, 4) : "") }); }
  }
  s.hitF = hit ? 1 : 0; g.sound(hit ? "score" : "click");
}
function update(g, dt) {
  s.t += dt; s.idle += dt; s.qt = (s.qt || 0) - dt;
  for (const k of ["inv", "swCd", "swing", "shake", "flash", "msg", "banner", "comboT"]) s[k] = Math.max(0, s[k] - dt);
  const I = g.input, p = I.pointer;
  if (I.pressed("Space") || I.pressed("KeyF") || (p.pressed && Math.hypot(p.x - SW.x, p.y - SW.y) < SW.r + 8)) swing(g);
  s.cd -= dt;
  const d = wantDir(g);
  if (d) { s.face = d; }
  if (d && s.cd <= 0) {
    const [dx, dy] = DIRS[d], nx = s.px + dx, ny = s.py + dy;
    if (open(nx, ny)) {
      s.idle = 0; s.fx = s.px; s.fy = s.py; s.px = nx; s.py = ny; s.cd = STEP;
      if (slimeAt(nx, ny)) hurt(g);
      const di = s.drops.findIndex((d) => d.x === nx && d.y === ny);
      if (di >= 0) { s.drops.splice(di, 1); s.hearts = Math.min(3, s.hearts + 1); g.sound("win"); say("+1 heart"); }
      if (!s.hasKey && nx === s.key.x && ny === s.key.y) { s.hasKey = true; g.score += 50; g.sound("win"); say("Got the key! Find the stairs"); s.hint = ""; }
      if (nx === s.stairs.x && ny === s.stairs.y) {
        if (s.hasKey) {
          g.score += 100 * s.floor; g.sound("win"); s.floor++; if (s.hearts < 3) s.hearts++; newFloor(g); return;
        } else if (s.msg <= 0) { say("Locked. Find the key first"); g.sound("click"); }
      }
    }
  }
  for (const m of s.slimes) {
    m.t -= dt; m.sq = Math.max(0, m.sq - dt);
    if (m.t <= 0) {
      m.t = Math.max(0.95 - 0.07 * s.floor, 0.45) * (0.8 + g.rng() * 0.4);
      const o = Object.values(DIRS).filter(([dx, dy]) => open(m.x + dx, m.y + dy) && !slimeAt(m.x + dx, m.y + dy) && !(m.x + dx === s.stairs.x && m.y + dy === s.stairs.y && false));
      if (o.length) {
        let pick = o[Math.floor(g.rng() * o.length)];
        if (s.floor > 2 && g.rng() < 0.25) { // sometimes lean toward the hero
          pick = o.slice().sort((a, b) => Math.abs(m.x + a[0] - s.px) + Math.abs(m.y + a[1] - s.py) - Math.abs(m.x + b[0] - s.px) - Math.abs(m.y + b[1] - s.py))[0];
        }
        m.px = m.x; m.py = m.y; m.x += pick[0]; m.y += pick[1]; m.sq = .25;
      }
    }
    if (m.x === s.px && m.y === s.py) hurt(g);
  }
  for (const q of s.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.t -= dt; } s.parts = s.parts.filter((q) => q.t > 0);
  for (const q of s.pop) { q.y -= 25 * dt; q.t -= dt; } s.pop = s.pop.filter((q) => q.t > 0);
}
function heart(ctx, x, y, r, full) {
  ctx.fillStyle = full ? C.red : C.surface; ctx.beginPath(); ctx.arc(x - r * .5, y, r * .55, 0, 7); ctx.arc(x + r * .5, y, r * .55, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - r * 1.03, y + r * .2); ctx.lineTo(x + r * 1.03, y + r * .2); ctx.lineTo(x, y + r * 1.25); ctx.fill();
}
function btn(ctx, x, y, w, h, label, down) {
  ctx.fillStyle = down ? C.gray : C.surface; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
  ctx.strokeStyle = C.gray; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = down ? C.dark : C.white; ctx.font = `700 22px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, x + w / 2, y + h / 2 + 1);
}
function draw(g, ctx) {
  ctx.fillStyle = C.dark; ctx.fillRect(0, 0, W, H);
  if (!s) return;
  const ts = s.ts;
  ctx.save();
  if (s.shake > 0) ctx.translate((Math.random() - .5) * 8, (Math.random() - .5) * 8);
  // maze
  ctx.fillStyle = "#242424"; ctx.fillRect(MX, MY, MS, MS);
  ctx.fillStyle = "#292929";
  for (let y = 0; y < s.T; y++) for (let x = 0; x < s.T; x++) if (!s.m[y][x] && (x + y) % 2) ctx.fillRect(MX + x * ts, MY + y * ts, ts + .5, ts + .5);
  for (let y = 0; y < s.T; y++) for (let x = 0; x < s.T; x++) if (s.m[y][x]) {
    ctx.fillStyle = C.surface; ctx.fillRect(MX + x * ts, MY + y * ts, ts + .5, ts + .5);
    ctx.fillStyle = "#333"; ctx.fillRect(MX + x * ts, MY + y * ts + ts / 2 - 1, ts + .5, 1); ctx.fillRect(MX + x * ts + ((x + y) % 2 ? ts * .3 : ts * .7), MY + y * ts, 1, ts / 2);
    if (y + 1 < s.T && !s.m[y + 1][x]) { ctx.fillStyle = "#555"; ctx.fillRect(MX + x * ts, MY + (y + 1) * ts - 3, ts + .5, 3); }
  }
  const px0 = (v) => MX + v * ts, py0 = (v) => MY + v * ts;
  // stairs
  const sx = px0(s.stairs.x), sy = py0(s.stairs.y);
  ctx.fillStyle = s.hasKey ? C.blue : C.gray;
  for (let i = 0; i < 4; i++) ctx.fillRect(sx + 2, sy + 2 + i * (ts - 4) / 4, (ts - 4) * (1 - i * .2), (ts - 4) / 4 - 1);
  if (!s.hasKey) { ctx.fillStyle = C.red; ctx.fillRect(sx + ts * .3, sy + ts * .4, ts * .4, ts * .35); ctx.lineWidth = 2; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.arc(sx + ts * .5, sy + ts * .4, ts * .15, Math.PI, 0); ctx.stroke(); }
  else { ctx.strokeStyle = C.white; ctx.globalAlpha = .5 + .5 * Math.sin(s.t * 6); ctx.lineWidth = 2; ctx.strokeRect(sx + 1, sy + 1, ts - 2, ts - 2); ctx.globalAlpha = 1; }
  // key
  if (!s.hasKey) {
    const [kx, ky] = cen(s.key.x, s.key.y), bob = Math.sin(s.t * 4) * 2;
    ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(kx - ts * .15, ky + bob, ts * .22, 0, 7); ctx.fill();
    ctx.fillRect(kx, ky - 2 + bob, ts * .38, 4); ctx.fillRect(kx + ts * .22, ky + bob, 3, ts * .2);
    ctx.fillStyle = C.dark; ctx.beginPath(); ctx.arc(kx - ts * .15, ky + bob, ts * .08, 0, 7); ctx.fill();
  }
  for (const d of s.drops) { const [dx, dy] = cen(d.x, d.y); heart(ctx, dx, dy - ts * .2 + Math.sin(s.t * 5) * 2, ts * .25, true); }
  if (s.floor > 1 || s.idle > 8) { const tg = s.hasKey ? s.stairs : s.key; if (s.idle > 8) { const [tx, ty] = cen(tg.x, tg.y); ctx.strokeStyle = C.yellow; ctx.lineWidth = 2; ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(tx, ty, ts * (.5 + (s.t * 1.5 % 1) * .6), 0, 7); ctx.stroke(); ctx.globalAlpha = 1; } }
  // slimes
  for (const m of s.slimes) {
    const k = m.sq > 0 ? m.sq / .25 : 0, ix = m.x - (m.x - m.px) * k, iy = m.y - (m.y - m.py) * k;
    const [cx, cy] = cen(ix, iy), r = ts * .38, sq = 1 + Math.sin(s.t * 6 + m.x) * .06;
    ctx.fillStyle = m.t < .3 ? "#8be28f" : C.green; ctx.beginPath(); ctx.ellipse(cx, cy + ts * .08, r * 1.05 / sq, r * .85 * sq, 0, Math.PI, 0); ctx.rect(cx - r * 1.05 / sq, cy + ts * .08, r * 2.1 / sq, ts * .22); ctx.fill();
    ctx.fillStyle = C.white; ctx.fillRect(cx - r * .5, cy - r * .1, r * .35, r * .4); ctx.fillRect(cx + r * .15, cy - r * .1, r * .35, r * .4);
    ctx.fillStyle = C.dark; ctx.fillRect(cx - r * .4, cy + r * .05, r * .18, r * .22); ctx.fillRect(cx + r * .25, cy + r * .05, r * .18, r * .22);
  }
  // hero
  const k = Math.max(0, s.cd / STEP), hx = s.px - (s.px - s.fx) * k, hy = s.py - (s.py - s.fy) * k;
  const [cx, cy] = cen(hx, hy), r = ts * .36;
  if (!(s.inv > 0 && Math.floor(s.t * 14) % 2)) {
    ctx.fillStyle = C.blue; ctx.beginPath(); ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * .4); ctx.fill();
    const [fx, fy] = DIRS[s.face]; ctx.fillStyle = C.white; ctx.fillRect(cx - r * .55 + fx * r * .25, cy - r * .35 + fy * r * .25, r * .4, r * .5); ctx.fillRect(cx + r * .15 + fx * r * .25, cy - r * .35 + fy * r * .25, r * .4, r * .5);
    ctx.fillStyle = C.dark; ctx.fillRect(cx - r * .45 + fx * r * .5, cy - r * .2 + fy * r * .5, r * .2, r * .25); ctx.fillRect(cx + r * .25 + fx * r * .5, cy - r * .2 + fy * r * .5, r * .2, r * .25);
  }
  if (s.swing > 0) { const a = 1 - s.swing / .2; const fa = Math.atan2(DIRS[s.face][1], DIRS[s.face][0]); ctx.strokeStyle = s.hitF ? C.yellow : C.white; ctx.globalAlpha = 1 - a; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, ts * (.6 + a * .4), fa - 1.2 + a * .6, fa + 1.2 + a * .6); ctx.stroke(); ctx.globalAlpha = 1; }
  for (const q of s.parts) { ctx.fillStyle = q.col; ctx.fillRect(q.x - 2, q.y - 2, 4, 4); }
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `700 14px ${FONT}`;
  for (const q of s.pop) { ctx.globalAlpha = Math.min(1, q.t * 2); ctx.fillStyle = C.yellow; ctx.fillText(q.txt, q.x, q.y); ctx.globalAlpha = 1; }
  ctx.restore();
  // HUD
  for (let i = 0; i < 3; i++) heart(ctx, 24 + i * 30, 26, 9, i < s.hearts);
  ctx.textAlign = "left"; ctx.fillStyle = C.white; ctx.font = `700 16px ${FONT}`; ctx.fillText("Floor " + s.floor, 120, 24);
  ctx.fillStyle = C.gray; ctx.font = `14px ${FONT}`; ctx.fillText("Score " + g.score, 120, 44);
  if (s.hasKey) { ctx.fillStyle = C.yellow; ctx.fillRect(210, 20, 14, 8); ctx.beginPath(); ctx.arc(210, 24, 6, 0, 7); ctx.fill(); ctx.fillText("Key", 230, 25); }
  ctx.textAlign = "center"; ctx.font = `700 15px ${FONT}`;
  const msg = s.msg > 0 ? s.msgTxt : s.hint;
  if (msg) { ctx.fillStyle = "rgba(45,45,45,.9)"; ctx.fillRect(10, MY + MS + 6, W - 20, 30); ctx.fillStyle = C.white; ctx.fillText(msg, W / 2, MY + MS + 21); }
  if (s.banner > 0 && s.floor > 1) { ctx.globalAlpha = Math.min(1, s.banner); ctx.fillStyle = C.yellow; ctx.font = `700 22px ${FONT}`; ctx.fillText(s.bannerTxt, W / 2, MY - 16); ctx.globalAlpha = 1; }
  if (s.flash > 0) { ctx.fillStyle = C.red; ctx.globalAlpha = s.flash * 1.5; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  // controls
  const p = g.input.pointer, hold = (k) => p.down && inRect(p, BTN[k][0] - 4, BTN[k][1] - 4, BS + 8, BS + 8);
  btn(ctx, BTN.u[0], BTN.u[1], BS, BS, "▲", hold("u")); btn(ctx, BTN.d[0], BTN.d[1], BS, BS, "▼", hold("d"));
  btn(ctx, BTN.l[0], BTN.l[1], BS, BS, "◀", hold("l")); btn(ctx, BTN.r[0], BTN.r[1], BS, BS, "▶", hold("r"));
  const sd = s.swing > 0 || (p.down && Math.hypot(p.x - SW.x, p.y - SW.y) < SW.r + 8);
  ctx.fillStyle = sd ? C.gray : C.red; ctx.beginPath(); ctx.arc(SW.x, SW.y, SW.r, 0, 7); ctx.fill();
  ctx.strokeStyle = C.white; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = sd ? C.dark : C.white; ctx.font = `700 18px ${FONT}`; ctx.fillText("SWING", SW.x, SW.y);
}
const g = createGame({ width: W, height: H, background: C.dark, init, update, draw, title: "Dungeon Dash",
  help: ["Arrows / D-pad / swipe: move", "Space / SWING: hit adjacent slimes", "Grab the key, reach the stairs", "P: pause"] });
const T = g.test;
T.state = () => ({ floor: s.floor, hearts: s.hearts, hasKey: s.hasKey, px: s.px, py: s.py, stairs: s.stairs, key: s.key, slimes: s.slimes.map((m) => [m.x, m.y]), inv: s.inv });
T.path = () => { // list of arrow codes: to key, then stairs
  const out = []; let from = [s.px, s.py];
  const walk = (to) => { const T_ = s.T, prev = {}, q = [from]; prev[from] = 1;
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [k, [dx, dy]] of Object.entries(DIRS)) { const a = x + dx, b = y + dy; if (open(a, b) && !prev[[a, b]]) { prev[[a, b]] = [x, y, k]; q.push([a, b]); } } }
    const seg = []; let c = to; while (prev[c] !== 1) { const pr = prev[c]; seg.unshift({ l: "ArrowLeft", r: "ArrowRight", u: "ArrowUp", d: "ArrowDown" }[pr[2]]); c = [pr[0], pr[1]]; } out.push(...seg); from = to; };
  if (!s.hasKey) walk([s.key.x, s.key.y]); walk([s.stairs.x, s.stairs.y]); return out;
};
T.clearSlimes = () => { s.slimes = []; };
T.addSlime = (x, y) => { s.slimes.push({ x, y, t: 99, px: x, py: y, sq: 0 }); };
T.open = (x, y) => open(x, y);
T.noInv = () => { s.inv = 0; };
T.drops = () => s.drops.length;
