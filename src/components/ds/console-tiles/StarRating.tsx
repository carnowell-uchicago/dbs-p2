"use client";

import { useRef, useState, type ComponentProps, type KeyboardEvent } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { focusRing, pressScale } from "./styles";

// One star of the rating input. Lit (filled white) means chosen, or previewed
// while the pointer is over this star or one to its right. Unlit is a gray
// outline (3.5:1 on the surface). Hover adds a soft halo behind the star;
// pressed dims the fill; disabled fades the whole star.
const starClass =
  "grid size-11 shrink-0 place-items-center rounded-full hover:bg-(--ct-line) data-[force=hover]:bg-(--ct-line) active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) active:text-(--ct-muted) data-[force=pressed]:text-(--ct-muted) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

type StarProps = Omit<ComponentProps<"button">, "children"> & {
  n: number;
  lit?: boolean;
  force?: ForcedState;
};

export function StarButton({ n, lit = false, force, disabled, className = "", ...rest }: StarProps) {
  const on = lit || force === "hover" || force === "pressed" || force === "selected";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={force === "selected"}
      aria-label={`${n} star${n === 1 ? "" : "s"}`}
      disabled={disabled || force === "disabled"}
      className={`${starClass} ${on ? "text-(--ct-text)" : "text-(--ct-control)"} ${focusRing} ${pressScale} ${className}`}
      {...forceAttr(force)}
      {...rest}
    >
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8Z" />
      </svg>
    </button>
  );
}

// Five stars as a radio group. Hovering a star lights it and every star to its
// left; clicking or tapping sets the rating. Arrow keys move and set it, like
// any radio group; Tab enters on the chosen star (or the first).
export function StarRating({
  value,
  onChange,
  label,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  disabled?: boolean;
}) {
  const [preview, setPreview] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = preview || value;

  function onKeyDown(e: KeyboardEvent, n: number) {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowUp" ? Math.min(5, n + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowDown" ? Math.max(1, n - 1)
      : e.key === "Home" ? 1
      : e.key === "End" ? 5
      : null;
    if (next === null) return;
    e.preventDefault();
    onChange(next);
    refs.current[next - 1]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={label} className="flex" onPointerLeave={() => setPreview(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarButton
          key={n}
          n={n}
          ref={(el) => {
            refs.current[n - 1] = el;
          }}
          lit={n <= shown}
          aria-checked={value === n}
          tabIndex={(value || 1) === n ? 0 : -1}
          disabled={disabled}
          // Mouse only: a touch "hover" would leave the preview stuck on.
          onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(n)}
          onClick={() => onChange(n)}
          onKeyDown={(e) => onKeyDown(e, n)}
        />
      ))}
    </div>
  );
}
