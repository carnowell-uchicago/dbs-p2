import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { CheckIcon, ChevronDown, SearchIcon } from "./Icons";
import { focusRing, peerFocusRing } from "./styles";

const fieldBox =
  "h-11 w-full rounded-full border border-(--ct-control) bg-(--ct-surface) text-base text-(--ct-text) hover:border-(--ct-text) data-[force=hover]:border-(--ct-text) disabled:cursor-not-allowed disabled:border-(--ct-disabled) disabled:bg-(--ct-disabled) disabled:text-(--ct-disabled-text)";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hideLabel?: boolean;
  force?: ForcedState;
};

export function SearchField({
  label,
  hideLabel,
  force,
  disabled,
  className = "",
  ...rest
}: InputProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className={hideLabel ? "sr-only" : "text-sm font-semibold"}>{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-(--ct-muted)">
          <SearchIcon />
        </span>
        <input
          type="search"
          disabled={disabled || force === "disabled"}
          className={`${fieldBox} ${focusRing} pr-4 pl-11 placeholder:text-(--ct-muted) disabled:placeholder:text-(--ct-disabled-text)`}
          {...forceAttr(force)}
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
  children: ReactNode;
};

export function SelectField({
  label,
  hideLabel,
  force,
  disabled,
  className = "",
  children,
  ...rest
}: SelectProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className={hideLabel ? "sr-only" : "text-sm font-semibold"}>{label}</span>
      <span className="relative block">
        <select
          disabled={disabled || force === "disabled"}
          className={`${fieldBox} ${focusRing} cursor-pointer appearance-none pr-11 pl-4 font-semibold`}
          {...forceAttr(force)}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-(--ct-text)">
          <ChevronDown />
        </span>
      </span>
    </label>
  );
}

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  force?: ForcedState;
};

// Checked / on is always the dark text color: "dark means chosen".
const choiceBox =
  "peer size-6 shrink-0 cursor-pointer appearance-none border-2 border-(--ct-control) bg-(--ct-surface) hover:border-(--ct-text) data-[force=hover]:border-(--ct-text) checked:border-(--ct-text) checked:bg-(--ct-text) active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) checked:active:bg-(--ct-muted) disabled:cursor-not-allowed disabled:border-(--ct-disabled) disabled:bg-(--ct-disabled)";

function choiceLabel(disabled?: boolean) {
  return `flex items-center gap-3 text-base ${disabled ? "cursor-not-allowed text-(--ct-disabled-text)" : "cursor-pointer"}`;
}

export function Checkbox({ label, force, disabled, ...rest }: ChoiceProps) {
  const off = disabled || force === "disabled";
  return (
    <label className={choiceLabel(off)}>
      <span className="relative grid place-items-center">
        <input
          type="checkbox"
          disabled={off}
          defaultChecked={force === "selected" || undefined}
          className={`${choiceBox} ${focusRing} rounded-md`}
          {...forceAttr(force)}
          {...rest}
        />
        <CheckIcon className="pointer-events-none absolute hidden size-4 text-white peer-checked:block" />
      </span>
      {label}
    </label>
  );
}

export function Radio({ label, force, disabled, ...rest }: ChoiceProps) {
  const off = disabled || force === "disabled";
  return (
    <label className={choiceLabel(off)}>
      <input
        type="radio"
        disabled={off}
        defaultChecked={force === "selected" || undefined}
        className={`${choiceBox} ${focusRing} rounded-full checked:shadow-[inset_0_0_0_4px_var(--ct-surface)]`}
        {...forceAttr(force)}
        {...rest}
      />
      {label}
    </label>
  );
}

// A checkbox with role="switch". The knob slides and shows a check when on.
export function Toggle({ label, force, disabled, ...rest }: ChoiceProps) {
  const off = disabled || force === "disabled";
  return (
    <label className={`${choiceLabel(off)} justify-between gap-4`}>
      {label}
      <span className="relative inline-flex shrink-0 items-center">
        <input
          type="checkbox"
          role="switch"
          disabled={off}
          defaultChecked={force === "selected" || undefined}
          className="peer sr-only"
          {...forceAttr(force)}
          {...rest}
        />
        <span
          aria-hidden
          className={`h-7 w-12 rounded-full bg-(--ct-control) peer-hover:bg-(--ct-muted) peer-data-[force=hover]:bg-(--ct-muted) peer-checked:bg-(--ct-text) peer-active:bg-(--ct-muted) peer-data-[force=pressed]:bg-(--ct-muted) peer-disabled:bg-(--ct-disabled) motion-safe:transition-colors ${peerFocusRing}`}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-1 grid size-5 place-items-center rounded-full bg-(--ct-surface) text-(--ct-text) shadow-[0_1px_3px_rgb(0_0_0/0.3)] peer-checked:translate-x-5 peer-disabled:shadow-none motion-safe:transition-transform [&>svg]:hidden peer-checked:[&>svg]:block"
        >
          <CheckIcon className="size-3.5" />
        </span>
      </span>
    </label>
  );
}
