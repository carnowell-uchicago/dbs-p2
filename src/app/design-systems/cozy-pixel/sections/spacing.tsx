import type { CSSProperties, ReactNode } from "react";
import { edge, font, type } from "@/components/ds/cozy-pixel/styles";
import { Caption, Section } from "./showcase";

// Everything sits on a 4px grid, like pixels on a tile map.
const scale = [
  { px: 4, use: "Icon to its label" },
  { px: 8, use: "Between badges" },
  { px: 12, use: "Card padding, chip gaps" },
  { px: 16, use: "Inside panels" },
  { px: 24, use: "Between cards" },
  { px: 32, use: "Between groups" },
  { px: 48, use: "Between sections" },
];

const corners = [
  { w: "2px", label: "2px step", use: "Chips, fields, badges" },
  { w: "3px", label: "3px step", use: "Buttons" },
  { w: "4px", label: "4px step", use: "Cards, panels, dialog" },
];

const shadows = [
  { d: "0px", label: "Flat", use: "Pressed, selected, disabled" },
  { d: "3px", label: "Low", use: "Buttons, chips" },
  { d: "4px", label: "Raised", use: "Cards, panels" },
  { d: "8px", label: "Lifted", use: "Card on hover" },
];

function vars(w: string, d: string) {
  return { ...edge, "--w": w, "--e": "var(--cp-wood)", "--d": d } as CSSProperties;
}

function Specimen({ label, use, children }: { label: string; use: string; children: ReactNode }) {
  return (
    <li className="flex flex-col gap-4">
      <div className="flex h-24 items-center justify-center bg-(--cp-bg)">{children}</div>
      <div className="flex flex-col gap-1">
        <span className={type.title}>{label}</span>
        <span className={`${font.body} text-base text-(--cp-muted)`}>{use}</span>
      </div>
    </li>
  );
}

export function SpacingSection() {
  return (
    <Section
      id="spacing"
      title="Spacing and shape"
      intro="A 4px grid, stepped corners instead of rounded ones, and hard shadows with no blur. Each edge is drawn outside its box, so corners lose exactly one pixel step."
    >
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Caption>Spacing scale</Caption>
          <ul className="flex flex-col gap-3">
            {scale.map((s) => (
              <li key={s.px} className="grid grid-cols-[3.5rem_3rem_1fr] items-center gap-4">
                <span className={`${font.display} text-base font-semibold`}>{s.px}px</span>
                <span aria-hidden className="block h-4 bg-(--cp-wood)" style={{ width: s.px }} />
                <span className={`${font.body} text-base text-(--cp-muted)`}>{s.use}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <Caption>Corners and borders</Caption>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {corners.map((c) => (
              <Specimen key={c.w} label={c.label} use={c.use}>
                <span style={vars(c.w, "0px")} className="block h-12 w-24 bg-(--cp-surface)" />
              </Specimen>
            ))}
          </ul>
          <p className={`${font.body} text-base text-(--cp-muted)`}>
            Panels add a 2px wood-light bevel inside the frame. Nothing is rounded.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Caption>Shadows</Caption>
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {shadows.map((s) => (
              <Specimen key={s.d} label={`${s.label} · ${s.d}`} use={s.use}>
                <span style={vars("3px", s.d)} className="block h-12 w-20 bg-(--cp-surface)" />
              </Specimen>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
