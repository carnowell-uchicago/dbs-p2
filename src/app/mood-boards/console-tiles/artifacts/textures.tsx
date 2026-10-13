import type { CSSProperties, ReactNode } from "react";
import type { Artifact } from "./types";

const body: CSSProperties = { fontFamily: "var(--ct-body)" };

// Black shadows: on charcoal, anything lighter glows instead of lifting.
const shade = (pct: number) => `color-mix(in srgb, black ${pct}%, transparent)`;

// A background-colored gap between the tile and the cyan ring, like the home
// screen cursor. Cyan is 6.5:1 on charcoal, so no dark edge is needed.
const selectRing = "0 0 0 3px var(--ct-bg), 0 0 0 6px var(--ct-select)";

function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold text-(--ct-muted)" style={body}>
      {children}
    </span>
  );
}

// Original cover art: one bold shape on a flat or gradient field.
const covers: { bg: string; art: ReactNode }[] = [
  {
    bg: "linear-gradient(135deg, var(--ct-red), var(--ct-yellow))",
    art: <circle cx="50" cy="55" r="22" fill="var(--ct-text)" />,
  },
  {
    bg: "linear-gradient(160deg, var(--ct-blue), color-mix(in srgb, var(--ct-blue) 25%, black))",
    art: <path d="M28 72 L50 26 L72 72 Z" fill="var(--ct-text)" />,
  },
  {
    bg: "var(--ct-yellow)",
    art: (
      <path
        d="M18 62 L34 42 L50 62 L66 42 L82 62"
        fill="none"
        stroke="var(--ct-ink)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    bg: "var(--ct-surface)",
    art: (
      <g fill="var(--ct-select)">
        <circle cx="34" cy="38" r="7" />
        <circle cx="62" cy="34" r="5" />
        <circle cx="50" cy="62" r="9" />
      </g>
    ),
  },
];

function TileRow() {
  return (
    <div
      role="img"
      aria-label="A row of large square game tiles running off the right edge, the second one selected with a cyan ring"
      className="relative aspect-[4/3] overflow-hidden bg-(--ct-bg)"
    >
      <div
        aria-hidden
        className="absolute left-[7%] top-[22%] flex w-[180%] gap-[3%]"
      >
        {covers.map((cover, i) => (
          <div
            key={i}
            className="aspect-square w-[22%] shrink-0 overflow-hidden rounded-[6px]"
            style={{
              background: cover.bg,
              boxShadow: i === 1 ? selectRing : `0 2px 6px ${shade(35)}`,
            }}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {cover.art}
            </svg>
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="absolute bottom-[10%] left-1/2 flex -translate-x-1/2 gap-[6px]"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-[10px] w-[10px] rounded-full"
            style={{
              background: i === 0 ? "var(--ct-red)" : "var(--ct-control)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RadiusScale() {
  const radii: [string, string][] = [
    ["4", "4px"],
    ["8", "8px"],
    ["16", "16px"],
    ["28", "28px"],
    ["full", "9999px"],
  ];
  return (
    <div
      role="img"
      aria-label="Corner radius scale: the same square at 4, 8, 16, 28 pixels and fully round"
      className="bg-(--ct-bg) px-3 py-5"
    >
      <div aria-hidden className="grid grid-cols-5 items-end gap-2">
        {radii.map(([name, value]) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div
              className="aspect-square w-full bg-(--ct-surface)"
              style={{
                borderRadius: value === "9999px" ? value : `min(${value}, 40%)`,
                boxShadow: `0 2px 6px ${shade(35)}`,
              }}
            />
            <Caption>{name}</Caption>
          </div>
        ))}
      </div>
    </div>
  );
}

function Elevation() {
  const levels = [
    { name: "Rest", lift: 0, shadow: `0 0 0 1px var(--ct-line)` },
    {
      name: "Raised",
      lift: 4,
      shadow: `0 2px 4px ${shade(25)}, 0 4px 12px ${shade(30)}`,
    },
    {
      name: "Lifted",
      lift: 10,
      shadow: `0 6px 12px ${shade(25)}, 0 16px 32px ${shade(45)}`,
    },
  ];
  return (
    <div
      role="img"
      aria-label="Elevation: three gray cards at rest, raised with a soft shadow, and lifted with a larger, deeper shadow"
      className="bg-(--ct-bg) px-3 pb-4 pt-8"
    >
      <div aria-hidden className="grid grid-cols-3 items-end gap-3">
        {levels.map((level) => (
          <div key={level.name} className="flex flex-col items-center gap-2">
            <div
              className="aspect-[3/4] w-full rounded-[12px] bg-(--ct-surface)"
              style={{
                boxShadow: level.shadow,
                transform: `translateY(-${level.lift}px)`,
              }}
            />
            <Caption>{level.name}</Caption>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple line glyphs on a 24-unit grid.
const glyphs: { name: string; path: ReactNode }[] = [
  {
    name: "News",
    path: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M8 9h8M8 12h8M8 15h5" />
      </>
    ),
  },
  {
    name: "Shop",
    path: (
      <>
        <path d="M6 9h12l-1 10H7z" />
        <path d="M9 9a3 3 0 0 1 6 0" />
      </>
    ),
  },
  {
    name: "Album",
    path: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M6 16l4-4 3 3 2-2 3 3" />
      </>
    ),
  },
  {
    name: "Controllers",
    path: (
      <>
        <rect x="5" y="5" width="6" height="14" rx="3" />
        <rect x="13" y="5" width="6" height="14" rx="3" />
      </>
    ),
  },
  {
    name: "Settings",
    path: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" />
      </>
    ),
  },
  {
    name: "Power",
    path: (
      <>
        <path d="M8 7.5a6 6 0 1 0 8 0" />
        <path d="M12 4v7" />
      </>
    ),
  },
];

function IconButtons() {
  return (
    <div
      role="img"
      aria-label="Round gray icon buttons for news, shop, album, controllers, settings and power; the first is neon red"
      className="@container bg-(--ct-bg) px-3 py-5"
    >
      <div
        aria-hidden
        className="grid grid-cols-3 justify-items-center gap-3 @[16rem]:grid-cols-6 @[16rem]:gap-2"
      >
        {glyphs.map((glyph, i) => {
          const red = i === 0;
          return (
            <span
              key={glyph.name}
              className="flex aspect-square w-10 items-center justify-center rounded-full"
              style={{
                background: red ? "var(--ct-red)" : "var(--ct-surface)",
                boxShadow: `0 2px 6px ${shade(35)}`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="var(--ct-text)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {glyph.path}
              </svg>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function DotGrid() {
  // Cells sit on the 24px dot grid so they line up at any tile width.
  const cells = [
    { x: 24, y: 24, selected: false },
    { x: 72, y: 24, selected: true },
    { x: 24, y: 72, selected: false },
  ];
  return (
    <div
      role="img"
      aria-label="Soft dot grid on charcoal with three rounded gray cells, one selected with a cyan ring"
      className="relative aspect-square overflow-hidden bg-(--ct-bg)"
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--ct-line) 1.5px, transparent 1.6px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "12px 12px",
      }}
    >
      {cells.map((cell) => (
        <span
          key={`${cell.x}-${cell.y}`}
          aria-hidden
          className="absolute h-[40px] w-[40px] rounded-[10px] bg-(--ct-surface)"
          style={{
            left: cell.x + 4,
            top: cell.y + 4,
            boxShadow: cell.selected ? selectRing : `0 2px 6px ${shade(35)}`,
          }}
        />
      ))}
    </div>
  );
}

function Handheld() {
  const miniTiles = [
    "var(--ct-red)",
    "var(--ct-blue)",
    "var(--ct-yellow)",
    "var(--ct-text)",
  ];
  const knob = `color-mix(in srgb, var(--ct-bg) 70%, white)`;
  return (
    <div
      role="img"
      aria-label="Handheld silhouette: a dark glass screen with a tiny tile row, a neon blue left end and a neon red right end"
      className="flex aspect-[16/9] items-center justify-center bg-(--ct-bg)"
    >
      <div
        aria-hidden
        className="flex aspect-[2.6/1] w-[88%]"
        style={{ filter: `drop-shadow(0 6px 10px ${shade(50)})` }}
      >
        <div className="flex w-[16%] flex-col items-center justify-around rounded-l-full bg-(--ct-blue) py-[6%] pl-[3%]">
          <span
            className="aspect-square w-[42%] rounded-full"
            style={{ background: knob }}
          />
          <span className="grid w-[40%] grid-cols-2 gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="aspect-square rounded-full"
                style={{ background: knob }}
              />
            ))}
          </span>
        </div>
        <div className="flex flex-1 items-center bg-black px-[3%] py-[5%]">
          <div className="flex h-full w-full items-center gap-[5%] rounded-[3px] bg-(--ct-bg) px-[6%]">
            {miniTiles.map((color, i) => (
              <span
                key={i}
                className="aspect-square w-[18%] shrink-0 rounded-[2px]"
                style={{
                  background: color,
                  boxShadow:
                    i === 0
                      ? "0 0 0 1.5px var(--ct-bg), 0 0 0 3px var(--ct-select)"
                      : undefined,
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex w-[16%] flex-col items-center justify-around rounded-r-full bg-(--ct-red) py-[6%] pr-[3%]">
          <span className="grid w-[40%] grid-cols-2 gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="aspect-square rounded-full"
                style={{ background: knob }}
              />
            ))}
          </span>
          <span
            className="aspect-square w-[42%] rounded-full"
            style={{ background: knob }}
          />
        </div>
      </div>
    </div>
  );
}

export const textureArtifacts: Artifact[] = [
  {
    id: "shape-tile-row",
    label: "Tile row, one selected",
    content: <TileRow />,
  },
  {
    id: "shape-radius",
    label: "Corner radius scale",
    content: <RadiusScale />,
  },
  {
    id: "shape-elevation",
    label: "Elevation: rest, raised, lifted",
    content: <Elevation />,
  },
  {
    id: "shape-icon-buttons",
    label: "Round icon buttons",
    content: <IconButtons />,
  },
  { id: "shape-dot-grid", label: "Soft dot grid", content: <DotGrid /> },
  { id: "shape-handheld", label: "Handheld silhouette", content: <Handheld /> },
];
