"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";

export type Tab = { id: string; label: string; content: ReactNode; disabled?: boolean };

const tabClass =
  "relative h-11 px-4 text-xs uppercase tracking-[0.2em] text-(--na-muted) transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent after:transition-[background-color,box-shadow] hover:text-(--na-ice) hover:after:bg-(--na-edge) data-[force=hover]:text-(--na-ice) data-[force=hover]:after:bg-(--na-edge) active:text-(--na-cyan) data-[force=pressed]:text-(--na-cyan) aria-selected:text-(--na-ice) aria-selected:after:bg-(--na-cyan) aria-selected:after:shadow-[0_0_8px_var(--na-cyan)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--na-cyan) data-[force=focus]:outline-2 data-[force=focus]:-outline-offset-2 data-[force=focus]:outline-(--na-cyan) aria-disabled:pointer-events-none aria-disabled:text-(--na-line)";

// One tab, for the states row. The live Tabs below renders the same look.
export function TabButton({
  children,
  force,
}: {
  children: ReactNode;
  force?: ForcedState;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={force === "selected"}
      aria-disabled={force === "disabled" || undefined}
      {...forceAttr(force)}
      className={tabClass}
      style={{ fontFamily: "var(--na-mono)" }}
    >
      {children}
    </button>
  );
}

// WAI-ARIA tabs with automatic activation: ←/→ move and select, Home/End jump.
export function Tabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const base = useId();
  const [active, setActive] = useState(tabs.find((t) => !t.disabled)?.id ?? tabs[0].id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);

  function onKeyDown(e: KeyboardEvent, index: number) {
    const pos = enabled.indexOf(index);
    let next: number | undefined;
    if (e.key === "ArrowRight") next = enabled[(pos + 1) % enabled.length];
    if (e.key === "ArrowLeft") next = enabled[(pos - 1 + enabled.length) % enabled.length];
    if (e.key === "Home") next = enabled[0];
    if (e.key === "End") next = enabled[enabled.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    setActive(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="flex overflow-x-auto overflow-y-hidden [scrollbar-color:var(--na-edge)_transparent] [scrollbar-width:thin] border-b border-(--na-line)"
      >
        {tabs.map((t, i) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-${t.id}-tab`}
              aria-controls={`${base}-${t.id}-panel`}
              aria-selected={selected}
              aria-disabled={t.disabled || undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => !t.disabled && setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`${tabClass} shrink-0`}
              style={{ fontFamily: "var(--na-mono)" }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-${t.id}-panel`}
          aria-labelledby={`${base}-${t.id}-tab`}
          hidden={t.id !== active}
          className="pt-4"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
