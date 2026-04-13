# Phase 9: Gap Closure — CV Achievements & Nav Hash Links - Research

**Researched:** 2026-04-13
**Domain:** Astro component rendering, Astro ClientRouter (View Transitions), SPA-style hash navigation
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP-01 | Experience timeline shows roles, companies, dates, and key achievements | Fix CVSection.astro to pass `r.achievements` as `body`, then render `body` items in TimelineColumn.astro |
| CONT-02 | Contact reachable from any section (persistent nav or CTA) | Fix nav click handler to detect cross-page hash links and use full-page navigation instead of no-op querySelector |
</phase_requirements>

---

## Summary

Phase 9 closes exactly two v1.0 audit gaps, both of which are small, targeted fixes in existing files. No new dependencies are needed.

**Gap 1 — EXP-01 (Achievement bullets not rendered):** `CVSection.astro` maps every role to `{ body: [] }` — a hardcoded empty array — instead of `{ body: r.achievements }`. `TimelineColumn.astro` declares `body: string[]` in its interface but never renders it. The fix is two-part: (1) pass `r.achievements` in the mapping, (2) render `body` as a bullet list inside `TimelineColumn.astro`. The data already exists in `cv.ts`; this is a wiring error.

**Gap 2 — CONT-02 (Hash links broken after ClientRouter navigation):** `BaseLayout.astro` computes `hashPrefix` server-side (`""` on `/`, `"/"` on other routes). The nav is `transition:persist`, so after a ClientRouter soft-navigation from `/` to `/now`, the persisted DOM retains `href="#about"` (no prefix). The click handler intercepts any `href` starting with `"#"` and calls `querySelector('#about')`, which is `null` on the `/now` page — a silent no-op. The fix is a client-side handler that detects when a hash link target is missing from the current document and falls back to full-URL navigation (`window.location.href = '/' + href`).

**Primary recommendation:** Fix `CVSection.astro` (1 line), add `<ul>` render in `TimelineColumn.astro` (5-8 lines), and update the nav click handler in `BaseLayout.astro` (3-5 lines). All changes are in files that already exist; no new files required beyond a test spec.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Astro | `^6.1.5` | Framework, ClientRouter, transition:persist | Already in use [VERIFIED: package.json] |
| Tailwind CSS | `^4.2.2` | Utility classes for bullet list styling | Already in use [VERIFIED: package.json] |
| Playwright | `^1.59.1` | E2E tests for nav and achievement rendering | Already in use [VERIFIED: package.json] |
| Vitest | `^4.1.4` | Static file analysis unit tests | Already in use [VERIFIED: package.json] |

**Installation:** None required — phase 9 uses only existing packages.

---

## Architecture Patterns

### Gap 1 — Achievement Bullets (EXP-01)

**What the bug is:**

```typescript
// CVSection.astro — CURRENT (broken)
const experienceEntries = roles.map((r) => ({
  heading: r.title,
  subheading: r.company,
  dateRange: r.dateRange,
  body: [],          // hardcoded empty — achievements silently dropped
}));
```

```typescript
// CVSection.astro — FIXED (one-line change)
const experienceEntries = roles.map((r) => ({
  heading: r.title,
  subheading: r.company,
  dateRange: r.dateRange,
  body: r.achievements,   // wire from cv.ts
}));
```

`TimelineColumn.astro` already has `body: string[]` in the `TimelineEntry` interface but never renders it. The rendering pattern to add:

```astro
{/* Inside the entry map block, after the heading/subheading */}
{entry.body.length > 0 && (
  <ul class="mt-2 space-y-1 list-disc list-inside" style="color: var(--color-text-muted);">
    {entry.body.map((item) => (
      <li style="font-size: var(--font-size-body);">{item}</li>
    ))}
  </ul>
)}
```

[VERIFIED: codebase — cv.ts has `achievements: string[]` per role, CVSection.astro passes `body: []`, TimelineColumn.astro never renders `entry.body`]

**Design constraints:**
- Use `list-disc list-inside` Tailwind classes — consistent with the `/now` page bullet lists [VERIFIED: now.astro uses `list-style: disc; padding-left: 1.5rem`]
- Color: `var(--color-text-muted)` — de-emphasised relative to role heading, same pattern used for dateRange
- Font-size: `var(--font-size-body)` — body text token, already used throughout
- Guard with `entry.body.length > 0` — handles Education entries which are passed `body: []` and should remain bullet-free

---

### Gap 2 — Cross-Page Hash Navigation (CONT-02)

**What the bug is:**

The nav persists across ClientRouter navigations via `transition:persist`. However, `hashPrefix` is computed at server render time:

```typescript
// BaseLayout.astro — server-side (runs once at build/SSR, NOT re-evaluated on client nav)
const isHome = Astro.url.pathname === "/" || Astro.url.pathname === "";
const hashPrefix = isHome ? "" : "/";
```

After ClientRouter navigates from `/` to `/now`:
- The persisted nav DOM still has `href="#about"` (prefix was `""` at build time for `/`)
- The click handler checks `href.startsWith('#')` → true → calls `querySelector('#about')` → `null` on `/now`
- Result: no-op, contact section is unreachable

**Fix approach — client-side fallback in the click handler:**

The click handler already runs after every `astro:page-load`. The fix adds a document-presence check:

```javascript
// BaseLayout.astro <script> — updated click handler
allNavLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Pure hash link (no leading /)
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        // Target exists on this page — smooth scroll
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Target missing (we're on a different route) — navigate home + hash
        e.preventDefault();
        window.location.href = '/' + href;
      }
      return;
    }

    // Full hash link like /#about (already correct for cross-page)
    // Let the browser handle it — no preventDefault
  });
});
```

[VERIFIED: codebase — BaseLayout.astro `hashPrefix` is server-computed, click handler uses `startsWith('#')` guard, `window.location.href` assignment is the standard cross-page hash navigation fallback]

**Why `window.location.href` and not `ClientRouter` programmatic navigation:**

Astro's ClientRouter does not expose a programmatic `navigate(url)` API for hash-fragment destinations that exist on a different page. Assigning `window.location.href` triggers a full browser navigation which will render the homepage, then scroll to the anchor — the correct and expected UX. [ASSUMED: Astro ClientRouter does not expose navigate() API — based on training knowledge; however the fix works regardless because a full navigation is acceptable for this use case]

**Alternative considered — make all hash links always use `/#hash` prefix:**

The `hashPrefix` variable already attempts this for server-rendered non-home pages (it produces `/#about` hrefs for `/now` at initial server load). The problem is the nav persists and is never re-rendered client-side. Making all hrefs always `/#hash` (by removing the `hashPrefix` logic and hardcoding `/`) would work but would break smooth-scrolling on the homepage — clicking `/#about` when already on `/` triggers a full navigation instead of a smooth scroll. The click handler approach preserves smooth-scroll behaviour on `/` and adds fallback-navigate on other routes.

---

### Anti-Patterns to Avoid

- **Touching `hashPrefix` server-side logic:** The server-side `isHome` / `hashPrefix` computation is correct for initial page loads. Do not remove it — it ensures `/now` renders with `/#about` hrefs on direct load (bypassing the click handler entirely since the `href` won't start with `#`).
- **Calling `navigator.history.pushState` or `location.hash`:** These do not trigger cross-page navigation.
- **Passing `achievements` to Education entries:** Education entries in `cv.ts` do not have an `achievements` field. The `body: []` for education is correct — only `experienceEntries` should wire `r.achievements`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-page hash scroll | Custom router/history API | `window.location.href = '/' + href` | One line; correct semantics; full-page nav + native anchor scroll |
| Achievement list markup | Custom component | Inline `<ul>` in TimelineColumn.astro | No abstraction needed — 5 lines, single use |

---

## Common Pitfalls

### Pitfall 1: Rendering achievements in Education column too

**What goes wrong:** If the `body` render block has no guard, it will render an empty `<ul>` for education entries (which are passed `body: []`), producing extra whitespace or an empty list.

**How to avoid:** Guard with `{entry.body.length > 0 && ...}` before rendering the `<ul>`.

**Warning signs:** Empty space beneath education role headings in the rendered page.

---

### Pitfall 2: Breaking smooth-scroll on the homepage

**What goes wrong:** If the click handler always falls back to `window.location.href = '/' + href`, clicking `#about` on the homepage causes a full-page reload instead of smooth scroll.

**How to avoid:** The `document.querySelector(href)` check gates the fallback — if the target exists on the current page, smooth-scroll is used. Only when the target is absent does the fallback fire.

**Warning signs:** Homepage nav links trigger full page reload (visible flash) instead of smooth scroll.

---

### Pitfall 3: Vitest test for `entry.body` rendering fails silently

**What goes wrong:** The existing `cv-section.test.ts` already has `it("TimelineColumn.astro iterates entry.body")` which asserts `timeline` contains `entry.body`. It currently fails because `TimelineColumn.astro` never references `entry.body`. After the fix this test will pass — but the test only checks for the string `entry.body`, not that it's actually in a render expression.

**How to avoid:** Add a more specific assertion that checks for a `<ul>` or `<li>` render block alongside `entry.body` in the test, or rely on E2E tests for visual confirmation.

---

### Pitfall 4: Playwright testMatch excludes new spec

**What goes wrong:** `playwright.config.ts` has `testMatch: ["phase8-smoke.spec.ts"]` — only the Phase 8 smoke suite runs in CI. A new Phase 9 spec won't run automatically unless `testMatch` is updated.

**How to avoid:** Either add the Phase 9 spec to `testMatch`, or extend `phase8-smoke.spec.ts` with the new tests. Extending the existing smoke spec is simpler and keeps CI config unchanged.

---

## Code Examples

### Pattern: Astro conditional list render

```astro
{/* Source: TimelineColumn.astro — after the fix */}
{entry.body.length > 0 && (
  <ul class="mt-2 space-y-1 list-disc list-inside" style="color: var(--color-text-muted);">
    {entry.body.map((item) => (
      <li style="font-size: var(--font-size-body);">{item}</li>
    ))}
  </ul>
)}
```

### Pattern: ClientRouter-safe hash navigation

```javascript
// Source: BaseLayout.astro <script> — updated handler
if (href.startsWith('#')) {
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  } else {
    e.preventDefault();
    window.location.href = '/' + href;
  }
}
```

### Pattern: Playwright nav hash test across routes

```typescript
// Source: phase8-smoke.spec.ts extension pattern
test("contact nav link works after ClientRouter /now navigation", async ({ page }) => {
  await page.goto("/now");
  await page.waitForLoadState("domcontentloaded");

  // Click the Contact link — should navigate to /#contact
  await page.locator('[data-nav-link][href="#contact"], [data-nav-link][href="/#contact"]').first().click();
  await page.waitForURL("**/#contact");
  await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.2 });
});

test("experience timeline shows achievement bullets", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  const bullets = page.locator("#experience li");
  await expect(bullets).toHaveCountGreaterThan(4); // 3 roles * 2+ bullets each
});
```

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework (unit) | Vitest 4.1.4 |
| Framework (E2E) | Playwright 1.59.1 |
| Config file (unit) | `vitest.config.ts` |
| Config file (E2E) | `playwright.config.ts` (testMatch: phase8-smoke.spec.ts) |
| Quick run command (unit) | `npm test` |
| E2E run command | `npm run build && npm run test:e2e` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EXP-01 | Achievement bullets appear in experience timeline | Unit (static) | `npm test -- --reporter=verbose` | Partial — `cv-section.test.ts` has `entry.body` check; add bullet-render assertion |
| EXP-01 | At least 6 `<li>` elements visible under `#experience` | E2E | Extend `phase8-smoke.spec.ts` | No — Wave 0 gap |
| CONT-02 | Nav hash click after ClientRouter /now navigates to correct section | E2E | Extend `phase8-smoke.spec.ts` | No — Wave 0 gap |

### Sampling Rate

- **Per task commit:** `npm test` (unit suite, ~3s)
- **Per wave merge:** `npm run build && npm run test:e2e` (E2E smoke)
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] Two new E2E tests added to `tests/phase8-smoke.spec.ts`:
  - Achievement bullets visible in `#experience`
  - Nav hash link from `/now` navigates to section on homepage
- [ ] Update `playwright.config.ts` `testMatch` if a separate `phase9-smoke.spec.ts` is created (alternative: extend existing spec — simpler)

---

## Environment Availability

Step 2.6: No new external dependencies identified — phase is code-only.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build / test | Yes | 22.x (pinned via .node-version) | — |
| Playwright browsers | E2E tests | Yes (installed) | Chromium | — |

---

## Security Domain

Security enforcement is enabled. This phase makes no security-relevant changes:

| ASVS Category | Applies | Rationale |
|---------------|---------|-----------|
| V5 Input Validation | No | No user input; only static template data from `cv.ts` |
| V4 Access Control | No | No auth-gated content |
| V2 Authentication | No | No authentication |

No threat patterns apply to rendering static achievement strings or browser-native hash navigation.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Astro ClientRouter does not expose a programmatic `navigate(url)` API for hash destinations on other pages | Architecture Patterns — Gap 2 | Low — `window.location.href` fallback works regardless; if API exists it would be a nice-to-have improvement only |

---

## Open Questions

1. **Should Education entries ever show achievement bullets?**
   - What we know: `EducationEntry` interface has no `achievements` field; `body: []` is passed for education entries
   - What's unclear: Phase could optionally add a `detail` or `modules` render — but that is out of scope per EXP-01
   - Recommendation: Leave education `body: []`; do not add modules rendering in this phase

2. **Should `playwright.config.ts` testMatch be updated to include a Phase 9 spec?**
   - What we know: Currently only `phase8-smoke.spec.ts` runs in CI
   - Recommendation: Extend `phase8-smoke.spec.ts` with Phase 9 tests rather than creating a new spec file — avoids a config change and keeps a single authoritative E2E suite

---

## Sources

### Primary (HIGH confidence)

- Codebase — `src/data/cv.ts` [VERIFIED: read directly]
- Codebase — `src/components/CVSection.astro` [VERIFIED: read directly]
- Codebase — `src/components/TimelineColumn.astro` [VERIFIED: read directly]
- Codebase — `src/layouts/BaseLayout.astro` [VERIFIED: read directly]
- Codebase — `.planning/v1.0-MILESTONE-AUDIT.md` [VERIFIED: read directly]
- Codebase — `tests/cv-section.test.ts` [VERIFIED: read directly]
- Codebase — `tests/phase8-smoke.spec.ts` [VERIFIED: read directly]
- Codebase — `playwright.config.ts` [VERIFIED: read directly]

### Secondary (MEDIUM confidence)

- Astro View Transitions / ClientRouter — `transition:persist` behaviour documented at astro.build/docs [CITED: training + codebase verification of the `astro:page-load` event pattern]

---

## Metadata

**Confidence breakdown:**
- Gap identification: HIGH — both gaps confirmed by reading the actual source files
- Fix approach (EXP-01): HIGH — mechanical wiring fix, no ambiguity
- Fix approach (CONT-02): HIGH — standard browser API, no new dependencies
- Test strategy: HIGH — existing framework, clear assertions
- Side-effect risk: LOW — changes are contained to 2-3 files, no shared infrastructure

**Research date:** 2026-04-13
**Valid until:** Until any of BaseLayout.astro, CVSection.astro, or TimelineColumn.astro are modified
