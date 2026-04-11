---
phase: 7
slug: discoverability-social-presence-make-the-site-discoverable-a
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-11
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Derived from 07-RESEARCH.md "Validation Architecture" section.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x (unit) + @playwright/test 1.x (e2e) — both already installed |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run build && npm run test -- --run && npm run test:e2e` |
| **Estimated runtime** | ~40s unit + ~30s e2e + ~15s build |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run` (filtered to touched files where possible)
- **After every plan wave:** Run `npm run test -- --run && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green (build + unit + e2e)
- **Max feedback latency:** ~40s

---

## Per-Task Verification Map

*Filled by gsd-planner during planning — each task in each PLAN.md lands here with its exact automated command.*

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 7-XX-XX | XX | N | REQ-XX | — / T-7-XX | {expected} | unit/e2e/build | `{command}` | ✅ / ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Install `@astrojs/sitemap@^3.7.2`
- [ ] Install `satori`, `satori-html`, `@resvg/resvg-js`
- [ ] Install `@fontsource/inter@^5.2.8` (non-variable, ships `.woff` — required for Satori; `-variable` ships only `.woff2` which Satori can't parse)
- [ ] Update `astro.config.mjs` with sitemap integration + vite externals for `@resvg/resvg-js`
- [ ] Update `src/env.d.ts` with `PUBLIC_CF_ANALYTICS_TOKEN`
- [ ] Stub test files for new modules (OG image generator, /now page, JSON-LD Person extension)

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cloudflare Analytics beacon fires in production | ANALYTICS-01 | Dashboard-side, requires real deployment + CF account | After deploy: open site, navigate to CF dash → Web Analytics → site → confirm pageview count incremented within 2 min |
| Google Rich Results picks up Person JSON-LD | SEO-03 | External Google crawler | Paste deployed URL into https://search.google.com/test/rich-results → confirm Person entity detected, no errors |
| LinkedIn OG preview renders correctly | OG-01 | LinkedIn post composer | Paste deployed URL into a LinkedIn post draft → confirm 1200x630 branded card with title/description |
| /now page discoverable from homepage | NOW-02 | Subjective "visible link" check | Load / in dev; visually confirm /now link present in nav |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (sitemap, satori, @fontsource/inter non-variable)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
