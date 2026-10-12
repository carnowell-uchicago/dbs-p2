"use client";

import { useEffect, useRef, useState } from "react";
import type { ForcedState } from "@/lib/design-system";
import { Button } from "./Button";
import { PlayIcon, Spinner } from "./Icons";

export type PlayPhase = "idle" | "loading" | "launching";

// Presentational: what the Play button looks like in each phase.
export function PlayButtonView({
  title,
  phase = "idle",
  force,
  onClick,
  className = "",
}: {
  title: string;
  phase?: PlayPhase;
  force?: ForcedState;
  onClick?: () => void;
  className?: string;
}) {
  const busy = phase !== "idle";
  return (
    <Button
      variant="primary"
      force={force}
      onClick={busy ? undefined : onClick}
      aria-disabled={busy || undefined}
      aria-label={busy ? undefined : `Play ${title}`}
      className={`min-w-36 ${busy ? "cursor-progress" : ""} ${className}`}
    >
      {phase === "idle" && (
        <>
          <PlayIcon /> Play
        </>
      )}
      {phase === "loading" && (
        <>
          <Spinner /> Loading…
        </>
      )}
      {phase === "launching" && <>Launching…</>}
    </Button>
  );
}

// Fake launch: a short load, then "Launching…", then back to Play.
export function PlayButton({ title, className }: { title: string; className?: string }) {
  const [phase, setPhase] = useState<PlayPhase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start() {
    setPhase("loading");
    timers.current.push(
      window.setTimeout(() => setPhase("launching"), 1200),
      window.setTimeout(() => setPhase("idle"), 3600),
    );
  }

  return (
    <>
      <PlayButtonView title={title} phase={phase} onClick={start} className={className} />
      <span role="status" className="sr-only">
        {phase === "loading" ? `Loading ${title}` : phase === "launching" ? `Launching ${title}` : ""}
      </span>
    </>
  );
}
