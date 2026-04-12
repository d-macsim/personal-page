---
status: complete
phase: 07-discoverability-social-presence
source: [07-VERIFICATION.md]
started: 2026-04-11T18:15:00Z
updated: 2026-04-12T00:00:00Z
---

## Current Test

[all tests complete]

## Tests

### 1. /now page visual sign-off
expected: h1 "What I'm doing now", "Last updated: April 2026" line, intro paragraph, Working on/Learning/Location sections, nownownow.com attribution footer; nav "Now" link shows active underline; scroll-reveal animation fires; dark/light theme works
result: pass
note: User confirmed via production screenshot showing correct layout at https://dragosmacsim.com/now

### 2. OG images visual inspection
expected: /og/home.png and /og/now.png — 1200x630 dark card with indigo "dragosmacsim.com" eyebrow, bold title (Dragos Macsim / What I'm doing now), muted subtitle; no layout clipping, no missing glyphs
result: pass
note: curl-verified on production. /og/home.png returns 200 image/png, 27658 bytes (matches local build). /og/now.png returns 200 image/png, 25249 bytes. User confirmed /og/now.png visually via browser screenshot; /og/home.png was a stale browser cache in the earlier screenshot (live server returns correct PNG).

### 3. Cloudflare Web Analytics beacon in production
expected: With `PUBLIC_CF_ANALYTICS_TOKEN=<real-token>` set in .env, `npm run build && npm run preview` view-source on `/` shows `<script ... src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "<real-token>"}'>` before `</body>`. Current build is fail-closed (no token set).
result: pass
note: Token configured in Cloudflare Pages Variables & Secrets. curl-verified on production — both https://dragosmacsim.com/ and https://dragosmacsim.com/now/ embed `cloudflareinsights.com/beacon.min.js` with data-cf-beacon token `19ed33f2eacb49aaa4002ed389ee6f6d`. CF dashboard already shows traffic (6 pageviews / 5 visits in prior 24h from pre-Phase-7 deploy).

### 4. Google Rich Results + LinkedIn Post Inspector
expected: After deploy, Rich Results Test finds a valid Person schema (name, image, email, knowsAbout); LinkedIn Post Inspector shows the branded /og/home.png card
result: pass
note: |
  Google Rich Results Test: "No items detected" is EXPECTED — Person schema does not qualify for rich snippets (reserved for Article, Product, FAQ, etc.); Google surfaces Person via Knowledge Graph, not rich results. Critically, Google "Crawled successfully on 11 Apr 2026 18:51:23" — the page is reachable and the crawler executed without errors. Schema.org validator (validator.schema.org) confirms 0 errors, 0 warnings: Person entity populated with @type, name, givenName, familyName, jobTitle, description, url, image, email, sameAs, knowsAbout (AI, ML, Data Analysis, Product Development, Python, TypeScript).

  LinkedIn Post Inspector: branded OG card renders correctly (dark dragosmacsim.com eyebrow + "Dragos Macsim" title + "AI Specialist & Product Builder" subtitle). One warning: "description should be at least 100 characters long" (was 88). FIXED in commit 5cf3abd — meta description now 142 chars across homepage (index.astro) and default fallback (Head.astro), highlighting MSc at Bayes, mytai iOS, and ML-backed product work. Pushed to master; CF Pages rebuilding. Phase 7 SEO tests still 12/12 passing after the edit.

### 5. Theme toggle on /now page
expected: All text colours update via CSS variables; no contrast regressions in dark or light mode
result: pass
note: User reported "mostly ok" — theme toggle itself works correctly on /now. The "mostly" caveat referred to the separate nav bug (test 6), not the theme system.

### 6. Real nav clicks (hash-guard fix validation)
expected: Desktop and mobile "Now" nav links actually navigate to /now (not preventDefault'd); existing hash links (#about, #experience, #projects, #contact) still smooth-scroll from the homepage
result: pass
note: |
  ISSUE FOUND initially: clicking About/Experience/Projects/Contact from /now did nothing because the nav hrefs were hardcoded #about (etc.) and the scroll-handler tried to querySelector on /now's DOM which has no such sections.

  FIX: BaseLayout.astro now computes the hash prefix at render time based on Astro.url.pathname. On the homepage, hrefs stay #about (in-page smooth scroll). On any other route (/now, future case studies), hrefs become /#about (browser navigates back to homepage and lands on the anchor). The existing startsWith('#') scroll-guard correctly no-ops on /#about because it starts with /, so browser default navigation handles it. Committed in 5356f48.

  VERIFICATION: tests/phase7-nav-live.spec.ts — 10 Playwright tests running against production https://dragosmacsim.com (committed in 734d3b6):
  1. Homepage: hash links stay #about (no slash prefix) — PASS
  2. /now: hash links are /#about (slash prefix present) — PASS
  3-6. /now: clicking each of About/Experience/Projects/Contact navigates to correct homepage anchor — PASS (4 tests)
  7. Homepage: clicking Now navigates to /now — PASS
  8. Homepage: clicking About does NOT change URL pathname (in-page scroll) — PASS
  9. /now: Now nav link has data-active='true' — PASS
  10. /now: build-time CF Analytics beacon with expected token reaches production — PASS

  SEPARATE FINDING: Cloudflare Pages is ALSO auto-injecting its own analytics beacon at the CDN layer (token b152ed1dbd084502b86c5e58afe5a31d, independent of our build). Two beacons fire on every page load. User chose Option A: keep manual beacon (version-controlled, portable) and disable CF Pages auto-inject via dashboard Settings → Web Analytics toggle + delete orphan auto-created site. Pending user dashboard action — not a code issue.

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0
blocked: 0

**Two fixes landed during UAT:**
- 5cf3abd — meta description 88 → 142 chars (LinkedIn Post Inspector warning)
- 5356f48 — nav hash-prefix on non-home routes (clicking About from /now was broken)
- 734d3b6 — live Playwright regression suite (tests/phase7-nav-live.spec.ts, 10/10 passing against production)

**Phase 7 is complete. User dashboard action pending (non-blocking):**
Disable Cloudflare Pages auto-inject Web Analytics and delete the orphan auto-created site, to avoid double-beacon injection. See follow-up actions below.

## Gaps

*No functional gaps. All automated must-haves verified (17/17). Human items are visual-quality and third-party integration checks that cannot run programmatically.*

## Follow-up actions for user

1. Create a Cloudflare Web Analytics site at https://dash.cloudflare.com/?to=/:account/web-analytics and copy the token to `.env` as `PUBLIC_CF_ANALYTICS_TOKEN=...` before deploying to production
2. After deploy, run the Google Rich Results Test against the production URL
3. After deploy, paste the production URL into LinkedIn's Post Inspector to confirm the OG card renders
4. Use `/gsd-verify-work 7` to tick off each item as you verify it
