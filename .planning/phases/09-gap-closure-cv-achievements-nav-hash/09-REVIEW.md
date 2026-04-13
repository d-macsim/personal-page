---
phase: 09-gap-closure-cv-achievements-nav-hash
reviewed: 2026-04-13T00:00:00Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - tests/phase8-smoke.spec.ts
  - playwright.config.ts
  - src/components/CVSection.astro
  - src/components/TimelineColumn.astro
  - src/layouts/BaseLayout.astro
  - tests/cv-section.test.ts
  - tests/about-section.test.ts
  - tests/hero-section.test.ts
  - tests/seo-metadata.test.ts
  - tests/projects-contact.test.ts
findings:
  critical: 0
  warning: 3
  info: 3
  total: 6
status: issues_found
---

# Phase 9: Code Review Report

**Reviewed:** 2026-04-13T00:00:00Z
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

Ten files were reviewed: the Playwright smoke-test suite and its config, the two core CV components (`CVSection.astro`, `TimelineColumn.astro`), the shared layout (`BaseLayout.astro`), and four Vitest unit-test files covering the CV, about, hero, and SEO+projects-contact sections.

The source components are well-structured. The most significant finding is in `BaseLayout.astro`: the Intersection Observer active-nav logic uses bare `#id` href matching, which will silently never fire for nav links on non-home routes (where hrefs are `/#about`, `/#experience`, etc.). This is a functional bug that will cause the active-state indicator to fail on `/now`. Two other warnings cover a Playwright config that hard-excludes the new phase-9 test file from runs, and a fragile regex used in `cv-section.test.ts` to count roles. Three info-level items cover minor quality issues in the test files.

## Warnings

### WR-01: Intersection Observer href match fails on non-home routes

**File:** `src/layouts/BaseLayout.astro:155`
**Issue:** The observer callback compares `navLink.getAttribute('href')` against `` `#${entry.target.id}` `` (a bare hash). On the `/now` page, nav link hrefs are prefixed with `"/"` (e.g., `"/#about"`), so the comparison always evaluates `false` and no nav link is ever marked active. The `/now` active state is set separately via the pathname check on line 140-143, but scroll-based section highlighting is silently broken for any non-home page that contains sections.

**Fix:**
```typescript
// In the IntersectionObserver callback (BaseLayout.astro ~line 153-159)
navLinks.forEach((navLink) => {
  const href = navLink.getAttribute('href') ?? '';
  // Strip optional leading "/" so "/#about" and "#about" both match "#about"
  const normalised = href.startsWith('/') ? href.slice(1) : href;
  if (normalised === `#${entry.target.id}`) {
    navLink.setAttribute('data-active', 'true');
  } else {
    navLink.removeAttribute('data-active');
  }
});
```

---

### WR-02: `playwright.config.ts` `testMatch` excludes all new phase-9 E2E tests

**File:** `playwright.config.ts:14`
**Issue:** `testMatch: ["phase8-smoke.spec.ts"]` is a literal filename, not a glob. Any new E2E spec added for phase 9 (e.g., `phase9-smoke.spec.ts`) will be silently ignored when running `npx playwright test`. The CI retries setting also applies only to the one matched file, giving false confidence that the full suite passed.

**Fix:**
```typescript
// Use a glob so all smoke specs are included automatically
testMatch: ["**/*.spec.ts"],
// Or, if you want to be more selective:
testMatch: ["phase8-smoke.spec.ts", "phase9-smoke.spec.ts"],
```

---

### WR-03: Fragile regex used to count roles may over-count

**File:** `tests/cv-section.test.ts:36`
**Issue:** The test counts occurrences of `/title:/g` in the raw `cv.ts` source string to verify that there are at least 3 roles. This regex matches every occurrence of the substring `title:` anywhere in the file — including education entries, type-interface field declarations, or comments — and will produce a false pass if any non-role object uses a `title:` key.

**Fix:**
```typescript
// Count role objects directly from the structured data rather than scanning raw text.
// If cv.ts uses a typed export, import it and check the array length:
it("cv.ts roles array has 3 entries", () => {
  // Count role-specific markers: each role has both title: and company: adjacent
  const roleBlocks = cvData.match(/title:[^}]+company:/g);
  expect(roleBlocks).not.toBeNull();
  expect(roleBlocks!.length).toBeGreaterThanOrEqual(3);
});
```

---

## Info

### IN-01: `about-section.test.ts` bio text assertion is brittle — duplicates production copy

**File:** `tests/about-section.test.ts:26-34`
**Issue:** Tests assert exact substrings of bio copy (e.g., `"AI data specialist"`, `"Currently at Mindrift"`, `"MSc in Business Analytics from Bayes Business School"`). Any legitimate wording update to the bio will break these tests, coupling the test suite to marketing copy rather than structural intent. The tests provide no safety net beyond "these exact strings are present".

**Fix:** Consider consolidating copy assertions into a single snapshot or data-contract test. If the bio is sourced from a data file, test the data file and test that `AboutSection.astro` renders the data — not the exact copy string.

---

### IN-02: `phase8-smoke.spec.ts` uses `waitForTimeout` — flaky pattern

**File:** `tests/phase8-smoke.spec.ts:22,43`
**Issue:** Two tests use `await page.waitForTimeout(100)` and `await page.waitForTimeout(600)` to wait for UI transitions. Fixed timeouts are a known flakiness source: they pass on fast machines and fail under CI load or slow preview-server startup.

**Fix:**
```typescript
// For theme toggle: wait for the class attribute to change instead of a fixed delay
await page.locator("#theme-toggle").click();
await page.waitForFunction(() => document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('light'));

// For scroll-to-contact: wait for element to be in viewport
await page.locator('[data-nav-link][href="#contact"], [data-nav-link][href="/#contact"]').first().click();
await expect(page.locator("#contact")).toBeInViewport({ timeout: 3000 });
```

---

### IN-03: `CVSection.astro` has two `<h2>` elements at the same level — heading hierarchy inconsistency

**File:** `src/components/CVSection.astro:23,37`
**Issue:** The component renders two `<h2>` headings — "Experience & Education" (line 23) and "Skills" (line 37) — both siblings inside the same `<section>`. The project convention (confirmed by `seo-metadata.test.ts` line 122) is that sections use `<h2>` headings and sub-elements use `<h3>`. The "Skills" sub-section sits below the experience/education grid in the same section, so it should be `<h3>` to maintain correct document outline and not confuse screen readers.

**Fix:**
```astro
<!-- Line 37: change h2 to h3 -->
<h3
  class="font-semibold mb-8"
  style={{ fontSize: "var(--font-size-heading)" }}
>
  Skills
</h3>
```

---

_Reviewed: 2026-04-13T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
