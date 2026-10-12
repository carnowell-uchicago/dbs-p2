import { colors, hex } from "@/components/ds/neon-arcade/tokens";
import { contrastRatio, formatRatio, wcagLevel } from "@/lib/contrast";
import { Section, labelClass, mono } from "./parts";

type Pair = {
  fg: Parameters<typeof hex>[0];
  bg: Parameters<typeof hex>[0];
  use: string;
  kind: "text" | "ui" | "decor";
};

// Every pairing the system actually uses.
const pairs: Pair[] = [
  { fg: "--na-ice", bg: "--na-void", use: "Text on background", kind: "text" },
  { fg: "--na-ice", bg: "--na-panel", use: "Text on surface", kind: "text" },
  { fg: "--na-ice", bg: "--na-raised", use: "Text on hovered surface", kind: "text" },
  { fg: "--na-muted", bg: "--na-void", use: "Muted text on background", kind: "text" },
  { fg: "--na-muted", bg: "--na-panel", use: "Muted text on surface", kind: "text" },
  { fg: "--na-muted", bg: "--na-raised", use: "Muted text on hovered surface", kind: "text" },
  { fg: "--na-void", bg: "--na-orange", use: "Play label on accent", kind: "text" },
  { fg: "--na-void", bg: "--na-orange-hot", use: "Play label on accent, hover", kind: "text" },
  { fg: "--na-cyan", bg: "--na-void", use: "Link and selected text", kind: "text" },
  { fg: "--na-magenta", bg: "--na-void", use: "Hot badge", kind: "text" },
  { fg: "--na-green", bg: "--na-panel", use: "Success message", kind: "text" },
  { fg: "--na-red", bg: "--na-panel", use: "Error message", kind: "text" },
  { fg: "--na-edge", bg: "--na-void", use: "Control border on background", kind: "ui" },
  { fg: "--na-edge", bg: "--na-panel", use: "Control border on surface", kind: "ui" },
  { fg: "--na-cyan", bg: "--na-void", use: "Focus ring", kind: "ui" },
  { fg: "--na-line", bg: "--na-void", use: "Divider (decorative)", kind: "decor" },
];

function verdict(ratio: number, kind: Pair["kind"]) {
  if (kind === "decor") return { text: "Exempt", ok: true };
  if (kind === "ui") return ratio >= 3 ? { text: "Pass 3:1", ok: true } : { text: "Fail", ok: false };
  const level = wcagLevel(ratio);
  return { text: level, ok: level === "AA" || level === "AAA" };
}

export function ColorSection() {
  return (
    <Section
      id="color"
      index="01"
      title="Color"
      intro="Light on dark. Cyan is the structural light (focus, selection, links). Orange is the accent and only the Play button wears it."
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {colors.map((c) => (
          <li key={c.token} className="flex flex-col border border-(--na-line) bg-(--na-panel)">
            <span
              className="h-16 border-b border-(--na-line)"
              style={{ background: `var(${c.token})` }}
              aria-hidden
            />
            <span className="flex flex-1 flex-col gap-1 p-3">
              <span className={labelClass} style={mono}>
                {c.role}
              </span>
              <span className="text-base font-semibold text-(--na-ice)">{c.name}</span>
              <span className="text-xs uppercase tracking-[0.1em] text-(--na-muted)" style={mono}>
                {c.hex}
              </span>
              <span className="mt-1 text-base text-(--na-muted)">{c.purpose}</span>
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-12 text-lg font-semibold text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
        Contrast
      </h3>
      <p className="mt-1 max-w-2xl text-base text-(--na-muted)">
        WCAG 2 ratios, computed from the hex values. Text needs 4.5:1, control borders and focus rings 3:1.
      </p>
      <div className="mt-4 overflow-x-auto border border-(--na-line)">
        <table className="w-full min-w-[20rem] text-left text-base">
          <thead className={labelClass} style={mono}>
            <tr className="border-b border-(--na-line) bg-(--na-panel)">
              <th scope="col" className="px-3 py-2 font-normal">Pair</th>
              <th scope="col" className="px-3 py-2 font-normal">Ratio</th>
              <th scope="col" className="px-3 py-2 font-normal">Level</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p) => {
              const ratio = contrastRatio(hex(p.fg), hex(p.bg));
              const v = verdict(ratio, p.kind);
              return (
                <tr key={p.use} className="border-b border-(--na-line) last:border-b-0">
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-3">
                      <span
                        className="grid h-8 w-12 shrink-0 place-items-center border border-(--na-line) text-base font-semibold"
                        style={
                          p.kind === "text"
                            ? { background: `var(${p.bg})`, color: `var(${p.fg})` }
                            : { background: `var(${p.bg})`, boxShadow: `inset 0 0 0 2px var(${p.fg})` }
                        }
                        aria-hidden
                      >
                        {p.kind === "text" ? "Aa" : ""}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-(--na-ice)">{p.use}</span>
                        <span className="text-xs uppercase tracking-[0.1em] text-(--na-muted)" style={mono}>
                          {hex(p.fg)} on {hex(p.bg)}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-(--na-ice)" style={mono}>
                    {formatRatio(ratio)}
                  </td>
                  <td className="px-3 py-2.5" style={mono}>
                    <span className={v.ok ? "text-(--na-ice)" : "text-(--na-red)"}>{v.text}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 max-w-2xl text-base text-(--na-muted)">
        Changes from the mood board: the board&rsquo;s Line ({formatRatio(contrastRatio(hex("--na-line"), hex("--na-void")))}) was too faint to outline controls, so
        it is kept for dividers only and Edge was added for borders. Raised, Orange hot, Green, and Red
        were added for hover, success, and error.
      </p>
    </Section>
  );
}
