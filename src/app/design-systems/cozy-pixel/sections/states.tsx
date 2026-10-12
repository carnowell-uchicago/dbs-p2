import type { ReactNode } from "react";
import { gameBySlug } from "@/data/games";
import { forcedStates, type ForcedState } from "@/lib/design-system";
import { Button } from "@/components/ds/cozy-pixel/Button";
import { Chip } from "@/components/ds/cozy-pixel/Chip";
import { Checkbox, Radio, SearchInput, Select, Toggle } from "@/components/ds/cozy-pixel/Fields";
import { GameCard, ListRow } from "@/components/ds/cozy-pixel/GameCard";
import { FavoriteButton } from "@/components/ds/cozy-pixel/Meta";
import { TabButton } from "@/components/ds/cozy-pixel/Tabs";
import { TextLink } from "@/components/ds/cozy-pixel/TextLink";
import { font } from "@/components/ds/cozy-pixel/styles";
import { Caption, Section } from "./frame";

// Every control frozen in each state it has. The whole table is `inert`, so
// keyboard users only meet the live components above. Narrow widths get one
// block per control with a captioned 3-column grid; a 48rem container gets the table.

const hay = gameBySlug("hay-runner");
const golf = gameBySlug("pocket-golf");

type Cells = Partial<Record<ForcedState, ReactNode>>;

function each(states: ForcedState[], render: (s: ForcedState) => ReactNode): Cells {
  return Object.fromEntries(states.map((s) => [s, render(s)]));
}

const pointer: ForcedState[] = ["rest", "hover", "focus", "pressed", "disabled"];
const field: ForcedState[] = ["rest", "hover", "focus", "disabled"];
const all = [...forcedStates];

const rows: { name: string; cells: Cells }[] = [
  {
    name: "Primary",
    cells: each(pointer, (s) => (
      <Button variant="primary" force={s}>
        Play
      </Button>
    )),
  },
  { name: "Secondary", cells: each(pointer, (s) => <Button force={s}>Details</Button>) },
  {
    name: "Link",
    cells: each(["rest", "hover", "focus", "pressed"], (s) => (
      <TextLink href="/play" force={s}>
        All games
      </TextLink>
    )),
  },
  {
    name: "Search",
    cells: each(field, (s) => (
      <SearchInput
        id={`cp-st-search-${s}`}
        label="Search games"
        hideLabel
        placeholder="Golf"
        defaultValue={s === "focus" ? "golf" : undefined}
        force={s}
        className="w-[calc(100%-0.75rem)]"
      />
    )),
  },
  {
    name: "Select",
    cells: each(field, (s) => (
      <Select id={`cp-st-sort-${s}`} label="Sort by" hideLabel defaultValue="new" force={s} className="w-[calc(100%-0.75rem)]">
        <option value="new">New</option>
      </Select>
    )),
  },
  { name: "Checkbox", cells: each(all, (s) => <Checkbox label="New" force={s} />) },
  { name: "Radio", cells: each(all, (s) => <Radio name={`cp-st-radio-${s}`} label="Quick" force={s} />) },
  {
    name: "Toggle",
    cells: each(all, (s) => <Toggle label={<span className="sr-only">Sound</span>} force={s} />),
  },
  {
    name: "Tab",
    cells: each(all, (s) => (
      <div className="bg-(--cp-sunken) px-2 pt-2">
        <TabButton selected={s === "selected"} force={s}>
          New
        </TabButton>
      </div>
    )),
  },
  { name: "Chip", cells: each(all, (s) => <Chip force={s}>Puzzle</Chip>) },
  {
    name: "Favorite",
    cells: each(all, (s) => <FavoriteButton on={s === "selected"} force={s} showLabel={false} />),
  },
  {
    name: "List row",
    cells: each(["rest", "hover", "focus", "pressed", "selected"], (s) => (
      <div className="w-full bg-(--cp-surface) shadow-[0_0_0_2px_var(--cp-wood)]">
        <ListRow game={hay} force={s} compact />
      </div>
    )),
  },
  {
    name: "Game card",
    cells: each(["rest", "hover", "focus", "pressed"], (s) => <GameCard game={golf} force={s} compact />),
  },
];

const tableCols = "@3xl:grid-cols-[5.5rem_repeat(6,minmax(0,1fr))]";
const rowName = `${font.display} text-base font-semibold`;

function StateTable() {
  return (
    <div>
      <div className={`hidden gap-x-2 border-b-2 border-(--cp-sunken) pb-2 @3xl:grid ${tableCols}`}>
        <span />
        {all.map((s) => (
          <Caption key={s}>{s}</Caption>
        ))}
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          className={`grid grid-cols-3 gap-x-2 gap-y-3 border-b-2 border-(--cp-sunken) py-3 @3xl:items-center ${tableCols}`}
        >
          <span className={`${rowName} col-span-3 @3xl:col-span-1`}>{r.name}</span>
          {all.map((s) =>
            r.cells[s] ? (
              <div key={s} className="flex min-w-0 flex-col items-start gap-2">
                <div className="flex min-h-11 w-full items-center">{r.cells[s]}</div>
                <span className="@3xl:hidden">
                  <Caption>{s}</Caption>
                </span>
              </div>
            ) : (
              <span key={s} aria-hidden className={`${font.body} hidden text-(--cp-muted) @3xl:block`}>
                —
              </span>
            ),
          )}
        </div>
      ))}
    </div>
  );
}

export function StatesSection() {
  return (
    <Section
      n={5}
      id="states"
      title="Control states"
      caption="Hover warms the fill (pumpkin #f5ab5f, paper #f2d9bc), pressed sinks into the shadow (#e18024, #e8c39b), focus adds a square cocoa outline, selected fills with wood, disabled goes flat and pale."
    >
      <div inert className="@container">
        <StateTable />
      </div>
    </Section>
  );
}
