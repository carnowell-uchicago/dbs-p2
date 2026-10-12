import type { ReactNode } from "react";
import { edge } from "./styles";

// Wood-framed paper panel: 4px wood edge, light bevel inside, hard shadow.
export function Panel({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      style={edge}
      className={`bg-(--cp-surface) [--w:4px] [--e:var(--cp-wood)] [--d:4px] ${className}`}
    >
      <div className="h-full shadow-[inset_0_0_0_2px_var(--cp-bevel)]">{children}</div>
    </Tag>
  );
}
