import type { CSSProperties } from "react";

// Console Tiles palette. One source for the CSS variables on the page wrapper
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
    hex: "#ebebeb",
    purpose: "The home screen behind everything.",
  },
  {
    role: "Surface",
    cssVar: "--ct-surface",
    hex: "#ffffff",
    purpose: "Tiles, cards, panels, and inputs.",
  },
  {
    role: "Text",
    cssVar: "--ct-text",
    hex: "#2d2d2d",
    purpose: "Titles and body. Also fills anything selected or on.",
  },
  {
    role: "Muted text",
    cssVar: "--ct-muted",
    hex: "#5c5c5c",
    purpose: "Meta lines: category, plays, captions.",
  },
  {
    role: "Divider",
    cssVar: "--ct-line",
    hex: "#d4d4d4",
    purpose: "Hairlines between rows. Decoration only.",
  },
  {
    role: "Border",
    cssVar: "--ct-control",
    hex: "#767676",
    purpose: "Edges of inputs, chips, checkboxes, the off toggle.",
  },
  {
    role: "Accent",
    cssVar: "--ct-accent",
    hex: "#d92b1a",
    purpose: "The primary action only: Play.",
    note: "Mood board red #ff3c28 darkened; white text on it was 3.54:1.",
  },
  {
    role: "Selection",
    cssVar: "--ct-select",
    hex: "#00c3e3",
    purpose: "The ring around where you are. Never text.",
    note: "1.78:1 on the background, so the ring always has a dark edge.",
  },
  {
    role: "Success",
    cssVar: "--ct-success",
    hex: "#1e7a34",
    purpose: "Confirmations: saved, ready, launching.",
    note: "Added for states; not on the mood board.",
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
    hex: "#dedede",
    purpose: "Fill of controls you can't use yet.",
  },
];

// Supporting shades: interaction steps and disabled text. Not separate roles.
export const stateColors = {
  "--ct-accent-hover": "#c0241a",
  "--ct-accent-press": "#a31e14",
  "--ct-disabled-text": "#707070",
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
  { fg: "#2d2d2d", bg: "#ebebeb", use: "Text on background", min: 4.5 },
  { fg: "#2d2d2d", bg: "#ffffff", use: "Text on surface", min: 4.5 },
  { fg: "#5c5c5c", bg: "#ebebeb", use: "Muted text on background", min: 4.5 },
  { fg: "#5c5c5c", bg: "#ffffff", use: "Muted text on surface", min: 4.5 },
  { fg: "#ffffff", bg: "#d92b1a", use: "Play label on accent", min: 4.5 },
  { fg: "#ffffff", bg: "#c0241a", use: "Play label on accent hover", min: 4.5 },
  { fg: "#ffffff", bg: "#2d2d2d", use: "Selected chip label", min: 4.5 },
  { fg: "#1e7a34", bg: "#ffffff", use: "Success text on surface", min: 4.5 },
  { fg: "#1e7a34", bg: "#ebebeb", use: "Success text on background", min: 4.5 },
  { fg: "#2d2d2d", bg: "#ffd400", use: "Icon on attention sign", min: 4.5 },
  { fg: "#767676", bg: "#ebebeb", use: "Control border on background", min: 3 },
  { fg: "#767676", bg: "#ffffff", use: "Control border on surface", min: 3 },
  { fg: "#2d2d2d", bg: "#ebebeb", use: "Focus ring dark edge on background", min: 3 },
  { fg: "#00c3e3", bg: "#ebebeb", use: "Cyan alone on background (why the edge)", min: 3 },
];
