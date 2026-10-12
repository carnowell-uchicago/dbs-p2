import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";

const labelClass =
  "text-xs uppercase tracking-[0.2em] text-(--na-muted)";

// Shared field box: Edge border (3.6:1) at rest, cyan when hovered or focused.
const box =
  "h-11 w-full border border-(--na-edge) bg-(--na-panel) text-base text-(--na-ice) transition-[border-color,box-shadow] outline-hidden hover:border-(--na-cyan)/70 data-[force=hover]:border-(--na-cyan)/70 focus-visible:border-(--na-cyan) focus-visible:shadow-[0_0_0_1px_var(--na-cyan),0_0_12px_color-mix(in_srgb,var(--na-cyan)_40%,transparent)] data-[force=focus]:border-(--na-cyan) data-[force=focus]:shadow-[0_0_0_1px_var(--na-cyan),0_0_12px_color-mix(in_srgb,var(--na-cyan)_40%,transparent)] aria-[invalid=true]:border-(--na-red) disabled:pointer-events-none disabled:border-(--na-line) disabled:bg-(--na-void) disabled:text-(--na-muted)";

type SearchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hideLabel?: boolean;
  force?: ForcedState;
};

export function SearchInput({
  label,
  hideLabel,
  force,
  className = "",
  disabled,
  ...rest
}: SearchProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span
        className={hideLabel ? "sr-only" : labelClass}
        style={{ fontFamily: "var(--na-mono)" }}
      >
        {label}
      </span>
      <span className="relative block">
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--na-muted)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3.5 3.5" />
        </svg>
        <input
          type="search"
          disabled={disabled || force === "disabled"}
          {...forceAttr(force)}
          className={`${box} pl-10 pr-3 placeholder:text-(--na-muted)`}
          style={{ fontFamily: "var(--na-body)" }}
          {...rest}
        />
      </span>
    </label>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hideLabel?: boolean;
  force?: ForcedState;
};

export function Select({
  label,
  hideLabel,
  force,
  className = "",
  disabled,
  children,
  ...rest
}: SelectProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span
        className={hideLabel ? "sr-only" : labelClass}
        style={{ fontFamily: "var(--na-mono)" }}
      >
        {label}
      </span>
      <span className="relative block">
        <select
          disabled={disabled || force === "disabled"}
          {...forceAttr(force)}
          className={`${box} cursor-pointer appearance-none pl-3 pr-10 [&>option]:bg-(--na-panel)`}
          style={{ fontFamily: "var(--na-body)" }}
          {...rest}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--na-cyan)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </span>
    </label>
  );
}
