---
phase: quick
plan: 260410-njv
subsystem: cv-timeline
tags: [timeline, alignment, layout, visual-fix]
dependency_graph:
  requires: []
  provides: [clean-timeline-layout]
  affects: [TimelineColumn, CVSection, cv.ts]
tech_stack:
  added: []
  patterns: [astro-component, static-data]
key_files:
  created: []
  modified:
    - src/components/TimelineColumn.astro
    - src/components/CVSection.astro
    - src/data/cv.ts
decisions:
  - Spine wrapper moved to inner div so it starts below the section h3
  - Dot top offset set to top-[1.25rem] to align with heading text row
  - Body rendering removed from TimelineColumn entirely (body field kept in interface)
  - CVSection passes body: [] to prevent data leaking if rendering re-enabled
metrics:
  duration: ~2min
  completed: 2026-04-10
---

# Quick Fix 260410-njv: Fix Timeline Visual Issues Summary

**One-liner:** Fixed four timeline visual issues — spine overlap with h3, dot misalignment with heading text, body text rendering, and UCL name abbreviation.

## What Was Done

### Task 1 — Fix TimelineColumn spine and dot alignment, remove body rendering

Rewrote `TimelineColumn.astro` structure:

- **Spine overlap fix:** Removed `relative` from the outer `div.reveal-stagger` wrapper. Added a new inner `<div class="relative">` that wraps only the entries list. The spine `absolute` div now lives inside this inner wrapper, so it starts at the top of the first entry — below the section h3.
- **Dot alignment fix:** Changed dot vertical position from `top-2` (8px, aligned with date label) to `top-[1.25rem]` (20px, aligned with the heading text below the date label).
- **Body removal:** Deleted the `<ul>` block that rendered `entry.body`. The `body: string[]` field remains in the TypeScript interface for backward compatibility but is not rendered.

### Task 2 — Strip body from CVSection entries and rename UCL in cv.ts

- **CVSection.astro:** Updated both `experienceEntries` and `educationEntries` mappings to pass `body: []` instead of achievement arrays or education detail strings. Prevents body data from being passed to the component even if rendering is later re-enabled.
- **cv.ts:** Changed `institution: "University College London (UCL)"` to `institution: "UCL"` for the BSc entry.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None. All changes are static content restructuring with no new network surface or trust boundaries.

## Self-Check: PASSED

- `src/components/TimelineColumn.astro` — modified, verified exists
- `src/components/CVSection.astro` — modified, verified exists
- `src/data/cv.ts` — modified, verified exists
- Commit f71e414 — Task 1
- Commit 7d2ece5 — Task 2
- Both commits confirmed in git log
- Build passes: `npm run build` completed with 0 errors
