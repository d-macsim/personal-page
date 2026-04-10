---
phase: 05-animations-deploy
reviewed: 2026-04-10T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - .node-version
  - public/_headers
  - src/components/AboutSection.astro
  - src/components/ContactSection.astro
  - src/components/CVSection.astro
  - src/components/ExperienceTimeline.astro
  - src/components/ProjectsSection.astro
  - src/components/SkillsGrid.astro
  - src/styles/global.css
findings:
  critical: 1
  warning: 4
  info: 3
  total: 8
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-04-10T00:00:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

This phase introduces scroll-reveal animations (`reveal` / `reveal-stagger` CSS classes), deployment headers, and several UI sections. The overall quality is solid: progressive enhancement is handled correctly with `@supports (animation-timeline: view())` and `prefers-reduced-motion` guards, and the component code is clean and readable.

There is one critical security gap: the `public/_headers` file is incomplete — the URL path pattern and `Content-Security-Policy` header are absent, meaning security headers are not actually served by Cloudflare Pages. Four warnings cover a duplicate heading level in CVSection, a missing `role="list"` accessibility gap, inconsistent reveal annotation coverage, and a potential invisible-content risk for the hero when `animation-timeline` support is absent on an ancestor element. Three info items cover minor quality improvements.

---

## Critical Issues

### CR-01: `_headers` file missing URL pattern — security headers never sent

**File:** `public/_headers:1`
**Issue:** Cloudflare Pages (and Netlify) `_headers` files require a URL pattern line before each block of headers. The file starts directly with header directives, with no path pattern. Without a pattern such as `/*`, all listed headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`) are silently ignored and never served.

Additionally, there is no `Content-Security-Policy` header, which is a meaningful omission for a site that loads external font CDN assets and inline SVGs.

**Fix:**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; script-src 'self'; frame-ancestors 'none'
```

The CSP above is a conservative starting point — adjust `style-src` if you load external stylesheets, and `img-src` if remote images are used.

---

## Warnings

### WR-01: Duplicate `<h2>` used for "Skills" inside CVSection — heading hierarchy broken

**File:** `src/components/CVSection.astro:21-26`
**Issue:** The section already has an `<h2>` for "Experience" at line 9. A second `<h2>` is rendered inside the same section for "Skills". Screen readers and search engines interpret two sibling `<h2>` elements inside the same section as equal-rank landmarks, which breaks document outline and makes navigation harder for assistive technology users. "Skills" is a sub-topic within the Experience/CV section and should be `<h3>`.

**Fix:**
```astro
{/* line 21-26 — change h2 → h3 */}
<h3
  class="font-semibold mb-8"
  style={{ fontSize: "var(--font-size-heading)" }}
>
  Skills
</h3>
```

### WR-02: `<ul>` achievement list in ExperienceTimeline lacks `role="list"` — VoiceOver list semantics stripped by CSS reset

**File:** `src/components/ExperienceTimeline.astro:47`
**Issue:** `list-style: none` (applied by Tailwind's `list-disc list-inside` — actually `list-disc` does keep bullets, but any future removal of `list-disc` or reset via Tailwind preflight will strip the list role in Safari/VoiceOver). More concretely, Tailwind's preflight sets `list-style: none` on `ul` by default, and Safari VoiceOver de-lists any `<ul>` that has `list-style: none`. Adding `role="list"` explicitly ensures the semantic is preserved regardless of CSS state.

**Fix:**
```astro
<ul class="mt-2 space-y-1 list-disc list-inside" role="list">
```

### WR-03: `reveal-stagger` container in ExperienceTimeline wraps all timeline entries including the education separator div — separator animates as a list item

**File:** `src/components/ExperienceTimeline.astro:12`
**Issue:** The outermost `<div class="relative reveal-stagger">` makes every direct child a stagger target. This includes the education separator `<div>` at line 62 and the education entries. The separator label ("Education") will animate in as stagger child n+5 or n+6, which may cause it to appear out of order relative to the entries immediately following it (which continue animating from the same stagger slot). The intent was presumably to stagger only the timeline entry cards, not section labels.

**Fix:** Wrap only the work experience entries and only the education entries in their own `reveal-stagger` containers, and leave the separator outside:

```astro
<div class="relative">
  {/* Spine line */}
  ...

  <div class="reveal-stagger">
    {roles.map((role) => ( ... ))}
  </div>

  {/* Education separator — not a stagger child */}
  <div class="relative pl-0 sm:pl-12 mt-8 mb-4">
    <div class="text-xs font-semibold uppercase tracking-widest" ...>
      Education
    </div>
  </div>

  <div class="reveal-stagger">
    {education.map((entry) => ( ... ))}
  </div>
</div>
```

### WR-04: `reveal` class on `.max-w-[1100px]` wrapper in ProjectsSection — animation-range may fire before content enters viewport on short screens

**File:** `src/components/ProjectsSection.astro:7`
**Issue:** The `reveal` class triggers `animation-range: entry 0% entry 40%`. When the `max-w-[1100px]` container is the animation subject and the content inside is tall (multiple project cards), the `entry 0%` point fires as soon as the very top edge of the container enters the viewport. On shorter screens or when many projects are listed, the container's bottom is still far below the fold, and `entry 40%` may complete before the user has scrolled to actually see the cards. The visible cards therefore animate in fully, then the ones scrolled-into-view later appear statically.

Applying `reveal` to individual cards (or using `reveal-stagger` on the grid) rather than the whole section wrapper gives correct per-card triggering.

**Fix:**
```astro
{/* Remove reveal from section wrapper, apply to grid directly */}
<section id="projects" aria-label="Projects" class="py-16 md:py-24">
  <div class="max-w-[1100px] mx-auto">
    <h2 ...>Projects</h2>
    <div class="grid grid-cols-1 gap-8 reveal-stagger">
      {projects.map((project) => <ProjectCard project={project} />)}
    </div>
  </div>
</section>
```

---

## Info

### IN-01: CVSection — `ExperienceTimeline` and `SkillsGrid` have no `reveal` wrapper, only CVDownloadButton does

**File:** `src/components/CVSection.astro:16-32`
**Issue:** The `reveal` class is applied only to the `CVDownloadButton` div at line 30. The `ExperienceTimeline` and `SkillsGrid` components apply `reveal-stagger` internally, but the wrapping `<div class="max-w-2xl">` containers (lines 16 and 20) have no reveal treatment. This is intentional and correct — the child components handle their own reveal. However, there is no reveal on the section heading `<h2>` at line 9-13 either, so it appears statically while all child content animates in. For visual consistency, consider adding `reveal` to the heading.

**Fix:**
```astro
<h2
  class="font-semibold mb-12 reveal"
  style={{ fontSize: "var(--font-size-heading)" }}
>
  Experience
</h2>
```

### IN-02: AboutSection photo and bio block wrapped in single `reveal` — no stagger between photo and text

**File:** `src/components/AboutSection.astro:14`
**Issue:** The entire `<div class="reveal">` at line 14 wraps photo, bio text, and the highlight cards together as a single animation unit. The highlight cards (`HighlightCard`) at lines 43-49 also animate inside that same `reveal` block rather than independently. This is a deliberate simplification but means users see the whole block pop in together, which reduces the polish benefit of the reveal animation. Consider using `reveal-stagger` so photo, bio, and cards each animate in sequence.

**Fix:** Replace `<div class="reveal">` with `<div class="reveal-stagger">` if individual child reveal is desired, or keep the current approach if a single-block entrance is intentional.

### IN-03: Magic number `0.16` opacity in reduced-motion `.glow-pulse` fallback has no comment explaining its origin

**File:** `src/styles/global.css:128`
**Issue:** `opacity: 0.16` is used as the static fallback value for `.glow-pulse` under `prefers-reduced-motion`. The animated range is `0.3` to `0.55`, so `0.16` is lower than the animated minimum and its origin is unclear. A comment would help future maintainers understand the intent (presumably a subtler, less distracting static appearance).

**Fix:**
```css
@media (prefers-reduced-motion: reduce) {
  .glow-pulse {
    animation: none;
    opacity: 0.16; /* Static fallback — dimmer than animated range (0.3–0.55) to reduce visual weight */
  }
}
```

---

_Reviewed: 2026-04-10T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
