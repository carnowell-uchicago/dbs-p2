"use client";

import { useEffect, useState, type ReactNode } from "react";
import { categories, formatPlays, games, gameBySlug, type Category, type Game } from "@/data/games";
import { Button } from "@/components/ds/cozy-pixel/Button";
import { Chip } from "@/components/ds/cozy-pixel/Chip";
import { Checkbox, Radio, SearchInput, Select, Toggle } from "@/components/ds/cozy-pixel/Fields";
import { GameArt } from "@/components/ds/cozy-pixel/GameArt";
import { GameCard, ListRow } from "@/components/ds/cozy-pixel/GameCard";
import { GameDialog } from "@/components/ds/cozy-pixel/GameDialog";
import { Badge, FavoriteButton, Rating } from "@/components/ds/cozy-pixel/Meta";
import { Tabs } from "@/components/ds/cozy-pixel/Tabs";
import { TextLink } from "@/components/ds/cozy-pixel/TextLink";
import { Icon } from "@/components/ds/cozy-pixel/icons";
import { edge, font, type } from "@/components/ds/cozy-pixel/styles";
import { Section } from "./frame";

// One live copy of every component. Everything is in memory and resets on
// reload. Details, the card, and the rows share one game dialog.

const hay = gameBySlug("hay-runner");
const top = [...games].sort((a, b) => b.plays - a.plays).slice(0, 3);

type Phase = "idle" | "loading" | "launching";

function PlayDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  useEffect(() => {
    if (phase === "idle") return;
    const t = setTimeout(
      () => setPhase(phase === "loading" ? "launching" : "idle"),
      phase === "loading" ? 1200 : 2400,
    );
    return () => clearTimeout(t);
  }, [phase]);
  return (
    <>
      <Button
        variant="primary"
        aria-disabled={phase !== "idle"}
        onClick={() => phase === "idle" && setPhase("loading")}
        className="min-w-32 aria-disabled:cursor-progress"
      >
        {phase === "idle" ? "Play" : phase === "loading" ? "Loading…" : "Launching…"}
      </Button>
      <span role="status" className="sr-only">
        {phase === "loading" ? `Warming up ${hay.title}` : phase === "launching" ? `Launching ${hay.title}` : ""}
      </span>
    </>
  );
}

function ChipsDemo() {
  const [picked, setPicked] = useState<Set<Category>>(new Set(["Puzzle"]));
  const count = picked.size === 0 ? games.length : games.filter((g) => picked.has(g.category)).length;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-x-3 gap-y-4">
        {categories.map((c) => (
          <Chip
            key={c}
            selected={picked.has(c)}
            onClick={() =>
              setPicked((prev) => {
                const next = new Set(prev);
                if (next.has(c)) next.delete(c);
                else next.add(c);
                return next;
              })
            }
          >
            {c}
          </Chip>
        ))}
      </div>
      <p role="status" className={`${font.body} text-sm text-(--cp-muted)`}>
        {count} of {games.length} games
      </p>
    </div>
  );
}

function TabPanel({ list }: { list: Game[] }) {
  return <p className={`${type.body} px-3 py-2`}>{list.map((g) => g.title).join(" · ")}</p>;
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={`${type.label} mb-3 text-(--cp-text)`}>{legend}</legend>
      {children}
    </fieldset>
  );
}

// A small frozen copy of the dialog, so its look reads at a glance.
function DialogPreview() {
  return (
    <div inert style={edge} className="w-full max-w-60 bg-(--cp-surface) [--w:3px] [--e:var(--cp-wood)] [--d:4px]">
      <div className="flex items-center justify-between gap-2 bg-(--cp-wood) py-2 pr-2 pl-3">
        <span className={`${font.display} text-base font-bold text-(--cp-surface)`}>{hay.title}</span>
        <span
          style={edge}
          className="grid size-6 place-items-center bg-(--cp-surface) text-(--cp-text) [--w:2px] [--e:var(--cp-text)] [--d:0px]"
        >
          <Icon name="close" className="size-3" />
        </span>
      </div>
      <div className="flex flex-col gap-3 p-3">
        <div className="flex gap-3">
          <span className="block w-16 shrink-0 shadow-[0_0_0_2px_var(--cp-bevel)]">
            <GameArt motif={hay.motif} />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <Rating value={hay.rating} />
            <span className={`${font.body} text-sm text-(--cp-muted)`}>{formatPlays(hay.plays)}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm">
            Play
          </Button>
          <FavoriteButton on showLabel={false} />
        </div>
      </div>
    </div>
  );
}

export function ComponentsSection() {
  const [open, setOpen] = useState<Game | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const isFav = (slug: string) => favorites.has(slug);
  const setFav = (slug: string, on: boolean) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (on) next.add(slug);
      else next.delete(slug);
      return next;
    });

  return (
    <Section
      n={4}
      id="components"
      title="Components"
      caption="Buttons, favorite, link, search, select, toggle, checkbox, radios, tabs, filter chips, game card, list rows, badges, rating, and the game dialog (Details, the card, or a row opens it)."
    >
      <div className="flex flex-col gap-7">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <PlayDemo />
          <Button aria-haspopup="dialog" onClick={() => setOpen(hay)}>
            Details
          </Button>
          <FavoriteButton on={isFav(hay.slug)} onClick={() => setFav(hay.slug, !isFav(hay.slug))} />
          <TextLink href="/play">All games</TextLink>
        </div>

        <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
          <SearchInput id="cp-search" label="Search games" placeholder="Try “golf”" className="w-full sm:w-60" />
          <Select id="cp-sort" label="Sort by" defaultValue="popular" className="w-full sm:w-48">
            <option value="popular">Most played</option>
            <option value="new">Newest</option>
            <option value="rating">Top rated</option>
          </Select>
          <div className="flex h-11 items-center">
            <Toggle label="Sound" defaultChecked />
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
          <Group legend="Show">
            <Checkbox label="Only new games" />
          </Group>
          <Group legend="Length">
            <div className="flex gap-5">
              <Radio name="cp-length" label="Quick" defaultChecked />
              <Radio name="cp-length" label="Long" />
            </div>
          </Group>
          <div className="w-full sm:w-80">
            <Tabs
              label="Game lists"
              items={[
                { id: "popular", label: "Popular", content: <TabPanel list={top} /> },
                { id: "new", label: "New", content: <TabPanel list={games.filter((g) => g.isNew).slice(0, 3)} /> },
                {
                  id: "top",
                  label: "Top rated",
                  content: <TabPanel list={[...games].sort((a, b) => b.rating - a.rating).slice(0, 3)} />,
                },
              ]}
            />
          </div>
        </div>

        <ChipsDemo />

        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-[11rem_minmax(0,1fr)] xl:grid-cols-[11rem_minmax(0,1fr)_15rem]">
          <GameCard game={hay} onClick={() => setOpen(hay)} />
          <div className="flex min-w-0 flex-col gap-4">
            <ol className="@container flex flex-col divide-y-2 divide-(--cp-sunken) bg-(--cp-surface) shadow-[0_0_0_2px_var(--cp-wood)]">
              {top.map((g, i) => (
                <li key={g.slug}>
                  <ListRow game={g} rank={i + 1} current={open?.slug === g.slug} onClick={() => setOpen(g)} />
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="new">New</Badge>
              <Badge tone="hot">Hot</Badge>
              <Badge tone="category">Puzzle</Badge>
            </div>
          </div>
          <DialogPreview />
        </div>
      </div>

      <GameDialog
        game={open}
        onClose={() => setOpen(null)}
        isFavorite={open ? isFav(open.slug) : false}
        onFavoriteChange={(on) => {
          if (open) setFav(open.slug, on);
        }}
      />
    </Section>
  );
}
