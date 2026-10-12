"use client";

import { useEffect, useState, type ReactNode } from "react";
import { gameBySlug } from "@/data/games";
import { Button } from "@/components/ds/neon-arcade/Button";
import { Cap, Section, heading } from "./parts";

function Card({ label, tone = "line", children }: { label: string; tone?: "line" | "red" | "green"; children: ReactNode }) {
  const border = { line: "border-(--na-line)", red: "border-(--na-red)", green: "border-(--na-green)" }[tone];
  return (
    <figure className="flex min-w-0 flex-col items-center gap-2">
      <div className={`flex min-h-36 w-full flex-1 flex-col items-center justify-center gap-2 rounded-(--na-r-lg) border-2 bg-(--na-panel) p-4 text-center ${border}`}>
        {children}
      </div>
      <figcaption>
        <Cap>{label}</Cap>
      </figcaption>
    </figure>
  );
}

function Icon({ d, className }: { d: string; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-6 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Empty() {
  const [cleared, setCleared] = useState(false);
  return (
    <Card label="Empty">
      <div role="status" className="flex flex-col items-center gap-2">
        {cleared ? (
          <p className="text-base text-(--na-muted)">All 12 games are back.</p>
        ) : (
          <>
            <p className="text-base font-semibold text-(--na-ice)" style={heading}>
              No games match &ldquo;zebra&rdquo;
            </p>
            <Button size="sm" onClick={() => setCleared(true)}>
              Clear
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

function Loading() {
  return (
    <Card label="Loading">
      <div aria-busy="true" className="flex flex-col items-center gap-3">
        <span className="size-6 rounded-full border-2 border-(--na-line) border-t-(--na-cyan) motion-safe:animate-spin" aria-hidden />
        <p role="status" className="text-base text-(--na-muted)">
          Loading games…
        </p>
      </div>
    </Card>
  );
}

function ErrorState() {
  const game = gameBySlug("hilltop-defense");
  const [retrying, setRetrying] = useState(false);
  useEffect(() => {
    if (!retrying) return;
    const t = setTimeout(() => setRetrying(false), 1200);
    return () => clearTimeout(t);
  }, [retrying]);
  return (
    <Card label="Error" tone="red">
      <div role="alert" className="flex flex-col items-center gap-2">
        <Icon d="M12 8v5m0 3.5v.5M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" className="text-(--na-red)" />
        <p className="text-base font-semibold text-(--na-red)" style={heading}>
          {game.title} didn&rsquo;t load
        </p>
      </div>
      <Button size="sm" aria-disabled={retrying || undefined} onClick={() => !retrying && setRetrying(true)}>
        {retrying ? "Retrying" : "Retry"}
      </Button>
    </Card>
  );
}

function Success() {
  return (
    <Card label="Success" tone="green">
      <div role="status" className="flex flex-col items-center gap-2">
        <Icon d="m5 12.5 4.5 4.5L19 7.5" className="text-(--na-green)" />
        <p className="text-base font-semibold text-(--na-green)" style={heading}>
          Added to favorites
        </p>
      </div>
    </Card>
  );
}

export function UiStatesSection() {
  return (
    <Section id="ui-states" n={6} title="UI states">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Empty />
        <Loading />
        <ErrorState />
        <Success />
      </div>
    </Section>
  );
}
