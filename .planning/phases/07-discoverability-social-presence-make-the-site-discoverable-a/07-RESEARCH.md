# Phase 7: Discoverability & Social Presence — Research

**Researched:** 2026-04-11
**Domain:** SEO + analytics + dynamic OG image generation on Astro 6 static → Cloudflare Pages
**Confidence:** HIGH

## Goal

Make the site discoverable (Google can crawl and enrich listings), shareable (every page produces a branded social card), and measurable (cookieless analytics). Add a /now page so visitors know what Dragos is focused on *right now*. Every change must keep the site **static** (no runtime / no Workers) so the existing Cloudflare Pages deployment from Phase 5 continues to work unchanged.

**Primary recommendation:** Use the official `@astrojs/sitemap` integration, a static `public/robots.txt`, extend the existing `Head.astro` for richer per-page SEO and Person JSON-LD, add the Cloudflare beacon as a PROD-only `<script>` in `BaseLayout.astro`, create a simple `/now` page using an Astro content collection (markdown-friendly) **or** a plain `.astro` file (the scope is tiny — recommend plain `.astro`), and generate OG images at build time via `satori` + `satori-html` + `@resvg/resvg-js` in a `.png.ts` endpoint. Fonts for Satori come from `@fontsource/inter` (ships `.woff`, which Satori supports — the existing `@fontsource-variable/inter` ships `.woff2` which Satori does NOT support).

---

## Current State

### Tech Stack (actual, verified against package.json)
| Thing | Actual version | Notes |
|---|---|---|
| Astro | **6.1.5** `[VERIFIED: package.json line 22]` | Newer than CLAUDE.md claims (5.17). Phase 7 must target Astro 6 APIs. |
| React | 19.2.5 | Used for HeroSection island only |
| Tailwind CSS | 4.2.2 (via `@tailwindcss/vite`) | CSS-first config in `src/styles/global.css` |
| Motion | 12.38.0 | Hero island |
| Node | pinned to 22.12.0+ (`engines` in package.json, `.node-version` file per Phase 5) | Cloudflare Pages build image respects this |
| Playwright | 1.59.1 | No `playwright.config.*` file — uses defaults against `http://localhost:4321` |
| Vitest | 4.1.4 | Config at `vitest.config.ts`, include `tests/**/*.test.ts` |

### Files That Matter for This Phase
| File | Purpose | Lines |
|---|---|---|
| `/astro.config.mjs` | Currently only has `site: "https://dragosmacsim.com"`, `react()` integration, tailwind vite plugin | 11 lines total |
| `/src/layouts/BaseLayout.astro` | Owns `<html>`, `<head>` (delegates to `Head.astro`), full `<nav>` inlined (desktop + mobile hamburger), IntersectionObserver script | 148 lines |
| `/src/components/Head.astro` | Already emits: title, meta description, canonical, full OG (title/desc/type/url/image 1200×630), Twitter summary_large_image, JSON-LD Person schema, theme FOUC-prevention inline script | 68 lines |
| `/src/pages/index.astro` | Only page on the site. Passes only `title=` to BaseLayout (no description prop → uses default) | 16 lines |
| `/src/data/contact.ts` | Contact links (email `dragosmacsim@protonmail.com`, LinkedIn `in/dragosmacsim/`, GitHub `d-macsim`). Reuse for JSON-LD `sameAs`. | — |
| `/public/_headers` | CF Pages security headers. No CSP — CF beacon will load without CSP issues. | 7 lines |
| `/public/og-image.png` | Existing 1200×630 OG image from commit 5f654d0. Will remain as fallback. | — |
| `/public/favicon.svg` | DM initials favicon | — |
| `/public/robots.txt` | **Does not exist yet.** | — |
| `/src/pages/now.astro` | **Does not exist yet.** | — |
| `/tests/seo-metadata.test.ts` | Existing vitest checks on Head.astro content (regex on file contents — static analysis, no DOM). Will extend, not replace. | 130 lines |
| `/tests/visual-check.spec.ts` | Existing Playwright E2E. Pattern: `test()` against `http://localhost:4321`. | 127 lines |

### What's Already Done (do NOT re-do in Phase 7)
- OG meta tags (og:title/desc/type/url/image + width/height) — present in Head.astro.
- Twitter card meta tags — present.
- JSON-LD `Person` schema (basic: name, jobTitle, url, sameAs) — present in Head.astro lines 17–27.
- Canonical URL computed from `Astro.site` + `Astro.url.pathname` — present.
- `site:` set in astro.config.mjs — present.
- Default meta description mentioning "AI specialist who builds products" — present.
- Static OG fallback image at `/public/og-image.png`.

### What's Missing (Phase 7 addresses)
1. `sitemap-index.xml` + `sitemap-0.xml` (no `@astrojs/sitemap` installed).
2. `robots.txt` (file does not exist — crawlers currently get 404).
3. JSON-LD is thin (no `image`, no `knowsAbout`, no `alumniOf`, no `description`).
4. No Cloudflare Web Analytics beacon.
5. No `/now` page.
6. No nav link to `/now`.
7. No per-page OG image generation (only the single static `og-image.png`).
8. Every page currently gets the same title/description because `index.astro` doesn't pass `description=` — this is a per-page meta propagation gap.

---

## Approach per Scope Item

### (1) SEO Fundamentals

#### 1a. `@astrojs/sitemap`

**Package:** `@astrojs/sitemap@3.7.2` `[VERIFIED: npm view 2026-03-26 publish]`. Version 3.7.1+ explicitly added "Update to Astro 6 beta" support per the [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/CHANGELOG.md). `[CITED]`

**Install:** `npm i -D @astrojs/sitemap@^3.7.2`

**astro.config.mjs pattern:**
```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://dragosmacsim.com",
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Outputs (into `dist/`):**
- `dist/sitemap-index.xml` — index referencing chunked sitemaps
- `dist/sitemap-0.xml` — actual URL list

Astro's build writes both. After Cloudflare Pages deploy these are reachable at `https://dragosmacsim.com/sitemap-index.xml` and `https://dragosmacsim.com/sitemap-0.xml`. `[CITED: docs.astro.build/en/guides/integrations-guide/sitemap/]`

**Footguns (planner must honour):**
- **`site:` is MANDATORY** — the integration silently skips sitemap output if `site` is not set. Already set, so we're safe.
- The sitemap is generated from Astro's **internal route list**, not from crawling. Pages declared in `src/pages/` get sitemap entries automatically.
- **Trailing-slash mismatches** — if `trailingSlash` in astro.config.mjs doesn't match what's actually served by Cloudflare Pages, Google Search Console will report 301 redirects from the sitemap. Current astro.config.mjs does not set `trailingSlash`; default is `'ignore'`, which is fine. Do not change this without a reason.
- **Locale/i18n multi-output** — not applicable (site is single-locale English).
- If a page should be excluded (e.g., a future `/draft`), use the `filter` option: `sitemap({ filter: (page) => !page.includes('/draft/') })`.

#### 1b. `robots.txt`

**Static file at `public/robots.txt`** — simplest, zero new dependencies, matches the rest of the project's public-asset pattern. Do NOT use `astro-robots-txt` — adds a dep for something that can be a 5-line static file, and `@astrojs/sitemap` does not generate robots.txt itself (per [Issue #5219](https://github.com/withastro/astro/issues/5219)). `[CITED]`

**Exact content:**
```
User-agent: *
Allow: /

Sitemap: https://dragosmacsim.com/sitemap-index.xml
```

Note: reference `sitemap-index.xml`, not `sitemap-0.xml` — the index is what crawlers are meant to discover first. `[CITED: @astrojs/sitemap docs]`

**Cloudflare-specific concerns:** none. CF Pages serves `public/*` at the root unchanged. No `_headers` entry needed.

#### 1c. JSON-LD Person schema (extended)

The current `Head.astro` JSON-LD (lines 17–27) already has `@context`, `@type`, `name`, `jobTitle`, `url`, `sameAs`. Extend to include the properties Google's Rich Results actually surfaces for a person's "knowledge panel"–style listing. `[CITED: schema.org/Person, Google's structured data gallery — though Google mainly surfaces Person on employer/organization pages, the extra properties help LLM answer engines and Bing more than Google specifically]`

**Recommended extended shape (pseudocode, not a decision yet — planner + user confirm):**
```js
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dragos Macsim",
  givenName: "Dragos",
  familyName: "Macsim",
  jobTitle: "AI Data Specialist",              // already there
  description: "AI specialist who builds products — data, ML, and shipping.",
  url: Astro.site?.toString(),                 // already there
  image: new URL("/profile.jpg", Astro.site).toString(), // profile photo already exists in public/
  email: "mailto:dragosmacsim@protonmail.com", // pulled from src/data/contact.ts
  sameAs: [
    "https://www.linkedin.com/in/dragosmacsim/",
    "https://github.com/d-macsim",
  ],
  knowsAbout: [
    "Artificial Intelligence", "Machine Learning", "Data Analysis",
    "Product Development", "Python", "TypeScript",
  ],
  // alumniOf and worksFor are optional — only add if the data is already in src/data/cv.ts
};
```

**Injection technique:** keep in `Head.astro`, keep using Astro's existing pattern:
```astro
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```
`set:html` is Astro's escape-hatch that bypasses HTML-escaping so the JSON survives intact. `[VERIFIED: Head.astro line 47 already uses it successfully]`

**Where:** homepage only for now. /now page can have its own lighter `WebPage` schema (optional). Adding Person on every page is acceptable but not necessary.

#### 1d. Per-page meta description/title

Current pattern: `BaseLayout.astro` takes `{ title, description }` props → forwards to `Head.astro`. `index.astro` only passes `title=`. When `/now` is added, it needs to pass a distinct title and description.

**Recommended pattern (already partially in place):**
```astro
---
// src/pages/now.astro
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout
  title="What I'm doing now — Dragos Macsim"
  description="Current focus: where my attention is right now. Updated April 2026."
>
  <!-- content -->
</BaseLayout>
```

No code changes to `Head.astro` or `BaseLayout.astro` are required for per-page meta description. Only the discipline of passing `description=` on every `<BaseLayout>` invocation.

The planner should **also** update `index.astro` to pass an explicit `description=` so future changes to the default don't silently affect the homepage. `[ASSUMED: low-risk consistency improvement]`

---

### (2) Cloudflare Web Analytics Beacon

**Snippet (exact, verbatim from CF docs):** `[CITED: developers.cloudflare.com/web-analytics/ — also confirmed in community.cloudflare.com]`
```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "TOKEN_HERE"}'></script>
```

**Where the token comes from:** `dash.cloudflare.com` → Analytics & Logs → Web Analytics → click the existing site (or add site if not yet set up) → "Snippet" tab shows the same `<script>` with the token filled in. The token is a 32-character hex string. **Action required from user before implementation:** create the Web Analytics site in the CF dashboard and share the token. The planner should treat this as a user-supplied value (environment variable or inline constant). `[ASSUMED: user does not yet have a CF Web Analytics site set up]`

**Placement:** at the end of `<body>`, just before `</body>`, in `BaseLayout.astro`. `defer` means head placement also works, but body-end is the conventional spot and matches how CF's auto-injection (via CF dashboard orange-cloud auto-inject) positions it. Either works.

**Dev-environment guard (important):** do not load the beacon in `astro dev` — it pollutes real analytics with local traffic. Astro exposes `import.meta.env.PROD` at build time. Pattern:
```astro
---
const isProd = import.meta.env.PROD;
---
...
{isProd && (
  <script is:inline defer src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon='{"token": "TOKEN_HERE"}'></script>
)}
```
`is:inline` prevents Astro from trying to process/bundle the script (it's a third-party external).

**GDPR:** Cloudflare Web Analytics is **cookieless** — it uses the Performance API, not cookies, not fingerprinting. This is why it's marketed as "privacy-first". No consent banner is required under GDPR for cookieless analytics **provided** it does not collect personal data beyond what's needed for the legitimate interest of site measurement. CF Web Analytics discards IP at the edge. **However**, the lawful basis is still "legitimate interest" and the privacy policy must mention it. `[CITED: community.cloudflare.com/t/web-analytics-without-cookie-banner-gdpr-conform/, ctrl.blog/entry/review-cloudflare-analytics]`

**CSP:** current `/public/_headers` has no `Content-Security-Policy`. No nonce needed. If a CSP is added later (Phase 8 maybe), it must allow `script-src https://static.cloudflareinsights.com` and `connect-src https://cloudflareinsights.com` (beacon reports to `/cdn-cgi/rum`).

**Ad-blocker caveat:** uBlock Origin and similar block `cloudflareinsights.com`. Accept this as a known fact — numbers will be 20–40% lower than reality. Not worth proxying through a worker.

---

### (3) `/now` Page

**Convention:** per [nownownow.com](https://nownownow.com/about), a /now page answers *"What is this person focused on at this point in their life?"* — bigger than social media status, smaller than a CV. Updated when priorities change, not daily. Typically includes: current work/projects, current reading, current location, sometimes "not doing right now" as context. `[CITED: nownownow.com]`

**Astro structure — recommended:** single `src/pages/now.astro` file.

Rationale:
- The scope is one page of prose + a small list. A content collection + markdown wrapper is overkill.
- A plain `.astro` file automatically inherits `BaseLayout`, design tokens, and @supports animations from Phase 5.
- Updates happen by editing a single file and git-committing — matches how `src/data/cv.ts` and `src/data/projects.ts` work.

**Suggested content sections (not locked — user confirms):**
1. "Right now" — one paragraph: current primary focus (e.g., "Building mytai, exploring LLM eval workflows").
2. "Working on" — a bullet list of 3–5 items.
3. "Learning / reading" — short bullet list.
4. "Location" — e.g., "Based in London".
5. "Last updated" — date string.
6. Small footer link to nownownow.com explaining the convention. `[ASSUMED: content shape — user decides actual content]`

**Semantic markup:** `<h1>What I'm doing now</h1>` (only h1 on this page), then `<h2>` sections. Reuse the same prose wrapper class (`.prose` already defined in `global.css` line 91 — max-width 680px).

**Nav link:** add `<a href="/now">Now</a>` to the desktop nav block in `BaseLayout.astro` (line 27–32 region) AND the mobile menu (line 59–62 region). Because `/now` is a *separate page*, not an anchor, the IntersectionObserver active-highlight logic should skip it. The existing observer only observes `section[id]` (line 110), so a full-page route will simply not highlight on the index — which is correct behaviour. On `/now` itself, none of the anchor links are active, which is also correct.

**One wrinkle:** existing nav links use `href="#about"` style and have a click handler that calls `scrollIntoView` with `e.preventDefault()` (BaseLayout.astro lines 98–107). The `/now` link starts with `/`, not `#`, so the handler must be guarded to only intercept hash-links:
```js
allNavLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return; // let real pages navigate normally
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});
```
This is a one-line guard and must be in the plan.

---

### (4) Per-Page OG Image Generation

**Recommended stack:** `satori` + `satori-html` + `@resvg/resvg-js`. Reasons:
- `satori` (`0.26.0`) is the Vercel-maintained HTML/CSS → SVG renderer that powers `@vercel/og`. Works great in Node build-time. `[VERIFIED: npm view]`
- `satori-html` (`0.3.2`) converts HTML tagged templates to the JSX-like object Satori expects — **avoids needing a JSX/TSX pragma in a plain `.ts` endpoint**. Astro does not support TSX endpoints; the html-template approach is the ergonomic workaround. `[CITED: multiple Astro+Satori blog posts]`
- `@resvg/resvg-js` (`2.6.2`) converts the SVG to PNG. Node-native with prebuilt binaries for Linux/macOS/Windows. Works inside Cloudflare Pages' **build** environment (not the Worker runtime) because we're running Astro's static build, not deploying to Workers.
- **All compatible with Node 22** — project already pins Node 22, so prebuilt binary availability is fine.

**Rejected alternatives:**
- `@vercel/og` — couples to `@vercel/og`'s Next.js-aware edge runtime. For a static Astro build we'd be using satori anyway but wrapped in a different API. Not worth the coupling.
- `astro-og-canvas` (`0.7.x`) — uses `canvaskit-wasm`, README officially targets Astro 2.x/3.x, no mention of Astro 6 compatibility, larger wasm binary at build time, less flexible layout (configuration object rather than HTML/CSS). `[CITED: github.com/delucis/astro-og-canvas README]` — **do not use.**
- `sharp` (for SVG→PNG) — another option, but sharp has historically flaky prebuilt binaries on Cloudflare's build image, and resvg-js is 4× smaller on disk. Prefer resvg-js.
- Dynamic endpoint (no prerender) — Cloudflare Pages is static. Every OG image must be generated at **build time** via `getStaticPaths`, not runtime.

**Satori font constraint — CRITICAL:**
Satori accepts **TTF, OTF, WOFF** — NOT WOFF2. `[CITED: github.com/vercel/satori discussions #157]`
- `@fontsource-variable/inter` (already installed) ships only `.woff2`. Cannot be used with Satori.
- **Solution:** add `@fontsource/inter@5.2.8` (separate package, non-variable) as a dev dep. It ships `.woff` files under `node_modules/@fontsource/inter/files/inter-latin-400-normal.woff` and `...-700-normal.woff`. `[VERIFIED: `npm pack @fontsource/inter --dry-run` on 2026-04-11 — latin-{100..900}-normal.woff present]`
- Read these at build time with `fs.readFile(require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff'))`.
- Design: site headings are 700, body is 400. Load both weights into Satori.

**File structure:**
```
src/
├── lib/
│   └── og-image.ts         # NEW — generateOgImage(opts) → Buffer
└── pages/
    └── og/
        └── [slug].png.ts   # NEW — Astro endpoint, getStaticPaths + GET
```

**`src/pages/og/[slug].png.ts` shape:**
```typescript
import type { APIRoute } from "astro";
import { generateOgImage } from "../../lib/og-image";

// Static list — planner keeps this in sync with actual pages.
const pages = [
  { slug: "home",   title: "Dragos Macsim", subtitle: "AI Specialist & Product Builder" },
  { slug: "now",    title: "What I'm doing now", subtitle: "Dragos Macsim" },
] as const;

export function getStaticPaths() {
  return pages.map((p) => ({ params: { slug: p.slug }, props: p }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props as (typeof pages)[number]);
  return new Response(png, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
```

**`src/lib/og-image.ts` shape:**
```typescript
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const inter400 = readFileSync(require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff"));
const inter700 = readFileSync(require.resolve("@fontsource/inter/files/inter-latin-700-normal.woff"));

interface OgOpts { title: string; subtitle: string; }

export async function generateOgImage({ title, subtitle }: OgOpts): Promise<Buffer> {
  const markup = html`
    <div style="display:flex;flex-direction:column;width:100%;height:100%;background:#0a0a0f;color:#e4e4e7;font-family:Inter;padding:80px;justify-content:center;">
      <div style="color:#6366f1;font-size:28px;font-weight:400;margin-bottom:24px;">dragosmacsim.com</div>
      <div style="font-size:84px;font-weight:700;line-height:1.1;margin-bottom:24px;">${title}</div>
      <div style="font-size:36px;font-weight:400;color:#71717a;">${subtitle}</div>
    </div>
  `;
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: inter400, weight: 400, style: "normal" },
      { name: "Inter", data: inter700, weight: 700, style: "normal" },
    ],
  });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}
```

**astro.config.mjs — vite externals (prevent bundling):**
```js
vite: {
  plugins: [tailwindcss()],
  ssr: { external: ["@resvg/resvg-js"] },
  optimizeDeps: { exclude: ["@resvg/resvg-js"] },
},
```
Rationale: `@resvg/resvg-js` has native `.node` binaries that Vite's bundler should not try to process. Marking it external routes it through Node's native require. `[CITED: multiple Astro+Satori build-time examples]`

**Build output:**
- `dist/og/home.png`
- `dist/og/now.png`

**Meta tag wiring in Head.astro:** extend `Head.astro` to accept a new prop `ogImageSlug`:
```astro
---
interface Props {
  title: string;
  description?: string;
  ogImageSlug?: string; // e.g. "home", "now" — resolves to /og/<slug>.png
}
const { title, description, ogImageSlug } = Astro.props;
const ogImage = ogImageSlug
  ? `/og/${ogImageSlug}.png`
  : "/og-image.png"; // fallback to existing static
const ogImageAbsolute = new URL(ogImage, Astro.site).toString();
---
```
Then `BaseLayout.astro` forwards `ogImageSlug` from its own props to `<Head>`, and each page passes it. The existing default `/og-image.png` remains as the safety net if a page forgets to pass one.

**Design constraints (used above):**
- 1200 × 630 (Facebook/LinkedIn/Twitter spec)
- Dark background `#0a0a0f` (matches `--color-base` in global.css line 28)
- Accent text `#6366f1` (matches `--color-accent-primary` in global.css line 33)
- Muted text `#71717a` (matches `--color-text-muted` line 31)
- Inter 700 for title, Inter 400 for subtitle/brand
- Site brand "dragosmacsim.com" as a small label at top
- **No emoji** — Satori emoji requires a separate emoji font, not worth the complexity for this phase.

---

## Key Decisions (locked)

1. **Astro version:** target Astro 6.1.5 (what's actually installed). CLAUDE.md says 5.17 — that's stale, treat 6 as ground truth.
2. **Sitemap:** `@astrojs/sitemap@^3.7.2` via official integration, no custom config beyond defaults.
3. **robots.txt:** static file at `public/robots.txt`, hand-written 5 lines.
4. **JSON-LD:** extend existing Person in `Head.astro`, do not split across pages.
5. **Analytics:** Cloudflare Web Analytics, body-end placement in `BaseLayout.astro`, `import.meta.env.PROD` guard, no consent banner (cookieless).
6. **/now page:** single `src/pages/now.astro` file — no content collection.
7. **OG images:** `satori` + `satori-html` + `@resvg/resvg-js`, build-time via `.png.ts` endpoint with `getStaticPaths`, fonts from `@fontsource/inter` (NOT the `-variable` package).
8. **OG fallback:** keep existing `public/og-image.png` as default for any page that doesn't pass `ogImageSlug`.
9. **Nav:** add "Now" as a real page link (not anchor). Guard the existing scroll-intercept handler to only intercept `href^="#"`.
10. **Node version:** unchanged — stays at 22 per Phase 5 decision. Both Satori and resvg-js support Node 22.

---

## Open Questions for Planner

1. **Cloudflare Web Analytics token** — does the user already have a site registered in `dash.cloudflare.com → Web Analytics`? If not, they must create it before this phase can deploy. The planner should mark this as a user-action prerequisite in plan 07-NN-PLAN.md.
2. **`/now` page content** — actual prose needs to come from the user. Planner should draft placeholder content that the user confirms or edits during /gsd-discuss-phase. `[ASSUMED: user provides current focus, projects, reading list]`
3. **Extended JSON-LD fields** — `knowsAbout`, `alumniOf`, `worksFor` are optional. Should they be populated from `src/data/cv.ts` (DRY) or hand-maintained in `Head.astro`? Planner decides; recommended to hand-maintain for simplicity (the JSON-LD is homepage-only).
4. **OG image list** — for Phase 7 there are only two pages (`/` and `/now`), so two OG images. Future case studies (Phase 8+) will add more — the `.png.ts` `getStaticPaths` array is the single source of truth for what gets generated.

---

## Validation Architecture

> Nyquist validation is enabled (workflow.nyquist_validation absent → default true per gsd-config.json).
> Existing framework: Vitest 4.1.4 for static analysis tests, Playwright 1.59.1 for E2E. No playwright.config file — runs with defaults. No new framework needed.

### Test Framework
| Property | Value |
|---|---|
| Framework | Vitest 4.1.4 + Playwright 1.59.1 |
| Vitest config | `vitest.config.ts` (include: `tests/**/*.test.ts`) |
| Playwright config | none — uses defaults |
| Quick run command | `npm test` |
| E2E command | `npm run test:e2e` (requires `npm run dev` in another terminal OR `astro build && astro preview`) |
| Phase gate | `npm run build && npm test && npm run test:e2e` all green |

### Phase Requirements → Test Map

Phase requirements are not yet assigned IDs in REQUIREMENTS.md (Phase 7 is pending — see line 131 of ROADMAP.md). The planner assigns IDs during /gsd-plan-phase. Proposed IDs used below:

| Req ID (proposed) | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| SEO-03 | `public/robots.txt` exists and references sitemap-index.xml | unit (vitest static file read) | `npx vitest run tests/phase7-seo.test.ts -t "robots.txt"` | ❌ Wave 0 |
| SEO-04 | `astro.config.mjs` imports `@astrojs/sitemap` and includes it in integrations | unit | `npx vitest run tests/phase7-seo.test.ts -t "sitemap integration"` | ❌ Wave 0 |
| SEO-05 | Post-build: `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist and contain the site URL | integration (runs after `astro build`) | `npm run build && npx vitest run tests/phase7-build.test.ts -t "sitemap files"` | ❌ Wave 0 |
| SEO-06 | JSON-LD Person includes `image`, `email`, `description`, `knowsAbout` | unit | `npx vitest run tests/phase7-seo.test.ts -t "extended Person schema"` | ❌ Wave 0 |
| SEO-07 | Per-page title/description — `/now` page passes distinct `title=` and `description=` props | unit (regex check on `src/pages/now.astro`) | `npx vitest run tests/phase7-seo.test.ts -t "now page meta"` | ❌ Wave 0 |
| ANALYTICS-01 | `BaseLayout.astro` contains CF beacon snippet guarded by `import.meta.env.PROD` | unit | `npx vitest run tests/phase7-analytics.test.ts -t "beacon guarded"` | ❌ Wave 0 |
| ANALYTICS-02 | On a built+served site, `beacon.min.js` request fires | e2e (Playwright `waitForRequest`) | `npx playwright test tests/phase7.spec.ts -g "beacon fires"` | ❌ Wave 0 |
| NOW-01 | `/now` route renders with h1 "What I'm doing now" (or confirmed title) | e2e | `npx playwright test tests/phase7.spec.ts -g "now page renders"` | ❌ Wave 0 |
| NOW-02 | Nav (desktop + mobile) contains link with href="/now" | unit | `npx vitest run tests/phase7-nav.test.ts -t "now link present"` | ❌ Wave 0 |
| NOW-03 | Nav click handler does NOT preventDefault on non-hash links | unit (static analysis) | `npx vitest run tests/phase7-nav.test.ts -t "hash-only guard"` | ❌ Wave 0 |
| OG-01 | `src/pages/og/[slug].png.ts` exists and exports `getStaticPaths` + `GET` | unit | `npx vitest run tests/phase7-og.test.ts -t "endpoint shape"` | ❌ Wave 0 |
| OG-02 | Post-build: `dist/og/home.png` exists, >5KB, PNG magic bytes `89 50 4E 47` | integration | `npm run build && npx vitest run tests/phase7-build.test.ts -t "og home png"` | ❌ Wave 0 |
| OG-03 | Post-build: `dist/og/now.png` exists, >5KB, PNG magic bytes | integration | `npm run build && npx vitest run tests/phase7-build.test.ts -t "og now png"` | ❌ Wave 0 |
| OG-04 | `Head.astro` uses `ogImageSlug` prop to compute og:image URL | unit | `npx vitest run tests/phase7-seo.test.ts -t "ogImageSlug prop"` | ❌ Wave 0 |
| OG-05 | E2E: navigating to `/og/home.png` returns `content-type: image/png` and non-empty body | e2e | `npx playwright test tests/phase7.spec.ts -g "og endpoint serves png"` | ❌ Wave 0 |

### Exact assertions (copy-paste for planner)

**Vitest — `tests/phase7-seo.test.ts`:**
```ts
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf-8");

describe("SEO-03 robots.txt", () => {
  it("exists", () => {
    expect(existsSync(join(ROOT, "public/robots.txt"))).toBe(true);
  });
  it("references sitemap-index.xml", () => {
    const robots = read("public/robots.txt");
    expect(robots).toContain("Sitemap: https://dragosmacsim.com/sitemap-index.xml");
    expect(robots).toContain("User-agent: *");
  });
});

describe("SEO-04 sitemap integration", () => {
  const cfg = read("astro.config.mjs");
  it("imports @astrojs/sitemap", () => {
    expect(cfg).toMatch(/from\s+["']@astrojs\/sitemap["']/);
  });
  it("adds sitemap() to integrations array", () => {
    expect(cfg).toMatch(/sitemap\(\)/);
  });
});

describe("SEO-06 extended Person schema", () => {
  const head = read("src/components/Head.astro");
  it("includes image property", () => expect(head).toMatch(/image:\s*[\s\S]*profile/));
  it("includes knowsAbout array", () => expect(head).toContain("knowsAbout"));
  it("includes email", () => expect(head).toContain("email"));
});

describe("SEO-07 /now page meta", () => {
  const now = read("src/pages/now.astro");
  it("passes title prop", () => expect(now).toMatch(/title=["'`]/));
  it("passes description prop", () => expect(now).toMatch(/description=["'`]/));
});
```

**Vitest — `tests/phase7-build.test.ts`** (runs against `dist/` — must be run after `npm run build`):
```ts
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");

const pngMagic = (buf: Buffer) =>
  buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;

describe.skipIf(!existsSync(DIST))("SEO-05 sitemap files in dist", () => {
  it("sitemap-index.xml exists and contains site URL", () => {
    const p = join(DIST, "sitemap-index.xml");
    expect(existsSync(p)).toBe(true);
    expect(readFileSync(p, "utf-8")).toContain("dragosmacsim.com");
  });
  it("sitemap-0.xml exists", () => {
    expect(existsSync(join(DIST, "sitemap-0.xml"))).toBe(true);
  });
});

describe.skipIf(!existsSync(DIST))("OG-02/03 generated PNG files", () => {
  for (const slug of ["home", "now"]) {
    it(`dist/og/${slug}.png exists, is PNG, >5KB`, () => {
      const p = join(DIST, "og", `${slug}.png`);
      expect(existsSync(p)).toBe(true);
      const buf = readFileSync(p);
      expect(pngMagic(buf)).toBe(true);
      expect(statSync(p).size).toBeGreaterThan(5_000);
    });
  }
});
```

**Vitest — `tests/phase7-analytics.test.ts`:**
```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const layout = readFileSync(
  join(import.meta.dirname, "..", "src/layouts/BaseLayout.astro"),
  "utf-8"
);

describe("ANALYTICS-01 CF beacon", () => {
  it("references beacon.min.js", () => {
    expect(layout).toContain("static.cloudflareinsights.com/beacon.min.js");
  });
  it("has data-cf-beacon attr with token", () => {
    expect(layout).toMatch(/data-cf-beacon=['"]\{[^}]*token[^}]*\}['"]/);
  });
  it("is guarded by import.meta.env.PROD", () => {
    expect(layout).toContain("import.meta.env.PROD");
  });
});
```

**Vitest — `tests/phase7-nav.test.ts`:**
```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const layout = readFileSync(
  join(import.meta.dirname, "..", "src/layouts/BaseLayout.astro"),
  "utf-8"
);

describe("NOW-02 /now link in nav", () => {
  it("appears in desktop nav", () => {
    // desktop nav block uses hidden md:flex
    expect(layout).toMatch(/href=["']\/now["']/);
  });
  it("appears in mobile nav (at least twice in file)", () => {
    const count = (layout.match(/href=["']\/now["']/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

describe("NOW-03 hash-only scroll guard", () => {
  it("scroll handler checks href startsWith #", () => {
    expect(layout).toMatch(/href\?.*startsWith\(['"]#['"]\)/);
  });
});
```

**Vitest — `tests/phase7-og.test.ts`:**
```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const endpoint = readFileSync(
  join(import.meta.dirname, "..", "src/pages/og/[slug].png.ts"),
  "utf-8"
);

describe("OG-01 endpoint shape", () => {
  it("exports getStaticPaths", () => expect(endpoint).toMatch(/export\s+function\s+getStaticPaths/));
  it("exports GET", () => expect(endpoint).toMatch(/export\s+const\s+GET/));
  it("references satori helper", () => expect(endpoint).toContain("generateOgImage"));
});

describe("OG-04 Head.astro ogImageSlug wiring", () => {
  const head = readFileSync(
    join(import.meta.dirname, "..", "src/components/Head.astro"),
    "utf-8"
  );
  it("accepts ogImageSlug prop", () => expect(head).toContain("ogImageSlug"));
  it("builds /og/<slug>.png URL", () => expect(head).toMatch(/\/og\/\$\{ogImageSlug\}\.png/));
});
```

**Playwright — `tests/phase7.spec.ts`** (requires site running via `astro dev` or `astro preview`):
```ts
import { test, expect } from "@playwright/test";
const BASE = "http://localhost:4321";

test.describe("Phase 7 — Discoverability", () => {
  test("NOW-01 /now page renders", async ({ page }) => {
    await page.goto(`${BASE}/now`);
    await expect(page.locator("h1")).toContainText(/now/i);
  });

  test("ANALYTICS-02 CF beacon fires in prod build", async ({ page }) => {
    // Note: this test only passes against `astro preview` (PROD build), not `astro dev`.
    // In dev, the beacon is intentionally absent.
    const beaconRequest = page.waitForRequest(
      (r) => r.url().includes("cloudflareinsights.com/beacon.min.js"),
      { timeout: 5000 }
    );
    await page.goto(BASE);
    // Wrap in try: in dev mode this will throw — that's expected
    try {
      await beaconRequest;
      expect(true).toBe(true);
    } catch {
      // acceptable in dev
      expect(process.env.NODE_ENV).not.toBe("production");
    }
  });

  test("OG-05 /og/home.png endpoint serves PNG", async ({ request }) => {
    const res = await request.get(`${BASE}/og/home.png`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    const body = await res.body();
    expect(body.length).toBeGreaterThan(5_000);
  });
});
```

### Sampling Rate
- **Per task commit:** `npm test` (vitest — fast static analysis, ~2s)
- **Per wave merge:** `npm run build && npm test && npm run test:e2e`
- **Phase gate:** Full build + vitest + Playwright against `astro preview` all green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/phase7-seo.test.ts` — robots.txt, sitemap integration, Person schema, /now meta
- [ ] `tests/phase7-build.test.ts` — dist/ artifact tests (sitemap files + OG PNGs)
- [ ] `tests/phase7-analytics.test.ts` — CF beacon static analysis
- [ ] `tests/phase7-nav.test.ts` — /now nav link + hash-only guard
- [ ] `tests/phase7-og.test.ts` — endpoint shape + Head.astro wiring
- [ ] `tests/phase7.spec.ts` — Playwright E2E (3 tests: /now, beacon, /og/home.png)

---

## File Manifest

### Files to Create (absolute paths)
| Path | Purpose |
|---|---|
| `/public/robots.txt` | Static robots file |
| `/src/pages/now.astro` | /now page route |
| `/src/pages/og/[slug].png.ts` | Astro endpoint — PNG OG images at build time |
| `/src/lib/og-image.ts` | Satori + resvg-js helper (`generateOgImage(opts)`) |
| `/tests/phase7-seo.test.ts` | Vitest — robots.txt, sitemap config, Person schema, /now meta |
| `/tests/phase7-build.test.ts` | Vitest — post-build artifact verification |
| `/tests/phase7-analytics.test.ts` | Vitest — CF beacon static analysis |
| `/tests/phase7-nav.test.ts` | Vitest — /now nav link + hash-only guard |
| `/tests/phase7-og.test.ts` | Vitest — endpoint + Head.astro wiring |
| `/tests/phase7.spec.ts` | Playwright E2E — /now, beacon, /og endpoint |

### Files to Modify (absolute paths)
| Path | Change |
|---|---|
| `/astro.config.mjs` | Add `import sitemap from "@astrojs/sitemap"`; add `sitemap()` to integrations; add `vite.ssr.external: ["@resvg/resvg-js"]` and `vite.optimizeDeps.exclude: ["@resvg/resvg-js"]` |
| `/src/components/Head.astro` | Extend Person JSON-LD (image, email, description, knowsAbout); add `ogImageSlug?: string` prop and compute og:image from it with fallback to `/og-image.png` |
| `/src/layouts/BaseLayout.astro` | Add "Now" link to desktop nav (line ~27–32) and mobile nav (line ~59–62); add PROD-only CF beacon `<script>` before `</body>` (after the existing `<script>` block around line 70 or just before `</body>`); add `href.startsWith('#')` guard to scroll-intercept handler (line ~98–107); forward new `ogImageSlug` prop to `<Head>`; add `ogImageSlug?: string` to its `Props` interface |
| `/src/pages/index.astro` | Pass explicit `description=` and `ogImageSlug="home"` to `<BaseLayout>` |
| `/package.json` | Add 3 runtime deps + 2 dev deps (see below) |

### Files to NOT Touch
- `/src/styles/global.css` — no new styles needed for Phase 7. /now page reuses existing tokens and `.prose` class.
- `/public/_headers` — no CSP changes.
- `/public/og-image.png` — kept as fallback.
- `/src/components/HeroSection.tsx` and all existing sections — out of scope.
- `.node-version` — stays at 22.

---

## Dependencies to Install

**Runtime (dependencies):**
```bash
npm i satori@^0.26.0 satori-html@^0.3.2 @resvg/resvg-js@^2.6.2 @fontsource/inter@^5.2.8
```

**Build-time (devDependencies):**
```bash
npm i -D @astrojs/sitemap@^3.7.2
```

### Verified versions (2026-04-11, `npm view`)
| Package | Version | Notes |
|---|---|---|
| `@astrojs/sitemap` | 3.7.2 | Published 2026-03-26. Astro 6 supported since 3.7.1. |
| `satori` | 0.26.0 | Node engines: `>=16` |
| `satori-html` | 0.3.2 | Tiny, HTML→JSX-object converter |
| `@resvg/resvg-js` | 2.6.2 | Node engines: `>=10`. Prebuilt binaries for Linux/macOS/Windows Node 22. |
| `@fontsource/inter` | 5.2.8 | Ships `.woff` files (Satori-compatible), 4.3 MB unpacked. |
| `@astrojs/sitemap` bundled deps | sitemap@^9, stream-replace-string@^2, zod@^4.3.6 | |

### Peer-dep sanity
- `@astrojs/sitemap@3.7.2` declares no peer deps on `astro` in its `package.json`, but the changelog explicitly states it was updated for Astro 6 in 3.7.1. No npm resolution conflict. `[VERIFIED: npm view + CHANGELOG]`
- `satori`, `satori-html`, `@resvg/resvg-js` have no peer on Astro — standalone libs.
- `@fontsource/inter` has no peer deps.

---

## Footguns & Non-Goals

### Footguns

1. **Satori + `.woff2` silently fails.** The existing `@fontsource-variable/inter` ships only `.woff2`. If the planner mistakenly uses those files, Satori throws `Unknown font format`. Use `@fontsource/inter` (non-variable) — confirmed to ship `.woff`. `[CITED: vercel/satori discussion #157]`
2. **Astro does not support TSX endpoints.** `.png.tsx` will not work. Must be `.png.ts` using `satori-html`'s `html` tagged template, or use a React JSX pragma in a `.tsx` that exports the raw JSX object. Recommend `html` tag approach. `[CITED: multiple Astro+Satori guides]`
3. **`@resvg/resvg-js` must be externalized from Vite bundling.** Without `ssr.external` + `optimizeDeps.exclude`, Astro's build will fail trying to bundle a `.node` native binary. `[CITED: arne.me, dietcode.io, viveklokhande.com]`
4. **`site:` in astro.config.mjs is required for sitemap.** Already set (`https://dragosmacsim.com`) so we're safe, but if it were removed the sitemap silently skips generation.
5. **Trailing-slash mismatch.** Default `trailingSlash: 'ignore'` is fine. Do NOT change it. Mismatches between sitemap and actual served URLs trigger Google Search Console warnings.
6. **Nav click handler hash guard.** The current handler in `BaseLayout.astro` lines 98–107 unconditionally `preventDefault()`s on every `[data-nav-link]`. Without a guard, clicking the `/now` link will do nothing because the handler intercepts it and there's no `#now` element to scroll to. **Must** add `if (!href?.startsWith('#')) return;`.
7. **CF beacon in dev.** Without `import.meta.env.PROD` guard, local `astro dev` sessions pollute real analytics. Always guard.
8. **Ad-blockers block CF beacon.** uBlock Origin blocks `cloudflareinsights.com`. Accept this — numbers will be 20–40% lower than reality. Do not proxy through a Worker.
9. **Playwright beacon test in dev mode.** The `ANALYTICS-02` E2E test cannot reliably assert beacon fires in `astro dev` because the beacon is intentionally absent. Test wraps in try/catch and treats dev-mode absence as expected. For hard assertion, run against `astro preview` (production build).
10. **Satori emoji support.** Satori needs a dedicated emoji font for emoji glyphs. Our OG image design uses no emoji — do not introduce any.
11. **Google Rich Results for Person schema.** Google's Rich Results tool does NOT actually surface JSON-LD Person schema in SERP "rich snippets" — it mainly matters for Knowledge Graph candidate data and LLM answer engines (Perplexity, etc). Do not expect a visible "person card" in Google search. It's still worth doing.
12. **`dist/` vitest tests depend on prior `astro build`.** The `phase7-build.test.ts` uses `describe.skipIf(!existsSync(DIST))` so it skips cleanly when run standalone via `npm test`. Phase gate command is `npm run build && npm test && npm run test:e2e` to ensure the dist-dependent tests actually run.
13. **Cloudflare Pages build image.** CF's default build image is Debian-based with Node via environment variable. `.node-version` file is already set to 22 (Phase 5). resvg-js and sharp prebuilt binaries for `linux-x64-gnu` are present — build will work.

### Non-Goals (explicitly out of scope for Phase 7)

- **Dynamic/runtime OG generation** — everything is build-time. Adding new OG images means editing the `getStaticPaths` list and rebuilding.
- **Sitemap priority/changefreq customization** — default sitemap entries are fine for a 2-page site.
- **Multi-locale sitemap** — single English site.
- **Google Analytics / Plausible / Fathom** — CF Web Analytics only.
- **Cookie banner / GDPR consent UI** — not needed for cookieless CF analytics.
- **Lighthouse CI / axe-core / a11y audit** — belongs to Phase 8 (already scoped there).
- **404 page** — Phase 8.
- **View transitions** — Phase 8.
- **Updating CLAUDE.md version numbers** — out of scope for a research doc; flag for user.
- **Adding new routes beyond /now** — case studies are Phase 8+.
- **Rewriting the existing static `og-image.png`** — kept as fallback. Optionally regenerate with Satori to get a matching design, but not required.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | User does NOT yet have a Cloudflare Web Analytics site/token set up | (2) CF Analytics | Low — planner creates a prerequisite step; user either provides token or creates it before deploy. |
| A2 | `/now` page content is user-supplied | (3) /now Page | Low — placeholder content is safe to commit and replaced before public launch. |
| A3 | JSON-LD extended fields (`knowsAbout` etc) are hand-maintained in Head.astro, not sourced from `src/data/cv.ts` | (1c) JSON-LD | Low — can be refactored later. |
| A4 | Updating `index.astro` to pass explicit `description=` is a low-risk consistency improvement | (1d) Per-page meta | None — changing the default is an observable improvement. |
| A5 | CF Pages' default build image has `linux-x64-gnu` prebuilt binaries for `@resvg/resvg-js@2.6.2` | (4) OG images | Medium — if wrong, build fails on CF. Mitigation: test a build locally first; fallback to `sharp`. Node 22 prebuilt binaries for resvg-js 2.6.x have been shipping since 2023 per npm tarball inspection, so this is likely fine. |
| A6 | Phase 7 plan will assign new requirement IDs (SEO-03..07, ANALYTICS-01..02, NOW-01..03, OG-01..05) | Validation Architecture | None — IDs are suggestions; planner finalizes. |

---

## Sources

### Primary (HIGH confidence — verified via tool or official docs)
- **`package.json` line 22** — confirms Astro 6.1.5 (not 5.17) `[VERIFIED]`
- **`astro.config.mjs`** — confirms `site: "https://dragosmacsim.com"` already set `[VERIFIED]`
- **`src/components/Head.astro`** — confirms existing OG/JSON-LD/canonical implementation `[VERIFIED]`
- **`src/layouts/BaseLayout.astro`** — confirms nav structure + scroll handler location `[VERIFIED]`
- **npm registry** — `@astrojs/sitemap@3.7.2`, `satori@0.26.0`, `satori-html@0.3.2`, `@resvg/resvg-js@2.6.2`, `@fontsource/inter@5.2.8` versions `[VERIFIED via npm view]`
- **`npm pack @fontsource/inter --dry-run`** — confirms `.woff` files (not just `.woff2`) ship in the package `[VERIFIED 2026-04-11]`
- [@astrojs/sitemap CHANGELOG — Astro 6 support added in 3.7.1](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/CHANGELOG.md) `[CITED]`
- [Astro @astrojs/sitemap integration docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) `[CITED]`
- [nownownow.com/about — /now page convention](https://nownownow.com/about) `[CITED]`
- [Satori woff2 not supported — github.com/vercel/satori/discussions/157](https://github.com/vercel/satori/discussions/157) `[CITED]`

### Secondary (MEDIUM confidence — corroborated across multiple blog sources)
- Cloudflare beacon exact snippet — confirmed via community.cloudflare.com + multiple third-party writeups (`kai.bi`, `barrd.dev`)
- CF Web Analytics GDPR cookieless status — `community.cloudflare.com/t/web-analytics-without-cookie-banner-gdpr-conform/`, `ctrl.blog/entry/review-cloudflare-analytics`
- Satori + Astro build-time pattern — `arne.me/blog/static-og-images-in-astro`, `dietcode.io/p/astro-og`, `blog.okaryo.studio/en/20250118-astro-satori-ogp-image/`, `mahadk.com/posts/astro-og-with-satori`
- Astro .png.ts endpoint pattern + satori-html — consistent across 6+ tutorials listed above
- `vite.ssr.external: ['@resvg/resvg-js']` workaround — same pattern cited across all build-time Astro+Satori guides

### Tertiary (LOW confidence — flag for validation)
- `knowsAbout` in Person JSON-LD — schema.org defines it, but Google's specific surface behavior varies. Rich-results value is minimal; LLM-answer-engine value is meaningful.
- CF Web Analytics visitor loss to ad-blockers (20–40%) — anecdotal from [shedloadofcode.com](https://www.shedloadofcode.com/blog/hide-your-own-site-visits-from-cloudflare-analytics-with-javascript/)

---

## Metadata

**Confidence breakdown:**
- Standard stack (sitemap, robots, Satori toolchain): **HIGH** — versions verified on npm, pattern confirmed across many Astro blog sources, Astro 6 compat explicitly confirmed in changelog.
- Architecture (static build, .png.ts endpoint, getStaticPaths): **HIGH** — matches multiple independent reference implementations.
- Cloudflare Web Analytics beacon + GDPR: **HIGH** — snippet format confirmed, cookieless status confirmed.
- JSON-LD Person extended fields: **MEDIUM** — schema.org docs are authoritative but Google's surfacing is opaque.
- Font loading path (`@fontsource/inter/files/...woff`): **HIGH** — verified by unpacking the actual tarball.
- `/now` page structure: **MEDIUM** — convention is clear; content is user-supplied.
- Playwright beacon assertion: **MEDIUM** — cross-mode (dev vs preview) behavior requires careful test scoping.

**Research date:** 2026-04-11
**Valid until:** 2026-05-11 (30 days — Astro 6 is stable, Satori/resvg ecosystem changes infrequently)

## RESEARCH COMPLETE
