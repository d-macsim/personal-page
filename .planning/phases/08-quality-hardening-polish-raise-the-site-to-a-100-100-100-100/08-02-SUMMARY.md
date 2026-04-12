---
phase: 08-quality-hardening
plan: 02
subsystem: testing
tags: [playwright, axe-core, a11y, e2e, smoke-test]
dependency_graph:
  requires: []
  provides: [phase8-smoke-suite, playwright-config, 404-page]
  affects: [ci-pipeline]
tech_stack:
  added: ["@axe-core/playwright@4.11.1"]
  patterns: [playwright-webserver, axe-core-a11y-audit, e2e-smoke-suite]
key_files:
  created:
    - playwright.config.ts
    - tests/phase8-smoke.spec.ts
    - src/pages/404.astro
  modified:
    - src/components/ProjectCard.astro
    - package.json
decisions:
  - testMatch scoped to phase8-smoke.spec.ts to prevent live-site specs running in CI
  - A11y filter to critical+serious impact only — prevents flake on minor/moderate violations
  - CV download test checks all a[download] links point to .pdf (2 links exist legitimately)
  - 404.astro created in this plan as prerequisite for smoke test (plan 01 runs in same wave)
  - ProjectCard placeholder div given role=img to fix WCAG aria-prohibited-attr violation
metrics:
  duration: ~8min
  completed: 2026-04-12
  tasks_completed: 2
  files_changed: 5
---

# Phase 08 Plan 02: Playwright E2E Smoke Suite Summary

Playwright config and 6-test smoke suite with axe-core WCAG 2.1 AA accessibility audit covering homepage, theme toggle, contact scroll, CV download, /now page, and 404.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create playwright.config.ts with webServer and scoped testMatch | 996f552 | playwright.config.ts, package.json |
| 2 | Create E2E smoke test with axe-core accessibility audit | 4b9c12e | tests/phase8-smoke.spec.ts, src/pages/404.astro, src/components/ProjectCard.astro |

## What Was Built

- **`playwright.config.ts`** — Playwright configuration with `webServer` auto-starting `npm run preview`, `testMatch` scoped to `phase8-smoke.spec.ts` only (prevents live-site specs running in CI), GitHub reporter in CI, retry on CI.
- **`tests/phase8-smoke.spec.ts`** — 6 E2E smoke tests: homepage a11y audit (WCAG 2.1 AA), theme toggle class change, contact section scroll-into-view, CV download PDF link validation, /now page a11y audit, 404 branded page.
- **`src/pages/404.astro`** — Branded 404 page with "Page not found" heading and back-to-home link, using BaseLayout.

## Test Results

All 6 smoke tests pass:
1. homepage loads with no critical a11y violations — PASS
2. theme toggle switches the HTML class — PASS
3. contact section is reachable via nav click — PASS
4. CV download link is present and points to a PDF — PASS
5. /now page loads with no critical a11y violations — PASS
6. 404 page renders branded content — PASS

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed WCAG aria-prohibited-attr violation in ProjectCard**
- **Found during:** Task 2 verification (a11y test failure)
- **Issue:** `<div aria-label="...">` without a valid `role` attribute is prohibited by WCAG 4.1.2. The placeholder project image container and the mytai wrapper div both had this issue.
- **Fix:** Added `role="img"` to placeholder div; removed redundant `aria-label` from mytai wrapper (child `<img>` already has `alt`).
- **Files modified:** `src/components/ProjectCard.astro`
- **Commit:** 4b9c12e

**2. [Rule 1 - Bug] Fixed CV download test — 2 download links exist**
- **Found during:** Task 2 verification
- **Issue:** Test assumed exactly 1 `a[download]` link, but both HeroSection and CVDownloadButton have download links (both correct by design).
- **Fix:** Updated test to check `count >= 1` and verify all download hrefs match `.pdf`.
- **Files modified:** `tests/phase8-smoke.spec.ts`
- **Commit:** 4b9c12e

**3. [Rule 2 - Missing critical functionality] Created 404.astro ahead of plan 01**
- **Found during:** Task 2 (404 test requires 404.astro to exist)
- **Issue:** Plans 01 and 02 run in the same wave (parallel). Plan 02's 404 test requires `src/pages/404.astro` which plan 01 creates. To make the smoke suite self-contained, 404.astro was created in this plan.
- **Fix:** Created minimal branded `404.astro` with BaseLayout, "Page not found" heading, and back-to-home link.
- **Files modified:** `src/pages/404.astro`
- **Commit:** 4b9c12e

## Known Stubs

None — all tests exercise real production functionality.

## Threat Flags

None — tests run against localhost preview, no new network surface introduced.

## Self-Check: PASSED

- playwright.config.ts: FOUND
- tests/phase8-smoke.spec.ts: FOUND
- src/pages/404.astro: FOUND
- Commit 996f552: FOUND
- Commit 4b9c12e: FOUND
- All 6 tests: PASS
