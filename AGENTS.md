# LazyDonkeyGames: Design, Build, Ship, Assignment 2

MPCS 51238, Autumn 2026. **Due Tuesday, October 13, 5:30 PM.** The brief PDF is in the repo root (gitignored; readable with the Read tool, section 4's example is on page 3).

## The assignment
Explore three visual styles, pick one, and build a small static site in it, all in one Next.js project on Vercel.

| Route | What |
|---|---|
| `/` | Hub (the submitted URL): links to the 3 mood boards, 3 design systems, and the site |
| `/mood-boards/<slug>` | ~25–30 artifacts per style (photos, type, color, texture, interface pieces) |
| `/design-systems/<slug>` | Color roles with contrast, type roles, spacing and shape, every component, control states (rest/hover/focus/pressed/selected/disabled), UI states (empty/loading/error/success) |
| `/play` | The site, in the chosen style: clear hierarchy, ≥2 interactions, every control in its states, accent only on the primary action, responsive at 1440 and 390 |
| `/play/<slug>` | One page per game, with the real game in a frame |

- **Graded on:** hierarchy, type, color, accessibility (contrast, keyboard), layout, affordances, states, looking like the chosen style, simplicity.
- **Submission:** the Vercel hub URL and the GitHub repo URL.
- **Assessment:** one-shot work is marked incomplete. The student needs many small commits and must be able to explain why the style fits, the design decisions, and how the agent was used (below).

## Hard constraints
- Next.js + Tailwind, static export (`output: "export"`, `images: { unoptimized: true }`). Don't enable `cacheComponents`/PPR.
- No backend, database, accounts, external APIs, or storage. Nothing is saved: favorites and ratings reset on reload, and games keep only a session best. The 12 games are real; the catalog's ratings and play counts are made up. Push back on any suggested backend or unneeded package.
- Original art only on the site, design systems, and games (CSS/SVG/canvas). Mood boards may show reference screenshots of Tron, the Switch, and Stardew; never use their logos, sprites, or names as labels.

## Status (2026-10-13)
- **Built:** hub, 3 mood boards (30 tiles each), 3 design systems, `/play`, and 12 playable game pages. Build and lint pass.
- **Deployed:** GitHub `carnowell-uchicago/dbs-p2`; Vercel deploys `main` to https://dbs-p2.vercel.app. Verified there: all 12 games run and the header logo shows. Plain `git push` from the project folder works (over HTTPS). **Push only when the user asks.**
- **Logo:** the horizontal lockup is the `/play` header (see Code map). The paper-craft badge (`brand/logos/logo-1-paper.svg`) is not on the site.
- **Small open items** (offered earlier, never answered; not rechecked since):
  - CP states table truncates "Hay Runner" in the compact list row.
  - Mostly empty board tiles (NA "Horizon glow", CT "Soft dot grid").
  - CP Dungeon Dash thumbnail reads like a chest.
  - CT board toggle "on" is cyan; the design system uses white.
  - Tab visits all 8 popular tiles on `/play` before the catalog.
  - The hub doesn't say which style was chosen.
  - The ring specimen's label sits 6px below its neighbors' labels.

## Next up
1. **Final website check**, on the live URL and locally, at 1440 and 390. Check: the hub, 3 boards, 3 design systems, `/play` (hero, popular row, filters, popup), and every game page (loads, keys work after load, wide games pick the wide layout, favorite and rating carry back to `/play`). Look for overflow, text under 12px, focus rings, and console errors. Consider the open items above.
2. **Improve the games** in `~/projects/lazydonkey-games` (see that section), then copy them into `public/games/`, and keep `src/data/games.ts` (blurb, controls, minutes) in line with what each game actually does.

## Decisions
- **Site:** LazyDonkeyGames, a casual browser-games portal. The name was checked (no studio, no US trademark, domain free). No Donkey Kong-like art; don't copy Crazy Monkey Games.
- **Styles:** Neon Arcade (Tron, modernized), Console Tiles (Switch home screen; never labeled "Nintendo"/"Switch"), Cozy Pixel (Stardew Valley). One design system per board, equal effort.
- **Chosen style: Console Tiles, dark.** Why it fits: a games portal is mostly browsing, and the console home row (big tiles, one selection ring) is built for that. The charcoal makes the colorful game art and the single red Play button stand out, so players always know what to press.
- **Hub:** deliberately neutral (Geist, neutral grays) so it doesn't compete with the styles. It shows "Assignment 2 · Jacob Carnowell"; the course name is hidden below `sm` so the line stays one row.
- **Games on the site:** each gets its own page (not a popup), so the game has room and a real URL; Play is a link to it.
- **Code:** per-style folders, fonts per page via `next/font/google`, tokens as CSS vars. Board and design system changes flow both ways.

## Styles
Each has a CSS-var prefix, tokens in `src/components/ds/<slug>/tokens.ts`, and one accent reserved for Play.
- **Console Tiles** (`--ct-*`, dark):
  - **Colors:** bg #2d2d2d, surface #3c3c3c, text #fff, muted #b4b4b4, divider #4a4a4a, border #919191; red #d92b1a (Play only, white label 4.87:1); success #5cd17a; yellow #ffd400 (attention signs only, dark text); disabled fill #242424.
  - **Selection:** cyan #00c3e3 passes 6.5:1, so focus/selection is a 3px cyan outline with a 3px gap. A white fill means selected and takes `text-(--ct-bg)`; only Play keeps `text-white`.
  - **Shadows:** black at 0.3–0.6.
  - **Fonts:** Rubik (display), Figtree (body), loaded in the CT design system's `page.tsx` and in `src/app/play/layout.tsx`.
  - **Dark pages:** they set `data-theme="dark"`; `globals.css` then gives `<html>` `color-scheme: dark` (dark scrollbars and native controls).
- **Neon Arcade** (`--na-*`):
  - **Colors:** void #05070d bg, panel #0a1220, raised #101b2e, ice #e6fbff text, muted #7f9bb3, line #1c2f4a (dividers), edge #4e6f96 (control borders), cyan #4df3ff (focus, selection, links), orange #ff9a3c / #ffb36b (Play), magenta #ff3df2 (Hot badge), green #5ef2a0, red #ff5c6c.
  - **Shape:** radii 4/6/10px by size (`--na-r-sm/md/lg`; nested = outer minus gap); 2px lines, 3px focus and selection; glow only on hover, focus, and selection.
  - **Fonts:** Oxanium, Exo 2, JetBrains Mono (`fonts.ts`; keep mono tracking ≤0.08em).
- **Cozy Pixel** (`--cp-*`, role names):
  - **Colors:** parchment #f7ecd6 bg, paper #fff8ea, cocoa #3b2a20 text, muted #6e5644, wood #8a4a24 border and selected fill (cream text), bevel #d9a066 (decor), wheat #efdcb6, clover #6aa84f, berry #b3361f, pumpkin #f08a24 (Play). Colored fills take cocoa text.
  - **Shape:** pixel corners only, no CSS radius. `edge` in `styles.ts` draws two-step stair corners with box-shadows and background squares, so an element with `edge` must use `backgroundColor`, not `background`. `bevelEdge` adds the bevel; `smallEdge` is for boxes under 32px. 3px control edges, 4px panels.
  - **Fonts:** Pixelify Sans (titles, labels), Lora (sentences).

## Code map
- **Shared:**
  - `src/data/games.ts`: the 12-game catalog (slugs match `public/games/<slug>/`).
  - `src/data/styles.ts`: hub list.
  - `src/lib/contrast.ts`: computed WCAG ratios, never typed.
  - `src/lib/design-system.ts`: the page spec and the forced-state convention. Read it before touching design systems.
- **UI library per style:** `src/components/ds/<slug>/`. Components take `force?: ForcedState` and render `data-force`, so one class string serves both live controls and frozen specimens.
- **Design system pages:** `src/app/design-systems/<slug>/page.tsx` plus `sections/` (color, type, spacing, components, states, ui-states, live demos). Desktop shows sections 1–3 in the left column and 4–6 in the right; the states table is `inert`.
- **Mood boards:** `src/app/mood-boards/<slug>/` (masonry of `<figure>` tiles, `artifacts/*.tsx`). Reference data is in `src/data/mood-boards/<slug>.ts`, images are `public/mood-boards/<slug>/NN-name.webp` (photos ≤720px WebP q80, pixel art q90, via PIL). CC BY images need visible credits. Artifacts are pictures: nothing focusable, decor `aria-hidden`, motion `motion-safe:` only.
- **The site:** `src/app/play/`.
  - `layout.tsx`: fonts, palette, header, footer ("A class project. Nothing is saved."), and `StoreProvider` (`store.tsx`: favorites and ratings, shared by every `/play` page, reset on reload).
  - `brand.tsx`: the lockup logo (`public/logo-lockup.svg`, 56px tall on phones, 80px from `sm`). It's the h1 on `/play` and a home link on game pages.
  - `page.tsx` → `site.tsx`: the catalog page and the one shared `GameDialog`; then `hero.tsx` and `catalog.tsx`. Order: header → featured Hay Runner hero → "Popular now" `TileRow` → "All games" catalog.
  - **Interactions:** catalog filters (search, category chips, sort, "Favorites only" switch, live count, empty state); the detail popup (Play, favorite heart, 5-star rating); shared favorites and ratings.
  - **Game pages:** `[slug]/page.tsx` (static params, `dynamicParams = false`) and `game-view.tsx`: back link, title, favorite, the frame, controls, rating. The `<iframe>` writes its own page with `srcDoc` and loads `/games/<slug>/game.js` by absolute path (see the Vercel gotcha). A loading overlay shows until it loads, then the frame takes focus so keys work. Frame height is `100dvh` minus the header and title (`16.5rem` phones, `20rem` from `sm`); retune if the header changes. The games' mute/pause buttons sit in the frame's top-right corner.
  - **`PlayButton`:** a `<Link>` to `/play/<slug>` styled as the primary button; `useLinkStatus` shows "Loading…" while pending (usually skipped, since links prefetch). Sizes to its label.
  - **`GameDetail` / `GameDialog`:** take optional `favorite`/`onToggleFavorite` and `myRating`/`onRate`, falling back to local state. `TileRow` takes `onOpen`.
  - **`StarRating`:** a radio group. Hover lights that star and all to its left (mouse only), click or tap sets it, and arrows move it. `StarButton` shows one star in any forced state (states-table row "Rating star").
  - **Popup fit:** `GameDialog` scales the whole panel with CSS `zoom` to fit the window. The image keeps its 16:9 box. The smallest text (12px badges) never drops below `MIN_TEXT_PX` = 10, so the minimum is 83%. Below that it scrolls with the scrollbar hidden. The user rejected cropping or shrinking only the image.
  - **Phones:** the favorites switch reads "Favorites", and the "Saved to favorites" text is hidden (sr-only in the hero).
- **Games:** `public/games/<slug>/game.js` and `public/games/shared/engine.js`, copied from the games repo (no `index.html`; lint-ignored).
- **Logos:** `brand/logos/make.py` generates both concepts (preview: `brand/logos/index.html`). The lockup's wordmark is Rubik outlines (`fonts/Rubik[wght].ttf`, OFL; kerning read from the font's GPOS), so it looks the same without the font installed. The canvas width follows the text: the right margin matches the 75px left of the badge's torn rim. `make.py` also writes `public/logo-lockup.svg`; rerun it after any change (`python3 -B brand/logos/make.py`).
- **Fonts and weight:** the root layout loads no fonts; each page or layout loads its own. Reference images are ~1.3 MB, lazy after the first. Hub "preloaded but not used" font warnings come from `<Link>` prefetch; they're normal.

## The games repo: `~/projects/lazydonkey-games`
- The source of truth for the 12 canvas games: its own git repo, no remote. `PROGRESS.md` has the build log, per-game notes, and known limits (portrait 360×640 for most; Gridline Racer, Pirate Cove, Paddle Panic, and Hilltop Defense pick a wide layout at load from the window, which is the frame on the site; one pointer only, so no multi-touch).
- **Rules for game work:** `~/.claude/agents/game-builder.md` (the `game-builder` agent: one phase for one game; vanilla JS + the shared engine, ≤40 KB, keyboard and touch, canvas text ≥12 CSS px, top-right kept clear for mute/pause, art matching the site thumbnail in `GameArt.tsx`, nothing saved, reduced motion). It must not edit p2.
- **Run:** `python3 ~/projects/lazydonkey-games/tools/serve.py` (port 8090, no-store), then http://127.0.0.1:8090/<slug>/.
- **Tests:** `sh tools/sync-tests.sh` (Playwright can only read files under p2, so it copies tests to `p2/.playwright-mcp/games/`), then run `tools/all.js` (copy it there too) or one game's `smoke.js` + `<slug>.test.js` with `browser_run_code_unsafe`.
- **Copy into the site** after changing games (the site was last synced at games commit 56f0100):
  `R=~/projects/lazydonkey-games; for s in $(ls ~/projects/p2/public/games | grep -v shared); do cp $R/$s/game.js ~/projects/p2/public/games/$s/; done; cp $R/shared/engine.js ~/projects/p2/public/games/shared/`
  Then check a few game pages on the site, update `games.ts` if controls or round length changed, and commit in p2 noting the games commit.

## How the agent was used (for the grading explanation; keep appending)
The user directed or pushed back on:
- swapping Neon Arcade 03 and Console Tiles 03;
- using subagents for the boards and design systems;
- the squished Playwright window;
- rejecting "pick a style first" (all three design systems get equal effort);
- matching the brief's section 4 example layout;
- a more modern Neon Arcade (the agent turned it into a size-based radius scale, a 2/3px line hierarchy, and Oxanium + JetBrains Mono);
- "similar changes" for Cozy Pixel (the agent used two-step pixel corners instead of a radius, plus heavier edges);
- the professor's page-weight note (the agent audited; the user chose per-page fonts and WebP references);
- adding their name to the hub, then flagging extra space on phones (the line wrapped at 390; the agent kept it to one row);
- the Play icon looking off center (the agent measured ~3px and recentered it);
- Console Tiles dark theme (the agent kept the red accent and let cyan be the ring on its own, since it now passes contrast);
- choosing Console Tiles and asking for the rubric's interactions (the agent picked filters, the detail popup with fake Play, and shared favorites);
- aligning the ring specimen and narrowing the Play button;
- adding star ratings with a hover preview to the design system and the popup;
- fitting the popup to the window: the user rejected the agent's first version (cropping the image) and asked for whole-panel scaling with a minimum text size;
- an overnight automated build of 12 standalone games (two improvement passes each), then Sky Picnic tweaks (constant wind per band, score top-right);
- integrating the games: the user asked to drop "the games are pretend" from the footer and make the games work on the site (the agent gave each game its own page with the game in a frame, made Play a real link, and moved favorites into a layout so they survive the trip);
- reporting that every game 404ed on Vercel (the agent traced it to Vercel's clean URLs breaking the frame's relative script path and switched the frame to an inline page that works on any host);
- asking about the `npm audit` warnings (the agent found one lint-only advisory with no patch yet and advised waiting rather than a breaking `--force` fix);
- logo concepts: the user preferred the first version's pointed tears, asked for a smirk and a back-kick story, rejected the extended leg (now a cocked hoof), and kept 2 of 3; later the user had the lockup centered (then balanced on the badge's torn rim), tried its wordmark in Rubik and kept it, and made it the site header logo (the agent shortened the game frame to match the taller header).

## Workflow
- Small, frequent commits. Messages end with the session's `Co-Authored-By` line. Push only when the user asks.
- Verify in the browser at 1440 and 390: page overflow, text under 12px, every interaction, and a keyboard pass. Restore the window to 1200×688 afterwards (it's visible to the user).
- After a push, check the live site with `curl` or Playwright at https://dbs-p2.vercel.app once Vercel finishes (the user can say when).
- Subagents (when asked): the orchestrator commits the shared contract first; each fork owns its folders, runs only `tsc`/`eslint` (no dev, build, Playwright, or git), and writes `page.tsx` last; the orchestrator verifies and commits.

## Commands
`npm run dev`, `npm run build` (static export to `out/`), `npm run lint`. A dev server may already be running from an earlier session (check `lsof -iTCP -sTCP:LISTEN -n -P`; it was on port 3005). Other local servers: 8090 games, 8091 `brand/logos` preview (`python3 -m http.server 8091` there).

## Gotchas
- **Next.js:** this version differs from older ones. Read `node_modules/next/dist/docs/` first (static export guide: `01-app/02-guides/static-exports.md`). E.g. `next/image` `priority` is deprecated (use `loading="eager"` or `preload`). Commit the `nextjs-agent-rules` block below; `next dev` re-adds it.
- **Vercel:** static `.html` paths 404 (`/games/x/index.html` is served at `/games/x`, with no trailing slash, so its relative script paths break). Don't link to `.html` files; use absolute paths. Test the real URL at https://dbs-p2.vercel.app (per-deployment URLs need a Vercel login).
- **Playwright MCP:**
  - **Screenshots:** paths resolve from the project root; save under `.playwright-mcp/` (gitignored). `browser_run_code_unsafe` can only read files under p2.
  - **Run-code permission:** `browser_run_code_unsafe` was once blocked by the auto-mode safety check. Prefer `browser_navigate` + `browser_take_screenshot`/`browser_evaluate`, and ask before relying on run-code.
  - **Raw SVGs:** navigating straight to an SVG times out (the screenshot still works). Wrap it in an HTML page instead.
  - **Tall pages:** pages over ~16k px fail full-page shots at 390; use a 390×2000 viewport and scroll.
  - **Games in frames:** reach a game's state with `document.querySelector('iframe').contentWindow.__game` (same origin). Keys only reach the game while the frame has focus.
- **Dev server:**
  - Wait for "Ready". The "N" bubble is Next's dev indicator.
  - A background `next dev` dies after 2 hours.
  - Missing imports make every route 500, so write new pages last.
  - It can serve stale modules after edits to shared components or `globals.css` (hydration mismatch, missing CSS). Restart it; compare with `out/`.
  - Route types (`LayoutProps<"/route">`) only regenerate on dev/build, so a new layout can fail `tsc` until then; type `children` directly.
- **Tailwind v4:** `outline-hidden focus-visible:outline-2` draws nothing; add `focus-visible:outline-solid` (and `data-[force=focus]:outline-solid`). `hover:` only applies on hover-capable devices.
- **Layout:**
  - Add `self-start` to links in flex columns.
  - Horizontal scrollers need `relative`.
  - A mobile `grid` needs `grid-cols-1`.
  - A `<dialog>` must use `open:flex` (not `flex`) or it shows while closed.
- **Editing and fonts:** bulk class-name regexes can hit JS identifiers (run `tsc` after). Avoid CJK Google fonts (they time out in dev). Run Python with `-B` so no `__pycache__` appears (it's gitignored anyway).
- **Lint:** about 20 warnings come from old scratch scripts in the gitignored `.playwright-mcp/games/`; `src` is clean.
- **`npm audit` (checked 2026-10-13):** the 5 "high" findings are one advisory (GHSA-vfj7-8cjw-p6xm, a crash from deeply nested patterns in `braces` ≤3.0.3), reached through `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch`. Lint-only: none of it ships in `out/` or runs on Vercel. No patched `braces` exists yet, and even the 16.5 canary plugin pulls in the same chain. Don't run `npm audit fix --force` (it downgrades `eslint-config-next` to 14). Re-check later; once `braces` is patched, `npm update` should clear it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
