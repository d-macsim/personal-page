---
phase: 03-cv-experience
plan: "02"
subsystem: cv-skills-and-download
tags: [components, skills, download, tests, static-analysis]
dependency_graph:
  requires: [03-01]
  provides: [skills-grid, cv-download-button, cv-section-complete, cv-section-tests]
  affects: [src/pages/index.astro]
tech_stack:
  added: []
  patterns: [astro-component, static-file-analysis-tests, vitest, svg-icon-inline]
key_files:
  created:
    - src/components/SkillsGrid.astro
    - src/components/CVDownloadButton.astro
    - tests/cv-section.test.ts
  modified:
    - src/components/CVSection.astro
decisions:
  - "SkillsGrid uses pill-shaped (rounded-full) badges with CSS token references — no proficiency bars"
  - "CVDownloadButton uses scoped <style> block for hover/active states (inline styles cannot handle pseudo-classes)"
  - "Static file analysis tests (vitest + readFileSync) follow established pattern from about-section tests"
metrics:
  duration: "90s"
  completed_date: "2026-04-09"
  tasks_completed: 2
  files_changed: 4
---

# Phase 03 Plan 02: CV Skills Grid and Download Button Summary

**One-liner:** Categorized skill badge grid (no percentage bars) and indigo PDF download button wired into CVSection, verified by 39 static analysis tests covering EXP-01 through EXP-04.

---

## What Was Built

### Task 1 — SkillsGrid, CVDownloadButton, CVSection update

**SkillsGrid.astro:**
- Accepts `categories: readonly SkillCategory[]` prop (typed from cv.ts)
- Renders each category with a label heading using `--color-text-muted` and `--font-size-label`
- Each skill rendered as a pill badge: `rounded-full`, `background-color: var(--color-surface)`, `border: 1px solid var(--color-border)`, `color: var(--color-text)`
- No `<progress>`, `<meter>`, or percentage-width elements — badges are display-only (D-07 compliant)

**CVDownloadButton.astro:**
- Anchor element with `href="/Dragos Macsim CV 2026.pdf"` and `download="Dragos Macsim CV 2026.pdf"`
- `aria-label="Download Dragos Macsim CV as PDF"` for accessibility
- Solid indigo background using `--color-accent-primary` (D-09 primary CTA pattern)
- Inline SVG download arrow icon (16x16, `currentColor`, `aria-hidden="true"`)
- Scoped `<style>` block for hover (`--color-accent-primary-hover`) and active (`--color-accent-primary-press`) states

**CVSection.astro (completed):**
- Added imports for `SkillsGrid`, `CVDownloadButton`, and `skillCategories` from cv.ts
- Added Skills `<h2>` heading and `<SkillsGrid categories={skillCategories} />` after the timeline
- Added `<CVDownloadButton />` at section bottom with `mt-12` spacing

### Task 2 — Static Analysis Tests (TDD)

**tests/cv-section.test.ts** (39 tests, all passing):
- `EXP-01`: Timeline has 3 roles with achievements, uses color-accent-primary dots and color-border spine
- `EXP-02`: Education section with MSc/BSc entries, conditional modules rendering, "Education" separator
- `EXP-03`: SkillsGrid uses rounded-full badges, color-surface token, no `<progress>`/`<meter>` elements
- `EXP-04`: CVDownloadButton has correct PDF href, download attribute with exact filename, aria-label, PDF exists in public/
- Integration: CVSection imports all 3 components, index.astro renders CVSection without React island directive

---

## Verification Results

- `npx astro build` completed with zero errors (897ms)
- `npx vitest run tests/cv-section.test.ts` — 39/39 tests passed
- Built HTML contains skill badges with `rounded-full` class
- Built HTML contains `download="Dragos Macsim CV 2026.pdf"` on anchor element
- No `<progress>` or `<meter>` elements in any component file

---

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | `fccbfc7` | feat(03-02): create SkillsGrid, CVDownloadButton, complete CVSection |
| Task 2 | `317aebe` | test(03-02): add static analysis tests for EXP-01 through EXP-04 |

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Known Stubs

None — all data is fully wired. SkillsGrid renders real data from cv.ts. CVDownloadButton links to the real PDF in public/.

---

## Threat Flags

None — Phase 03 is static build-time content with no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries.

---

## Self-Check: PASSED

- [x] `src/components/SkillsGrid.astro` exists with `rounded-full`, `color-surface`, `color-border`, no `progress`/`meter`
- [x] `src/components/CVDownloadButton.astro` exists with correct href, download attr, aria-label, color-accent-primary
- [x] `src/components/CVSection.astro` imports SkillsGrid and CVDownloadButton, has Skills h2
- [x] `tests/cv-section.test.ts` has all 5 describe groups (EXP-01 through EXP-04 + integration)
- [x] Commits `fccbfc7` and `317aebe` verified in git log
- [x] `npx astro build` passes with zero errors
- [x] `npx vitest run tests/cv-section.test.ts` — 39/39 passed
