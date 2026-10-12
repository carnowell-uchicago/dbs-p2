import type { ReactElement } from "react";
import { PixelSprite } from "./pixel";
import type { Artifact } from "./types";

const v = (name: string) => `var(${name})`;
const mix = (a: string, b: string, pct: number) =>
  `color-mix(in srgb, var(${a}), var(${b}) ${pct}%)`;
const shade = (a: string, pct: number) =>
  `color-mix(in srgb, var(${a}), black ${pct}%)`;
const tint = (a: string, pct: number) =>
  `color-mix(in srgb, var(${a}), white ${pct}%)`;

// Deterministic 0–1 noise so scattered pixels land the same on every render.
function noise(x: number, y: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

type Canvas = string[][];

const canvas = (w: number, h: number, fill: string): Canvas =>
  Array.from({ length: h }, () => Array(w).fill(fill));

// Draw a sprite onto a canvas; "." is transparent.
function stamp(c: Canvas, sprite: string[], x: number, y: number) {
  sprite.forEach((row, dy) => {
    [...row].forEach((ch, dx) => {
      const line = c[y + dy];
      if (ch !== "." && line && x + dx >= 0 && x + dx < line.length) {
        line[x + dx] = ch;
      }
    });
  });
}

const rowsOf = (c: Canvas) => c.map((row) => row.join(""));

// Join tiles side by side (all tiles share a height).
const hcat = (...tiles: string[][]) =>
  tiles[0].map((_, i) => tiles.map((tile) => tile[i]).join(""));

// 1. Tilled soil: 16x8 tiles, each a crop row ending in a furrow.
const sprout = [
  "llllllllllllllll",
  "ssssssgsssgsssss",
  "sssssssgsgssssss",
  "ssssssssGsssssss",
  "sssssssshsssssss",
  "ssssssssssssssss",
  "ssssssssssssssss",
  "dddddddddddddddd",
];
const leafy = [
  "llllllllllllllll",
  "sssssgGsGgssssss",
  "ssssssgGgsssssss",
  "sssssssGssssssss",
  "sssssssshsssssss",
  "ssssssssssssssss",
  "ssssssssssssssss",
  "dddddddddddddddd",
];
const pumpkin = [
  "llllllllllllllll",
  "sssssssGgsssssss",
  "sssssoooGooossss",
  "ssssoOooOooOosss",
  "ssssoOooOooOosss",
  "sssssoooooooohss",
  "ssssssshhhhhhsss",
  "dddddddddddddddd",
];
const soilRows = [
  ...hcat(sprout, leafy, sprout),
  ...hcat(leafy, pumpkin, sprout),
  ...hcat(sprout, sprout, leafy),
  ...hcat(leafy, sprout, sprout),
];
const soilColors = {
  l: mix("--cp-wood", "--cp-wood-light", 70),
  s: mix("--cp-wood", "--cp-wood-light", 40),
  h: v("--cp-wood"),
  d: shade("--cp-wood", 25),
  g: v("--cp-grass"),
  G: shade("--cp-grass", 30),
  o: v("--cp-pumpkin"),
  O: shade("--cp-pumpkin", 25),
};

// 2. Grass: scattered two-pixel blades, light flecks, and a few flowers.
const pinkFlower = [".p.", "pyp", ".p."];
const goldFlower = [".y.", "ywy", ".y."];
function grassRows() {
  const c = canvas(48, 32, "g");
  for (let y = 1; y < 32; y++) {
    for (let x = 0; x < 48; x++) {
      const n = noise(x, y);
      if (n < 0.07) {
        c[y][x] = "G";
        c[y - 1][x] = "G";
      } else if (n > 0.95) c[y][x] = "L";
    }
  }
  stamp(c, pinkFlower, 7, 5);
  stamp(c, pinkFlower, 31, 20);
  stamp(c, pinkFlower, 40, 6);
  stamp(c, goldFlower, 19, 12);
  stamp(c, goldFlower, 11, 24);
  stamp(c, goldFlower, 42, 27);
  return rowsOf(c);
}
const grassColors = {
  g: v("--cp-grass"),
  G: shade("--cp-grass", 22),
  L: tint("--cp-grass", 25),
  p: v("--cp-pink"),
  y: v("--cp-gold"),
  w: v("--cp-surface"),
};

// 3. Wood planks: offset joints, nails beside each joint, 3px grain streaks.
function plankRows() {
  const width = 40;
  const plankHeight = 6;
  const joints = [12, 30, 6, 22, 34];
  const rows: string[] = [];
  joints.forEach((joint, p) => {
    for (let r = 0; r < plankHeight; r++) {
      let row = "";
      for (let x = 0; x < width; x++) {
        if (r === plankHeight - 1 || x === joint) row += "D";
        else if (r === 0) row += "l";
        else if (r === 2 && (x === joint - 2 || x === joint + 2)) row += "n";
        else if (noise(Math.floor(x / 3), p * 8 + r) < 0.18) row += "k";
        else row += "w";
      }
      rows.push(row);
    }
  });
  return rows;
}
const plankColors = {
  l: tint("--cp-wood-light", 25),
  w: mix("--cp-wood-light", "--cp-wood", 25),
  k: mix("--cp-wood-light", "--cp-wood", 60),
  D: v("--cp-wood"),
  n: mix("--cp-text", "--cp-surface", 50),
};

// 4. Cross-stitch: a heart in X stitches inside a running-stitch border.
const heart = [
  "..PP...PP..",
  ".PLPP.PPPP.",
  "PLPPPPPPPPP",
  "PPPPPPPPPPP",
  ".PPPPPPPPP.",
  "..PPPPPPP..",
  "...PPPPP...",
  "....PPP....",
  ".....P.....",
];
const CELL = 10;
const COLS = 17;
const ROWS = 15;

function CrossStitch() {
  const stitches: ReactElement[] = [];
  heart.forEach((row, cy) => {
    [...row].forEach((ch, cx) => {
      if (ch === ".") return;
      const x = (cx + 3) * CELL;
      const y = (cy + 3) * CELL;
      const top = ch === "L" ? tint("--cp-pink", 45) : v("--cp-pink");
      stitches.push(
        <g key={`${cx}-${cy}`}>
          <line
            x1={x + 2}
            y1={y + 8}
            x2={x + 8}
            y2={y + 2}
            stroke={shade("--cp-pink", 18)}
          />
          <line x1={x + 2} y1={y + 2} x2={x + 8} y2={y + 8} stroke={top} />
        </g>,
      );
    });
  });
  // Running stitch around the edge: a dash on every other cell.
  for (let i = 1; i < COLS - 1; i += 2) {
    for (const row of [1, ROWS - 2]) {
      const y = row * CELL + CELL / 2;
      stitches.push(
        <line
          key={`h-${i}-${row}`}
          x1={i * CELL + 1}
          y1={y}
          x2={i * CELL + 9}
          y2={y}
          stroke={v("--cp-wood")}
        />,
      );
    }
  }
  for (let i = 3; i < ROWS - 2; i += 2) {
    for (const col of [1, COLS - 2]) {
      const x = col * CELL + CELL / 2;
      stitches.push(
        <line
          key={`v-${i}-${col}`}
          x1={x}
          y1={i * CELL + 1}
          x2={x}
          y2={i * CELL + 9}
          stroke={v("--cp-wood")}
        />,
      );
    }
  }
  return (
    <div
      role="img"
      aria-label="Cross-stitched pink heart on cream aida cloth with a brown running-stitch border"
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
        className="block h-auto w-full"
      >
        <defs>
          <pattern
            id="cp-tex-aida"
            width={CELL}
            height={CELL}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={0}
              cy={0}
              r={1.2}
              fill={mix("--cp-wood-light", "--cp-surface", 40)}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={v("--cp-surface")} />
        <rect width="100%" height="100%" fill="url(#cp-tex-aida)" />
        <g strokeWidth={2.6} strokeLinecap="round">
          {stitches}
        </g>
      </svg>
    </div>
  );
}

// 5. Farm scene: barn, fence, blossom tree, and the donkey mascot.
const sun = ["..uu..", ".uUUu.", "uUUUUu", "uUUUUu", ".uUUu.", "..uu.."];
const cloud = ["...cc....", ".ccccc.cc", "cccccccccc"];
const barn = [
  "......RR......",
  ".....RRRR.....",
  "....RRwwRR....",
  "...RRRRRRRR...",
  "..RRRRRRRRRR..",
  ".RRRRRRRRRRRR.",
  "RRRRRRRRRRRRRR",
  ".bbbbbbbbbbbb.",
  ".bbbwwwwwwbbb.",
  ".bbbwwBBwwbbb.",
  ".bbbwBwwBwbbb.",
  ".bbbwBwwBwbbb.",
  ".bbbwwBBwwbbb.",
  ".bbbwwwwwwbbb.",
];
const canopy = [
  "...eeee...",
  ".eegeeeee.",
  "eegggeepee",
  "eegeeeeeee",
  "epeeeegeee",
  "eeeeeeeepe",
  ".eeeeeeee.",
  "...eeee...",
];
const donkey = [
  "............x.x.",
  "............m.m.",
  "...........xmmm.",
  "...........mxmmm",
  "..........mmmwwx",
  "..xmmmmmmmmmm...",
  ".x.mmmmmmmmmm...",
  ".x.mmmwwwwwmm...",
  "...m.m....m.m...",
  "...x.x....x.x...",
];

function sceneRows() {
  const c = canvas(48, 32, "k");
  for (let x = 0; x < 48; x++) {
    const top = 16 + Math.round(1.5 * Math.sin(x / 6));
    for (let y = top; y < 20; y++) c[y][x] = "h";
  }
  for (let y = 20; y < 32; y++) {
    for (let x = 0; x < 48; x++) {
      c[y][x] = noise(x + 100, y) < 0.1 ? "G" : "g";
    }
  }
  stamp(c, sun, 30, 2);
  stamp(c, cloud, 6, 3);
  stamp(c, canopy, 37, 7);
  for (let y = 15; y < 22; y++) {
    c[y][41] = "T";
    c[y][42] = "T";
  }
  stamp(c, barn, 3, 9);
  for (let x = 17; x < 48; x++) {
    c[22][x] = "f";
    c[24][x] = "f";
  }
  for (let x = 17; x < 48; x += 4) {
    for (let y = 21; y < 25; y++) c[y][x] = "F";
  }
  stamp(c, donkey, 24, 20);
  for (const [x, y, ch] of [
    [20, 27, "p"],
    [44, 30, "p"],
    [10, 26, "p"],
    [14, 29, "u"],
    [46, 26, "u"],
  ] as const) {
    c[y][x] = ch;
  }
  return rowsOf(c);
}
const sceneColors = {
  k: v("--cp-sky"),
  u: v("--cp-gold"),
  U: tint("--cp-gold", 50),
  c: v("--cp-surface"),
  h: mix("--cp-grass", "--cp-sky", 45),
  g: v("--cp-grass"),
  G: shade("--cp-grass", 22),
  e: shade("--cp-grass", 28),
  p: v("--cp-pink"),
  R: mix("--cp-pumpkin", "--cp-wood", 45),
  b: v("--cp-wood"),
  B: shade("--cp-wood", 35),
  w: v("--cp-surface"),
  T: v("--cp-wood"),
  f: v("--cp-wood-light"),
  F: v("--cp-wood"),
  m: v("--cp-muted"),
  x: v("--cp-text"),
};

// 6. Sunset: hard bands joined by ordered (Bayer) dither, sun and hills on top.
const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
function sunsetRows() {
  const bands = ["a", "b", "c", "d"];
  const size = 32;
  const band = size / bands.length;
  const c = canvas(size, size, "a");
  for (let y = 0; y < size; y++) {
    const i = Math.floor(y / band);
    const local = y % band;
    const frac = local < 4 || i === bands.length - 1 ? 0 : (local - 3) / 5;
    for (let x = 0; x < size; x++) {
      const threshold = (bayer[y % 4][x % 4] + 0.5) / 16;
      c[y][x] = frac > threshold ? bands[i + 1] : bands[i];
    }
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((x - 16) ** 2 + (y - 25) ** 2 <= 30) c[y][x] = "u";
      if (y >= 27 + Math.round(1.5 * Math.sin(x / 4))) c[y][x] = "h";
    }
  }
  return rowsOf(c);
}
const sunsetColors = {
  a: v("--cp-sky"),
  b: v("--cp-pink"),
  c: v("--cp-gold"),
  d: v("--cp-pumpkin"),
  u: tint("--cp-gold", 55),
  h: mix("--cp-wood", "--cp-text", 40),
};

function Sprite({
  label,
  rows,
  colors,
}: {
  label: string;
  rows: string[];
  colors: Record<string, string>;
}) {
  return (
    <div role="img" aria-label={label}>
      <PixelSprite
        rows={rows}
        colors={colors}
        className="block h-auto w-full"
      />
    </div>
  );
}

export const textureArtifacts: Artifact[] = [
  {
    id: "texture-soil",
    label: "Tilled soil and crops",
    content: (
      <Sprite
        label="Top-down pixel soil rows with green sprouts and one ripe pumpkin"
        rows={soilRows}
        colors={soilColors}
      />
    ),
  },
  {
    id: "texture-grass",
    label: "Grass with wildflowers",
    content: (
      <Sprite
        label="Pixel grass texture with darker blades and small pink and gold flowers"
        rows={grassRows()}
        colors={grassColors}
      />
    ),
  },
  {
    id: "texture-planks",
    label: "Wood planks",
    content: (
      <Sprite
        label="Pixel wood planks with grain, offset joints and nails"
        rows={plankRows()}
        colors={plankColors}
      />
    ),
  },
  {
    id: "texture-cross-stitch",
    label: "Cross-stitch on aida cloth",
    content: <CrossStitch />,
  },
  {
    id: "texture-farm-scene",
    label: "Pixel farm scene",
    content: (
      <Sprite
        label="Pixel farm: a barn, a fence, a blossom tree, a sun and a small gray-brown donkey on grass"
        rows={sceneRows()}
        colors={sceneColors}
      />
    ),
  },
  {
    id: "texture-dithered-sunset",
    label: "Dithered sunset",
    content: (
      <Sprite
        label="Pixel sunset in hard bands of sky blue, pink, gold and orange joined by dither, with a sun over dark hills"
        rows={sunsetRows()}
        colors={sunsetColors}
      />
    ),
  },
];
