import { contrastRatio, formatRatio, wcagLevel } from "@/lib/contrast";
import { colorRoles, contrastPairs } from "@/components/ds/console-tiles/tokens";
import { Panel, Section } from "./ui";

export function ColorSection() {
  return (
    <Section
      id="color"
      title="Color"
      intro="Gray and white do the work. Dark means chosen, the cyan ring means you are here, and red means Play."
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {colorRoles.map((c) => (
          <li key={c.cssVar} className="flex flex-col overflow-hidden rounded-2xl bg-(--ct-surface)">
            <span
              aria-hidden
              className="h-20 rounded-t-2xl shadow-[inset_0_0_0_1px_var(--ct-line)]"
              style={{ background: c.hex }}
            />
            <div className="flex flex-1 flex-col gap-1 p-4">
              <p className="flex items-baseline justify-between gap-2">
                <span className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
                  {c.role}
                </span>
                <span className="text-sm text-(--ct-muted) tabular-nums">{c.hex}</span>
              </p>
              <p className="text-sm">{c.purpose}</p>
              {c.note && <p className="mt-auto pt-2 text-sm text-(--ct-muted)">{c.note}</p>}
            </div>
          </li>
        ))}
      </ul>

      <Panel className="mt-6">
        <h3 className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          Contrast
        </h3>
        <p className="mt-1 text-sm text-(--ct-muted)">
          Text needs 4.5:1. Borders, rings, and other non-text parts need 3:1.
        </p>
        <table className="mt-4 w-full border-collapse text-left text-sm">
          <thead className="text-(--ct-muted)">
            <tr className="border-b border-(--ct-line)">
              <th scope="col" className="py-2 pr-3 font-semibold">
                <span className="sr-only">Sample</span>
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold">Pair</th>
              <th scope="col" className="py-2 text-right font-semibold">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {contrastPairs.map((p) => {
              const ratio = contrastRatio(p.fg, p.bg);
              const pass = ratio >= p.min;
              return (
                <tr key={p.use} className="border-b border-(--ct-line) last:border-0">
                  <td className="py-2.5 pr-3">
                    <span
                      aria-hidden
                      className="grid h-9 w-12 place-items-center rounded-lg text-base font-bold shadow-[inset_0_0_0_1px_var(--ct-line)]"
                      style={{ background: p.bg, color: p.fg }}
                    >
                      Aa
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="block font-semibold">{p.use}</span>
                    <span className="text-(--ct-muted) tabular-nums">
                      {p.fg} on {p.bg} · needs {p.min}:1
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="block pb-1 font-semibold tabular-nums">{formatRatio(ratio)}</span>
                    <span
                      className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-bold whitespace-nowrap uppercase ${
                        pass ? "bg-(--ct-text) text-white" : "bg-(--ct-attention) text-(--ct-text)"
                      }`}
                    >
                      {!pass ? "Fails alone" : p.min === 3 ? "Pass" : wcagLevel(ratio)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </Section>
  );
}
