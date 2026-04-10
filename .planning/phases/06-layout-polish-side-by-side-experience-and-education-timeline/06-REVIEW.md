---
phase: 06-layout-polish-side-by-side-experience-and-education-timeline
reviewed: 2026-04-10T00:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - src/components/TimelineColumn.astro
  - src/components/CVSection.astro
  - tests/cv-section.test.ts
  - tests/phase5-animations.test.ts
findings:
  critical: 0
  warning: 4
  info: 2
  total: 6
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-04-10T00:00:00Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

This phase introduces the side-by-side experience/education timeline layout (`TimelineColumn.astro`, `CVSection.astro`) and adds animation reveal classes. The implementation is largely sound and the test coverage is reasonable. No critical security or data-loss issues were found.

Four warnings are flagged: two heading hierarchy bugs in the rendered HTML (incorrect heading levels affect accessibility and screen-reader navigation), one fragile test that passes vacuously when the CSS it checks is missing, and one URL encoding issue in the CV download href that is locked in by its own test. Two info items cover a regex-based test anti-pattern and an inline style inconsistency.

## Warnings

### WR-01: Duplicate heading level — entry headings use `<h3>` nested under a column `<h3>`

**File:** `src/components/TimelineColumn.astro:46`
**Issue:** The column title is rendered as `<h3>` (line 18) and each timeline entry heading is also rendered as `<h3>` (line 46). This creates sibling `<h3>` elements at the same DOM depth, violating the heading hierarchy. Screen readers and assistive technology expect subheadings to step down one level from their parent heading. Entry headings should be `<h4>` since they are children of the column-level `<h3>`.
**Fix:**
```astro
{/* Change line 46 from <h3> to <h4> */}
<h4 class="font-semibold mt-0.5" style="color: var(--color-text);">
  {entry.heading}
  <span style="color: var(--color-text-muted);" class="font-normal">
    {" "}&middot; {entry.subheading}
  </span>
</h4>
```

---

### WR-02: Two sibling `<h2>` elements inside a single `<section>`

**File:** `src/components/CVSection.astro:27` and `src/components/CVSection.astro:39`
**Issue:** The `<section id="experience">` contains two `<h2>` headings: "Experience & Education" (line 27) and "Skills" (line 39). Two `<h2>` headings at the same level inside one section is semantically ambiguous — assistive technology will expose both as top-level section headings without a clear parent-child relationship. "Skills" is a sub-topic of the CV section and should be `<h3>`.
**Fix:**
```astro
{/* Change line 39 from <h2> to <h3> */}
<h3
  class="font-semibold mb-8"
  style={{ fontSize: "var(--font-size-heading)" }}
>
  Skills
</h3>
```

---

### WR-03: Test 7 (`phase5-animations.test.ts:69`) passes vacuously when `@supports (animation-timeline: view())` block is absent

**File:** `tests/phase5-animations.test.ts:69`
**Issue:** The test locates the positive `@supports (animation-timeline: view())` block via `indexOf(...)`. If this exact string does not exist in `global.css` (e.g., because only the `@supports not (...)` variant is present), `supportsIdx` is `-1` and `supportsBlock` becomes the entire CSS string starting from the end. The subsequent `nthChildIdx` search may return `-1`, causing `nthChildContext` to be an empty string. An empty string does not contain `"animation-delay"` (assertion passes) and does not contain `"animation-range"` — but that second assertion would **fail**. However if `supportsIdx` is `-1` and the entire string is sliced from position `-1`, the context would start at the last character, meaning `nthChildIdx` would also be -1, and `slice(-1, 99)` would produce a near-empty string causing the `toContain("animation-range")` assertion to fail. This means the test does correctly fail when the block is missing, but the failure message ("expected '' to contain 'animation-range'") gives no useful diagnostic. More importantly, if `:nth-child(2)` appears only outside the supports block, `nthChildContext` could match an unrelated rule. The test should explicitly assert `supportsIdx !== -1` before proceeding.
**Fix:**
```typescript
// Add guard before line 73
const supportsIdx = globalCss.indexOf("@supports (animation-timeline: view())");
expect(supportsIdx).toBeGreaterThan(-1); // Fail with clear message if block missing

const supportsBlock = globalCss.slice(supportsIdx);
const nthChildIdx = supportsBlock.indexOf(":nth-child(2)");
expect(nthChildIdx).toBeGreaterThan(-1); // Fail with clear message if selector missing
const nthChildContext = supportsBlock.slice(nthChildIdx, nthChildIdx + 100);
expect(nthChildContext).not.toContain("animation-delay");
expect(nthChildContext).toContain("animation-range");
```

---

### WR-04: Unencoded space in CV download `href` locked in by test assertion

**File:** `tests/cv-section.test.ts:133`
**Issue:** The test asserts `href="/Dragos Macsim CV 2026.pdf"` — a URL containing unencoded spaces. Unencoded spaces in `href` attributes are technically invalid per RFC 3986 and may behave unexpectedly in some HTTP clients or link parsers. The test locks in the broken value, meaning any attempt to fix the source component will break the test. The href should be percent-encoded (`/Dragos%20Macsim%20CV%202026.pdf`) or the file renamed to remove spaces.
**Fix:**
```typescript
// tests/cv-section.test.ts line 133
it("contains correct href pointing to PDF", () => {
  expect(downloadButton).toContain('href="/Dragos%20Macsim%20CV%202026.pdf"');
});

// tests/cv-section.test.ts line 136
it("contains download attribute with exact filename", () => {
  // The download attribute preserves the original filename for the save dialog
  expect(downloadButton).toContain('download="Dragos Macsim CV 2026.pdf"');
});
```

And in `CVDownloadButton.astro`, update the href:
```astro
<a href="/Dragos%20Macsim%20CV%202026.pdf" download="Dragos Macsim CV 2026.pdf" ...>
```

---

## Info

### IN-01: Fragile role-count test uses broad regex that matches any `title:` key

**File:** `tests/cv-section.test.ts:36`
**Issue:** `cvData.match(/title:/g)` counts every occurrence of `title:` in the entire `cv.ts` file, not just role titles. If skill categories, education entries, or any other objects in `cv.ts` gain a `title:` property, the count increases and the test continues to pass — providing false assurance. The test comment says "3 roles each have a title:" but the assertion does not enforce an exact count.
**Fix:** Narrow the regex to match only within the `roles` array, or assert an exact count:
```typescript
// More precise: count role title lines
const roleSection = cvData.slice(cvData.indexOf("export const roles"), cvData.indexOf("export const education"));
const titleMatches = roleSection.match(/title:/g);
expect(titleMatches?.length).toBe(3);
```

---

### IN-02: Inconsistent inline style syntax between `TimelineColumn.astro` and `CVSection.astro`

**File:** `src/components/TimelineColumn.astro:40`
**Issue:** Most inline styles in `TimelineColumn.astro` use string syntax (`style="color: var(--color-text);"`) while `CVSection.astro` uses JSX object syntax (`style={{ fontSize: "var(--font-size-heading)" }}`). Line 40 in `TimelineColumn.astro` uses a template-string style attribute: `` style={`font-size: var(--font-size-label); color: var(--color-text-muted);`} ``. Mixing the three forms (string literal, template string, and JSX object) is inconsistent. Astro accepts all three, but picking one convention and applying it throughout both files improves readability.
**Fix:** Standardise on JSX object syntax to match `CVSection.astro`:
```astro
<span
  class="text-xs font-semibold uppercase tracking-widest"
  style={{ fontSize: "var(--font-size-label)", color: "var(--color-text-muted)" }}
>
```

---

_Reviewed: 2026-04-10T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
