export type Style = {
  slug: string;
  name: string;
  inspiration: string;
};

export const styles: Style[] = [
  {
    slug: "neon-arcade",
    name: "Neon Arcade",
    inspiration: "Glowing light grids from 1980s sci-fi, with a modern twist",
  },
  {
    slug: "console-tiles",
    name: "Console Tiles",
    inspiration: "A console home screen of large scrolling tiles",
  },
  {
    slug: "cozy-pixel",
    name: "Cozy Pixel",
    inspiration: "Warm farm-life pixel art, hand-placed and cozy",
  },
];

export const site = {
  name: "LazyDonkeyGames",
  href: "/play",
};
