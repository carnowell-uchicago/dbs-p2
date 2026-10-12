import { Caption, Panel, Section } from "./ui";

const space = [4, 8, 12, 16, 24, 32, 48];

const radii = [
  { name: "8px", use: "Thumbnails in rows", cls: "rounded-lg" },
  { name: "16px", use: "Tiles and cards", cls: "rounded-2xl" },
  { name: "24px", use: "Panels and dialog", cls: "rounded-3xl" },
  { name: "Full", use: "Buttons, chips, inputs", cls: "rounded-full" },
];

const borders = [
  { name: "1px divider", use: "Between rows", cls: "border border-(--ct-line)" },
  { name: "1px border", use: "Inputs, chips, secondary", cls: "border border-(--ct-control)" },
  { name: "2px border", use: "Checkboxes, radios", cls: "border-2 border-(--ct-control)" },
  {
    name: "Selection ring",
    use: "2px gap, 3px cyan, 2px dark",
    cls: "outline-2 outline-offset-[5px] outline-(--ct-text) ring-[3px] ring-(--ct-select) ring-offset-2 ring-offset-(--ct-surface)",
  },
];

const shadows = [
  { name: "Rest", use: "Tiles sit on the page", value: "0 1px 3px rgb(0 0 0 / 0.08)" },
  { name: "Lift", use: "Hovered tile, chip, button", value: "0 10px 24px rgb(0 0 0 / 0.14)" },
  { name: "Dialog", use: "Detail panel over the page", value: "0 24px 60px rgb(0 0 0 / 0.3)" },
];

export function SpacingSection() {
  return (
    <Section
      id="spacing"
      title="Spacing and shape"
      intro="A 4px base. Everything you can press is round; everything that holds a game is a soft square."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="flex flex-col gap-4">
          <Caption>Spacing scale</Caption>
          <ul className="flex flex-col gap-2.5">
            {space.map((s) => (
              <li key={s} className="flex items-center gap-4">
                <span className="w-10 text-right text-sm font-semibold tabular-nums">{s}</span>
                <span aria-hidden className="h-4 rounded-sm bg-(--ct-text)" style={{ width: s * 4 }} />
                <span className="sr-only">{s} pixels</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-(--ct-muted)">Gaps between tiles are 16px; panel padding is 24px (20px on phones).</p>
        </Panel>

        <Panel className="flex flex-col gap-4">
          <Caption>Corners</Caption>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {radii.map((r) => (
              <li key={r.name} className="flex flex-col gap-2">
                <span aria-hidden className={`h-16 bg-(--ct-bg) shadow-[inset_0_0_0_2px_var(--ct-text)] ${r.cls}`} />
                <span className="text-sm font-semibold">{r.name}</span>
                <span className="text-sm text-(--ct-muted)">{r.use}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="flex flex-col gap-4">
          <Caption>Borders and ring</Caption>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
            {borders.map((b) => (
              <li key={b.name} className="flex flex-col gap-2">
                <span aria-hidden className="p-2">
                  <span className={`block h-12 rounded-2xl bg-(--ct-surface) ${b.cls}`} />
                </span>
                <span className="text-sm font-semibold">{b.name}</span>
                <span className="text-sm text-(--ct-muted)">{b.use}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="flex flex-col gap-4 bg-(--ct-bg)! shadow-[inset_0_0_0_1px_var(--ct-line)]">
          <Caption>Shadow</Caption>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {shadows.map((s) => (
              <li key={s.name} className="flex flex-col gap-2">
                <span aria-hidden className="h-16 rounded-2xl bg-(--ct-surface)" style={{ boxShadow: s.value }} />
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="text-sm text-(--ct-muted)">{s.use}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  );
}
