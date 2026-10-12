"use client";

import { useState } from "react";
import { categories, games, gameBySlug, type Category, type Game } from "@/data/games";
import { Button } from "@/components/ds/cozy-pixel/Button";
import { Chip } from "@/components/ds/cozy-pixel/Chip";
import { GameCard, ListRow } from "@/components/ds/cozy-pixel/GameCard";
import { GameDialog, GameDialogPanel } from "@/components/ds/cozy-pixel/GameDialog";
import { FavoriteButton } from "@/components/ds/cozy-pixel/Meta";
import { Tabs } from "@/components/ds/cozy-pixel/Tabs";
import { font } from "@/components/ds/cozy-pixel/styles";

// Live demos for the components section. Everything is in memory and resets
// on reload.

export function useGameDialog() {
  const [open, setOpen] = useState<Game | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const dialog = (
    <GameDialog
      game={open}
      onClose={() => setOpen(null)}
      isFavorite={open ? favorites.has(open.slug) : false}
      onFavoriteChange={(on) =>
        setFavorites((prev) => {
          const next = new Set(prev);
          if (open) {
            if (on) next.add(open.slug);
            else next.delete(open.slug);
          }
          return next;
        })
      }
    />
  );
  return { open, setOpen, dialog };
}

export function ChipsDemo() {
  const [picked, setPicked] = useState<Set<Category>>(new Set(["Puzzle"]));
  const count = picked.size === 0 ? games.length : games.filter((g) => picked.has(g.category)).length;
  return (
    <div className="flex flex-col gap-5">
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
      <p role="status" className={`${font.body} text-base text-(--cp-muted)`}>
        {picked.size === 0 ? `All ${count} games` : `${count} games in ${[...picked].join(", ")}`}
      </p>
    </div>
  );
}

const cardSlugs = ["hay-runner", "dungeon-dash", "sky-picnic"];

export function CardsDemo() {
  const { setOpen, dialog } = useGameDialog();
  return (
    <>
      <ul className="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {cardSlugs.map((slug) => {
          const game = gameBySlug(slug);
          return (
            <li key={slug}>
              <GameCard game={game} onClick={() => setOpen(game)} />
            </li>
          );
        })}
      </ul>
      {dialog}
    </>
  );
}

const top = [...games].sort((a, b) => b.plays - a.plays).slice(0, 4);

export function ListDemo() {
  const { open, setOpen, dialog } = useGameDialog();
  return (
    <>
      <ol className="@container flex flex-col divide-y-2 divide-(--cp-sunken) bg-(--cp-surface) shadow-[0_0_0_2px_var(--cp-wood)]">
        {top.map((game, i) => (
          <li key={game.slug}>
            <ListRow game={game} rank={i + 1} current={open?.slug === game.slug} onClick={() => setOpen(game)} />
          </li>
        ))}
      </ol>
      {dialog}
    </>
  );
}

function rowsFor(list: Game[], open: (g: Game) => void) {
  return (
    <ul className="@container flex flex-col divide-y-2 divide-(--cp-sunken)">
      {list.map((game) => (
        <li key={game.slug}>
          <ListRow game={game} onClick={() => open(game)} />
        </li>
      ))}
    </ul>
  );
}

export function TabsDemo() {
  const { setOpen, dialog } = useGameDialog();
  const byPlays = [...games].sort((a, b) => b.plays - a.plays).slice(0, 3);
  const fresh = games.filter((g) => g.isNew).slice(0, 3);
  const best = [...games].sort((a, b) => b.rating - a.rating).slice(0, 3);
  return (
    <>
      <Tabs
        label="Game lists"
        items={[
          { id: "popular", label: "Popular", content: rowsFor(byPlays, setOpen) },
          { id: "new", label: "New", content: rowsFor(fresh, setOpen) },
          { id: "top", label: "Top rated", content: rowsFor(best, setOpen) },
        ]}
      />
      {dialog}
    </>
  );
}

export function FavoriteDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-6">
      <FavoriteButton on={on} onClick={() => setOn(!on)} />
      <p role="status" className={`${font.body} text-base text-(--cp-muted)`}>
        {on ? "Hay Runner is in your favorites." : "Hay Runner is not in your favorites."}
      </p>
    </div>
  );
}

export function DialogDemo() {
  const { setOpen, dialog } = useGameDialog();
  const game = gameBySlug("dungeon-dash");
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setOpen(game)}>
        Open {game.title}
      </Button>
      {dialog}
    </>
  );
}

// A frozen copy of the dialog contents for the page, outside the top layer.
export function DialogPreview() {
  return (
    <div inert className="mx-auto w-full max-w-[34rem] pb-2">
      <GameDialogPanel
        game={gameBySlug("hay-runner")}
        titleId="cp-dialog-preview-title"
        isFavorite
        onFavoriteChange={() => {}}
        onClose={() => {}}
      />
    </div>
  );
}
