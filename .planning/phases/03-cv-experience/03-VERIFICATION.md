---
phase: 03-cv-experience
verified: 2026-04-09T23:52:00Z
status: passed
score: 9/9 must-haves verified
overrides_applied: 0
re_verification: false
---

# Phase 3: CV & Experience Verification Report

**Phase Goal:** Visitors can browse Dragos's full professional history on-page and download his CV as a named PDF
**Verified:** 2026-04-09T23:52:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

Roadmap success criteria (source of truth) merged with PLAN frontmatter must-haves.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | An experience timeline lists all three roles with company name, date range, and at least two key achievements each | VERIFIED | `src/data/cv.ts` exports 3 roles (Mindrift, Scale AI, London House Hotel) each with 2-3 achievements. `ExperienceTimeline.astro` iterates `role.achievements.map()`. Built `dist/index.html` matches 6 occurrences of the three role titles. |
| 2 | An education section shows both degrees with institution, dates, and relevant details (classification, key modules) | VERIFIED | `src/data/cv.ts` exports 2 education entries with `degree`, `institution`, `dateRange`, `detail`, and optional `modules[]`. `ExperienceTimeline.astro` has an "Education" separator label and conditionally renders `entry.modules`. Built HTML contains both degree names. |
| 3 | Skills are displayed as categorised lists — no percentage bars anywhere on the page | VERIFIED | `SkillsGrid.astro` renders `rounded-full` pill badges. No `<progress>`, `<meter>`, or percentage-width elements in any component file. Built HTML contains 8 instances of `rounded-full`; `grep -c "<progress\|<meter" dist/index.html` returns 0. |
| 4 | Clicking the CV download link downloads a file named "Dragos Macsim CV 2026.pdf" directly to the user's device | VERIFIED | `CVDownloadButton.astro` has `href="/Dragos Macsim CV 2026.pdf"` and `download="Dragos Macsim CV 2026.pdf"`. `public/Dragos Macsim CV 2026.pdf` exists. Built HTML contains the download attribute with exact filename. |
| 5 | All three roles render with company name, date range, and 2-3 achievement bullets each | VERIFIED | `ExperienceTimeline.astro` renders title, company (via `· {role.company}`), dateRange, and `<ul>/<li>` achievement bullets for each role. |
| 6 | Both education entries render with degree, institution, dates, and classification detail | VERIFIED | `ExperienceTimeline.astro` renders degree, institution, dateRange, detail paragraph, and conditional modules paragraph for each education entry. |
| 7 | Education entries appear below work experience in the same timeline with an Education separator label | VERIFIED | Separator `<div>` with text "Education" present between roles and education loops in `ExperienceTimeline.astro`. |
| 8 | Timeline has a vertical spine line and indigo dot markers at each entry | VERIFIED | Spine line uses `background-color: var(--color-border)` with `hidden sm:block`. Dot markers use `background-color: var(--color-accent-primary)` with same responsive class. |
| 9 | Section has id=experience for future anchor nav | VERIFIED | `CVSection.astro` outer section has `id="experience"` and `aria-label="Experience and CV"`. Confirmed in built HTML. |

**Score:** 9/9 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/data/cv.ts` | Typed CV content — roles, education, skillCategories | VERIFIED | Exports 3 interfaces (`Role`, `EducationEntry`, `SkillCategory`) and 3 readonly const arrays. Uses `as const satisfies` for immutability. No console.log. |
| `src/components/ExperienceTimeline.astro` | Vertical timeline rendering experience and education entries | VERIFIED | 113 lines. Accepts `roles` and `education` typed props. Contains spine, dot markers, "Education" separator, achievement iteration, conditional modules. |
| `src/components/CVSection.astro` | Complete section with timeline, skills, and download button | VERIFIED | Imports ExperienceTimeline, SkillsGrid, CVDownloadButton. Has `id="experience"`, `aria-label`, Skills h2, all three child components rendered. |
| `src/components/SkillsGrid.astro` | Categorized skill badge display | VERIFIED | 33 lines. Iterates `categories` prop, renders pill badges with `color-surface`, `color-border`, `rounded-full`. No progress/meter elements. |
| `src/components/CVDownloadButton.astro` | PDF download CTA button | VERIFIED | Inline SVG icon, correct href/download attributes, aria-label, solid indigo via `color-accent-primary`, scoped hover/active styles. |
| `src/pages/index.astro` | Page with CVSection after AboutSection | VERIFIED | Imports and renders `<CVSection />` after `<AboutSection />` with no client: directive. |
| `tests/cv-section.test.ts` | Static file analysis tests for EXP-01 through EXP-04 | VERIFIED | 39 tests in 5 describe groups (EXP-01, EXP-02, EXP-03, EXP-04, CV section integration). All 39 pass. |
| `public/Dragos Macsim CV 2026.pdf` | Actual PDF file for download | VERIFIED | File exists in public/ directory. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `ExperienceTimeline.astro` | `src/data/cv.ts` | Props typed with `Role[]` and `EducationEntry[]` | WIRED | `import type { Role, EducationEntry } from "../data/cv"` present; props destructured and used in JSX loops. |
| `CVSection.astro` | `ExperienceTimeline.astro` | Astro import and render | WIRED | `import ExperienceTimeline` present; `<ExperienceTimeline roles={roles} education={education} />` rendered. |
| `src/pages/index.astro` | `CVSection.astro` | Astro import and render | WIRED | `import CVSection` present; `<CVSection />` rendered after AbousSection, no client: directive. |
| `SkillsGrid.astro` | `src/data/cv.ts` | Props typed with `SkillCategory[]` | WIRED | `import type { SkillCategory } from "../data/cv"` present; `categories` prop iterated. |
| `CVSection.astro` | `SkillsGrid.astro` | Astro import and render | WIRED | `import SkillsGrid` present; `<SkillsGrid categories={skillCategories} />` rendered. |
| `CVDownloadButton.astro` | `public/Dragos Macsim CV 2026.pdf` | `href` attribute | WIRED | `href="/Dragos Macsim CV 2026.pdf"` and `download="Dragos Macsim CV 2026.pdf"` both present. File confirmed in public/. |

---

### Data-Flow Trace (Level 4)

All data in this phase is build-time static — no runtime fetching, stores, or async data sources. Content flows from `src/data/cv.ts` (source of truth) through typed component props to rendered HTML at build time.

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `ExperienceTimeline.astro` | `roles`, `education` props | `src/data/cv.ts` → CVSection props | Yes — 3 roles and 2 education entries hardcoded as real content | FLOWING |
| `SkillsGrid.astro` | `categories` prop | `src/data/cv.ts` → CVSection props | Yes — 3 skill categories with real skills | FLOWING |
| `CVDownloadButton.astro` | N/A (static link) | `public/Dragos Macsim CV 2026.pdf` | Yes — file present | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All three role titles in built HTML | `grep -c "AI Specialist\|Data Analyst\|Guest Relations Manager" dist/index.html` | 6 (multiple occurrences per title) | PASS |
| Both degree names in built HTML | `grep -c "MSc Business Analytics\|BSc Information Management" dist/index.html` | 2 | PASS |
| Download attribute in built HTML | `grep -c 'download="Dragos Macsim CV 2026.pdf"' dist/index.html` | 1 | PASS |
| No progress/meter elements in built HTML | `grep -c "<progress\|<meter" dist/index.html` | 0 | PASS |
| `id="experience"` in built HTML | `grep -o 'id="experience"' dist/index.html` | found | PASS |
| 39/39 static analysis tests pass | `npx vitest run tests/cv-section.test.ts` | 39 passed | PASS |
| Astro build completes with zero errors | `npx astro build` | 1 page built in 925ms | PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| EXP-01 | 03-01-PLAN.md | Experience timeline showing roles, companies, dates, and key achievements | SATISFIED | ExperienceTimeline.astro renders all 3 roles with company, dateRange, and achievement bullets from cv.ts. 9/9 EXP-01 tests pass. |
| EXP-02 | 03-01-PLAN.md | Education section with degrees, institutions, and relevant details | SATISFIED | ExperienceTimeline.astro renders both education entries below an "Education" separator with degree, institution, detail, and conditional modules. 7/7 EXP-02 tests pass. |
| EXP-03 | 03-02-PLAN.md | Skills displayed as categorized lists (no percentage bars) | SATISFIED | SkillsGrid.astro renders pill badges only. No `<progress>` or `<meter>` anywhere. 9/9 EXP-03 tests pass. |
| EXP-04 | 03-02-PLAN.md | Downloadable CV as PDF with candidate-named filename | SATISFIED | CVDownloadButton.astro links to `/Dragos Macsim CV 2026.pdf` with `download="Dragos Macsim CV 2026.pdf"`. PDF exists in public/. 6/6 EXP-04 tests pass. |

No orphaned requirements — all four EXP IDs mapped in REQUIREMENTS.md under Phase 3 are claimed by the two plans and verified.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `src/components/AboutSection.astro` | References `PhotoPlaceholder` component | Info | Phase 2 artifact — out of scope for Phase 3 verification. No impact on Phase 3 goal. |

No Phase 3 files contain TODO/FIXME/placeholder markers, empty return values, or stub implementations. All data flows from `cv.ts` through typed props to rendered content.

---

### Human Verification Required

No human verification items. All must-haves are verifiable programmatically via static file analysis and build output inspection.

---

### Gaps Summary

No gaps. All 9 observable truths are verified, all 8 artifacts are substantive and wired, all 6 key links are confirmed, all 4 requirements are satisfied, 39/39 tests pass, and the Astro build completes with zero errors.

---

_Verified: 2026-04-09T23:52:00Z_
_Verifier: Claude (gsd-verifier)_
