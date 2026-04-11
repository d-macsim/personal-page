---
phase: 07-discoverability-social-presence
plan: 05
subsystem: finalisation
tags: [homepage, og-image-wiring, integration-gate, vitest, playwright, uat, phase-finalisation]

# Dependency graph
requires:
  - phase: 07-discoverability-social-presence
    provides: Plan 07-02 Head.astro ogImageSlug prop wiring (the slot that 05 now fills with "home")
  - phase: 07-discoverability-social-presence
    provides: Plan 07-03 BaseLayout Props + forwarding for ogImageSlug/ogImageAlt (the conduit 05 uses)
  - phase: 07-discoverability-social-presence
    provides: Plan 07-04 dist/og/home.png artifact (the PNG that home.png meta URLs resolve to)
provides:
  - "src/pages/index.astro wired to the per-page OG image pipeline via ogImageSlug='home' + explicit description + ogImageAlt"
  - "Full Phase 7 integration gate (build + vitest + playwright) verified green end-to-end"
  - "Phase 7 ready for /gsd-verify-work and phase-end commit"
affects:
  - "Phase 7 ROADMAP row — final plan completes the Discoverability & Social Presence phase"
  - "Social card renderers (LinkedIn, Twitter, Facebook) — homepage will now surface the branded /og/home.png card"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-page OG wiring at the page level: pages pass ogImageSlug to BaseLayout → Head.astro resolves /og/<slug>.png (absolute). Homepage now follows the same contract /now already uses."
    - "Explicit meta at the page level: passing description explicitly from index.astro makes the homepage immune to future default-description drift in Head.astro."

key-files:
  created:
    - ".planning/phases/07-discoverability-social-presence-make-the-site-discoverable-a/07-05-SUMMARY.md"
  modified:
    - "src/pages/index.astro"

key-decisions:
  - "[Phase 07-05]: Homepage passes an explicit description that matches the current Head.astro default verbatim — zero output diff in Phase 7, but decouples the homepage from any future default change without requiring a second touch on index.astro."
  - "[Phase 07-05]: ogImageAlt locked to 'Dragos Macsim - AI Specialist & Product Builder' (hyphen, not em dash) per the plan's verbatim snippet — matches UI-SPEC homepage OG subtitle and serves as accessible alt for the social card."
  - "[Phase 07-05]: Auto-approved the human-verify checkpoint inline because auto-chain mode is active — the user will run /gsd-verify-work 7 at phase end and the gsd-verify-work pass will collect any visual regressions."
  - "[Phase 07-05]: Playwright smoke ran against `npm run preview` (prod build) rather than `npm run dev` to exercise the PROD-guarded CF beacon branch. No .env token present → beacon correctly absent (fail-closed, matches Plan 03 design)."

requirements-completed:
  - "SEO-05"
  - "SEO-07"
  - "OG-06"

# Metrics
duration: ~101s
completed: 2026-04-11
---

# Phase 07 Plan 05: Final Integration & UAT Summary

**Wired the homepage to pass ogImageSlug='home' + explicit description + ogImageAlt to BaseLayout, then ran the full Phase 7 gate (build + vitest + playwright) green end-to-end — Phase 7 is ready for verification and phase-end commit.**

## Performance

- **Duration:** ~101s (1775927199 → 1775927300)
- **Started:** 2026-04-11T17:06:39Z
- **Completed:** 2026-04-11T17:08:20Z
- **Tasks:** 2 / 2
- **Files created:** 1 (this SUMMARY.md)
- **Files modified:** 1 (`src/pages/index.astro`)

## Accomplishments

- `src/pages/index.astro` passes 4 explicit props to BaseLayout: `title`, `description`, `ogImageSlug="home"`, `ogImageAlt="Dragos Macsim - AI Specialist & Product Builder"`
- Title preserved verbatim as `"Dragos Macsim -- AI Data Specialist"` (two hyphens) to keep existing SEO assertions green
- Five child components (HeroSection, AboutSection, CVSection, ProjectsSection, ContactSection) and closing tag unchanged
- `dist/index.html` now contains `<meta property="og:image" content="https://dragosmacsim.com/og/home.png">` and `<meta property="og:image:alt" content="Dragos Macsim - AI Specialist &#38; Product Builder">`
- `dist/now/index.html` (from Plan 07-03) still correctly references `/og/now.png` with `og:image:alt="What I'm doing now — Dragos Macsim"`
- Full Phase 7 vitest sweep: **29 passed / 0 skipped / 0 failed** across 5 suites (phase7-nav, phase7-analytics, phase7-seo, phase7-og, phase7-build)
- Playwright smoke: **3 / 3 passed** in 1.4s against `npm run preview` (NOW-01 /now h1, OG-05 /og/home.png 200+PNG, OG-05 /og/unknown.png 404)
- Build artifacts verified on disk: `dist/robots.txt` (4 lines + directive), `dist/sitemap-index.xml`, `dist/sitemap-0.xml` (lists `/` and `/now/`), `dist/og/home.png` (27,658 bytes, PNG), `dist/og/now.png` (25,249 bytes, PNG)
- PNG magic bytes confirmed on both OG artifacts: `89 50 4E 47 0D 0A 1A 0A` (valid PNG signature)
- CF beacon correctly absent from `dist/index.html` + `dist/now/index.html` because no `.env` defines `PUBLIC_CF_ANALYTICS_TOKEN` — the `import.meta.env.PROD && cfAnalyticsToken` double-guard from Plan 07-03 is exercising its fail-closed branch as designed

## Task Commits

1. **Task 1: Wire index.astro to use ogImageSlug='home' and explicit description** — `ee6631f` (feat)
2. **Task 2: Full integration gate + auto-approved UAT + SUMMARY** — pending (this commit contains the SUMMARY.md)

## Files Created/Modified

### Created

- `.planning/phases/07-discoverability-social-presence-make-the-site-discoverable-a/07-05-SUMMARY.md` — this file

### Modified

- `src/pages/index.astro` — +5 / -1 lines. Replaced the single-line `<BaseLayout title="...">` opener with a multi-line block passing `title`, `description`, `ogImageSlug="home"`, and `ogImageAlt`. No other lines touched.

## Decisions Made

1. **Pass description explicitly even though it matches the default.** Head.astro line 17 declares the same string as a default for `description`. Passing it explicitly from index.astro is a no-op on the emitted HTML today, but it locks the homepage's copy contract locally — any future edit to the Head.astro default (say, to change the /now default) will not silently affect the homepage. This is a cheap idempotency hedge.
2. **Use hyphen (-) not em dash (—) in ogImageAlt.** The plan's verbatim snippet uses ASCII hyphen. The OG image itself is rendered by Satori at build time, not from this alt string — the alt string is only read by screen readers parsing meta tags. ASCII hyphen is universally copyable and matches the plan snippet exactly.
3. **Preserve title as "Dragos Macsim -- AI Data Specialist" (two hyphens).** This is the historical value that existing `tests/seo-metadata.test.ts` asserts on. Changing it to `—` would break the pre-existing failing suite further. Out of scope for Plan 07-05.
4. **Auto-approve UAT checkpoint inline.** Auto-chain mode is active per the orchestrator's `--auto` flag. The plan's Task 2 is type `checkpoint:human-verify` which would normally stop and wait — auto-chain converts this to an inline approval so the phase can progress. All 10 visual checks in the plan's `<how-to-verify>` list are delegated to the phase-end `/gsd-verify-work 7` pass, which the user runs after the entire phase auto-completes.
5. **Playwright smoke against preview, not dev.** The plan's verify command starts `npm run preview` specifically so that `import.meta.env.PROD` evaluates to `true` and the CF beacon code path is exercised. This is the only way to test the PROD guard in the beacon injection — dev mode would always skip the beacon and pass trivially. The smoke passed, and the beacon was correctly omitted (no token configured in .env).

## Deviations from Plan

None — plan executed exactly as written. Task 1's `<automated>` verify block executed the edit, build, dist checks, and vitest sweep without intervention. Playwright smoke ran against preview and passed on first attempt.

## Auto-Approved UAT Checklist (Deferred to `/gsd-verify-work 7`)

The human-verify checkpoint was auto-approved per auto-chain mode. The following 10 items are delegated to the phase-end verification pass — the user can eyeball them at `npm run preview` or post-deploy:

| # | Check | Automated Evidence |
|---|-------|--------------------|
| 1 | Homepage unchanged (regression) | Playwright didn't test this; relies on phase-end human review |
| 2 | Now nav link appears as 5th desktop link | BaseLayout.astro verified in Plan 07-03 |
| 3 | `/now` page renders with h1 + 3 h2 sections | Playwright NOW-01 PASS + Plan 07-03 dist assertions |
| 4 | Now nav link appears in mobile menu | BaseLayout.astro verified in Plan 07-03 |
| 5 | `/og/home.png` and `/og/now.png` render branded 1200×630 | PNG files on disk, valid magic bytes, Playwright OG-05 PASS |
| 6 | Meta tags in view-source (og:image, og:image:alt, JSON-LD) | Grepped from dist/ — all present |
| 7 | robots.txt + sitemap-index.xml + sitemap-0.xml | All on disk, sitemap-0.xml references `/` and `/now/` |
| 8 | CF beacon absent in dev | Verified in dist/index.html (no cloudflareinsights substring) |
| 9 | CF beacon present in prod (with token) | Deferred — requires `PUBLIC_CF_ANALYTICS_TOKEN` in `.env`, which user will set before deploy |
| 10 | LinkedIn Post Inspector preview | Deferred — requires post-deploy check against live domain |

**Items 1, 9, 10 are strictly user-domain checks** — automated tooling cannot perform a visual regression check on a rendered page, cannot synthesise a real CF token, and cannot crawl linkedin.com from a test runner. These are the correct items to leave for UAT.

## Full Phase 7 Gate Results

### Build

```
npm run build
  → exits 0
  → sitemap-index.xml created
  → /og/home.png + /og/now.png generated via Satori
  → dist/index.html + dist/now/index.html emitted
```

### Vitest (Phase 7 scope)

```
npm test -- --run tests/phase7-seo.test.ts tests/phase7-nav.test.ts \
                  tests/phase7-analytics.test.ts tests/phase7-og.test.ts \
                  tests/phase7-build.test.ts

Test Files  5 passed (5)
Tests       29 passed (29)
Duration    89ms
```

### Vitest (Full sweep)

```
npm test -- --run

Test Files  5 failed | 8 passed (13)
Tests       14 failed | 232 passed (246)
```

The 14 failing tests are in `about-section.test.ts`, `cv-section.test.ts`, `design-system.test.ts`, `hero-section.test.ts`, and `seo-metadata.test.ts`. These are pre-existing failures introduced by content-update commits `accd33e` and `5f654d0`, and are documented in `deferred-items.md`. Scope boundary respected — no Phase 7 work touches these files. The count dropped from 15 (Plan 07-01) to 14 (Plan 07-05) — one test coincidentally became green as an unrelated side effect of some earlier Phase 7 edit. No Phase 7 regression.

### Playwright

```
preview server:  http://localhost:4321 (prod dist/)

npx playwright test tests/phase7.spec.ts --reporter=line

[1/3] NOW-01 /now page renders h1           → PASS
[2/3] OG-05 /og/home.png endpoint serves PNG → PASS
[3/3] OG-05 /og/unknown.png rejected (T-7-06) → PASS

3 passed (1.4s)
```

## Issues Encountered

None. Plan executed cleanly on first pass.

### Pre-existing (unchanged, out of scope)

The 14 pre-existing vitest failures in non-Phase-7 suites remain — they are content-drift fallout from earlier commits and are tracked in `.planning/phases/07-discoverability-social-presence-make-the-site-discoverable-a/deferred-items.md`. Phase 7's scope boundary explicitly excludes them; they are queued for Phase 8 (Quality Hardening).

## Threat Model Verification

| Threat ID | Mitigation | Status |
|-----------|------------|--------|
| T-7-01 | Homepage meta strings are hand-authored literals in index.astro; Astro auto-escapes `{expr}` in attributes | VERIFIED — `Product Builder` rendered as `Product &#38; Builder` in dist/index.html (Astro's default HTML-entity escaping of `&`) |
| T-7-06 | Slug `"home"` is in Plan 04's `PAGES` allowlist; verified by phase7-og.test.ts and Playwright's 404-on-unknown assertion | VERIFIED — Playwright OG-05 unknown-slug test PASS |

## User Setup Required

**None for Plan 07-05.** The plan edited one file and ran verification — all artifacts are already committed. For the next deploy cycle:

- **`PUBLIC_CF_ANALYTICS_TOKEN` should be populated in Cloudflare Pages env vars before next deploy** (or local `.env` for prod-mode smoke testing). Without it, the beacon is omitted from the build (fail-closed, correct per Plan 03). This is a pre-existing Phase 7 setup item, not new to Plan 05.
- **`/now` page content strings (UI-SPEC line 353 placeholder)** are editorial and outside the scope of any Phase 7 plan. The user will update `src/pages/now.astro` monthly or as content evolves.

## Next Phase Readiness

Phase 7 is complete. Next steps owned by the orchestrator:

- `/gsd-verify-work 7` — confirms the 10-item UAT checklist automatically where possible, and flags anything the human needs to eyeball
- Phase-end commit of `STATE.md` + `ROADMAP.md` updates (this plan intentionally did NOT touch those — orchestrator owns them)
- Transition to Phase 8 (Quality Hardening & Polish), which will pick up the 14 pre-existing vitest failures as part of its explicit scope

No blockers. No concerns.

## Known Stubs

None. All Phase 7 surfaces are wired to real data:
- Homepage og:image → real PNG at `dist/og/home.png` (27,658 bytes)
- /now og:image → real PNG at `dist/og/now.png` (25,249 bytes)
- /now page content → hand-authored placeholder in `src/pages/now.astro` (marked as editorial content per UI-SPEC, not a stub in the technical sense — it's the actual content that will ship)
- CF beacon → correctly absent when no token is set (fail-closed), correctly present when token is set (verified by Plan 07-03's unit tests)

## Self-Check: PASSED

**Files verified on disk:**
- FOUND: `src/pages/index.astro` — contains `ogImageSlug="home"`, `description="Dragos Macsim - AI data specialist`, `ogImageAlt="Dragos Macsim - AI Specialist & Product Builder"`, preserved title `Dragos Macsim -- AI Data Specialist`, all 5 child components
- FOUND: `dist/index.html` (38,285 bytes) — contains `og:image" content="https://dragosmacsim.com/og/home.png"`
- FOUND: `dist/now/index.html` (11,777 bytes) — contains `og:image" content="https://dragosmacsim.com/og/now.png"`
- FOUND: `dist/og/home.png` (27,658 bytes, PNG magic `89 50 4E 47`)
- FOUND: `dist/og/now.png` (25,249 bytes, PNG magic `89 50 4E 47`)
- FOUND: `dist/robots.txt` (76 bytes, User-agent + Allow + Sitemap)
- FOUND: `dist/sitemap-index.xml` (187 bytes, references sitemap-0.xml)
- FOUND: `dist/sitemap-0.xml` (432 bytes, references `https://dragosmacsim.com/` and `https://dragosmacsim.com/now/`)

**Commits verified:**
- FOUND: `ee6631f` (Task 1 — feat 07-05: wire homepage ogImageSlug to home)

**Verify commands exit 0 (Phase 7 scope):**
- `npm run build` → exits 0, emits all expected artifacts
- `npm test -- --run tests/phase7-*.test.ts` → 29 passed / 0 skipped / 0 failed across 5 suites
- `npx playwright test tests/phase7.spec.ts` → 3 / 3 passed against `npm run preview`

**Acceptance criteria verified:**
- `src/pages/index.astro` contains `ogImageSlug="home"` — YES
- `src/pages/index.astro` contains explicit `description=` prop — YES
- `src/pages/index.astro` contains `ogImageAlt=` prop — YES
- All 5 child components still present — YES
- Title unchanged — YES
- `npm run build` exits 0 — YES
- `dist/index.html` has `og:image → https://dragosmacsim.com/og/home.png` — YES
- `dist/now/index.html` has `og:image → https://dragosmacsim.com/og/now.png` — YES
- Both OG PNGs exist, >5KB, valid PNGs — YES (27,658 and 25,249 bytes, magic `89504E47`)
- `dist/robots.txt` and `dist/sitemap-index.xml` exist — YES
- `dist/sitemap-0.xml` references both `/` and `/now/` — YES
- Full Phase 7 vitest sweep exits 0 — YES (29 passed)
- Playwright Phase 7 smoke passes against preview — YES (3 / 3 passed)

---
*Phase: 07-discoverability-social-presence-make-the-site-discoverable-a*
*Completed: 2026-04-11*
