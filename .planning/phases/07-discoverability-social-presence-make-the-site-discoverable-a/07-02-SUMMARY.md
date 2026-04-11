---
phase: 07-discoverability-social-presence
plan: 02
subsystem: seo
tags: [seo, robots, sitemap, json-ld, person-schema, open-graph, astro, head]

# Dependency graph
requires:
  - phase: 07-discoverability-social-presence
    provides: Sitemap integration (Plan 07-01) — sitemap-index.xml endpoint referenced by robots.txt
  - phase: 02
    provides: Base Head.astro with original JSON-LD Person, OG tags, canonical URL
provides:
  - "public/robots.txt — crawler allow-all + sitemap-index pointer"
  - "src/components/Head.astro — ogImageSlug prop → /og/<slug>.png wiring with static fallback"
  - "src/components/Head.astro — og:image:alt + twitter:image:alt meta tags"
  - "Extended Person JSON-LD (image, email, description, givenName, familyName, knowsAbout)"
affects:
  - "Plan 07-04 (/now page) — will pass ogImageSlug=\"now\" to Head via BaseLayout"
  - "Plan 07-05 (per-page OG image generator) — will author the slugs consumed by Head.astro's prop"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hand-maintained JSON-LD literal via set:html={JSON.stringify(...)} — no runtime prop injection (T-7-01 mitigation)"
    - "Conditional OG image path: ogImageSlug ? `/og/${slug}.png` : `/og-image.png` — template string preserved to match forward-compat test regex"

key-files:
  created:
    - "public/robots.txt"
  modified:
    - "src/components/Head.astro"

key-decisions:
  - "[Phase 07-02]: Static public/robots.txt (no astro-robots-txt plugin) — zero new deps, 4 lines + trailing newline"
  - "[Phase 07-02]: Renamed ogImage prop to ogImageSlug (breaking) — verified no downstream callers reference the old name via grep"
  - "[Phase 07-02]: knowsAbout list sourced from UI-SPEC Open Decision #5 default — 6 entries (AI, ML, Data Analysis, Product Development, Python, TypeScript)"
  - "[Phase 07-02]: email pulled from src/data/contact.ts literal (dragosmacsim@protonmail.com) rather than imported — keeps JSON-LD values strictly hand-maintained per T-7-01 discipline"
  - "[Phase 07-02]: ogImageAltText default \"Dragos Macsim — AI Specialist & Product Builder\" — matches UI-SPEC homepage OG subtitle"

patterns-established:
  - "Forward-compatible Head.astro contract: ogImageSlug is optional, so every existing page continues to render /og-image.png with zero code changes; /now and future pages opt in to /og/<slug>.png by passing the prop"
  - "T-7-01 discipline comment inline above set:html — documents the rule so future edits cannot accidentally inject Astro.props into jsonLd"

requirements-completed:
  - "SEO-03"
  - "SEO-06"
  - "OG-04"
  - "OG-06"

# Metrics
duration: ~80s
completed: 2026-04-11
---

# Phase 07 Plan 02: SEO Fundamentals Summary

**Shipped public/robots.txt with sitemap pointer and extended Head.astro with ogImageSlug prop, og:image:alt meta tag, and a richer JSON-LD Person schema (image, email, description, knowsAbout) — unblocking Wave 1+ per-page OG wiring and richer SERP/LLM indexing.**

## Performance

- **Duration:** ~80s
- **Started:** 2026-04-11T16:52:15Z
- **Completed:** 2026-04-11T16:53:35Z
- **Tasks:** 2 / 2
- **Files created:** 1
- **Files modified:** 1

## Accomplishments

- `public/robots.txt` exists with literal `User-agent: *`, `Allow: /`, and `Sitemap: https://dragosmacsim.com/sitemap-index.xml` lines
- `tests/phase7-seo.test.ts` `SEO-03 robots.txt` suite activated and passing (previously skipped in Plan 07-01)
- `tests/phase7-seo.test.ts` `SEO-06 extended Person schema` suite activated and passing
- `tests/phase7-og.test.ts` `OG-04 Head.astro ogImageSlug wiring` suite activated and passing (3 asserts: prop, URL template, og:image:alt)
- `src/components/Head.astro` now accepts `ogImageSlug?: string` and `ogImageAlt?: string` props
- `og:image` URL now computed from `ogImageSlug` when provided, falls back to `/og-image.png`
- `og:image:alt` and `twitter:image:alt` meta tags emitted on every page
- JSON-LD Person now contains `givenName`, `familyName`, `description`, `image`, `email`, `knowsAbout` (6 entries)
- T-7-01 mitigation comment placed inline above the `set:html` script tag
- `npm run build` exits 0; `dist/index.html` post-build contains both `knowsAbout` and `og:image:alt`

## Task Commits

1. **Task 1: Create public/robots.txt** — `3ca2f8a` (feat)
2. **Task 2: Extend Head.astro — Person JSON-LD, ogImageSlug prop, og:image:alt meta** — `b72a0ff` (feat)

## Files Created/Modified

### Created

- `public/robots.txt` — 4-line crawler directive + trailing newline, pointing Googlebot/Bingbot/etc. at the sitemap index Plan 07-01 wired up

### Modified

- `src/components/Head.astro` — Renamed `ogImage` → `ogImageSlug`, added `ogImageAlt` prop, extended JSON-LD Person with 6 new fields, added `og:image:alt` + `twitter:image:alt` tags, added T-7-01 discipline comment

## Decisions Made

1. **Static `public/robots.txt` over `astro-robots-txt` plugin** — zero new dependencies; the file is 4 lines and never changes based on build mode. The plugin would be overkill for a single static directive.
2. **Breaking rename of `ogImage` → `ogImageSlug`** — intentional. `ogImage` expected a full path string; `ogImageSlug` expects just the slug and computes the path. A `grep -rn "ogImage" src/` confirmed zero downstream callers, so no migration pain.
3. **`knowsAbout` list uses UI-SPEC Open Decision #5 default** — `["Artificial Intelligence", "Machine Learning", "Data Analysis", "Product Development", "Python", "TypeScript"]`. Six entries is enough for LLM answer engines to anchor identity without diluting specificity. Can be expanded in Phase 8 if Rich Results Test flags gaps.
4. **Email literal inlined, not imported from `contact.ts`** — preserves the T-7-01 discipline that every `jsonLd` value is a hand-maintained literal. An import is a second edit surface that could drift.
5. **`ogImageAltText` default uses the homepage OG subtitle copy** — "Dragos Macsim — AI Specialist & Product Builder". Every page that does not pass an explicit `ogImageAlt` gets this accessible fallback, matching the fallback `/og-image.png` it describes.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. Both tasks completed on first pass; both `<automated>` verify commands passed without intervention.

### Pre-existing (out of scope — unchanged)

The 15 pre-existing vitest failures documented in `07-01-SUMMARY.md` (`about-section.test.ts`, `cv-section.test.ts`, `design-system.test.ts`, `hero-section.test.ts`, `seo-metadata.test.ts`) are still present and still unrelated to Phase 7. Scope boundary respected — not touched. See `deferred-items.md`.

## User Setup Required

None. Both artifacts are pure static/build-time content — no environment variables, no tokens, no DNS changes, no deploy action needed for this plan specifically.

## Next Plan Readiness

Ready for:
- **Plan 07-04 (/now page):** will pass `ogImageSlug="now"` and `ogImageAlt="What I'm doing now — Dragos Macsim"` to `<BaseLayout>` → `<Head>`.
- **Plan 07-05 (per-page OG image generator):** the `ogImageSlug` contract is locked — the generator must produce `/og/home.png` and `/og/now.png` to match. The current `/og/${ogImageSlug}.png` URL resolves at runtime regardless of whether the file exists, but Playwright's 404 test in `phase7.spec.ts` will enforce that the endpoint returns real PNGs once Plan 07-05 lands.

No blockers. No concerns.

## Self-Check: PASSED

**Files verified on disk:**
- FOUND: `public/robots.txt` — contains the 3 literal lines + sitemap directive
- FOUND: `src/components/Head.astro` — contains `ogImageSlug`, `knowsAbout`, `og:image:alt`, `dragosmacsim@protonmail.com`, `T-7-01`

**Commits verified:**
- FOUND: `3ca2f8a` (Task 1 — feat 07-02: robots.txt)
- FOUND: `b72a0ff` (Task 2 — feat 07-02: Head.astro extension)

**Verify commands exit 0 (Phase 7 scope):**
- `npm test -- --run tests/phase7-seo.test.ts tests/phase7-og.test.ts` → 10 passed / 9 skipped / 0 failed across 2 suites
- `npm run build` → exits 0; `dist/index.html` contains `knowsAbout` and `og:image:alt`

**Acceptance criteria verified:**
- robots.txt has `User-agent: *`, `Allow: /`, `Sitemap: https://dragosmacsim.com/sitemap-index.xml` — YES
- robots.txt does NOT contain `Disallow:` or `Crawl-delay:` — YES
- Head.astro `Props` contains `ogImageSlug?: string` and `ogImageAlt?: string` — YES
- Head.astro does NOT contain old `ogImage?: string` prop — YES
- File contains literal `` `/og/${ogImageSlug}.png` `` template — YES
- JSON-LD contains `knowsAbout` array with 6 entries — YES
- JSON-LD contains `email: "mailto:dragosmacsim@protonmail.com"` — YES
- JSON-LD contains `image: new URL("/profile.jpg", Astro.site).toString()` — YES
- JSON-LD contains `description:` field mentioning "AI specialist" — YES
- File contains `<meta property="og:image:alt" content={ogImageAltText} />` — YES
- File contains `<meta name="twitter:image:alt" content={ogImageAltText} />` — YES
- File contains comment block referencing `T-7-01` — YES
- `dist/index.html` post-build contains JSON-LD with `knowsAbout` text — YES

---
*Phase: 07-discoverability-social-presence-make-the-site-discoverable-a*
*Completed: 2026-04-11*
