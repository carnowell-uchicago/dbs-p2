"use client";

import { useEffect, useId, useRef } from "react";
import type { Game } from "@/data/games";
import { GameDetail } from "./GameDetail";

// Native modal dialog: showModal() makes the page inert and traps focus,
// Escape closes it, a click on the backdrop closes it, and focus goes back
// to whatever opened it.
export function GameDialog({ game, onClose }: { game: Game | null; onClose: () => void }) {
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
      aria-labelledby={titleId}
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-(--ct-surface) p-0 text-(--ct-text) shadow-[0_24px_60px_rgb(0_0_0/0.3)] backdrop:bg-black/55"
      style={{ fontFamily: "var(--ct-body)" }}
    >
      {game && <GameDetail key={game.slug} game={game} titleId={titleId} onClose={() => ref.current?.close()} />}
    </dialog>
  );
}
