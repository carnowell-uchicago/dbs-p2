"use client";

import { useEffect, useState, type ReactNode } from "react";
import { categories, formatPlays, gameBySlug, games, type Category, type Game } from "@/data/games";
import { Button } from "@/components/ds/neon-arcade/Button";
import { Chip } from "@/components/ds/neon-arcade/Chip";
import { FavoriteButton } from "@/components/ds/neon-arcade/FavoriteButton";
import { SearchInput, Select } from "@/components/ds/neon-arcade/Field";
import { GameCard } from "@/components/ds/neon-arcade/GameCard";
import { GameDialog } from "@/components/ds/neon-arcade/GameDialog";
import { ListRow } from "@/components/ds/neon-arcade/ListRow";
import { Tabs } from "@/components/ds/neon-arcade/Tabs";
import { Rating } from "@/components/ds/neon-arcade/Badge";
import { labelClass, mono } from "./parts";

function useFavorites() {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const toggle = (slug: string) =>
    setSaved((s) => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  return { has: (slug: string) => saved.has(slug), toggle };
}

// One dialog per demo, with favorites that last until reload.
function useGameDialog() {
  const [open, setOpen] = useState<Game | null>(null);
  const fav = useFavorites();
  const dialog = (
    <GameDialog
      game={open}
      onClose={() => setOpen(null)}
      favorite={open ? fav.has(open.slug) : false}
      onToggleFavorite={() => open && fav.toggle(open.slug)}
    />
  );
  return { openGame: setOpen, dialog, fav };
}

function Status({ children }: { children: ReactNode }) {
  return (
    <p role="status" className={labelClass} style={mono}>
      {children}
    </p>
  );
}

export function ButtonDemo() {
  const [launch, setLaunch] = useState<"idle" | "loading" | "launching">("idle");
  const { openGame, dialog } = useGameDialog();
  const game = gameBySlug("hay-runner");

  useEffect(() => {
    if (launch === "idle") return;
    const t = setTimeout(() => setLaunch(launch === "loading" ? "launching" : "idle"), launch === "loading" ? 1400 : 2200);
    return () => clearTimeout(t);
  }, [launch]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          aria-disabled={launch !== "idle" || undefined}
          onClick={() => launch === "idle" && setLaunch("loading")}
        >
          {launch === "loading" && (
            <span className="size-4 rounded-full border-2 border-(--na-void)/30 border-t-(--na-void) motion-safe:animate-spin" aria-hidden />
          )}
          {launch === "idle" ? "Play" : launch === "loading" ? "Loading" : "Launching…"}
        </Button>
        <Button onClick={() => openGame(game)} aria-haspopup="dialog">
          Details
        </Button>
      </div>
      <Status>{launch === "idle" ? `${game.title} · ready` : launch === "loading" ? `Loading ${game.title}…` : `${game.title} is starting`}</Status>
      {dialog}
    </div>
  );
}

export function SearchDemo() {
  const [q, setQ] = useState("");
  const hits = games.filter((g) => g.title.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="flex flex-col gap-3">
      <SearchInput label="Search games" placeholder="Try “dash”" value={q} onChange={(e) => setQ(e.target.value)} />
      <Status>
        {hits.length} of {games.length} games match
      </Status>
    </div>
  );
}

const sorts = {
  popular: { label: "Most played", fn: (a: Game, b: Game) => b.plays - a.plays },
  rating: { label: "Top rated", fn: (a: Game, b: Game) => b.rating - a.rating },
  az: { label: "A to Z", fn: (a: Game, b: Game) => a.title.localeCompare(b.title) },
};

export function SelectDemo() {
  const [sort, setSort] = useState<keyof typeof sorts>("popular");
  const top = [...games].sort(sorts[sort].fn).slice(0, 3);
  return (
    <div className="flex flex-col gap-3">
      <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)}>
        {Object.entries(sorts).map(([k, v]) => (
          <option key={k} value={k}>
            {v.label}
          </option>
        ))}
      </Select>
      <Status>First up: {top.map((g) => g.title).join(", ")}</Status>
    </div>
  );
}

export function ChipsDemo() {
  const [picked, setPicked] = useState<Set<Category>>(new Set());
  const shown = picked.size ? games.filter((g) => picked.has(g.category)) : games;
  const toggle = (c: Category) =>
    setPicked((s) => {
      const next = new Set(s);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        <Chip selected={picked.size === 0} onClick={() => setPicked(new Set())}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c} selected={picked.has(c)} onClick={() => toggle(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <Status>
        Showing {shown.length} of {games.length} games
      </Status>
    </div>
  );
}

export function TabsDemo() {
  const board = (list: Game[], stat: (g: Game) => ReactNode) => (
    <ol className="flex flex-col">
      {list.slice(0, 4).map((g, i) => (
        <li key={g.slug} className="flex items-center gap-3 border-b border-(--na-line) py-2.5 last:border-b-0">
          <span className="w-6 text-xs text-(--na-muted)" style={mono}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 truncate text-base font-semibold text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
            {g.title}
          </span>
          <span className="text-xs uppercase tracking-[0.1em] text-(--na-muted)" style={mono}>
            {stat(g)}
          </span>
        </li>
      ))}
    </ol>
  );
  return (
    <Tabs
      label="Leaderboard"
      tabs={[
        { id: "popular", label: "Popular", content: board([...games].sort((a, b) => b.plays - a.plays), (g) => formatPlays(g.plays)) },
        { id: "new", label: "New", content: board(games.filter((g) => g.isNew), (g) => g.category) },
        { id: "rated", label: "Top rated", content: board([...games].sort((a, b) => b.rating - a.rating), (g) => <Rating value={g.rating} />) },
        { id: "saved", label: "Saved", content: null, disabled: true },
      ]}
    />
  );
}

export function CardsDemo() {
  const { openGame, dialog, fav } = useGameDialog();
  const picks = ["dungeon-dash", "orbit-hopper", "gridline-racer"].map(gameBySlug);
  return (
    <>
      <ul className="grid gap-4 @lg:grid-cols-2 @3xl:grid-cols-3">
        {picks.map((g) => (
          <li key={g.slug}>
            <GameCard
              game={g}
              onOpen={() => openGame(g)}
              favorite={fav.has(g.slug)}
              onToggleFavorite={() => fav.toggle(g.slug)}
              headingLevel="h4"
            />
          </li>
        ))}
      </ul>
      {dialog}
    </>
  );
}

export function ListDemo() {
  const top = [...games].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const [current, setCurrent] = useState(top[0].slug);
  const game = gameBySlug(current);
  return (
    <div className="grid gap-4 @3xl:grid-cols-[1fr_20rem]">
      <ol aria-label="Most played" className="border-t border-(--na-line)">
        {top.map((g, i) => (
          <li key={g.slug}>
            <ListRow game={g} rank={i + 1} selected={g.slug === current} onSelect={() => setCurrent(g.slug)} />
          </li>
        ))}
      </ol>
      {/* Non-modal detail panel: follows the selected row. */}
      <aside aria-live="polite" aria-label="Selected game" className="flex flex-col gap-2 border border-(--na-cyan)/60 bg-(--na-void) p-4">
        <span className={labelClass} style={mono}>
          {game.category} · {formatPlays(game.plays)}
        </span>
        <span className="text-lg font-semibold text-(--na-ice)" style={{ fontFamily: "var(--na-display-alt)" }}>
          {game.title}
        </span>
        <span className="text-base text-(--na-ice)/90">{game.blurb}</span>
      </aside>
    </div>
  );
}

export function FavoriteDemo() {
  const [on, setOn] = useState(false);
  const game = gameBySlug("pocket-golf");
  return (
    <div className="flex items-center gap-4">
      <FavoriteButton title={game.title} selected={on} onClick={() => setOn(!on)} />
      <Status>{on ? `${game.title} saved` : `${game.title} not saved`}</Status>
    </div>
  );
}

export function ModalDemo() {
  const { openGame, dialog } = useGameDialog();
  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={() => openGame(gameBySlug("hilltop-defense"))} aria-haspopup="dialog">
        Open game details
      </Button>
      <p className="text-base text-(--na-muted)">Esc or a click outside closes it. Focus returns here.</p>
      {dialog}
    </div>
  );
}
