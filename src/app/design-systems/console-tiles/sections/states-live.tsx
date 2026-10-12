"use client";

import { useEffect, useRef, useState } from "react";
import { games } from "@/data/games";
import { Button } from "@/components/ds/console-tiles/Button";
import { SearchField } from "@/components/ds/console-tiles/Fields";
import { AlertIcon, CheckIcon, Spinner } from "@/components/ds/console-tiles/Icons";
import { PlayButton } from "@/components/ds/console-tiles/PlayButton";

export function EmptyDemo() {
  const [query, setQuery] = useState("zebra");
  const q = query.trim().toLowerCase();
  const hits = games.filter((g) => g.title.toLowerCase().includes(q));
  return (
    <div className="flex flex-col gap-4">
      <SearchField label="Search games" hideLabel value={query} onChange={(e) => setQuery(e.target.value)} />
      <div role="status">
        {hits.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-(--ct-bg) px-4 py-8 text-center">
            <p className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
              No games match “{query.trim()}”
            </p>
            <p className="text-sm text-(--ct-muted)">Try a shorter word, or clear the search.</p>
            <Button onClick={() => setQuery("")}>Clear search</Button>
          </div>
        ) : (
          <p className="text-sm text-(--ct-muted)">
            {hits.length === games.length ? `All ${games.length} games` : `${hits.length} of ${games.length} games`}:{" "}
            <span className="text-(--ct-text)">{hits.slice(0, 3).map((g) => g.title).join(", ")}
            {hits.length > 3 ? "…" : ""}</span>
          </p>
        )}
      </div>
    </div>
  );
}

type Phase = "error" | "retrying" | "ready";

export function ErrorDemo() {
  const [phase, setPhase] = useState<Phase>("error");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function retry() {
    setPhase("retrying");
    timer.current = window.setTimeout(() => setPhase("ready"), 1200);
  }

  return (
    <div role="status" className="flex flex-col items-start gap-3 rounded-2xl bg-(--ct-bg) p-4">
      {phase === "ready" ? (
        <>
          <p className="flex items-center gap-2 text-base font-semibold text-(--ct-success)">
            <CheckIcon className="size-5" /> Hay Runner is ready
          </p>
          <div className="flex flex-wrap gap-3">
            <PlayButton title="Hay Runner" />
            <Button onClick={() => setPhase("error")}>Show the error again</Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-(--ct-attention) text-(--ct-text)">
              <AlertIcon />
            </span>
            <div>
              <p className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
                Hay Runner didn’t load
              </p>
              <p className="text-sm text-(--ct-muted)">Check your connection, then try again.</p>
            </div>
          </div>
          <Button onClick={phase === "retrying" ? undefined : retry} aria-disabled={phase === "retrying" || undefined} className={phase === "retrying" ? "cursor-progress" : ""}>
            {phase === "retrying" ? (
              <>
                <Spinner /> Retrying…
              </>
            ) : (
              "Retry"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
