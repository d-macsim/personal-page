---
phase: 07-discoverability-social-presence-make-the-site-discoverable-a
reviewed: 2026-04-11T00:00:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - public/robots.txt
  - astro.config.mjs
  - src/env.d.ts
  - src/components/Head.astro
  - src/layouts/BaseLayout.astro
  - src/lib/og-image.ts
  - src/pages/og/[slug].png.ts
  - src/pages/now.astro
  - src/pages/index.astro
  - tests/phase7-seo.test.ts
  - tests/phase7-nav.test.ts
  - tests/phase7-analytics.test.ts
  - tests/phase7-og.test.ts
  - tests/phase7-build.test.ts
  - tests/phase7.spec.ts
findings:
  critical: 0
  warning: 3
  info: 6
  total: 9
status: issues_found
---

# Phase 7: Code Review Report

**Reviewed:** 2026-04-11
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Phase 7 delivers discoverability and social presence: `/now` page, sitemap integration, extended Person JSON-LD, per-page OG image generation via Satori + resvg, robots.txt, and Cloudflare Web Analytics. The implementation is thoughtful — the OG slug allowlist (T-7-06) is correctly implemented at `getStaticPaths` time, analytics is PROD-guarded (T-7-01/ANALYTICS-01), and JSON-LD values are hand-maintained literals per the T-7-01 mitigation comment.

Overall the threat-model items from the phase plan are addressed. No Critical findings. Three Warnings concern: fragile `JSON.stringify` escaping for JSON-LD, unvalidated analytics token interpolation, and unpinned new dependencies (T-7-04). Six Info items cover type tightening, edge-runtime portability, and defensive patterns.

## Warnings

### WR-01: `JSON.stringify` in `<script type="application/ld+json">` does not escape `</` — fragile under future edits

**File:** `src/components/Head.astro:76`
**Issue:** The JSON-LD block is rendered via `set:html={JSON.stringify(jsonLd)}`. The comment on lines 72-75 correctly notes that `JSON.stringify` does not escape `</` as `<\/`, but the code does not implement the escape. Today every value in `jsonLd` is a hand-maintained string literal, so there is no `</` sequence and no active XSS. However, this is load-bearing on future discipline — a contributor adding, say, `description: "Learn HTML </script>"` or pulling a value from `Astro.props` would silently break out of the `<script>` tag. Since `set:html` is explicitly opt-out of Astro's auto-escaping, the safety net is gone.

**Fix:** Add the escape at the sink so it is safe by construction and not dependent on contributor vigilance:
```astro
<script type="application/ld+json" set:html={
  JSON.stringify(jsonLd).replace(/</g, "\\u003c")
} />
```
`\u003c` survives JSON parsing as `<`, so consumers of the JSON-LD see the correct value, but the raw HTML cannot contain `</script>`. This also collapses the T-7-01 mitigation comment from "never do X" to "we're safe regardless".

### WR-02: Cloudflare analytics token interpolated into a JSON attribute without quoting or validation

**File:** `src/layouts/BaseLayout.astro:149-155`
**Issue:** `data-cf-beacon={`{"token": "${cfAnalyticsToken}"}`}` interpolates `import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN` directly into a JSON-ish string. Although the token is documented as "32-char hex" in `src/env.d.ts` and is not a secret, there is no validation on the env var. A misconfigured `.env` containing `abc"}` or `abc</script>` would produce malformed HTML and, worst case, let an attacker who controls the build env inject HTML/script into every page. Input validation is cheap here and matches the project's "validate at system boundaries" rule.

**Fix:** Validate the token shape and reject anything that is not 32 hex chars at build time. Either compute a sanitized constant in the frontmatter, or switch to a discrete attribute Cloudflare already supports:
```astro
---
const rawToken = import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN;
const cfAnalyticsToken = /^[a-f0-9]{32}$/i.test(rawToken ?? "") ? rawToken : null;
---
{import.meta.env.PROD && cfAnalyticsToken && (
  <script
    is:inline
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={JSON.stringify({ token: cfAnalyticsToken })}
  />
)}
```
`JSON.stringify` on an object with a validated token gives correct, quoted output and removes the manual template-string assembly.

### WR-03: Phase 7 dependencies use caret ranges — T-7-04 supply chain threat is not mitigated by pinning

**File:** `package.json:17-40`
**Issue:** T-7-04 in the Phase 7 threat model calls for pinned deps. Every new Phase 7 dependency is installed with a caret range, not an exact pin:
- `satori: ^0.26.0` (0.x — caret permits any 0.26.x patch)
- `satori-html: ^0.3.2` (0.x — same)
- `@resvg/resvg-js: ^2.6.2`
- `@fontsource/inter: ^5.2.8`
- `@astrojs/sitemap: ^3.7.2` (devDependencies)

For a portfolio site this is low blast radius, but these packages execute code at build time on the developer machine and on Cloudflare Pages build runners, so a compromised transitive can run arbitrary code in CI. The lockfile (if committed) gives reproducibility, but a fresh `npm install` on a machine without it would still resolve newer versions.

**Fix:** Either (a) pin exact versions for the build-time-executing packages:
```json
"satori": "0.26.0",
"satori-html": "0.3.2",
"@resvg/resvg-js": "2.6.2",
```
or (b) document in CLAUDE.md that `package-lock.json` is the source of truth and ensure it is committed and used by `npm ci` in the Cloudflare Pages build command. Whichever is chosen, record the decision so T-7-04 can be marked addressed.

## Info

### IN-01: `ogImageAlt` is documented as "Required when ogImageSlug is set" but not enforced

**File:** `src/components/Head.astro:11-12, 25`
**Issue:** The JSDoc says alt text is required when a slug is provided, but the `Props` interface uses `ogImageAlt?: string` and `line 25` silently falls back to a generic alt. The documented invariant is unenforceable by the type system as written, and a contributor who forgets the alt gets no error.

**Fix:** Use a discriminated union so the compiler enforces the invariant:
```ts
type Props =
  | { title: string; description?: string; ogImageSlug?: undefined; ogImageAlt?: undefined }
  | { title: string; description?: string; ogImageSlug: string; ogImageAlt: string };
```

### IN-02: `as PageEntry` type assertion discards the real Astro prop type

**File:** `src/pages/og/[slug].png.ts:40`
**Issue:** `const { title, subtitle } = props as PageEntry;` uses a type assertion where no runtime check exists. `getStaticPaths` already guarantees `props` is a `PageEntry` (line 33 spreads `PAGES`), so the assertion is unnecessary and hides any future drift. Casting is a code smell that the rules file flags as equivalent to `as any`.

**Fix:** Type the route generically via `APIRoute<PageEntry>` (or destructure without assertion — Astro infers `props` from `getStaticPaths`):
```ts
export const GET: APIRoute<PageEntry> = async ({ props }) => {
  const { title, subtitle } = props;
  // ...
};
```

### IN-03: `og-image.ts` uses Node-only APIs — incompatible with edge runtime if Cloudflare adapter is added

**File:** `src/lib/og-image.ts:1-27`
**Issue:** The module uses `node:fs.readFileSync`, `node:module.createRequire`, and Node `Buffer`. Today this is fine because the route is emitted at build time via `getStaticPaths` and the output is pure static (`astro.config.mjs` has no adapter). If a future phase adds `@astrojs/cloudflare` to move any page to SSR, this module will break at runtime because Cloudflare Workers have no `fs` and only a subset of Node APIs.

**Fix:** Leave as-is for now but add a one-line comment documenting the build-time-only assumption so no one accidentally imports `generateOgImage` from an SSR route:
```ts
// BUILD-TIME ONLY. Uses node:fs for font loading; do not import from SSR/edge routes.
```

### IN-04: Inline theme script reads `localStorage` without try/catch — throws in private/embedded contexts

**File:** `src/components/Head.astro:77-97`
**Issue:** The FOUC-prevention IIFE calls `localStorage.getItem("theme")` directly. In Safari private mode and in some embedded webviews (older WKWebView, certain RN browsers) `localStorage` access throws `SecurityError` synchronously. The uncaught throw would prevent the theme class from being applied and leave the page in the default state, which is acceptable — but it also surfaces an error in the console on every page load.

**Fix:** Wrap the read:
```js
var stored = null;
try { stored = localStorage.getItem("theme"); } catch (e) {}
```

### IN-05: `new URL(path, Astro.site)` called without optional chaining

**File:** `src/components/Head.astro:22, 24, 36`
**Issue:** Line 35 safely uses `Astro.site?.toString()`, but `canonicalUrl`, `ogImageAbsolute`, and the `image:` value in `jsonLd` pass `Astro.site` directly to `new URL(...)`. `URL` throws `TypeError` if the base is `undefined`. Today `astro.config.mjs` sets `site: "https://dragosmacsim.com"`, so it is always defined, and Astro's types narrow `Astro.site` to `URL | undefined`. Inconsistent handling between these three lines and line 35 suggests an oversight.

**Fix:** Either assert `Astro.site` non-null at the top of the frontmatter with a clear error, or use optional chaining consistently:
```ts
if (!Astro.site) throw new Error("Astro.site must be configured in astro.config.mjs");
```

### IN-06: `HeroSection` uses `client:load` — consider deferring hydration

**File:** `src/pages/index.astro:16`
**Issue:** `<HeroSection client:load />` triggers React hydration as soon as the bundle is parsed. For an above-the-fold hero this is defensible, but `client:idle` (wait for `requestIdleCallback`) or `client:visible` would better honour the project's "zero-JS by default" discipline stated in CLAUDE.md, especially if the hero's only interactivity is entrance animation. Note: this is index.astro (in Phase 7 review scope) but the Hero island itself was added in an earlier phase.

**Fix:** If the hero only needs to animate on load, `client:idle` still hydrates quickly on fast devices and defers on slow ones:
```astro
<HeroSection client:idle />
```
If the animation must run immediately on first paint, keep `client:load` and document the tradeoff.

---

_Reviewed: 2026-04-11_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
