import { contrastRatio, formatRatio, wcagLevel } from "@/lib/contrast";
import { core, hex, pairs, shades, support, tints, type Token } from "@/components/ds/cozy-pixel/tokens";
import { edge, font, type } from "@/components/ds/cozy-pixel/styles";
import { Caption, Section } from "./showcase";

const nameOf = Object.fromEntries(
  [...core, ...support, ...tints, ...shades].map((t) => [t.cssVar.replace("--cp-", ""), t.name]),
);

function Swatch({ token }: { token: Token }) {
  return (
    <li className="flex min-w-0 flex-col gap-3">
      <span
        aria-hidden
        style={{ ...edge, background: token.hex }}
        className="block h-16 [--w:3px] [--e:var(--cp-text)] [--d:0px]"
      />
      <span className="flex flex-col gap-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className={type.title}>{token.role}</span>
          <span className={`${type.label} text-(--cp-muted)`}>{token.hex}</span>
        </span>
        <span className={`${font.body} text-base text-(--cp-muted)`}>
          {token.name}. {token.purpose}
        </span>
      </span>
    </li>
  );
}

function SwatchGroup({ title, tokens }: { title: string; tokens: Token[] }) {
  return (
    <div className="flex flex-col gap-4">
      <Caption>{title}</Caption>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {tokens.map((t) => (
          <Swatch key={t.cssVar} token={t} />
        ))}
      </ul>
    </div>
  );
}

function ContrastTable() {
  return (
    <div className="flex flex-col gap-4">
      <Caption>Contrast, computed (WCAG 2)</Caption>
      <table className={`${font.body} w-full border-collapse text-left text-base`}>
        <thead>
          <tr className={`${type.label} text-(--cp-muted)`}>
            <th scope="col" className="pr-3 pb-2 font-normal">
              Sample
            </th>
            <th scope="col" className="pr-3 pb-2 font-normal">
              Pair
            </th>
            <th scope="col" className="pr-3 pb-2 text-right font-normal">
              Ratio
            </th>
            <th scope="col" className="pb-2 text-right font-normal">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p) => {
            const ratio = contrastRatio(hex[p.fg], hex[p.bg]);
            const level = wcagLevel(ratio);
            const passes = p.kind === "text" ? ratio >= 4.5 : ratio >= 3;
            return (
              <tr key={`${p.fg}-${p.bg}-${p.use}`} className="border-t-2 border-(--cp-sunken) align-middle">
                <td className="py-2 pr-3">
                  {p.kind === "text" ? (
                    <span
                      aria-hidden
                      style={{ color: hex[p.fg], background: hex[p.bg] }}
                      className={`${font.display} inline-grid h-9 w-12 place-items-center text-lg font-bold shadow-[0_0_0_2px_var(--cp-wood)]`}
                    >
                      Aa
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      style={{ background: hex[p.bg] }}
                      className="inline-grid h-9 w-12 place-items-center shadow-[0_0_0_2px_var(--cp-sunken)]"
                    >
                      <span style={{ outline: `3px solid ${hex[p.fg]}` }} className="block size-4" />
                    </span>
                  )}
                </td>
                <td className="py-2 pr-3">
                  <span className="block font-semibold">
                    {nameOf[p.fg]} on {nameOf[p.bg]}
                  </span>
                  <span className="block text-(--cp-muted)">{p.use}</span>
                </td>
                <td className={`${font.display} py-2 pr-3 text-right font-semibold whitespace-nowrap`}>
                  {formatRatio(ratio)}
                </td>
                <td className="py-2 text-right whitespace-nowrap">
                  <span className={`${font.display} font-semibold ${passes ? "" : "text-(--cp-error)"}`}>
                    {!passes ? `Fail (${level})` : p.kind === "text" ? level : "Pass"}
                  </span>
                  <span className="block text-(--cp-muted)">{p.kind === "text" ? "needs 4.5" : "needs 3"}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ColorSection() {
  return (
    <Section
      id="color"
      title="Color"
      intro="Every color has one job. Colored fills take cocoa text, and cream text only sits on dark wood. Pumpkin means “this is the main action”, so it appears nowhere else."
    >
      <div className="flex flex-col gap-12">
        <SwatchGroup title="Core roles" tokens={core} />
        <SwatchGroup title="Support" tokens={support} />
        <SwatchGroup title="Game tags" tokens={tints} />
        <SwatchGroup title="Hover and pressed shades" tokens={shades} />
        <ContrastTable />
      </div>
    </Section>
  );
}
