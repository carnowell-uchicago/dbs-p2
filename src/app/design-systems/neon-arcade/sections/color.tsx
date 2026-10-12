import { contrastRatio, formatRatio } from "@/lib/contrast";
import { hex } from "@/components/ds/neon-arcade/tokens";
import { Cap, Section, mono } from "./parts";

type Swatch = {
  role: string;
  token: Parameters<typeof hex>[0];
  // What the ratio measures: [foreground, background, note].
  ratio?: [Parameters<typeof hex>[0], Parameters<typeof hex>[0], string?];
};

const core: Swatch[] = [
  { role: "Background", token: "--na-void" },
  { role: "Surface", token: "--na-panel" },
  { role: "Text", token: "--na-ice", ratio: ["--na-ice", "--na-void"] },
  { role: "Muted", token: "--na-muted", ratio: ["--na-muted", "--na-void"] },
  { role: "Border", token: "--na-edge", ratio: ["--na-edge", "--na-void", "UI"] },
  { role: "Accent", token: "--na-orange", ratio: ["--na-void", "--na-orange", "label"] },
];

const support: Swatch[] = [
  { role: "Focus", token: "--na-cyan", ratio: ["--na-cyan", "--na-void", "UI"] },
  { role: "Hover", token: "--na-raised", ratio: ["--na-ice", "--na-raised", "label"] },
  { role: "Divider", token: "--na-line" },
  { role: "Success", token: "--na-green", ratio: ["--na-green", "--na-panel", "on panel"] },
  { role: "Error", token: "--na-red", ratio: ["--na-red", "--na-panel", "on panel"] },
  { role: "Hot", token: "--na-magenta", ratio: ["--na-magenta", "--na-void"] },
];

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-6 lg:grid-cols-3">
      {items.map((s) => (
        <li key={s.role} className="flex min-w-0 flex-col gap-1">
          <span aria-hidden className="h-10 border border-(--na-line)" style={{ background: hex(s.token) }} />
          <span className="text-sm font-semibold text-(--na-ice)">{s.role}</span>
          <Cap className="tracking-[0.08em]">{hex(s.token)}</Cap>
          {s.ratio ? (
            <span className="text-xs text-(--na-ice)" style={mono}>
              {formatRatio(contrastRatio(hex(s.ratio[0]), hex(s.ratio[1])))}
              {s.ratio[2] && <span className="text-(--na-muted)"> {s.ratio[2]}</span>}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ColorSection() {
  return (
    <Section
      id="color"
      n={1}
      title="Color roles"
      caption="Ratios against Void unless noted. Label: text on the swatch. UI: borders and rings, need 3:1. Text needs 4.5:1."
    >
      <div className="flex flex-col gap-5">
        <Swatches items={core} />
        <Swatches items={support} />
      </div>
    </Section>
  );
}
