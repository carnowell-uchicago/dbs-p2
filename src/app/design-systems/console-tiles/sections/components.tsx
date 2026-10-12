import { formatPlays, gameBySlug, games } from "@/data/games";
import { Badge } from "@/components/ds/console-tiles/Badge";
import { Button } from "@/components/ds/console-tiles/Button";
import { Chip } from "@/components/ds/console-tiles/Chip";
import { FavoriteButton } from "@/components/ds/console-tiles/FavoriteButton";
import { Checkbox, Radio, SearchField, SelectField, Toggle } from "@/components/ds/console-tiles/Fields";
import { GameCard, GameTile } from "@/components/ds/console-tiles/GameTile";
import { GameDetail } from "@/components/ds/console-tiles/GameDetail";
import { ListRow } from "@/components/ds/console-tiles/ListRow";
import { PlayButton, PlayButtonView } from "@/components/ds/console-tiles/PlayButton";
import { Rating } from "@/components/ds/console-tiles/Rating";
import { TabButton, Tabs } from "@/components/ds/console-tiles/Tabs";
import { TextLink } from "@/components/ds/console-tiles/TextLink";
import { TileRow } from "@/components/ds/console-tiles/TileRow";
import type { ForcedState } from "@/lib/design-system";
import { LiveCards, LiveChips, LiveDialog, LiveFavorite, LiveList } from "./live";
import { Block, Section, type Specimen } from "./ui";

const hay = gameBySlug("hay-runner");
const dash = gameBySlug("dungeon-dash");
const byPlays = [...games].sort((a, b) => b.plays - a.plays);
const byRating = [...games].sort((a, b) => b.rating - a.rating);
const newest = games.filter((g) => g.isNew);

const labels: Record<ForcedState, string> = {
  rest: "Rest",
  hover: "Hover",
  focus: "Focus",
  pressed: "Pressed",
  selected: "Selected",
  disabled: "Disabled",
};

function specimens(states: ForcedState[], render: (s: ForcedState) => Specimen["node"]): Specimen[] {
  return states.map((s) => ({ label: labels[s], node: render(s) }));
}

const press: ForcedState[] = ["rest", "hover", "focus", "pressed", "disabled"];
const all: ForcedState[] = ["rest", "hover", "focus", "pressed", "selected", "disabled"];

const sortOptions = (
  <>
    <option>Most played</option>
    <option>Newest</option>
    <option>Top rated</option>
  </>
);

function MiniList({ items }: { items: typeof games }) {
  return (
    <ul className="flex flex-col divide-y divide-(--ct-line) rounded-2xl bg-(--ct-bg) px-4">
      {items.slice(0, 3).map((g) => (
        <li key={g.slug} className="flex justify-between gap-4 py-3 text-base">
          <span className="font-semibold">{g.title}</span>
          <span className="text-sm text-(--ct-muted)">{formatPlays(g.plays)}</span>
        </li>
      ))}
    </ul>
  );
}

export function ComponentsSection() {
  return (
    <Section
      id="components"
      title="Components"
      intro="Every control is real: try it with a mouse or the keyboard. Below each, the same control frozen in every state it has."
    >
      <div className="flex flex-col gap-6">
        <Block
          title="Primary button"
          note="The only red on the page. One per screen: Play."
          live={<PlayButton title={hay.title} />}
          states={[
            ...specimens(press, (s) => <PlayButtonView title={hay.title} force={s} />),
            { label: "Loading", node: <PlayButtonView title={hay.title} phase="loading" /> },
          ]}
        />

        <Block
          title="Secondary button"
          note="White with a border, for everything that isn't Play."
          live={<Button>See all games</Button>}
          states={specimens(press, (s) => (
            <Button force={s}>See all</Button>
          ))}
          statesClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        />

        <Block
          title="Link"
          note="Underlined text for moving between pages. Never colored."
          live={
            <p className="text-base">
              Bored of farm games? <TextLink href="/play">Browse all games</TextLink>
            </p>
          }
          states={specimens(["rest", "hover", "focus", "pressed"], (s) => (
            <TextLink href="/play" force={s}>
              All games
            </TextLink>
          ))}
          statesClass="grid-cols-2 sm:grid-cols-4"
        />

        <Block
          title="Search field"
          live={<SearchField label="Search games" placeholder="Search 12 games" className="max-w-sm" />}
          states={[
            ...specimens(["rest", "hover", "focus"], (s) => (
              <SearchField label="Search" hideLabel placeholder="Search" force={s} />
            )),
            {
              label: "Filled",
              node: <SearchField label="Search" hideLabel defaultValue="golf" />,
            },
            {
              label: "Disabled",
              node: <SearchField label="Search" hideLabel placeholder="Search" force="disabled" />,
            },
          ]}
          statesClass="grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
        />

        <Block
          title="Select"
          live={<SelectField label="Sort by" className="max-w-56">{sortOptions}</SelectField>}
          states={specimens(["rest", "hover", "focus", "disabled"], (s) => (
            <SelectField label="Sort by" force={s} className="w-full">
              {sortOptions}
            </SelectField>
          ))}
          statesClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />

        <Block
          title="Checkboxes and radios"
          note="A filled dark box or dot means chosen."
          live={
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm font-semibold">Show</legend>
                <Checkbox label="Only new games" />
                <Checkbox label="Games I haven't played" defaultChecked />
              </fieldset>
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm font-semibold">Round length</legend>
                <Radio name="length" label="Any length" defaultChecked />
                <Radio name="length" label="Under 5 minutes" />
                <Radio name="length" label="5 to 10 minutes" />
              </fieldset>
            </div>
          }
          states={[
            ...specimens(all, (s) => <Checkbox label="New" force={s} />),
            ...specimens(all, (s) => <Radio name={`radio-${s}`} label="Any" force={s} />),
          ]}
        />

        <Block
          title="Toggle"
          note="The knob slides right and shows a check when on."
          live={
            <div className="flex max-w-xs flex-col gap-4">
              <Toggle label="Sound effects" defaultChecked />
              <Toggle label="Show ratings on tiles" />
            </div>
          }
          states={specimens(all, (s) => (
            <Toggle label={s === "selected" ? "On" : "Off"} force={s} />
          ))}
        />

        <Block
          title="Tabs"
          note="← → switch tabs, Home and End jump to the first and last."
          live={
            <Tabs
              label="Game lists"
              items={[
                { id: "popular", label: "Popular", content: <MiniList items={byPlays} /> },
                { id: "new", label: "New", content: <MiniList items={newest} /> },
                { id: "top", label: "Top rated", content: <MiniList items={byRating} /> },
              ]}
            />
          }
          states={specimens(all, (s) => (
            <TabButton force={s}>Popular</TabButton>
          ))}
        />

        <Block
          title="Filter chips"
          note="Pick any categories. All clears them."
          live={<LiveChips />}
          states={specimens(all, (s) => (
            <Chip force={s}>Puzzle</Chip>
          ))}
        />

        <Block
          title="Game card"
          note="For grids. The whole card opens the game."
          live={<LiveCards items={[hay, gameBySlug("tumble-tower"), gameBySlug("orbit-hopper"), gameBySlug("pocket-golf")]} />}
          states={specimens(["rest", "hover", "focus", "pressed"], (s) => (
            <GameCard game={hay} force={s} />
          ))}
          statesClass="grid-cols-2 lg:grid-cols-4"
        />

        <Block
          title="Home row"
          note="One row of big tiles that scrolls sideways. The ring and the title show which tile is selected. Tab or ← → to move, Enter to open."
          live={<TileRow label="Recently played" games={byPlays} />}
          states={specimens(["rest", "hover", "focus", "pressed"], (s) => (
            <GameTile game={dash} force={s} className="w-28 sm:w-36" />
          ))}
          statesClass="grid-cols-2 sm:grid-cols-4"
        />

        <Block
          title="List row"
          note="For ranked lists. The open game's row gets a dark bar."
          live={<LiveList items={byPlays.slice(0, 4)} />}
          states={specimens(["rest", "hover", "focus", "pressed", "selected"], (s) => (
            <ListRow game={dash} rank={1} force={s} />
          ))}
          statesClass="grid-cols-1 sm:grid-cols-2"
        />

        <Block
          title="Badges and rating"
          note="Labels, not buttons: no hover or focus."
          live={
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Puzzle</Badge>
              <Badge tone="hot">Hot</Badge>
              <Badge tone="new">New</Badge>
              <Rating value={4.7} />
              <Rating value={3.9} size="md" />
            </div>
          }
        />

        <Block
          title="Favorite"
          note="A dark filled heart means saved. Nothing is stored; it resets on reload."
          live={<LiveFavorite game={hay} />}
          states={specimens(all, (s) => (
            <FavoriteButton title={hay.title} force={s} />
          ))}
        />

        <Block
          title="Detail panel"
          note="Opens over the page from any tile. Escape, the close button, or a click outside closes it."
          live={
            <div className="flex flex-col items-start gap-5">
              <LiveDialog game={dash} />
              <div inert className="w-full max-w-xl overflow-hidden rounded-3xl bg-(--ct-surface) shadow-[0_24px_60px_rgb(0_0_0/0.3)] ring-1 ring-(--ct-line)">
                <GameDetail game={dash} />
              </div>
            </div>
          }
        />
      </div>
    </Section>
  );
}
