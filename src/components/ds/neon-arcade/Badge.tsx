import type { Game } from "@/data/games";

type Tone = "new" | "hot" | "plain";

// Outline only: badges label things, they are never clickable.
const tones: Record<Tone, string> = {
  new: "border-(--na-cyan) text-(--na-cyan)",
  hot: "border-(--na-magenta) text-(--na-magenta)",
  plain: "border-(--na-edge) text-(--na-muted)",
};

export function Badge({ tone = "plain", children }: { tone?: Tone; children: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center border bg-(--na-void) px-2 text-xs uppercase tracking-[0.14em] ${tones[tone]}`}
      style={{ fontFamily: "var(--na-mono)" }}
    >
      {children}
    </span>
  );
}

// New beats Hot when a game is both, so a card carries at most one flag.
export function GameFlag({ game }: { game: Game }) {
  if (game.isNew) return <Badge tone="new">New</Badge>;
  if (game.isHot) return <Badge tone="hot">Hot</Badge>;
  return null;
}

export function Rating({ value }: { value: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of 5`}
      className="inline-flex items-center gap-1.5 text-xs tracking-[0.1em] text-(--na-ice)"
      style={{ fontFamily: "var(--na-mono)" }}
    >
      <span className="relative inline-flex" aria-hidden>
        <Stars className="text-(--na-edge)" />
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${(value / 5) * 100}%` }}
        >
          <Stars className="text-(--na-ice)" />
        </span>
      </span>
      <span aria-hidden>{value.toFixed(1)}</span>
    </span>
  );
}

function Stars({ className }: { className: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 16 16" className="size-3 shrink-0" fill="currentColor">
          <path d="M8 1.5 9.9 6h4.6l-3.7 2.8 1.4 4.7L8 10.7l-4.2 2.8 1.4-4.7L1.5 6h4.6Z" />
        </svg>
      ))}
    </span>
  );
}
