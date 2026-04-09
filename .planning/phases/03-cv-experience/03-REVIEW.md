---
phase: 03-cv-experience
reviewed: 2026-04-09T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - src/components/CVDownloadButton.astro
  - src/components/CVSection.astro
  - src/components/ExperienceTimeline.astro
  - src/components/SkillsGrid.astro
  - src/data/cv.ts
  - src/pages/index.astro
  - tests/cv-section.test.ts
findings:
  critical: 0
  warning: 3
  info: 3
  total: 6
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-09T00:00:00Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Seven files were reviewed covering the CV section implementation: the data layer (`cv.ts`), three presentational Astro components (`CVSection.astro`, `ExperienceTimeline.astro`, `SkillsGrid.astro`), the download button (`CVDownloadButton.astro`), the index page, and the test suite.

The implementation is largely solid — types are well-defined, the `as const satisfies` pattern is correctly used, and the component structure is clean. Three warnings require attention before shipping: a URL encoding bug in the download button that will cause broken downloads in some environments, an incorrect heading hierarchy that harms accessibility and SEO, and a fragile test assertion that will not reliably catch regressions in the roles data. Three informational items note `!important` overuse, code duplication, and test architectural limitations.

---

## Warnings

### WR-01: Unencoded space in PDF href causes broken downloads in some environments

**File:** `src/components/CVDownloadButton.astro:5`
**Issue:** The `href` attribute contains a literal space in the filename: `href="/Dragos Macsim CV 2026.pdf"`. Spaces are not valid in URLs per RFC 3986. While browsers on the same origin often tolerate this when a `download` attribute is also present, Cloudflare Pages (the target host) and some CDN edge nodes may return 404 or 400 for URLs with literal spaces. The `download` attribute filename can keep the display name, but the `href` must be percent-encoded.

**Fix:**
```astro
<a
  href="/Dragos%20Macsim%20CV%202026.pdf"
  download="Dragos Macsim CV 2026.pdf"
  ...
>
```

The public directory file itself can keep its current name — only the `href` value needs encoding. Alternatively, rename the file to use hyphens (`dragos-macsim-cv-2026.pdf`) and update both `href` and `download` to match.

---

### WR-02: Second heading inside section uses `<h2>` instead of `<h3>`, breaking heading hierarchy

**File:** `src/components/CVSection.astro:22`
**Issue:** The outer `<section>` has an `<h2>` for "Experience" (line 10). The "Skills" heading on line 22 is also rendered as `<h2>`, making it a sibling heading rather than a sub-section heading. Semantically, "Skills" is a sub-topic within the "Experience and CV" section. Two `<h2>` elements of equal rank inside the same `<section>` break the document outline, impair screen reader navigation (users skip by heading level), and produce a flat heading tree that search engines may penalise.

**Fix:**
```astro
<!-- Change line 22 from <h2> to <h3> -->
<h3
  class="font-semibold mb-8"
  style={{ fontSize: "var(--font-size-heading)" }}
>
  Skills
</h3>
```

---

### WR-03: Fragile test assertion for roles count does not reliably detect regressions

**File:** `tests/cv-section.test.ts:36-38`
**Issue:** The test "cv.ts roles array has 3 entries" counts occurrences of the text `title:` in the raw file string and asserts `>= 3`. This is fragile in two ways: (1) it counts any occurrence of `title:` in any string literal or comment, so it can false-positive even if the `roles` array shrinks; (2) the `>= 3` lower bound means adding a fourth role does not increase confidence — and removing a role to exactly 3 still passes even if the intent was to assert exactly 3. The assertion does not validate the data structure at all.

**Fix:** Import and test the actual exported array:
```typescript
// In tests/cv-section.test.ts — replace the fragile regex test:
import { roles } from "../src/data/cv";

it("cv.ts roles array has exactly 3 entries", () => {
  expect(roles).toHaveLength(3);
});

it("every role has a non-empty achievements array", () => {
  for (const role of roles) {
    expect(role.achievements.length).toBeGreaterThan(0);
  }
});
```

If importing the module in tests is not viable (e.g., Vitest config excludes `.ts` source files), parse the array literal with a regex that specifically targets array elements within the `roles` block rather than all occurrences of `title:`.

---

## Info

### IN-01: `!important` used unnecessarily in scoped styles

**File:** `src/components/CVDownloadButton.astro:32,35`
**Issue:** The hover and active state overrides use `!important` (`background-color: var(--color-accent-primary-hover) !important`). Since these are Astro-scoped `<style>` rules targeting the single `<a>` element in this component, there are no competing selectors that would require `!important` to win the cascade. The `!important` declarations make future theming harder and are a code smell.

**Fix:**
```css
a:hover {
  background-color: var(--color-accent-primary-hover);
}
a:active {
  background-color: var(--color-accent-primary-press);
}
```

---

### IN-02: Near-identical markup duplicated for work and education entries

**File:** `src/components/ExperienceTimeline.astro:21-58,72-111`
**Issue:** The work experience entry block and the education entry block share nearly identical structure: dot marker, date range `<span>`, `<h3>` with muted subtitle, and body content. The only structural differences are that education entries render a `<p>` instead of a `<ul>`, and optionally render modules. This duplication means visual or spacing changes to the entry layout require updating two places.

**Fix:** Extract a shared `TimelineEntry` sub-component or render-prop pattern. Because this is Astro (not React), a slot-based approach works well:
```astro
<!-- src/components/TimelineEntry.astro -->
---
interface Props {
  dateRange: string;
}
const { dateRange } = Astro.props;
---
<div class="relative pl-0 sm:pl-12 pb-8 sm:pb-12">
  <div class="absolute left-3 top-2 w-2.5 h-2.5 rounded-full -translate-x-1/2 hidden sm:block"
       style="background-color: var(--color-accent-primary);" />
  <span class="text-xs font-semibold uppercase tracking-widest"
        style={`font-size: var(--font-size-label); color: var(--color-text-muted);`}>
    {dateRange}
  </span>
  <slot />
</div>
```

Then both `roles.map` and `education.map` use `<TimelineEntry dateRange={...}>` with different slot content.

---

### IN-03: Test suite tests source file content rather than runtime behaviour; structural bugs will be missed

**File:** `tests/cv-section.test.ts` (all describe blocks)
**Issue:** All 29 tests validate that specific strings exist in source file contents (e.g., `expect(timeline).toContain("color-border")`). This approach cannot catch: wrong prop names passed to child components, a class name present in the file but not applied to the correct element, or a component import that is present but the component is never rendered. For example, if `ExperienceTimeline` were imported but never placed in the template, the test "CVSection.astro imports ExperienceTimeline" would still pass.

**Fix:** Complement the existing source-string tests with at least one integration render test. Astro's Container API (available since Astro 4.9) allows rendering components to HTML in tests:
```typescript
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import CVSection from "../src/components/CVSection.astro";

it("CVSection renders ExperienceTimeline content", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CVSection);
  expect(result).toContain("AI Specialist");
  expect(result).toContain("Scale AI");
});
```

This provides meaningful coverage that the source-string approach cannot.

---

_Reviewed: 2026-04-09T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
