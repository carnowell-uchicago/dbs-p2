import type { CSSProperties } from "react";

// Console Tiles palette, dark theme. One source for the CSS variables on the page wrapper
// and for the contrast table, so the printed ratios always match what renders.

export type ColorRole = {
  role: string;
  cssVar: `--ct-${string}`;
  hex: string;
  purpose: string;
  note?: string;
};

export const colorRoles: ColorRole[] = [
  {
    role: "Background",
    cssVar: "--ct-bg",
    hex: "#2d2d2d",
    purpose: "The home screen behind everything.",
  },
  {
    role: "Surface",
    cssVar: "--ct-surface",
    hex: "#3c3c3c",
    purpose: "Tiles, cards, panels, and inputs.",
  },
  {
    role: "Text",
    cssVar: "--ct-text",
    hex: "#ffffff",
    purpose: "Titles and body. Also fills anything selected or on, with background-colored text.",
  },
  {
    role: "Muted text",
    cssVar: "--ct-muted",
    hex: "#b4b4b4",
    purpose: "Meta lines: category, plays, captions.",
  },
  {
    role: "Divider",
    cssVar: "--ct-line",
    hex: "#4a4a4a",
    purpose: "Hairlines between rows. Decoration only.",
  },
  {
    role: "Border",
    cssVar: "--ct-control",
    hex: "#919191",
    purpose: "Edges of inputs, chips, checkboxes, the off toggle.",
  },
  {
    role: "Accent",
    cssVar: "--ct-accent",
    hex: "#d92b1a",
    purpose: "The primary action only: Play.",
    note: "Mood board red #ff3c28 darkened; white text on it was 3.54:1. The label, not the edge, marks the button.",
  },
  {
    role: "Selection",
    cssVar: "--ct-select",
    hex: "#00c3e3",
    purpose: "The ring around where you are. Never text.",
    note: "Passes 3:1 on every surface, so the ring is cyan alone.",
  },
  {
    role: "Success",
    cssVar: "--ct-success",
    hex: "#5cd17a",
    purpose: "Confirmations: saved, ready, launching.",
    note: "Added for states; not on the mood board. Fills take dark text.",
  },
  {
    role: "Attention",
    cssVar: "--ct-attention",
    hex: "#ffd400",
    purpose: "Error and warning signs, with dark text only.",
  },
  {
    role: "Disabled",
    cssVar: "--ct-disabled",
    hex: "#242424",
    purpose: "Fill of controls you can't use yet: sunk below the background.",
  },
];

// Supporting shades: interaction steps and disabled text. Not separate roles.
export const stateColors = {
  "--ct-accent-hover": "#c0241a",
  "--ct-accent-press": "#a31e14",
  "--ct-disabled-text": "#8a8a8a",
} as const;

// Thumbnail art only (GameArt). Never on controls or text.
export const artColors = {
  red: "#ff3c28",
  blue: "#0ab9e6",
  yellow: "#ffd400",
  green: "#45b649",
  dark: "#2d2d2d",
  darkSurface: "#3c3c3c",
  white: "#ffffff",
  gray: "#d4d4d4",
} as const;

export function hexOf(cssVar: string): string {
  const role = colorRoles.find((r) => r.cssVar === cssVar);
  if (role) return role.hex;
  const extra = stateColors[cssVar as keyof typeof stateColors];
  if (extra) return extra;
  throw new Error(`Unknown token ${cssVar}`);
}

export const palette = {
  ...Object.fromEntries(colorRoles.map((r) => [r.cssVar, r.hex])),
  ...stateColors,
} as CSSProperties;

// Pairs that actually appear in the UI. `min` is the WCAG target for the pair:
// 4.5 for text, 3 for large text and non-text UI (borders, rings).
export type ContrastPair = {
  fg: string;
  bg: string;
  use: string;
  min: 3 | 4.5;
};

export const contrastPairs: ContrastPair[] = [
  { fg: "#ffffff", bg: "#2d2d2d", use: "Text on background", min: 4.5 },
  { fg: "#ffffff", bg: "#3c3c3c", use: "Text on surface", min: 4.5 },
  { fg: "#b4b4b4", bg: "#2d2d2d", use: "Muted text on background", min: 4.5 },
  { fg: "#b4b4b4", bg: "#3c3c3c", use: "Muted text on surface", min: 4.5 },
  { fg: "#ffffff", bg: "#d92b1a", use: "Play label on accent", min: 4.5 },
  { fg: "#ffffff", bg: "#c0241a", use: "Play label on accent hover", min: 4.5 },
  { fg: "#2d2d2d", bg: "#ffffff", use: "Selected chip label", min: 4.5 },
  { fg: "#5cd17a", bg: "#3c3c3c", use: "Success text on surface", min: 4.5 },
  { fg: "#5cd17a", bg: "#2d2d2d", use: "Success text on background", min: 4.5 },
  { fg: "#2d2d2d", bg: "#ffd400", use: "Icon on attention sign", min: 4.5 },
  { fg: "#919191", bg: "#2d2d2d", use: "Control border on background", min: 3 },
  { fg: "#919191", bg: "#3c3c3c", use: "Control border on surface", min: 3 },
  { fg: "#00c3e3", bg: "#2d2d2d", use: "Selection ring on background", min: 3 },
  { fg: "#00c3e3", bg: "#3c3c3c", use: "Selection ring on surface", min: 3 },
];
