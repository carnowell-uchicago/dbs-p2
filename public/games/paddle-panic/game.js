import { createGame } from "../shared/engine.js";
const WIDE = innerWidth > innerHeight * 1.15, W = WIDE ? 640 : 360, H = WIDE ? 360 : 640;
const C = { red: "#ff3c28", blue: "#0ab9e6", dark: "#2d2d2d", surf: "#3c3c3c", white: "#fff", gray: "#d4d4d4" };
const L = WIDE ? W : H, WD = WIDE ? H : W; // sim: x along length, y across
const PX = 26, PL = WIDE ? 64 : 60, PT = 10, BR = 6, WIN = 7;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
let trail = [], pop = null, botOn = false, me, cpu, ball, ps, cs, serve, hits, shake, flash, lead, hist, aim, msg, rally;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const P = (x, y) => (WIDE ? [x, y] : [y, H - x]);

function newServe(dir) {
  ball = { x: L / 2, y: WD / 2, vx: 0, vy: 0, sp: 0, dir };
  serve = 70; trail = []; hits = 0; rally = 0; hist = []; aim = 0;
}
function launch() {
  const sp = 210 + Math.min(ps + cs, 6) * 4, a = (g.rng() - 0.5) * 0.7;
  ball.sp = sp; ball.vx = Math.cos(a) * sp * ball.dir; ball.vy = Math.sin(a) * sp;
}
function point(playerWon) {
  if (playerWon) { ps++; g.score = ps * 100; g.sound("score"); } else { cs++; g.sound("lose"); }
  pop = { t: 50, txt: playerWon ? "POINT!" : "CPU scores", c: playerWon ? C.blue : C.red, r: rally };
  flash = calm ? 0 : 10; shake = calm ? 0 : 6;
  if (ps >= WIN) return g.over("You win " + ps + " - " + cs + "!");
  if (cs >= WIN) return g.over("CPU wins " + cs + " - " + ps);
  newServe(playerWon ? 1 : -1);
}
function hit(p, isMe) {
  const off = clamp((ball.y - p.y) / (PL / 2 + BR), -1, 1);
  const a = off * 1.756 * 0.5 * 1.1 ; // up to ~55 deg
  ball.sp = Math.min(ball.sp * 1.07, 620); hits++; rally++;
  const d = isMe ? 1 : -1;
  ball.vx = Math.cos(a) * ball.sp * d; ball.vy = Math.sin(a) * ball.sp;
  ball.x = isMe ? PX + PT / 2 + BR + 0.5 : L - PX - PT / 2 - BR - 0.5;
  p.kick = calm ? 2 : 6; g.sound(isMe ? "hit" : "click");
  if (!isMe) aim = (g.rng() - 0.5) * 2 * Math.max(10, 34 - 4 * (ps - cs));
}
const g = createGame({
  width: W, height: H, background: C.dark, title: "Paddle Panic",
  help: WIDE ? ["W/S or Up/Down: move", "Or drag the mouse/finger", "First to 7 wins"] : ["Left/Right (or W/S): move", "Or drag anywhere", "First to 7 wins"],
  init(g) {
    me = { y: WD / 2, kick: 0 }; cpu = { y: WD / 2, kick: 0 };
    ps = cs = 0; pop = null; shake = flash = 0; g.score = 0; newServe(1);
  },
  update(g, dt) {
    const k = g.input, ptr = g.input.pointer;
    let dir = (k.down("KeyS") || k.down("ArrowDown") || (!WIDE && k.down("ArrowRight")) ? 1 : 0) - (k.down("KeyW") || k.down("ArrowUp") || (!WIDE && k.down("ArrowLeft")) ? 1 : 0);
    if (dir) me.y += dir * 340 * dt;
    else if (ptr.down) me.y += clamp((WIDE ? ptr.y : ptr.x) - me.y, -600 * dt, 600 * dt);
    me.y = clamp(me.y, PL / 2, WD - PL / 2);
    if (pop) pop.t--; if (pop && pop.t <= 0) pop = null;
    if (botOn) me.y += clamp(ball.y - me.y, -300 * dt, 300 * dt);
    me.kick = Math.max(0, me.kick - 1); cpu.kick = Math.max(0, cpu.kick - 1);
    shake = Math.max(0, shake - 0.5); flash = Math.max(0, flash - 1);
    // CPU
    hist.push(ball.y); const delay = clamp(14 - 2 * (ps - cs), 6, 16);
    const seen = hist.length > delay ? hist[hist.length - 1 - delay] : WD / 2;
    const tgt = ball.vx > 0 ? seen + aim : WD / 2, ms = 190 + 22 * Math.max(0, ps - cs);
    cpu.y = clamp(cpu.y + clamp(tgt - cpu.y, -ms * dt, ms * dt), PL / 2, WD - PL / 2);
    if (hist.length > 40) hist.shift();
    if (serve > 0) { serve--; if (serve === 0) launch(); return; }
    trail.push([ball.x, ball.y]); if (trail.length > Math.round(3 + (ball.sp - 200) / 40)) trail.shift();
    const steps = Math.ceil(ball.sp * dt / 4);
    for (let i = 0; i < steps; i++) {
      ball.x += ball.vx * dt / steps; ball.y += ball.vy * dt / steps;
      if (ball.y < BR) { ball.y = BR; ball.vy = Math.abs(ball.vy); g.sound({ freq: 300, dur: 0.04, type: "square", vol: 0.1 }); }
      if (ball.y > WD - BR) { ball.y = WD - BR; ball.vy = -Math.abs(ball.vy); g.sound({ freq: 300, dur: 0.04, type: "square", vol: 0.1 }); }
      const pxm = PX + PT / 2 + BR, pxc = L - PX - PT / 2 - BR;
      if (ball.vx < 0 && ball.x <= pxm && ball.x > PX - 4 && Math.abs(ball.y - me.y) <= PL / 2 + BR) hit(me, true);
      else if (ball.vx > 0 && ball.x >= pxc && ball.x < L - PX + 4 && Math.abs(ball.y - cpu.y) <= PL / 2 + BR) hit(cpu, false);
      if (ball.x < -BR) return point(false);
      if (ball.x > L + BR) return point(true);
    }
  },
  draw(g, ctx) {
    ctx.fillStyle = C.dark; ctx.fillRect(0, 0, W, H);
    ctx.save();
    if (shake) ctx.translate((g.rng() - 0.5) * shake, (g.rng() - 0.5) * shake);
    ctx.fillStyle = C.surf; // border
    const [fx, fy] = P(L / 2, 0), [tx, ty] = P(L / 2, WD);
    ctx.strokeStyle = C.surf; ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
    // big digits
    ctx.font = `700 ${WIDE ? 96 : 110}px system-ui,sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.55; ctx.fillStyle = C.blue;
    const [a1, a2] = WIDE ? [W * 0.3, H * 0.2] : [W * 0.5, H * 0.74];
    const [b1, b2] = WIDE ? [W * 0.7, H * 0.2] : [W * 0.5, H * 0.26];
    ctx.fillText(ps, a1, a2); ctx.fillStyle = C.red; ctx.fillText(cs, b1, b2); ctx.globalAlpha = 1;
    ctx.font = "700 13px system-ui,sans-serif"; ctx.fillStyle = C.blue; ctx.fillText("YOU", a1, a2 + (WIDE ? 62 : 74));
    ctx.fillStyle = C.red; ctx.fillText("CPU", b1, b2 + (WIDE ? 62 : 74));
    if (Math.max(ps, cs) === WIN - 1 && g.phase === "playing") { ctx.fillStyle = C.gray; ctx.fillText("MATCH POINT", W / 2, WIDE ? 24 : H / 2 - 16); }
    const pad = (p, x, col) => {
      const o = p.kick ? (x < L / 2 ? 2 : -2) : 0;
      const k = p.kick / 6, th = PT + 5 * k, ln = PL - 6 * k, [sx, sy] = P(x + o, p.y), w = WIDE ? th : ln, h = WIDE ? ln : th;
      ctx.fillStyle = k > 0.4 ? C.white : col; ctx.beginPath(); ctx.roundRect(sx - w / 2, sy - h / 2, w, h, 4); ctx.fill();
    };
    pad(me, PX, C.blue); pad(cpu, L - PX, C.red);
    const tc = Math.min(1, (ball.sp - 200) / 300);
    trail.forEach(([x, y], i) => { const [qx, qy] = P(x, y), f = (i + 1) / trail.length; ctx.globalAlpha = 0.45 * f; ctx.fillStyle = tc > 0.5 ? C.red : C.blue; const r = BR * (0.4 + 0.6 * f); ctx.fillRect(qx - r, qy - r, r * 2, r * 2); });
    ctx.globalAlpha = 1;
    const [bx, by] = P(ball.x, ball.y);
    ctx.fillStyle = flash ? C.gray : C.white; ctx.fillRect(bx - BR, by - BR, BR * 2, BR * 2);
    ctx.restore();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (rally >= 3 && serve <= 0) { ctx.fillStyle = C.gray; ctx.font = "700 " + Math.min(26, 14 + rally) + "px system-ui,sans-serif"; ctx.fillText("Rally " + rally, W / 2, WIDE ? H - 22 : H / 2 + 30); }
    if (pop) { const a = Math.min(1, pop.t / 20); ctx.globalAlpha = a; ctx.fillStyle = pop.c; ctx.font = "800 " + (calm ? 26 : 26 + (pop.t > 40 ? 8 : 0)) + "px system-ui,sans-serif"; ctx.fillText(pop.txt, W / 2, H / 2 - (WIDE ? 20 : 50)); if (pop.r >= 5) { ctx.fillStyle = C.gray; ctx.font = "600 14px system-ui,sans-serif"; ctx.fillText("Rally of " + pop.r, W / 2, H / 2 + (WIDE ? 6 : -24)); } ctx.globalAlpha = 1; }
    if (serve > 0 && g.phase === "playing") {
      ctx.fillStyle = C.gray; ctx.font = "600 16px system-ui,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(ps + cs === 0 && serve > 20 ? "Get ready" : "Serve " + Math.ceil(serve / 24), W / 2, H / 2 + (WIDE ? 70 : 80));
    }
    if (ps + cs === 0 && g.frame < 200) { ctx.fillStyle = C.gray; ctx.font = "600 14px system-ui,sans-serif"; ctx.fillText(WIDE ? "W/S or drag - first to 7" : "Drag anywhere or Left/Right - first to 7", W / 2, H - (WIDE ? 14 : 60)); }
  },
});
g.test.keepSeed = true;
g.test.state = () => ({ wide: WIDE, me: me.y, cpu: cpu.y, ball: { x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy, sp: ball.sp }, ps, cs, serve, hits, L, WD });
g.test.set = (o) => { Object.assign(ball, o.ball || {}); if (o.me != null) me.y = o.me; serve = 0; };
g.test.bot = (on) => { botOn = on; };
g.test.point = (w) => point(w);
