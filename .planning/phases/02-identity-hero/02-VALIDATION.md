---
phase: 2
slug: identity-hero
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.1.x |
| **Config file** | `vitest.config.ts` |
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
| 02-01-01 | 01 | 1 | HERO-01 | — | N/A | unit | `npx vitest run tests/hero-section.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | HERO-02 | — | N/A | unit | `npx vitest run tests/hero-section.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | HERO-03 | — | N/A | unit | `npx vitest run tests/hero-section.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | ABOUT-01 | — | N/A | unit | `npx vitest run tests/about-section.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | ABOUT-02 | — | N/A | unit | `npx vitest run tests/about-section.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 2 | SEO-01 | — | N/A | unit | `npx vitest run tests/seo-metadata.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-04 | 02 | 2 | SEO-02 | — | N/A | unit | `npx vitest run tests/seo-metadata.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/hero-section.test.ts` — stubs for HERO-01, HERO-02, HERO-03
- [ ] `tests/about-section.test.ts` — stubs for ABOUT-01, ABOUT-02
- [ ] `tests/seo-metadata.test.ts` — stubs for SEO-01, SEO-02

*Existing vitest infrastructure from Phase 1 covers framework setup.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| OG image renders correctly in LinkedIn preview | SEO-01 | Requires external service (LinkedIn post composer) | Paste URL into LinkedIn "Create a post" and verify title, description, and image render |
| Animation plays smoothly on load | HERO-02 | Visual smoothness not testable via file analysis | Open page in browser, verify staggered fade-up plays without jank |
| prefers-reduced-motion disables animations | HERO-03 | Requires OS-level setting change | Enable "Reduce motion" in OS accessibility settings, reload page, verify no animations play |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
