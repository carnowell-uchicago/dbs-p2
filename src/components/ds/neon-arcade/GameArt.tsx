import type { ReactNode } from "react";
import type { Motif } from "@/data/games";

// Original thumbnails: each game drawn as thin light lines over a perspective
// grid. Ice strokes carry the shape, cyan marks the one detail that matters.
const I = "var(--na-ice)";
const C = "var(--na-cyan)";

const motifs: Record<Motif, ReactNode> = {
  donkey: (
    <>
      <path d="M52 46h36q6 0 8-6l6-12 4 2-2 10q8-2 10 4l-4 4-8-2-4 8v14M60 48v14M70 50v12M84 50v12M52 46q-6 0-8 8" stroke={I} />
      <path d="M104 28l-2-10M108 30l2-11" stroke={I} />
      <rect x="120" y="54" width="18" height="10" stroke={C} />
      <path d="M120 59h18M129 54v10" stroke={C} />
    </>
  ),
  orbit: (
    <>
      <circle cx="66" cy="44" r="14" stroke={I} />
      <ellipse cx="66" cy="44" rx="34" ry="9" transform="rotate(-14 66 44)" stroke={I} />
      <circle cx="122" cy="26" r="6" stroke={I} />
      <path d="M96 36q12-14 22-12" stroke={C} strokeDasharray="2 3" />
      <circle cx="98" cy="35" r="2.5" fill={C} stroke={C} />
    </>
  ),
  tower: (
    <>
      <path d="M60 64h40" stroke={I} />
      <rect x="64" y="52" width="32" height="12" stroke={I} />
      <path d="M70 52v-12h12v12M82 44h14v8" stroke={I} />
      <rect x="74" y="26" width="18" height="14" transform="rotate(8 83 33)" stroke={I} />
      <path d="M86 12l10 6-6 8-10-6Z" stroke={C} />
    </>
  ),
  road: (
    <>
      <path d="M78 34 40 90M82 34l38 56" stroke={I} />
      <path d="M80 40v6M80 54v8M80 72v12" stroke={I} />
      <path d="M90 70h14l4 6v4H86v-4Z" stroke={C} />
      <circle cx="91" cy="81" r="2" stroke={C} />
      <circle cx="104" cy="81" r="2" stroke={C} />
    </>
  ),
  golf: (
    <>
      <ellipse cx="96" cy="64" rx="34" ry="8" stroke={I} />
      <ellipse cx="104" cy="64" rx="4" ry="1.5" stroke={I} />
      <path d="M104 64V30l14 5-14 5" stroke={I} />
      <circle cx="70" cy="62" r="2.5" stroke={C} fill={C} />
      <path d="M48 52v14M48 52l-8-8M48 52l8-8M48 52l-8 8M48 52l8 8" stroke={I} />
    </>
  ),
  carrot: (
    <>
      <path d="M44 24h72v48H44ZM68 24v48M92 24v48M44 48h72" stroke={I} />
      <path d="M100 40l8-10-2 14Z" stroke={C} />
      <path d="M104 30l-3-4M106 30l2-5" stroke={C} />
      <text x="56" y="42" fill={I} fontSize="12" fontFamily="var(--na-mono)" textAnchor="middle">2</text>
      <text x="80" y="66" fill={I} fontSize="12" fontFamily="var(--na-mono)" textAnchor="middle">1</text>
    </>
  ),
  dungeon: (
    <>
      <path d="M40 20h80v52H40ZM56 20v20h20M96 20v12M40 56h24v16M80 40v20h24M104 52h16" stroke={I} />
      <circle cx="112" cy="30" r="3" stroke={C} />
      <path d="M112 33v8M112 38h3" stroke={C} />
      <rect x="48" y="44" width="5" height="5" fill={I} stroke={I} />
    </>
  ),
  balloon: (
    <>
      <path d="M80 14c14 0 22 10 22 20 0 12-14 20-18 26h-8c-4-6-18-14-18-26 0-10 8-20 22-20Z" stroke={I} />
      <path d="M80 14v46M70 18q-6 20 6 42M90 18q6 20-6 42" stroke={I} />
      <rect x="75" y="64" width="10" height="7" stroke={C} />
      <path d="M30 68h30M110 58h28" stroke={I} />
    </>
  ),
  ship: (
    <>
      <path d="M36 20h88v52H36Z" stroke={I} strokeDasharray="2 4" />
      <path d="M48 56h44l-6 8H54ZM62 56V40l14 8-14 4" stroke={I} />
      <circle cx="106" cy="36" r="8" stroke={C} />
      <path d="M106 24v24M94 36h24" stroke={C} />
    </>
  ),
  tortoise: (
    <>
      <path d="M58 58q4-24 26-24t26 24Z" stroke={I} />
      <path d="M70 58l6-12h16l6 12M84 34v12" stroke={I} />
      <path d="M110 54q8-4 12 2l-4 4h-8" stroke={I} />
      <path d="M64 62v6M100 62v6" stroke={I} />
      <path d="M56 50H34l-10 4 10 4h22" stroke={C} />
    </>
  ),
  paddle: (
    <>
      <path d="M30 28v24M130 40v24" stroke={I} strokeWidth="3" />
      <path d="M80 16v58" stroke={I} strokeDasharray="3 4" />
      <rect x="98" y="30" width="5" height="5" fill={C} stroke={C} />
      <path d="M40 46 96 34" stroke={C} strokeDasharray="1 4" />
    </>
  ),
  castle: (
    <>
      <path d="M28 70q52-26 104 0" stroke={I} />
      <path d="M62 56V32h6v4h6v-4h6v4h6v-4h6v24" stroke={I} />
      <path d="M76 56v-8a4 4 0 0 1 8 0v8" stroke={I} />
      <path d="M80 32V18l10 4-10 4" stroke={C} />
    </>
  ),
};

export function GameArt({ motif, className = "" }: { motif: Motif; className?: string }) {
  return (
    <div
      className={`relative aspect-video overflow-hidden bg-[linear-gradient(var(--na-void)_45%,var(--na-panel))] ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 160 90" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
        <g stroke="var(--na-line)" strokeWidth="0.75" fill="none">
          <path d="M0 66h160M0 72h160M0 80h160M0 90h160" />
          {[-200, -110, -50, 0, 50, 110, 200].map((dx) => (
            <path key={dx} d={`M${80 + dx / 8} 62 L${80 + dx * 1.2} 90`} />
          ))}
        </g>
        <path d="M0 62h160" stroke="var(--na-cyan)" strokeOpacity="0.5" strokeWidth="0.75" />
      </svg>
      <svg
        viewBox="0 0 160 90"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 2px var(--na-cyan))" }}
      >
        {motifs[motif]}
      </svg>
    </div>
  );
}
