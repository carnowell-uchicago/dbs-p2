"use client";

import { useEffect, useState, type ReactNode } from "react";
import { games, gameBySlug } from "@/data/games";
import { Button } from "@/components/ds/cozy-pixel/Button";
import { SearchInput } from "@/components/ds/cozy-pixel/Fields";
import { ListRow } from "@/components/ds/cozy-pixel/GameCard";
import { Panel } from "@/components/ds/cozy-pixel/Panel";
import { PixelSprite } from "@/components/ds/cozy-pixel/PixelSprite";
import { Icon } from "@/components/ds/cozy-pixel/icons";
import { edge, font, type } from "@/components/ds/cozy-pixel/styles";
import { useGameDialog } from "./live";
import { Section } from "./showcase";

function StatePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel as="article" className="min-w-0">
      <div className="flex h-full flex-col gap-5 p-5 sm:p-6">
        <h3 className={type.title}>{title}</h3>
        {children}
      </div>
    </Panel>
  );
}

const basket = [
  "...tttttt...",
  "..t......t..",
  ".t........t.",
  "tttttttttttt",
  "twlwlwlwlwlt",
  "tlwlwlwlwlwt",
  ".twlwlwlwlt.",
  ".tlwlwlwlwt.",
  "..tttttttt..",
];

function EmptyDemo() {
  const [query, setQuery] = useState("zebra");
  const { setOpen, dialog } = useGameDialog();
  const q = query.trim().toLowerCase();
  const found = q ? games.filter((g) => g.title.toLowerCase().includes(q)) : games;
  return (
    <StatePanel title="Empty">
      <SearchInput
        id="cp-empty-search"
        label="Search games"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p role="status" className="sr-only">
        {found.length === 0 ? `No games match ${query.trim()}` : `${found.length} games`}
      </p>
      <div className="flex flex-1 flex-col">
        {found.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-(--cp-bg) px-4 py-6 text-center">
            <PixelSprite rows={basket} colors={{ t: "var(--cp-text)", w: "var(--cp-wood)", l: "var(--cp-bevel)" }} className="w-14" />
            <p className={type.title}>No games match “{query.trim()}”</p>
            <p className={`${type.body} text-(--cp-muted)`}>
              Check the spelling, or clear the search to see all {games.length} games.
            </p>
            <Button className="mt-2" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className={`${type.body} text-(--cp-muted)`}>
              {q ? `${found.length} of ${games.length} games match` : `All ${games.length} games`}
            </p>
            <ul className="@container flex flex-col divide-y-2 divide-(--cp-sunken) shadow-[0_0_0_2px_var(--cp-wood)]">
              {found.slice(0, 3).map((g) => (
                <li key={g.slug}>
                  <ListRow game={g} onClick={() => setOpen(g)} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {dialog}
    </StatePanel>
  );
}

function LoadingDemo() {
  return (
    <StatePanel title="Loading">
      <div aria-busy="true" className="flex flex-col gap-4">
        <p role="status" className={`${type.body} text-(--cp-muted)`}>
          Fetching games from the barn…
        </p>
        <ul aria-hidden className="grid grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <li key={i} className="flex flex-col gap-2 bg-(--cp-bg) p-2">
              <span className="block aspect-[4/3] bg-(--cp-sunken) motion-safe:animate-pulse" />
              <span className="block h-4 w-3/4 bg-(--cp-sunken) motion-safe:animate-pulse" />
              <span className="block h-4 w-1/2 bg-(--cp-sunken) motion-safe:animate-pulse" />
            </li>
          ))}
        </ul>
      </div>
    </StatePanel>
  );
}

type Retry = "error" | "retrying" | "fixed";

function ErrorDemo() {
  const game = gameBySlug("pocket-golf");
  const [phase, setPhase] = useState<Retry>("error");

  useEffect(() => {
    if (phase !== "retrying") return;
    const t = setTimeout(() => setPhase("fixed"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <StatePanel title="Error">
      <p role="status" className="sr-only">
        {phase === "fixed" ? `${game.title} is ready to play.` : phase === "retrying" ? "Retrying" : ""}
      </p>
      <div className="flex flex-1 flex-col">
        {phase === "fixed" ? (
          <div className="flex flex-col items-start gap-4">
            <p
              style={edge}
              className={`${font.body} flex items-center gap-2 bg-(--cp-success) px-3 py-2 font-semibold text-(--cp-text) [--w:2px] [--e:var(--cp-text)] [--d:0px]`}
            >
              <Icon name="check" /> {game.title} is ready to play.
            </p>
            <Button size="sm" onClick={() => setPhase("error")}>
              Show the error again
            </Button>
          </div>
        ) : (
          <div
            style={edge}
            className="flex flex-col items-start gap-3 bg-(--cp-surface) p-4 [--w:3px] [--e:var(--cp-error)] [--d:0px]"
          >
            <p className={`${type.title} flex items-center gap-2 text-(--cp-error)`}>
              <Icon name="bang" /> {game.title} didn’t load
            </p>
            <p className={type.body}>The game file got lost on the way here. Give it another go.</p>
            <Button
              className="mt-2"
              aria-disabled={phase === "retrying"}
              onClick={() => phase === "error" && setPhase("retrying")}
            >
              {phase === "retrying" ? "Retrying…" : "Retry"}
            </Button>
          </div>
        )}
      </div>
    </StatePanel>
  );
}

function SuccessDemo() {
  const game = gameBySlug("hay-runner");
  const [saved, setSaved] = useState(true);
  return (
    <StatePanel title="Success">
      <div className="flex flex-col items-start gap-4">
        <p
          role="status"
          style={saved ? edge : undefined}
          className={`${font.body} flex items-center gap-2 px-3 py-2 font-semibold text-(--cp-text) [--w:2px] [--e:var(--cp-text)] [--d:0px] ${saved ? "bg-(--cp-success)" : "bg-(--cp-bg)"}`}
        >
          {saved ? <Icon name="check" /> : null}
          {saved ? `${game.title} is in your favorites.` : `${game.title} left your favorites.`}
        </p>
        <Button size="sm" onClick={() => setSaved(!saved)}>
          {saved ? "Undo" : "Add it back"}
        </Button>
      </div>
    </StatePanel>
  );
}

export function UiStatesSection() {
  return (
    <Section
      id="ui-states"
      title="UI states"
      intro="What people see while they wait, when nothing matches, when something breaks, and when it works. Each message says what happened and what to do next."
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <EmptyDemo />
        <LoadingDemo />
        <ErrorDemo />
        <SuccessDemo />
      </div>
    </Section>
  );
}
