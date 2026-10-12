import type { ReactNode } from "react";
import { formatPlays, gameBySlug } from "@/data/games";
import { Section } from "./ui";

const game = gameBySlug("hay-runner");
const display = { fontFamily: "var(--ct-display)" };

const roles: { role: string; spec: string; sample: ReactNode }[] = [
  {
    role: "Display",
    spec: "Rubik 40px · 700",
    sample: (
      <p className="text-[2rem] leading-[1.1] font-bold sm:text-[2.5rem]" style={display}>
        {game.title}
      </p>
    ),
  },
  {
    role: "Heading",
    spec: "Rubik 24px · 600",
    sample: (
      <p className="text-2xl leading-tight font-semibold" style={display}>
        Popular this week
      </p>
    ),
  },
  {
    role: "Body",
    spec: "Figtree 16px · 400",
    sample: <p className="text-base leading-normal">{game.blurb}</p>,
  },
  {
    role: "Label",
    spec: "Figtree 14px · 600",
    sample: (
      <p className="text-sm font-semibold">
        {game.category} · {formatPlays(game.plays)}
      </p>
    ),
  },
  {
    role: "Caption",
    spec: "Figtree 12px · 700",
    sample: <p className="text-xs font-bold tracking-wide uppercase">Hot · New</p>,
  },
];

export function TypeSection() {
  return (
    <Section id="type" n={2} title="Type roles" caption="Five sizes, three weights. Display is 32px on phones.">
      <ul className="divide-y divide-(--ct-line)">
        {roles.map((r) => (
          <li key={r.role} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 py-3 first:pt-0">
            <div className="min-w-0">{r.sample}</div>
            <div className="text-right">
              <p className="text-xs font-bold tracking-wide uppercase">{r.role}</p>
              <p className="text-xs whitespace-nowrap text-(--ct-muted)">{r.spec}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
