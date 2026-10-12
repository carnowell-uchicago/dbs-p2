import { formatPlays, gameBySlug, games } from "@/data/games";
import { font, type } from "@/components/ds/cozy-pixel/styles";
import { Section } from "./frame";

const hay = gameBySlug("hay-runner");

const roles = [
  { role: "Display", spec: "Pixelify Sans 48 · 700", sample: <p className={type.display}>{games.length} games</p> },
  { role: "Heading", spec: "Pixelify Sans 24 · 700", sample: <p className={type.heading}>Hot this week</p> },
  { role: "Title", spec: "Pixelify Sans 18 · 600", sample: <p className={type.title}>Dungeon Dash</p> },
  { role: "Body", spec: "Lora 16 · 400", sample: <p className={type.body}>{hay.blurb}</p> },
  {
    role: "Label",
    spec: "Silkscreen 14 · 400",
    sample: (
      <p className={type.label}>
        {hay.category} · {formatPlays(hay.plays)}
      </p>
    ),
  },
];

export function TypeSection() {
  return (
    <Section n={2} id="type" title="Type roles" caption="Pixel fonts for short names and labels; Lora for every sentence. Display is 36px on phones.">
      <ul className="flex flex-col gap-4">
        {roles.map((r) => (
          <li key={r.role} className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-baseline gap-4">
            <div className="min-w-0">{r.sample}</div>
            <div className="flex flex-col text-right">
              <span className={`${font.display} text-sm font-semibold`}>{r.role}</span>
              <span className={`${font.body} text-sm text-(--cp-muted)`}>{r.spec}</span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
