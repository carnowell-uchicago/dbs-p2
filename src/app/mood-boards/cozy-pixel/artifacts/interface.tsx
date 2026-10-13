import type { CSSProperties, ReactNode } from "react";
import { PixelSprite } from "./pixel";
import type { Artifact } from "./types";

const display = { fontFamily: "var(--cp-display)" };
const label = { fontFamily: "var(--cp-display)" };
const body = { fontFamily: "var(--cp-body)" };

const ink = {
  t: "var(--cp-text)",
  m: "var(--cp-muted)",
  w: "var(--cp-wood)",
  l: "var(--cp-wood-light)",
  c: "var(--cp-surface)",
  b: "var(--cp-bg)",
  g: "var(--cp-grass)",
  k: "var(--cp-pumpkin)",
  s: "var(--cp-sky)",
  p: "var(--cp-pink)",
  y: "var(--cp-gold)",
};

// Pixel border with stepped corners, plus an optional 3px hard drop shadow.
// Edges 3px and up get two-step corners (as in the design system's `edge`):
// bars one width short at each end, plus the box's own corner pixels filled.
// Thin 2px detail lines keep one step, so small boxes don't read as round.
function pixelEdge(edge: string, width = 3, drop?: string): CSSProperties {
  const w = width;
  if (w < 3) {
    const sides = [`0 -${w}px 0 0 ${edge}`, `0 ${w}px 0 0 ${edge}`, `-${w}px 0 0 0 ${edge}`, `${w}px 0 0 0 ${edge}`];
    if (drop) sides.push(`0 ${w + 3}px 0 0 ${drop}`);
    return { boxShadow: sides.join(", ") };
  }
  const bar = (x: number, y: number, color: string) => `${x}px ${y}px 0 -${w}px ${color}`;
  const sides = [bar(0, -2 * w, edge), bar(0, 2 * w, edge), bar(-2 * w, 0, edge), bar(2 * w, 0, edge)];
  if (drop) sides.push(bar(0, 2 * w + 3, drop), bar(-2 * w, 3, drop), bar(2 * w, 3, drop), `0 3px 0 0 ${drop}`);
  const fill = `linear-gradient(${edge}, ${edge})`;
  return {
    boxShadow: sides.join(", "),
    backgroundImage: Array(4).fill(fill).join(", "),
    backgroundSize: Array(4).fill(`${w}px ${w}px`).join(", "),
    backgroundPosition: "top left, top right, bottom left, bottom right",
    backgroundRepeat: "no-repeat",
  };
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs uppercase text-(--cp-muted)" style={label}>
      {children}
    </span>
  );
}

function WoodButtons() {
  const face =
    "flex h-9 w-24 items-center justify-center text-sm font-bold text-(--cp-text) @[15rem]:w-full";
  const item = "flex items-center gap-4 @[15rem]:flex-col @[15rem]:gap-3";
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-5 px-5 py-5 @[15rem]:grid-cols-3 @[15rem]:gap-4">
        <div className={item}>
          <span
            className={`${face} bg-(--cp-wood-light)`}
            style={{
              ...display,
              ...pixelEdge("var(--cp-wood)", 3, "var(--cp-text)"),
            }}
          >
            PLAY
          </span>
          <Caption>Rest</Caption>
        </div>
        <div className={item}>
          <span
            className={`${face} bg-[color-mix(in_srgb,var(--cp-wood-light)_55%,var(--cp-surface))]`}
            style={{
              ...display,
              ...pixelEdge("var(--cp-wood)", 3, "var(--cp-text)"),
            }}
          >
            PLAY
          </span>
          <Caption>Hover</Caption>
        </div>
        <div className={item}>
          <span
            className={`${face} translate-y-[3px] bg-[color-mix(in_srgb,var(--cp-wood-light)_80%,var(--cp-wood))]`}
            style={{ ...display, ...pixelEdge("var(--cp-wood)", 3) }}
          >
            PLAY
          </span>
          <Caption>Pressed</Caption>
        </div>
      </div>
    </div>
  );
}

const donkey = [
  ".ttt...ttt.",
  ".tpt...tpt.",
  ".tpt...tpt.",
  ".tlt...tlt.",
  ".tlltttllt.",
  "tlllllllllt",
  "tltllllltlt",
  "tlllllllllt",
  "tlccccccclt",
  ".tcctctcct.",
  "..tccccct..",
  "...ttttt...",
];

function DialogBox() {
  return (
    <div className="@container p-4">
      <style>{"@keyframes cp-ui-blink{50%{opacity:0}}"}</style>
      <div
        className="relative bg-(--cp-surface) p-1.5"
        style={pixelEdge("var(--cp-wood)", 4, "var(--cp-text)")}
      >
        <div
          className="flex flex-col gap-3 p-3 @[15rem]:flex-row @[15rem]:items-start"
          style={pixelEdge("var(--cp-wood-light)", 2)}
        >
          <div
            className="w-12 shrink-0 bg-(--cp-sky) p-1"
            style={pixelEdge("var(--cp-wood)", 2)}
          >
            <PixelSprite rows={donkey} colors={ink} className="w-full" />
          </div>
          <p
            className="pb-3 text-sm leading-snug text-(--cp-text)"
            style={body}
          >
            Fancy a quick game before bed?
          </p>
        </div>
        <span
          aria-hidden
          className="absolute bottom-2 right-3 text-xs text-(--cp-wood) motion-safe:animate-[cp-ui-blink_1s_steps(1)_infinite]"
        >
          ▼
        </span>
      </div>
    </div>
  );
}

const icons: Record<string, string[]> = {
  hoe: [
    "tmmt....",
    "tmmmt...",
    ".ttwt...",
    "...w....",
    "....w...",
    ".....w..",
    "......w.",
    ".......w",
  ],
  can: [
    "..ttt..t",
    ".t...tst",
    ".tsssst.",
    "tssssst.",
    "tssssst.",
    "tssssst.",
    ".ttttt..",
    "........",
  ],
  seeds: [
    "...gg...",
    "..tggt..",
    "..tllt..",
    ".tllllt.",
    "tllggllt",
    "tllggllt",
    "tllllllt",
    ".tttttt.",
  ],
  pumpkin: [
    "...gw...",
    "...w....",
    ".kkkkkk.",
    "kkwkkwkk",
    "kkwkkwkk",
    "kkwkkwkk",
    ".kkkkkk.",
    "........",
  ],
  star: [
    "...yy...",
    "...yy...",
    "yyyyyyyy",
    ".yyyyyy.",
    "..yyyy..",
    ".yy..yy.",
    "yy....yy",
    "........",
  ],
};

const slots = [
  { icon: "hoe" },
  { icon: "can" },
  { icon: "seeds", count: 12 },
  { icon: "pumpkin", count: 3, selected: true },
  { icon: "star", count: 1 },
];

// Pumpkin pixel edge outside, gold ring inside.
const selectedSlot: CSSProperties = {
  boxShadow: `${pixelEdge("var(--cp-pumpkin)", 2).boxShadow}, inset 0 0 0 2px var(--cp-gold)`,
};

function InventoryBar() {
  return (
    <div className="@container p-4">
      <div
        className="grid grid-cols-3 gap-1.5 bg-(--cp-wood) p-1.5 @[15rem]:grid-cols-5"
        style={pixelEdge("var(--cp-text)", 2, "var(--cp-text)")}
      >
        {slots.map((slot) => (
          <div
            key={slot.icon}
            className="relative aspect-square bg-(--cp-surface) p-1.5"
            style={slot.selected ? selectedSlot : undefined}
          >
            <PixelSprite
              rows={icons[slot.icon]}
              colors={ink}
              className="h-full w-full"
            />
            {slot.count ? (
              <span
                className="absolute bottom-0 right-0.5 text-xs leading-none text-(--cp-text)"
                style={label}
              >
                {slot.count}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs uppercase text-(--cp-muted)" style={label}>
        Pumpkin · 3
      </p>
    </div>
  );
}

const field = [
  "ssssssssssssssss",
  "sssssssssssyysss",
  "sssssssssssyysss",
  "ssssssssssssssss",
  "sssswsssssssssss",
  "sskkkkssssswssss",
  "skkwkkkssskkkkss",
  "gkkwkkkgggkkwkkg",
  "gggggggggggggggg",
  "wwwwwwwwwwwwwwww",
];

const smallStar = [".y.", "yyy", ".y."];

function GameCard() {
  return (
    <div className="p-4">
      <div
        className="bg-(--cp-surface) p-2"
        style={pixelEdge("var(--cp-wood)", 3, "var(--cp-text)")}
      >
        <div className="relative" style={pixelEdge("var(--cp-wood-light)", 2)}>
          <PixelSprite rows={field} colors={ink} className="block w-full" />
          <span
            className="absolute left-0 top-1.5 bg-(--cp-gold) px-1.5 py-0.5 text-xs text-(--cp-text)"
            style={label}
          >
            NEW
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <span
            className="text-base font-bold text-(--cp-text)"
            style={display}
          >
            Harvest Hop
          </span>
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs uppercase text-(--cp-muted)"
              style={label}
            >
              Puzzle
            </span>
            <span className="flex items-center gap-1">
              <span aria-hidden className="flex gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <PixelSprite
                    key={i}
                    rows={smallStar}
                    colors={ink}
                    className="w-2.5"
                  />
                ))}
              </span>
              <span className="text-xs text-(--cp-text)" style={label}>
                4.5
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const heart = [
  ".ttt.ttt.",
  "thhhthhht",
  "thhhhhhht",
  "thhhhhhht",
  ".thhhhht.",
  "..thhht..",
  "...tht...",
  "....t....",
];

function Meters() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div aria-hidden className="flex flex-wrap gap-1.5">
        {[true, true, true, false, false].map((full, i) => (
          <PixelSprite
            key={i}
            rows={heart}
            colors={{ t: ink.t, h: full ? ink.p : ink.c }}
            className="w-6"
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-(--cp-text)" style={label}>
          E
        </span>
        <div
          className="h-4 flex-1 bg-(--cp-surface) p-0.5"
          style={pixelEdge("var(--cp-wood)", 2)}
        >
          <div className="flex h-full w-[70%] flex-col bg-(--cp-grass)">
            <div className="h-0.5 bg-[color-mix(in_srgb,var(--cp-grass)_50%,var(--cp-surface))]" />
          </div>
        </div>
      </div>
      <Caption>Energy 70 / 100</Caption>
    </div>
  );
}

const tabCorners =
  "polygon(3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% 100%, 0 100%, 0 3px, 3px 3px)";

function FolderTabs() {
  const tabs = ["All", "Farm", "Puzzle", "Racing"];
  const active = "Puzzle";
  return (
    <div className="@container p-3">
      <div className="flex items-end gap-0.5 px-1 @[15rem]:gap-1">
        {tabs.map((tab) =>
          tab === active ? (
            <span
              key={tab}
              className="relative z-10 -mb-[3px] border-x-[3px] border-t-[3px] border-(--cp-wood) bg-(--cp-surface) px-1 pb-[5px] pt-1 text-xs uppercase text-(--cp-text) @[15rem]:px-2.5"
              style={{ ...label, clipPath: tabCorners }}
            >
              {tab}
            </span>
          ) : (
            <span
              key={tab}
              className={`bg-(--cp-wood) px-1 py-1 text-xs uppercase text-(--cp-surface) @[15rem]:px-2.5 ${
                // Narrow tiles show three tabs rather than shrinking the text.
                tab === "Racing" ? "hidden @[15rem]:inline" : ""
              }`}
              style={{ ...label, clipPath: tabCorners }}
            >
              {tab}
            </span>
          ),
        )}
      </div>
      <div className="flex flex-col gap-2 border-[3px] border-(--cp-wood) bg-(--cp-surface) p-3">
        {[
          ["Harvest Hop", "Puzzle"],
          ["Seed Sort", "Puzzle"],
        ].map(([name, kind]) => (
          <div
            key={name}
            className="flex items-baseline justify-between gap-2 border-b-2 border-dashed border-(--cp-wood-light) pb-1.5 last:border-0 last:pb-0"
          >
            <span className="text-sm text-(--cp-text)" style={body}>
              {name}
            </span>
            <span
              className="text-xs uppercase text-(--cp-muted)"
              style={label}
            >
              {kind}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const checkbox = [
  "ttttttttt",
  "tccccccct",
  "tcccccckt",
  "tccccckkt",
  "tkccckkct",
  "tkkckkcct",
  "tckkkccct",
  "tcckcccct",
  "ttttttttt",
];

const radio = [
  "..ttttt..",
  ".tccccct.",
  "tccccccct",
  "tccwwwcct",
  "tccwwwcct",
  "tccwwwcct",
  "tccccccct",
  ".tccccct.",
  "..ttttt..",
];

function Lever({ on }: { on?: boolean }) {
  return (
    <div
      aria-hidden
      className={`flex h-5 w-11 items-center p-0.5 ${on ? "justify-end bg-(--cp-grass)" : "justify-start bg-(--cp-wood)"}`}
      style={pixelEdge("var(--cp-text)", 2)}
    >
      <span
        className="h-full w-4 bg-(--cp-wood-light)"
        style={pixelEdge("var(--cp-text)", 2)}
      />
    </div>
  );
}

function Choices() {
  const cell = "flex flex-col items-center gap-2";
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-5 @[15rem]:grid-cols-4">
        <div className={cell}>
          <PixelSprite
            rows={checkbox}
            colors={{ t: ink.t, c: ink.c, k: ink.t }}
            className="w-5"
          />
          <Caption>Checked</Caption>
        </div>
        <div className={cell}>
          <PixelSprite rows={radio} colors={ink} className="w-5" />
          <Caption>Selected</Caption>
        </div>
        <div className={cell}>
          <Lever />
          <Caption>Off</Caption>
        </div>
        <div className={cell}>
          <Lever on />
          <Caption>On</Caption>
        </div>
      </div>
    </div>
  );
}

export const interfaceArtifacts: Artifact[] = [
  {
    id: "ui-wood-button",
    label: "Wood button: rest, hover, pressed",
    content: <WoodButtons />,
  },
  { id: "ui-dialog", label: "Dialog box", content: <DialogBox /> },
  {
    id: "ui-inventory",
    label: "Inventory bar, one slot selected",
    content: <InventoryBar />,
  },
  { id: "ui-game-card", label: "Game card with ribbon", content: <GameCard /> },
  { id: "ui-meters", label: "Hearts and energy", content: <Meters /> },
  {
    id: "ui-folder-tabs",
    label: "Folder tabs, one active",
    content: <FolderTabs />,
  },
  {
    id: "ui-choices",
    label: "Checkbox, radio, lever toggle",
    content: <Choices />,
  },
];
