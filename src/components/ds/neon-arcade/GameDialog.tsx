"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatPlays, type Game } from "@/data/games";
import { GameFlag, Rating } from "./Badge";
import { Button } from "./Button";
import { FavoriteButton } from "./FavoriteButton";
import { GameArt } from "./GameArt";

type Props = {
  game: Game | null;
  onClose: () => void;
  favorite?: boolean;
  onToggleFavorite?: () => void;
};

// Native modal dialog: showModal() makes the page behind it inert, Escape
// closes it, and focus goes back to whatever opened it.
export function GameDialog({ game, onClose, favorite = false, onToggleFavorite }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (game && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!game && dialog.open) {
      dialog.close();
    }
  }, [game]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      // A click on the dialog box itself (not its content) is the backdrop.
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-labelledby={titleId}
      className="m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-(--na-r-lg) border-2 border-(--na-cyan) bg-(--na-panel) p-0 text-(--na-ice) shadow-[0_0_4px_var(--na-cyan),0_0_32px_color-mix(in_srgb,var(--na-cyan)_35%,transparent)] backdrop:bg-(--na-void)/85"
    >
      {game && (
        <DialogBody
          key={game.slug}
          game={game}
          titleId={titleId}
          favorite={favorite}
          onToggleFavorite={onToggleFavorite}
          onClose={() => ref.current?.close()}
        />
      )}
    </dialog>
  );
}

function DialogBody({
  game,
  titleId,
  favorite,
  onToggleFavorite,
  onClose,
}: {
  game: Game;
  titleId: string;
  favorite: boolean;
  onToggleFavorite?: () => void;
  onClose: () => void;
}) {
  const [launch, setLaunch] = useState<"idle" | "loading" | "launching">("idle");
  const statusId = useId();

  useEffect(() => {
    if (launch !== "loading") return;
    const t = setTimeout(() => setLaunch("launching"), 1400);
    return () => clearTimeout(t);
  }, [launch]);

  return (
    <div className="relative">
      <GameArt motif={game.motif} className="border-b-2 border-(--na-line)" />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 grid size-11 place-items-center rounded-(--na-r-md) border-2 border-(--na-edge) bg-(--na-void)/85 text-(--na-ice) hover:border-(--na-cyan) hover:text-(--na-cyan) active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--na-cyan)"
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="m3.5 3.5 9 9m0-9-9 9" />
        </svg>
      </button>
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <GameFlag game={game} />
          <span
            className="text-xs uppercase tracking-[0.08em] text-(--na-muted)"
            style={{ fontFamily: "var(--na-mono)" }}
          >
            {game.category}
          </span>
        </div>
        <h2
          id={titleId}
          className="text-2xl font-semibold leading-tight"
          style={{ fontFamily: "var(--na-display)" }}
        >
          {game.title}
        </h2>
        <p className="text-base leading-relaxed text-(--na-ice)/90" style={{ fontFamily: "var(--na-body)" }}>
          {game.blurb}
        </p>
        <dl
          className="grid grid-cols-2 gap-x-4 gap-y-3 border-y-2 border-(--na-line) py-4 text-xs uppercase tracking-[0.06em] sm:grid-cols-4"
          style={{ fontFamily: "var(--na-mono)" }}
        >
          <div className="flex flex-col gap-1">
            <dt className="text-(--na-muted)">Rating</dt>
            <dd><Rating value={game.rating} /></dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-(--na-muted)">Played</dt>
            <dd>{formatPlays(game.plays).replace(" plays", "")}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-(--na-muted)">Session</dt>
            <dd>~{game.minutes} min</dd>
          </div>
          <div className="col-span-2 flex flex-col gap-1 sm:col-span-4">
            <dt className="text-(--na-muted)">Controls</dt>
            <dd className="normal-case tracking-normal">{game.controls}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            aria-describedby={statusId}
            aria-disabled={launch !== "idle" || undefined}
            onClick={() => launch === "idle" && setLaunch("loading")}
            className="flex-1 sm:flex-none sm:min-w-40"
          >
            {launch === "loading" && (
              <span
                className="size-4 rounded-full border-2 border-(--na-void)/30 border-t-(--na-void) motion-safe:animate-spin"
                aria-hidden
              />
            )}
            {launch === "idle" ? "Play" : launch === "loading" ? "Loading" : "Launching…"}
          </Button>
          <FavoriteButton title={game.title} selected={favorite} onClick={onToggleFavorite} />
        </div>
        <p
          id={statusId}
          role="status"
          className="min-h-5 text-xs uppercase tracking-[0.06em] text-(--na-muted)"
          style={{ fontFamily: "var(--na-mono)" }}
        >
          {launch === "loading" && `Loading ${game.title}…`}
          {launch === "launching" && `${game.title} is starting. Have fun.`}
        </p>
      </div>
    </div>
  );
}
