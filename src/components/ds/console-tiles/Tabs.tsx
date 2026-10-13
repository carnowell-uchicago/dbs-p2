"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { focusRing } from "./styles";

export const tabClass =
  "relative h-11 rounded-full px-4 text-base font-semibold text-(--ct-muted) hover:bg-(--ct-surface) hover:text-(--ct-text) data-[force=hover]:bg-(--ct-surface) data-[force=hover]:text-(--ct-text) active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) aria-selected:bg-(--ct-text) aria-selected:text-(--ct-bg) aria-selected:hover:bg-(--ct-text) aria-selected:hover:text-(--ct-bg) disabled:cursor-not-allowed disabled:text-(--ct-disabled-text) disabled:hover:bg-transparent";

// Presentational tab, used by Tabs and by the frozen state specimens.
export function TabButton({
  force,
  selected = false,
  disabled,
  children,
}: {
  force?: ForcedState;
  selected?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected || force === "selected"}
      disabled={disabled || force === "disabled"}
      className={`${tabClass} ${focusRing}`}
      {...forceAttr(force)}
    >
      {children}
    </button>
  );
}

export type TabItem = { id: string; label: string; content: ReactNode };

// WAI-ARIA tabs with automatic activation: arrows, Home, and End move and select.
export function Tabs({ label, items }: { label: string; items: TabItem[] }) {
  const base = useId();
  const [active, setActive] = useState(items[0].id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent, i: number) {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(items[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-1">
        {items.map((item, i) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`${tabClass} ${focusRing}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className={`mt-4 rounded-2xl ${focusRing}`}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
