import type { Artifact } from "./types";

const glow = (alpha: number) =>
  `color-mix(in srgb, var(--na-cyan) ${alpha}%, transparent)`;

// Blur copy of the stroke merged under the crisp one, so lines read as light.
function GlowFilter({ id, blur }: { id: string; blur: number }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

function GridFloor() {
  return (
    <div
      role="img"
      aria-label="Cyan grid floor receding to a glowing horizon"
      className="relative aspect-[4/3] overflow-hidden bg-(--na-void)"
      style={{ perspective: "260px" }}
    >
      <style>{`@keyframes na-tex-scroll { to { background-position: 0 24px, 0 0; } }`}</style>
      <div
        aria-hidden
        className="absolute top-[45%] -left-1/2 h-[200%] w-[200%] origin-top motion-safe:animate-[na-tex-scroll_1.6s_linear_infinite]"
        style={{
          transform: "rotateX(72deg)",
          backgroundImage: `linear-gradient(${glow(80)} 1px, transparent 1px), linear-gradient(90deg, ${glow(80)} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      {/* Fade the far grid into the dark so it meets the horizon softly. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[45%] h-1/3"
        style={{
          background: "linear-gradient(var(--na-void), transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-[45%] h-0.5 bg-(--na-ice)"
        style={{
          boxShadow: `0 0 8px 2px ${glow(70)}, 0 0 24px 6px ${glow(35)}`,
        }}
      />
    </div>
  );
}

const blueprintDots = [
  [40, 40],
  [120, 20],
  [80, 100],
  [140, 120],
  [20, 140],
];

function BlueprintGrid() {
  return (
    <div
      role="img"
      aria-label="Dim blueprint grid with a few glowing intersections"
      className="relative aspect-square overflow-hidden bg-(--na-panel)"
      style={{
        backgroundImage:
          "linear-gradient(var(--na-line) 1px, transparent 1px), linear-gradient(90deg, var(--na-line) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {blueprintDots.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          aria-hidden
          className="absolute size-1.5 -translate-x-[2.5px] -translate-y-[2.5px] rounded-full bg-(--na-ice)"
          style={{
            left: x,
            top: y,
            boxShadow: `0 0 4px 1px var(--na-cyan), 0 0 12px 3px ${glow(50)}`,
          }}
        />
      ))}
    </div>
  );
}

function Scanlines() {
  return (
    <div
      role="img"
      aria-label="CRT scanlines over a faint cyan glow"
      className="relative aspect-[4/3] overflow-hidden bg-(--na-void)"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${glow(30)} 0%, ${glow(8)} 45%, transparent 75%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(to bottom, color-mix(in srgb, var(--na-void) 70%, transparent) 0 1px, transparent 1px 3px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, color-mix(in srgb, var(--na-void) 90%, transparent) 100%)",
        }}
      />
    </div>
  );
}

const traces = [
  "M0 30 H60 V70 H120 V20 H200",
  "M0 110 H40 V90 H100 V130 H200",
  "M150 150 V100 H170 V60 H200",
  "M80 0 V40 H100",
];

const traceNodes = [
  [60, 70],
  [120, 20],
  [40, 90],
  [100, 130],
  [170, 60],
  [100, 40],
];

function CircuitTraces() {
  return (
    <div
      role="img"
      aria-label="Right-angle circuit traces in glowing cyan with round nodes"
      className="aspect-[4/3] bg-(--na-void)"
    >
      <svg aria-hidden viewBox="0 0 200 150" className="size-full">
        <defs>
          <GlowFilter id="na-tex-circuit-glow" blur={2.5} />
        </defs>
        <g filter="url(#na-tex-circuit-glow)">
          {traces.map((d) => (
            <path
              key={d}
              d={d}
              className="fill-none stroke-(--na-cyan)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          ))}
          {traceNodes.map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={4}
              className="fill-(--na-void) stroke-(--na-ice)"
              strokeWidth={2}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

const walls = [
  {
    d: "M20 200 V130 H80 V60 H150 V30",
    head: [150, 30],
    color: "stroke-(--na-cyan)",
  },
  {
    d: "M200 170 H170 V100 H110 V160 H50 V100",
    head: [50, 100],
    color: "stroke-(--na-orange)",
  },
];

function LightWalls() {
  return (
    <div
      role="img"
      aria-label="Top-down view of a cyan and an orange light trail turning at right angles on a dark grid"
      className="aspect-square bg-(--na-void)"
    >
      <svg aria-hidden viewBox="0 0 200 200" className="size-full">
        <defs>
          <pattern
            id="na-tex-walls-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0 H0 V20"
              className="fill-none stroke-(--na-line)"
              strokeWidth={1}
            />
          </pattern>
          <GlowFilter id="na-tex-walls-glow" blur={3} />
        </defs>
        <rect width="200" height="200" fill="url(#na-tex-walls-grid)" />
        <g filter="url(#na-tex-walls-glow)">
          {walls.map(({ d, head: [x, y], color }) => (
            <g key={d}>
              <path
                d={d}
                className={`fill-none ${color}`}
                strokeWidth={3}
                strokeLinejoin="miter"
              />
              <rect
                x={x - 3}
                y={y - 3}
                width={6}
                height={6}
                className="fill-(--na-ice)"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function Rings() {
  return (
    <div
      role="img"
      aria-label="Concentric glowing rings with a white-hot core, like a light wheel"
      className="aspect-square bg-(--na-void)"
    >
      <svg aria-hidden viewBox="0 0 200 200" className="size-full">
        <defs>
          <GlowFilter id="na-tex-rings-glow" blur={4} />
        </defs>
        <g filter="url(#na-tex-rings-glow)" className="fill-none">
          <circle
            cx="100"
            cy="100"
            r="82"
            className="stroke-(--na-cyan)"
            strokeWidth={1}
            opacity={0.5}
          />
          <circle
            cx="100"
            cy="100"
            r="68"
            className="stroke-(--na-cyan)"
            strokeWidth={5}
          />
          <circle
            cx="100"
            cy="100"
            r="54"
            className="stroke-(--na-cyan)"
            strokeWidth={1.5}
            opacity={0.7}
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            className="stroke-(--na-ice)"
            strokeWidth={3}
          />
          <circle
            cx="100"
            cy="100"
            r="14"
            className="stroke-(--na-ice)"
            strokeWidth={2}
          />
        </g>
      </svg>
    </div>
  );
}

export const textureArtifacts: Artifact[] = [
  { id: "texture-grid-floor", label: "Grid floor", content: <GridFloor /> },
  {
    id: "texture-blueprint",
    label: "Blueprint grid",
    content: <BlueprintGrid />,
  },
  { id: "texture-scanlines", label: "CRT scanlines", content: <Scanlines /> },
  {
    id: "texture-circuit",
    label: "Circuit traces",
    content: <CircuitTraces />,
  },
  { id: "texture-light-walls", label: "Light trails", content: <LightWalls /> },
  { id: "texture-rings", label: "Light rings", content: <Rings /> },
];
