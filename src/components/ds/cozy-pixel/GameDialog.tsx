"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatPlays, type Game } from "@/data/games";
import { Button } from "./Button";
import { GameArt } from "./GameArt";
import { Icon } from "./icons";
import { Badge, FavoriteButton, Rating } from "./Meta";
import { edge, font, type } from "./styles";

type Props = {
  game: Game | null;
  onClose: () => void;
  isFavorite: boolean;
  onFavoriteChange: (on: boolean) => void;
};

// Detail dialog styled as a wooden game dialog box. Native <dialog> with
// showModal(): the page behind goes inert, Escape and a backdrop click close
// it, and the browser returns focus to the card that opened it.
export function GameDialog({ game, onClose, isFavorite, onFavoriteChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (game && !dialog.open) dialog.showModal();
    if (!game && dialog.open) dialog.close();
  }, [game]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="m-auto w-[min(34rem,calc(100%-2.5rem))] overflow-visible bg-transparent p-0 text-(--cp-text) backdrop:bg-[#3b2a20]/60"
    >
      {game ? (
        <GameDialogPanel
          key={game.slug}
          titleId={titleId}
          game={game}
          isFavorite={isFavorite}
          onFavoriteChange={onFavoriteChange}
          onClose={() => ref.current?.close()}
        />
      ) : null}
    </dialog>
  );
}

type Phase = "idle" | "loading" | "launching";

type PanelProps = Omit<Props, "game" | "onClose"> & {
  game: Game;
  titleId: string;
  onClose: () => void;
};

// The dialog's contents. Exported so the design system can show it inline.
export function GameDialogPanel({ game, titleId, isFavorite, onFavoriteChange, onClose }: PanelProps) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => setPhase("launching"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div
      style={edge}
      className={`max-h-[calc(100dvh-3rem)] overflow-y-auto bg-(--cp-surface) [--w:4px] [--e:var(--cp-wood)] [--d:6px] ${font.body}`}
    >
      <div className="flex items-center justify-between gap-3 bg-(--cp-wood) py-3 pr-3 pl-4">
        <h2 id={titleId} className={`${type.heading} text-(--cp-surface)`}>
          {game.title}
        </h2>
        <Button size="sm" aria-label="Close" onClick={onClose} className="w-9 px-0">
          <Icon name="close" />
        </Button>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="relative shadow-[0_0_0_3px_var(--cp-bevel)]">
          <GameArt motif={game.motif} />
          <span className="absolute top-2 left-2 flex gap-2">
            <Badge tone="category">{game.category}</Badge>
            {game.isNew ? <Badge tone="new">New</Badge> : null}
            {game.isHot ? <Badge tone="hot">Hot</Badge> : null}
          </span>
        </div>

        <p className={type.body}>{game.blurb}</p>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-base">
          <dt className={`${type.label} pt-0.5 text-(--cp-muted)`}>Rating</dt>
          <dd>
            <Rating value={game.rating} />
          </dd>
          <dt className={`${type.label} pt-0.5 text-(--cp-muted)`}>Played</dt>
          <dd>{formatPlays(game.plays)}</dd>
          <dt className={`${type.label} pt-0.5 text-(--cp-muted)`}>Length</dt>
          <dd>About {game.minutes} min</dd>
          <dt className={`${type.label} pt-0.5 text-(--cp-muted)`}>Controls</dt>
          <dd>{game.controls}</dd>
        </dl>

        <div className="flex flex-wrap items-center gap-4 pt-2 pb-2">
          <Button
            variant="primary"
            aria-disabled={phase !== "idle"}
            onClick={() => phase === "idle" && setPhase("loading")}
            className="min-w-36 aria-disabled:cursor-progress"
          >
            {phase === "idle" ? "Play" : phase === "loading" ? "Loading…" : "Launching…"}
          </Button>
          <FavoriteButton on={isFavorite} onClick={() => onFavoriteChange(!isFavorite)} />
        </div>

        <p role="status" className="flex min-h-10 items-center">
          {phase === "loading" ? (
            <span className="text-(--cp-muted)">Warming up {game.title}…</span>
          ) : phase === "launching" ? (
            <span
              style={edge}
              className="flex items-center gap-2 bg-(--cp-success) px-3 py-2 font-semibold text-(--cp-text) [--w:2px] [--e:var(--cp-text)] [--d:0px]"
            >
              <Icon name="check" /> Launching {game.title}. Have fun!
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
