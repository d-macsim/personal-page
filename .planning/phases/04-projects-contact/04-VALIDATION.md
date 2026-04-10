---
phase: 4
slug: projects-contact
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.4 |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | PROJ-01 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | PROJ-02 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CONT-01 | — | rel="noopener noreferrer" on external links | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CONT-02 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/projects-contact.test.ts` — stubs for PROJ-01, PROJ-02, CONT-01, CONT-02

*Existing test infrastructure covers framework and config — only new test file needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| mytai.uk link opens correctly | PROJ-01 | External URL cannot be verified in unit tests | Click the "Visit mytai.uk" link and confirm it opens https://mytai.uk |
| Nav scroll highlights active section | CONT-02 | Intersection Observer requires browser | Scroll through page and verify nav links highlight the current section |
| Hamburger menu opens/closes on mobile | CONT-02 | Requires mobile viewport interaction | Resize to mobile width, tap hamburger, verify menu opens with all links |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
