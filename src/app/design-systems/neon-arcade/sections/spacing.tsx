import { Cap, Section } from "./parts";

const scale = [4, 8, 12, 16, 24, 32, 48, 64];

const corners = [
  { name: "0", className: "rounded-none" },
  { name: "Full", className: "rounded-full" },
];

// Border weights and glow levels, tiny.
const edges = [
  { name: "Line", className: "border border-(--na-line)" },
  { name: "Edge", className: "border border-(--na-edge)" },
  { name: "Focus", className: "border border-(--na-edge) outline-2 outline-offset-2 outline-(--na-cyan)" },
  { name: "Glow", className: "border border-(--na-cyan) shadow-[0_0_4px_var(--na-cyan),0_0_16px_color-mix(in_srgb,var(--na-cyan)_50%,transparent)]" },
  { name: "Accent", className: "border border-(--na-orange) shadow-[0_0_6px_var(--na-orange),0_0_16px_color-mix(in_srgb,var(--na-orange)_55%,transparent)]" },
];

export function SpacingSection() {
  return (
    <Section
      id="spacing"
      n={3}
      title="Spacing and shape"
      caption="4px grid. 1px borders, 2px focus ring, square corners (only switches and radios are round). Glow replaces shadow, on hover, focus, and selection only."
    >
      <div className="flex flex-wrap items-end gap-x-8 gap-y-6">
        <ul aria-label="Spacing scale" className="flex items-end gap-2.5">
          {scale.map((px) => (
            <li key={px} className="flex flex-col items-center gap-1.5">
              <span aria-hidden className="w-3 bg-(--na-cyan)/70" style={{ height: px }} />
              <Cap className="tracking-normal">{px}</Cap>
            </li>
          ))}
        </ul>
        <ul aria-label="Corners" className="flex items-end gap-3">
          {corners.map((c) => (
            <li key={c.name} className="flex flex-col items-center gap-1.5">
              <span aria-hidden className={`size-10 border border-(--na-edge) bg-(--na-panel) ${c.className}`} />
              <Cap className="tracking-normal">{c.name}</Cap>
            </li>
          ))}
        </ul>
      </div>
      <ul aria-label="Borders and glow" className="mt-5 flex flex-wrap gap-x-4 gap-y-3">
        {edges.map((e) => (
          <li key={e.name} className="flex flex-col items-center gap-1.5">
            <span aria-hidden className={`h-7 w-12 bg-(--na-panel) ${e.className}`} />
            <Cap className="tracking-normal">{e.name}</Cap>
          </li>
        ))}
      </ul>
    </Section>
  );
}
