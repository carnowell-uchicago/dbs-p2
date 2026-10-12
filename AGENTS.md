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

## Status (last updated 2026-10-12, end of session; due 2026-10-13 5:30 PM)
- Done: Next.js 16.4.0 scaffold (App Router, TypeScript, Tailwind v4, ESLint, `src/`, `@/*` alias, npm); static export with `images: { unoptimized: true }`. `npm run build` and `npm run lint` pass.
- Done: hub at `/` (`src/app/page.tsx`); style list and site link come from `src/data/styles.ts`.
- Done: three mood boards (`/mood-boards/<slug>`), 30 tiles each (10 user-approved reference images + 20 code-built artifacts).
- Done: three design systems (`/design-systems/<slug>`), all built to the same standard, then relaid out at the user's request to match the brief's section 4 example (PDF page 3, "Calm · Design System"). Verified at 1440 and 390 (no page overflow, no text under 12px), keyboard (tab arrow keys, dialog Escape/backdrop/focus return, CT home-row arrows), Play loading → "Launching…", `npm run build`.
- Not started: the site at `/play` (still renders `src/components/Placeholder.tsx`).
- **Next step:** ask the user for feedback on the design systems (one open nit below), then ask which style the site uses (open decision 1) and build `/play`.

## Styles (palette prefix, fonts, key color decisions)
- **Neon Arcade** (`neon-arcade`, `--na-*`): void #05070d, panel #0a1220, ice text #e6fbff, muted #7f9bb3, cyan #4df3ff (focus, selection, links), orange #ff9a3c (accent, primary actions only), magenta #ff3df2 (Hot badge only). The design system added Edge #4e6f96 for control borders (the board's Line #1c2f4a is 1.49:1, dividers only), Raised #101b2e hover surface, Orange hot #ffb36b, green #5ef2a0 success, red #ff5c6c error. Modernized 2026-10-12 at the user's request ("hard lines, softer slightly rounded corners; slightly thicker lines"): radii `--na-r-sm/md/lg` = 4/6/10px by size (nested parts use outer radius minus gap; only radio dots are round, the switch is a rounded rect), all borders and dividers 2px, focus ring 3px, selection bars 3px, tighter label tracking. Fonts: Oxanium (display, headings, buttons; square letters with softened corners), Exo 2 (body), JetBrains Mono (labels); one shared `fonts.ts` for the board and the design system. JetBrains Mono is wider than Share Tech Mono was, so keep label tracking ≤0.08em and check narrow cells.
- **Console Tiles** (`console-tiles`, `--ct-*`): bg #ebebeb, white surfaces, text #2d2d2d, muted #5c5c5c, border #767676. Accent red darkened from the board's #ff3c28 to #d92b1a (white Play label 4.87:1). Cyan #00c3e3 is 1.78:1 on the gray, so the selection/focus ring is a white gap + cyan + dark edge, and cyan never carries text. Success #1e7a34, yellow #ffd400 only for attention/error signs (dark text), dark fill means "selected". Fonts: Rubik (display, titles), Figtree (body, labels). The user may still revisit the CT mood board; changes there should flow into its design system.
- **Cozy Pixel** (`cozy-pixel`, `--cp-*`, variables renamed to roles, e.g. `--cp-accent` = pumpkin #f08a24): parchment #f7ecd6, paper #fff8ea, cocoa text #3b2a20, muted #6e5644, wood border #8a4a24, bevel #d9a066, wheat #efdcb6 (wells, skeletons), clover #6aa84f success, berry #b3361f error, sky/gold/blossom for badges only. Colored fills take cocoa text; cream text only on dark wood. Fonts: Pixelify Sans (display, titles), Silkscreen (short labels, ≥12px), Lora (all body text).

## How the design systems are built
- Shared contract: `src/data/games.ts` (12 fake games with motif, category, rating, plays, New/Hot flags; `formatPlays`, `gameBySlug`), `src/lib/contrast.ts` (WCAG ratios, always computed, never typed), `src/lib/design-system.ts` (the page layout spec plus the forced-state convention). Read `design-system.ts` before touching these pages.
- Reusable UI per style in `src/components/ds/<slug>/` (tokens, Button, link, fields, chips, tabs, toggle, `GameArt` for all 12 motifs, game card, list row, favorite, badges/rating, native `<dialog>` with the Play flow). **`/play` should import from here.** Components take `force?: ForcedState` and render `data-force`, so one class string serves live and frozen specimens. Several have small optional props added for the states table (`size="sm"`, `compact`, `hideLabel`).
- Showcase pages: `src/app/design-systems/<slug>/page.tsx` (fonts via `next/font/google`, palette CSS vars on a wrapper) plus `sections/` (`color`, `type`, `spacing`, `components`, `states`, `ui-states`, and client demo files).
- Page layout (matches the brief's example): title "<Style> · Design System", then two columns on desktop (1 Color roles, 2 Type roles, 3 Spacing and shape | 4 Components (one live copy of each), 5 Control states table (row per control × Rest/Hover/Focus/Pressed/Selected/Disabled, `inert`), 6 UI states (four small cards)). Heights at 1440: NA ~2,150, CT ~2,420, CP ~2,570px. On phones, the NA/CT states table scrolls sideways inside its frame with sticky row labels; CP switches to labelled 3-column grids via a container query.
- Open nit (offered to the user, no answer yet): in the CP states table the compact list-row copy truncates "Hay Runner" to "Hay Run…" (NA no longer does after its font change). Options: give that row a wider cell or use a shorter label.
- Verification script pattern that worked: for each page and width, check `document.documentElement.scrollWidth - clientWidth` (page overflow), text under 12px, and text overflowing its box; then screenshot sections with `locator('#states').screenshot()`.

## How the mood boards are built
- Per board: `src/app/mood-boards/<slug>/page.tsx` loads that style's fonts, sets the palette as CSS vars on a wrapper, and renders a masonry grid (`columns-2 md:columns-3 xl:columns-4`) of `<figure>` tiles plus an image-credits footer.
- References: `public/mood-boards/<slug>/NN-name.jpg`; typed data (src, size, label, alt, source URL, license, author, optional `pixelated`) in `src/data/mood-boards/<slug>.ts`. `Reference` type lives in `neon-arcade.ts`. CC BY images need visible credits.
- Artifacts: `src/app/mood-boards/<slug>/artifacts/{color-type,textures,interface}.tsx` (`Artifact[]`), contract in `types.ts`; Cozy Pixel also has `pixel.tsx` (`PixelSprite`). `src/lib/board-order.ts` interleaves references and artifacts. Artifacts are pictures, not controls (nothing focusable, decorative art `aria-hidden`, animation `motion-safe:` only).
- Image sourcing: Wikimedia Commons/Wikipedia API (Unsplash blocks scripts; Wikimedia rate-limits fast loops, so batch and pause).

## Subagent workflow (the user asked for subagents; it worked for boards and design systems)
- Orchestrator writes and commits the shared contract first, then launches one fork per style (or per artifact file) in parallel. Each fork owns its folders only, must not run dev/build/Playwright or git, and may run `npx tsc --noEmit` and `npx eslint <its paths>`.
- Forks write `page.tsx` last. While any fork is mid-edit, `next dev` can 500 on every route, so wait for all forks before browser checks.
- After forks finish: the orchestrator checks every page in Playwright at 1440 and 390 plus the keyboard, fixes bugs, and commits per style (UI library, then page).

## Decisions made
- **Site:** landing page for an online games site named **LazyDonkeyGames** (name checked 2026-10-12: no matching studio, no US trademark, `lazydonkeygames.com` unregistered). Avoid Donkey Kong-like art (no barrels, girders, red tie); don't copy Crazy Monkey Games' logo, mascot, or layout.
- **Site route:** `/play`.
- **Three styles:** Neon Arcade (original Tron with a modern twist), Console Tiles (Switch home screen; named generically, never "Nintendo" or "Switch" as a label), Cozy Pixel (Stardew Valley).
- **IP rule:** mood boards may include reference screenshots of Tron, the Switch, and Stardew (research). The site and design systems use original art only (CSS/SVG), never their logos, sprites, or names.
- **One design system per mood board, equal effort.** The brief requires all three; never block them on the site's style choice (the user pushed back on this).
- **Code structure:** per-style page folders (no shared dynamic route), fonts via `next/font/google`, per-style tokens as CSS vars.
- **Hub look:** deliberately neutral (Geist, `neutral-*` grays, near-black button) so it doesn't compete with the three styles.

## Open decisions (ask the user)
1. **Chosen style for `/play`.** Agent's earlier recommendation (2026-10-12, not answered): **Console Tiles**, because a games portal is mostly browsing many games, the tile row with one selection ring is built for that, and the light palette makes contrast and a single reserved accent easy. Neon Arcade risks many glowing accents and harder contrast; Cozy Pixel is charming but pixel fonts must stay out of body text. Record the choice and a one-to-two sentence "why it fits the site and its users".
2. **Site interactions** (need ≥2): candidates are category filter chips plus search (with empty state), the game detail dialog whose **Play** button (the only accent use) shows fake loading then "Launching…", and a favorite toggle or sort select. All already exist as components.
3. Possible polish not yet requested: tall, mostly-empty mood board tiles (Neon Arcade "Horizon glow", Console Tiles "Soft dot grid"); some thumbnails may read poorly (e.g. Cozy Pixel's Dungeon Dash looks like a chest).

## Remaining plan
1. ~~Mood boards~~, ~~design systems~~ done.
2. Pick the style (open decision 1). Build `/play` from that style's `src/components/ds/<slug>/`: header, hero featured game first, then category rows/grid, filters, dialog; commit per section. Accent only on the primary action. Responsive at 1440 and 390.
3. Verify every page in Playwright at 390 and 1440, all interactions, full keyboard pass. Reset the viewport afterwards (see Gotchas).
4. User pushes; connects Vercel; submits the hub URL and repo URL.
- Suggested to the user: keep a short notes file of what was asked of the agent, where they pushed back, and what they decided (needed for the explanation part of grading). Not created yet. Pushback so far: swapped Neon Arcade 03 and Console Tiles 03; asked for subagents; flagged the squished Playwright window; rejected picking a style before building the design systems; asked to make the design systems easier to look at by matching the brief's section 4 example; asked for a more modern Neon Arcade (hard lines with slightly rounded corners, thicker lines); the agent refined it into a 3-step radius scale, 2px/3px line hierarchy, and a font swap to Oxanium + JetBrains Mono.

## Pending user actions
- Push local commits (the agent can't push). This clone has no `origin/main` ref, so the agent can't see what's pushed: ask the user. Last local commit at end of the 2026-10-12 session: this AGENTS.md update.
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
- Avoid CJK Google fonts (e.g. M PLUS Rounded 1c): they download ~100 subset files and time out in dev.
- While a page imports files that don't exist yet, `next dev` returns 500 on every route. Write a page in the scratchpad and move it in once its imports exist.
- `npm run build` while `next dev` runs is fine here (no breakage seen).
- Background `next dev` dies at the 2-hour background limit. For checks without it: `npm run build`, then serve `out/` with a tiny Python server that maps `/route` to `route.html` and prefers it over same-named folders (e.g. `out/mood-boards/neon-arcade/` holds images).
- Bulk regex edits on class names can hit JS identifiers (a `border` → `border-2` pass renamed `const border`); grep the diff and run `tsc` after.
- In flex-column link lists, add `self-start` to links so focus rings hug the text instead of spanning the container.
- Tailwind v4: `outline-none` and `outline-hidden` both set `outline-style: none`, and `outline-2` only sets width, so `outline-hidden focus-visible:outline-2` draws nothing. Add `focus-visible:outline-solid` (and `data-[force=focus]:outline-solid`) next to state outline widths.
- A horizontal scroll container needs `relative`, or absolutely positioned children (`sr-only` labels, hidden inputs) escape it and widen the page. A mobile `grid` with no `grid-cols-1` sizes its only column to content, so add `grid-cols-1`.
- Very tall pages (>16k px at 390 wide) fail Playwright full-page/clip screenshots; set the viewport to 390×2000 and screenshot while scrolling instead.
- `npm audit` reported 5 high-severity vulnerabilities after install; not yet investigated.
- The brief PDF (repo root, gitignored) can be read directly with the Read tool, which shows the page images too. Section 4's example is on page 3.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
