import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { forceAttr, type ForcedState } from "@/lib/design-system";

// Links stay text-colored and underlined; color is not their only signal.
export const linkClass =
  "rounded-sm font-semibold text-(--ct-text) underline decoration-(--ct-control) decoration-2 underline-offset-4 hover:decoration-(--ct-text) data-[force=hover]:decoration-(--ct-text) active:text-(--ct-muted) data-[force=pressed]:text-(--ct-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ct-select) data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-(--ct-select) focus-visible:bg-(--ct-select)/25 data-[force=focus]:bg-(--ct-select)/25";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  force?: ForcedState;
};

export function TextLink({ href, force, className = "", ...rest }: Props) {
  return (
    <Link
      href={href}
      className={`${linkClass} ${className}`}
      {...forceAttr(force)}
      {...rest}
    />
  );
}
