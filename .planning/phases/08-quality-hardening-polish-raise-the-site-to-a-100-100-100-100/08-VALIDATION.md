---
phase: 08
slug: quality-hardening-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-12
---

# Phase 08 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.x + playwright 1.59.x |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npx playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx playwright test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 08-01-01 | 01 | 0 | INFRA | unit | `npx vitest run` | ⬜ pending |
| 08-02-01 | 02 | 1 | A11Y | unit | `npx vitest run` | ⬜ pending |
| 08-03-01 | 03 | 1 | PRINT | unit | `npx vitest run` | ⬜ pending |
| 08-04-01 | 04 | 1 | 404/VT | unit | `npx vitest run` | ⬜ pending |
| 08-05-01 | 05 | 2 | CI | e2e | `npx playwright test` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `@lhci/cli` and `@axe-core/playwright` installed as dev dependencies
- [ ] `lighthouserc.json` configuration file created
- [ ] CI smoke test Playwright config scoped separately from production tests

---

## Validation Architecture

Extracted from RESEARCH.md — validation approach for this phase:

1. **Lighthouse CI** (`@lhci/cli`) validates Performance, Accessibility, Best Practices, SEO scores at 100/100/100/100
2. **axe-core/Playwright** validates WCAG 2.1 AA compliance programmatically
3. **Playwright E2E smoke tests** validate critical user flows (load, theme toggle, CV download, contact scroll)
4. **Vitest unit tests** validate component-level correctness (404 page rendering, print stylesheet rules)
5. **GitHub Actions** runs all checks in parallel on every push/PR
