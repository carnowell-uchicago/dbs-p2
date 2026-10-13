// The LazyDonkeyGames catalog, shared by the three design systems and the
// site. All titles are original. Each game is playable from public/games/<slug>/;
// the ratings and play counts are made up. Nothing here is fetched or saved.

export const categories = [
  "Action",
  "Puzzle",
  "Racing",
  "Sports",
  "Adventure",
  "Strategy",
] as const;

export type Category = (typeof categories)[number];

// What the thumbnail shows. Each style draws its own original art for a motif
// (CSS/SVG), so the same game looks native in every style.
export type Motif =
  | "donkey"
  | "orbit"
  | "tower"
  | "road"
  | "golf"
  | "carrot"
  | "dungeon"
  | "balloon"
  | "ship"
  | "tortoise"
  | "paddle"
  | "castle";

export type Game = {
  slug: string;
  title: string;
  category: Category;
  motif: Motif;
  blurb: string;
  rating: number; // out of 5, one decimal
  plays: number;
  minutes: number; // typical session length
  controls: string;
  isNew?: boolean;
  isHot?: boolean;
};

export const games: Game[] = [
  {
    slug: "hay-runner",
    title: "Hay Runner",
    category: "Action",
    motif: "donkey",
    blurb: "Gallop across the farm, hop the fences, and grab every hay bale before sundown.",
    rating: 4.7,
    plays: 1_284_000,
    minutes: 5,
    controls: "Space to jump, ↓ to duck",
    isHot: true,
  },
  {
    slug: "orbit-hopper",
    title: "Orbit Hopper",
    category: "Action",
    motif: "orbit",
    blurb: "Leap from planet to planet and time each jump to the gravity pull.",
    rating: 4.4,
    plays: 642_000,
    minutes: 4,
    controls: "Click or Space to launch",
    isNew: true,
  },
  {
    slug: "tumble-tower",
    title: "Tumble Tower",
    category: "Puzzle",
    motif: "tower",
    blurb: "Stack odd-shaped blocks as high as you dare. One wobble too many and it all comes down.",
    rating: 4.6,
    plays: 958_000,
    minutes: 8,
    controls: "← → to move, ↑ to rotate, Space to drop",
    isHot: true,
  },
  {
    slug: "carrot-sweeper",
    title: "Carrot Sweeper",
    category: "Puzzle",
    motif: "carrot",
    blurb: "Dig up the carrots and leave the moles alone. The numbers tell you where they hide.",
    rating: 4.2,
    plays: 311_000,
    minutes: 6,
    controls: "Click to dig, right-click to flag",
  },
  {
    slug: "gridline-racer",
    title: "Gridline Racer",
    category: "Racing",
    motif: "road",
    blurb: "Drift through neon hairpins and shave tenths off your ghost lap.",
    rating: 4.5,
    plays: 1_037_000,
    minutes: 3,
    controls: "Arrow keys to steer, Shift to drift",
    isHot: true,
  },
  {
    slug: "turbo-tortoise",
    title: "Turbo Tortoise",
    category: "Racing",
    motif: "tortoise",
    blurb: "Slow and steady never won this race. Strap on the rocket shell and boost past the hares.",
    rating: 4.0,
    plays: 188_000,
    minutes: 4,
    controls: "↑ to boost, ← → to steer",
    isNew: true,
  },
  {
    slug: "pocket-golf",
    title: "Pocket Golf",
    category: "Sports",
    motif: "golf",
    blurb: "Eighteen tiny holes, windmills included. Drag to aim, release to putt.",
    rating: 4.3,
    plays: 527_000,
    minutes: 10,
    controls: "Drag or arrow keys to aim, Space to putt",
  },
  {
    slug: "paddle-panic",
    title: "Paddle Panic",
    category: "Sports",
    motif: "paddle",
    blurb: "A classic paddle duel where the ball speeds up every rally. First to seven wins.",
    rating: 3.9,
    plays: 402_000,
    minutes: 3,
    controls: "W/S or ↑/↓ to move",
  },
  {
    slug: "dungeon-dash",
    title: "Dungeon Dash",
    category: "Adventure",
    motif: "dungeon",
    blurb: "Every run is a new maze. Grab the key, dodge the slimes, and find the stairs.",
    rating: 4.8,
    plays: 1_512_000,
    minutes: 12,
    controls: "Arrow keys to move, Space to swing",
    isHot: true,
  },
  {
    slug: "sky-picnic",
    title: "Sky Picnic",
    category: "Adventure",
    motif: "balloon",
    blurb: "Float a hot-air balloon between islands and deliver lunch before it gets cold.",
    rating: 4.1,
    plays: 96_000,
    minutes: 7,
    controls: "↑ to heat, ↓ to vent",
    isNew: true,
  },
  {
    slug: "pirate-cove",
    title: "Pirate Cove",
    category: "Strategy",
    motif: "ship",
    blurb: "Plot your fleet's moves on a hidden grid and sink the rival ships first.",
    rating: 4.4,
    plays: 733_000,
    minutes: 9,
    controls: "Click a square to fire",
  },
  {
    slug: "hilltop-defense",
    title: "Hilltop Defense",
    category: "Strategy",
    motif: "castle",
    blurb: "Build towers along the path and hold the hill through twenty waves.",
    rating: 4.6,
    plays: 869_000,
    minutes: 15,
    controls: "Click to place towers, 1–4 to pick",
    isNew: true,
  },
];

// 1_284_000 -> "1.3M plays"
export function formatPlays(plays: number): string {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M plays`;
  if (plays >= 1_000) return `${Math.round(plays / 1_000)}K plays`;
  return `${plays} plays`;
}

export function gameBySlug(slug: string): Game {
  const game = games.find((g) => g.slug === slug);
  if (!game) throw new Error(`Unknown game: ${slug}`);
  return game;
}
