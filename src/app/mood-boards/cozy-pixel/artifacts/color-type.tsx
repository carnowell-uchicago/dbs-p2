import type { CSSProperties } from "react";
import { PixelSprite } from "./pixel";
import type { Artifact } from "./types";

const display: CSSProperties = { fontFamily: "var(--cp-display)" };
const label: CSSProperties = { fontFamily: "var(--cp-display)" };
const body: CSSProperties = { fontFamily: "var(--cp-body)" };

// Two-step stair corners, the pixel stand-in for a rounded radius: each corner
// steps in by s, then s again (the same shape as the design system's edge).
function notch(s: number) {
  const a = `${s}px`;
  const b = `${2 * s}px`;
  const r = (v: string) => `calc(100% - ${v})`;
  return `polygon(${[
    `${b} 0`, `${r(b)} 0`, `${r(b)} ${a}`, `${r(a)} ${a}`, `${r(a)} ${b}`, `100% ${b}`,
    `100% ${r(b)}`, `${r(a)} ${r(b)}`, `${r(a)} ${r(a)}`, `${r(b)} ${r(a)}`, `${r(b)} 100%`,
    `${b} 100%`, `${b} ${r(a)}`, `${a} ${r(a)}`, `${a} ${r(b)}`, `0 ${r(b)}`,
    `0 ${b}`, `${a} ${b}`, `${a} ${a}`, `${b} ${a}`,
  ].join(", ")})`;
}

function Swatch({
  name,
  hex,
  color,
}: {
  name: string;
  hex: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        aria-hidden
        className="aspect-square w-full border-2 border-(--cp-text)"
        style={{ background: color }}
      />
      <span
        className="text-[10px] leading-tight text-(--cp-text)"
        style={label}
      >
        {name}
      </span>
      <span
        className="text-[10px] leading-tight text-(--cp-muted)"
        style={label}
      >
        {hex}
      </span>
    </div>
  );
}

function HarvestPalette() {
  return (
    <div className="@container bg-(--cp-surface) p-3">
      {/* Two per row when narrow so the hex codes never touch. */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-3 @[15rem]:grid-cols-3">
        <Swatch name="Bg" hex="#F7ECD6" color="var(--cp-bg)" />
        <Swatch name="Surface" hex="#FFF8EA" color="var(--cp-surface)" />
        <Swatch name="Text" hex="#3B2A20" color="var(--cp-text)" />
        <Swatch name="Muted" hex="#6E5644" color="var(--cp-muted)" />
        <Swatch name="Wood" hex="#8A4A24" color="var(--cp-wood)" />
        <Swatch name="Wood lt" hex="#D9A066" color="var(--cp-wood-light)" />
      </div>
    </div>
  );
}

const sprites = {
  sprout: {
    rows: [
      ".gg.....gg.",
      "gggg...gggg",
      ".gggg.gggg.",
      "...ggggg...",
      ".....g.....",
      ".....g.....",
      "..wwwwwww..",
      ".wwwwwwwww.",
    ],
    colors: { g: "var(--cp-grass)", w: "var(--cp-wood)" },
  },
  pumpkin: {
    rows: [
      "....gg....",
      "....g.....",
      ".oowoowoo.",
      "ooowoowooo",
      "ooowoowooo",
      "ooowoowooo",
      ".oowoowoo.",
      "..oooooo..",
    ],
    colors: {
      g: "var(--cp-grass)",
      o: "var(--cp-pumpkin)",
      w: "var(--cp-wood)",
    },
  },
  cloud: {
    rows: [
      "....kkkk.....",
      "..kkksssskk..",
      ".kksssssssskk",
      "kkkkkkkkkkkkk",
      ".kkkkkkkkkkk.",
    ],
    colors: { k: "var(--cp-sky)", s: "var(--cp-surface)" },
  },
  blossom: {
    rows: [
      ".pp.pp.",
      "ppppppp",
      ".ppypp.",
      "ppppppp",
      ".pp.pp.",
      "...g...",
      "..gg...",
    ],
    colors: { p: "var(--cp-pink)", y: "var(--cp-gold)", g: "var(--cp-grass)" },
  },
  star: {
    rows: [
      "....y....",
      "...yyy...",
      "yyyyyyyyy",
      ".yyyyyyy.",
      "..yyyyy..",
      ".yyw.wyy.",
      "yyw...wyy",
    ],
    colors: { y: "var(--cp-gold)", w: "var(--cp-wood-light)" },
  },
};

function CropColors() {
  const crops = [
    {
      name: "Grass",
      hex: "#6AA84F",
      color: "var(--cp-grass)",
      sprite: sprites.sprout,
    },
    {
      name: "Pumpkin",
      hex: "#F08A24",
      color: "var(--cp-pumpkin)",
      sprite: sprites.pumpkin,
    },
    {
      name: "Sky",
      hex: "#8FD3F4",
      color: "var(--cp-sky)",
      sprite: sprites.cloud,
    },
    {
      name: "Pink",
      hex: "#F4A7B9",
      color: "var(--cp-pink)",
      sprite: sprites.blossom,
    },
    {
      name: "Gold",
      hex: "#F6C945",
      color: "var(--cp-gold)",
      sprite: sprites.star,
    },
  ];
  return (
    <div className="flex flex-col gap-2 bg-(--cp-surface) p-3">
      {crops.map((crop) => (
        <div key={crop.name} className="flex items-center gap-2">
          <div
            aria-hidden
            className="h-8 w-8 shrink-0 border-2 border-(--cp-text)"
            style={{ background: crop.color }}
          />
          <PixelSprite
            rows={crop.sprite.rows}
            colors={crop.sprite.colors}
            className="h-6 w-7 shrink-0"
          />
          <div className="flex min-w-0 flex-col">
            <span
              className="text-[10px] leading-tight text-(--cp-text)"
              style={label}
            >
              {crop.name}
            </span>
            <span
              className="text-[10px] leading-tight text-(--cp-muted)"
              style={label}
            >
              {crop.hex}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Seasons() {
  const seasons = [
    { name: "Spring", sky: "var(--cp-pink)", ground: "var(--cp-grass)" },
    { name: "Summer", sky: "var(--cp-gold)", ground: "var(--cp-sky)" },
    { name: "Fall", sky: "var(--cp-pumpkin)", ground: "var(--cp-wood)" },
    { name: "Winter", sky: "var(--cp-sky)", ground: "var(--cp-surface)" },
  ];
  return (
    <div className="flex flex-col">
      {seasons.map((season) => (
        <div
          key={season.name}
          className="relative flex h-14 items-start p-2"
          style={{ background: season.sky }}
        >
          {/* Stepped ground line along the bottom of each band. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-3"
            style={{
              background: season.ground,
              clipPath:
                "polygon(0 33%, 20% 33%, 20% 0, 45% 0, 45% 33%, 70% 33%, 70% 0, 100% 0, 100% 100%, 0 100%)",
            }}
          />
          <span
            className="relative bg-(--cp-surface) px-1.5 py-0.5 text-[10px] text-(--cp-text)"
            style={label}
          >
            {season.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function DisplaySpecimen() {
  return (
    <div className="@container flex flex-col gap-3 bg-(--cp-surface) p-3">
      <p
        className="text-sm font-bold text-(--cp-text) @[15rem]:text-2xl"
        style={{ ...display, textShadow: "2px 2px 0 var(--cp-wood)" }}
      >
        LazyDonkeyGames
      </p>
      <div className="bg-(--cp-wood) px-3 py-2" style={{ clipPath: notch(4) }}>
        <p
          className="text-2xl leading-none font-bold text-(--cp-gold) @[15rem]:text-5xl"
          style={{ ...display, textShadow: "2px 2px 0 var(--cp-text)" }}
        >
          Harvest Hop
        </p>
      </div>
      <p className="text-[10px] text-(--cp-muted)" style={label}>
        Pixelify Sans 700, 2px hard shadow
      </p>
    </div>
  );
}

function LabelSpecimen() {
  const badges = [
    { text: "NEW", className: "bg-(--cp-wood) text-(--cp-surface)" },
    { text: "LVL 3", className: "bg-(--cp-gold) text-(--cp-text)" },
    { text: "2 PLAYERS", className: "bg-(--cp-sky) text-(--cp-text)" },
    { text: "SEASON 1", className: "bg-(--cp-wood) text-(--cp-surface)" },
  ];
  return (
    <div className="flex flex-col gap-3 bg-(--cp-surface) p-3">
      <div className="flex flex-wrap gap-1.5">
        {badges.map((b) => (
          <span
            key={b.text}
            className={`px-2 py-0.5 text-xs font-medium tracking-[0.06em] ${b.className}`}
            style={{ ...label, clipPath: notch(2) }}
          >
            {b.text}
          </span>
        ))}
      </div>
      <p
        className="text-sm leading-relaxed font-medium tracking-[0.06em] break-all text-(--cp-text)"
        style={label}
      >
        ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
      </p>
      {/* Corners grow with the box: 2, 3, then 4px steps. */}
      <div className="flex items-end gap-2" aria-hidden>
        {[2, 3, 4].map((step) => (
          <div
            key={step}
            className="bg-(--cp-wood)"
            style={{ width: step * 8, height: step * 6, clipPath: notch(step) }}
          />
        ))}
      </div>
      <p className="text-[10px] text-(--cp-muted)" style={label}>
        Pixelify Sans 500 · two-step corners
      </p>
    </div>
  );
}

function BodySpecimen() {
  return (
    <div className="flex flex-col gap-2 bg-(--cp-surface) p-3" style={body}>
      <p className="text-lg font-semibold text-(--cp-text)">
        Five-minute games
      </p>
      <p className="text-sm leading-relaxed text-(--cp-text)">
        Plant a row, wait a day, harvest a high score. Every game here takes
        five minutes and leaves you smiling.
      </p>
      <p className="text-[10px] text-(--cp-muted)" style={label}>
        Lora 600 / 400, 18 / 14px
      </p>
    </div>
  );
}

function WoodAndPaper() {
  const layers = [
    { n: "1", name: "Wood", color: "var(--cp-wood)" },
    { n: "2", name: "Bevel", color: "var(--cp-wood-light)" },
    { n: "3", name: "Paper", color: "var(--cp-surface)" },
  ];
  return (
    <div className="@container flex flex-col gap-3 bg-(--cp-bg) p-3">
      {/* Dialog box anatomy: notched dark wood, light bevel, then paper. */}
      <div className="bg-(--cp-wood) p-1" style={{ clipPath: notch(6) }}>
        <div
          className="bg-(--cp-wood-light) p-1"
          style={{ clipPath: notch(4) }}
        >
          <div
            className="bg-(--cp-surface) px-3 py-3"
            style={{ clipPath: notch(2) }}
          >
            <p className="text-sm font-semibold text-(--cp-text)" style={body}>
              A letter arrived!
            </p>
            <p className="mt-1 text-[10px] text-(--cp-muted)" style={label}>
              Day 3, Spring
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1.5 @[15rem]:grid-cols-3">
        {layers.map((layer) => (
          <div key={layer.name} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-4 w-4 shrink-0 border-2 border-(--cp-text)"
              style={{ background: layer.color }}
            />
            <span className="text-[10px] text-(--cp-text)" style={label}>
              {layer.n} {layer.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const colorTypeArtifacts: Artifact[] = [
  {
    id: "color-harvest",
    label: "Harvest palette",
    content: <HarvestPalette />,
  },
  { id: "color-crops", label: "Crop colors", content: <CropColors /> },
  { id: "color-seasons", label: "Seasons strip", content: <Seasons /> },
  {
    id: "type-display",
    label: "Display: Pixelify Sans",
    content: <DisplaySpecimen />,
  },
  { id: "type-label", label: "Labels and two-step corners", content: <LabelSpecimen /> },
  { id: "type-body", label: "Body: Lora", content: <BodySpecimen /> },
  {
    id: "color-wood-paper",
    label: "Wood and paper",
    content: <WoodAndPaper />,
  },
];
