// Shared contract for the three design-system pages.
//
// Layout per style:
//   src/components/ds/<slug>/        Reusable UI built in that style (Button, Chip,
//                                    GameCard, Modal, …). The site at /play imports
//                                    from here, so keep these generic and data-driven.
//   src/components/ds/<slug>/tokens.ts
//                                    Palette hexes with role names, the single source
//                                    for both the CSS variables and the contrast table.
//   src/app/design-systems/<slug>/   The showcase page (fonts, palette wrapper) and
//                                    its sections.
//
// Section order and anchor ids on every page:
//   #color  #type  #spacing  #components  #ui-states
//
// Control states shown side by side:
//   Each control gets the state look from BOTH the real pseudo-class and a forced
//   data attribute, so one class string serves the live control and the frozen
//   specimens, e.g.
//     "hover:bg-x data-[force=hover]:bg-x focus-visible:ring data-[force=focus]:ring"
//   Components take an optional `force?: ForcedState` prop and render
//   `data-force={force}`. "disabled" sets the real `disabled` attribute instead,
//   and "selected" maps to the real aria-pressed / aria-checked / aria-selected.
//   The specimens row is wrapped in `inert` so keyboard users tab through the
//   live controls only. Each row also has one live control to try.
export const forcedStates = [
  "rest",
  "hover",
  "focus",
  "pressed",
  "selected",
  "disabled",
] as const;

export type ForcedState = (typeof forcedStates)[number];

// Use `force === "rest" ? undefined : force` so the rest specimen behaves normally.
export function forceAttr(force?: ForcedState) {
  return force && force !== "rest" && force !== "disabled" && force !== "selected"
    ? { "data-force": force }
    : {};
}
