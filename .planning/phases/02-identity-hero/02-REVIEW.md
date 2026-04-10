---
phase: 02-identity-hero
reviewed: 2026-04-09T19:06:00Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - src/components/HeroSection.tsx
  - src/components/AboutSection.astro
  - src/components/PhotoPlaceholder.astro
  - src/components/HighlightCard.astro
  - src/components/Head.astro
  - src/pages/index.astro
  - src/styles/global.css
  - astro.config.mjs
  - tests/hero-section.test.ts
  - tests/about-section.test.ts
  - tests/seo-metadata.test.ts
findings:
  critical: 0
  warning: 3
  info: 3
  total: 6
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-09T19:06:00Z
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

The Phase 2 implementation covers the Hero section (React island with Motion animations), About section (static Astro), SEO metadata (Head component with OG tags and JSON-LD), and supporting design system tokens. Code quality is generally solid: accessibility is well-handled (aria labels, reduced motion support), the Astro island architecture is correctly applied (HeroSection uses `client:load`, AboutSection is server-only), and the test suite (123 tests passing) provides good coverage of content and structure.

Three warnings were identified: a missing try-catch around `localStorage` access in the inline theme script (can throw in restricted browsing contexts), a hardcoded color value bypassing the design token system, and a space in the CV download URL that may cause issues on certain servers. Three informational items note opportunities for minor improvements.

## Warnings

### WR-01: localStorage access without try-catch in inline theme script

**File:** `src/components/Head.astro:49`
**Issue:** The inline theme detection script calls `localStorage.getItem("theme")` without error handling. In Safari private browsing (older versions), embedded webviews, and some enterprise browser configurations, `localStorage` access throws a `SecurityError`. Since this script runs synchronously in `<head>` before any content renders, an uncaught exception here would block all subsequent inline scripts.
**Fix:**
```javascript
(function() {
  try {
    var stored = localStorage.getItem("theme");
  } catch (e) {
    var stored = null;
  }
  if (stored === "light") {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else if (stored === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    var systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (systemLight) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }
})();
```

### WR-02: Hardcoded color value bypasses design token system

**File:** `src/components/HeroSection.tsx:84`
**Issue:** The primary CTA button uses `color: "#ffffff"` as a hardcoded hex value. All other colors in the codebase reference CSS custom properties (e.g., `var(--color-text)`). This hardcoded value will not respond to theme changes -- in light mode, white text on the primary button may still work due to the indigo background, but it breaks the design token contract and makes future theming harder.
**Fix:** Define a token for text on accent backgrounds (e.g., `--color-on-accent`) in `global.css` and reference it:
```tsx
color: "var(--color-on-accent)",
```
Or at minimum use a token that already exists if white-on-accent is intentional for both themes.

### WR-03: Space in CV download URL

**File:** `src/components/HeroSection.tsx:97`
**Issue:** The CV download link `href="/Dragos Macsim CV 2026.pdf"` contains unencoded spaces. While modern browsers handle this, some HTTP servers, CDN edge caches, and link-checking tools may not resolve the URL correctly. Cloudflare Pages (the target host per CLAUDE.md) handles spaces in filenames, but the URL is fragile for sharing -- if someone copies/pastes it, the spaces may break.
**Fix:** Rename the file to use hyphens (`/dragos-macsim-cv-2026.pdf`) or URL-encode the href:
```tsx
href="/Dragos%20Macsim%20CV%202026.pdf"
```

## Info

### IN-01: Hover state managed via React state instead of CSS

**File:** `src/components/HeroSection.tsx:14-15`
**Issue:** Two `useState` hooks (`primaryHover`, `ghostHover`) manage button hover styles via `onMouseEnter`/`onMouseLeave`. This adds React state updates and re-renders for something CSS `:hover` handles natively with zero JavaScript. Since the hover styles are simple color changes, CSS pseudo-classes would be more efficient and simpler.
**Fix:** Apply hover styles via Tailwind classes or a CSS class with `:hover` pseudo-selector instead of inline style toggling. If inline CSS variables make `:hover` awkward, consider a small CSS class:
```css
.btn-primary:hover {
  background-color: var(--color-accent-primary-hover);
}
```

### IN-02: Redundant font import in BaseLayout.astro

**File:** `src/layouts/BaseLayout.astro:2` (not in review scope but referenced)
**Issue:** `BaseLayout.astro` imports `@fontsource-variable/inter` via a JS import, while `global.css` (line 4) also imports it via `@import "@fontsource-variable/inter"`. The font is loaded twice. This is a minor duplication -- bundlers typically deduplicate it, but the redundancy is unnecessary.
**Fix:** Remove one of the two imports. Since the CSS `@import` in `global.css` is the canonical location for design system setup, remove the JS import from `BaseLayout.astro`.

### IN-03: Tests use string matching on source code rather than DOM rendering

**File:** `tests/hero-section.test.ts`, `tests/about-section.test.ts`, `tests/seo-metadata.test.ts`
**Issue:** All test files read raw source code via `readFileSync` and assert on string contents (e.g., `expect(heroTsx).toContain("Dragos Macsim")`). While pragmatic and fast, these tests verify that specific strings exist in source code -- not that the component actually renders them. A renamed variable, template literal, or extracted constant would break these tests even if the rendered output is identical. This is acceptable for early-phase development but should eventually be supplemented with rendered-output tests (e.g., using `@astrojs/test-utils` or Playwright).
**Fix:** No immediate action needed. Consider adding integration tests that render components and assert on HTML output in a later phase.

---

_Reviewed: 2026-04-09T19:06:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
