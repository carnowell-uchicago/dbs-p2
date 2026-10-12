import { contrastRatio, formatRatio } from "@/lib/contrast";
import { hex } from "@/components/ds/cozy-pixel/tokens";
import { edge, font } from "@/components/ds/cozy-pixel/styles";
import { Section } from "./frame";

// Each swatch shows the ratio that matters for it: text colors against the
// parchment, fills against the cocoa text they carry. Borders need 3:1.
type Swatch = { key: string; name: string; pair?: [fg: string, bg: string]; note?: string };

const core: Swatch[] = [
  { key: "bg", name: "Background" },
  { key: "surface", name: "Surface" },
  { key: "text", name: "Text", pair: ["text", "bg"] },
  { key: "muted", name: "Muted", pair: ["muted", "bg"] },
  { key: "wood", name: "Border", pair: ["wood", "bg"] },
  { key: "accent", name: "Accent", pair: ["text", "accent"] },
];

const support: Swatch[] = [
  { key: "sunken", name: "Wheat", pair: ["muted", "sunken"] },
  { key: "bevel", name: "Bevel", note: "Decor only" },
  { key: "success", name: "Success", pair: ["text", "success"] },
  { key: "error", name: "Error", pair: ["error", "surface"] },
  { key: "new", name: "New", pair: ["text", "new"] },
  { key: "popular", name: "Hot", pair: ["text", "popular"] },
  { key: "favorite", name: "Favorite", pair: ["text", "favorite"] },
];

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-6 xl:grid-cols-3">
      {items.map((s) => (
        <li key={s.key} className="flex min-w-0 flex-col gap-1">
          <span
            aria-hidden
            style={{ ...edge, background: hex[s.key] }}
            className="mb-1 block h-10 [--w:2px] [--e:var(--cp-text)] [--d:0px]"
          />
          <span className={`${font.display} text-sm font-semibold`}>{s.name}</span>
          <span className={`${font.body} text-sm text-(--cp-muted) uppercase`}>{hex[s.key]}</span>
          <span className={`${font.body} text-sm font-semibold`}>
            {s.pair ? formatRatio(contrastRatio(hex[s.pair[0]], hex[s.pair[1]])) : s.note ?? "Base"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ColorSection() {
  return (
    <Section
      n={1}
      id="color"
      title="Color roles"
      caption="Text colors are measured on parchment, fills by the cocoa text they carry. Text needs 4.5:1, borders 3:1. Pumpkin is only for Play."
    >
      <Swatches items={core} />
      <Swatches items={support} />
    </Section>
  );
}
