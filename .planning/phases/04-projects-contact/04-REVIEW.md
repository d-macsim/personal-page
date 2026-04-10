---
phase: 04-projects-contact
reviewed: 2026-04-10T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - src/components/AboutSection.astro
  - src/components/ContactSection.astro
  - src/components/ProjectCard.astro
  - src/components/ProjectsSection.astro
  - src/data/contact.ts
  - src/data/projects.ts
  - src/layouts/BaseLayout.astro
  - src/pages/index.astro
  - tests/projects-contact.test.ts
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-04-10
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Nine files reviewed covering the Projects and Contact sections: data modules (`projects.ts`, `contact.ts`), presentational components (`ProjectCard.astro`, `ProjectsSection.astro`, `ContactSection.astro`, `AboutSection.astro`), the base layout (`BaseLayout.astro`), the index page, and the vitest test suite.

The data layer is well-structured: both `projects.ts` and `contact.ts` use `as const satisfies` with `readonly` arrays and interfaces — correct immutable patterns. The Contact section handles `isExternal` and `aria-label` correctly. The hamburger menu script handles null propagation appropriately.

Two warnings require attention before shipping: a hardcoded `aria-label` in `ProjectCard` that will silently break accessibility for any second project added, and a test suite structural issue where `readFileSync` calls execute at describe-block level and will crash the entire suite if any file is missing rather than producing clean per-test failures.

---

## Warnings

### WR-01: ProjectCard aria-label for device frame is hardcoded to "mytai"

**File:** `src/components/ProjectCard.astro:21`
**Issue:** The device frame container has `aria-label="mytai app preview"` as a static string. `ProjectCard` is a generic component that receives any `Project` via props, and `ProjectsSection` is explicitly designed to map over multiple projects (PROJ-02 requirement). When a second project is added, every new card will announce itself as "mytai app preview" to screen readers — a silent accessibility regression that won't be caught by the existing tests.

**Fix:**
```astro
<div
  class="w-full max-w-[240px] mx-auto md:mx-0 md:flex-shrink-0 md:w-[240px] h-[480px] rounded-[2.5rem] overflow-hidden relative"
  style="border: 2px solid var(--color-border); background: var(--color-surface);"
  aria-label={`${project.title} app preview`}
>
```

---

### WR-02: Test suite crashes on missing files instead of reporting clean failures

**File:** `tests/projects-contact.test.ts:13-14, 60-61, 87-88, 131-132`
**Issue:** Each `describe` block calls `readFile(...)` synchronously at the top of the block body (outside any `it()` callback). If a target file does not exist, `readFileSync` throws an unhandled exception that aborts the entire test collection for that describe block — vitest will report a suite-level error rather than individual test failures with meaningful names. This makes diagnostics harder during TDD's RED phase when files are not yet created.

The `existsSync` checks inside `it()` callbacks come too late to guard the reads at describe-block level (e.g., line 15 checks existence but lines 13-14 already read the file unconditionally).

**Fix:** Wrap top-level reads with a guard, or move reads inside each `it()` callback:
```typescript
// Option A: guard at describe level
const projectCardPath = join(ROOT, "src/components/ProjectCard.astro");
const projectCard = existsSync(projectCardPath)
  ? readFileSync(projectCardPath, "utf-8")
  : "";

// Option B: read inside each it() that needs the file
it("ProjectCard contains device frame placeholder", () => {
  const projectCard = readFile("src/components/ProjectCard.astro");
  expect(projectCard).toContain('aria-label="mytai app preview"');
});
```

Option A is the lower-effort change; Option B improves isolation but requires refactoring all tests.

---

## Info

### IN-01: HTML default theme class locks dark mode when JavaScript is disabled

**File:** `src/layouts/BaseLayout.astro:16`
**Issue:** `<html lang="en" class="dark">` hard-codes the dark theme on the `<html>` element. When JavaScript is disabled the theme toggle cannot run, and the page is permanently dark with no fallback. Most portfolio visitors will have JS enabled, but this is worth noting.

**Fix:** Add a `<noscript>` style block or a `prefers-color-scheme` CSS media query as a fallback so users without JS see their OS preference rather than forced dark:
```html
<style>
  @media (prefers-color-scheme: light) {
    html:not(.dark):not(.light) {
      /* light theme tokens */
    }
  }
</style>
```
Alternatively, set the `class` via an inline `<script>` that runs before paint (to avoid flash-of-wrong-theme) and removes the hard-coded default.

---

### IN-02: Page title uses double-hyphen separator instead of em-dash or pipe

**File:** `src/pages/index.astro:10`
**Issue:** `title="Dragos Macsim -- AI Specialist & Product Builder"` uses `--` (two hyphens) rather than an em-dash (`—`) or the conventional `|` separator. This shows verbatim in browser tabs, bookmarks, and search engine results snippets.

**Fix:**
```astro
<BaseLayout title="Dragos Macsim — AI Specialist & Product Builder">
```

---

### IN-03: ContactSection hover style uses !important in scoped CSS

**File:** `src/components/ContactSection.astro:83`
**Issue:** `.contact-link:hover` uses `color: var(--color-accent-primary) !important` and `border-color: ... !important` to override the inline `style` attribute set in the template. This works but is a fragile pattern — `!important` in component CSS fights against the inline style rather than eliminating the conflict at its source. The same pattern appears in `ProjectCard.astro:109-113`.

**Fix:** Remove the inline `style` color and border from the `<a>` element and apply them as CSS class rules in the `<style>` block alongside the hover state, so both normal and hover states live in one place with normal specificity:
```astro
<!-- Remove from template: style={{ backgroundColor: ..., border: ..., color: ... }} -->

<style>
  .contact-link {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }
  .contact-link:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
</style>
```

---

_Reviewed: 2026-04-10_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
