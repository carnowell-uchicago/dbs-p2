import { gameBySlug, formatPlays } from "@/data/games";
import { Section, labelClass, mono } from "./parts";

const racer = gameBySlug("gridline-racer");
const dash = gameBySlug("dungeon-dash");

// Six sizes, three weights. Orbitron and Tektur stay in titles;
// Exo 2 carries anything you read; Share Tech Mono labels the numbers.
const roles = [
  {
    role: "Display",
    spec: "Orbitron · 700 · 48px / 1.05 (32px on mobile) · caps",
    use: "Hero game title, once per page.",
    sample: (
      <p
        className="text-[2rem] font-bold uppercase leading-[1.05] tracking-[0.06em] text-(--na-ice) sm:text-5xl"
        style={{ fontFamily: "var(--na-display)", textShadow: "0 0 6px var(--na-cyan), 0 0 20px color-mix(in srgb, var(--na-cyan) 60%, transparent)" }}
      >
        {dash.title}
      </p>
    ),
  },
  {
    role: "Heading",
    spec: "Tektur · 600 · 24px / 1.2",
    use: "Section and dialog titles.",
    sample: (
      <p className="text-2xl font-semibold leading-tight text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
        Hot this week
      </p>
    ),
  },
  {
    role: "Title",
    spec: "Tektur · 600 · 18px / 1.25",
    use: "Game names on cards and rows.",
    sample: (
      <p className="text-lg font-semibold leading-tight text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
        {racer.title}
      </p>
    ),
  },
  {
    role: "Body",
    spec: "Exo 2 · 400 · 16px / 1.6",
    use: "Blurbs and help text. 600 for emphasis.",
    sample: (
      <p className="max-w-prose text-base leading-relaxed text-(--na-ice)" style={{ fontFamily: "var(--na-body)" }}>
        {racer.blurb} <strong className="font-semibold">Best lap wins.</strong>
      </p>
    ),
  },
  {
    role: "Button",
    spec: "Orbitron · 700 · 14px · caps, 0.18em",
    use: "Button labels only.",
    sample: (
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-(--na-ice)" style={{ fontFamily: "var(--na-display)" }}>
        Play {racer.title}
      </p>
    ),
  },
  {
    role: "Label",
    spec: "Share Tech Mono · 400 · 12px / 1.4 · caps, 0.2em",
    use: "Categories, play counts, captions, chip text.",
    sample: (
      <p className="text-xs uppercase leading-snug tracking-[0.2em] text-(--na-muted)" style={mono}>
        {racer.category} · {formatPlays(racer.plays)} · ~{racer.minutes} min
      </p>
    ),
  },
];

export function TypeSection() {
  return (
    <Section
      id="type"
      index="02"
      title="Type"
      intro="Wide, squared letters for names. A calm, rounded sans for reading. Mono for the scoreboard."
    >
      <dl className="flex flex-col border-t border-(--na-line)">
        {roles.map((r) => (
          <div
            key={r.role}
            className="grid gap-3 border-b border-(--na-line) py-6 md:grid-cols-[14rem_1fr] md:gap-8"
          >
            <dt className="flex flex-col gap-1">
              <span className="text-base font-semibold text-(--na-ice)">{r.role}</span>
              <span className={labelClass} style={mono}>
                {r.spec}
              </span>
              <span className="text-base text-(--na-muted)">{r.use}</span>
            </dt>
            <dd className="min-w-0 self-center">{r.sample}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
