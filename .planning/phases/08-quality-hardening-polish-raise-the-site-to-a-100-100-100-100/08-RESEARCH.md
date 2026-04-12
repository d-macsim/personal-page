# Phase 8: Quality Hardening & Polish — Research

**Researched:** 2026-04-12
**Domain:** Lighthouse CI, Accessibility (axe-core + Playwright), GitHub Actions, CSS print stylesheet, Astro ViewTransitions, Custom 404
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Hard gate — Lighthouse CI in GitHub Actions; PRs fail if any category (Performance, Accessibility, Best Practices, SEO) drops below 100
- **D-02:** Audit both `/` and `/now` pages
- **D-03:** GitHub Actions as CI provider
- **D-04:** Four checks run on every push/PR: build+typecheck, vitest unit tests, Playwright E2E smoke, Lighthouse CI
- **D-05:** All four checks run as parallel jobs (not sequential fail-fast)
- **D-06:** Print stylesheet: hide nav, theme toggle, animations; black text on white; show link URLs inline after anchors; all CV content visible

### Claude's Discretion
- Print scope: full page vs CV-only (D-07)
- 404 design tone: minimal branded vs playful (D-08)
- Accessibility audit tool choice (axe-core, Pa11y, or Lighthouse a11y alone)
- View Transitions implementation details
- E2E smoke test exact scenarios (must cover: load /, toggle theme, scroll to contact, trigger CV download)
- Exact Lighthouse CI tool (lhci, unlighthouse, or direct CLI)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 8 wraps the site in a production-quality harness: CI enforcement via GitHub Actions, measurable Lighthouse 100/100/100/100 scores, accessibility audit integrated into the E2E test suite via `@axe-core/playwright`, a print stylesheet for recruiter PDFs, Astro `ClientRouter` for smooth page transitions, and a branded 404 page.

The project already has the foundational test infrastructure in place: Vitest (unit), `@playwright/test` 1.59.1 (E2E), and `@astrojs/check` for TypeScript. No new test framework is needed — only new config files and test files. The `prefers-reduced-motion` accommodation is already implemented in `global.css` (CSS scroll-reveal) and `HeroSection.tsx` (`useReducedMotion`). The `ClientRouter` addition to `BaseLayout.astro` is the only framework code change required for view transitions.

**Primary recommendation:** Use `@lhci/cli` 0.15.1 + `treosh/lighthouse-ci-action@v12` for Lighthouse CI (static-dist mode against the `dist/` build), `@axe-core/playwright` 4.11.1 integrated into the Playwright smoke test, and a single `.github/workflows/ci.yml` with four parallel jobs.

---

## Standard Stack

### Core (CI & Quality)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@lhci/cli` | 0.15.1 | Lighthouse CI assertions | Google's official CLI; integrates with `treosh/lighthouse-ci-action@v12`; supports `staticDistDir` for Astro `dist/` folder; assertion config via `lighthouserc.json` |
| `treosh/lighthouse-ci-action` | v12 | GitHub Actions step for lhci | Wraps `@lhci/cli`; supports `configPath` for `.lighthouserc.json`; can serve a static dist and audit without a live server |
| `@axe-core/playwright` | 4.11.1 | Programmatic a11y audit in Playwright | Official Deque package; integrates into existing Playwright test suite without a separate tool; catches colour contrast, alt text, ARIA violations |

### Already Installed (no new installs needed)
| Library | Version | Purpose |
|---------|---------|---------|
| `@playwright/test` | 1.59.1 | E2E test runner — already in devDependencies |
| `vitest` | 4.1.4 | Unit test runner — already in devDependencies |
| `@astrojs/check` | 0.9.8 | TypeScript check — already in devDependencies |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@lhci/cli` static-dist | `unlighthouse` | Unlighthouse crawls all routes automatically but is heavier and better for large sites; overkill for two pages |
| `@axe-core/playwright` | Pa11y | Pa11y requires a separate CLI call; `@axe-core/playwright` integrates cleanly into the existing Playwright spec and shares the same browser context |
| `treosh/lighthouse-ci-action` | `GoogleChrome/lighthouse-ci/tree/main/.github/actions/lighthouseciaction` | treosh is the recommended wrapper action in the ecosystem and has better documentation |

**Installation (new packages only):**
```bash
npm install --save-dev @lhci/cli @axe-core/playwright
```

**Version verification:** [VERIFIED: npm registry]
- `@lhci/cli@0.15.1` — confirmed latest stable
- `@axe-core/playwright@4.11.1` — confirmed latest stable

---

## Architecture Patterns

### Recommended Project Structure (new files this phase)

```
.
├── .github/
│   └── workflows/
│       └── ci.yml                # NEW — 4 parallel jobs
├── lighthouserc.json             # NEW — lhci assert config
├── playwright.config.ts          # NEW — Playwright project config
├── tests/
│   └── phase8-smoke.spec.ts      # NEW — E2E smoke + a11y audit
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro      # EDIT — add <ClientRouter />
│   ├── pages/
│   │   └── 404.astro             # NEW — branded 404 page
│   └── styles/
│       └── global.css            # EDIT — add @media print rules
```

### Pattern 1: Lighthouse CI — Static Dist Mode

**What:** Build the Astro site, then point `@lhci/cli` at `dist/` using `staticDistDir`. No live server needed.

**When to use:** Any static site (Astro output mode: `static`). This is the correct approach because Cloudflare Pages deploys the static `dist/` output.

**lighthouserc.json:**
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/", "/now/index.html"]
    },
    "assert": {
      "assertions": {
        "categories:performance":    ["error", { "minScore": 1 }],
        "categories:accessibility":  ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 1 }],
        "categories:seo":            ["error", { "minScore": 1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```
Source: [CITED: https://googlechrome.github.io/lighthouse-ci/docs/configuration.html]

### Pattern 2: GitHub Actions — Four Parallel Jobs

**What:** Each job is independent under a top-level `jobs:` key. No `needs:` dependency means they run in parallel. The build artifact is uploaded once and downloaded by jobs that need it.

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [master]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  typecheck:
    needs: build          # depends on install; can also run standalone
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx astro check

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm test

  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }
      - run: npx playwright test tests/phase8-smoke.spec.ts
        env:
          CI: true

  lighthouse:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }
      - uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.json
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

Source: [CITED: https://github.com/treosh/lighthouse-ci-action]

**Key detail on D-05 (parallel jobs):** The `build` job uploads the `dist/` artifact; `e2e` and `lighthouse` both `needs: build` to get the artifact. `unit-tests` and `typecheck` are fully independent. Net result: unit tests and typecheck run immediately; e2e and lighthouse run as soon as build finishes — all four visible in the GitHub PR checks panel.

### Pattern 3: axe-core/playwright Integration

**What:** Add `@axe-core/playwright` assertions inside the Playwright smoke test. Runs against the locally served `dist/` in CI.

```typescript
// tests/phase8-smoke.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.SMOKE_BASE ?? "http://localhost:4321";

test.describe("Phase 8 — Smoke + A11y", () => {
  test("homepage loads and has no critical a11y violations", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("theme toggle switches theme", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const html = page.locator("html");
    const initialTheme = await html.getAttribute("class");
    await page.locator("#theme-toggle").click();
    const newTheme = await html.getAttribute("class");
    expect(newTheme).not.toBe(initialTheme);
  });

  test("contact section is reachable by scrolling", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.locator('[data-nav-link]:has-text("Contact")').first().click();
    await page.waitForTimeout(500); // allow smooth scroll
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("CV download link is present and points to PDF", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const link = page.locator('a[download]');
    await expect(link).toHaveAttribute("href", /\.pdf$/);
  });
});
```

Source: [CITED: https://mvlanga.com/blog/automatically-detect-accessibility-issues-in-astro-using-axe-core/]

### Pattern 4: Astro ClientRouter (ViewTransitions)

**What:** `ClientRouter` (formerly `ViewTransitions`) replaces full page navigations with smooth DOM swaps. Import from `astro:transitions`. Single line in `BaseLayout.astro` `<head>`.

**Key facts:**
- Built-in `prefers-reduced-motion` support: `<ClientRouter />` automatically disables all view transition animations when the user's OS reduces motion setting is active. [CITED: https://docs.astro.build/en/guides/view-transitions/]
- `ViewTransitions` still works as an alias but `ClientRouter` is the current canonical name in Astro 5.
- No additional configuration is needed — Astro provides fade animation fallback for browsers without native View Transitions API support.

```astro
---
// BaseLayout.astro — add to imports
import { ClientRouter } from "astro:transitions";
---
<html>
  <head>
    <!-- existing head content -->
    <ClientRouter />
  </head>
  ...
</html>
```

Source: [CITED: https://docs.astro.build/en/reference/modules/astro-transitions/]

### Pattern 5: @media print Stylesheet

**What:** Add `@media print` rules to `global.css`. The standard approach hides interactive UI, shows link URLs, forces black-on-white.

```css
/* global.css — @media print section */
@media print {
  /* Hide navigation chrome */
  nav,
  #theme-toggle,
  #hamburger-btn,
  #mobile-menu {
    display: none !important;
  }

  /* Reset to print-safe colours */
  body {
    background: white !important;
    color: black !important;
  }

  /* Disable all animations */
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }

  /* Show external link URLs inline (skip hash anchors and mailto) */
  a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #444;
  }

  /* Ensure page breaks are sensible */
  section {
    page-break-inside: avoid;
  }
}
```

Source: [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing]

**Print scope recommendation (D-07):** Print full page (not CV-only). Rationale: the site is a single-page CV; every section is relevant to a recruiter. Scoping to CV only would require identifying and maintaining a CSS class allowlist, adding fragility. Full-page print with nav/toggle hidden and animations disabled is the correct approach.

### Pattern 6: Custom 404 Page

**What:** Create `src/pages/404.astro`. Astro builds it to `dist/404.html`. Cloudflare Pages automatically serves `/404.html` for unmatched routes. No configuration needed beyond the file. [CITED: https://developers.cloudflare.com/pages/configuration/serving-pages/]

**404 design recommendation (D-08):** Minimal branded. The site has a professional, clean aesthetic. A playful 404 would create tone inconsistency. Minimal branded = same BaseLayout, indigo accent headline "404", one-line explanation, single CTA button back to `/`.

```astro
---
// src/pages/404.astro
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="404 — Page Not Found | Dragos Macsim">
  <section
    class="flex flex-col items-center justify-center min-h-[60dvh] text-center px-4"
    aria-label="Page not found"
  >
    <p class="text-6xl font-bold" style="color: var(--color-accent-primary);">404</p>
    <h1 class="mt-4 text-2xl font-semibold">Page not found</h1>
    <p class="mt-2" style="color: var(--color-text-muted);">
      This page doesn't exist — but the rest does.
    </p>
    <a href="/" class="mt-8 btn-primary">Back to home</a>
  </section>
</BaseLayout>
```

### Anti-Patterns to Avoid

- **Blocking CI on flaky Lighthouse Performance scores:** Performance 100 is achievable on a static Astro site, but network timing in GitHub Actions can introduce variance. Use `staticDistDir` mode (no network) to eliminate environmental flake.
- **Serving the dev server in CI for Playwright:** Use `npx astro preview` against the built `dist/` or use Playwright's `webServer` option pointing at `astro preview`. Do NOT run `astro dev` in CI — it disables optimisations and will fail Lighthouse.
- **Adding `<ClientRouter />` without checking for IntersectionObserver conflicts:** The existing `IntersectionObserver` in `BaseLayout.astro` for active nav highlighting re-runs on every page navigation when `ClientRouter` is active. Need to ensure the observer logic is idempotent or wrapped in Astro's `astro:page-load` event.
- **axe-core `results.violations.toEqual([])` being too strict in CI initially:** Acceptable to use `expect(results.violations.filter(v => v.impact === "critical").length).toBe(0)` in the first pass, then tighten to zero violations once all issues are fixed.
- **Print stylesheet using `!important` sparingly:** CSS specificity means Tailwind utility classes may need `!important` overrides in `@media print`. This is an accepted pattern for print stylesheets.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lighthouse CI assertions | Custom Node script to parse lighthouse JSON | `@lhci/cli` + `lighthouserc.json` | lhci handles server startup, URL collection, assertion evaluation, and CI exit codes |
| A11y scanning | Manual DOM inspection in tests | `@axe-core/playwright` | axe-core checks 100+ WCAG rules including colour contrast calculations |
| CI GitHub PR status checks | Custom GitHub API calls | GitHub Actions native job status | GitHub automatically turns each job's pass/fail into a PR check |
| ViewTransitions fallback | Custom CSS animation polyfill | `ClientRouter` from `astro:transitions` | Built-in fallback animation for browsers without native View Transitions API support |

---

## Common Pitfalls

### Pitfall 1: Lighthouse Performance < 100 due to render-blocking JS
**What goes wrong:** Lighthouse flags a JS script as render-blocking, dropping Performance below 100.
**Why it happens:** The inline FOUC-prevention script in `Head.astro` runs synchronously (this is intentional). Lighthouse may flag it if it adds to the TBT (Total Blocking Time) budget.
**How to avoid:** The `is:inline` script is tiny (<300 bytes) and should not exceed TBT budget. If Lighthouse flags it, verify the script is `is:inline` (not fetched) and under 50ms.
**Warning signs:** TBT audit failure in `lhci` output; "Avoid render-blocking resources" in Lighthouse report.

### Pitfall 2: axe-core colour contrast failures on theme toggle transition
**What goes wrong:** During the CSS `transition-colors` animation on `<body>`, colour contrast momentarily fails.
**Why it happens:** axe-core captures a snapshot; if Playwright evaluates immediately after page load before the theme class is applied, computed colours may be in-between.
**How to avoid:** Always wait for `networkidle` or `domcontentloaded` and assert the `html` element has a theme class before running axe-core.
**Warning signs:** `color-contrast` violations that disappear when run manually.

### Pitfall 3: `ClientRouter` breaking existing `IntersectionObserver` active-nav logic
**What goes wrong:** After a page transition, the `IntersectionObserver` from the previous page still runs (Astro persists it), or the new page's sections are not observed.
**Why it happens:** `ClientRouter` swaps the `<body>` DOM but Astro runs `<script>` tags only once per page lifecycle by default.
**How to avoid:** Wrap the `IntersectionObserver` setup in an `astro:page-load` event listener. Astro fires this event after each client-side navigation.
```javascript
document.addEventListener("astro:page-load", () => {
  // re-run IntersectionObserver and nav setup here
});
```
Source: [CITED: https://docs.astro.build/en/guides/view-transitions/]

### Pitfall 4: `staticDistDir` path mismatch in lhci
**What goes wrong:** `lhci` can't find `dist/` and fails with "No pages found".
**Why it happens:** The `staticDistDir` path is relative to the working directory of the CI step, not the config file.
**How to avoid:** Use `./dist` (relative to project root) and ensure the GitHub Actions step that runs lhci is at the project root. The `download-artifact` step must deposit files at `dist/` in the workspace.

### Pitfall 5: Lighthouse Best Practices failing due to Cloudflare Analytics beacon
**What goes wrong:** Lighthouse Best Practices < 100 because the `cloudflareinsights.com` beacon is flagged.
**Why it happens:** In `staticDistDir` mode, lhci serves the static files locally — `PROD` env var is false, so the beacon is NOT injected by the build (`{import.meta.env.PROD && cfAnalyticsToken && ...}`). This means the beacon is absent in CI and this pitfall does not apply.
**How to avoid:** Confirm `import.meta.env.PROD` is `false` during local static serving (it is, since `astro build` sets it to `true` but the lhci static server doesn't set it — actually `astro build` DOES set `PROD=true`, so the beacon IS baked in). If the beacon causes Best Practices issues, set a `PUBLIC_CF_ANALYTICS_TOKEN` env var to empty string in the CI workflow to prevent it from being injected.

### Pitfall 6: Playwright `webServer` vs. artifact download
**What goes wrong:** Playwright needs a server running to load pages. If CI runs tests against `http://localhost:4321` but no server is started, tests fail immediately.
**How to avoid:** Two options: (1) Add a `webServer` block to `playwright.config.ts` that runs `astro preview` before tests, or (2) start `npx astro preview` in a background step before `playwright test`. Option 1 is cleaner.
```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npx astro preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://localhost:4321" },
  testDir: "./tests",
  testMatch: ["**/*.spec.ts"],
});
```

---

## Code Examples

### lighthouserc.json — Hard Gate at 100
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/index.html", "/now/index.html"]
    },
    "assert": {
      "assertions": {
        "categories:performance":    ["error", { "minScore": 1 }],
        "categories:accessibility":  ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 1 }],
        "categories:seo":            ["error", { "minScore": 1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```
Source: [CITED: https://googlechrome.github.io/lighthouse-ci/docs/configuration.html]

### axe-core in Playwright — Zero violations assertion
```typescript
import AxeBuilder from "@axe-core/playwright";

const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  .analyze();
expect(results.violations).toEqual([]);
```
Source: [CITED: https://www.npmjs.com/package/@axe-core/playwright]

### ClientRouter in BaseLayout.astro
```astro
---
import { ClientRouter } from "astro:transitions";
---
<head>
  <!-- existing Head component -->
  <ClientRouter />
</head>
```
Source: [CITED: https://docs.astro.build/en/guides/view-transitions/]

### astro:page-load guard for IntersectionObserver
```javascript
// In BaseLayout.astro <script> block
function setupNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const observer = new IntersectionObserver(/* ... existing callback ... */);
  sections.forEach((section) => observer.observe(section));
}

// Run on initial load and after each ClientRouter navigation
setupNavObserver();
document.addEventListener("astro:page-load", setupNavObserver);
```
Source: [CITED: https://docs.astro.build/en/guides/view-transitions/]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ViewTransitions` component name | `ClientRouter` from `astro:transitions` | Astro 4.x (alias kept) | Use `ClientRouter`; old name still works but is semantically misleading |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind CSS v4 (Feb 2026) | Already implemented in this project |
| `framer-motion` package | `motion` package, import from `motion/react` | Motion v11+ | Already implemented in this project |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `astro build` sets `import.meta.env.PROD = true`, causing the CF Analytics beacon to be present in `dist/` HTML | Pitfall 5 | If the beacon causes Best Practices to drop below 100, CI will fail; mitigation is to set empty `PUBLIC_CF_ANALYTICS_TOKEN` in CI env |
| A2 | `staticDistDir` in lhci resolves `/now/index.html` correctly (Astro generates it as `dist/now/index.html`) | Pattern 1 | If Astro generates the file differently, the lhci URL must be adjusted |
| A3 | The existing `axe-core` rules will find zero violations once alt text and focus rings are in place | Pattern 3 | May find additional violations (colour contrast in dark mode, ARIA roles) requiring additional fixes |

---

## Open Questions (RESOLVED)

1. **CF Analytics beacon and Best Practices score** — RESOLVED
   - The beacon is injected only in PROD builds; lhci uses staticDistDir which serves the built `dist/` (which is PROD)
   - Mitigation: Set `PUBLIC_CF_ANALYTICS_TOKEN=""` in CI env to suppress beacon injection during Lighthouse audits. If beacon doesn't cause a penalty, remove the override later. Plan 08-03 includes this env var in the CI workflow.

2. **Existing Playwright spec files and the new `playwright.config.ts`** — RESOLVED
   - Plan 08-02 creates `playwright.config.ts` with `testMatch: ["**/phase8-smoke.spec.ts"]` scoping. Existing live-site specs (`phase7-nav-live.spec.ts`, `visual-check.spec.ts`) are excluded from CI runs and remain available for manual use.

3. **Lighthouse score starting point** — RESOLVED
   - Plan 08-01 includes a baseline Lighthouse measurement task as its first action. The executor will run `npx lhci collect` against the built dist before any changes, documenting baseline scores. If any category is below 100, Plan 08-01's accessibility and performance fixes will target those gaps. The hard gate in CI (Plan 08-03) is applied after all fixes are in place.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All CI jobs | ✓ | v22.20.0 | — |
| `@playwright/test` | E2E smoke tests | ✓ | 1.59.1 (devDependency) | — |
| `vitest` | Unit tests | ✓ | 4.1.4 (devDependency) | — |
| `@lhci/cli` | Lighthouse CI | ✗ | not installed | Install via `npm i -D @lhci/cli` |
| `@axe-core/playwright` | A11y in E2E | ✗ | not installed | Install via `npm i -D @axe-core/playwright` |
| `playwright.config.ts` | Playwright test discovery | ✗ | not present | New file required (Wave 0) |
| `.github/workflows/ci.yml` | CI pipeline | ✗ | not present | New file required |
| `lighthouserc.json` | lhci assertions | ✗ | not present | New file required |

**Missing dependencies with no fallback:**
- `@lhci/cli` — required for D-01 (Lighthouse CI hard gate)
- `@axe-core/playwright` — required for automated a11y audit
- `playwright.config.ts` — required for CI Playwright run (without it, `playwright test` will either error or run ALL specs including live-site ones)
- `.github/workflows/ci.yml` — required for D-03 (GitHub Actions CI)
- `lighthouserc.json` — required for lhci assertions

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 (E2E) + Vitest 4.1.4 (unit) |
| Config file | `playwright.config.ts` — Wave 0 gap (new file needed) |
| Quick E2E run | `npx playwright test tests/phase8-smoke.spec.ts` |
| Full suite command | `npm test && npx playwright test tests/phase8-smoke.spec.ts` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| D-01 | Lighthouse 100/100/100/100 gate | CI assertion | `npx lhci autorun --config=lighthouserc.json` | ❌ Wave 0 |
| D-04 | Load `/` without a11y violations | E2E (axe-core) | `npx playwright test tests/phase8-smoke.spec.ts` | ❌ Wave 0 |
| D-04 | Theme toggle switches theme class | E2E | `npx playwright test tests/phase8-smoke.spec.ts` | ❌ Wave 0 |
| D-04 | Contact section visible after scroll | E2E | `npx playwright test tests/phase8-smoke.spec.ts` | ❌ Wave 0 |
| D-04 | CV download link targets a PDF | E2E | `npx playwright test tests/phase8-smoke.spec.ts` | ❌ Wave 0 |
| D-06 | Print CSS hides nav | Manual / visual | — | Manual only |
| — | 404 page renders with BaseLayout | E2E smoke | `npx playwright test tests/phase8-smoke.spec.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test` (vitest unit only — fast, < 5s)
- **Per wave merge:** `npm test && npx playwright test tests/phase8-smoke.spec.ts`
- **Phase gate:** Full CI pipeline green (all 4 jobs passing) before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `playwright.config.ts` — root config with `webServer`, `baseURL`, `testMatch` scoped to phase8-smoke
- [ ] `tests/phase8-smoke.spec.ts` — E2E smoke + axe-core a11y
- [ ] `lighthouserc.json` — lhci assert config
- [ ] `.github/workflows/ci.yml` — 4 parallel jobs
- [ ] `npm install --save-dev @lhci/cli @axe-core/playwright`

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | Static site, no user input |
| V6 Cryptography | no | — |

### Known Threat Patterns for CI/CD

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| CI secrets leakage (LHCI_GITHUB_APP_TOKEN) | Information Disclosure | Store in GitHub Actions secrets; never log to console |
| Supply chain via GitHub Actions | Tampering | Pin actions to version tags (`@v12`, `@v4`) not floating `@latest` |

---

## Project Constraints (from CLAUDE.md)

| Directive | Applies to Phase 8 |
|-----------|-------------------|
| No preference on tech stack | Already resolved — Astro 5 + Tailwind v4 + Motion v12 |
| Professional design standard | 404 page must use BaseLayout and site design tokens |
| No React for static sections | 404 page is Astro, not React |
| Immutable data patterns | All new TypeScript follows immutable patterns |
| Functions < 50 lines | Playwright test helpers should be extracted if > 50 lines |
| GSD workflow enforcement | All edits made through gsd-execute-phase |

---

## Sources

### Primary (HIGH confidence)
- [CITED: https://docs.astro.build/en/guides/view-transitions/] — ClientRouter import, prefers-reduced-motion built-in, astro:page-load event
- [CITED: https://docs.astro.build/en/reference/modules/astro-transitions/] — ClientRouter canonical name
- [CITED: https://googlechrome.github.io/lighthouse-ci/docs/configuration.html] — lhci assert config format, staticDistDir
- [CITED: https://developers.cloudflare.com/pages/configuration/serving-pages/] — Cloudflare Pages 404.html serving
- [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing] — @media print patterns
- [VERIFIED: npm registry] — `@lhci/cli@0.15.1`, `@axe-core/playwright@4.11.1` current stable

### Secondary (MEDIUM confidence)
- [CITED: https://github.com/treosh/lighthouse-ci-action] — treosh/lighthouse-ci-action@v12 GitHub Actions usage
- [CITED: https://mvlanga.com/blog/automatically-detect-accessibility-issues-in-astro-using-axe-core/] — axe-core + Playwright + Astro integration pattern

### Tertiary (LOW confidence)
- [ASSUMED] Starting Lighthouse scores for the live site (not measured in this session)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry confirmed versions, official docs confirm tool choices
- Architecture: HIGH — lhci docs, Astro docs, GitHub Actions documentation all consulted
- Pitfalls: MEDIUM — most from direct codebase analysis; CF Analytics beacon pitfall is [ASSUMED] risk

**Research date:** 2026-04-12
**Valid until:** 2026-05-12 (stable toolchain — lhci, Playwright, Astro versions move slowly)
