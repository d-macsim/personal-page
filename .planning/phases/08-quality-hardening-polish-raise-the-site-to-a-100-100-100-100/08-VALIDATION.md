---
phase: 08
slug: quality-hardening-polish
status: draft
nyquist_compliant: true
wave_0_complete: true
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
| 08-01-T1 | 01 | 1 | QH-01,QH-02,QH-05 | build+grep | `grep -q "lhci/cli" package.json && grep -q "media print" src/styles/global.css && test -f src/pages/404.astro` | ⬜ pending |
| 08-01-T2 | 01 | 1 | QH-03,QH-04 | build | `grep -q "ClientRouter" src/layouts/BaseLayout.astro && npm run build` | ⬜ pending |
| 08-02-T1 | 02 | 1 | QH-06 | config | `test -f playwright.config.ts && grep -q "phase8-smoke" playwright.config.ts` | ⬜ pending |
| 08-02-T2 | 02 | 1 | QH-07 | e2e | `npx playwright test` | ⬜ pending |
| 08-03-T1 | 03 | 2 | QH-08 | config | `test -f lighthouserc.json && test -f .github/workflows/ci.yml` | ⬜ pending |
| 08-03-T2 | 03 | 2 | QH-08 | checkpoint | Human visual verification of 404, print, view transitions | ⬜ pending |

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
