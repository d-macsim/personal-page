---
phase: 9
slug: gap-closure-cv-achievements-nav-hash
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-13
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.4 (unit), Playwright 1.59.1 (E2E) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm run build && npm run test:e2e` |
| **Estimated runtime** | ~8 seconds (unit ~3s, E2E ~5s) |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm run build && npm run test:e2e`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 8 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | EXP-01 | — | N/A | unit | `npm test -- --reporter=verbose` | ✅ (partial — cv-section.test.ts) | ⬜ pending |
| 09-01-02 | 01 | 1 | EXP-01 | — | N/A | E2E | `npm run build && npm run test:e2e` | ❌ W0 | ⬜ pending |
| 09-01-03 | 01 | 1 | CONT-02 | — | N/A | E2E | `npm run build && npm run test:e2e` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Two new E2E tests added to `tests/phase8-smoke.spec.ts`:
  - Achievement bullets visible in `#experience` (EXP-01)
  - Nav hash link from `/now` navigates to homepage section (CONT-02)

*Existing infrastructure covers all other phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Smooth-scroll still works on homepage | CONT-02 | Visual UX quality check | Navigate to `/`, click nav `#about` — should smooth-scroll without page reload flash |
| Achievement bullet typography | EXP-01 | Visual design quality | Check bullets use muted color, body font size, consistent spacing |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 8s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
