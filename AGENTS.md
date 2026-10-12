## Project
Create a landing page for a new online games website. 
This should be a modern version of something like crazymonkeygames.com or addictinggames.com


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

## Status (last updated 2026-10-12)
- Done: Next.js 16.4.0 scaffolded (App Router, TypeScript, Tailwind v4, ESLint, `src/` dir, `@/*` alias, npm); static export with `images: { unoptimized: true }`; `npm run build` and `npm run lint` pass.
- Done: hub at `/` (`src/app/page.tsx`). Its style list and site link come from `src/data/styles.ts`. Verified in Playwright at 1440px and 390px plus keyboard Tab order; no console errors.
- Done: Neon Arcade mood board (`/mood-boards/neon-arcade`): 30 tiles = 10 user-approved reference images (`public/mood-boards/neon-arcade/`, metadata/alt/credits in `src/data/mood-boards/neon-arcade.ts`) + 20 code-built artifacts in `src/app/mood-boards/neon-arcade/artifacts/` (color-type, textures, interface; shared contract in `types.ts`). Palette `--na-*` vars and fonts (Orbitron, Tektur, Exo 2, Share Tech Mono) set on the page wrapper. Verified at 1440/390, keyboard, build.
- Avoid CJK Google fonts (e.g. M PLUS Rounded 1c): they download ~100 subset files and time out in dev.
- Placeholders: remaining routes render `src/components/Placeholder.tsx` ("Not built yet"). Replace each one as it's built.
- Done: Console Tiles mood board (`/mood-boards/console-tiles`), same structure: references in `src/data/mood-boards/console-tiles.ts` (user swapped 03, a docked-controllers product shot, for a video-store cover wall), artifacts in `src/app/mood-boards/console-tiles/artifacts/`. Palette `--ct-*` (light gray #ebebeb, white tiles, cyan #00c3e3 selection ring, neon red/blue accents, yellow #ffd400 category signs); fonts Rubik, Figtree, Nunito. Cyan fails contrast on light (1.78:1), so link focus uses a dark outline. Both boards share tile ordering via `src/lib/board-order.ts`.
- Done: Cozy Pixel mood board (`/mood-boards/cozy-pixel`), same structure; user approved the first 10 images. Palette `--cp-*` (parchment #f7ecd6, cocoa text #3b2a20, wood #8a4a24 / #d9a066, grass, pumpkin, sky, pink, gold; colored fills take dark text only); fonts Pixelify Sans, Silkscreen, Lora. Pixel art drawn with `artifacts/pixel.tsx` (`PixelSprite`); pixel-art references set `pixelated: true`. Minimum text size 10px.
- All three mood boards done. Not started: design systems, the site.
- **Next step:** pick the style for the site (open decision 1), then its design system first.

## Decisions made
- **Site:** landing page for an online games site named **LazyDonkeyGames** (name checked 2026-10-12: no matching studio, no US trademark, `lazydonkeygames.com` unregistered). Avoid Donkey Kong-like art (no barrels, girders, red tie); don't copy Crazy Monkey Games' logo, mascot, or layout.
- **Site route:** `/play`.
- **Three styles** (slug, inspiration):
  - Neon Arcade (`neon-arcade`): the original Tron with a modern twist (dark, glowing light-grid lines).
  - Console Tiles (`console-tiles`): Nintendo Switch home screen, large horizontally scrolling tiles. Named generically on purpose; don't use "Nintendo" or "Switch" as a label.
  - Cozy Pixel (`cozy-pixel`): Stardew Valley (warm, pastel, pixel art).
- **IP rule:** mood boards may include reference screenshots of Tron, the Switch, and Stardew (research). The site and design systems must use original art (CSS/SVG/generated), never their logos, sprites, or names.
- **Code structure:** each style gets its own page folders (`src/app/mood-boards/<slug>/page.tsx`, `src/app/design-systems/<slug>/page.tsx`), not a shared dynamic route, because each style has its own fonts and layout. Fonts via `next/font/google` (self-hosted at build time, so static-safe). Per-style design tokens as CSS variables. Planned: shared fake game data (~12 games: title, category, thumbnail, rating, play count, new/hot flags) in `src/data/games.ts`, used by the design systems and the site.
- **Mood board process** (user's choice): agent collects ~10 internet reference images per style, user reviews and swaps any (for Neon Arcade they replaced the Tron arcade flyer with a non-Tron vector arcade screenshot), then the agent builds the remaining ~20 artifacts in code. Source images from Wikimedia Commons/Wikipedia via their API (Unsplash blocks scripts; Wikimedia rate-limits fast loops, so batch titles and pause). Record license/author per image; CC BY images need visible credits on the page.
- **Hub look:** deliberately neutral (Geist, `neutral-*` grays, near-black button) so it doesn't compete with the three styles.

## Open decisions (ask the user)
- **Console Tiles mood board:** user said it "looks ok" but may want to revisit it (2026-10-12). Ask before moving on from mood boards.
1. **Chosen style** for the site: decide after the mood boards; record the one-to-two sentence "why it fits the site and its users". Caution for Neon Arcade: it tempts many accent colors (accent must be reserved for the primary action) and makes contrast harder.
2. **Site interactions** (need ≥2): candidates are category filter chips plus search (with empty state), a game detail modal whose primary **Play** button (the only accent use) shows fake loading then "Launching…", and a favorite toggle or sort select.

## Remaining plan
1. Mood boards (3), one commit each.
2. Pick the style.
3. Design systems (3), chosen style first and most thorough. Show forced control states side by side; compute contrast ratios, don't eyeball them.
4. The site at `/play`: hero featured game first, then category rows/grid; commit per section (header, hero, grid, filters, modal).
5. Verify every page in Playwright at 390px and 1440px, all interactions, full keyboard pass (visible focus, modal traps focus and closes on Escape).
6. User pushes; Vercel auto-deploys; submit hub URL and repo URL.
- Suggested to the user: keep a short notes file of what was asked of the agent, where they pushed back, and what they decided (needed for the explanation part of grading). Not created yet.

## Pending user actions
- Push local commits (the agent can't push). As of 2026-10-12, nothing after `fcb0448` had been pushed; check with `git fetch && git status -sb`.
- Vercel not connected yet: vercel.com → Import Git Repo → `dbs-p2` (dashboard; no CLI needed).

## Repo / git
- Project root: `/Users/jacob/projects/p2`. Branch `main`.
- Remote `origin`: `git@github.com:carnowell-uchicago/dbs-p2.git` (SSH).
- The user pushes themselves (this machine has no SSH key or GitHub credentials; pushes from the agent fail). Commit locally with small, frequent commits and let the user push.
- Commit messages end with the `Co-Authored-By` attribution line given in the session's system reminder.

## Commands
- `npm run dev` develop, `npm run build` static export to `out/`, `npm run lint`.
- Deploy: Vercel Hobby, static; no server features.

## Gotchas
- This Next.js version differs from older ones; read `node_modules/next/dist/docs/` before writing code (static export guide: `01-app/02-guides/static-exports.md`).
- Static export forbids server-only features (dynamic server functions, PPR/`cacheComponents`, default image optimization, route handlers that read the request).
- `next dev` re-appends the `nextjs-agent-rules` block to this file; commit it rather than deleting it.
- Browser checks: Playwright MCP is installed (project-local config in `~/.claude.json`). Screenshots must be saved under the project root (use `.playwright-mcp/`, which is gitignored); the session scratchpad is outside its allowed roots. After starting `npm run dev` in the background, wait until it logs "Ready" before navigating, or the first load fails with `ERR_ABORTED`. The "N" bubble in dev screenshots is Next's dev indicator, not part of the page. The Playwright browser window is visible to the user, and `browser_resize` changes the page size inside it: after 390/1440/wide checks, restore it to fit the window (window is 1200×773, so `browser_resize` 1200×688), or the page looks squished or overflows with no scrollbar.
- In flex-column link lists, add `self-start` to links so focus rings hug the text instead of spanning the container.
- `npm audit` reported 5 high-severity vulnerabilities after install; not yet investigated.
- No PDF tools installed. To read PDFs: `pip3 install --target <scratchpad>/pylib pypdf`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
