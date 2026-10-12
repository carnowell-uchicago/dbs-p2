import Link from "next/link";
import type { ComponentProps } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { font } from "./styles";

type Props = ComponentProps<typeof Link> & { force?: ForcedState };

// Underlined cocoa text; hover thickens the underline and tints the text wood.
export function TextLink({ force, className = "", ...rest }: Props) {
  return (
    <Link
      {...forceAttr(force)}
      className={`${font.body} font-semibold text-(--cp-text) underline decoration-2 underline-offset-4 decoration-(--cp-wood) hover:text-(--cp-wood) hover:decoration-4 data-[force=hover]:text-(--cp-wood) data-[force=hover]:decoration-4 active:bg-(--cp-hover) data-[force=pressed]:bg-(--cp-hover) outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--cp-text) data-[force=focus]:outline-3 data-[force=focus]:outline-solid data-[force=focus]:outline-offset-2 data-[force=focus]:outline-(--cp-text) ${className}`}
      {...rest}
    />
  );
}
