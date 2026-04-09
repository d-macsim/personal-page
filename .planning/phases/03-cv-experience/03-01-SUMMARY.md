---
phase: 03-cv-experience
plan: "01"
subsystem: cv-data-and-timeline
tags: [data-layer, components, timeline, experience, education]
dependency_graph:
  requires: [02-01, 02-02]
  provides: [cv-data-layer, experience-timeline, cv-section-shell]
  affects: [src/pages/index.astro]
tech_stack:
  added: []
  patterns: [typescript-data-file, astro-component, readonly-const-satisfies]
key_files:
  created:
    - src/data/cv.ts
    - src/components/ExperienceTimeline.astro
    - src/components/CVSection.astro
  modified:
    - src/pages/index.astro
decisions:
  - "Readonly arrays with as const satisfies for type-safe immutable data"
  - "CVSection is a shell; SkillsGrid and CVDownloadButton added in Plan 02"
  - "ExperienceTimeline receives roles and education as typed props from CVSection"
metrics:
  duration: "65s"
  completed_date: "2026-04-09"
  tasks_completed: 2
  files_changed: 4
---

# Phase 03 Plan 01: CV Data Layer and Experience Timeline Summary

**One-liner:** Typed CV data file with 3 roles and 2 education entries, rendered as a vertical CSS timeline with spine line and indigo dot markers, wired into the page as a static Astro section.

---

## What Was Built

### Task 1 — CV Data File (`src/data/cv.ts`)

Created the TypeScript data layer with three exported interfaces and three readonly data arrays:

- `Role` interface with `title`, `company`, `dateRange`, `achievements[]`
- `EducationEntry` interface with `degree`, `institution`, `dateRange`, `detail`, optional `modules[]`
- `SkillCategory` interface with `category`, `skills[]`
- `roles` array: Mindrift (AI Specialist), Scale AI (Data Analyst), London House Hotel (Guest Relations Manager)
- `education` array: MSc Business Analytics (Bayes/City), BSc Information Management for Business (UCL)
- `skillCategories` array: Languages & Data, AI & ML, Tools & Infrastructure
- All arrays typed with `readonly` and `as const satisfies` for immutability

### Task 2 — Timeline Components and Page Wiring

**ExperienceTimeline.astro:**
- Vertical CSS timeline with `position: absolute` spine line using `--color-border`
- Indigo dot markers at each entry using `--color-accent-primary`
- Responsive: spine and dots hidden on mobile (`hidden sm:block`), content unindented (`pl-0 sm:pl-12`)
- Achievement bullets rendered as `<ul>/<li>` for semantic markup
- "Education" separator label between work and education sections
- Conditional modules rendering for education entries

**CVSection.astro:**
- Section shell with `id="experience"` and `aria-label="Experience and CV"`
- `py-16 md:py-24` padding matching established section pattern
- Content container capped at `max-w-2xl` for prose readability
- Imports and renders `ExperienceTimeline` with typed props

**index.astro:**
- `CVSection` imported and rendered after `AboutSection` with no `client:` directive (purely static Astro)

---

## Verification Results

- `npx astro build` completed with zero errors (887ms)
- Built `dist/index.html` contains all three role titles: AI Specialist, Data Analyst, Guest Relations Manager
- Built HTML contains both education entries: MSc Business Analytics, BSc Information Management
- Built HTML contains `id="experience"` on the section element
- No `client:load` or `client:visible` on CVSection

---

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | `22ec0d8` | feat(03-01): create typed CV data file with roles, education, skillCategories |
| Task 2 | `cd4cab9` | feat(03-01): add ExperienceTimeline, CVSection shell, wire into index.astro |

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Known Stubs

None — all data is fully wired. CVSection is intentionally a shell (SkillsGrid and CVDownloadButton are Plan 02 scope, as documented in the plan).

---

## Threat Flags

None — Phase 03 is static build-time content with no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries.

---

## Self-Check: PASSED

- [x] `src/data/cv.ts` exists and exports 6 named items
- [x] `src/components/ExperienceTimeline.astro` exists with spine, dots, Education separator
- [x] `src/components/CVSection.astro` exists with `id="experience"` and `aria-label`
- [x] `src/pages/index.astro` contains `<CVSection`
- [x] Commits `22ec0d8` and `cd4cab9` verified in git log
- [x] `npx astro build` passes
