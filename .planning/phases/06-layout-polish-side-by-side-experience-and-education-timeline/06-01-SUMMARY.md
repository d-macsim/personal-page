---
phase: 06-layout-polish-side-by-side-experience-and-education-timeline
plan: 01
subsystem: cv-section
tags: [layout, timeline, refactor, astro, tailwind]
dependency_graph:
  requires: []
  provides: [TimelineColumn.astro, two-column-cv-layout]
  affects: [src/components/CVSection.astro, src/components/TimelineColumn.astro]
tech_stack:
  added: []
  patterns: [generic-component-with-mapped-data, css-grid-two-column]
key_files:
  created:
    - src/components/TimelineColumn.astro
  modified:
    - src/components/CVSection.astro
    - tests/cv-section.test.ts
    - tests/phase5-animations.test.ts
  deleted:
    - src/components/ExperienceTimeline.astro
decisions:
  - Generic TimelineColumn with mapped data at call site (CVSection) — keeps component domain-agnostic
  - Dot alignment fix: left-4 (16px) instead of left-3 (12px) centers dot on spine bar
  - Two-column grid: grid-cols-1 md:grid-cols-2 gap-12 — mobile-first, no JS
  - ExperienceTimeline.astro deleted — fully replaced by TimelineColumn.astro
metrics:
  duration: 126s
  completed_date: "2026-04-10"
  tasks_completed: 2
  files_modified: 5
---

# Phase 06 Plan 01: Two-Column Experience & Education Timeline Summary

**One-liner:** Refactored CV section from single-column to two-column side-by-side layout with fixed dot-spine alignment using a generic TimelineColumn.astro component.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create TimelineColumn.astro and refactor CVSection to two-column grid | ad76f1b | TimelineColumn.astro (created), CVSection.astro (updated), ExperienceTimeline.astro (deleted) |
| 2 | Update tests for renamed component and new layout structure | ef47090 | tests/cv-section.test.ts, tests/phase5-animations.test.ts |

## What Was Built

- **TimelineColumn.astro**: Generic timeline column component accepting `title` and `entries: readonly TimelineEntry[]` props. No CV-domain knowledge — all data mapping happens in CVSection.
- **CVSection.astro**: Refactored to `grid grid-cols-1 md:grid-cols-2 gap-12` layout. Maps `roles` and `education` to `TimelineEntry[]` at call site. Section h2 renamed from "Experience" to "Experience & Education".
- **Dot alignment fix**: `left-4` (16px) on dot element now matches spine's `left-4` (16px), centering the dot precisely on the spine bar. Previous value `left-3` (12px) was 4px misaligned.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed phase5-animations.test.ts referencing deleted ExperienceTimeline.astro**
- **Found during:** Task 2 — full test suite run after updating cv-section.test.ts
- **Issue:** `tests/phase5-animations.test.ts` Test 9 read `ExperienceTimeline.astro` to assert it contains `reveal-stagger`. After deletion, the test threw ENOENT.
- **Fix:** Updated Test 9 to read `TimelineColumn.astro` instead (which also has `reveal-stagger` on its root div).
- **Files modified:** tests/phase5-animations.test.ts
- **Commit:** ef47090 (included with Task 2 commit)

## Verification Results

- `npm run build`: PASS — 1 page built in 889ms, no errors
- `npx vitest run`: PASS — 8 test files, 217 tests all passing
- `grep -c "left-3" src/components/TimelineColumn.astro`: 0 (no misaligned value)
- `grep -c "md:grid-cols-2" src/components/CVSection.astro`: 1
- `test ! -f src/components/ExperienceTimeline.astro`: DELETED

## Known Stubs

None — all data wired from src/data/cv.ts via roles.map and education.map in CVSection.

## Threat Flags

None — purely static layout refactor with no new network endpoints, auth paths, or trust boundaries.

## Self-Check: PASSED

- src/components/TimelineColumn.astro: FOUND
- src/components/CVSection.astro: FOUND (modified)
- tests/cv-section.test.ts: FOUND (modified)
- tests/phase5-animations.test.ts: FOUND (modified)
- src/components/ExperienceTimeline.astro: DELETED (confirmed)
- Commit ad76f1b: FOUND
- Commit ef47090: FOUND
