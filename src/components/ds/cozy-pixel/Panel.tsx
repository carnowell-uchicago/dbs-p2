import type { ReactNode } from "react";
import { bevelEdge } from "./styles";

// Wood-framed paper panel: 4px wood edge with stepped corners, light bevel
// inside, hard shadow.
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
      style={bevelEdge}
      className={`bg-(--cp-surface) [--w:4px] [--e:var(--cp-wood)] [--d:4px] ${className}`}
    >
      <div className="h-full">{children}</div>
    </Tag>
  );
}
