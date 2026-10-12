import type { ReactNode } from "react";
import { gameBySlug } from "@/data/games";
import { forcedStates, type ForcedState } from "@/lib/design-system";
import { Button } from "@/components/ds/neon-arcade/Button";
import { Chip } from "@/components/ds/neon-arcade/Chip";
import { Checkbox, Radio } from "@/components/ds/neon-arcade/Choice";
import { FavoriteButton } from "@/components/ds/neon-arcade/FavoriteButton";
import { SearchInput, Select } from "@/components/ds/neon-arcade/Field";
import { GameCard } from "@/components/ds/neon-arcade/GameCard";
import { ListRow } from "@/components/ds/neon-arcade/ListRow";
import { TabButton } from "@/components/ds/neon-arcade/Tabs";
import { TextLink } from "@/components/ds/neon-arcade/TextLink";
import { Toggle } from "@/components/ds/neon-arcade/Toggle";
import { Section, mono } from "./parts";

const hay = gameBySlug("hay-runner");
const golf = gameBySlug("pocket-golf");

type Row = { name: string; states: readonly ForcedState[]; render: (s: ForcedState) => ReactNode };

const all = forcedStates;
const noSelect = ["rest", "hover", "focus", "pressed", "disabled"] as const;

const rows: Row[] = [
  { name: "Primary", states: noSelect, render: (s) => <Button variant="primary" size="sm" force={s}>Play</Button> },
  { name: "Secondary", states: noSelect, render: (s) => <Button size="sm" force={s}>Reset</Button> },
  { name: "Link", states: ["rest", "hover", "focus", "pressed"], render: (s) => <TextLink href="#" force={s}>All games</TextLink> },
  {
    name: "Input",
    states: ["rest", "hover", "focus", "disabled"],
    render: (s) => <SearchInput label="Search" hideLabel placeholder="Golf" force={s} />,
  },
  {
    name: "Select",
    states: ["rest", "hover", "focus", "disabled"],
    render: (s) => (
      <Select label="Sort" hideLabel force={s}>
        <option>New</option>
      </Select>
    ),
  },
  { name: "Checkbox", states: all, render: (s) => <Checkbox force={s}>New</Checkbox> },
  { name: "Radio", states: all, render: (s) => <Radio force={s}>Quick</Radio> },
  { name: "Toggle", states: all, render: (s) => <Toggle force={s}>Sound</Toggle> },
  { name: "Tab", states: all, render: (s) => <TabButton force={s}>New</TabButton> },
  { name: "Chip", states: all, render: (s) => <Chip force={s}>Puzzle</Chip> },
  {
    name: "List row",
    states: ["rest", "hover", "focus", "pressed", "selected"],
    render: (s) => <ListRow game={hay} rank={1} force={s} compact />,
  },
  { name: "Favorite", states: all, render: (s) => <FavoriteButton title={hay.title} force={s} /> },
  {
    name: "Game card",
    states: ["rest", "hover", "focus", "pressed"],
    render: (s) => <GameCard game={golf} force={s} compact headingLevel="h4" />,
  },
];

const head = "px-2 pb-3 text-left text-xs font-normal uppercase tracking-[0.06em] text-(--na-muted)";

export function StatesSection() {
  return (
    <Section id="states" n={5} title="Control states" caption="Frozen copies. Selected means checked, on, current, or saved.">
      {/* Scrolls sideways on phones; the control name stays pinned. */}
      <div
        role="region"
        aria-label="Control states table"
        tabIndex={0}
        className="relative overflow-x-auto rounded-(--na-r-lg) border-2 border-(--na-line) bg-(--na-panel) [scrollbar-color:var(--na-edge)_transparent] [scrollbar-width:thin] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--na-cyan)"
      >
        <table inert className="w-full min-w-[52rem] table-fixed border-collapse" style={mono}>
          <colgroup>
            <col className="w-24" />
            {all.map((s) => (
              <col key={s} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b-2 border-(--na-line)">
              <th scope="col" className={`${head} sticky left-0 bg-(--na-panel) pt-3`}>
                <span className="sr-only">Control</span>
              </th>
              {all.map((s) => (
                <th key={s} scope="col" className={`${head} pt-3`}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b-2 border-(--na-line) last:border-b-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-(--na-panel) px-3 py-3 text-left text-xs font-normal uppercase tracking-[0.06em] text-(--na-ice)"
                >
                  {r.name}
                </th>
                {all.map((s) => (
                  <td key={s} className="px-2 py-3 align-middle">
                    {r.states.includes(s) ? (
                      r.render(s)
                    ) : (
                      <span className="text-(--na-line)" aria-hidden>
                        —
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
