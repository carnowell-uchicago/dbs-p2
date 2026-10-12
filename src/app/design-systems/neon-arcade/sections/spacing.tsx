import type { ReactNode } from "react";
import { Section, labelClass, mono } from "./parts";

const scale = [
  { px: 4, use: "Icon to label" },
  { px: 8, use: "Badge and chip gaps" },
  { px: 12, use: "Inside list rows" },
  { px: 16, use: "Card padding" },
  { px: 24, use: "Between cards" },
  { px: 32, use: "Between groups" },
  { px: 48, use: "Section padding, mobile" },
  { px: 64, use: "Section padding, desktop" },
];

const corners = [
  { name: "Square · 0", use: "Everything: cards, buttons, fields, dialogs", className: "rounded-none" },
  { name: "Round · full", use: "Only switches and radios", className: "rounded-full" },
];

const borders = [
  { name: "Line · 1px", use: "Dividers", className: "border border-(--na-line)" },
  { name: "Edge · 1px", use: "Controls at rest", className: "border border-(--na-edge)" },
  { name: "Cyan · 1px", use: "Hover and selected", className: "border border-(--na-cyan)" },
  { name: "Cyan · 2px", use: "Focus ring", className: "outline-2 outline-offset-2 outline-(--na-cyan) border border-(--na-edge)" },
];

const glows = [
  { name: "None", use: "Rest stays crisp", className: "border border-(--na-edge)" },
  {
    name: "Glow 1",
    use: "Selected chips, toggles",
    className: "border border-(--na-cyan) shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)]",
  },
  {
    name: "Glow 2",
    use: "Hovered card, dialog",
    className: "border border-(--na-cyan) shadow-[0_0_4px_var(--na-cyan),0_0_16px_color-mix(in_srgb,var(--na-cyan)_50%,transparent)]",
  },
  {
    name: "Accent glow",
    use: "Play button, hover only",
    className: "border border-(--na-orange) bg-(--na-orange) shadow-[0_0_6px_var(--na-orange),0_0_20px_color-mix(in_srgb,var(--na-orange)_55%,transparent)]",
  },
];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Tile({ name, use, className }: { name: string; use: string; className: string }) {
  return (
    <li className="flex flex-col gap-3">
      <span className={`block h-16 bg-(--na-panel) ${className}`} aria-hidden />
      <span className="flex flex-col gap-0.5">
        <span className={labelClass} style={mono}>
          {name}
        </span>
        <span className="text-base text-(--na-muted)">{use}</span>
      </span>
    </li>
  );
}

export function SpacingSection() {
  return (
    <Section
      id="spacing"
      index="03"
      title="Spacing and shape"
      intro="A 4px grid. Square corners, because light lines meet at right angles. Glow only when something responds to you."
    >
      <div className="grid gap-12 lg:grid-cols-2">
        <Group title="Spacing scale">
          <ul className="flex flex-col gap-2.5">
            {scale.map((s) => (
              <li key={s.px} className="grid grid-cols-[3rem_4rem_1fr] items-center gap-3">
                <span className="text-xs tracking-[0.1em] text-(--na-ice)" style={mono}>
                  {s.px}px
                </span>
                <span
                  className="block h-3 bg-(--na-cyan)/70 shadow-[0_0_6px_color-mix(in_srgb,var(--na-cyan)_40%,transparent)]"
                  style={{ width: s.px }}
                  aria-hidden
                />
                <span className="text-base text-(--na-muted)">{s.use}</span>
              </li>
            ))}
          </ul>
        </Group>
        <Group title="Corners">
          <ul className="grid grid-cols-2 gap-4">
            {corners.map((c) => (
              <Tile key={c.name} {...c} className={`${c.className} border border-(--na-edge)`} />
            ))}
          </ul>
        </Group>
        <Group title="Borders">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6">
            {borders.map((b) => (
              <Tile key={b.name} {...b} />
            ))}
          </ul>
        </Group>
        <Group title="Shadow is glow">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6">
            {glows.map((g) => (
              <Tile key={g.name} {...g} />
            ))}
          </ul>
        </Group>
      </div>
    </Section>
  );
}
