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
// Page layout: a compact spec sheet modeled on the brief's section 4 example
// ("Calm · Design System"). Title "<Style> · Design System", then six numbered
// sections. Desktop (lg+): two columns, left ~1/3 holds 1–3, right ~2/3 holds 4–6.
// Phones: one column in order 1–6. Each section is a small numbered label plus
// one short caption at most; no per-component prose.
//   1 #color       Swatch row: role name and hex under each swatch, ratio vs the
//                  background it sits on (computed). Accent shows its label ratio.
//   2 #type        Display, heading, body, label set in site content; role name
//                  right-aligned with font · size · weight.
//   3 #spacing     Spacing scale as a bar chart, corner boxes, border/shadow line.
//   4 #components  One LIVE instance of every component, packed into a few rows,
//                  plus one caption line naming them.
//   5 #states      Control states table: one row per control, columns
//                  Rest · Hover · Focus · Pressed · Selected · Disabled ("—" where
//                  a state doesn't apply). All specimens frozen and `inert`.
//   6 #ui-states   Four small cards in a row: empty, loading, error, success.
//
// Control states:
//   Each control gets the state look from BOTH the real pseudo-class and a forced
//   data attribute, so one class string serves the live control and the frozen
//   specimens, e.g.
//     "hover:bg-x data-[force=hover]:bg-x focus-visible:ring data-[force=focus]:ring"
//   Components take an optional `force?: ForcedState` prop and render
//   `data-force={force}`. "disabled" sets the real `disabled` attribute instead,
//   and "selected" maps to the real aria-pressed / aria-checked / aria-selected.
//   Tailwind v4: pair state outline widths with `outline-solid`
//   (e.g. `focus-visible:outline-2 focus-visible:outline-solid`), or nothing draws.
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
