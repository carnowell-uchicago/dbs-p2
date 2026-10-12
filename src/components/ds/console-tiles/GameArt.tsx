import type { ReactNode } from "react";
import type { Motif } from "@/data/games";
import { artColors as c } from "./tokens";

// Original flat thumbnail art, one per motif: bold shapes on one strong color,
// like the cover of a game box. Decorative; the tile always names the game.

const scenes: Record<Motif, ReactNode> = {
  donkey: (
    <>
      <rect width="100" height="100" fill={c.yellow} />
      <circle cx="78" cy="20" r="9" fill={c.white} />
      <path d="M0 72 Q50 58 100 70 V100 H0Z" fill={c.green} />
      {/* fence */}
      <g fill={c.white}>
        <rect x="64" y="56" width="4" height="22" />
        <rect x="84" y="54" width="4" height="22" />
        <rect x="60" y="60" width="32" height="4" rx="1" />
        <rect x="60" y="68" width="32" height="4" rx="1" />
      </g>
      {/* donkey mid-jump */}
      <g fill={c.darkSurface}>
        <ellipse cx="36" cy="50" rx="17" ry="10" />
        <path d="M48 46 L58 34 L64 38 L56 50Z" />
        <ellipse cx="62" cy="36" rx="7" ry="5" />
        <ellipse cx="57" cy="24" rx="2.8" ry="9" transform="rotate(-18 57 24)" />
        <ellipse cx="63.5" cy="23" rx="2.8" ry="9" transform="rotate(8 63.5 23)" />
        <path d="M24 56 L16 66 L20 68 L29 58Z M44 57 L52 68 L56 65 L48 55Z" />
        <path d="M20 46 Q12 44 10 52" stroke={c.darkSurface} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <circle cx="64" cy="35" r="1.4" fill={c.white} />
      {/* hay bale */}
      <rect x="10" y="78" width="20" height="12" rx="2" fill={c.yellow} stroke={c.dark} strokeWidth="2" />
      <path d="M16 78 V90 M24 78 V90" stroke={c.dark} strokeWidth="1.5" />
    </>
  ),
  orbit: (
    <>
      <rect width="100" height="100" fill={c.dark} />
      <g fill={c.white}>
        <circle cx="14" cy="16" r="1.2" />
        <circle cx="86" cy="12" r="1" />
        <circle cx="70" cy="88" r="1.2" />
        <circle cx="10" cy="74" r="1" />
      </g>
      <ellipse cx="50" cy="52" rx="38" ry="16" fill="none" stroke={c.gray} strokeWidth="1.5" strokeDasharray="3 4" transform="rotate(-20 50 52)" />
      <circle cx="30" cy="62" r="16" fill={c.red} />
      <path d="M17 56 Q30 52 44 58" stroke={c.white} strokeWidth="2.5" fill="none" opacity="0.5" />
      <circle cx="76" cy="32" r="10" fill={c.blue} />
      <circle cx="56" cy="38" r="4.5" fill={c.yellow} />
      <path d="M52 41 L44 47" stroke={c.yellow} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
    </>
  ),
  tower: (
    <>
      <rect width="100" height="100" fill={c.blue} />
      <rect y="86" width="100" height="14" fill={c.darkSurface} />
      <g stroke={c.dark} strokeWidth="2">
        <rect x="26" y="68" width="48" height="18" rx="3" fill={c.yellow} />
        <rect x="32" y="50" width="30" height="18" rx="3" fill={c.red} />
        <rect x="40" y="32" width="28" height="18" rx="3" fill={c.white} transform="rotate(6 54 41)" />
        <rect x="44" y="12" width="18" height="18" rx="3" fill={c.green} transform="rotate(14 53 21)" />
      </g>
    </>
  ),
  road: (
    <>
      <rect width="100" height="100" fill={c.blue} />
      <circle cx="74" cy="24" r="11" fill={c.yellow} />
      <path d="M0 58 Q25 44 50 54 T100 50 V100 H0Z" fill={c.darkSurface} />
      <path d="M38 100 L50 54 L56 54 L76 100Z" fill={c.dark} />
      <path d="M57 100 L53 56" stroke={c.white} strokeWidth="2" strokeDasharray="6 5" />
      <rect x="50" y="78" width="14" height="9" rx="3" fill={c.red} />
      <rect x="52" y="74" width="10" height="6" rx="2" fill={c.red} />
    </>
  ),
  golf: (
    <>
      <rect width="100" height="100" fill={c.green} />
      <ellipse cx="60" cy="72" rx="34" ry="14" fill={c.white} opacity="0.25" />
      <ellipse cx="66" cy="72" rx="6" ry="2.5" fill={c.dark} />
      <rect x="65" y="22" width="2.5" height="50" fill={c.white} />
      <path d="M67.5 22 L88 30 L67.5 38Z" fill={c.red} />
      <circle cx="28" cy="80" r="5" fill={c.white} stroke={c.dark} strokeWidth="1.5" />
      <path d="M33 79 Q48 70 60 72" stroke={c.white} strokeWidth="1.5" strokeDasharray="2 3" fill="none" />
    </>
  ),
  carrot: (
    <>
      <rect width="100" height="100" fill={c.darkSurface} />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={14 + col * 25}
            y={14 + row * 25}
            width="22"
            height="22"
            rx="4"
            fill={row === 1 && col === 1 ? c.yellow : c.gray}
          />
        )),
      )}
      <text x="25" y="31" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.dark} fontFamily="var(--ct-display)">1</text>
      <text x="75" y="81" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.dark} fontFamily="var(--ct-display)">2</text>
      <path d="M50 58 L44 40 Q50 36 56 40Z" fill={c.red} />
      <path d="M50 40 L46 32 M50 40 L50 31 M50 40 L54 32" stroke={c.green} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  dungeon: (
    <>
      <rect width="100" height="100" fill={c.dark} />
      <path
        d="M10 10 H90 V90 H10Z M10 34 H58 M34 34 V62 M58 62 H90 M34 62 H46 V90 M70 10 V40"
        fill="none"
        stroke={c.darkSurface}
        strokeWidth="7"
        strokeLinecap="square"
      />
      <g fill={c.yellow}>
        <circle cx="76" cy="78" r="5" />
        <rect x="58" y="76" width="16" height="4" />
        <rect x="60" y="80" width="3" height="5" />
      </g>
      <path d="M18 54 Q18 44 24 44 Q30 44 30 54Z" fill={c.blue} />
      <circle cx="22" cy="49" r="1.2" fill={c.dark} />
      <circle cx="26" cy="49" r="1.2" fill={c.dark} />
      <circle cx="47" cy="22" r="5" fill={c.white} />
    </>
  ),
  balloon: (
    <>
      <rect width="100" height="100" fill={c.blue} />
      <ellipse cx="22" cy="80" rx="18" ry="6" fill={c.white} />
      <ellipse cx="84" cy="30" rx="14" ry="5" fill={c.white} />
      <path d="M50 12 C70 12 76 28 72 40 C68 52 58 58 54 64 H46 C42 58 32 52 28 40 C24 28 30 12 50 12Z" fill={c.red} />
      <path d="M50 12 C58 12 60 30 57 44 C55 54 53 60 52 64 H48 C47 60 45 54 43 44 C40 30 42 12 50 12Z" fill={c.white} />
      <path d="M46 64 L47 74 M54 64 L53 74" stroke={c.dark} strokeWidth="1.5" />
      <rect x="44" y="74" width="12" height="9" rx="2" fill={c.yellow} stroke={c.dark} strokeWidth="1.5" />
    </>
  ),
  ship: (
    <>
      <rect width="100" height="100" fill={c.blue} />
      <g stroke={c.white} strokeWidth="0.8" opacity="0.45">
        {[20, 40, 60, 80].map((v) => (
          <path key={v} d={`M${v} 0 V100 M0 ${v} H100`} />
        ))}
      </g>
      <path d="M22 66 H70 L62 78 H30Z" fill={c.darkSurface} />
      <rect x="44" y="28" width="3" height="38" fill={c.darkSurface} />
      <path d="M47 30 L66 58 H47Z" fill={c.white} />
      <path d="M44 34 L30 58 H44Z" fill={c.red} />
      <circle cx="80" cy="22" r="8" fill="none" stroke={c.yellow} strokeWidth="2.5" />
      <path d="M80 10 V34 M68 22 H92" stroke={c.yellow} strokeWidth="2" />
    </>
  ),
  tortoise: (
    <>
      <rect width="100" height="100" fill={c.yellow} />
      <rect y="70" width="100" height="30" fill={c.darkSurface} />
      <path d="M0 85 H100" stroke={c.white} strokeWidth="2.5" strokeDasharray="10 8" />
      <path d="M14 52 L2 46 L4 58 L2 66 L14 60Z" fill={c.red} />
      <ellipse cx="42" cy="60" rx="24" ry="8" fill={c.green} />
      <path d="M18 60 Q20 30 42 30 Q64 30 66 60Z" fill={c.green} stroke={c.dark} strokeWidth="2" />
      <path d="M30 44 L42 38 L54 44 L50 56 H34Z" fill="none" stroke={c.dark} strokeWidth="2" />
      <ellipse cx="74" cy="54" rx="9" ry="7" fill={c.green} stroke={c.dark} strokeWidth="2" />
      <circle cx="77" cy="52" r="1.6" fill={c.dark} />
      <rect x="14" y="48" width="8" height="12" rx="2" fill={c.gray} stroke={c.dark} strokeWidth="1.5" />
    </>
  ),
  paddle: (
    <>
      <rect width="100" height="100" fill={c.dark} />
      <path d="M50 6 V94" stroke={c.darkSurface} strokeWidth="3" strokeDasharray="6 6" />
      <rect x="12" y="24" width="7" height="26" rx="3" fill={c.blue} />
      <rect x="81" y="52" width="7" height="26" rx="3" fill={c.red} />
      <rect x="58" y="38" width="7" height="7" rx="1.5" fill={c.white} />
      <path d="M58 41 L36 30" stroke={c.white} strokeWidth="1.5" opacity="0.4" strokeDasharray="2 3" />
      <text x="34" y="20" textAnchor="middle" fontSize="12" fontWeight="700" fill={c.white} fontFamily="var(--ct-display)">3</text>
      <text x="66" y="20" textAnchor="middle" fontSize="12" fontWeight="700" fill={c.white} fontFamily="var(--ct-display)">5</text>
    </>
  ),
  castle: (
    <>
      <rect width="100" height="100" fill={c.red} />
      <path d="M0 80 Q50 56 100 80 V100 H0Z" fill={c.green} />
      <path
        d="M30 74 V42 H36 V36 H42 V42 H46 V36 H54 V42 H58 V36 H64 V42 H70 V74Z"
        fill={c.white}
        stroke={c.dark}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M44 74 V62 Q50 54 56 62 V74Z" fill={c.dark} />
      <rect x="49" y="18" width="2" height="18" fill={c.dark} />
      <path d="M51 18 L64 22 L51 26Z" fill={c.yellow} />
      <path d="M14 70 L20 58 L26 70Z M76 72 L82 60 L88 72Z" fill={c.dark} />
    </>
  ),
};

export function GameArt({ motif, className = "" }: { motif: Motif; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={`block h-full w-full ${className}`} aria-hidden>
      {scenes[motif]}
    </svg>
  );
}
