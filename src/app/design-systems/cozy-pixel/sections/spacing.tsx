import type { CSSProperties } from "react";
import { edge, font } from "@/components/ds/cozy-pixel/styles";
import { Section } from "./frame";

// Everything sits on a 4px grid, like pixels on a tile map. Bars are drawn
// at true size.
const scale = [4, 8, 12, 16, 24, 32, 48];
const corners = ["2px", "3px", "4px"];
const shadows = ["0px", "3px", "4px", "8px"];

function frame(w: string, d: string) {
  return { ...edge, "--w": w, "--e": "var(--cp-wood)", "--d": d } as CSSProperties;
}

const small = `${font.body} text-sm text-(--cp-muted)`;

export function SpacingSection() {
  return (
    <Section
      n={3}
      id="spacing"
      title="Spacing and shape"
      caption="4px grid · stepped corners, nothing rounded · wood edges 2–4px · hard shadows with no blur, deeper on hover, flat when pressed."
    >
      <ul aria-label="Spacing scale" className="flex items-end gap-3">
        {scale.map((px) => (
          <li key={px} className="flex w-6 flex-col items-center gap-2">
            <span aria-hidden className="block w-4 bg-(--cp-wood)" style={{ height: px }} />
            <span className={`${font.display} text-sm font-semibold`}>{px}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
        <ul aria-label="Corners" className="flex gap-5">
          {corners.map((w) => (
            <li key={w} className="flex flex-col items-center gap-3">
              <span aria-hidden style={frame(w, "0px")} className="block h-9 w-12 bg-(--cp-surface)" />
              <span className={small}>{w} edge</span>
            </li>
          ))}
        </ul>
        <ul aria-label="Shadows" className="flex gap-4">
          {shadows.map((d) => (
            <li key={d} className="flex flex-col items-center gap-3">
              <span aria-hidden style={frame("2px", d)} className="block h-7 w-9 bg-(--cp-surface)" />
              <span className={small}>{d} drop</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
