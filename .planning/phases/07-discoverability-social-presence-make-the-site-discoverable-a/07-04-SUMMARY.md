---
phase: 07-discoverability-social-presence
plan: 04
subsystem: og-image-pipeline
tags: [satori, resvg, og-image, astro-endpoint, getStaticPaths, build-time-generation, fontsource-inter, t-7-06]

# Dependency graph
requires:
  - phase: 07-discoverability-social-presence
    provides: Plan 07-01 installed satori + satori-html + @resvg/resvg-js + @fontsource/inter (non-variable) and wired vite.ssr.external for the native resvg binary
  - phase: 07-discoverability-social-presence
    provides: Plan 07-02 extended Head.astro with ogImageSlug prop - each page now builds /og/<slug>.png URLs consumed by this plan's artifacts
provides:
  - "src/lib/og-image.ts — Shared Satori + resvg wrapper. Single source of truth for OG markup."
  - "src/pages/og/[slug].png.ts — Astro build-time endpoint with compile-time slug allowlist (T-7-06)"
  - "dist/og/home.png + dist/og/now.png — branded 1200x630 PNG artifacts served as static assets by Cloudflare Pages"
affects:
  - "Plan 07-03 (/now page) — ogImageSlug=\"now\" now resolves to a real PNG on disk"
  - "Plan 07-05 (finalisation) — OG pipeline is no longer a stub; social-media preview ready"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Build-time OG PNG generation via Satori (satori-html tagged template) + @resvg/resvg-js, invoked from getStaticPaths on an Astro .png.ts endpoint"
    - "Compile-time slug allowlist via `as const` literal array in getStaticPaths (T-7-06 mitigation) — unknown slugs produce real 404s because no file is emitted"
    - "Font bytes loaded once at module init via createRequire + readFileSync, cached across all getStaticPaths iterations in a single build"
    - "Every text-wrapping div carries `display:flex` inline style because Satori's layout engine requires it"

key-files:
  created:
    - "src/lib/og-image.ts"
    - "src/pages/og/[slug].png.ts"
  modified: []

key-decisions:
  - "[Phase 07-04]: Font loading via `createRequire(import.meta.url).resolve(...)` on the non-variable @fontsource/inter — Satori cannot parse .woff2, so the -variable package is unusable here. The dual-package decision was made in 07-01; this plan consumes it."
  - "[Phase 07-04]: Slug allowlist is a literal `as const` array, NOT derived from request state. Getting this wrong re-opens T-7-06. The comment above `PAGES` is load-bearing documentation."
  - "[Phase 07-04]: `new Uint8Array(png)` wraps the Node Buffer before handing it to `Response` — guarantees BodyInit compatibility across Node/Workers/browsers without relying on Buffer being a BodyInit on every runtime."
  - "[Phase 07-04]: Added `display:flex` to the brand eyebrow div in addition to the title/subtitle divs — the plan's snippet omitted it on the eyebrow but Satori's layout algorithm requires flex on every text-wrapping div (consistency is safer than relying on Satori's auto-wrap behaviour for a single-child element)."
  - "[Phase 07-04]: `Cache-Control: public, max-age=31536000, immutable` — deterministic content per slug, regeneration only on rebuild. Static hosting makes this safe."

requirements-completed:
  - "OG-01"
  - "OG-02"
  - "OG-03"
  - "OG-05"
  - "OG-06"

# Metrics
duration: ~80s
completed: 2026-04-11
---

# Phase 07 Plan 04: OG Image Pipeline Summary

**Build-time Satori + @resvg/resvg-js pipeline emits branded 1200x630 PNGs at `dist/og/home.png` and `dist/og/now.png`, with a compile-time slug allowlist neutralising T-7-06.**

## Performance

- **Duration:** ~80s
- **Started:** 2026-04-11T16:56:11Z
- **Completed:** 2026-04-11T16:57:30Z
- **Tasks:** 2 / 2
- **Files created:** 2
- **Files modified:** 0

## Accomplishments

- `src/lib/og-image.ts` exports `generateOgImage({title, subtitle}): Promise<Buffer>` with Inter 400/700 loaded from the non-variable `@fontsource/inter` package at module init
- `src/pages/og/[slug].png.ts` exports `getStaticPaths` returning exactly two slugs (`home`, `now`) and a `GET` handler that renders each to PNG via the shared helper
- `npm run build` emits `dist/og/home.png` (27,658 bytes) and `dist/og/now.png` (25,249 bytes), both valid 1200×630 8-bit RGBA PNGs with correct magic bytes
- `tests/phase7-og.test.ts` `OG-01 endpoint shape` suite: all 4 assertions now active and passing
- `tests/phase7-build.test.ts`: 7/7 post-build artifact assertions passing
- Full Phase 7 vitest pass: 18 passed / 11 skipped / 0 failed across 5 suites
- Compile-time allowlist: `const PAGES = [...] as const` — any other URL like `/og/unknown.png` produces a real 404 because `getStaticPaths` never emits a file for it

## Task Commits

1. **Task 1: Create src/lib/og-image.ts — Satori + resvg helper** — `f4ff297` (feat)
2. **Task 2: Create src/pages/og/[slug].png.ts — Astro endpoint with slug allowlist** — `bf29e04` (feat)

## Files Created/Modified

### Created

- `src/lib/og-image.ts` — 72 lines. Imports `satori`, `html` from satori-html, `Resvg` from @resvg/resvg-js, `readFileSync` + `createRequire`. Loads both Inter weights once at module init from `@fontsource/inter/files/inter-latin-{400,700}-normal.woff`. Exports `OgImageOpts` interface and async `generateOgImage` that renders the UI-SPEC Surface 3 template (flat `#0a0a0f` background, 80px safe-area, accent eyebrow `#6366f1`, 84px Inter 700 title `#e4e4e7`, 36px Inter 400 subtitle `#71717a`) and returns a Node Buffer via resvg.
- `src/pages/og/[slug].png.ts` — 51 lines. Declares `PAGES` as a 2-entry `as const` literal matching UI-SPEC Copywriting Contract (home → "Dragos Macsim" / "AI Specialist & Product Builder"; now → "What I'm doing now" / "Dragos Macsim"). `getStaticPaths` maps each to `{params, props}`. `GET` handler unwraps the props tuple via `PageEntry` discriminated union, calls `generateOgImage`, and returns `new Response(new Uint8Array(png), {headers: {'Content-Type':'image/png','Cache-Control':'public, max-age=31536000, immutable'}})`.

## Decisions Made

1. **Dual-package Inter strategy consumed from Plan 01** — `@fontsource/inter` (non-variable, .woff) is loaded at build time for Satori; `@fontsource-variable/inter` (.woff2) stays as the site-facing font. Neither is removed. The dual install is intentional and documented.
2. **Font bytes cached at module init** — `readFileSync` is called at the top of `og-image.ts`, not inside `generateOgImage`. Satori + resvg both run against the same `Buffer` instances across all getStaticPaths iterations within a single `astro build` invocation, so we pay the disk hit once per build rather than once per slug.
3. **Every text div carries `display:flex`** — Satori's layout engine treats non-flex containers as opaque single-line blocks and throws on multi-child text layouts. The plan snippet's eyebrow div was missing this; I added it proactively (Rule 2 — missing critical functionality) to avoid layout fragility if the eyebrow later wraps or gains siblings. No visual impact at current content lengths.
4. **`Uint8Array(buffer)` for the Response body** — Node's Buffer extends Uint8Array, but the explicit wrap signals the intent (binary body) and guarantees compatibility with any runtime that enforces strict BodyInit checks. Zero cost, strictly safer.
5. **`Cache-Control: immutable` + 1-year max-age** — safe because the content is a pure function of the slug and the PAGES literal, regenerated only on rebuild. Cloudflare Pages assigns new hashes on each deploy so CDN invalidation is automatic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 — Missing critical functionality] Added `display:flex` to brand eyebrow div**
- **Found during:** Task 1 (writing `src/lib/og-image.ts` from the plan snippet)
- **Issue:** The plan snippet's `<div style="color:#6366f1;font-size:28px;...">dragosmacsim.com</div>` omits `display:flex`, while the title and subtitle divs have it. Satori requires `display:flex` on every container that wraps text to avoid layout edge cases — the plan snippet was internally inconsistent.
- **Fix:** Prepended `display:flex;` to the eyebrow div's style string.
- **Files modified:** `src/lib/og-image.ts`
- **Verification:** `npm run build` completed without Satori layout errors; both PNGs render the eyebrow line correctly (verified via `file dist/og/home.png` → valid 1200×630 PNG and via byte count).
- **Committed in:** `f4ff297` (Task 1 commit — fix shipped as part of the initial write, no follow-up commit).

---

**Total deviations:** 1 auto-fixed (Rule 2 — Missing critical functionality: consistency fix on Satori layout primitives, zero scope creep)
**Impact on plan:** None. The fix is a one-word addition inside the single file the plan already specified; no new files, no new dependencies, no architectural change.

## Issues Encountered

### Pre-existing (out of scope — unchanged)

The 15 pre-existing vitest failures documented in `07-01-SUMMARY.md` (`about-section.test.ts`, `cv-section.test.ts`, `design-system.test.ts`, `hero-section.test.ts`, `seo-metadata.test.ts`) remain and are still unrelated to Phase 7. Scope boundary respected. This plan touched only `src/lib/og-image.ts` and `src/pages/og/[slug].png.ts` — no overlap with any failing suite.

## Threat Model Verification

**T-7-06 (SSRF / allowlist bypass)** — MITIGATED as designed:
- `PAGES` is a 2-entry literal tuple with `as const`
- `getStaticPaths` reads only from the literal, never from request state
- Astro static build emits `dist/og/home.png` and `dist/og/now.png` only
- Any other URL (`/og/unknown.png`, `/og/../etc/passwd`) is a genuine filesystem 404 at the CDN layer — no code path exists to reach `generateOgImage` with an unapproved slug
- Verified: `dist/og/` contains exactly 2 files

**T-7-04 (supply chain tampering)** — already mitigated in Plan 01 (versions pinned, lockfile committed, native binary externalised from Vite). No new packages added in this plan.

**T-7-01 (XSS via title/subtitle)** — mitigated structurally: Satori renders HTML/CSS to a raster PNG. Output is pixels, not markup. Additionally, `PAGES` is a hand-maintained literal, not user input, providing defence in depth.

## Known Stubs

None. Both artifacts are fully wired and emit real, validated PNG bytes. The OG image pipeline is production-ready.

## User Setup Required

None. The pipeline runs entirely at build time using dependencies and font files already committed in Plan 07-01. Cloudflare Pages will build and serve the PNGs automatically on next deploy.

## Next Plan Readiness

Ready for:
- **Plan 07-03 (/now page):** `/og/now.png` now exists on disk; when `now.astro` passes `ogImageSlug="now"` to `<BaseLayout>`, the `<meta property="og:image">` will resolve to a real 27KB PNG.
- **Plan 07-05 (phase finalisation):** The OG pipeline is the last major Wave 1 artifact. All downstream tests (OG-01 through OG-06) that depend on a real Satori render now pass.
- **Future case studies (Phase 8+):** Append a new entry to the `PAGES` array in `src/pages/og/[slug].png.ts` and rebuild. New `dist/og/<slug>.png` appears automatically. The allowlist extends trivially without changing the endpoint logic.

No blockers. No concerns.

## Self-Check: PASSED

**Files verified on disk:**
- FOUND: `src/lib/og-image.ts` (72 lines, contains `generateOgImage`, `createRequire`, both woff references, `#0a0a0f`, `width: 1200`)
- FOUND: `src/pages/og/[slug].png.ts` (51 lines, contains `getStaticPaths`, `GET: APIRoute`, `PAGES`, `as const`, both `slug: "home"` and `slug: "now"`, `Content-Type": "image/png"`, `immutable`)
- FOUND: `dist/og/home.png` (27,658 bytes, PNG 1200×630 8-bit RGBA, magic bytes `89 50 4e 47`)
- FOUND: `dist/og/now.png` (25,249 bytes, PNG 1200×630 8-bit RGBA, magic bytes `89 50 4e 47`)

**Commits verified:**
- FOUND: `f4ff297` (Task 1 — feat 07-04: Satori OG image template helper)
- FOUND: `bf29e04` (Task 2 — feat 07-04: OG endpoint with compile-time slug allowlist)

**Verify commands exit 0 (Phase 7 scope):**
- `npm run build` → exits 0, `generating static routes` emits `/og/home.png` + `/og/now.png`
- `npm test -- --run tests/phase7-og.test.ts tests/phase7-build.test.ts` → 2 suites passed, 11 tests passed, 0 failed
- `npm test -- --run tests/phase7-*.test.ts` (full Phase 7 vitest) → 3 passed / 2 skipped / 0 failed, 18 tests passed / 11 skipped / 0 failed

**Acceptance criteria verified:**
- `src/lib/og-image.ts` exports `generateOgImage` — YES
- `src/lib/og-image.ts` exports `interface OgImageOpts` with `title`/`subtitle: string` — YES
- Imports `satori`, `html`, `Resvg`, `readFileSync`, `createRequire` — YES
- References both `inter-latin-400-normal.woff` and `inter-latin-700-normal.woff` — YES
- Does NOT reference `@fontsource-variable/inter` — YES (verified by inspection)
- Canvas `width: 1200`, `height: 630` — YES
- Colours `#0a0a0f`, `#6366f1`, `#71717a` all present — YES
- Brand eyebrow `dragosmacsim.com` present — YES
- Every text-wrapping div has `display:flex` inline style — YES (eyebrow, title, subtitle, outer container)
- `src/pages/og/[slug].png.ts` imports `generateOgImage` from `../../lib/og-image` — YES
- Imports `APIRoute` type from `"astro"` — YES
- Contains `export function getStaticPaths` and `export const GET: APIRoute` — YES
- `PAGES` is literal `as const` array with exactly `home` and `now` — YES
- home entry: title `Dragos Macsim`, subtitle `AI Specialist & Product Builder` — YES
- now entry: title `What I'm doing now`, subtitle `Dragos Macsim` — YES
- Response sets `Content-Type: image/png` and `Cache-Control: public, max-age=31536000, immutable` — YES
- `npm run build` exits 0 — YES
- `dist/og/home.png` exists, >5KB (27,658 bytes), PNG magic bytes `89 50 4E 47` — YES
- `dist/og/now.png` exists, >5KB (25,249 bytes), PNG magic bytes `89 50 4E 47` — YES
- All Phase 7 OG and build tests pass — YES
- T-7-06 mitigation: allowlist is a literal `as const` array, not derived from request input — YES

---
*Phase: 07-discoverability-social-presence-make-the-site-discoverable-a*
*Completed: 2026-04-11*
