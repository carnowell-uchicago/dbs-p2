import type { CSSProperties } from "react";
import type { Artifact } from "./types";

const display: CSSProperties = { fontFamily: "var(--ct-display)" };
const body: CSSProperties = { fontFamily: "var(--ct-body)" };
const round: CSSProperties = { fontFamily: "var(--ct-round)" };

function Swatch({
  name,
  hex,
  color,
  outlined = false,
  dark = false,
}: {
  name: string;
  hex: string;
  color: string;
  outlined?: boolean;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        aria-hidden
        className={`h-10 rounded-lg ${outlined ? "border border-(--ct-line)" : ""}`}
        style={{ background: color }}
      />
      <div
        className={`text-[11px] leading-tight ${dark ? "text-white" : "text-(--ct-text)"}`}
        style={body}
      >
        <div className="font-semibold">{name}</div>
        <div className={dark ? "text-white/70" : "text-(--ct-muted)"}>
          {hex}
        </div>
      </div>
    </div>
  );
}

function LightPalette() {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-3 bg-(--ct-bg) p-3">
      <Swatch name="Bg" hex="#EBEBEB" color="var(--ct-bg)" outlined />
      <Swatch name="Surface" hex="#FFFFFF" color="var(--ct-surface)" outlined />
      <Swatch name="Text" hex="#2D2D2D" color="var(--ct-text)" />
      <Swatch name="Muted" hex="#5C5C5C" color="var(--ct-muted)" />
      <Swatch name="Line" hex="#D4D4D4" color="var(--ct-line)" />
      <Swatch name="Select" hex="#00C3E3" color="var(--ct-select)" />
    </div>
  );
}

function DarkPalette() {
  return (
    <div className="@container flex flex-col gap-4 bg-(--ct-dark) p-3">
      {/* Two per row when narrow so the hex codes don't collide. */}
      <div className="grid grid-cols-2 gap-2 @[15rem]:grid-cols-4">
        <Swatch name="Dark" hex="#2D2D2D" color="var(--ct-dark)" dark />
        <Swatch name="Tile" hex="#3C3C3C" color="var(--ct-dark-surface)" dark />
        <Swatch name="Text" hex="#FFFFFF" color="#ffffff" dark />
        <Swatch name="Select" hex="#00C3E3" color="var(--ct-select)" dark />
      </div>
      <div aria-hidden className="flex gap-2 overflow-hidden pb-1 pl-1 pt-1">
        <div className="aspect-square w-1/4 shrink-0 rounded-md bg-(--ct-dark-surface) ring-2 ring-(--ct-select) ring-offset-2 ring-offset-(--ct-dark)" />
        <div className="aspect-square w-1/4 shrink-0 rounded-md bg-(--ct-dark-surface)" />
        <div className="aspect-square w-1/4 shrink-0 rounded-md bg-(--ct-dark-surface)" />
        <div className="aspect-square w-1/4 shrink-0 rounded-md bg-(--ct-dark-surface)" />
      </div>
    </div>
  );
}

// Four small face buttons in a diamond around (cx, cy).
function FaceButtons({ cx, cy }: { cx: number; cy: number }) {
  const ink = { fill: "var(--ct-text)" };
  return (
    <>
      <circle cx={cx} cy={cy - 9} r={4} style={ink} />
      <circle cx={cx} cy={cy + 9} r={4} style={ink} />
      <circle cx={cx - 9} cy={cy} r={4} style={ink} />
      <circle cx={cx + 9} cy={cy} r={4} style={ink} />
    </>
  );
}

function ControllerPair() {
  const ink = { fill: "var(--ct-text)" };
  return (
    <div className="flex flex-col items-center gap-3 bg-(--ct-bg) px-3 py-4">
      <svg aria-hidden viewBox="0 0 140 140" className="w-3/4 max-w-48">
        <path
          d="M68 8 H40 A28 28 0 0 0 12 36 V104 A28 28 0 0 0 40 132 H68 Z"
          style={{ fill: "var(--ct-blue)" }}
        />
        <path
          d="M72 8 H100 A28 28 0 0 1 128 36 V104 A28 28 0 0 1 100 132 H72 Z"
          style={{ fill: "var(--ct-red)" }}
        />
        <circle cx={42} cy={44} r={12} style={ink} />
        <FaceButtons cx={42} cy={94} />
        <FaceButtons cx={98} cy={46} />
        <circle cx={98} cy={96} r={12} style={ink} />
      </svg>
      <div
        className="grid w-full grid-cols-2 gap-2 text-center text-[11px] leading-tight text-(--ct-text)"
        style={body}
      >
        <div>
          <div className="font-semibold">Neon blue</div>
          <div className="text-(--ct-muted)">#0AB9E6</div>
        </div>
        <div>
          <div className="font-semibold">Neon red</div>
          <div className="text-(--ct-muted)">#FF3C28</div>
        </div>
      </div>
    </div>
  );
}

function CategoryYellow() {
  return (
    <div className="flex flex-col gap-3 bg-(--ct-bg) p-4" style={body}>
      <div className="flex flex-wrap gap-2">
        <span
          className="rounded-md bg-(--ct-yellow) px-3 py-1 text-sm font-bold text-(--ct-text)"
          style={display}
        >
          Racing
        </span>
        <span
          className="rounded-md bg-(--ct-yellow) px-3 py-1 text-sm font-bold text-(--ct-text)"
          style={display}
        >
          New
        </span>
      </div>
      <div aria-hidden className="flex gap-1.5">
        <div className="aspect-[3/4] flex-1 rounded-sm bg-(--ct-surface)" />
        <div className="aspect-[3/4] flex-1 rounded-sm bg-(--ct-line)" />
        <div className="aspect-[3/4] flex-1 rounded-sm bg-(--ct-surface)" />
        <div className="aspect-[3/4] flex-1 rounded-sm bg-(--ct-line)" />
      </div>
      <p className="text-xs leading-snug text-(--ct-muted)">
        <span className="font-semibold text-(--ct-text)">#FFD400</span> labels a
        shelf of games. Dark text only.
      </p>
    </div>
  );
}

function DisplaySpecimen() {
  return (
    <div className="@container flex flex-col gap-2 bg-(--ct-surface) p-4">
      <div
        className="text-base font-bold tracking-tight text-(--ct-text) @[14rem]:text-xl"
        style={display}
      >
        LazyDonkeyGames
      </div>
      <div
        className="text-4xl leading-none font-bold tracking-tight text-(--ct-text) @[14rem]:text-5xl"
        style={display}
      >
        Grid Runner
      </div>
      <div className="text-[11px] text-(--ct-muted)" style={body}>
        Rubik 700, tight tracking
      </div>
    </div>
  );
}

function BodySpecimen() {
  return (
    <div className="flex flex-col gap-3 bg-(--ct-surface) p-4" style={body}>
      <p className="text-base leading-snug text-(--ct-text)">
        Pick a game, press A, you&rsquo;re playing.
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="text-[13px] font-semibold text-(--ct-text)">
          Recently played
        </div>
        <div className="text-xs font-semibold text-(--ct-muted)">
          Racing · ★ 4.8 · 12K plays
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-(--ct-text)">
          <span
            aria-hidden
            className="flex h-4 w-4 items-center justify-center rounded-full bg-(--ct-text) text-[10px] font-bold text-white"
          >
            A
          </span>
          Play
        </div>
      </div>
      <div className="border-t border-(--ct-line) pt-2 text-[11px] text-(--ct-muted)">
        Figtree · body 16/400 · label 13/600 · hint 12/500
      </div>
    </div>
  );
}

function RoundedSpecimen() {
  return (
    <div className="flex flex-col gap-2 bg-(--ct-surface) p-4">
      <div
        className="text-3xl leading-tight font-extrabold text-(--ct-text)"
        style={round}
      >
        Play together
      </div>
      <div
        className="text-lg font-medium tracking-wide text-(--ct-text)"
        style={round}
      >
        0123456789
      </div>
      <div className="text-[11px] text-(--ct-muted)" style={body}>
        Nunito 800 / 500, the softer option
      </div>
    </div>
  );
}

export const colorTypeArtifacts: Artifact[] = [
  {
    id: "color-light",
    label: "Light theme palette",
    content: <LightPalette />,
  },
  { id: "color-dark", label: "Dark theme palette", content: <DarkPalette /> },
  {
    id: "color-controllers",
    label: "Controller pair",
    content: <ControllerPair />,
  },
  {
    id: "color-category-yellow",
    label: "Category yellow",
    content: <CategoryYellow />,
  },
  {
    id: "type-display",
    label: "Display: Rubik",
    content: <DisplaySpecimen />,
  },
  {
    id: "type-body",
    label: "Body and labels: Figtree",
    content: <BodySpecimen />,
  },
  {
    id: "type-rounded",
    label: "Rounded alt: Nunito",
    content: <RoundedSpecimen />,
  },
];
