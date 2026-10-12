// Reference images for the Neon Arcade mood board (research only; never reused in the site).
export type Reference = {
  src: string;
  width: number;
  height: number;
  label: string;
  alt: string;
  source: string;
  license: string;
  author: string | null;
  // Pixel art: scale with hard edges instead of smoothing.
  pixelated?: boolean;
};

export const references: Reference[] = [
  {
    src: "/mood-boards/neon-arcade/01-tron-1982-poster.jpg",
    width: 256,
    height: 390,
    label: "Tron, 1982",
    alt: "Tron (1982) poster: a figure lifted by a beam of blue light above a glowing disc",
    source: "https://en.wikipedia.org/wiki/File:Tron_poster.jpg",
    license: "Fair use",
    author: null,
  },
  {
    src: "/mood-boards/neon-arcade/02-glowing-logo-type.jpg",
    width: 524,
    height: 190,
    label: "Glowing logotype",
    alt: "Tron 2 logo: outlined letters glowing cyan on black",
    source: "https://en.wikipedia.org/wiki/File:Tron2.jpg",
    license: "Fair use",
    author: null,
  },
  {
    src: "/mood-boards/neon-arcade/03-vector-arcade-hud.jpg",
    width: 640,
    height: 480,
    label: "Vector arcade HUD",
    alt: "Vector arcade game: white wireframe tank and mountains with a score readout",
    source:
      "https://commons.wikimedia.org/wiki/File:Bradley_Trainer_screenshot.png",
    license: "Public domain",
    author: "US Army",
  },
  {
    src: "/mood-boards/neon-arcade/04-light-walls-game.jpg",
    width: 960,
    height: 961,
    label: "Light walls",
    alt: "Top-down light-wall game: a yellow and a blue trail on a dark grid",
    source:
      "https://commons.wikimedia.org/wiki/File:Tron_light_walls_arcade_style.svg",
    license: "Public domain",
    author: "Bisco",
  },
  {
    src: "/mood-boards/neon-arcade/05-light-cycle-rings.jpg",
    width: 960,
    height: 640,
    label: "Light cycle",
    alt: "Light cycle replica: glossy black body with glowing white wheel rings",
    source:
      "https://commons.wikimedia.org/wiki/File:Lightcycle!_(4737798806).jpg",
    license: "CC BY-SA 2.0",
    author: "dalvenjah from USA",
  },
  {
    src: "/mood-boards/neon-arcade/06-orange-circuit-lines.jpg",
    width: 387,
    height: 258,
    label: "Rival orange",
    alt: "Tron: Legacy still: a man in a dark suit traced with orange light lines",
    source: "https://en.wikipedia.org/wiki/File:CluTronLegacy.jpg",
    license: "Fair use",
    author: "Disney",
  },
  {
    src: "/mood-boards/neon-arcade/07-chevrons-and-trails.jpg",
    width: 960,
    height: 640,
    label: "Chevrons and trails",
    alt: "Ride vehicles lit with cyan rings beside glowing chevron signs",
    source:
      "https://commons.wikimedia.org/wiki/File:Tron_Lightcycles_Power_Run_(28995764004).jpg",
    license: "CC BY 2.0",
    author: "Jeremy Thompson from Los Angeles, California",
  },
  {
    src: "/mood-boards/neon-arcade/08-canopy-at-night.jpg",
    width: 960,
    height: 640,
    label: "Canopy at night",
    alt: "Roller coaster under a curved glass canopy outlined in blue light at night",
    source:
      "https://commons.wikimedia.org/wiki/File:Tron_Lightcycle_Power_Run_(Magic_Kingdom)_5.jpg",
    license: "CC BY 2.0",
    author: "Carter Johnson",
  },
  {
    src: "/mood-boards/neon-arcade/09-infinity-grid-tunnel.jpg",
    width: 960,
    height: 607,
    label: "Infinity grid",
    alt: "Tunnel of magenta and blue neon grid lines receding to a point",
    source:
      "https://commons.wikimedia.org/wiki/File:Neon_Infinity_Tunnel_with_Grid_(55258879288).jpg",
    license: "CC BY 4.0",
    author: "Michael Gaylard from Horsham, UK",
  },
  {
    src: "/mood-boards/neon-arcade/10-tron-ares-poster.jpg",
    width: 259,
    height: 383,
    label: "Tron: Ares, 2025",
    alt: "Tron: Ares poster: a figure and red light cycle before a red-lit city",
    source: "https://en.wikipedia.org/wiki/File:Tron_Ares_poster.jpg",
    license: "Fair use",
    author: null,
  },
];
