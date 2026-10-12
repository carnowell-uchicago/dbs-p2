"use client";

import { useEffect, useState } from "react";
import { categories, formatPlays, gameBySlug, games, type Category, type Game } from "@/data/games";
import { Badge, GameFlag, Rating } from "@/components/ds/neon-arcade/Badge";
import { Button } from "@/components/ds/neon-arcade/Button";
import { Chip } from "@/components/ds/neon-arcade/Chip";
import { Checkbox, Radio } from "@/components/ds/neon-arcade/Choice";
import { SearchInput, Select } from "@/components/ds/neon-arcade/Field";
import { GameCard } from "@/components/ds/neon-arcade/GameCard";
import { GameDialog } from "@/components/ds/neon-arcade/GameDialog";
import { ListRow } from "@/components/ds/neon-arcade/ListRow";
import { Tabs } from "@/components/ds/neon-arcade/Tabs";
import { TextLink } from "@/components/ds/neon-arcade/TextLink";
import { Toggle } from "@/components/ds/neon-arcade/Toggle";
import { heading, labelClass, mono } from "./parts";

const sorts = {
  popular: { label: "Most played", fn: (a: Game, b: Game) => b.plays - a.plays },
  rating: { label: "Top rated", fn: (a: Game, b: Game) => b.rating - a.rating },
  az: { label: "A to Z", fn: (a: Game, b: Game) => a.title.localeCompare(b.title) },
};
type Sort = keyof typeof sorts;

// Fake Play: loading, then launching, then back to rest. Nothing is saved.
function PlayButton() {
  const [launch, setLaunch] = useState<"idle" | "loading" | "launching">("idle");
  useEffect(() => {
    if (launch === "idle") return;
    const t = setTimeout(() => setLaunch(launch === "loading" ? "launching" : "idle"), launch === "loading" ? 1400 : 2200);
    return () => clearTimeout(t);
  }, [launch]);
  return (
    <Button variant="primary" aria-disabled={launch !== "idle" || undefined} onClick={() => launch === "idle" && setLaunch("loading")}>
      {launch === "loading" && (
        <span className="size-4 rounded-full border-2 border-(--na-void)/30 border-t-(--na-void) motion-safe:animate-spin" aria-hidden />
      )}
      {launch === "idle" ? "Play" : launch === "loading" ? "Loading" : "Launching…"}
    </Button>
  );
}

// Every component, live. Search, checkbox, radios, and chips filter the list;
// the select sorts it; the tabs slice it; a row picks the game in the panel.
export function LiveComponents() {
  const [q, setQ] = useState("");
  const [newOnly, setNewOnly] = useState(false);
  const [length, setLength] = useState<"any" | "quick">("any");
  const [picked, setPicked] = useState<Set<Category>>(new Set());
  const [sort, setSort] = useState<Sort>("popular");
  const [current, setCurrent] = useState("dungeon-dash");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Game | null>(null);

  const toggleSaved = (slug: string) =>
    setSaved((s) => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  const toggleChip = (c: Category) =>
    setPicked((s) => {
      const next = new Set(s);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  const reset = () => {
    setQ("");
    setNewOnly(false);
    setLength("any");
    setPicked(new Set());
  };

  const shown = games
    .filter((g) => g.title.toLowerCase().includes(q.trim().toLowerCase()))
    .filter((g) => !newOnly || g.isNew)
    .filter((g) => length === "any" || g.minutes <= 5)
    .filter((g) => picked.size === 0 || picked.has(g.category))
    .sort(sorts[sort].fn);

  const list = (rows: Game[]) =>
    rows.length ? (
      <ol aria-label="Games" className="border-t-2 border-(--na-line)">
        {rows.slice(0, 3).map((g, i) => (
          <li key={g.slug}>
            <ListRow game={g} rank={i + 1} selected={g.slug === current} onSelect={() => setCurrent(g.slug)} />
          </li>
        ))}
      </ol>
    ) : (
      <p className="border-t-2 border-(--na-line) py-4 text-base text-(--na-muted)">No games match.</p>
    );

  const card = gameBySlug("dungeon-dash");
  const game = gameBySlug(current);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton />
        <Button onClick={reset}>Reset</Button>
        <TextLink href="/play" className="mr-2">
          All games →
        </TextLink>
        <SearchInput
          label="Search games"
          hideLabel
          placeholder="Search games"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full sm:w-52"
        />
        <Select label="Sort by" hideLabel value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="w-full sm:w-44">
          {Object.entries(sorts).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Checkbox checked={newOnly} onChange={(e) => setNewOnly(e.target.checked)}>
          New only
        </Checkbox>
        <fieldset className="flex items-center gap-4">
          <legend className="sr-only">Session length</legend>
          <Radio name="na-length" checked={length === "any"} onChange={() => setLength("any")}>
            Any length
          </Radio>
          <Radio name="na-length" checked={length === "quick"} onChange={() => setLength("quick")}>
            Under 5 min
          </Radio>
        </fieldset>
        <Toggle defaultChecked>Sound</Toggle>
      </div>

      <div className="flex flex-col gap-2">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <Chip selected={picked.size === 0} onClick={() => setPicked(new Set())}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip key={c} selected={picked.has(c)} onClick={() => toggleChip(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <p role="status" className={labelClass} style={mono}>
          Showing {shown.length} of {games.length} games
        </p>
      </div>

      <div className="@container grid gap-4 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_minmax(0,14rem)]">
        <GameCard
          game={card}
          onOpen={() => setOpen(card)}
          favorite={saved.has(card.slug)}
          onToggleFavorite={() => toggleSaved(card.slug)}
          headingLevel="h3"
        />
        <div className="min-w-0">
          <Tabs
            label="Lists"
            tabs={[
              { id: "all", label: "All", content: list(shown) },
              { id: "new", label: "New", content: list(shown.filter((g) => g.isNew)) },
              { id: "hot", label: "Hot", content: list(shown.filter((g) => g.isHot)) },
              { id: "saved", label: "Saved", content: null, disabled: true },
            ]}
          />
        </div>
        {/* Non-modal detail panel: follows the picked row and opens the full dialog. */}
        <aside
          aria-label="Selected game"
          className="flex flex-col gap-2 rounded-(--na-r-lg) border-2 border-(--na-cyan)/60 bg-(--na-panel) p-4 md:col-span-2 xl:col-span-1"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{game.category}</Badge>
            <GameFlag game={game} />
          </div>
          <p aria-live="polite" className="text-lg font-semibold leading-tight text-(--na-ice)" style={heading}>
            {game.title}
          </p>
          <p className="line-clamp-4 text-base text-(--na-ice)/90">{game.blurb}</p>
          <div className="flex items-center justify-between gap-2">
            <Rating value={game.rating} />
            <span className={labelClass} style={mono}>
              {formatPlays(game.plays)}
            </span>
          </div>
          <Button size="sm" aria-haspopup="dialog" onClick={() => setOpen(game)} className="mt-auto self-start">
            Open details
          </Button>
        </aside>
      </div>

      <GameDialog
        game={open}
        onClose={() => setOpen(null)}
        favorite={open ? saved.has(open.slug) : false}
        onToggleFavorite={() => open && toggleSaved(open.slug)}
      />
    </div>
  );
}
