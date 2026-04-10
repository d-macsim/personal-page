---
phase: 02-identity-hero
plan: 01
subsystem: ui
tags: [motion, react, animation, hero, astro-island]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: BaseLayout, global.css design tokens, ThemeToggle, Astro+React+Tailwind stack
provides:
  - Animated HeroSection React island with Motion v12 staggered fade-up
  - Glow pulse CSS animation for radial indigo backdrop
  - Two CTA buttons (View my work, Download CV)
  - Scroll indicator chevron
  - prefers-reduced-motion accessibility support
affects: [02-identity-hero plan 02, 05-animations]

# Tech tracking
tech-stack:
  added: [motion@12.38.0]
  patterns: [Astro React island with client:load for above-fold animated content, Motion v12 useReducedMotion for a11y, CSS keyframe animation for non-interactive glow effects]

key-files:
  created:
    - src/components/HeroSection.tsx
    - tests/hero-section.test.ts
  modified:
    - src/styles/global.css
    - src/pages/index.astro
    - package.json
    - package-lock.json

key-decisions:
  - "Motion v12 imported from motion/react (not framer-motion) per rebranded package"
  - "Glow pulse uses CSS keyframes (not Motion) since it is non-interactive continuous animation"
  - "useState for button hover state to apply CSS variable-based color changes inline"

patterns-established:
  - "React island pattern: use client:load for above-fold animated content, keep static sections as Astro components"
  - "Motion item helper: reusable function returning initial/animate/transition props with reduced-motion bypass"
  - "CSS variable inline styles: reference design tokens via var() in React style props for theme-aware components"

requirements-completed: [HERO-01, HERO-02, HERO-03]

# Metrics
duration: 1min
completed: 2026-04-09
---

# Phase 2 Plan 1: Hero Section Summary

**Motion v12 animated hero island with staggered fade-up entrance, radial indigo glow pulse, two CTA buttons, scroll indicator, and prefers-reduced-motion support**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-09T17:44:20Z
- **Completed:** 2026-04-09T17:45:47Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- HeroSection.tsx renders as Motion v12 React island with 5-step staggered fade-up animation (0ms to 600ms)
- Radial indigo glow with CSS pulse keyframe animation (4s ease-in-out cycle)
- Two CTA buttons: "View my work" (indigo filled, links to #projects) and "Download CV" (amber ghost, triggers PDF download)
- Full prefers-reduced-motion support via useReducedMotion hook and CSS media query
- 15 new hero tests passing alongside existing Phase 1 tests (79 total)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Motion v12 and create animated HeroSection React island** - no git (non-git project)
2. **Task 2: Create hero section tests (static file analysis)** - no git (non-git project)

## Files Created/Modified
- `src/components/HeroSection.tsx` - Animated hero React island with Motion v12 staggered entrance
- `tests/hero-section.test.ts` - Static file analysis tests for hero requirements (HERO-01, HERO-02, HERO-03)
- `src/styles/global.css` - Added glowPulse keyframes and .glow-pulse class with reduced-motion fallback
- `src/pages/index.astro` - Replaced placeholder with HeroSection island using client:load
- `package.json` - Added motion@12.38.0 dependency
- `package-lock.json` - Lock file updated for motion and sub-dependencies

## Decisions Made
- Used `motion/react` import path (not `framer-motion`) per Motion v12 rebrand
- Glow pulse implemented as CSS keyframe animation rather than Motion animation since it is a continuous non-interactive effect
- Button hover states managed via React useState to apply CSS variable-based colors inline, avoiding Tailwind arbitrary value complexity for theme-aware hover colors
- Used `?? false` for useReducedMotion return value to handle potential null in SSR context

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hero section complete and building successfully
- Ready for Plan 02 (About section, highlight cards, SEO metadata)
- HeroSection establishes the React island + Motion pattern for any future animated components

---
*Phase: 02-identity-hero*
*Completed: 2026-04-09*

## Self-Check: PASSED

- All 4 key files found on disk
- `npm run build` completes successfully (923ms)
- `npm test` passes all 79 tests across 3 test files
