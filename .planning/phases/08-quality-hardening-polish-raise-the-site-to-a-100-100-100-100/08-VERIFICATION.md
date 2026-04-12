---
phase: 08-quality-hardening
verified: 2026-04-12T14:20:00Z
status: human_needed
score: 13/13 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Lighthouse CI passes 100/100/100/100 locally"
    expected: "npx lhci autorun --config=lighthouserc.json exits 0 with all four category assertions passing after npm run build"
    why_human: "Requires a headless Chrome process and built dist; cannot run in this verification context without starting a long-lived process"
  - test: "Print preview hides nav and shows black text on white"
    expected: "Browser Print Preview (Cmd+P) on homepage shows: nav hidden, theme toggle hidden, body text black on white, external link URLs shown inline after anchors"
    why_human: "Visual/print-media behavior cannot be verified programmatically"
  - test: "View transition between / and /now is smooth"
    expected: "Clicking the /now nav link produces a cross-fade transition with no full white-flash reload"
    why_human: "Requires a running browser to observe animation behavior"
  - test: "All 6 Playwright smoke tests pass"
    expected: "npx playwright test (after npm run build) reports 6 passed, 0 failed"
    why_human: "Requires starting astro preview server and a Chromium process; cannot execute in this static verification context"
---

# Phase 8: Quality Hardening & Polish — Verification Report

**Phase Goal:** Raise the site to a measurably high-quality production standard: 100/100/100/100 Lighthouse scores enforced by CI, accessibility audit and fixes, E2E smoke tests in GitHub Actions, prefers-reduced-motion support, @media print stylesheet for recruiter printouts, custom branded 404 page, and Astro View Transitions for smooth cross-page navigation.
**Verified:** 2026-04-12T14:20:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting a non-existent URL shows a branded 404 page with a link back to home | VERIFIED | `src/pages/404.astro` exists; renders with `BaseLayout`, heading "Page not found", `aria-label="Page not found"`, `href="/"` back link; builds to `dist/404.html` |
| 2 | Printing the homepage produces clean black-on-white output with nav and toggle hidden and link URLs shown inline | VERIFIED (code) | `@media print` block in `global.css` lines 190–240: hides `nav`, `#theme-toggle`, `#hamburger-btn`, `#mobile-menu`, `.glow-pulse`; resets colours to black on white; `content: " (" attr(href) ")"` on external links; disables all animations. Visual result needs human. |
| 3 | Cross-page navigation between / and /now uses smooth view transitions without full reload | VERIFIED (code) | `BaseLayout.astro` imports `ClientRouter` from `astro:transitions` (line 6), `<ClientRouter />` placed in `<head>` (line 31), `transition:persist` on `<nav>` (line 34). Runtime behavior needs human. |
| 4 | IntersectionObserver for active nav re-initialises after client-side navigation | VERIFIED | `BaseLayout.astro` line 159: `document.addEventListener("astro:page-load", initPage)` — fires on initial load and after each ClientRouter navigation. No direct `initPage()` call avoids double-binding. |
| 5 | lhci-cli and axe-core-playwright are installed as devDependencies | VERIFIED | `package.json` lines 35–36: `"@axe-core/playwright": "^4.11.1"`, `"@lhci/cli": "^0.15.1"` |
| 6 | Playwright smoke test loads homepage and verifies zero critical a11y violations via axe-core | VERIFIED | `tests/phase8-smoke.spec.ts`: imports `AxeBuilder`, test "homepage loads with no critical a11y violations" with `withTags(["wcag2a","wcag2aa"])` filter on critical+serious impact |
| 7 | Playwright smoke test verifies theme toggle changes the HTML class | VERIFIED | Test "theme toggle switches the HTML class" in `phase8-smoke.spec.ts` — clicks `#theme-toggle`, asserts class differs and contains dark/light |
| 8 | Playwright smoke test verifies contact section is reachable by clicking nav | VERIFIED | Test "contact section is reachable via nav click" — clicks `[data-nav-link][href="#contact"]`, asserts `#contact` `toBeInViewport()` |
| 9 | Playwright smoke test verifies CV download link points to a PDF | VERIFIED | Test updated to check `count >= 1` and all `href` match `/\.pdf$/i` — handles two legitimate download links |
| 10 | Playwright smoke test verifies /now page loads and has zero critical a11y violations | VERIFIED | Test "/now page loads with no critical a11y violations" — navigates to `/now`, asserts h1 visible, runs AxeBuilder |
| 11 | Playwright smoke test verifies 404 page renders branded content | VERIFIED | Test "404 page renders branded content" — expects HTTP 404 status, asserts "Page not found" text and `a[href="/"]` visible |
| 12 | GitHub Actions CI runs four parallel jobs on every push to master and every PR | VERIFIED | `.github/workflows/ci.yml`: triggers on `push: branches: [master]` and `pull_request`; four jobs: `build`, `unit-tests`, `e2e`, `lighthouse` |
| 13 | Lighthouse CI asserts 100/100/100/100 on both / and /now | VERIFIED (config) | `lighthouserc.json`: `staticDistDir: "./dist"`, URLs `["/index.html", "/now/index.html"]`, all four categories with `minScore: 1`. Actual score requires human run. |

**Score:** 13/13 truths verified (code-level)

---

### Context Decisions Coverage (D-01 through D-08)

| Decision | Description | Status | Evidence |
|----------|-------------|--------|----------|
| D-01 | Hard gate — Lighthouse CI fails PRs below 100 | VERIFIED | `lighthouserc.json` `minScore: 1` on all four categories |
| D-02 | Audit both `/` and `/now` | VERIFIED | `lighthouserc.json` url array `["/index.html", "/now/index.html"]` |
| D-03 | GitHub Actions as CI provider | VERIFIED | `.github/workflows/ci.yml` exists |
| D-04 | Four checks: build+typecheck, vitest, Playwright E2E, Lighthouse CI | VERIFIED | CI jobs: `build` (npm run build + astro check), `unit-tests` (npm test), `e2e` (playwright test), `lighthouse` (lhci autorun) |
| D-05 | All four checks run as parallel jobs | VERIFIED | `unit-tests` has no `needs:` — runs in parallel with `build`. `e2e` and `lighthouse` both `needs: build` and start together once build completes. |
| D-06 | Print: hide nav/toggle/animations; black text; show link URLs | VERIFIED | `@media print` in `global.css` implements all requirements |
| D-07 | Print scope: full page (Claude's discretion — serves recruiters) | VERIFIED | Full-page print scope chosen; `main { max-width: 100% }` removes width constraint |
| D-08 | 404 tone: minimal branded (Claude's discretion) | VERIFIED | Minimal branded 404 chosen — accent-colored "404", clean "Page not found", "Back to home" |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/404.astro` | Custom branded 404 page using BaseLayout | VERIFIED | Exists, imports BaseLayout, contains `aria-label="Page not found"`, `href="/"`, builds to `dist/404.html` |
| `src/styles/global.css` | Print stylesheet rules | VERIFIED | `@media print` block at line 190, hides nav/toggle, resets colours, disables animations, shows link URLs |
| `src/layouts/BaseLayout.astro` | ClientRouter + astro:page-load event | VERIFIED | ClientRouter imported (line 6), placed in `<head>` (line 31), `astro:page-load` listener (line 159), `transition:persist` on nav (line 34) |
| `package.json` | lhci and axe-core as devDependencies | VERIFIED | `@lhci/cli: ^0.15.1`, `@axe-core/playwright: ^4.11.1` both present |
| `playwright.config.ts` | Playwright config with webServer and scoped testMatch | VERIFIED | `command: "npm run preview"`, `testMatch: ["phase8-smoke.spec.ts"]`, `baseURL: "http://localhost:4321"`, `reuseExistingServer: !process.env.CI`, `reporter: process.env.CI ? "github" : "list"` |
| `tests/phase8-smoke.spec.ts` | 6 E2E smoke tests with axe-core a11y | VERIFIED | 6 `test()` calls confirmed; imports `AxeBuilder`; covers all required scenarios |
| `lighthouserc.json` | Lighthouse CI assertion config | VERIFIED | `staticDistDir`, four category assertions with `minScore: 1`, both URL targets |
| `.github/workflows/ci.yml` | GitHub Actions workflow with 4 jobs | VERIFIED | Four jobs confirmed, correct `needs:` dependencies, Node 22, pinned `@v4` actions |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/pages/404.astro` | `src/layouts/BaseLayout.astro` | `import BaseLayout` | WIRED | `import BaseLayout from "../layouts/BaseLayout.astro"` present and `<BaseLayout>` used in template |
| `src/layouts/BaseLayout.astro` | `astro:transitions` | `ClientRouter import` | WIRED | `import { ClientRouter } from "astro:transitions"` at line 6, `<ClientRouter />` in `<head>` at line 31 |
| `tests/phase8-smoke.spec.ts` | `@axe-core/playwright` | `import AxeBuilder` | WIRED | `import AxeBuilder from "@axe-core/playwright"` at line 2, used in two test cases |
| `playwright.config.ts` | `npm run preview` | `webServer.command` | WIRED | `command: "npm run preview"` at line 4 |
| `.github/workflows/ci.yml` | `lighthouserc.json` | `configPath reference` | WIRED | `npx lhci autorun --config=lighthouserc.json` in lighthouse job |
| `.github/workflows/ci.yml` | `tests/phase8-smoke.spec.ts` | `playwright test command` | WIRED | `npx playwright test` in e2e job; `playwright.config.ts` `testMatch` scopes to `phase8-smoke.spec.ts` |

---

### Data-Flow Trace (Level 4)

Not applicable — this phase produces configuration files, test infrastructure, and CSS/layout primitives. No data-rendering artifacts with dynamic data sources.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build compiles without errors | `npm run build` | "3 page(s) built in 1.18s" — Complete! | PASS |
| dist/404.html exists after build | `ls dist/404.html` | File present | PASS |
| dist/now/index.html exists after build | `ls dist/now/index.html` | File present | PASS |
| 6 smoke tests defined | `grep -c "test(" tests/phase8-smoke.spec.ts` | 6 | PASS |
| Smoke spec scoped in playwright.config.ts | `grep testMatch playwright.config.ts` | `testMatch: ["phase8-smoke.spec.ts"]` | PASS |
| lhci autorun (requires server/headless Chrome) | N/A | Cannot run in static verification | SKIP — human |
| Playwright tests pass (requires preview server) | N/A | Cannot run without starting server | SKIP — human |

---

### Requirements Coverage

Note: The plan frontmatter uses phase-local IDs (QH-01 through QH-08) that are not defined in REQUIREMENTS.md. REQUIREMENTS.md contains no QH-prefixed entries. These IDs are internal plan identifiers — not tracked in the project requirements register. The phase 8 scope is defined by ROADMAP.md and CONTEXT.md decisions D-01 through D-08, all of which are accounted for above.

No REQUIREMENTS.md entries are mapped to Phase 8 in the traceability table — this is consistent with the requirements file which shows Phase 8 was not listed at the time of requirements definition.

---

### Anti-Patterns Found

No TODO/FIXME/placeholder patterns found in any phase 8 artifacts. No stub implementations detected. No hardcoded empty data arrays or empty return values in production code paths.

---

### Human Verification Required

#### 1. Lighthouse CI 100/100/100/100

**Test:** After `npm run build`, run `npx lhci autorun --config=lighthouserc.json`
**Expected:** All four categories pass the `minScore: 1` (100%) assertion on both `/index.html` and `/now/index.html`. Exit code 0.
**Why human:** Requires headless Chrome process and built dist artifacts — cannot execute in static verification context.

#### 2. Print Stylesheet Visual Check

**Test:** Open homepage in browser, use Print Preview (Cmd+P on macOS)
**Expected:** Nav bar hidden, theme toggle hidden, hamburger hidden, body text is black on white background, external link hrefs appear in parentheses after the anchor text, all CV content visible
**Why human:** @media print behavior is a visual/print-media concern that cannot be verified programmatically.

#### 3. View Transitions Smoothness

**Test:** Run `npm run dev` or `npm run preview`, navigate from `http://localhost:4321/` to the /now link in the nav
**Expected:** Smooth cross-fade transition — no white flash, no full page reload, nav bar persists without flickering
**Why human:** Requires a running browser to observe animation behavior.

#### 4. All 6 Playwright Smoke Tests Pass

**Test:** After `npm run build`, run `npx playwright test`
**Expected:** Output shows "6 passed" (or equivalent), 0 failed, covering: homepage a11y, theme toggle, contact scroll, CV download, /now a11y, 404 branded page
**Why human:** Requires starting `astro preview` server and a Chromium process — cannot execute in this verification context.

---

### Gaps Summary

No gaps found. All must-haves are implemented and wired. The four human verification items above are observational checks (visual behavior, animation quality, test runner output) that cannot be confirmed programmatically. Automated code-level checks confirm all implementation is complete and substantive.

---

_Verified: 2026-04-12T14:20:00Z_
_Verifier: Claude (gsd-verifier)_
