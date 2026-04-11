---
phase: 07-discoverability-social-presence
verified: 2026-04-11T18:15:00Z
status: human_needed
score: 17/17 must-haves verified
overrides_applied: 0
re_verification: false
human_verification:
  - test: "Visit /now in preview build and confirm h1 + three h2 sections render with correct content, dark/light theme works, scroll-reveal animation fires"
    expected: "h1 'What I'm doing now', 'Last updated: April 2026' line, intro paragraph, Working on/Learning/Location sections, nownownow.com attribution footer; nav 'Now' link shows active underline"
    why_human: "Visual regression and animation quality cannot be verified programmatically"
  - test: "Open /og/home.png and /og/now.png in a browser and visually inspect the rendered Satori output"
    expected: "1200x630 dark card with indigo 'dragosmacsim.com' eyebrow, bold title (Dragos Macsim / What I'm doing now), muted subtitle (AI Specialist & Product Builder / Dragos Macsim); no layout clipping, no missing glyphs"
    why_human: "Font rendering, layout, and visual correctness of generated PNGs can only be confirmed visually"
  - test: "Confirm CF Web Analytics beacon in a real production build with PUBLIC_CF_ANALYTICS_TOKEN set"
    expected: "After running `PUBLIC_CF_ANALYTICS_TOKEN=<real-token> npm run build && npm run preview`, view-source on / shows `<script ... src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{\"token\": \"<real-token>\"}'>` before </body>"
    why_human: "Requires a real Cloudflare Web Analytics token the verifier cannot synthesise; current build is fail-closed because no token is configured"
  - test: "Submit homepage to Google Rich Results Test and LinkedIn Post Inspector after deployment"
    expected: "Rich Results Test finds a valid Person schema (name, image, email, knowsAbout); LinkedIn Post Inspector shows the branded /og/home.png card"
    why_human: "Requires live production URL; third-party validators cannot be queried from a local test runner"
  - test: "Toggle theme on /now page and confirm all text/sections respond to dark/light mode"
    expected: "All text colours update via CSS variables; no contrast regressions"
    why_human: "Theme visual quality requires human review"
  - test: "Click the desktop and mobile 'Now' nav links and confirm real page navigation (not preventDefault'd)"
    expected: "Browser actually navigates to /now; existing hash links (#about/#experience/#projects/#contact) still smooth-scroll"
    why_human: "The hash-guard fix is verified by unit tests, but full navigation behaviour across viewport sizes is a UX check"
---

# Phase 7: Discoverability & Social Presence Verification Report

**Phase Goal:** Recruiters can Google Dragos, find the site, share it (branded OG cards on every page), see real cookieless traffic, and visit a /now page describing current focus. SEO fundamentals (sitemap, robots.txt, extended JSON-LD Person), Cloudflare Web Analytics beacon, /now page, and per-page OG image generation are all live in production.

**Verified:** 2026-04-11T18:15:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

Must-haves derived from the phase goal and the union of `must_haves.truths` declared across plans 07-01 through 07-05.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Crawlers GET /robots.txt and see a Sitemap: pointer to /sitemap-index.xml | VERIFIED | `public/robots.txt` has the 5-line content; `dist/robots.txt` (76 bytes) identical; build emits the file |
| 2 | @astrojs/sitemap generates dist/sitemap-index.xml + dist/sitemap-0.xml listing / and /now | VERIFIED | `astro.config.mjs` imports and uses `sitemap()`; `dist/sitemap-index.xml` (187 bytes) and `dist/sitemap-0.xml` (432 bytes) present and reference `https://dragosmacsim.com/` and `https://dragosmacsim.com/now/` |
| 3 | Extended JSON-LD Person schema present on homepage (name, image, email, description, knowsAbout) | VERIFIED | `src/components/Head.astro` lines 27-50 define the jsonLd literal with all six fields; `dist/index.html` contains `knowsAbout` and `dragosmacsim@protonmail.com` |
| 4 | /now page has distinct title + description meta via BaseLayout | VERIFIED | `src/pages/now.astro` passes `title="What I'm doing now — Dragos Macsim"` and `description="Current focus: ..."` to BaseLayout; `dist/now/index.html` exists with the meta tags |
| 5 | /now route renders h1 'What I'm doing now' + three h2 sections (Working on, Learning, Location) | VERIFIED | `src/pages/now.astro` contains one `<h1>` and three `<h2>` blocks; `dist/now/index.html` (11,777 bytes) contains the literal text |
| 6 | /now nav link (desktop + mobile) navigates normally, not preventDefault'd | VERIFIED | `src/layouts/BaseLayout.astro` contains `href="/now"` twice (lines 37, 69); click handler (line 108) has `if (!href || !href.startsWith('#')) return;` — real routes pass through |
| 7 | /now link marked `data-active='true'` when on /now route | VERIFIED | `src/layouts/BaseLayout.astro` lines 119-122 set `data-active='true'` when `window.location.pathname === '/now'`; existing CSS rule `[data-nav-link][data-active='true']` styles it |
| 8 | /now page displays 'Last updated' date and links to nownownow.com/about | VERIFIED | `src/pages/now.astro` line 4 defines `LAST_UPDATED = "April 2026"` rendered on line 20; attribution link on lines 51-56 |
| 9 | Cloudflare Web Analytics beacon injected in PROD builds only, guarded by import.meta.env.PROD + token presence | VERIFIED (code wiring) | `src/layouts/BaseLayout.astro` lines 149-156: `{import.meta.env.PROD && cfAnalyticsToken && (<script ... src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={...}/>)}`; currently fail-closed in dist because no token set — runtime execution with token requires human step |
| 10 | Head.astro accepts ogImageSlug prop and builds /og/<slug>.png (absolute URL) | VERIFIED | `src/components/Head.astro` line 23: `const ogImagePath = ogImageSlug ? \`/og/${ogImageSlug}.png\` : "/og-image.png"`; line 63 emits `<meta property="og:image" content={ogImageAbsolute}/>` |
| 11 | Head.astro emits og:image:alt and twitter:image:alt meta tags | VERIFIED | `src/components/Head.astro` line 66 (og:image:alt) and line 71 (twitter:image:alt); `dist/index.html` contains `og:image:alt` |
| 12 | `src/lib/og-image.ts` exports generateOgImage({title, subtitle}) that returns a Buffer via Satori + @resvg/resvg-js | VERIFIED | Module imports satori, satori-html, @resvg/resvg-js, loads Inter 400/700 .woff via createRequire; generateOgImage runs Satori → SVG → Resvg → PNG Buffer |
| 13 | `src/pages/og/[slug].png.ts` endpoint with compile-time slug allowlist (home, now) | VERIFIED | `PAGES` is a literal `as const` array of exactly 2 entries; `getStaticPaths` maps only those; T-7-06 mitigation |
| 14 | Build emits dist/og/home.png and dist/og/now.png, both >5KB valid PNGs | VERIFIED | `dist/og/home.png` = 27,658 bytes, `dist/og/now.png` = 25,249 bytes; both start with PNG magic `\211 P N G \r \n 032 \n` |
| 15 | Homepage (dist/index.html) references /og/home.png as absolute og:image | VERIFIED | `grep 'og:image.*home.png' dist/index.html` returns `og:image" content="https://dragosmacsim.com/og/home.png"` |
| 16 | /now page (dist/now/index.html) references /og/now.png as absolute og:image | VERIFIED | `grep 'og:image.*now.png' dist/now/index.html` returns `og:image" content="https://dragosmacsim.com/og/now.png"` |
| 17 | Full Phase 7 test gate (build + vitest phase7-*) green; pre-existing failures tracked in deferred-items.md | VERIFIED | `npm run build` exits 0 with all artifacts; `npm test -- --run tests/phase7-*.test.ts` = 29 passed / 0 failed / 0 skipped across 5 suites |

**Score:** 17/17 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | satori, satori-html, @resvg/resvg-js, @fontsource/inter in deps; @astrojs/sitemap in devDeps; @fontsource-variable/inter retained | VERIFIED | All 6 packages present (grep confirmed) |
| `astro.config.mjs` | Sitemap integration + vite.ssr.external for @resvg/resvg-js | VERIFIED | Lines 3, 8, 11, 12 |
| `src/env.d.ts` | PUBLIC_CF_ANALYTICS_TOKEN type | VERIFIED | Line 10, with JSDoc |
| `public/robots.txt` | 5-line crawler directive + sitemap pointer | VERIFIED | Contents exactly match |
| `src/components/Head.astro` | ogImageSlug/ogImageAlt props, extended Person JSON-LD, og:image:alt meta | VERIFIED | Props on lines 10-12, JSON-LD lines 27-50, og:image:alt line 66, twitter:image:alt line 71, T-7-01 comment lines 72-75 |
| `src/layouts/BaseLayout.astro` | /now nav link (desktop+mobile), hash-only click guard, active-route setter, CF beacon (PROD-guarded), ogImageSlug forwarding | VERIFIED | All five changes in place (lines 11-17, 23, 37, 69, 103-114, 119-122, 149-156) |
| `src/pages/now.astro` | UI-SPEC Surface 1: h1, three h2, reveal wrapper, LAST_UPDATED, nownownow.com attribution, ogImageSlug="now" | VERIFIED | 60 lines, matches UI-SPEC verbatim |
| `src/lib/og-image.ts` | Satori + resvg helper with Inter .woff loading, 1200x630 canvas, UI-SPEC colours | VERIFIED | 72 lines; display:flex on every text div (fix auto-applied per plan 07-04 summary); #0a0a0f, #6366f1, #71717a all present |
| `src/pages/og/[slug].png.ts` | getStaticPaths + GET with PAGES allowlist (home, now) | VERIFIED | 51 lines; `PAGES as const` with exactly 2 entries |
| `src/pages/index.astro` | ogImageSlug="home" + explicit description + ogImageAlt | VERIFIED | Lines 10-15 |
| `.env.example` | PUBLIC_CF_ANALYTICS_TOKEN= placeholder | VERIFIED | (confirmed via plan 07-01 summary; not re-read) |
| `tests/phase7-seo.test.ts` | SEO assertions (robots, sitemap, Person schema, now meta, NOW-04/05) | VERIFIED | Runs green |
| `tests/phase7-nav.test.ts` | /now nav link + hash-only guard | VERIFIED | Runs green |
| `tests/phase7-analytics.test.ts` | CF beacon references + PROD guard | VERIFIED | Runs green |
| `tests/phase7-og.test.ts` | OG endpoint shape + Head.astro wiring + slug allowlist | VERIFIED | Runs green |
| `tests/phase7-build.test.ts` | dist sitemap files + OG PNGs | VERIFIED | Runs green |
| `tests/phase7.spec.ts` | Playwright: /now h1, /og/home.png 200, /og/unknown.png 404 | PRESENT (not re-run) | Plan 07-05 summary reports 3/3 passed against preview |
| `dist/sitemap-index.xml` | Post-build sitemap index | VERIFIED | 187 bytes, references sitemap-0.xml |
| `dist/sitemap-0.xml` | Lists / and /now/ URLs | VERIFIED | 432 bytes, contains both |
| `dist/robots.txt` | Sitemap pointer | VERIFIED | 76 bytes |
| `dist/og/home.png` | 1200x630 PNG, >5KB | VERIFIED | 27,658 bytes; PNG magic confirmed |
| `dist/og/now.png` | 1200x630 PNG, >5KB | VERIFIED | 25,249 bytes; PNG magic confirmed |
| `dist/index.html` | og:image→/og/home.png, knowsAbout, og:image:alt | VERIFIED | grep confirmed |
| `dist/now/index.html` | og:image→/og/now.png, h1 content | VERIFIED | grep confirmed |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `public/robots.txt` | `/sitemap-index.xml` | Sitemap: directive | WIRED | Literal line present |
| `astro.config.mjs` | `@astrojs/sitemap` | integrations array | WIRED | `sitemap()` called |
| `astro.config.mjs` | `@resvg/resvg-js` | vite.ssr.external | WIRED | `ssr: { external: ["@resvg/resvg-js"] }` |
| `src/pages/index.astro` | `BaseLayout` | ogImageSlug="home" prop | WIRED | Prop passed explicitly |
| `src/pages/now.astro` | `BaseLayout` | ogImageSlug="now" prop | WIRED | Prop passed explicitly |
| `src/layouts/BaseLayout.astro` | `Head.astro` | Props forwarded (title, description, ogImageSlug, ogImageAlt) | WIRED | Line 23 |
| `src/components/Head.astro` | `/og/<slug>.png` | Template literal `/og/${ogImageSlug}.png` → og:image meta | WIRED | Line 23 template, line 63 meta |
| `src/layouts/BaseLayout.astro` | cloudflareinsights.com beacon | PROD + token double-guard | WIRED (code) / NOT ACTIVE (runtime) | Code path present; PROD beacon omitted in current dist because no PUBLIC_CF_ANALYTICS_TOKEN set (fail-closed by design) |
| `src/layouts/BaseLayout.astro` | Hash-only scroll guard | `startsWith('#')` early-return | WIRED | Line 109 |
| `src/pages/og/[slug].png.ts` | `src/lib/og-image.ts` | `import { generateOgImage }` | WIRED | Line 2 |
| `src/lib/og-image.ts` | `@fontsource/inter` | `createRequire` + `readFileSync` for inter-latin-{400,700}-normal.woff | WIRED | Lines 19-27 |
| `src/lib/og-image.ts` | Satori + Resvg pipeline | `satori() → Resvg → asPng()` | WIRED | Lines 61-71 |
| `src/pages/og/[slug].png.ts` | PAGES allowlist | Compile-time `as const` tuple | WIRED | Line 17-28 (T-7-06 mitigation) |
| `src/pages/now.astro` | `LAST_UPDATED` + nownownow.com/about | Constant + external link | WIRED | Lines 4, 20, 51-56 |
| `src/layouts/BaseLayout.astro` | `/now` active-route setter | `window.location.pathname` check | WIRED | Lines 119-122 |

### Data-Flow Trace (Level 4)

Static-site phase. All artifacts are either compile-time-rendered HTML/JSON-LD or deterministic build outputs from PAGES literal. No dynamic data source; no hollow-props risk. Level 4 marked as N/A for this phase — data is either hand-authored literals (Head.astro JSON-LD, now.astro copy, OG PAGES) or derived from `import.meta.env` (CF token).

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `Head.astro` JSON-LD | `jsonLd` literal | Hand-authored constants | Yes | FLOWING |
| `now.astro` body | `LAST_UPDATED`, inline copy | Hand-authored | Yes | FLOWING |
| `og/[slug].png.ts` | `PAGES` | `as const` literal | Yes | FLOWING |
| `BaseLayout.astro` beacon | `cfAnalyticsToken` | `import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN` | No token set in current build → fail-closed | STATIC (expected) |
| `dist/og/home.png`, `dist/og/now.png` | PNG bytes | `generateOgImage({title,subtitle})` via Satori+Resvg | Yes (27KB and 25KB real PNGs) | FLOWING |
| `dist/sitemap-0.xml` | `<url>` entries | @astrojs/sitemap crawl | Yes (both / and /now/ listed) | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Phase 7 vitest suite passes | `npm test -- --run tests/phase7-*.test.ts` | Test Files 5 passed (5); Tests 29 passed (29); Duration 88ms | PASS |
| Build produces dist/ artifacts | `ls dist/ dist/og/ dist/now/` | All expected files present (robots.txt, sitemap-*.xml, og/home.png, og/now.png, now/index.html) | PASS |
| PNG magic bytes valid | `od -c dist/og/{home,now}.png \| head -1` | Both start with `\211 P N G \r \n 032 \n` | PASS |
| Sitemap references both routes | `grep dist/sitemap-0.xml` | Contains `https://dragosmacsim.com/` and `https://dragosmacsim.com/now/` | PASS |
| Homepage dist has og:image→home.png | `grep 'og:image.*home.png' dist/index.html` | `og:image" content="https://dragosmacsim.com/og/home.png"` | PASS |
| /now dist has og:image→now.png | `grep 'og:image.*now.png' dist/now/index.html` | `og:image" content="https://dragosmacsim.com/og/now.png"` | PASS |
| JSON-LD knowsAbout shipped to homepage | `grep 'knowsAbout' dist/index.html` | 1 match | PASS |
| og:image:alt shipped to homepage | `grep 'og:image:alt' dist/index.html` | 1 match | PASS |
| CF beacon correctly absent without token | `grep 'cloudflareinsights' dist/index.html dist/now/index.html` | 0 matches (fail-closed by design) | PASS |
| Playwright E2E suite | Last run in plan 07-05 against preview | 3/3 passed (NOW-01 h1, OG-05 home 200+PNG, OG-05 unknown 404) | PASS (per plan summary; not re-executed) |

### Requirements Coverage

**Note on REQUIREMENTS.md scope:** Only NOW-01..NOW-05 are formally declared in `.planning/REQUIREMENTS.md`. The remaining IDs (SEO-03..SEO-07, ANALYTICS-01, OG-01..OG-06) are Phase-7-local requirement IDs introduced by the ROADMAP.md Phase 7 row and consumed by the plan frontmatters. They are verified by plan evidence and codebase grep, but are not yet registered in the master REQUIREMENTS.md traceability table. This is a documentation gap, not an implementation gap — flagged below.

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| SEO-03 | 07-02 | public/robots.txt present and references sitemap-index.xml | SATISFIED | `public/robots.txt` verified + phase7-seo SEO-03 suite green |
| SEO-04 | 07-01 | @astrojs/sitemap integration in astro.config.mjs | SATISFIED | astro.config.mjs + phase7-seo SEO-04 suite green |
| SEO-05 | 07-01, 07-05 | dist/sitemap-index.xml + sitemap-0.xml emitted at build | SATISFIED | Both files present; phase7-build suite green |
| SEO-06 | 07-02 | Extended Person JSON-LD (image, email, description, knowsAbout) | SATISFIED | Head.astro jsonLd + phase7-seo SEO-06 suite green + dist grep |
| SEO-07 | 07-03, 07-05 | /now page passes explicit title/description to BaseLayout | SATISFIED | now.astro props + phase7-seo SEO-07 suite green |
| ANALYTICS-01 | 07-01, 07-03 | CF Web Analytics beacon wired with PROD + token guard | SATISFIED (code) / HUMAN-VERIFY (runtime) | BaseLayout.astro guards in place; runtime activation requires token — human verification item |
| NOW-01 | 07-03 | /now page renders at build time under src/pages/now.astro, reachable at /now | SATISFIED | src/pages/now.astro + dist/now/index.html + Playwright smoke |
| NOW-02 | 07-03 | /now nav link visible in desktop and mobile nav | SATISFIED | BaseLayout.astro two occurrences of href="/now" + phase7-nav NOW-02 suite green |
| NOW-03 | 07-03 | Nav click handler guards hash-only vs route links | SATISFIED | `startsWith('#')` early-return + phase7-nav NOW-03 suite green |
| NOW-04 | 07-03 | /now page contains >=3 h2 sections | SATISFIED | Working on / Learning / Location + phase7-seo NOW-04 suite green |
| NOW-05 | 07-03 | /now page has Last updated + nownownow.com/about attribution | SATISFIED | LAST_UPDATED + external link + phase7-seo NOW-05 suite green |
| OG-01 | 07-01, 07-04 | OG endpoint shape (getStaticPaths + GET + generateOgImage + slug allowlist) | SATISFIED | src/pages/og/[slug].png.ts + phase7-og OG-01 suite green |
| OG-02 | 07-04 | dist/og/home.png is valid PNG >5KB | SATISFIED | 27,658 bytes + PNG magic + phase7-build OG-02/03 suite green |
| OG-03 | 07-04 | dist/og/now.png is valid PNG >5KB | SATISFIED | 25,249 bytes + PNG magic + phase7-build OG-02/03 suite green |
| OG-04 | 07-02 | Head.astro ogImageSlug prop wiring + og:image:alt | SATISFIED | Head.astro lines 10, 23, 66 + phase7-og OG-04 suite green |
| OG-05 | 07-01, 07-04 | /og/home.png endpoint serves PNG; /og/unknown.png rejected | SATISFIED | Playwright phase7.spec.ts 3/3 passed against preview; compile-time allowlist = real 404 for unknowns |
| OG-06 | 07-02, 07-04, 07-05 | Homepage + /now wired to per-page OG images via ogImageSlug prop | SATISFIED | index.astro `ogImageSlug="home"` + now.astro `ogImageSlug="now"` + dist HTML grep confirms both OG URLs |

**Total: 17/17 requirements satisfied.** ANALYTICS-01 is the only one with a deferred runtime verification (token not set → beacon correctly fail-closed in current dist).

**Documentation gap flagged:** `.planning/REQUIREMENTS.md` does not yet list SEO-03..SEO-07, ANALYTICS-01, or OG-01..OG-06 in its formal requirement tables (only NOW-01..NOW-05 are declared). A future docs pass (Phase 8 Quality Hardening is a reasonable home) should backfill these IDs with descriptions and traceability rows so future verifiers do not have to reconstruct their definitions from plan frontmatters. This is NOT a blocker for Phase 7 verification — the requirements are authoritative in the ROADMAP row and the plan frontmatters, and every ID is satisfied by verified code.

### Anti-Patterns Found

Phase 7 files scanned for stubs, TODOs, empty implementations, and hardcoded empty data:

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | No blocker anti-patterns found | — | — |

**Notes:**
- `return new Response(new Uint8Array(png), {...})` in the OG endpoint returns real PNG bytes produced by Satori + Resvg — not an empty fallback.
- `src/pages/now.astro` content (mytai / MSc / Mindrift) is editorial placeholder copy per UI-SPEC Open Decision #2; UI-SPEC explicitly allows shipping placeholder and refining later. Not a stub in the technical sense.
- `cfAnalyticsToken` being undefined at build time is the intended fail-closed branch of the beacon code, not a stub.
- `@fontsource-variable/inter` and `@fontsource/inter` coexisting is intentional (dual-package strategy for Satori .woff parsing, documented in 07-01 summary).

### Human Verification Required

The following items cannot be verified programmatically and require the human to eyeball in a browser or against live production. Six items total — see frontmatter for structured format.

1. **`/now` page visual sign-off** — render h1 + 3 h2 sections + attribution footer; confirm scroll-reveal animation, theme switching, nav active underline.
2. **OG image visual correctness** — open `/og/home.png` and `/og/now.png` and confirm Satori-rendered layout, typography, and colours match UI-SPEC Surface 3.
3. **CF Web Analytics beacon with real token** — requires setting `PUBLIC_CF_ANALYTICS_TOKEN` and running `npm run build && npm run preview`; view-source should show the beacon script tag. Current dist is fail-closed because no token is configured.
4. **Google Rich Results Test + LinkedIn Post Inspector** — post-deploy checks against `https://dragosmacsim.com/` and `/now` to confirm schema and card preview render in real third-party validators.
5. **Theme toggle on `/now`** — confirm all text responds to dark/light mode correctly.
6. **Real navigation behaviour** — click desktop and mobile `Now` nav links across viewport sizes; confirm hash anchors still smooth-scroll.

### Deferred Items

Not applicable — no Phase 7 must-have is addressed by a later phase. Pre-existing test failures (14-15 tests in non-Phase-7 suites) are explicitly tracked in `deferred-items.md` and are out of scope per the phase boundary; they are NOT Phase 7 gaps.

### Gaps Summary

**No gaps in Phase 7 scope.** All 17 must-haves are verified against the actual codebase, every required artifact exists and is substantive, every key link is wired, every Phase 7 test is green, and every ROADMAP-declared requirement ID is satisfied by verified code.

The phase is complete pending human visual verification of the six items listed above. The most important human check is the CF beacon runtime test — the code path is verified but fail-closed in the current dist because no `PUBLIC_CF_ANALYTICS_TOKEN` is configured. The user needs to populate this token in `.env` (or Cloudflare Pages env vars) before the next production deploy to actually activate analytics.

One documentation-only gap worth noting for Phase 8: the 11 Phase-7-specific requirement IDs (SEO-03..SEO-07, ANALYTICS-01, OG-01..OG-06) are authoritative in ROADMAP.md and plan frontmatters but are not yet listed in the `.planning/REQUIREMENTS.md` traceability tables. Phase 8 Quality Hardening is a natural home for backfilling these rows.

---

_Verified: 2026-04-11T18:15:00Z_
_Verifier: Claude (gsd-verifier)_
