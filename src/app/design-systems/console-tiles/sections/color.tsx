import { contrastRatio, formatRatio } from "@/lib/contrast";
import { hexOf } from "@/components/ds/console-tiles/tokens";
import { Section } from "./ui";

const bg = hexOf("--ct-bg");

type Swatch = { name: string; cssVar: string; ratio?: string };

// Ratios are against the background, except the accent, which carries the
// white Play label.
const ratio = (fg: string, on = bg, note = "") => `${formatRatio(contrastRatio(fg, on))}${note}`;

const core: Swatch[] = [
  { name: "Background", cssVar: "--ct-bg" },
  { name: "Surface", cssVar: "--ct-surface" },
  { name: "Text", cssVar: "--ct-text", ratio: ratio(hexOf("--ct-text")) },
  { name: "Muted", cssVar: "--ct-muted", ratio: ratio(hexOf("--ct-muted")) },
  { name: "Border", cssVar: "--ct-control", ratio: ratio(hexOf("--ct-control"), bg, " UI") },
  { name: "Accent", cssVar: "--ct-accent", ratio: ratio("#ffffff", hexOf("--ct-accent"), " label") },
];

const support: Swatch[] = [
  { name: "Selection", cssVar: "--ct-select", ratio: ratio(hexOf("--ct-select"), bg, " alone") },
  { name: "Success", cssVar: "--ct-success", ratio: ratio(hexOf("--ct-success")) },
  { name: "Attention", cssVar: "--ct-attention", ratio: ratio(hexOf("--ct-text"), hexOf("--ct-attention"), " icon") },
  { name: "Divider", cssVar: "--ct-line" },
  { name: "Disabled", cssVar: "--ct-disabled" },
];

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-4">
      {items.map((s) => (
        <li key={s.cssVar} className="flex min-w-0 flex-col gap-1">
          <span
            aria-hidden
            className="mb-1 h-12 rounded-xl shadow-[inset_0_0_0_1px_var(--ct-line)]"
            style={{ background: hexOf(s.cssVar) }}
          />
          <span className="text-xs font-semibold">{s.name}</span>
          <span className="text-xs text-(--ct-muted) tabular-nums">{hexOf(s.cssVar)}</span>
          {s.ratio && <span className="text-xs font-bold tabular-nums">{s.ratio}</span>}
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
      caption="Ratios are on the background. Text needs 4.5:1, borders and rings 3:1. Cyan fails alone, so the ring keeps a dark edge."
    >
      <Swatches items={core} />
      <div className="mt-4 border-t border-(--ct-line) pt-4">
        <Swatches items={support} />
      </div>
    </Section>
  );
}
