## Project
Create a landing page for a new online games website: a modern version of something like crazymonkeygames.com or addictinggames.com.

# Project: Design, Build, Ship — Assignment 2 (UI/UX & Visual Design)

Course: MPCS 51238, Autumn 2026. **Due Tuesday, October 13, 5:30 PM.**
The brief PDF lives in the repo root but is gitignored; this section summarizes it.

## Goal
Explore three visual styles, pick one, and build a small static site in it. Everything lives in one Next.js project deployed on Vercel; the homepage is the hub.

## Tech stack (hard constraints)
- Next.js + Tailwind CSS, static export (`output: "export"` in `next.config.ts`; do not re-enable `cacheComponents`/PPR, which break export).
- No database, accounts, external APIs, or data storage. Interactions are faked in the browser; nothing is saved.
- Push back on any suggested backend, database, or unneeded package.
- Code on GitHub (`carnowell-uchicago/dbs-p2`), deployed on Vercel free Hobby plan.

## Routes to build
| Route | What |
|---|---|
| `/` | The hub (submitted Vercel URL). Links to 3 mood boards, 3 design systems, and the site. |
| `/mood-boards/<style>` | One per style (e.g. calm, arcade, editorial; or own styles). Three that feel clearly different. |
| `/design-systems/<style>` | One per mood board, built from it. |
| `/<site>` (e.g. `/reading-log`) | The actual site, in the chosen style. |

Example styles from class: Calm (matte, warm), Arcade, Editorial. Own styles allowed. Site idea in the brief's examples: reading log (any small static site is fine: recipes, workouts, lineup, coffee shops, records, plants, itinerary, etc.). This project's topic and styles are decided; see "Decisions made" below.

## Hub
Title, links to the three mood boards, the three design systems, and the site.

## Mood boards (each)
1. A name for the mood.
2. About 25–30 artifacts: photos, type, color, texture, interface pieces. Images are collected or agent-generated.

## Design systems (each, a UI library built in that style, every state)
1. **Color roles:** background, surface, text, muted text, border, accent, with contrast ratios.
2. **Type roles:** display, heading, body, label, with sizes and weights, set in the site's own content.
3. **Spacing and shape:** spacing scale, corners, borders, shadow.
4. **Components:** primary and secondary buttons, link, text input, select, checkboxes and radios, toggle, tabs, filter chips, card with one of the site's items, list rows, badge, modal or detail panel, plus anything the site needs.
5. **Control states:** rest, hover, focus, pressed, selected, disabled where they apply.
6. **UI states:** empty, loading, error, success.

## The site
Built from the chosen design system. Must have:
1. Thoughtful visual hierarchy.
2. At least two faked interactions (e.g. a filter and a detail panel).
3. Every control in its states.
4. Accent color reserved for the primary action.
5. Responsive design (check at desktop 1440px and mobile 390px).

## Design requirements (graded)
- **Hierarchy:** clear what to look at first.
- **Type:** few sizes and weights, used consistently, comfortable to read.
- **Color:** small palette, each color with a purpose.
- **Accessibility:** legible text contrast; keyboard-usable.
- **Layout:** intentional alignment, related elements grouped, works on desktop and mobile.
- **Affordances:** interactions are obvious.
- **States:** controls respond to hover, focus, press.
- **Visual style:** looks like the chosen style, not the agent's default.
- **Simplicity:** nothing extra; remove any word or image that doesn't help.

## Verify
Check the site in a real browser (Playwright MCP or Claude in Chrome, `/chrome`) at 390px and 1440px: try every interaction, take screenshots, report what's broken. Also test with the keyboard.

## Submission (Google Classroom)
1. Vercel URL of the hub.
2. GitHub repo URL, with commit history showing progress.

## Assessment notes
- A one-shot submission (giving the brief to an agent once and turning in the result) is marked **incomplete**. Work iteratively with many small commits, directing changes by naming UI elements and design principles.
- Complete means: live Vercel hub, 3 mood boards with 25–30 artifacts each, 3 design systems with all components in every state, the site with ≥2 interactions, responsive, commit history, and ability to explain the work.
- Student must be ready to explain: why the style fits the site and its users; design decisions (what people see first, how they know what's clickable, what each state tells them); how the agent was used (what was asked, where they pushed back, what they decided themselves).

# Project status and setup notes (update as work progresses)

## Status (last updated 2026-10-12, end of session; due 2026-10-13 5:30 PM)
- Done: Next.js 16.4.0 scaffold (App Router, TypeScript, Tailwind v4, ESLint, `src/`, `@/*` alias, npm), static export with `images: { unoptimized: true }`. `npm run build` and `npm run lint` pass.
- Done: hub at `/` (`src/app/page.tsx`; style list and site link come from `src/data/styles.ts`).
- Done: three mood boards (`/mood-boards/<slug>`), 30 tiles each (10 user-approved reference images + 20 code-built artifacts).
- Done: three design systems (`/design-systems/<slug>`), laid out like the brief's section 4 example (PDF page 3).
- Done 2026-10-12: Neon Arcade and Cozy Pixel "modernized" at the user's request (details under Styles); page weight trimmed after the professor's note (fonts load per page; reference images are WebP). All pages verified at 1440 and 390 (no page overflow, no text under 12px) and with the keyboard (tabs, focus rings, dialog Escape and focus return).
- Done 2026-10-12 (late): Console Tiles switched to a dark theme (board + design system); hub shows the author name.
- Done 2026-10-12 (late): the site at `/play`, in Console Tiles (see "The site" below). Verified at 1440 and 390 (no overflow, no text under 12px), every interaction, and a keyboard pass. Build and lint pass.
- **Next step:** the user pushes and connects Vercel. Optional polish: open item 4 below.

## Styles
Each style has a palette prefix, tokens in `src/components/ds/<slug>/tokens.ts`, and one accent reserved for Play.
- **Neon Arcade** (`neon-arcade`, `--na-*`). Colors: void #05070d bg, panel #0a1220, raised #101b2e (hover surface), ice #e6fbff text, muted #7f9bb3, line #1c2f4a (dividers only, 1.49:1), edge #4e6f96 (control borders), cyan #4df3ff (focus, selection, links), orange #ff9a3c / hot #ffb36b (accent, Play only), magenta #ff3df2 (Hot badge only), green #5ef2a0 success, red #ff5c6c error.
  Shape: "hard lines, soft corners". Radii `--na-r-sm/md/lg` = 4/6/10px by size (chips, badges, checkboxes / buttons, fields, switch, rows / cards, panels, dialogs). Nested parts use the outer radius minus the gap. Only radio dots are round; the switch is a rounded rect. Lines: 2px borders and dividers, 3px focus ring and selection bars. Glow only on hover, focus, and selection.
  Fonts (`src/components/ds/neon-arcade/fonts.ts`, shared by board and design system): Oxanium (display, headings, buttons), Exo 2 (body), JetBrains Mono (labels). JetBrains Mono is wide: keep label tracking ≤0.08em and check narrow cells.
- **Console Tiles** (`console-tiles`, `--ct-*`). **Dark theme since 2026-10-12** (user request). Colors: bg #2d2d2d, surface #3c3c3c, text #ffffff, muted #b4b4b4, divider #4a4a4a, border #919191, accent red #d92b1a (Play only; white label 4.87:1), cyan #00c3e3 (6.5:1 on bg, so the focus/selection ring is just a 3px cyan outline with a 3px gap). Success #5cd17a; yellow #ffd400 only for attention/error signs; disabled fill #242424 (sunk below bg). A white fill means "selected" and takes bg-colored text (`text-(--ct-bg)`); only Play keeps `text-white`. Shadows are black at 0.3–0.6. The board adds `--ct-ink` #2d2d2d for text on light fills and leads with the dark home screen.
  Fonts: Rubik (display, titles), Figtree (body, labels), loaded in each CT `page.tsx` (no shared `fonts.ts` yet). Not modernized.
- **Cozy Pixel** (`cozy-pixel`, `--cp-*`, role names, e.g. `--cp-accent` = pumpkin #f08a24). Colors: parchment #f7ecd6 bg, paper #fff8ea surface, cocoa #3b2a20 text, muted #6e5644, wood #8a4a24 border (also the selected fill, with cream text), bevel #d9a066 (decor only), wheat #efdcb6 (wells, skeletons, switch tracks), clover #6aa84f success, berry #b3361f error, sky/gold/blossom for badges, stars, and the heart only. Colored fills take cocoa text.
  Shape: pixel art, never a smooth radius. `edge` in `styles.ts` draws two-step stair corners (box-shadow bars spread -w, offset 2w, plus corner pixels as background-image squares; the drop shadow steps too). Consequences:
  - An element with `edge` must not set `background` or `background-image` (use `backgroundColor`).
  - Full-bleed content must be clipped at the corners (board tiles do this).
  - `bevelEdge` adds the 2px bevel as background strips (Panel uses it).
  - `smallEdge` keeps one-step corners for boxes under 32px (the checkbox), so they don't look round next to the radio.
  Edges are 3px on controls and 4px on panels; dividers are 3px.
  Fonts (`src/components/ds/cozy-pixel/fonts.ts`): Pixelify Sans (display, titles, labels at 500 with 0.06em tracking), Lora (every sentence).

## How the design systems are built
- Shared contract (read `src/lib/design-system.ts` before touching these pages):
  - `src/data/games.ts`: 12 fake games with motif, category, rating, plays, and New/Hot flags; `formatPlays`, `gameBySlug`.
  - `src/lib/contrast.ts`: WCAG ratios, always computed, never typed.
  - `src/lib/design-system.ts`: the page layout spec and the forced-state convention.
- Reusable UI per style lives in `src/components/ds/<slug>/`: tokens, buttons, link, fields, chips, tabs, toggle, `GameArt` for all 12 motifs, game card, list row, favorite, badges/rating, and a native `<dialog>` with the Play flow (fake loading, then "Launching…"). **`/play` should import from here.**
  - Components take `force?: ForcedState` and render `data-force`, so one class string serves both live controls and frozen specimens.
  - Small optional props exist for the states table (`size="sm"`, `compact`, `hideLabel`).
- Showcase pages are `src/app/design-systems/<slug>/page.tsx` (palette CSS vars on a wrapper) plus `sections/` (`color`, `type`, `spacing`, `components`, `states`, `ui-states`, client demos).
  - Desktop: title "<Style> · Design System", then two columns: 1 Color, 2 Type, 3 Spacing and shape | 4 Components (one live copy each), 5 Control states table (each control × Rest/Hover/Focus/Pressed/Selected/Disabled, `inert`), 6 UI states (empty, loading, error, success).
  - Phones: the NA/CT states table scrolls sideways inside its frame with sticky row labels; CP switches to labelled 3-column grids via a container query.
- Verification pattern that works. For each page and width, check:
  - page overflow (`document.documentElement.scrollWidth - clientWidth`);
  - text under 12px;
  - boxes whose content overflows (`sr-only` labels are false positives).
  Then screenshot sections with `locator('#states').screenshot()`, and zoom in (`document.documentElement.style.zoom = "5"`) to inspect corner pixels.

## How the mood boards are built
- Per board: `src/app/mood-boards/<slug>/page.tsx` sets the palette as CSS vars on a wrapper and renders a masonry grid (`columns-2 md:columns-3 xl:columns-4`) of `<figure>` tiles plus an image-credits footer. NA uses the design system's `paletteVars`; CT and CP have a local `palette` (CP adds `--cp-bevel` for `bevelEdge`).
- References live in `public/mood-boards/<slug>/NN-name.webp`, with typed data (src, size, label, alt, source URL, license, author, optional `pixelated`) in `src/data/mood-boards/<slug>.ts`. The `Reference` type lives in `neon-arcade.ts`. CC BY images need visible credits.
  - New references: photos at most 720px wide at WebP q80, pixel art at full size at q90; keep a JPEG only if WebP is larger. Tiles show at most ~292px. Use PIL (installed); static export does no image resizing.
  - Sourcing: Wikimedia Commons/Wikipedia API (Unsplash blocks scripts; Wikimedia rate-limits fast loops, so batch and pause).
- Artifacts: `src/app/mood-boards/<slug>/artifacts/{color-type,textures,interface}.tsx` (`Artifact[]`), contract in `types.ts`; Cozy Pixel also has `pixel.tsx` (`PixelSprite`). `src/lib/board-order.ts` interleaves references and artifacts.
  - Artifacts are pictures, not controls: nothing focusable, decorative art `aria-hidden`, animation `motion-safe:` only.
  - Board artifacts mirror their design system's shape (NA radii and 2px lines; CP two-step corners via `pixelEdge`/`notch`, with 2px detail lines kept at one step).

## The site (`/play`)
- Files: `src/app/play/page.tsx` (fonts, palette, `data-theme="dark"`, header, footer), `site.tsx` (client; holds favorites and the one shared `GameDialog`), `hero.tsx`, `catalog.tsx`. Everything comes from `src/components/ds/console-tiles/`.
- Order (hierarchy): wordmark header → featured hero (Hay Runner; its Play button is the only red on screen) → "Popular now" `TileRow` (top 8 by plays) → "All games" catalog → footer line.
- Interactions (all fake, reset on reload):
  1. Catalog filters: search (title or category), multi-select category chips with "All", sort select (Most played / Top rated / New first / A–Z), "Favorites only" switch. Live "Showing N of 12 games" status; empty state with "Clear filters" (or "No favorites yet…").
  2. Detail dialog from any tile or card: Play → "Loading…" → "Launching…"; Escape/backdrop closes and focus returns to the opener.
  3. Favorites: heart in the hero and the dialog, shared through `site.tsx`, feeding the "Favorites only" switch.
- Components got small optional props for this: `GameDetail`/`GameDialog` take `favorite` + `onToggleFavorite`; `TileRow` takes `onOpen`; choice labels accept `ReactNode`.
- Phones: the favorites switch reads "Favorites" (" only" from `sm`); the hero's "Saved to favorites" text is sr-only (the filled heart shows it).
- `globals.css`: `html:has([data-theme="dark"])` sets `color-scheme: dark` and the root background, so scrollbars and native controls are dark on CT pages. Neon Arcade doesn't use it yet.

## Fonts and page weight
- The root layout loads no fonts. Each page loads only its own: the hub uses Geist via `src/components/hub-font.ts` (28 KB); CP ~48 KB; NA and CT ~92 KB.
- All fonts are WOFF2 via `next/font/google` (self-hosted at build), Latin subset, variable, so extra weights cost nothing.
- The hub still logs "preloaded but not used" warnings because `<Link>` prefetches the linked style pages' fonts. That's normal Next behavior; keep it (instant navigation).
- Mood board references total ~1.3 MB (were 3.2 MB) and lazy-load after the first.
- JS is ~211 KB gzipped across all chunks, mostly framework; not worth optimizing.

## Subagent workflow (the user asked for subagents; it worked for boards and design systems)
- The orchestrator writes and commits the shared contract first, then launches one fork per style (or per artifact file) in parallel.
- Each fork owns its folders only. It must not run dev/build/Playwright or git; it may run `npx tsc --noEmit` and `npx eslint <its paths>`. Forks write `page.tsx` last.
- After all forks finish, the orchestrator checks every page in the browser at 1440 and 390 plus the keyboard, fixes bugs, and commits per style (UI library, then page).

## Decisions made
- **Site:** landing page for an online games site named **LazyDonkeyGames** (name checked 2026-10-12: no matching studio, no US trademark, `lazydonkeygames.com` unregistered). Avoid Donkey Kong-like art (no barrels, girders, red tie); don't copy Crazy Monkey Games' logo, mascot, or layout.
- **Site route:** `/play`.
- **Three styles:** Neon Arcade (original Tron with a modern twist), Console Tiles (Switch home screen; named generically, never "Nintendo" or "Switch" as a label), Cozy Pixel (Stardew Valley).
- **IP rule:** mood boards may include reference screenshots of Tron, the Switch, and Stardew (research). The site and design systems use original art only (CSS/SVG), never their logos, sprites, or names.
- **One design system per mood board, equal effort.** The brief requires all three; never block them on the site's style choice (the user pushed back on this).
- **Code structure:** per-style folders (no shared dynamic route), fonts via `next/font/google`, per-style tokens as CSS vars. Changes to a style's mood board should flow into its design system and vice versa.
- **Hub look:** deliberately neutral (Geist, `neutral-*` grays, near-black button) so it doesn't compete with the three styles.

## Open decisions (ask the user)
1. (Decided) **Style for `/play`: Console Tiles, dark theme** (user's choice, 2026-10-12, after the agent recommended it). Why it fits: a games portal is mostly browsing many games, and the console home row (big tiles, one selection ring) is built for exactly that; the dark charcoal makes the colorful game art and the single red Play button stand out, so players always know what to press.
2. (Decided) Interactions: filters + search + sort with an empty state, the detail dialog with fake Play, and shared favorites (see "The site").
3. (Superseded) CT got a dark-theme pass instead of the corner/line modernization.
4. Small open items, offered but not answered:
   - The CP states table truncates "Hay Runner" to "Hay Run…" in the compact list row (wider cell or shorter label).
   - Tall, mostly empty board tiles (NA "Horizon glow", CT "Soft dot grid").
   - The CP Dungeon Dash thumbnail reads like a chest.
   - The CT board's toggle shows "on" as cyan; the design system's toggle uses white.
   - Tabbing through `/play` visits all 8 popular tiles before the catalog (TileRow tiles are each in the tab order).
   - The hub doesn't say which style was chosen.

## Remaining plan
1. (Done) Build and verify `/play`.
2. The user pushes, connects Vercel (vercel.com → Import Git Repo → `dbs-p2`; no CLI needed), and submits the hub URL and repo URL.

## How the agent was used (for the grading explanation; keep appending)
The user pushed back or directed changes on:
- swapping Neon Arcade 03 and Console Tiles 03;
- using subagents;
- the squished Playwright window;
- picking a style before building the design systems (rejected);
- making the design systems easier to look at by matching the brief's section 4 example;
- adding their name to the hub, then flagging extra space it caused on phones (the agent found the line wrapped at 390 and kept it to one line);
- the Play icon looking off center (the agent measured ~3px right and recentered the icon);
- choosing Console Tiles for the site and asking for the rubric's interactions (the agent picked filters, the detail dialog with fake Play, and shared favorites);
- switching Console Tiles to a dark theme (the agent kept the accent, let cyan stand alone as the ring since it now passes contrast, and moved the board and design system together);
- a more modern Neon Arcade ("hard lines, softer slightly rounded corners, slightly thicker lines"). The agent refined that into a size-based radius scale, a 2px/3px line hierarchy, and a font swap to Oxanium + JetBrains Mono.
- "Similar changes" for Cozy Pixel. The agent translated them into two-step pixel corners instead of a CSS radius, heavier edges and dividers, and one pixel font family (Silkscreen retired).
- The professor's note on font/page weight. The agent audited it, recommended changes, and the user chose two: per-page font loading and WebP references.

Suggested to the user (not done yet): keep their own short notes file of what they asked, where they pushed back, and what they decided.

## Pending user actions
- Push the local commits (the agent can't push). This clone has no `origin/main` ref, so ask the user what's already pushed.
- Connect Vercel.

## Repo / git
- Project root: `/Users/jacob/projects/p2`. Branch `main`. Remote `origin`: `git@github.com:carnowell-uchicago/dbs-p2.git` (SSH).
- The user pushes themselves (this machine has no SSH key or GitHub credentials). Commit locally with small, frequent commits.
- Commit messages end with the `Co-Authored-By` attribution line given in the session's system reminder.

## Commands
- `npm run dev` (develop), `npm run build` (static export to `out/`), `npm run lint`.
- Deploy: Vercel Hobby, static; no server features.

## Gotchas
- **Next.js version:** this one differs from older versions; read `node_modules/next/dist/docs/` before writing code (static export guide: `01-app/02-guides/static-exports.md`). Static export forbids server-only features: dynamic server functions, PPR/`cacheComponents`, default image optimization, and route handlers that read the request.
- **The block at the end of this file:** `next dev` re-appends the `nextjs-agent-rules` block; commit it rather than deleting it.
- **Browser checks (Playwright MCP):**
  - Save screenshots under the project root (`.playwright-mcp/`, gitignored); the session scratchpad is outside Playwright's allowed roots.
  - The browser window is visible to the user. After 390/1440 checks, restore the page size with `browser_resize` 1200×688, or it looks squished.
  - Pages taller than about 16k px at 390 wide fail full-page screenshots; use a 390×2000 viewport and scroll.
- **Dev server:**
  - Wait for "Ready" before navigating, or the first load fails with `ERR_ABORTED`. The "N" bubble in dev screenshots is Next's dev indicator, not part of the page.
  - A background `next dev` dies at the 2-hour background limit. Alternative that works: `npm run build`, then serve `out/` with a tiny Python server that maps `/route` to `route.html` and prefers it over a same-named folder (`out/mood-boards/<slug>/` holds images).
  - While a page imports files that don't exist yet, `next dev` returns 500 on every route; write new pages in the scratchpad and move them in once their imports exist. Running `npm run build` while `next dev` runs is fine.
  - `next dev` can serve stale modules after edits to shared components or `globals.css` (seen as a hydration mismatch, or a CSS rule missing in the browser but present in `out/`). Restart it; check `out/` to tell a stale server from a real bug.
- **Fonts:** avoid CJK Google fonts (e.g. M PLUS Rounded 1c): they download ~100 subset files and time out in dev.
- **Editing:** bulk regex edits on class names can hit JS identifiers (a `border` → `border-2` pass renamed `const border`); grep the diff and run `tsc` after.
- **Tailwind v4 focus outlines:** `outline-none` and `outline-hidden` both set `outline-style: none`, and `outline-2` only sets the width, so `outline-hidden focus-visible:outline-2` draws nothing. Add `focus-visible:outline-solid` (and `data-[force=focus]:outline-solid`) next to state outline widths.
- **Layout:**
  - In flex-column link lists, add `self-start` to links so focus rings hug the text.
  - A horizontal scroll container needs `relative`, or absolutely positioned children (`sr-only` labels, hidden inputs) escape it and widen the page.
  - A mobile `grid` without `grid-cols-1` sizes its only column to its content.
- **Not investigated:** `npm audit` reported 5 high-severity vulnerabilities after install.
- **The brief:** the PDF in the repo root (gitignored) can be read with the Read tool, page images included. Section 4's example is on page 3.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
