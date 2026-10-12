import Link from "next/link";
import type { ComponentProps } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { focusRing } from "./classes";

type Props = ComponentProps<typeof Link> & { force?: ForcedState };

// Cyan underline marks it as clickable; hover brightens to white-hot with a glow.
export const linkClass =
  "rounded-(--na-r-sm) text-(--na-cyan) underline decoration-(--na-cyan)/50 decoration-2 underline-offset-4 transition-[color,text-decoration-color,text-shadow] hover:text-(--na-ice) hover:decoration-(--na-cyan) hover:[text-shadow:0_0_8px_var(--na-cyan)] data-[force=hover]:text-(--na-ice) data-[force=hover]:decoration-(--na-cyan) data-[force=hover]:[text-shadow:0_0_8px_var(--na-cyan)] active:text-(--na-cyan) active:decoration-[3px] active:[text-shadow:none] data-[force=pressed]:decoration-[3px]";

export function TextLink({ force, className = "", ...rest }: Props) {
  return (
    <Link
      {...forceAttr(force)}
      className={`${linkClass} ${focusRing} ${className}`}
      {...rest}
    />
  );
}
