---
phase: 08-quality-hardening
plan: 01
subsystem: layout-foundation
tags: [404, print, view-transitions, astro, devdeps]
dependency_graph:
  requires: []
  provides: [custom-404-page, print-stylesheet, view-transitions, page-load-reinit]
  affects: [src/layouts/BaseLayout.astro, src/styles/global.css, src/pages/404.astro]
tech_stack:
  added: ["@lhci/cli", "@axe-core/playwright"]
  patterns: [ClientRouter-view-transitions, astro-page-load-event, print-media-query]
key_files:
  created:
    - src/pages/404.astro
  modified:
    - src/styles/global.css
    - src/layouts/BaseLayout.astro
    - package.json
    - package-lock.json
decisions:
  - "ClientRouter placed in <head> via astro:transitions built-in (no external package)"
  - "All nav script logic wrapped in initPage() registered via astro:page-load (not called directly to avoid double-binding)"
  - "transition:persist on nav element so nav bar does not re-render on page transitions"
  - "Print stylesheet appended to global.css (not a separate file) to keep stylesheet surface minimal"
  - "404 page uses minimal branded tone per D-08 — matches site character"
metrics:
  duration: ~4min
  completed: "2026-04-12"
  tasks_completed: 2
  files_changed: 5
---

# Phase 08 Plan 01: Quality Foundations — 404, Print, View Transitions Summary

**One-liner:** Custom branded 404 page, recruiter print stylesheet, and Astro ClientRouter view transitions with astro:page-load nav re-initialisation.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install devDeps, create 404 page, add @media print | ec901a9 | src/pages/404.astro, src/styles/global.css, package.json |
| 2 | Add ClientRouter view transitions, wrap nav in astro:page-load | ef47581 | src/layouts/BaseLayout.astro |

## What Was Built

### Task 1: devDependencies + 404 page + Print Stylesheet
- Installed `@lhci/cli` and `@axe-core/playwright` as devDependencies (needed for Plans 02 and 03)
- Created `src/pages/404.astro` — branded 404 with accent-coloured "404" heading, "Page not found" message, and "Back to home" button using design tokens
- Appended `@media print` block to `global.css` that: hides nav, theme toggle, hamburger, mobile menu, and glow-pulse; resets all colours to black on white; disables all animations/transitions; shows external link URLs inline via CSS `content: attr(href)`; avoids page breaks inside sections; removes main max-width constraint

### Task 2: View Transitions + Page Load Re-init
- Imported `ClientRouter` from `astro:transitions` and placed it in `<head>` in BaseLayout
- Added `transition:persist` to the `<nav>` element so it persists across page transitions without re-rendering
- Extracted all script logic into `setupNavObserver()` (IntersectionObserver) and `initPage()` (hamburger, mobile menu, smooth scroll, /now active detection)
- Registered `initPage` via `document.addEventListener("astro:page-load", initPage)` — fires on both initial load and after each ClientRouter navigation; no direct `initPage()` call to avoid double-binding

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundaries introduced.

## Self-Check: PASSED

- src/pages/404.astro exists: FOUND
- src/styles/global.css contains @media print: FOUND
- src/layouts/BaseLayout.astro contains ClientRouter: FOUND
- src/layouts/BaseLayout.astro contains astro:page-load: FOUND
- src/layouts/BaseLayout.astro contains transition:persist: FOUND
- package.json contains @lhci/cli: FOUND
- package.json contains @axe-core/playwright: FOUND
- Commit ec901a9: FOUND
- Commit ef47581: FOUND
- npm run build: PASSED (3 pages built successfully)
