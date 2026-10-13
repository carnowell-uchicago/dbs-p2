import { Section } from "./ui";

const space = [4, 8, 12, 16, 24, 32, 48];

const radii = [
  { name: "8", cls: "rounded-lg" },
  { name: "16", cls: "rounded-2xl" },
  { name: "24", cls: "rounded-3xl" },
  { name: "Full", cls: "rounded-full" },
];

export function SpacingSection() {
  return (
    <Section
      id="spacing"
      n={3}
      title="Spacing and shape"
      caption="4px base. Round to press, soft square to hold a game. 1px borders, a cyan ring with a gap, deep shadows."
    >
      <div className="flex flex-col gap-5">
        <ul aria-label="Spacing scale in pixels" className="flex items-end gap-3">
          {space.map((s) => (
            <li key={s} className="flex flex-col items-center gap-1.5">
              <span aria-hidden className="w-5 rounded-t-sm bg-(--ct-text)" style={{ height: s * 1.5 }} />
              <span className="text-xs text-(--ct-muted) tabular-nums">{s}</span>
            </li>
          ))}
        </ul>

        <ul aria-label="Corner radii in pixels" className="flex gap-3">
          {radii.map((r) => (
            <li key={r.name} className="flex flex-col items-center gap-1.5">
              <span aria-hidden className={`size-12 bg-(--ct-bg) shadow-[inset_0_0_0_2px_var(--ct-text)] ${r.cls}`} />
              <span className="text-xs text-(--ct-muted)">{r.name}</span>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap gap-x-5 gap-y-3">
          <li className="flex flex-col items-center gap-3">
            <span aria-hidden className="h-9 w-16 rounded-full border border-(--ct-control) bg-(--ct-surface)" />
            <span className="text-xs text-(--ct-muted)">Border 1px</span>
          </li>
          {/* The ring draws 6px outside the shape. Side padding keeps it clear of its
              neighbors; the row's 12px label gap keeps it clear of its label. */}
          <li className="flex flex-col items-center gap-3">
            <span className="px-[6px]">
              <span
                aria-hidden
                className="block h-9 w-16 rounded-full bg-(--ct-surface) outline-[3px] outline-solid outline-offset-[3px] outline-(--ct-select)"
              />
            </span>
            <span className="text-xs text-(--ct-muted)">Ring</span>
          </li>
          <li className="flex flex-col items-center gap-3">
            <span aria-hidden className="h-9 w-16 rounded-xl bg-(--ct-surface) shadow-[0_10px_24px_rgb(0_0_0/0.5)]" />
            <span className="text-xs text-(--ct-muted)">Lift</span>
          </li>
          <li className="flex flex-col items-center gap-3">
            <span aria-hidden className="h-9 w-16 rounded-xl bg-(--ct-surface) shadow-[0_24px_60px_rgb(0_0_0/0.6)]" />
            <span className="text-xs text-(--ct-muted)">Dialog</span>
          </li>
        </ul>
      </div>
    </Section>
  );
}
