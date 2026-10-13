import { Fragment, type ReactNode } from "react";
import { gameBySlug } from "@/data/games";
import { forcedStates, type ForcedState } from "@/lib/design-system";
import { Button } from "@/components/ds/console-tiles/Button";
import { Chip } from "@/components/ds/console-tiles/Chip";
import { FavoriteButton } from "@/components/ds/console-tiles/FavoriteButton";
import { Checkbox, Radio, SearchField, SelectField, Toggle } from "@/components/ds/console-tiles/Fields";
import { GameTile } from "@/components/ds/console-tiles/GameTile";
import { PlayIcon } from "@/components/ds/console-tiles/Icons";
import { ListRow } from "@/components/ds/console-tiles/ListRow";
import { focusRing } from "@/components/ds/console-tiles/styles";
import { TabButton } from "@/components/ds/console-tiles/Tabs";
import { TextLink } from "@/components/ds/console-tiles/TextLink";
import { Section } from "./ui";

const hay = gameBySlug("hay-runner");

const heads: Record<ForcedState, string> = {
  rest: "Rest",
  hover: "Hover",
  focus: "Focus",
  pressed: "Pressed",
  selected: "Selected",
  disabled: "Disabled",
};

const press: ForcedState[] = ["rest", "hover", "focus", "pressed", "disabled"];
const field: ForcedState[] = ["rest", "hover", "focus", "disabled"];

type Row = { label: string; states: readonly ForcedState[]; render: (s: ForcedState) => ReactNode };

const rows: Row[] = [
  {
    label: "Primary",
    states: press,
    render: (s) => (
      <Button variant="primary" force={s}>
        <PlayIcon /> Play
      </Button>
    ),
  },
  { label: "Secondary", states: press, render: (s) => <Button force={s}>See all</Button> },
  {
    label: "Link",
    states: ["rest", "hover", "focus", "pressed"],
    render: (s) => (
      <TextLink href="/play" force={s}>
        All games
      </TextLink>
    ),
  },
  {
    label: "Search",
    states: field,
    render: (s) => <SearchField label="Search" hideLabel placeholder="Golf" force={s} className="w-[calc(100%-0.875rem)]" />,
  },
  {
    label: "Select",
    states: field,
    render: (s) => (
      <SelectField label="Sort" hideLabel force={s} className="w-[calc(100%-0.875rem)]">
        <option>New</option>
      </SelectField>
    ),
  },
  { label: "Checkbox", states: forcedStates, render: (s) => <Checkbox label="New" force={s} /> },
  { label: "Radio", states: forcedStates, render: (s) => <Radio name={`states-radio-${s}`} label="Any" force={s} /> },
  { label: "Toggle", states: forcedStates, render: (s) => <Toggle label="Sound" force={s} /> },
  { label: "Tab", states: forcedStates, render: (s) => <TabButton force={s}>Popular</TabButton> },
  { label: "Chip", states: forcedStates, render: (s) => <Chip force={s}>Puzzle</Chip> },
  {
    label: "List row",
    states: ["rest", "hover", "focus", "pressed", "selected"],
    render: (s) => <ListRow game={hay} compact force={s} />,
  },
  { label: "Favorite", states: forcedStates, render: (s) => <FavoriteButton title={hay.title} force={s} /> },
  {
    label: "Home tile",
    states: ["rest", "hover", "focus", "pressed"],
    render: (s) => <GameTile game={hay} force={s} className="w-24" />,
  },
];

const cell = "flex min-w-0 items-center border-t border-(--ct-line) px-1.5 py-3";

export function StatesSection() {
  return (
    <Section
      id="states"
      n={5}
      title="Control states"
      caption="Every control frozen in each state. A bright fill or a check means selected; the cyan ring means focus."
    >
      <div role="region" aria-label="Control states" tabIndex={0} className={`relative overflow-x-auto rounded-xl ${focusRing}`}>
        <div inert className="grid min-w-[54rem] grid-cols-[5.5rem_repeat(6,minmax(0,1fr))]">
          <span className="sticky left-0 z-10 bg-(--ct-surface)" />
          {forcedStates.map((s) => (
            <span key={s} className="px-1.5 pb-2 text-xs font-bold tracking-wide text-(--ct-muted) uppercase">
              {heads[s]}
            </span>
          ))}
          {rows.map((r) => (
            <Fragment key={r.label}>
              <span className={`${cell} sticky left-0 z-10 bg-(--ct-surface) pr-2 text-sm font-semibold`}>{r.label}</span>
              {forcedStates.map((s) => (
                <span key={s} className={cell}>
                  {r.states.includes(s) ? r.render(s) : <span className="text-sm text-(--ct-muted)">—</span>}
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </Section>
  );
}
