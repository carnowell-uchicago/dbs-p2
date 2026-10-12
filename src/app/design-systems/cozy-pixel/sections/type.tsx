import { formatPlays, gameBySlug } from "@/data/games";
import { type } from "@/components/ds/cozy-pixel/styles";
import { Section } from "./showcase";

const dash = gameBySlug("dungeon-dash");
const hay = gameBySlug("hay-runner");

const roles = [
  {
    role: "Display",
    spec: "Pixelify Sans · Bold 700 · 48px, 36px on phones · line height 1",
    use: "The one big line per page.",
    sample: <p className={type.display}>LazyDonkeyGames</p>,
  },
  {
    role: "Heading",
    spec: "Pixelify Sans · Bold 700 · 24px · line height 1.25",
    use: "Section titles and the dialog title.",
    sample: <p className={type.heading}>Hot this week</p>,
  },
  {
    role: "Title",
    spec: "Pixelify Sans · Semibold 600 · 18px · line height 1.375",
    use: "Game names on cards, buttons, tabs.",
    sample: <p className={type.title}>{dash.title}</p>,
  },
  {
    role: "Body",
    spec: "Lora · Regular 400 · 16px · line height 1.625",
    use: "Anything people read: blurbs, help, messages.",
    sample: <p className={`${type.body} max-w-prose`}>{hay.blurb}</p>,
  },
  {
    role: "Label",
    spec: "Silkscreen · Regular 400 · 14px · uppercase",
    use: "Badges, field labels, captions. Two or three words at most.",
    sample: (
      <p className={type.label}>
        {hay.category} · {formatPlays(hay.plays)}
      </p>
    ),
  },
];

export function TypeSection() {
  return (
    <Section
      id="type"
      title="Type"
      intro="Pixel fonts set the mood in short bursts; Lora carries every sentence so reading stays easy. Five sizes and three weights cover the whole site."
    >
      <ul className="flex flex-col">
        {roles.map((r) => (
          <li
            key={r.role}
            className="grid gap-3 border-t-2 border-(--cp-sunken) py-6 md:grid-cols-[14rem_1fr] md:gap-8"
          >
            <div className="flex flex-col gap-1">
              <span className={type.title}>{r.role}</span>
              <span className={`${type.body} text-(--cp-muted)`}>{r.spec}</span>
              <span className={`${type.body} text-(--cp-muted)`}>{r.use}</span>
            </div>
            <div className="min-w-0 self-center break-words">{r.sample}</div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
