import type { ReactNode } from "react";

// One code-built tile on the Console Tiles mood board.
// The page wraps `content` in a dark rounded tile and prints `label` under it.
// Palette and fonts are CSS variables set on the page wrapper (see page.tsx).
// Dark theme:
//   --ct-bg       #2d2d2d  charcoal home screen (page background)
//   --ct-surface  #3c3c3c  tile and panel surface
//   --ct-text     #ffffff  main text (11.0:1 on surface); also the "selected" fill
//   --ct-ink      #2d2d2d  text on white, yellow, and other light fills
//   --ct-muted    #b4b4b4  muted text (5.3:1 on surface)
//   --ct-line     #4a4a4a  hairline divider (decoration only)
//   --ct-control  #919191  control borders and off tracks (3.5:1 on surface)
//   --ct-select   #00c3e3  selection ring cyan (6.5:1 on bg, so no dark edge; just a gap, then cyan)
//   --ct-red      #ff3c28  neon red controller (fills and strips only)
//   --ct-blue     #0ab9e6  neon blue controller (fills and strips only)
//   --ct-yellow   #ffd400  category sign yellow (ink text on it, 9.6:1)
// Shadows are black (white-tinted shadows glow on dark).
//   --ct-display Rubik, --ct-body Figtree, --ct-round Nunito
export type Artifact = {
  id: string;
  label: string;
  content: ReactNode;
};
