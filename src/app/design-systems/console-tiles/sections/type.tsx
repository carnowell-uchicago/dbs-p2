import { formatPlays, gameBySlug } from "@/data/games";
import { Panel, Section } from "./ui";

const game = gameBySlug("hay-runner");

const roles = [
  {
    role: "Display",
    spec: "Rubik · 40px / 1.1 · 700 · 32px on phones",
    sample: (
      <p className="text-[2rem] leading-[1.1] font-bold sm:text-[2.5rem]" style={{ fontFamily: "var(--ct-display)" }}>
        {game.title}
      </p>
    ),
  },
  {
    role: "Heading",
    spec: "Rubik · 24px / 1.25 · 600 · tile titles at 16px",
    sample: (
      <div className="flex flex-col gap-1">
        <p className="text-2xl leading-tight font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          Popular this week
        </p>
        <p className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          Dungeon Dash
        </p>
      </div>
    ),
  },
  {
    role: "Body",
    spec: "Figtree · 16px / 1.5 · 400",
    sample: <p className="max-w-prose text-base leading-normal">{game.blurb}</p>,
  },
  {
    role: "Label",
    spec: "Figtree · 14px / 1.3 · 600, meta lines at 400",
    sample: (
      <div className="flex flex-col gap-1 text-sm leading-snug">
        <p className="font-semibold">Sort by</p>
        <p className="text-(--ct-muted)">
          {game.category} · {formatPlays(game.plays)}
        </p>
      </div>
    ),
  },
  {
    role: "Caption",
    spec: "Figtree · 12px / 1.3 · 700 · uppercase, badges and captions only",
    sample: <p className="text-xs font-bold tracking-wide uppercase">Hot · New</p>,
  },
];

export function TypeSection() {
  return (
    <Section
      id="type"
      title="Type"
      intro="Rubik for names you scan, Figtree for everything you read. Five sizes, three weights."
    >
      <Panel className="divide-y divide-(--ct-line) py-1 sm:py-2">
        {roles.map((r) => (
          <div key={r.role} className="grid gap-3 py-5 md:grid-cols-[12rem_1fr] md:gap-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
                {r.role}
              </h3>
              <p className="text-sm text-(--ct-muted)">{r.spec}</p>
            </div>
            <div className="min-w-0">{r.sample}</div>
          </div>
        ))}
      </Panel>
    </Section>
  );
}
