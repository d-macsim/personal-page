---
phase: 3
slug: cv-experience
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (if configured) or manual browser verification |
| **Config file** | none — static Astro components, primarily visual verification |
| **Quick run command** | `npx astro build` |
| **Full suite command** | `npx astro build && npx astro preview` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx astro build`
- **After every plan wave:** Run `npx astro build && npx astro preview`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | EXP-01 | — | N/A | build | `npx astro build` | ⬜ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | EXP-02 | — | N/A | build | `npx astro build` | ⬜ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | EXP-03 | — | N/A | build | `npx astro build` | ⬜ W0 | ⬜ pending |
| 03-01-04 | 01 | 1 | EXP-04 | — | N/A | build | `npx astro build` | ⬜ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — Astro build validates component compilation and static output.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Timeline visual layout renders correctly | EXP-01 | CSS visual layout cannot be automated without E2E | Open page, verify timeline spine + dots align with role cards |
| Education section displays degrees | EXP-02 | Visual verification | Check both degrees show institution, dates, details |
| Skills displayed as categorised lists (no percentage bars) | EXP-03 | Visual verification | Confirm grouped badges/lists, zero progress bars |
| PDF download triggers named file | EXP-04 | Browser download behavior | Click download link, verify file is "Dragos Macsim CV 2026.pdf" |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
