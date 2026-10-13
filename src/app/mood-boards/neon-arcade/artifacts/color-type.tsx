import type { CSSProperties } from "react";
import type { Artifact } from "./types";

const display: CSSProperties = { fontFamily: "var(--na-display)" };
const body: CSSProperties = { fontFamily: "var(--na-body)" };
const mono: CSSProperties = { fontFamily: "var(--na-mono)" };

// Soft bloom around a light, built from a palette variable.
function glow(color: string, strength = 1) {
  const c = (pct: number) =>
    `color-mix(in srgb, var(${color}) ${pct * strength}%, transparent)`;
  return `0 0 4px ${c(90)}, 0 0 12px ${c(60)}, 0 0 28px ${c(35)}`;
}

const swatches = [
  { name: "Void", hex: "#05070D", token: "--na-void" },
  { name: "Panel", hex: "#0A1220", token: "--na-panel" },
  { name: "Line", hex: "#1C2F4A", token: "--na-line" },
  { name: "Cyan", hex: "#4DF3FF", token: "--na-cyan" },
  { name: "Ice", hex: "#E6FBFF", token: "--na-ice" },
  { name: "Muted", hex: "#7F9BB3", token: "--na-muted" },
];

function PaletteStrip() {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-0.5 bg-(--na-line) @[15rem]:grid-cols-3">
        {swatches.map((s) => (
          <div key={s.token} className="bg-(--na-void)">
            <div
              className="aspect-square border-b-2 border-(--na-line)"
              style={{ background: `var(${s.token})` }}
              aria-hidden
            />
            <div className="px-2 py-1.5 text-xs leading-tight" style={mono}>
              <div className="text-(--na-ice)">{s.name}</div>
              <div className="text-(--na-muted)">{s.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LightVsRival() {
  return (
    <div
      className="relative flex aspect-[4/3] flex-col justify-center gap-6 bg-(--na-void) px-4"
      style={mono}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs tracking-widest text-(--na-cyan)">LIGHT</span>
        <span
          className="h-0.5 flex-1 rounded-full bg-(--na-ice)"
          style={{ boxShadow: glow("--na-cyan") }}
          aria-hidden
        />
      </div>
      <div className="flex items-center gap-3">
        <span
          className="h-0.5 flex-1 rounded-full bg-(--na-ice)"
          style={{ boxShadow: glow("--na-orange") }}
          aria-hidden
        />
        <span className="text-xs tracking-widest text-(--na-orange)">
          RIVAL
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-(--na-muted)">
        <span
          className="size-2 rounded-full bg-(--na-magenta)"
          style={{ boxShadow: glow("--na-magenta", 0.8) }}
          aria-hidden
        />
        Magenta: the modern twist, used sparingly
      </div>
    </div>
  );
}

function HorizonGlow() {
  return (
    <div
      className="relative aspect-[3/4] overflow-hidden"
      style={{
        background:
          "linear-gradient(to top, var(--na-void) 0%, var(--na-panel) 45%, color-mix(in srgb, var(--na-cyan) 18%, var(--na-panel)) 66%, var(--na-void) 67%)",
      }}
      aria-hidden
    >
      {/* Vertical beam rising to the horizon */}
      <div
        className="absolute bottom-[33%] left-1/2 h-[67%] w-1 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--na-ice) 90%, transparent), transparent)",
          boxShadow: glow("--na-cyan", 0.7),
        }}
      />
      {/* Horizon line */}
      <div
        className="absolute inset-x-0 top-[66%] h-0.5 bg-(--na-ice)"
        style={{ boxShadow: glow("--na-cyan") }}
      />
    </div>
  );
}

function DisplaySpecimen() {
  return (
    <div className="@container bg-(--na-void) px-4 py-6">
      <div
        className="text-[15cqi] leading-[1.05] font-extrabold tracking-wider text-transparent"
        style={{
          ...display,
          WebkitTextStroke: "1.5px var(--na-ice)",
          textShadow: glow("--na-cyan"),
        }}
      >
        LAZY
        <br />
        DONKEY
      </div>
      <div
        className="mt-3 text-xs tracking-widest text-(--na-muted)"
        style={mono}
      >
        OXANIUM 800, OUTLINE + BLOOM
      </div>
    </div>
  );
}

// The modern twist on the 1982 look: the same straight light lines, drawn
// heavier, with corners rounded just enough to feel machined, not sharp.
function SoftCorners() {
  const radii = [
    { px: 4, token: "--na-r-sm" },
    { px: 6, token: "--na-r-md" },
    { px: 10, token: "--na-r-lg" },
  ];
  return (
    <div className="@container bg-(--na-void) px-4 py-6">
      <div
        className="text-[18cqi] leading-none font-bold text-(--na-ice)"
        style={display}
      >
        GAME ON
      </div>
      <div className="mt-5 flex items-end gap-3" aria-hidden>
        {radii.map((r, i) => (
          <div
            key={r.px}
            className="border-2 border-(--na-cyan)"
            style={{
              borderRadius: `var(${r.token})`,
              width: 28 + i * 14,
              height: 28 + i * 14,
              boxShadow: glow("--na-cyan", 0.5),
            }}
          />
        ))}
      </div>
      <div
        className="mt-4 text-xs tracking-widest text-(--na-muted)"
        style={mono}
      >
        2PX LINES · 4 / 6 / 10 CORNERS
      </div>
    </div>
  );
}

function BodySpecimen() {
  return (
    <div className="bg-(--na-void) px-4 py-5" style={body}>
      <div className="text-lg leading-tight font-semibold text-(--na-ice)">
        Light Trails
      </div>
      <p className="mt-2 text-sm leading-relaxed text-(--na-ice)/85">
        Steer your light trail around the grid. Box in your rival, dodge the
        walls. Last one moving wins.
      </p>
      <div
        className="mt-3 text-xs tracking-widest text-(--na-muted)"
        style={mono}
      >
        EXO 2 600 / 400
      </div>
    </div>
  );
}

function HudReadout() {
  const stats = [
    { label: "SCORE", value: "004200" },
    { label: "HI", value: "099990" },
    { label: "LVL", value: "03" },
  ];
  return (
    <div className="bg-(--na-void) p-3" style={mono}>
      <div className="rounded-(--na-r-md) border-2 border-(--na-cyan)/60 px-3 py-2">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          {stats.map((s) => (
            <div key={s.label} className="text-xs tracking-widest">
              <div className="text-(--na-muted)">{s.label}</div>
              <div
                className="text-base text-(--na-cyan)"
                style={{ textShadow: glow("--na-cyan", 0.6) }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 h-0.5 bg-(--na-cyan)/40" aria-hidden />
        <div className="mt-2 flex items-center gap-2 text-xs tracking-widest text-(--na-ice)">
          <span>LIVES</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-4 rounded-xs border-2 border-(--na-cyan)"
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const colorTypeArtifacts: Artifact[] = [
  { id: "color-palette", label: "Core palette", content: <PaletteStrip /> },
  {
    id: "color-light-vs-rival",
    label: "Light vs rival",
    content: <LightVsRival />,
  },
  { id: "color-horizon-glow", label: "Horizon glow", content: <HorizonGlow /> },
  {
    id: "type-display",
    label: "Display: Oxanium",
    content: <DisplaySpecimen />,
  },
  {
    id: "shape-soft-corners",
    label: "Hard lines, soft corners",
    content: <SoftCorners />,
  },
  { id: "type-body", label: "Body: Exo 2", content: <BodySpecimen /> },
  {
    id: "type-hud",
    label: "HUD readout: JetBrains Mono",
    content: <HudReadout />,
  },
];
