"use client";

import { useEffect, useState, type ReactNode } from "react";
import { gameBySlug } from "@/data/games";
import { Button } from "@/components/ds/neon-arcade/Button";
import { SearchInput } from "@/components/ds/neon-arcade/Field";
import { Section, labelClass, mono } from "./parts";

const heading = { fontFamily: "var(--na-display-alt)" };

function Panel({
  label,
  tone = "line",
  children,
}: {
  label: string;
  tone?: "line" | "red" | "green";
  children: ReactNode;
}) {
  const border = {
    line: "border-(--na-line)",
    red: "border-(--na-red)",
    green: "border-(--na-green)",
  }[tone];
  return (
    <article className="flex flex-col gap-3">
      <h3 className={labelClass} style={mono}>
        {label}
      </h3>
      <div className={`flex min-h-56 flex-1 flex-col border bg-(--na-panel) p-5 ${border}`}>{children}</div>
    </article>
  );
}

function Icon({ d, className }: { d: string; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-6 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Empty() {
  const [q, setQ] = useState("zebra kart");
  return (
    <Panel label="Empty">
      <SearchInput label="Search games" hideLabel value={q} onChange={(e) => setQ(e.target.value)} />
      <div role="status" className="flex flex-1 flex-col items-start justify-center gap-2 pt-4">
        {q ? (
          <>
            <p className="text-lg font-semibold text-(--na-ice)" style={heading}>
              No games match &ldquo;{q}&rdquo;
            </p>
            <p className="text-base text-(--na-muted)">Try a shorter word, or clear the search.</p>
            <Button className="mt-2" onClick={() => setQ("")}>
              Clear search
            </Button>
          </>
        ) : (
          <p className="text-base text-(--na-muted)">All 12 games are showing.</p>
        )}
      </div>
    </Panel>
  );
}

function Loading() {
  return (
    <Panel label="Loading">
      <div aria-busy="true" className="flex flex-1 flex-col gap-4">
        <p role="status" className={labelClass} style={mono}>
          Loading games…
        </p>
        <div className="grid flex-1 grid-cols-2 gap-3" aria-hidden>
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-2 border border-(--na-line) p-2">
              <div className="aspect-video bg-(--na-raised) motion-safe:animate-pulse" />
              <div className="h-3 w-3/4 bg-(--na-raised) motion-safe:animate-pulse" />
              <div className="h-2.5 w-1/2 bg-(--na-raised) motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ErrorState() {
  const game = gameBySlug("hilltop-defense");
  const [retrying, setRetrying] = useState(false);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!retrying) return;
    const t = setTimeout(() => {
      setRetrying(false);
      setTries((n) => n + 1);
    }, 1200);
    return () => clearTimeout(t);
  }, [retrying]);

  return (
    <Panel label="Error" tone="red">
      <div role="alert" className="flex flex-1 flex-col items-start gap-2">
        <Icon d="M12 8v5m0 3.5v.5M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" className="text-(--na-red)" />
        <p className="text-lg font-semibold text-(--na-red)" style={heading}>
          {game.title} didn&rsquo;t load
        </p>
        <p className="text-base text-(--na-muted)">
          {tries === 0 ? "The connection dropped. Your progress is safe." : "Still no connection. Check your Wi-Fi, then retry."}
        </p>
      </div>
      <Button className="mt-4 self-start" aria-disabled={retrying || undefined} onClick={() => !retrying && setRetrying(true)}>
        {retrying && (
          <span className="size-4 rounded-full border-2 border-(--na-ice)/30 border-t-(--na-ice) motion-safe:animate-spin" aria-hidden />
        )}
        {retrying ? "Retrying" : "Retry"}
      </Button>
    </Panel>
  );
}

function Success() {
  const game = gameBySlug("hay-runner");
  return (
    <Panel label="Success" tone="green">
      <div role="status" className="flex flex-1 flex-col items-start gap-2">
        <Icon d="m5 12.5 4.5 4.5L19 7.5" className="text-(--na-green)" />
        <p className="text-lg font-semibold text-(--na-green)" style={heading}>
          Added to favorites
        </p>
        <p className="text-base text-(--na-muted)">{game.title} is waiting in Saved whenever you want a quick run.</p>
      </div>
    </Panel>
  );
}

export function UiStatesSection() {
  return (
    <Section
      id="ui-states"
      index="05"
      title="UI states"
      intro="What the page says when there is nothing to show, while it waits, when it fails, and when it works."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Empty />
        <Loading />
        <ErrorState />
        <Success />
      </div>
    </Section>
  );
}
