---
phase: 07-discoverability-social-presence
plan: 01
subsystem: infra
tags: [astro, sitemap, satori, resvg, cloudflare-analytics, vitest, playwright, og-image]

# Dependency graph
requires:
  - phase: 05-animations-deploy
    provides: Cloudflare Pages deploy pipeline and base BaseLayout consumed by downstream Phase 7 plans
provides:
  - "@astrojs/sitemap integration wired into astro.config.mjs (generates dist/sitemap-index.xml + dist/sitemap-0.xml)"
  - "Vite SSR externals + optimizeDeps exclude for @resvg/resvg-js native binary"
  - "satori + satori-html + @fontsource/inter runtime deps for build-time OG image generation (Wave 1+)"
  - "PUBLIC_CF_ANALYTICS_TOKEN typed via src/env.d.ts + .env.example at repo root"
  - "Six scaffolded Phase 7 test files (5 vitest + 1 playwright) gated by describe.skipIf until downstream artifacts land"
affects:
  - "Plan 07-02 (SEO fundamentals / robots.txt / Person schema)"
  - "Plan 07-03 (Cloudflare Web Analytics beacon)"
  - "Plan 07-04 (/now page)"
  - "Plan 07-05 (per-page OG image generator)"

# Tech tracking
tech-stack:
  added:
    - "@astrojs/sitemap@^3.7.2 (dev dep)"
    - "satori@^0.26.0"
    - "satori-html@^0.3.2"
    - "@resvg/resvg-js@^2.6.2"
    - "@fontsource/inter@^5.2.8 (non-variable — ships .woff for Satori)"
  patterns:
    - "describe.skipIf pattern for forward-compatible test scaffolds that stay green until target artifacts exist"
    - "Native binary isolation via vite.ssr.external + optimizeDeps.exclude"
    - "Public env var typing through ImportMetaEnv extension in src/env.d.ts"

key-files:
  created:
    - "src/env.d.ts"
    - ".env.example"
    - "tests/phase7-seo.test.ts"
    - "tests/phase7-nav.test.ts"
    - "tests/phase7-analytics.test.ts"
    - "tests/phase7-og.test.ts"
    - "tests/phase7-build.test.ts"
    - "tests/phase7.spec.ts"
    - ".planning/phases/07-discoverability-social-presence-make-the-site-discoverable-a/deferred-items.md"
  modified:
    - "astro.config.mjs"
    - "package.json"
    - "package-lock.json"

key-decisions:
  - "[Phase 07]: @fontsource/inter (non-variable) installed alongside @fontsource-variable/inter because Satori cannot parse .woff2 — the variable package ships only .woff2, the non-variable package ships .woff. Both coexist intentionally."
  - "[Phase 07]: Native resvg binary isolated via vite.ssr.external + optimizeDeps.exclude to prevent Vite from attempting to bundle the .node file."
  - "[Phase 07]: Phase 7 test files use describe.skipIf gates so they stay green during Wave 0 and auto-activate when downstream plans land their target artifacts (src/pages/now.astro, src/pages/og/[slug].png.ts, etc.)."
  - "[Phase 07]: File reads in tests moved inside `it` blocks (not describe collection time) so skipIf can actually gate them."

patterns-established:
  - "Forward-compatible test scaffolding: describe.skipIf(!existsSync(target)) + lazy readFileSync inside it blocks allows a single commit to ship the entire Phase 7 assertion library without breaking verify while artifacts are still missing"
  - "Dual-font-package strategy: keep site-facing variable font for runtime + install non-variable font sibling for build-time Satori rendering"

requirements-completed:
  - "SEO-04"
  - "SEO-05"
  - "OG-01"
  - "ANALYTICS-01"

# Metrics
duration: ~4min
completed: 2026-04-11
---

# Phase 07 Plan 01: Wave 0 Foundation Summary

**Phase 7 dependency, config, env-typing, and test-scaffold foundation: sitemap generation live, OG render stack installed, CF analytics env var typed, and six forward-compatible test files gated on Wave 1+ artifacts.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-11T16:44:56Z
- **Completed:** 2026-04-11T16:48:55Z
- **Tasks:** 3 / 3
- **Files created:** 9
- **Files modified:** 3

## Accomplishments

- `@astrojs/sitemap` integration active — `dist/sitemap-index.xml` + `dist/sitemap-0.xml` generated on every build
- `satori`, `satori-html`, `@resvg/resvg-js`, and non-variable `@fontsource/inter` installed and resolved (ready for Wave 1 OG image generator)
- `astro.config.mjs` carries Vite SSR externals + `optimizeDeps.exclude` for the `@resvg/resvg-js` native binary (the #3 footgun in RESEARCH.md)
- `src/env.d.ts` types `PUBLIC_CF_ANALYTICS_TOKEN` with full JSDoc explaining the intentional `PUBLIC_` prefix
- `.env.example` committed at repo root (empty value, `.gitignore` already excludes real `.env`)
- Six Phase 7 test files scaffolded with `describe.skipIf` gates — every Phase 7 assertion passes or skips cleanly
- `SEO-04 sitemap integration` suite actively asserts Task 1's `astro.config.mjs` changes and passes
- `SEO-05 sitemap files in dist` suite actively asserts the build output and passes

## Task Commits

1. **Task 1: Install Phase 7 dependencies and update astro.config.mjs** — `bc290f3` (chore)
2. **Task 2: Create src/env.d.ts with PUBLIC_CF_ANALYTICS_TOKEN type** — `7c5b762` (feat)
3. **Task 3: Scaffold the six Phase 7 test files** — `1e6cb82` (test)

## Files Created/Modified

### Created

- `src/env.d.ts` — Types `PUBLIC_CF_ANALYTICS_TOKEN` on `ImportMetaEnv`
- `.env.example` — Documented env template with empty beacon token
- `tests/phase7-seo.test.ts` — robots.txt / sitemap cfg / Person schema / /now meta / NOW-04 / NOW-05 (gated by `exists()` checks)
- `tests/phase7-nav.test.ts` — /now nav link + hash-only click guard (gated on BaseLayout content)
- `tests/phase7-analytics.test.ts` — CF beacon + PROD guard + token reference (gated on `cloudflareinsights` substring)
- `tests/phase7-og.test.ts` — OG endpoint shape, slug whitelist (T-7-06), Head.astro `ogImageSlug` wiring (gated on file existence)
- `tests/phase7-build.test.ts` — post-build artifact checks: sitemap files (active, passing) + OG PNGs (gated on `dist/og`)
- `tests/phase7.spec.ts` — Playwright E2E for `/now` render + `/og/home.png` serving + `/og/unknown.png` 404 (runs in Wave 1+)
- `.planning/phases/07-discoverability-social-presence-make-the-site-discoverable-a/deferred-items.md` — Log of 15 pre-existing vitest failures unrelated to Phase 7

### Modified

- `astro.config.mjs` — Added `import sitemap`, added `sitemap()` to integrations array, added `vite.ssr.external` + `optimizeDeps.exclude` for `@resvg/resvg-js`
- `package.json` — Added `satori`, `satori-html`, `@resvg/resvg-js`, `@fontsource/inter` to `dependencies`; added `@astrojs/sitemap` to `devDependencies`; `@fontsource-variable/inter` retained
- `package-lock.json` — Lockfile updated (24 packages added)

## Decisions Made

1. **Install `@fontsource/inter` alongside `@fontsource-variable/inter`** — not a duplicate. Satori cannot parse `.woff2`; only the non-variable package ships `.woff` files, which live at `node_modules/@fontsource/inter/files/inter-latin-{400,700}-normal.woff`. The variable package stays in place for site-facing Inter rendering.
2. **Isolate `@resvg/resvg-js` with two Vite flags** — both `ssr.external` (prevents SSR bundling) and `optimizeDeps.exclude` (prevents dev pre-bundling) are required because Vite handles the native `.node` binary differently in each phase.
3. **`describe.skipIf` gating strategy** — Phase 7 test files are shipped in full at Wave 0 with gate predicates that return false until downstream artifacts exist, avoiding a second "add-assertions" commit per downstream plan.
4. **File reads inside `it` blocks, not describe bodies** — `describe.skipIf` defers running the tests but still invokes the describe callback to collect them. Any `readFileSync` at describe top level would throw before `skipIf` could defer anything. Moved all reads into `it` callbacks.
5. **Guarded OG Head.astro read with `existsSync`** — prevents the `OG-04` describe from exploding before its `.skipIf` gate can take effect in the future when Head.astro is modified.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Test suite collection crash before skipIf could gate**
- **Found during:** Task 3 (first `npm test -- --run` after writing the six files verbatim from the plan)
- **Issue:** The plan's Task 3 snippet placed `const now = read("src/pages/now.astro")` and `const endpoint = readFileSync(endpointPath, ...)` at the top of the describe callback. Vitest invokes describe callbacks to collect `it` references even when `skipIf` is true, so `readFileSync` fired and threw `ENOENT` because neither file exists yet in Wave 0. Result: 2 failed suites even though every assertion would have been skipped.
- **Fix:** Moved every `readFileSync`/`read()` call out of the describe body and into the individual `it` callbacks (or wrapped in a lazy `readEndpoint()` closure). Additionally guarded the Head.astro read in `phase7-og.test.ts` with `existsSync` so the `hasSlugWiring` flag evaluates to `false` (and all three `it.skipIf` gates fire) instead of throwing.
- **Files modified:** `tests/phase7-seo.test.ts`, `tests/phase7-og.test.ts`
- **Verification:** `npm test -- --run tests/phase7-*.test.ts` → `2 passed | 3 skipped (5), 7 passed | 22 skipped (29), 0 failed`
- **Committed in:** `1e6cb82` (Task 3 commit — fix shipped as part of the initial Task 3 commit, no separate follow-up commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — Bug: fixed a correctness issue in the plan's own test scaffolding snippet so verify could pass)
**Impact on plan:** No scope creep. Fix was purely inside the Plan 07-01 test files and did not touch any src/ files. All acceptance criteria remain met.

## Issues Encountered

### Pre-existing vitest failures (out of scope — logged)

Full-suite `npm test -- --run` reports:

```
Test Files  5 failed | 5 passed | 3 skipped (13)
     Tests  15 failed | 209 passed | 22 skipped (246)
```

The 15 failing tests live in `about-section.test.ts`, `cv-section.test.ts`, `design-system.test.ts`, `hero-section.test.ts`, and `seo-metadata.test.ts`. All failures trace back to commits `accd33e` ("correct bio to match actual CV, change title to AI data specialist") and `5f654d0` ("fix email to protonmail, add currently working on blurb"), which updated content strings without updating the hard-coded `.toContain(...)` assertions.

Per the executor scope boundary: **pre-existing failures in unrelated files are not auto-fixed.** I verified these exist without my changes by temporarily moving the `phase7-*` files aside and re-running — the same 15 failures and the same 5 failing files appeared.

**Logged to:** `.planning/phases/07-discoverability-social-presence-make-the-site-discoverable-a/deferred-items.md` with recommended follow-up (quick task or Phase 8 quality-hardening plan).

**Plan 07-01 stance:** All Phase 7 test files are green or cleanly skipped. The full-suite exit code is non-zero only because of pre-existing drift, not because of anything Wave 0 introduced.

### npm audit advisories

`npm audit --omit=dev` reports 5 moderate advisories rooted in `yaml` (via `@astrojs/check` → `@astrojs/language-server` → `volar-service-yaml` → `yaml-language-server`). All MODERATE, all dev-toolchain only. No HIGH or CRITICAL advisories. Per T-7-04 acceptance (LOW/MODERATE acceptable), no action taken. `npm audit fix --force` would downgrade `@astrojs/check` to 0.9.2, a breaking change — not run.

## User Setup Required

**`PUBLIC_CF_ANALYTICS_TOKEN` needed before Plan 07-03 ships to prod.** Obtain from `dash.cloudflare.com → Analytics & Logs → Web Analytics → (add/select dragosmacsim.com site) → Snippet tab → copy 32-char hex token → paste into `.env` (or Cloudflare Pages env var config)`. Not required to execute Plans 07-02 / 07-04 / 07-05 — the beacon is guarded by `import.meta.env.PROD` and only activates in production builds.

## Next Phase Readiness

Ready for:
- **Wave 1 (Plans 07-02 / 07-03 / 07-04 / 07-05):** All shared runtime deps installed and resolved. Sitemap integration active. CF analytics env var typed. Every downstream plan can run its `<automated>` verify command against the already-scaffolded Phase 7 test files, which will automatically activate as target artifacts come into existence.

No blockers. No concerns.

## Self-Check: PASSED

**Files verified on disk:**
- FOUND: `astro.config.mjs` — contains `import sitemap from "@astrojs/sitemap"` and `sitemap()` in integrations
- FOUND: `src/env.d.ts` — contains `PUBLIC_CF_ANALYTICS_TOKEN: string`
- FOUND: `.env.example` — contains `PUBLIC_CF_ANALYTICS_TOKEN=`
- FOUND: `tests/phase7-seo.test.ts`
- FOUND: `tests/phase7-nav.test.ts`
- FOUND: `tests/phase7-analytics.test.ts`
- FOUND: `tests/phase7-og.test.ts`
- FOUND: `tests/phase7-build.test.ts`
- FOUND: `tests/phase7.spec.ts`
- FOUND: `dist/sitemap-index.xml` (post-build artifact)
- FOUND: `dist/sitemap-0.xml` (post-build artifact)

**Commits verified:**
- FOUND: `bc290f3` (Task 1 — chore 07-01)
- FOUND: `7c5b762` (Task 2 — feat 07-01)
- FOUND: `1e6cb82` (Task 3 — test 07-01)

**Dependencies verified in package.json:**
- FOUND: `satori`, `satori-html`, `@resvg/resvg-js`, `@fontsource/inter` in `dependencies`
- FOUND: `@astrojs/sitemap` in `devDependencies`
- FOUND: `@fontsource-variable/inter` retained in `dependencies` (not removed)

**Verify commands exit 0 (Phase 7 scope):**
- `npm run build` → exits 0, `Sitemap generated at dist`
- `npm test -- --run tests/phase7-*.test.ts` → exits 0, 7 passed / 22 skipped / 0 failed across 5 suites

---
*Phase: 07-discoverability-social-presence-make-the-site-discoverable-a*
*Completed: 2026-04-11*
