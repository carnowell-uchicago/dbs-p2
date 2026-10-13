import type { CSSProperties, ReactNode } from "react";
import type { Artifact } from "./types";

const display = { fontFamily: "var(--ct-display)" };
const body = { fontFamily: "var(--ct-body)" };

// The selection signal: a gap in the color behind, then a cyan ring. Cyan is
// 6.5:1 on charcoal, so it needs no dark edge.
const selectRing = (gap: string): CSSProperties => ({
  boxShadow: `0 0 0 3px ${gap}, 0 0 0 7px var(--ct-select)`,
});

function Ring({
  radius = "rounded-xl",
  gap = "var(--ct-surface)",
}: {
  radius?: string;
  gap?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${radius} motion-safe:animate-pulse`}
      style={selectRing(gap)}
    />
  );
}

function Glyph({ letter }: { letter: string }) {
  return (
    <span
      aria-hidden
      className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-(--ct-text) text-xs font-bold text-(--ct-ink)"
      style={display}
    >
      {letter}
    </span>
  );
}

function RoadArt() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <rect width="100" height="100" style={{ fill: "var(--ct-blue)" }} />
      <rect
        y="40"
        width="100"
        height="60"
        style={{
          fill: "color-mix(in srgb, var(--ct-blue) 55%, white)",
        }}
      />
      <circle cx="74" cy="26" r="11" style={{ fill: "var(--ct-yellow)" }} />
      <path
        d="M0 62 Q25 44 50 58 T100 52 V100 H0Z"
        style={{
          fill: "color-mix(in srgb, var(--ct-blue) 35%, var(--ct-bg))",
        }}
      />
      <path
        d="M44 100 L52 58 L56 58 L70 100Z"
        style={{ fill: "var(--ct-bg)" }}
      />
      <path
        d="M56 100 L54 58"
        strokeDasharray="5 5"
        strokeWidth="1.5"
        style={{ stroke: "white" }}
      />
      <rect
        x="49"
        y="80"
        width="10"
        height="6"
        rx="2"
        style={{ fill: "var(--ct-red)" }}
      />
    </svg>
  );
}

function BlockArt() {
  const cells = [
    [0, 2, "var(--ct-red)"],
    [1, 2, "var(--ct-red)"],
    [1, 1, "var(--ct-red)"],
    [2, 2, "var(--ct-blue)"],
    [3, 2, "var(--ct-blue)"],
    [3, 1, "var(--ct-blue)"],
    [2, 0, "var(--ct-yellow)"],
    [3, 0, "var(--ct-yellow)"],
  ] as const;
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden>
      <rect
        width="120"
        height="90"
        style={{ fill: "color-mix(in srgb, var(--ct-bg) 60%, black)" }}
      />
      {cells.map(([x, y, fill]) => (
        <rect
          key={`${x}-${y}`}
          x={22 + x * 19}
          y={14 + y * 19}
          width="17"
          height="17"
          rx="4"
          style={{ fill }}
        />
      ))}
      <rect
        x="22"
        y="71"
        width="76"
        height="4"
        rx="2"
        style={{
          fill: "color-mix(in srgb, white 30%, transparent)",
        }}
      />
    </svg>
  );
}

function SelectedTile() {
  return (
    <div className="bg-(--ct-bg) p-4" style={body}>
      <p className="mb-3 truncate text-xs font-semibold text-(--ct-text)">
        Grid Runner
      </p>
      <div className="flex gap-3 overflow-hidden p-[7px] pr-0">
        <div className="relative aspect-square w-[62%] shrink-0">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <RoadArt />
          </div>
          <Ring gap="var(--ct-bg)" />
        </div>
        <div
          aria-hidden
          className="aspect-square w-[62%] shrink-0 overflow-hidden rounded-xl opacity-90"
        >
          <BlockArt />
        </div>
      </div>
    </div>
  );
}

function HintBar() {
  const hints: [string, string][] = [
    ["A", "Play"],
    ["B", "Back"],
    ["X", "Options"],
  ];
  return (
    <div style={body}>
      <div aria-hidden className="flex gap-2 bg-(--ct-bg) px-4 pt-4 pb-3">
        <span className="h-10 flex-1 rounded-lg bg-(--ct-surface)" />
        <span className="h-10 flex-1 rounded-lg bg-(--ct-surface)" />
        <span className="h-10 flex-1 rounded-lg bg-(--ct-surface)" />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--ct-line) px-4 py-3">
        <span aria-hidden className="mr-auto flex gap-0.5">
          <span className="h-4 w-2 rounded-l-full bg-(--ct-blue)" />
          <span className="h-4 w-3 rounded-sm bg-(--ct-text)" />
          <span className="h-4 w-2 rounded-r-full bg-(--ct-red)" />
        </span>
        {hints.map(([letter, action]) => (
          <span key={letter} className="flex items-center gap-1.5">
            <Glyph letter={letter} />
            <span className="text-xs font-medium text-(--ct-text)">
              {action}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center gap-3 px-4 py-4" style={body}>
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--ct-yellow) shadow-[0_0_0_2px_var(--ct-text),0_2px_6px_rgb(0_0_0/0.4)]"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <ellipse
            cx="7"
            cy="6"
            rx="2.5"
            ry="5"
            style={{ fill: "var(--ct-ink)" }}
          />
          <ellipse
            cx="17"
            cy="6"
            rx="2.5"
            ry="5"
            style={{ fill: "var(--ct-ink)" }}
          />
          <ellipse
            cx="12"
            cy="14"
            rx="7"
            ry="7.5"
            style={{ fill: "var(--ct-ink)" }}
          />
          <circle
            cx="9.5"
            cy="12.5"
            r="1.2"
            style={{ fill: "var(--ct-yellow)" }}
          />
          <circle
            cx="14.5"
            cy="12.5"
            r="1.2"
            style={{ fill: "var(--ct-yellow)" }}
          />
        </svg>
      </span>
      <span
        className="ml-auto text-sm font-semibold text-(--ct-text)"
        style={display}
      >
        8:07
      </span>
      <svg viewBox="0 0 20 16" className="h-4 w-5 shrink-0" aria-hidden>
        <path
          d="M2 6a12 12 0 0 1 16 0M5 9.5a7.5 7.5 0 0 1 10 0"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ stroke: "var(--ct-text)" }}
        />
        <circle cx="10" cy="13" r="1.8" style={{ fill: "var(--ct-text)" }} />
      </svg>
      <svg viewBox="0 0 26 14" className="h-3.5 w-6 shrink-0" aria-hidden>
        <rect
          x="1"
          y="1"
          width="21"
          height="12"
          rx="3"
          fill="none"
          strokeWidth="1.5"
          style={{ stroke: "var(--ct-text)" }}
        />
        <rect
          x="23"
          y="4.5"
          width="2"
          height="5"
          rx="1"
          style={{ fill: "var(--ct-text)" }}
        />
        <rect
          x="3"
          y="3"
          width="13"
          height="8"
          rx="1.5"
          style={{ fill: "var(--ct-text)" }}
        />
      </svg>
      <span className="sr-only">
        Signed in, 8:07, Wi-Fi connected, battery 70%
      </span>
    </div>
  );
}

function Shoulder({ side }: { side: "L" | "R" }) {
  return (
    <span
      aria-hidden
      className={`grid h-5 w-6 shrink-0 place-items-center bg-(--ct-text) text-xs font-bold text-(--ct-ink) ${
        side === "L"
          ? "rounded-tl-xl rounded-r-md rounded-bl-md"
          : "rounded-tr-xl rounded-l-md rounded-br-md"
      }`}
      style={display}
    >
      {side}
    </span>
  );
}

function BumperTabs() {
  const tabs = ["All", "New", "Racing", "Puzzle"];
  return (
    <div className="@container" style={body}>
      <div className="flex flex-wrap items-center gap-2 p-3 @[18rem]:flex-nowrap @[18rem]:gap-1.5">
        <span className="order-1">
          <Shoulder side="L" />
        </span>
        <span className="order-2 ml-auto @[18rem]:order-3 @[18rem]:ml-0">
          <Shoulder side="R" />
        </span>
        <span className="order-3 flex w-full flex-wrap gap-1 @[18rem]:order-2 @[18rem]:w-auto @[18rem]:flex-1 @[18rem]:flex-nowrap @[18rem]:justify-center @[18rem]:gap-0.5">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                tab === "Racing"
                  ? "bg-(--ct-text) text-(--ct-ink)"
                  : "text-(--ct-muted)"
              }`}
            >
              {tab}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 ${
        on ? "justify-end bg-(--ct-text)" : "justify-start bg-(--ct-control)"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full shadow-[0_1px_3px_rgb(0_0_0/0.4)] ${
          on ? "bg-(--ct-surface)" : "bg-(--ct-text)"
        }`}
      />
    </span>
  );
}

function SettingRow({
  children,
  control,
  selected,
}: {
  children: ReactNode;
  control: ReactNode;
  selected?: boolean;
}) {
  return (
    <div className="relative flex items-center justify-between gap-2 rounded-lg px-2 py-2.5">
      <span className="text-xs font-medium text-(--ct-text)">{children}</span>
      {control}
      {selected && <Ring radius="rounded-lg" />}
    </div>
  );
}

function SettingsToggles() {
  return (
    <div className="flex flex-col gap-1 p-3" style={body}>
      <SettingRow control={<Toggle on={false} />}>Sound effects</SettingRow>
      <div className="mx-2 border-t border-(--ct-line)" />
      <SettingRow control={<Toggle on />} selected>
        Rumble
      </SettingRow>
      <div className="mx-2 border-t border-(--ct-line)" />
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium text-(--ct-text)">
          <span
            aria-hidden
            className="grid h-5 w-5 place-items-center rounded-md bg-(--ct-text)"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3">
              <path
                d="M2.5 6.5l2.5 2.5 4.5-5"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ stroke: "var(--ct-ink)" }}
              />
            </svg>
          </span>
          Show hints
        </span>
        <span className="flex items-center gap-2 text-xs font-medium text-(--ct-text)">
          <span
            aria-hidden
            className="grid h-5 w-5 place-items-center rounded-full border-2 border-(--ct-text)"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-(--ct-text)" />
          </span>
          Dark theme
        </span>
      </div>
    </div>
  );
}

function StartDialog() {
  return (
    <div className="@container" style={body}>
      <div className="relative h-56 overflow-hidden bg-(--ct-bg)">
        <div aria-hidden className="flex gap-2 p-4">
          <span className="aspect-square w-1/3 shrink-0 rounded-lg bg-(--ct-red)" />
          <span className="aspect-square w-1/3 shrink-0 rounded-lg bg-(--ct-blue)" />
          <span className="aspect-square w-1/3 shrink-0 rounded-lg bg-(--ct-yellow)" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-2xl bg-(--ct-surface) p-4 text-center shadow-[0_8px_24px_rgb(0_0_0/0.5)]">
          <p
            className="text-sm font-semibold text-(--ct-text) @[15rem]:text-base"
            style={display}
          >
            Start Grid Runner?
          </p>
          <p className="mt-1 text-xs text-(--ct-muted)">
            Progress isn&apos;t saved.
          </p>
          <div className="mt-4 flex flex-col gap-3 @[15rem]:flex-row">
            <span className="order-2 flex-1 rounded-full border border-(--ct-control) py-2 text-xs font-semibold text-(--ct-text) @[15rem]:order-1">
              Cancel
            </span>
            <span className="relative order-1 flex-1 rounded-full bg-(--ct-text) py-2 text-xs font-semibold text-(--ct-ink) @[15rem]:order-2">
              Start
              <Ring radius="rounded-full" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GameCard() {
  return (
    <div className="bg-(--ct-bg) p-3" style={body}>
      <div className="overflow-hidden rounded-2xl bg-(--ct-surface) shadow-[0_2px_8px_rgb(0_0_0/0.4)]">
        <div className="relative aspect-[4/3]">
          <BlockArt />
          <span className="absolute top-2 left-2 rounded-full bg-(--ct-yellow) px-2 py-0.5 text-xs font-bold tracking-wide text-(--ct-ink)">
            NEW
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <p className="text-sm font-semibold text-(--ct-text)" style={display}>
            Block Party
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-(--ct-muted)">
            <span>Puzzle</span>
            <span aria-hidden>·</span>
            <span className="font-medium text-(--ct-text)">★ 4.6</span>
            <span className="ml-auto rounded-full border border-(--ct-text) px-1.5 text-xs font-bold text-(--ct-text)">
              2P
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const interfaceArtifacts: Artifact[] = [
  {
    id: "ui-selected-tile",
    label: "Selected tile with ring",
    content: <SelectedTile />,
  },
  { id: "ui-hint-bar", label: "Button-hint bar", content: <HintBar /> },
  { id: "ui-status-bar", label: "Status bar", content: <StatusBar /> },
  {
    id: "ui-bumper-tabs",
    label: "Bumper tabs, one selected",
    content: <BumperTabs />,
  },
  {
    id: "ui-settings",
    label: "Toggle, checkbox, radio",
    content: <SettingsToggles />,
  },
  { id: "ui-start-dialog", label: "Start dialog", content: <StartDialog /> },
  { id: "ui-game-card", label: "Game card with badges", content: <GameCard /> },
];
