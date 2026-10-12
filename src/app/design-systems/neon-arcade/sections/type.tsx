import type { ReactNode } from "react";
import { gameBySlug, formatPlays } from "@/data/games";
import { Cap, Section } from "./parts";

const hay = gameBySlug("hay-runner");
const racer = gameBySlug("gridline-racer");

const roles: { role: string; spec: string; sample: ReactNode }[] = [
  {
    role: "Display",
    spec: "Orbitron 700 · 40px",
    sample: (
      <p
        className="text-[2rem] font-bold uppercase leading-[1.05] tracking-[0.06em] text-(--na-ice) sm:text-[2.5rem]"
        style={{
          fontFamily: "var(--na-display)",
          textShadow: "0 0 6px var(--na-cyan), 0 0 20px color-mix(in srgb, var(--na-cyan) 60%, transparent)",
        }}
      >
        {hay.title}
      </p>
    ),
  },
  {
    role: "Heading",
    spec: "Tektur 600 · 24px",
    sample: (
      <p className="text-2xl font-semibold leading-tight text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
        Hot this week
      </p>
    ),
  },
  {
    role: "Title",
    spec: "Tektur 600 · 18px",
    sample: (
      <p className="text-lg font-semibold leading-tight text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
        {racer.title}
      </p>
    ),
  },
  {
    role: "Body",
    spec: "Exo 2 400 · 16px",
    sample: <p className="text-base leading-relaxed text-(--na-ice)">{racer.blurb}</p>,
  },
  {
    role: "Label",
    spec: "Share Tech Mono · 12px",
    sample: (
      <p className="text-xs uppercase tracking-[0.2em] text-(--na-muted)" style={{ fontFamily: "var(--na-mono)" }}>
        {racer.category} · {formatPlays(racer.plays)}
      </p>
    ),
  },
];

export function TypeSection() {
  return (
    <Section id="type" n={2} title="Type roles" caption="Button labels: Orbitron 700 · 14px caps.">
      <ul className="flex flex-col divide-y divide-(--na-line) border-y border-(--na-line)">
        {roles.map((r) => (
          <li key={r.role} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <div className="min-w-0 max-w-full">{r.sample}</div>
            <div className="ml-auto flex shrink-0 flex-col items-end">
              <span className="text-sm font-semibold text-(--na-ice)">{r.role}</span>
              <Cap className="tracking-[0.08em]">{r.spec}</Cap>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
