"use client";

import { useEffect, useId, useRef } from "react";
import type { Game } from "@/data/games";
import { GameDetail, type FavoriteProps, type RatingProps } from "./GameDetail";

// Native modal dialog: showModal() makes the page inert and traps focus,
// Escape closes it, a click on the backdrop closes it, and focus goes back
// to whatever opened it.
//
// To avoid scrolling, the whole panel scales down (CSS zoom) until it fits the
// window, but never so far that its smallest text (12px badges) drops under
// MIN_TEXT_PX. Below that it keeps that size and scrolls, scrollbar hidden.
const SMALLEST_TEXT_PX = 12;
const MIN_TEXT_PX = 10;
const MIN_ZOOM = MIN_TEXT_PX / SMALLEST_TEXT_PX;
const GAP_PX = 32; // breathing room above and below the panel

function fit(dialog: HTMLDialogElement) {
  dialog.style.zoom = "1";
  dialog.style.maxHeight = "none";
  const avail = window.innerHeight - GAP_PX;
  const zoom = Math.max(MIN_ZOOM, Math.min(1, avail / dialog.scrollHeight));
  dialog.style.zoom = String(zoom);
  // max-height is zoomed too, so divide to keep the panel inside the window.
  dialog.style.maxHeight = `${avail / zoom}px`;
}
export function GameDialog({
  game,
  onClose,
  ...shared
}: { game: Game | null; onClose: () => void } & FavoriteProps & RatingProps) {
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

  // Fit after showModal() (above) so the open panel can be measured, and again
  // whenever the window changes size.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !game) return;
    fit(dialog);
    const refit = () => fit(dialog);
    window.addEventListener("resize", refit);
    return () => window.removeEventListener("resize", refit);
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
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100%-2rem))] overflow-y-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-(--ct-surface) p-0 text-(--ct-text) shadow-[0_24px_60px_rgb(0_0_0/0.6)] backdrop:bg-black/70"
      style={{ fontFamily: "var(--ct-body)" }}
    >
      {game && (
        <GameDetail key={game.slug} game={game} titleId={titleId} onClose={() => ref.current?.close()} {...shared} />
      )}
    </dialog>
  );
}
