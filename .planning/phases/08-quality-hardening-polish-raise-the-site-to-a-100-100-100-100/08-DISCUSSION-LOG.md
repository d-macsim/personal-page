# Phase 8: Quality Hardening & Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-12
**Phase:** 08-quality-hardening-polish-raise-the-site-to-a-100-100-100-100
**Areas discussed:** Lighthouse strategy, CI pipeline scope, Print stylesheet priorities, Custom 404 design

---

## Lighthouse Strategy

### Q1: How strict should the 100/100/100/100 Lighthouse target be?

| Option | Description | Selected |
|--------|-------------|----------|
| Hard gate | Lighthouse CI runs in GitHub Actions. PR fails if any category drops below 100. | ✓ |
| Soft advisory | Lighthouse runs and reports scores as a PR comment, but never blocks merge. | |
| Threshold gate | Block on scores below 95, but aim for 100. Less brittle. | |

**User's choice:** Hard gate
**Notes:** None

### Q2: Which pages should Lighthouse audit?

| Option | Description | Selected |
|--------|-------------|----------|
| Homepage + /now | Audit both routes — covers main page and only secondary route. | ✓ |
| Homepage only | Just / — faster CI runs. | |
| All routes + 404 | Homepage, /now, and 404 page. Most thorough but slower. | |

**User's choice:** Homepage + /now
**Notes:** None

---

## CI Pipeline Scope

### Q1: Which checks should run in CI on every push/PR?

| Option | Description | Selected |
|--------|-------------|----------|
| Build + typecheck | astro build + tsc. Fast (~30s). | ✓ |
| Vitest unit tests | Run existing unit test suite. | ✓ |
| Playwright E2E smoke | Load /, toggle theme, scroll to contact, CV download. | ✓ |
| Lighthouse CI | Run Lighthouse on built site. Hard gate at 100. | ✓ |

**User's choice:** All four checks
**Notes:** None

### Q2: Should CI run sequentially or in parallel jobs?

| Option | Description | Selected |
|--------|-------------|----------|
| Parallel jobs | Separate parallel jobs. Faster total time, clear status badges. | ✓ |
| Sequential fail-fast | Build first, then tests, then Lighthouse. Saves CI minutes. | |

**User's choice:** Parallel jobs
**Notes:** None

---

## Print Stylesheet Priorities

### Q1: What should the printed version of your site look like?

| Option | Description | Selected |
|--------|-------------|----------|
| Clean recruiter printout | Hide nav, toggle, animations. Black text on white. Show URLs inline. | ✓ |
| Minimal — just hide nav | Only hide nav and toggle. Keep existing colors/layout. | |
| You decide | Claude picks best approach. | |

**User's choice:** Clean recruiter printout
**Notes:** None

### Q2: Should the print view cover the full page or just CV-relevant parts?

| Option | Description | Selected |
|--------|-------------|----------|
| Full page | Print everything: hero, about, experience, education, skills, projects, contact. | |
| CV sections only | Only experience, education, skills. | |
| You decide | Claude picks based on recruiter use. | ✓ |

**User's choice:** You decide
**Notes:** Claude's discretion on print scope

---

## Custom 404 Design

### Q1: What tone for the 404 page?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal branded | Clean message matching site design. Professional feel. | |
| Playful personality | Friendly/witty copy, maybe animation. Shows personality. | |
| You decide | Claude picks the approach. | ✓ |

**User's choice:** You decide
**Notes:** Claude's discretion on 404 tone

---

## Claude's Discretion

- Print scope (full page vs CV-only)
- 404 design tone (minimal branded vs playful)
- Accessibility audit tool choice
- View Transitions implementation details
- E2E smoke test exact scenarios
- Lighthouse CI tool choice

## Deferred Ideas

None — discussion stayed within phase scope.
