import { gameBySlug, games } from "@/data/games";
import { Badge } from "@/components/ds/console-tiles/Badge";
import { Button } from "@/components/ds/console-tiles/Button";
import { FavoriteButton } from "@/components/ds/console-tiles/FavoriteButton";
import { Checkbox, Radio, SearchField, SelectField, Toggle } from "@/components/ds/console-tiles/Fields";
import { GameArt } from "@/components/ds/console-tiles/GameArt";
import { CloseIcon, PlayIcon } from "@/components/ds/console-tiles/Icons";
import { PlayButton } from "@/components/ds/console-tiles/PlayButton";
import { Rating } from "@/components/ds/console-tiles/Rating";
import { Tabs } from "@/components/ds/console-tiles/Tabs";
import { TextLink } from "@/components/ds/console-tiles/TextLink";
import { TileRow } from "@/components/ds/console-tiles/TileRow";
import { LiveCard, LiveChips, LiveDialog, LiveHeart, LiveList } from "./live";
import { Section } from "./ui";

const hay = gameBySlug("hay-runner");
const dash = gameBySlug("dungeon-dash");
const byPlays = [...games].sort((a, b) => b.plays - a.plays);
const byRating = [...games].sort((a, b) => b.rating - a.rating);
const newest = games.filter((g) => g.isNew);

const titles = (list: typeof games) => (
  <p className="text-sm text-(--ct-muted)">
    {list
      .slice(0, 3)
      .map((g) => g.title)
      .join(" · ")}
  </p>
);

// A still picture of the detail panel; the button beside it opens the real one.
function PanelPreview() {
  return (
    <div
      inert
      className="overflow-hidden rounded-2xl bg-(--ct-surface) shadow-[0_10px_24px_rgb(0_0_0/0.5)] ring-1 ring-(--ct-line)"
    >
      <div className="relative aspect-[16/9]">
        <GameArt motif={dash.motif} />
        <span className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-(--ct-surface)">
          <CloseIcon className="size-4" />
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          {dash.title}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            <PlayIcon className="size-4" /> Play
          </Button>
          <FavoriteButton title={dash.title} />
        </div>
      </div>
    </div>
  );
}

export function ComponentsSection() {
  return (
    <Section
      id="components"
      n={4}
      title="Components"
      caption="Buttons, link, search, select, checkbox, radio, toggle, favorite, badges, rating, tabs, filter chips, home row, game card, list rows, detail panel."
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <PlayButton title={hay.title} />
          <Button>See all</Button>
          <TextLink href="/play">Browse all games</TextLink>
          <SearchField label="Search games" hideLabel placeholder="Search games" className="w-56" />
          <SelectField label="Sort by" hideLabel className="w-52">
            <option>Sort: Most played</option>
            <option>Sort: Newest</option>
            <option>Sort: Top rated</option>
          </SelectField>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Checkbox label="New only" defaultChecked />
          <fieldset className="flex flex-wrap gap-x-6 gap-y-3">
            <legend className="sr-only">Round length</legend>
            <Radio name="ds-length" label="Any length" defaultChecked />
            <Radio name="ds-length" label="Under 5 min" />
          </fieldset>
          <Toggle label="Sound" defaultChecked />
          <LiveHeart game={hay} />
          <span className="flex flex-wrap items-center gap-2">
            <Badge>Puzzle</Badge>
            <Badge tone="hot">Hot</Badge>
            <Badge tone="new">New</Badge>
            <Rating value={hay.rating} />
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Tabs
            label="Game lists"
            items={[
              { id: "popular", label: "Popular", content: titles(byPlays) },
              { id: "new", label: "New", content: titles(newest) },
              { id: "top", label: "Top rated", content: titles(byRating) },
            ]}
          />
          <LiveChips />
        </div>

        <TileRow label="Recently played" games={byPlays} tileClassName="w-24 sm:w-28" />

        <div className="grid gap-5 sm:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1fr)_15rem]">
          <div className="max-w-56">
            <LiveCard game={hay} />
          </div>
          <LiveList items={byPlays.slice(0, 3)} />
          <div className="flex flex-col items-start gap-3 sm:col-span-2 lg:col-span-1">
            <div className="w-full max-w-60">
              <PanelPreview />
            </div>
            <LiveDialog game={dash} />
          </div>
        </div>
      </div>
    </Section>
  );
}
