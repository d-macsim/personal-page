---
phase: 6
slug: layout-polish-side-by-side-experience-and-education-timeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node assert / custom static analysis (established in Phase 3) |
| **Config file** | `tests/` directory |
| **Quick run command** | `node tests/cv-section.test.mjs` (if exists) |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node tests/cv-section.test.mjs`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | LAYOUT-01 | — | N/A | static analysis | Check for `md:grid-cols-2` in CVSection.astro | Wave 0 | ⬜ pending |
| 06-01-02 | 01 | 1 | LAYOUT-02 | — | N/A | static analysis | Check for `left-4` on dot element in TimelineColumn.astro | Wave 0 | ⬜ pending |
| 06-01-03 | 01 | 1 | LAYOUT-03 | — | N/A | visual | Manual visual review of column rendering | Manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Static assertion: `src/components/CVSection.astro` contains `md:grid-cols-2`
- [ ] Static assertion: `src/components/TimelineColumn.astro` contains `left-4` on the dot element (not `left-3`)

*Existing Phase 3 tests check for CV HTML structure — they may need a path/import reference update if `ExperienceTimeline` is renamed to `TimelineColumn`.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Two-column layout renders correctly on desktop | LAYOUT-01 | Visual layout verification | Open site at ≥768px viewport, verify Experience and Education render side-by-side |
| Timeline entries display heading, subheading, date, body | LAYOUT-03 | Content rendering is visual | Inspect each column for correct data mapping from cv.ts |
| Responsive stacking on mobile | LAYOUT-01 | Viewport-dependent | Open site at <768px, verify columns stack vertically |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
