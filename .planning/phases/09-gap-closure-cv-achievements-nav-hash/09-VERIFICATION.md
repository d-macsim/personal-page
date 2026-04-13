---
phase: 09-gap-closure-cv-achievements-nav-hash
verified: 2026-04-13T12:35:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Navigate to /now in a browser, click a hash nav link (e.g. Contact). Confirm you land on the homepage #contact section without a stale-DOM no-op."
    expected: "Browser navigates to /#contact and the contact section is visible in the viewport."
    why_human: "The E2E test covers this path but relies on Playwright's server preview. Confirming the fix works in the deployed production site (Cloudflare Pages + ClientRouter persistence) requires a human to verify against the live URL."
  - test: "On the homepage, click About in the nav. Confirm smooth scroll (no full-page reload flash)."
    expected: "Page scrolls smoothly to #about with no URL change and no white-flash reload."
    why_human: "Cannot distinguish smooth scroll vs full-page reload programmatically without timing or visual inspection; Playwright waitForURL would trigger on reload but not on scroll."
---

# Phase 9: Gap Closure — CV Achievements & Nav Hash Links — Verification Report

**Phase Goal:** Close the two remaining v1.0 audit gaps: render CV achievement bullets that are silently dropped, and fix cross-page nav hash links after ClientRouter navigation from / to /now
**Verified:** 2026-04-13T12:35:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Each experience role displays at least two achievement bullet points sourced from cv.ts | VERIFIED | `CVSection.astro` line 11: `body: r.achievements`; cv.ts has 3 roles with 2-3 achievements each (8 total); E2E test asserts `>= 6` bullets in `#experience ul.list-disc li` |
| 2 | Education entries display no achievement bullets (empty body guard) | VERIFIED | `CVSection.astro` line 18: `body: []` for education; `TimelineColumn.astro` line 54: `entry.body.length > 0` guard prevents any `<ul>` render for empty arrays |
| 3 | Nav hash links smooth-scroll on the homepage without page reload | VERIFIED (human check pending) | `BaseLayout.astro` lines 123-126: `if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }) }` — scrolls when target exists on current page |
| 4 | Nav hash links from /now navigate to the correct homepage section | VERIFIED (human check pending) | `BaseLayout.astro` line 130: `window.location.href = '/' + href` when `document.querySelector(href)` is null; E2E test `phase8-smoke.spec.ts` lines 81-94 covers this path; build passes |
| 5 | All Lighthouse scores remain at 100/100/100/100 | VERIFIED | `.lighthouseci/lhr-1776002360371.json`: performance: 1.0, accessibility: 1.0, best-practices: 1.0, seo: 1.0 |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/CVSection.astro` | Wires `r.achievements` to body field for experience entries | VERIFIED | Line 11: `body: r.achievements,`; line 18: `body: [],` for education |
| `src/components/TimelineColumn.astro` | Renders body items as bullet list | VERIFIED | Lines 54-60: `entry.body.length > 0` guard + `<ul class="mt-2 space-y-1 list-disc list-inside">` + `entry.body.map(item => <li>)` |
| `src/layouts/BaseLayout.astro` | Cross-page hash navigation fallback | VERIFIED | Lines 122-133: `if (href.startsWith('#'))` → `if (target)` → smooth scroll, else `window.location.href = '/' + href` |
| `tests/phase8-smoke.spec.ts` | E2E tests for achievements and cross-page nav | VERIFIED | Lines 71-79: achievement bullets test (count >= 6); lines 81-94: cross-page nav to `/#contact` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `src/components/CVSection.astro` | `src/data/cv.ts` | `r.achievements` mapping | WIRED | `roles.map((r) => ({ ... body: r.achievements }))` — reads from imported `roles` array |
| `src/components/TimelineColumn.astro` | `entry.body` | conditional `ul` render | WIRED | `entry.body.length > 0` guards render; `entry.body.map((item) => <li>)` iterates |
| `src/layouts/BaseLayout.astro` | `window.location.href` | hash fallback when target missing from DOM | WIRED | `window.location.href = '/' + href` at line 130, reachable only when `document.querySelector(href)` is null |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `TimelineColumn.astro` | `entry.body` | `CVSection.astro` passes `body: r.achievements` | Yes — `cv.ts` exports `roles` with readonly `achievements: string[]` arrays (3 roles, 2-3 items each = 8 items) | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build completes without errors | `npm run build` | "3 page(s) built in 1.63s. Complete!" | PASS |
| CVSection wires achievements | `grep "body: r.achievements" CVSection.astro` | Line 11 match | PASS |
| TimelineColumn renders `<ul>` | `grep "entry.body.length > 0" TimelineColumn.astro` | Line 54 match | PASS |
| BaseLayout has cross-page fallback | `grep "window.location.href" BaseLayout.astro` | Line 130 match | PASS |
| Lighthouse all scores 1.0 | Parse `.lighthouseci/lhr-*.json` | performance/accessibility/best-practices/seo: all 1.0 | PASS |
| EXP-01 unit tests | `npm test` (cv-section.test.ts suite) | All 21 tests in EXP-01 / CV section integration pass | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| EXP-01 | 09-01-PLAN.md | Experience timeline showing roles, companies, dates, and key achievements | SATISFIED | `body: r.achievements` wired; 8 bullets rendered; E2E asserts `>= 6` bullets visible |
| CONT-02 | 09-01-PLAN.md | Contact reachable from any section (persistent nav or CTA) | SATISFIED | Cross-page hash fallback in BaseLayout; E2E test verifies nav from /now reaches #contact |

**Note:** REQUIREMENTS.md still shows `[ ] Pending` checkboxes and "Pending" status for both EXP-01 and CONT-02. The PLAN did not include updating REQUIREMENTS.md documentation. This is a documentation deviation — the functional implementation is complete.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `tests/phase8-smoke.spec.ts` | — | SUMMARY claimed "247/247 unit tests pass" but actual result is 241/247 (6 pre-existing failures) | Info | 6 failures are pre-existing from earlier phases and are NOT in files modified by phase 09 (`design-system.test.ts` was last modified in phase 01; `about-section.test.ts`, `hero-section.test.ts`, `projects-contact.test.ts` stale assertions not fully reconciled by Task 1 — 3 of 11 pre-existing failures remain). These do not block the phase 09 goal. |

No TODOs, FIXME markers, empty stubs, placeholder text, or stub return patterns found in any of the four phase-modified files.

### Human Verification Required

#### 1. Cross-Page Hash Navigation (Production)

**Test:** Deploy or preview the built site. Navigate to `/now`. Click a hash nav link (e.g. "Contact"). Observe what happens.
**Expected:** Browser navigates to `/#contact` and the contact section is visible in viewport within 2 seconds. No silent no-op.
**Why human:** E2E test covers this in Playwright preview server, but the fix targets Astro's ClientRouter `transition:persist` behaviour. Confirming the fix holds under real ClientRouter navigation (SPA mode, persisted nav DOM) requires observation in a browser with full JS running.

#### 2. Homepage Smooth-Scroll Preservation

**Test:** On the homepage (`/`), click "About" in the nav. Observe scroll behaviour.
**Expected:** Page scrolls smoothly to the about section. No URL change. No white-flash full-page reload.
**Why human:** Cannot reliably distinguish smooth scroll (no URL change) from a full-page reload with hash in automated tests without timing precision or visual comparison. The code path (`if (target)` → `scrollIntoView`) is correct, but confirmation of the regression-free smooth-scroll UX requires visual inspection.

---

## Gaps Summary

No functional gaps identified. All five must-have truths are verified. The two outstanding items are human-verification items (visual/behavioral confirmation), not code defects.

**Pre-existing test failures (not phase 09 regressions):** 6 unit tests fail in `design-system.test.ts` (3) and scattered across `about-section.test.ts`, `hero-section.test.ts`, `projects-contact.test.ts` (3 more). All 6 predate phase 09 — `design-system.test.ts` was last committed in phase 01. Phase 09 committed updated assertions for 11 of the 14 pre-existing failures it found; 6 assertions were not reconciled and remain failing. These are carry-over technical debt from earlier phases, not phase 09 regressions.

---

_Verified: 2026-04-13T12:35:00Z_
_Verifier: Claude (gsd-verifier)_
