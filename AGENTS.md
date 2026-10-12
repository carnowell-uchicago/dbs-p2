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

Example styles from class: Calm (matte, warm), Arcade, Editorial. Own styles allowed. Site idea in the brief's examples: reading log (any small static site is fine: recipes, workouts, lineup, coffee shops, records, plants, itinerary, etc.). The chosen topic/style is not yet decided.

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

## Status
- Done: Next.js 16.4.0 scaffolded (App Router, TypeScript, Tailwind, ESLint, `src/` dir, `@/*` alias, npm); static export configured and `npm run build` verified (outputs `out/`).
- Done: hub at `/` (style list and site link live in `src/data/styles.ts`). Placeholder pages (`src/components/Placeholder.tsx`) exist for every other route so hub links resolve.
- Styles: Neon Arcade (`neon-arcade`, original Tron + modern twist), Console Tiles (`console-tiles`, Nintendo Switch home screen, large scrolling tiles), Cozy Pixel (`cozy-pixel`, Stardew Valley). Inspired by, never copying: no Tron, Nintendo, or Stardew logos, sprites, or names in the site itself.
- Site route: `/play`.
- Not started: mood boards, design systems, the site. Chosen style is undecided; ask the user after the mood boards.
- Site: landing page for an online games site named **LazyDonkeyGames** (name checked 2026-10-12: no matching studio, US trademark, or `.com` registration found). Avoid Donkey Kong-like art and don't copy Crazy Monkey Games' logo or look.

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
- `npm audit` reported 5 high-severity vulnerabilities after install; not yet investigated.
- No PDF tools installed. To read PDFs: `pip3 install --target <scratchpad>/pylib pypdf`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
