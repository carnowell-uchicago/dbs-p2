import type { Artifact } from "./types";

const mono = { fontFamily: "var(--na-mono)" };
const display = { fontFamily: "var(--na-display)" };
const body = { fontFamily: "var(--na-body)" };

function Caption({ children }: { children: string }) {
  return (
    <span
      className="text-[10px] uppercase tracking-widest text-(--na-muted)"
      style={mono}
    >
      {children}
    </span>
  );
}

function GlowButtons() {
  const base =
    "flex h-9 w-24 items-center justify-center border text-xs font-bold tracking-[0.2em] @[15rem]:w-full";
  const item = "flex items-center gap-3 @[15rem]:flex-col @[15rem]:gap-2";
  // Stacks into rows when the tile is narrow (two-column mobile board).
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-3 px-3 py-5 @[15rem]:h-32 @[15rem]:grid-cols-3 @[15rem]:items-center @[15rem]:gap-2 @[15rem]:py-0">
        <div className={item}>
          <span
            className={`${base} border-(--na-cyan) text-(--na-cyan) shadow-[0_0_6px_var(--na-cyan)]`}
            style={display}
          >
            PLAY
          </span>
          <Caption>Rest</Caption>
        </div>
        <div className={item}>
          <span
            className={`${base} border-(--na-ice) text-(--na-ice) shadow-[0_0_10px_var(--na-cyan),0_0_24px_var(--na-cyan),inset_0_0_10px_var(--na-cyan)] [text-shadow:0_0_8px_var(--na-cyan)]`}
            style={display}
          >
            PLAY
          </span>
          <Caption>Hover</Caption>
        </div>
        <div className={item}>
          <span
            className={`${base} border-(--na-cyan) bg-(--na-cyan) text-(--na-void) shadow-[0_0_4px_var(--na-cyan)]`}
            style={display}
          >
            PLAY
          </span>
          <Caption>Pressed</Caption>
        </div>
      </div>
    </div>
  );
}

function Brackets() {
  const corner = "absolute h-3 w-3 border-(--na-cyan)";
  return (
    <span aria-hidden>
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

function GameTile() {
  return (
    <div className="p-3">
      <div className="relative p-2">
        <Brackets />
        {/* Original thumbnail: a perspective grid with one light trail. */}
        <svg
          viewBox="0 0 160 90"
          className="block aspect-video w-full bg-(--na-void)"
          aria-hidden
        >
          <defs>
            <linearGradient id="ui-tile-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--na-void)" />
              <stop offset="1" stopColor="var(--na-panel)" />
            </linearGradient>
            <filter id="ui-tile-glow">
              <feGaussianBlur stdDeviation="1.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="160" height="90" fill="url(#ui-tile-sky)" />
          <line
            x1="0"
            y1="40"
            x2="160"
            y2="40"
            stroke="var(--na-cyan)"
            strokeWidth="0.6"
          />
          <g stroke="var(--na-line)" strokeWidth="0.6">
            {[48, 58, 72, 90].map((y) => (
              <line key={y} x1="0" y1={y} x2="160" y2={y} />
            ))}
            {[-120, -60, -20, 20, 60, 120].map((dx) => (
              <line
                key={dx}
                x1={80 + dx / 6}
                y1="40"
                x2={80 + dx * 1.6}
                y2="90"
              />
            ))}
          </g>
          <polyline
            points="20,90 52,62 98,62 118,46"
            fill="none"
            stroke="var(--na-cyan)"
            strokeWidth="1.6"
            filter="url(#ui-tile-glow)"
          />
          <circle
            cx="118"
            cy="46"
            r="2.4"
            fill="var(--na-ice)"
            filter="url(#ui-tile-glow)"
          />
        </svg>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2 px-1">
        <span className="text-sm font-bold text-(--na-ice)" style={display}>
          Grid Runner
        </span>
        <span className="text-xs text-(--na-cyan)" style={mono}>
          ★ 4.8
        </span>
      </div>
      <div
        className="flex justify-between px-1 text-xs text-(--na-muted)"
        style={body}
      >
        <span>Racing</span>
        <span style={mono}>12.4K plays</span>
      </div>
    </div>
  );
}

function LoadingBar() {
  const segments = 10;
  const lit = 6;
  return (
    <div className="flex h-24 flex-col justify-center gap-2 px-4">
      <div
        className="flex justify-between text-[11px] tracking-[0.25em] text-(--na-cyan)"
        style={mono}
      >
        <span>LOADING</span>
        <span>60%</span>
      </div>
      <div className="flex gap-0.5 border border-(--na-line) p-1" aria-hidden>
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={`flex-1 text-center text-sm leading-none ${
              i < lit
                ? "text-(--na-cyan) [text-shadow:0_0_6px_var(--na-cyan)]"
                : "text-(--na-line)"
            } ${i === lit - 1 ? "motion-safe:animate-pulse" : ""}`}
          >
            ▸
          </span>
        ))}
      </div>
    </div>
  );
}

function Chevrons() {
  return (
    <div className="flex h-28 items-center justify-center px-4">
      <svg viewBox="0 0 120 50" className="w-full max-w-56" aria-hidden>
        <defs>
          <filter
            id="ui-chevron-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0, 36, 72].map((x, i) => (
          <path
            key={x}
            d={`M${x + 8} 6 L${x + 30} 25 L${x + 8} 44 L${x + 18} 44 L${x + 40} 25 L${x + 18} 6 Z`}
            fill="none"
            stroke="var(--na-cyan)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            opacity={0.45 + i * 0.275}
            filter="url(#ui-chevron-glow)"
          />
        ))}
      </svg>
    </div>
  );
}

function FilterChips() {
  const chips = ["All", "Racing", "Puzzle", "Arcade", "Two-player"];
  return (
    <div className="flex flex-wrap gap-2 p-4" style={body}>
      {chips.map((chip) =>
        chip === "Racing" ? (
          <span
            key={chip}
            className="border border-(--na-cyan) bg-(--na-cyan)/15 px-3 py-1 text-xs font-semibold text-(--na-ice) shadow-[0_0_8px_var(--na-cyan)]"
          >
            {chip}
          </span>
        ) : (
          <span
            key={chip}
            className="border border-(--na-line) px-3 py-1 text-xs text-(--na-muted)"
          >
            {chip}
          </span>
        ),
      )}
    </div>
  );
}

function Badges() {
  const badges = [
    { text: "NEW", color: "var(--na-cyan)" },
    { text: "HOT", color: "var(--na-orange)" },
    { text: "2P", color: "var(--na-magenta)" },
  ];
  return (
    <div
      className="flex h-20 items-center justify-center gap-3 px-4"
      style={mono}
    >
      {badges.map(({ text, color }) => (
        <span
          key={text}
          className="border px-2 py-0.5 text-xs tracking-[0.2em]"
          style={{ borderColor: color, color, boxShadow: `0 0 6px ${color}` }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}

function Toggles() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 p-4">
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="flex h-5 w-10 items-center border border-(--na-line) p-0.5"
          aria-hidden
        >
          <span className="h-3.5 w-3.5 bg-(--na-muted)" />
        </span>
        <Caption>Off</Caption>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="flex h-5 w-10 items-center justify-end border border-(--na-cyan) bg-(--na-cyan)/15 p-0.5 shadow-[0_0_8px_var(--na-cyan)]"
          aria-hidden
        >
          <span className="h-3.5 w-3.5 bg-(--na-ice) shadow-[0_0_6px_var(--na-cyan)]" />
        </span>
        <Caption>On</Caption>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="flex h-4 w-4 items-center justify-center border border-(--na-cyan) shadow-[0_0_6px_var(--na-cyan)]"
          aria-hidden
        >
          <span className="h-2 w-2 bg-(--na-cyan)" />
        </span>
        <Caption>Checked</Caption>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full border border-(--na-cyan) shadow-[0_0_6px_var(--na-cyan)]"
          aria-hidden
        >
          <span className="h-2 w-2 rounded-full bg-(--na-cyan)" />
        </span>
        <Caption>Selected</Caption>
      </div>
    </div>
  );
}

export const interfaceArtifacts: Artifact[] = [
  {
    id: "ui-glow-button",
    label: "Glow button: rest, hover, pressed",
    content: <GlowButtons />,
  },
  {
    id: "ui-game-tile",
    label: "Game tile with corner brackets",
    content: <GameTile />,
  },
  { id: "ui-loading-bar", label: "HUD loading bar", content: <LoadingBar /> },
  { id: "ui-chevrons", label: "Chevron motif", content: <Chevrons /> },
  {
    id: "ui-filter-chips",
    label: "Filter chips, one selected",
    content: <FilterChips />,
  },
  { id: "ui-badges", label: "Badges", content: <Badges /> },
  { id: "ui-toggles", label: "Toggle, checkbox, radio", content: <Toggles /> },
];
