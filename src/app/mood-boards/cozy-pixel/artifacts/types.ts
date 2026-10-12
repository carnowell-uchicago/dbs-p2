import type { ReactNode } from "react";

// One code-built tile on the Cozy Pixel mood board.
// The page wraps `content` in a wood-framed parchment tile and prints `label` under it.
// Palette and fonts are CSS variables set on the page wrapper (see page.tsx):
//   --cp-bg         #f7ecd6  parchment (page background)
//   --cp-surface    #fff8ea  light paper (tile surface)
//   --cp-text       #3b2a20  dark cocoa text (11.7:1 on bg)
//   --cp-muted      #6e5644  muted text (5.8:1 on bg)
//   --cp-wood       #8a4a24  dark wood frame (cream text on it: 6.4:1)
//   --cp-wood-light #d9a066  wood highlight / frame bevel
//   --cp-grass      #6aa84f  grass green (dark text on it only)
//   --cp-pumpkin    #f08a24  pumpkin orange (dark text on it only)
//   --cp-sky        #8fd3f4  sky blue
//   --cp-pink       #f4a7b9  blossom pink
//   --cp-gold       #f6c945  gold / star
//   --cp-display Pixelify Sans, --cp-label Silkscreen (small caps-like pixel labels), --cp-body Lora
export type Artifact = {
  id: string;
  label: string;
  content: ReactNode;
};
