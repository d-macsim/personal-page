---
phase: 07-discoverability-social-presence
plan: 03
subsystem: now-page-and-analytics
tags: [astro, now-page, derek-sivers, nav, cloudflare-analytics, hash-guard, scroll-handler, base-layout, og-image-wiring]

# Dependency graph
requires:
  - phase: 07-discoverability-social-presence
    provides: Plan 07-02 Head.astro ogImageSlug prop — consumed here via BaseLayout forwarding for /now
  - phase: 07-discoverability-social-presence
    provides: Plan 07-01 PUBLIC_CF_ANALYTICS_TOKEN env typing + test scaffolds (phase7-nav / phase7-analytics) — activated here
  - phase: 07-discoverability-social-presence
    provides: Plan 07-04 dist/og/now.png — referenced by /now page's ogImageSlug='now' meta wiring
provides:
  - "src/pages/now.astro — /now route following UI-SPEC Surface 1 contract (h1 + 3 h2 sections + attribution)"
  - "src/layouts/BaseLayout.astro — Now nav entry (desktop+mobile), hash-only click guard (NOW-03 footgun fix), active-route setter, CF Web Analytics beacon (PROD-guarded, fail-closed)"
  - "BaseLayout Props extended with ogImageSlug/ogImageAlt forwarding to Head.astro"
affects:
  - "Plan 07-05 (phase finalisation) — /now route now navigable, beacon wire-in complete, nav extended to 5 entries"
  - "Homepage nav (#about/#experience/#projects/#contact) — behaviour preserved via hash-only guard"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hash-only click guard — `if (!href.startsWith('#')) return;` BEFORE preventDefault, so real routes navigate normally while hash anchors still smooth-scroll (NOW-03)"
    - "Server-side active-route hint — `data-active='true'` set once on script load when pathname === '/now', coexists with IntersectionObserver which only touches section[id] anchors"
    - "PROD-guarded third-party script — `{import.meta.env.PROD && cfAnalyticsToken && (...)}` double-guard gives fail-closed behaviour when token missing at build time"
    - "Per-page OG wiring via prop forwarding — BaseLayout accepts ogImageSlug/ogImageAlt and passes to Head unchanged; page authors only touch their .astro file"

key-files:
  created:
    - "src/pages/now.astro"
  modified:
    - "src/layouts/BaseLayout.astro"

key-decisions:
  - "[Phase 07-03]: Now nav link placed LAST (after Contact) in both desktop and mobile blocks per UI-SPEC rationale — anchor links form a homepage journey (About→Experience→Projects→Contact); /now is a separate page conceptually outside that flow."
  - "[Phase 07-03]: Active-route setter runs on script load and targets only `[data-nav-link][href='/now']`. Existing IntersectionObserver only observes `section[id]` — on /now there are no such sections (the Now section uses aria-label, no id), so the observer cannot wipe the explicit data-active set by this code."
  - "[Phase 07-03]: CF beacon guarded by BOTH `import.meta.env.PROD` AND `cfAnalyticsToken` presence. Missing token at build time renders nothing (fail-closed). Acceptable default per Plan 07-01 ASSUMED — no prod push-blocking dependency on token being set at time of Plan 07-03 commit."
  - "[Phase 07-03]: Used `new URL().toString()` pattern already established in Head.astro (line 24) — /now `ogImageSlug='now'` resolves via Head.astro's existing `/og/${slug}.png` template to the real PNG emitted by Plan 07-04."
  - "[Phase 07-03]: `<section aria-label='Now'>` — NO `id` attribute. UI-SPEC locks this choice to avoid collision with `#now` nav-anchor semantics and to keep the IntersectionObserver from ever touching it."
  - "[Phase 07-03]: LAST_UPDATED = 'April 2026' (month+year format, matches nownownow.com convention). Single hand-edited constant at top of now.astro frontmatter."

patterns-established:
  - "Hash-only scroll guard — every future nav that mixes `href='#section'` with `href='/route'` must use the `startsWith('#')` early-return pattern. Without it, the real-route clicks get preventDefault'd and the page becomes unreachable."
  - "BaseLayout OG prop forwarding — a page that wants a custom OG image passes `ogImageSlug` + `ogImageAlt` to BaseLayout, which forwards unchanged to Head. No per-page meta tag editing required."
  - "PROD-guarded third-party scripts — any non-first-party `<script>` in BaseLayout MUST be wrapped in `import.meta.env.PROD &&` to avoid polluting analytics with dev traffic."

requirements-completed:
  - "NOW-01"
  - "NOW-02"
  - "NOW-03"
  - "NOW-04"
  - "NOW-05"
  - "ANALYTICS-01"
  - "SEO-07"

# Metrics
duration: ~5min
completed: 2026-04-11
---

# Phase 07 Plan 03: /now Page, Nav Plumbing & CF Analytics Beacon Summary

**Shipped the /now route, extended desktop+mobile nav with a Now entry, fixed the NOW-03 unconditional-preventDefault footgun with a hash-only guard, set server-side active-route indicator for /now, and wired a PROD-guarded Cloudflare Web Analytics beacon into BaseLayout.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-11T18:00:00Z (approx)
- **Completed:** 2026-04-11T18:03:00Z (approx)
- **Tasks:** 2 / 2
- **Files created:** 1 (`src/pages/now.astro`)
- **Files modified:** 1 (`src/layouts/BaseLayout.astro`)

## Accomplishments

- `src/layouts/BaseLayout.astro` Props interface extended with `ogImageSlug?: string` and `ogImageAlt?: string`
- Both new props forwarded to `<Head />` in the layout head slot
- `cfAnalyticsToken` read once from `import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN` in the frontmatter
- Desktop nav gained a 5th link: `<a href="/now" data-nav-link>Now</a>` (UI-SPEC-verbatim markup)
- Mobile nav gained an identical 5th link with `mobile-nav-link` class parity
- Scroll click handler now checks `href.startsWith('#')` and returns early for real routes — fixes the NOW-03 footgun where `/now` clicks would be preventDefault'd and the page would never load
- Active-route setter marks `/now` links with `data-active='true'` when `window.location.pathname` matches `/now` or `/now/` — reusing existing `[data-nav-link][data-active="true"]` style rule with no CSS changes
- Cloudflare Web Analytics beacon injected as the last child of `<body>`, double-guarded by `import.meta.env.PROD && cfAnalyticsToken` (fail-closed when token unset)
- `src/pages/now.astro` created following UI-SPEC Surface 1 contract: single `<h1>`, three `<h2>` sections, `<section aria-label="Now">` landmark, `.prose` + `.reveal` wrappers, LAST_UPDATED constant, nownownow.com attribution footer
- `/now` page passes `ogImageSlug="now"` + `ogImageAlt` to BaseLayout — Head.astro resolves to `/og/now.png` which already exists on disk from Plan 07-04
- `npm run build` exits 0; emits `dist/now/index.html` alongside `dist/index.html`
- `dist/now/index.html` contains the h1 copy "What I'm doing now", the nownownow.com/about attribution link, and `<meta property="og:image" content="https://dragosmacsim.com/og/now.png">`
- Phase 7 test sweep: **29 passed / 0 skipped / 0 failed** across 5 suites (phase7-nav, phase7-analytics, phase7-seo, phase7-og, phase7-build)
- Every Phase 7 requirement in scope is now green: NOW-01 through NOW-05, ANALYTICS-01, SEO-07

## Task Commits

1. **Task 1: Update BaseLayout.astro — Now nav link, hash-only guard, active-route setter, CF beacon, ogImageSlug forwarding** — `35d7aa0` (feat)
2. **Task 2: Create src/pages/now.astro following UI-SPEC Surface 1 contract** — `c87f713` (feat)

## Files Created/Modified

### Created

- `src/pages/now.astro` — /now route, 60 lines, single h1 + 3 h2 sections + attribution footer, inherits BaseLayout and forwards ogImageSlug="now"

### Modified

- `src/layouts/BaseLayout.astro` — +32 / -8 lines. Extended Props, added 2 nav links (desktop+mobile), replaced scroll click handler with hash-only guard variant, added active-route setter, appended CF beacon with PROD+token double-guard, wired ogImageSlug/ogImageAlt through to Head

## Decisions Made

1. **Now link placement: LAST in each nav block.** Matches UI-SPEC rationale — anchor links form a homepage journey (About→Experience→Projects→Contact); /now is conceptually a separate page and should not interrupt that flow. Aligns with convention on other personal sites that surface "Now" at the tail of the nav.
2. **Active-route setter uses explicit path match, not IntersectionObserver hack.** The existing observer only watches `section[id]`; since `/now` uses `<section aria-label="Now">` with no id, the observer cannot interfere with the `data-active` attribute we set on script load. This is the cleanest, lowest-coupling solution — no new CSS, no changes to the observer.
3. **Fail-closed beacon guard.** Guarding only on `import.meta.env.PROD` would ship a broken `<script data-cf-beacon='{"token": "undefined"}'>` tag if the env var was unset at build time. Adding `&& cfAnalyticsToken` makes the beacon a no-op when the token is missing, allowing builds to succeed in environments that have not yet configured the token (e.g. local prod-mode builds).
4. **Inline style for link underline on the nownownow.com attribution.** UI-SPEC says inline prose links should be colour + underline (discoverable by both). Rather than adding a global `.prose a` CSS rule in this plan, the single attribution link carries inline styles — matches the existing inline-style discipline in the rest of the page frontmatter and keeps this plan's blast radius inside two files.
5. **`rel="noopener noreferrer" target="_blank"` on the attribution link.** Basic external-link hygiene; the UI-SPEC did not explicitly require it but didn't forbid it, and it's inherited best practice.

## Deviations from Plan

None — plan executed exactly as written. Both tasks completed on first pass; both `<automated>` verify commands passed without intervention.

## Issues Encountered

### Pre-existing vitest failures (out of scope — unchanged)

The 15 pre-existing vitest failures documented in `07-01-SUMMARY.md` (`about-section.test.ts`, `cv-section.test.ts`, `design-system.test.ts`, `hero-section.test.ts`, `seo-metadata.test.ts`) are still present and still unrelated to Phase 7. Scope boundary respected — not touched. See `deferred-items.md`.

Phase 7 scope is fully green: `npm test -- --run tests/phase7-*.test.ts` → **29 passed / 0 skipped / 0 failed**.

## User Setup Required

**`PUBLIC_CF_ANALYTICS_TOKEN` should be populated before the next production deploy** to activate the CF Web Analytics beacon. Obtain from `dash.cloudflare.com → Analytics & Logs → Web Analytics → (add/select dragosmacsim.com site) → Snippet tab → copy 32-char hex token → paste into `.env` (for local prod-mode builds) or Cloudflare Pages environment variables (for live deploys)`.

With the token unset, the beacon is omitted entirely (fail-closed). Builds succeed in all environments regardless of token state.

## Next Plan Readiness

Ready for:
- **Plan 07-05 (phase finalisation):** all Phase 7 artifacts are now in place — sitemap, robots.txt, JSON-LD, OG images, /now page, nav plumbing, CF beacon. Plan 07-05 can focus on final verification (Playwright E2E, Lighthouse, Rich Results Test, social card validators).

No blockers. No concerns.

## Self-Check: PASSED

**Files verified on disk:**
- FOUND: `src/layouts/BaseLayout.astro` — contains `href="/now"` x2, `startsWith('#')`, `import.meta.env.PROD`, `PUBLIC_CF_ANALYTICS_TOKEN`, `cloudflareinsights.com/beacon.min.js`, `ogImageSlug`, `window.location.pathname === '/now'`
- FOUND: `src/pages/now.astro` — contains `<h1>`, 3x `<h2>`, `aria-label="Now"`, `class="reveal"`, `LAST_UPDATED = "April 2026"`, `ogImageSlug="now"`, `nownownow.com/about`
- FOUND: `dist/now/index.html` — post-build, contains "What I'm doing now" text and `og:image" content="https://dragosmacsim.com/og/now.png"`

**Commits verified:**
- FOUND: `35d7aa0` (Task 1 — feat 07-03 BaseLayout)
- FOUND: `c87f713` (Task 2 — feat 07-03 now.astro)

**Verify commands exit 0 (Phase 7 scope):**
- `npm test -- --run tests/phase7-nav.test.ts tests/phase7-analytics.test.ts tests/phase7-seo.test.ts tests/phase7-og.test.ts tests/phase7-build.test.ts` → 29 passed / 0 skipped / 0 failed across 5 suites
- `npm run build` → exits 0; emits `dist/now/index.html` alongside `dist/index.html`, `dist/og/home.png`, `dist/og/now.png`

**Acceptance criteria verified:**
- BaseLayout Props contains `ogImageSlug?: string` and `ogImageAlt?: string` — YES
- BaseLayout forwards both props to `<Head>` — YES
- BaseLayout contains `href="/now"` at least 2 times (desktop+mobile) — YES (2 occurrences)
- BaseLayout contains literal `startsWith('#')` — YES
- BaseLayout contains `import.meta.env.PROD` — YES
- BaseLayout contains `PUBLIC_CF_ANALYTICS_TOKEN` — YES
- BaseLayout contains `static.cloudflareinsights.com/beacon.min.js` — YES
- BaseLayout contains `is:inline` on beacon — YES
- BaseLayout contains `defer` on beacon — YES
- BaseLayout contains `data-cf-beacon={\`{"token": "${cfAnalyticsToken}"}\`}` — YES
- BaseLayout contains `window.location.pathname === '/now'` active-route setter — YES
- Existing anchor links (#about, #experience, #projects, #contact) still present in both nav blocks — YES
- `src/pages/now.astro` imports BaseLayout — YES
- now.astro passes `title="What I'm doing now — Dragos Macsim"` — YES
- now.astro passes description with >50 chars — YES
- now.astro passes `ogImageSlug="now"` — YES
- now.astro passes `ogImageAlt="What I'm doing now — Dragos Macsim"` — YES
- now.astro contains exactly one `<h1>` — YES
- now.astro contains 3 `<h2>` (Working on / Learning / Location) — YES
- now.astro contains `<section aria-label="Now"` (no id) — YES
- now.astro contains `class="reveal"` — YES
- now.astro links to `https://nownownow.com/about` — YES
- now.astro uses `LAST_UPDATED = "April 2026"` — YES
- `dist/now/index.html` contains "What I'm doing now" — YES
- `dist/now/index.html` contains `<meta property="og:image" content="https://dragosmacsim.com/og/now.png">` — YES

---
*Phase: 07-discoverability-social-presence-make-the-site-discoverable-a*
*Completed: 2026-04-11*
