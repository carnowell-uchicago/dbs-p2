import { createGame } from "../shared/engine.js";
const LAND = innerWidth / innerHeight > 1.15, N = 8, CELL = LAND ? 34 : 38, GX = LAND ? 36 : 28, GY = LAND ? 96 : 104, GX2 = 420, LENS = [5, 4, 3, 3, 2];
const C = { red: "#ff3c28", blue: "#0ab9e6", yellow: "#ffd400", green: "#45b649", dark: "#2d2d2d", surf: "#3c3c3c", white: "#fff", gray: "#d4d4d4" };
const TX = LAND ? 400 : 20, TY = LAND ? 110 : 424, BY = LAND ? 270 : 542;
const trayXY = (k) => [TX + (k % 3) * 110, TY + (k > 2 ? 50 : 0)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
let T = 1; // delay multiplier (tests shrink it)
let my, en, sel, cx, cy, horiz, mode, timer, msg, msgCol, lastP, aiLog, shots, hits, sunkN, kbd, fx, endMsg, lastE, lastM, banner, shake;

const newBoard = () => ({ ships: [], shots: new Array(N * N).fill(0), occ: new Array(N * N).fill(-1) });
const fits = (b, len, c, r, h) => { for (let i = 0; i < len; i++) { const x = c + (h ? i : 0), y = r + (h ? 0 : i); if (x >= N || y >= N || b.occ[y * N + x] >= 0) return false; } return true; };
function addShip(b, len, c, r, h) {
  const cells = []; for (let i = 0; i < len; i++) cells.push([c + (h ? i : 0), r + (h ? 0 : i)]);
  const s = { len, cells, hit: 0, h, slot: -1 }; b.ships.push(s); cells.forEach(([x, y]) => b.occ[y * N + x] = b.ships.length - 1); return s;
}
function removeShip(b, i) { // keeps indices consistent by rebuilding
  const keep = b.ships.filter((_, k) => k !== i); b.ships = []; b.occ.fill(-1);
  keep.forEach((s) => { const n = addShip(b, s.len, s.cells[0][0], s.cells[0][1], s.h); n.slot = s.slot; });
}
function autoFill(g, b, slots) {
  for (const k of slots) { let tries = 0; for (;;) { const h = g.rng() < 0.5, c = (g.rng() * N) | 0, r = (g.rng() * N) | 0; if (fits(b, LENS[k], c, r, h)) { addShip(b, LENS[k], c, r, h).slot = k; break; } if (++tries > 500) break; } }
}
const unplaced = () => LENS.map((_, k) => k).filter((k) => !my.ships.some((s) => s.slot === k));
const alive = (b) => b.ships.filter((s) => s.hit < s.len).length;
function fire(b, c, r) {
  const i = r * N + c; if (b.shots[i]) return null;
  const si = b.occ[i]; b.shots[i] = si >= 0 ? 2 : 1; fx[(b === en ? "e" : "m") + i] = 0;
  if (si < 0) return { hit: false };
  const s = b.ships[si]; s.hit++; return { hit: true, sunk: s.hit === s.len, s };
}
const coord = (c, r) => "ABCDEFGH"[c] + (r + 1);

function aiPick(g) {
  const b = my, free = (c, r) => c >= 0 && r >= 0 && c < N && r < N && !b.shots[r * N + c];
  const hs = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b.shots[r * N + c] === 2 && b.ships[b.occ[r * N + c]].hit < b.ships[b.occ[r * N + c]].len) hs.push([c, r]);
  const pick = (a) => a[(g.rng() * a.length) | 0];
  if (hs.length && g.rng() > 0.12) {
    const line = [];
    for (const [c, r] of hs) for (const [dx, dy] of [[1, 0], [0, 1]]) {
      if (hs.some(([a, d]) => a === c + dx && d === r + dy) && !hs.some(([a, d]) => a === c - dx && d === r - dy)) {
        let x = c, y = r; while (hs.some(([a, d]) => a === x && d === y)) { x += dx; y += dy; }
        if (free(x, y)) line.push([x, y]);
        x = c - dx; y = r - dy; if (free(x, y)) line.push([x, y]);
      }
    }
    if (line.length) return pick(line);
    const nb = []; for (const [c, r] of hs) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (free(c + dx, r + dy)) nb.push([c + dx, r + dy]);
    if (nb.length) return pick(nb);
  }
  const all = [], par = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (free(c, r)) { all.push([c, r]); if ((c + r) % 2 === 0) par.push([c, r]); }
  return pick(par.length && g.rng() > 0.2 ? par : all);
}

createGame({
  width: LAND ? 740 : 360, height: LAND ? 430 : 640, background: C.dark, title: "Pirate Cove",
  help: ["Place your fleet, then fire at the rival's waters", "Tap a square to fire. Keys: arrows + Enter, R rotates", "Sink all 5 rival ships before they sink yours"],
  init(g) {
    my = newBoard(); en = newBoard(); autoFill(g, en, [0, 1, 2, 3, 4]); en.ships.forEach((s) => (s.slot = -1));
    sel = 0; cx = 3; cy = 3; horiz = true; mode = "place"; timer = 0; msg = "Place your 5 ships. Tap the sea to drop one."; msgCol = C.white;
    lastP = [-1, -1]; aiLog = []; shots = hits = sunkN = 0; kbd = false; fx = {}; endMsg = ""; lastE = lastM = null; banner = null; shake = 0; g.score = 0;
    Object.assign(g.test, {
      state: () => ({ mode, placed: my.ships.length, sel, horiz, shots, hits, sunk: sunkN, mine: alive(my), rival: alive(en), ai: aiLog.slice(), cx, cy }),
      enemyCells: () => en.ships.flatMap((s) => s.cells), myCells: () => my.ships.flatMap((s) => s.cells),
      cellPos: (c, r) => [GX + c * CELL + CELL / 2, GY + r * CELL + CELL / 2],
      btnPos: (k) => [TX + k * 110 + 50, BY + 24], size: () => LAND ? [740, 430] : [360, 640], fast: (v) => { T = v; }, keepSeed: false, // real play: fresh seed each round; tests pin it
    });
  },
  update(g) {
    const P = g.input.pointer, key = (k) => g.input.pressed(k);
    if (P.x !== lastP[0] || P.y !== lastP[1]) {
      lastP = [P.x, P.y]; const c = Math.floor((P.x - GX) / CELL), r = Math.floor((P.y - GY) / CELL);
      if (c >= 0 && r >= 0 && c < N && r < N) { cx = c; cy = r; kbd = false; }
    }
    for (const [k, dx, dy] of [["ArrowLeft", -1, 0], ["ArrowRight", 1, 0], ["ArrowUp", 0, -1], ["ArrowDown", 0, 1]]) if (key(k)) { cx = Math.max(0, Math.min(N - 1, cx + dx)); cy = Math.max(0, Math.min(N - 1, cy + dy)); kbd = true; }
    const tapCell = P.pressed ? [Math.floor((P.x - GX) / CELL), Math.floor((P.y - GY) / CELL)] : null;
    const tc = tapCell && tapCell[0] >= 0 && tapCell[1] >= 0 && tapCell[0] < N && tapCell[1] < N ? tapCell : null;
    const act = tc || (key("Enter") || key("Space") ? [cx, cy] : null);
    const btn = P.pressed && P.y >= BY && P.y <= BY + 48 ? Math.floor((P.x - TX) / 110) : -1;
    const inBtn = btn >= 0 && btn < 3 && (P.x - TX) % 110 < 100;
    if (mode === "place") {
      const rot = key("KeyR") || (inBtn && btn === 0), auto = key("KeyA") || (inBtn && btn === 1);
            if (rot) { horiz = !horiz; g.sound("click"); }
      if (auto) { my = newBoard(); autoFill(g, my, [0, 1, 2, 3, 4]); sel = 0; g.sound("click"); msg = "Fleet placed. Press Start, or Auto again."; }
const go = (inBtn && btn === 2) || ((key("Enter") || key("Space")) && !unplaced().length && !tc);
      if (key("Backspace") && my.ships.length) { const k = my.ships[my.ships.length - 1].slot; removeShip(my, my.ships.length - 1); sel = k; }
      if (tapCell && !tc && P.y >= TY && P.y < TY + 96) { // tray: pick a ship to (re)place
        const k = Math.floor((P.x - TX) / 110) + (P.y >= TY + 50 ? 3 : 0); if (k >= 0 && k < 5 && (P.x - TX) % 110 < 100) { const i = my.ships.findIndex((s) => s.slot === k); if (i >= 0) removeShip(my, i); sel = k; }
      }
      if (go && !(inBtn && btn === 2 && unplaced().length)) { if (!unplaced().length) { mode = "player"; msg = "Your turn. Tap a rival square to fire!"; msgCol = C.yellow; g.sound("click"); return; } }
      if (act && !(go && !tc)) {
        const [c, r] = act, oi = my.occ[r * N + c];
        if (oi >= 0) { sel = my.ships[oi].slot; removeShip(my, oi); g.sound("click"); }
        else if (unplaced().length) {
          if (!unplaced().includes(sel)) sel = unplaced()[0];
          const len = LENS[sel], pc = horiz ? Math.min(c, N - len) : c, pr = horiz ? r : Math.min(r, N - len);
          if (fits(my, len, pc, pr, horiz)) { addShip(my, len, pc, pr, horiz).slot = sel; g.sound("click"); const u = unplaced(); if (u.length) sel = u[0]; else msg = "All placed. Press Start to sail!"; }
          else { msg = "No room there. Rotate or pick another spot."; g.sound({ freq: 150, dur: 0.08, type: "square", vol: 0.1 }); }
        }
      }
    } else if (mode === "player") {
      if (act) {
        const [c, r] = act, res = fire(en, c, r);
        if (!res) { msg = "Already fired at " + coord(c, r) + ". Pick another."; msgCol = C.gray; return; }
        shots++; lastE = [c, r]; mode = "w1"; timer = 0.75 * T;
        if (res.hit) { hits++; g.score += 10; msg = res.sunk ? "You sank a ship of length " + res.s.len + "!" : "Hit at " + coord(c, r) + "!"; msgCol = C.red; g.sound(res.sunk ? "score" : "hit"); if (res.sunk) { sunkN++; g.score += 40; banner = { t: "SUNK!", col: C.yellow, n: 70 }; shake = reduce ? 0 : 12; } else banner = { t: "HIT!", col: C.red, n: 40 }; }
        else { banner = { t: "Splash", col: C.white, n: 30 }; msg = "Splash. Miss at " + coord(c, r) + "."; msgCol = C.gray; g.sound({ freq: 220, dur: 0.1, type: "sine", vol: 0.1, slide: -80 }); }
        if (!alive(en)) { mode = "end"; timer = 1.3 * T; g.score += 20 * (64 - shots > 0 ? 1 : 0) + alive(my) * 25 + my.ships.reduce((a, s) => a + s.len - s.hit, 0) * 5; endMsg = "Victory! Rival fleet sunk"; g.sound("win"); }
      }
    } else if (mode === "w1") { if ((timer -= 1 / 60) <= 0) { mode = "ai1"; timer = 0.7 * T; msg = "Rival is aiming"; msgCol = C.gray; } }
    else if (mode === "ai1") {
      if ((timer -= 1 / 60) <= 0) {
        const [c, r] = aiPick(g), res = fire(my, c, r); aiLog.push({ c, r, hit: res.hit }); lastM = [c, r]; banner = res.hit ? { mine: 1, t: res.sunk ? "SHIP LOST!" : "You're hit!", col: C.red, n: res.sunk ? 70 : 40 } : { mine: 1, t: "Rival missed", col: C.white, n: 30 }; if (res.sunk) shake = reduce ? 0 : 12; mode = "ai2"; timer = 0.95 * T;
        if (res.hit) { msg = res.sunk ? "Rival sank your ship of length " + res.s.len + "!" : "Rival hit you at " + coord(c, r) + "!"; msgCol = C.red; g.sound("hit"); } else { msg = "Rival missed at " + coord(c, r) + "."; msgCol = C.gray; }
        if (!alive(my)) { mode = "end"; timer = 1.3 * T; endMsg = "Your fleet was sunk"; g.sound("lose"); }
      }
    } else if (mode === "ai2") { if ((timer -= 1 / 60) <= 0) { mode = "player"; msg = "Your turn. Fire at a rival square."; msgCol = C.yellow; } }
    else if (mode === "end") { if ((timer -= 1 / 60) <= 0) g.over(endMsg); }
    for (const k in fx) fx[k]++;
    if (banner && --banner.n <= 0) banner = null; if (shake > 0) shake -= 0.5;
  },
  draw(g, ctx) {
    const mineView = mode === "place" || mode === "ai1" || mode === "ai2" || (mode === "end" && endMsg.startsWith("Your"));
    ctx.save(); if (shake > 0 && g.canShake) ctx.translate(Math.sin(g.frame * 2.1) * shake * 0.4, Math.cos(g.frame * 1.7) * shake * 0.3);
    const mv = LAND ? mode === "place" : mineView, board = mv ? my : en, small = mv ? en : my;
    ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
    const text = (s, x, y, size, col, bold, al) => { ctx.font = `${bold ? "700 " : ""}${Math.max(size, 12 / g.scale)}px ${FONT}`; ctx.fillStyle = col; ctx.textAlign = al || "left"; ctx.fillText(s, x, y); };
    const title = mode === "place" ? "Deploy your fleet" : mineView ? "Rival's turn" : "Your turn";
    text(title, 16, 28, 20, C.white, true); text(msg + (mode === "ai1" ? ".".repeat(1 + ((g.frame / 14) | 0) % 3) : ""), 16, 50, 12, msgCol);
    text(mv ? "YOUR WATERS" : "RIVAL WATERS", GX, LAND ? 68 : 80, 12, mv ? C.green : C.yellow, true);
    // grid
    drawBoard(ctx, text, board, GX, GY, CELL, !mv, true);
    const mark2 = (lk, gx) => { if (lk && mode !== "place") { const pu = reduce ? 1 : 0.6 + 0.4 * Math.sin(g.frame / 6); ctx.strokeStyle = C.yellow; ctx.globalAlpha = pu; ctx.lineWidth = 3; ctx.strokeRect(gx + lk[0] * CELL + 2, GY + lk[1] * CELL + 2, CELL - 4, CELL - 4); ctx.globalAlpha = 1; } };
    mark2(mv ? lastM : lastE, GX);
    if (LAND && mode !== "place") {
      text("YOUR WATERS", GX2, 68, 12, C.green, true); drawBoard(ctx, text, my, GX2, GY, CELL, false, true); mark2(lastM, GX2);
      if (mode === "ai1" || mode === "ai2") { ctx.strokeStyle = C.yellow; ctx.lineWidth = 3; ctx.strokeRect(GX2 - 4, GY - 4, CELL * N + 8, CELL * N + 8); }
    }
    if (!(mode === "end") && (mode === "place" || mode === "player")) {
      const x = GX + cx * CELL, y = GY + cy * CELL;
      if (mode === "place" && unplaced().length) {
        const len = LENS[unplaced().includes(sel) ? sel : unplaced()[0]], pc = horiz ? Math.min(cx, N - len) : cx, pr = horiz ? cy : Math.min(cy, N - len), ok = fits(my, len, pc, pr, horiz) && my.occ[cy * N + cx] < 0;
        ctx.fillStyle = ok ? "rgba(69,182,73,.65)" : "rgba(255,60,40,.55)";
        for (let i = 0; i < len; i++) ctx.fillRect(GX + (pc + (horiz ? i : 0)) * CELL + 2, GY + (pr + (horiz ? 0 : i)) * CELL + 2, CELL - 4, CELL - 4);
      }
      if (kbd || mode === "player" || mode === "place") { ctx.strokeStyle = C.yellow; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3); }
    }
    if (mode === "place") {
      for (let k = 0; k < 5; k++) {
        const [x, y] = trayXY(k), placed = my.ships.some((s) => s.slot === k);
        ctx.fillStyle = k === sel && !placed ? C.surf : C.dark; ctx.fillRect(x, y, 100, 44);
        ctx.strokeStyle = k === sel && !placed ? C.yellow : "#666"; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, 98, 42);
        ctx.fillStyle = placed ? C.green : C.gray; for (let i = 0; i < LENS[k]; i++) ctx.fillRect(x + 8 + i * 14, y + 14, 12, 16);
        if (placed) text("✓", x + 82, y + 28, 14, C.green, true, "center");
      }
      const done = !unplaced().length;
      button(ctx, text, TX, BY, "Rotate (R)", true); button(ctx, text, TX + 110, BY, "Auto (A)", true); button(ctx, text, TX + 220, BY, "Start", done, done);
      text(horiz ? "Direction: across" : "Direction: down", TX, BY + 78, 12, C.gray);
      text("Tap a placed ship to move it", LAND ? TX : 340, BY + (LAND ? 100 : 78), 12, C.gray, false, LAND ? "left" : "right");
    } else if (LAND) {
      const by = GY + CELL * N + 22;
      text("Rival ships left", GX, by, 12, C.gray); pips(ctx, GX + 104, by - 10, en);
      text("Your ships left", GX2, by, 12, C.gray); pips(ctx, GX2 + 100, by - 10, my);
      text("Shots " + shots + "   Hits " + hits + "   Sunk " + sunkN, GX, by + 24, 12, C.gray);
      legend(ctx, text, GX2, by + 24);
      if (mode === "player" && shots === 0) text("Tap or press Enter on a square to fire", GX + CELL * N / 2, GY - 24, 12, C.yellow, true, "center");
    } else {
      // preview of the other grid + fleet status
      text(mineView ? "RIVAL (HIDDEN)" : "YOUR FLEET", 20, 428, 12, C.gray, true);
      drawBoard(ctx, text, small, 20, 436, 12, small === en, false);
      text("Rival ships left", 140, 452, 12, C.gray); pips(ctx, 140, 458, en);
      text("Your ships left", 140, 500, 12, C.gray); pips(ctx, 140, 506, my);
      text("Shots " + shots + "   Hits " + hits + "   Sunk " + sunkN, 20, 562, 12, C.gray);
      legend(ctx, text, 20, 600);
      if (mode === "player" && shots === 0) text("Tap or press Enter on a square to fire", 180, 626, 12, C.yellow, true, "center");
    }
    if (banner) { const a = Math.min(1, banner.n / 15); ctx.globalAlpha = a * 0.92; ctx.fillStyle = C.dark; const bl = banner.mine ? lastM : lastE, by = bl && bl[1] < 4 ? GY + CELL * 5 + 10 : GY + CELL + 10; const bx = LAND && banner.mine ? GX2 : GX; ctx.fillRect(bx, by, CELL * N, 48); ctx.globalAlpha = a; text(banner.t, bx + CELL * N / 2, by + 34, 30, banner.col, true, "center"); ctx.globalAlpha = 1; }
    ctx.restore();
  },
});

function button(ctx, text, x, y, label, on, accent) {
  ctx.fillStyle = on ? (accent ? C.red : C.surf) : "#333"; ctx.fillRect(x, y, 100, 48);
  ctx.strokeStyle = on ? C.white : "#555"; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, 98, 46);
  text(label, x + 50, y + 29, 14, on ? C.white : "#777", true, "center");
}
function pips(ctx, x, y, b) {
  let px = x; for (const len of LENS) {
    const s = b.ships.find((q) => q.len === len && !q.dn && (q.dn = true) && true);
    const sunk = s && s.hit >= s.len; for (let i = 0; i < len; i++) { ctx.fillStyle = sunk ? C.red : C.gray; ctx.fillRect(px + i * 6, y, 5, 10); } px += len * 6 + 8;
  }
  b.ships.forEach((q) => (q.dn = false));
}
function mark(ctx, x, y, r, col) { // hit: red disc with white X
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = C.white; ctx.lineWidth = Math.max(1.5, r / 4); const d = r * 0.5; ctx.beginPath(); ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke();
}
function drawBoard(ctx, text, b, gx, gy, cs, hidden, labels) {
  ctx.fillStyle = C.blue; ctx.fillRect(gx, gy, cs * N, cs * N);
  ctx.fillStyle = "rgba(255,255,255,.12)"; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if ((c + r) % 2) ctx.fillRect(gx + c * cs, gy + r * cs, cs, cs);
  // ships (own always; rival only when sunk)
  for (const s of b.ships) {
    const sunk = s.hit >= s.len; if (hidden && !sunk) continue;
    const [c, r] = s.cells[0], w = s.h ? s.len * cs : cs, h = s.h ? cs : s.len * cs, p = Math.max(1.5, cs * 0.12);
    ctx.fillStyle = sunk ? "#555" : C.dark; ctx.beginPath(); ctx.roundRect(gx + c * cs + p, gy + r * cs + p, w - 2 * p, h - 2 * p, cs * 0.35); ctx.fill();
    ctx.strokeStyle = sunk ? C.yellow : C.white; ctx.lineWidth = cs > 20 ? 2 : 1; ctx.stroke();
    if (cs > 20) { ctx.fillStyle = C.gray; for (const [x, y] of s.cells) { ctx.beginPath(); ctx.arc(gx + x * cs + cs / 2, gy + y * cs + cs / 2, 4, 0, 7); ctx.fill(); } }
  }
  ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i <= N; i++) { ctx.moveTo(gx + i * cs, gy); ctx.lineTo(gx + i * cs, gy + N * cs); ctx.moveTo(gx, gy + i * cs); ctx.lineTo(gx + N * cs, gy + i * cs); } ctx.stroke();
  ctx.strokeStyle = C.white; ctx.lineWidth = 2; ctx.strokeRect(gx, gy, cs * N, cs * N);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const v = b.shots[r * N + c]; if (!v) continue;
    const k = (hidden ? "e" : "m") + (r * N + c), a = !reduce && fx[k] !== undefined && fx[k] < 12 ? 1 + (12 - fx[k]) / 14 : 1, x = gx + c * cs + cs / 2, y = gy + r * cs + cs / 2;
    if (v === 1) { ctx.strokeStyle = C.white; ctx.lineWidth = cs > 20 ? 2.5 : 1.5; ctx.beginPath(); ctx.arc(x, y, cs * 0.22 * a, 0, 7); ctx.stroke(); }
    else mark(ctx, x, y, cs * 0.34 * a, C.red);
  }
  if (labels) { for (let i = 0; i < N; i++) { text("ABCDEFGH"[i], gx + i * cs + cs / 2, gy - 6, 12, C.gray, false, "center"); text(String(i + 1), gx - 6, gy + i * cs + cs / 2 + 4, 12, C.gray, false, "right"); } }
}

function legend(ctx, text, x, ly) {
  ctx.lineWidth = 2; ctx.strokeStyle = C.white; ctx.beginPath(); ctx.arc(x + 10, ly - 4, 6, 0, 7); ctx.stroke(); text("Miss", x + 22, ly, 12, C.gray);
  mark(ctx, x + 84, ly - 4, 8, C.red); text("Hit", x + 98, ly, 12, C.gray);
  ctx.strokeStyle = C.yellow; ctx.strokeRect(x + 145, ly - 12, 18, 16); mark(ctx, x + 154, ly - 4, 6, C.red); text("Sunk (outlined)", x + 170, ly, 12, C.gray);
}
