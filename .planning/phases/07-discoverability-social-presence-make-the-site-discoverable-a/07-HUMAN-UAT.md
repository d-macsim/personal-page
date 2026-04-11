---
status: partial
phase: 07-discoverability-social-presence
source: [07-VERIFICATION.md]
started: 2026-04-11T18:15:00Z
updated: 2026-04-11T18:15:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. /now page visual sign-off
expected: h1 "What I'm doing now", "Last updated: April 2026" line, intro paragraph, Working on/Learning/Location sections, nownownow.com attribution footer; nav "Now" link shows active underline; scroll-reveal animation fires; dark/light theme works
result: [pending]

### 2. OG images visual inspection
expected: /og/home.png and /og/now.png — 1200x630 dark card with indigo "dragosmacsim.com" eyebrow, bold title (Dragos Macsim / What I'm doing now), muted subtitle; no layout clipping, no missing glyphs
result: [pending]

### 3. Cloudflare Web Analytics beacon in production
expected: With `PUBLIC_CF_ANALYTICS_TOKEN=<real-token>` set in .env, `npm run build && npm run preview` view-source on `/` shows `<script ... src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "<real-token>"}'>` before `</body>`. Current build is fail-closed (no token set).
result: [pending]
note: requires real Cloudflare Web Analytics token from dash.cloudflare.com → Web Analytics

### 4. Google Rich Results + LinkedIn Post Inspector
expected: After deploy, Rich Results Test finds a valid Person schema (name, image, email, knowsAbout); LinkedIn Post Inspector shows the branded /og/home.png card
result: [pending]
note: requires live production URL

### 5. Theme toggle on /now page
expected: All text colours update via CSS variables; no contrast regressions in dark or light mode
result: [pending]

### 6. Real nav clicks (hash-guard fix validation)
expected: Desktop and mobile "Now" nav links actually navigate to /now (not preventDefault'd); existing hash links (#about, #experience, #projects, #contact) still smooth-scroll from the homepage
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps

*No functional gaps. All automated must-haves verified (17/17). Human items are visual-quality and third-party integration checks that cannot run programmatically.*

## Follow-up actions for user

1. Create a Cloudflare Web Analytics site at https://dash.cloudflare.com/?to=/:account/web-analytics and copy the token to `.env` as `PUBLIC_CF_ANALYTICS_TOKEN=...` before deploying to production
2. After deploy, run the Google Rich Results Test against the production URL
3. After deploy, paste the production URL into LinkedIn's Post Inspector to confirm the OG card renders
4. Use `/gsd-verify-work 7` to tick off each item as you verify it
