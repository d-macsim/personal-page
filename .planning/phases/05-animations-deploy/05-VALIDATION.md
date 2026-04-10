---
phase: 5
slug: animations-deploy
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build + browser check |
| **Config file** | astro.config.mjs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx astro check` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx astro check`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | DSGN-04 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 1 | DSGN-04 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 05-02-01 | 02 | 2 | DEPLOY-01 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework needed — `npm run build` validates CSS and Astro compilation. Deployment verification is manual (Cloudflare dashboard).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Scroll-reveal animations play on scroll | DSGN-04 | CSS scroll-driven animations need real browser viewport | Open dev server, scroll through page, verify each section reveals with fade-up |
| Animations disabled with prefers-reduced-motion | DSGN-04 | Requires browser accessibility settings | Enable "Reduce motion" in OS, reload page, verify all content visible immediately |
| Content visible without JS | DSGN-04 | Requires disabling JavaScript in browser | Disable JS in DevTools, reload, verify all sections readable |
| Site loads at custom domain with HTTPS | DEPLOY-01 | Requires live deployment | Visit https://dragosmacsim.com, verify no security warnings, check certificate |
| Auto-deploy on push to main | DEPLOY-01 | Requires GitHub + Cloudflare integration | Push a change, verify Cloudflare Pages triggers build automatically |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
