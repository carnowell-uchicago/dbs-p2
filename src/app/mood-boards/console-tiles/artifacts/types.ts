import type { ReactNode } from "react";

// One code-built tile on the Console Tiles mood board.
// The page wraps `content` in a white rounded tile and prints `label` under it.
// Palette and fonts are CSS variables set on the page wrapper (see page.tsx):
//   --ct-bg       #ebebeb  light home-screen gray (page background)
//   --ct-surface  #ffffff  tile and panel surface
//   --ct-text     #2d2d2d  main text (11.6:1 on bg)
//   --ct-muted    #5c5c5c  muted text (5.6:1 on bg)
//   --ct-line     #d4d4d4  hairline border
//   --ct-select   #00c3e3  selection ring cyan (outlines and fills only, never small text on light)
//   --ct-red      #ff3c28  neon red controller (fills and strips only; white text on it only if large)
//   --ct-blue     #0ab9e6  neon blue controller (fills and strips only)
//   --ct-yellow   #ffd400  category sign yellow (dark text on it is fine, 9.6:1)
//   --ct-dark     #2d2d2d  dark-theme background
//   --ct-dark-surface #3c3c3c  dark-theme tile surface
//   --ct-display Rubik, --ct-body Figtree, --ct-round Nunito
export type Artifact = {
  id: string;
  label: string;
  content: ReactNode;
};
