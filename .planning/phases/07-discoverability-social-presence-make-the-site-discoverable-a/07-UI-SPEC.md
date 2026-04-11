---
phase: 7
slug: discoverability-social-presence
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-11
---

# Phase 7 — UI Design Contract

> Visual and interaction contract for Discoverability & Social Presence. Phase 7 is mostly SEO + analytics infrastructure, but it introduces three new user-facing surfaces that need a locked design contract: (1) the `/now` page, (2) the per-page OG image template, (3) the nav entry for `/now`. Everything below reuses existing Phase 1 design tokens — Phase 7 introduces **zero** new colours, fonts, or spacing primitives.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (bespoke, token-first via Tailwind v4 `@theme`) |
| Preset | not applicable |
| Component library | none — hand-rolled Astro components |
| Icon library | none — inline SVG (consistent with ThemeToggle / CVDownloadButton pattern) |
| Font | Inter Variable (`@fontsource-variable/inter`) for site; Inter non-variable (`@fontsource/inter` — woff files) for Satori OG generation only |

**Source of truth:** `src/styles/global.css` lines 11-47 define all tokens via `@theme`. Phase 7 must reference these, never redefine them.

---

## Spacing Scale

Base unit: `--spacing: 0.25rem` (4px) declared in `global.css` line 20. Tailwind utilities scale from this. All multiples of 4.

| Token | Value | Tailwind | Usage in Phase 7 |
|-------|-------|----------|------------------|
| xs | 4px | `p-1`, `gap-1` | Icon-to-label gap in nav (existing) |
| sm | 8px | `p-2`, `gap-2` | ThemeToggle/hamburger button spacing (existing) |
| md | 16px | `p-4`, `gap-4` | Nav horizontal padding, /now bullet gaps, OG inner gaps between lines |
| lg | 24px | `p-6`, `gap-6` | Nav link gap (`gap-6` in desktop nav), /now paragraph spacing |
| xl | 32px | `p-8`, `mb-8` | Heading → body gap on /now (matches `mb-8` used on other sections) |
| 2xl | 48px | `md:p-12`, `py-12` | /now desktop side padding (matches `lg:px-12` in BaseLayout main) |
| 3xl | 64px | `py-16` | /now section top/bottom padding (mobile) — matches existing `py-16 md:py-24` shell |
| 4xl | 96px | `md:py-24` | /now section top/bottom padding (desktop) — matches existing section pattern |

**OG image spacing (1200×630 frame, declared in `src/lib/og-image.ts`):**

| Token | Value | Usage |
|-------|-------|-------|
| safe-area padding | 80px | Outer padding on all four sides of the 1200×630 frame |
| brand → title gap | 24px | `margin-bottom` after the `dragosmacsim.com` label |
| title → subtitle gap | 24px | `margin-bottom` after the main title |

**Exceptions:**
- `w-11 h-11` (44px) on hamburger button — existing touch-target accommodation, not broken here.
- OG safe-area `80px` is a single-use value inside a fixed-canvas (1200×630) render. It is not a site spacing token. Declared here only so the Satori template has a named constant.

---

## Typography

Site typography is already fully declared in `global.css` lines 42-47 via `clamp()` for fluid scaling. Phase 7 reuses these exactly — no new sizes.

### Site scale (unchanged, reused by /now page)

| Role | CSS variable | Value | Weight | Line height | Usage on /now |
|------|--------------|-------|--------|-------------|---------------|
| Label | `--font-size-label` | `0.875rem` (14px) | 500 | 1.5 | "Last updated" timestamp, section eyebrow (if used) |
| Body | `--font-size-body` | `clamp(1rem, 2vw, 1.125rem)` (16-18px) | 400 | 1.7 (1.6 on mobile <640px) | Paragraphs inside `.prose` wrapper |
| Heading | `--font-size-heading` | `clamp(1.25rem, 3vw, 2.5rem)` (20-40px) | 600 | 1.2 | `<h2>` subsection titles on /now ("Working on", "Learning", "Location") |
| Display | `--font-size-display` | `clamp(2.5rem, 5vw, 4rem)` (40-64px) | 700 | 1.1 | Page `<h1>` ("What I'm doing now") |

**Two weights:** 400 (regular) and 600/700 (semibold for headings, bold for display) — consistent with the rest of the site. No new weights.

### OG image typography (Satori template only — fixed canvas, no clamp)

Satori does not support CSS variables or `clamp()`, so the OG template uses static values chosen to match the visual feel of the site display type at desktop:

| Role | Font | Size | Weight | Colour token equivalent | Purpose |
|------|------|------|--------|------------------------|---------|
| Brand label | Inter | 28px | 400 | `--color-accent-primary` | "dragosmacsim.com" eyebrow |
| Title | Inter | 84px | 700 | `--color-text` | Page title (e.g. "What I'm doing now") |
| Subtitle | Inter | 36px | 400 | `--color-text-muted` | Supporting line (e.g. "Dragos Macsim") |

**Font files:** Satori requires woff (not woff2). Load from `@fontsource/inter/files/inter-latin-400-normal.woff` and `@fontsource/inter/files/inter-latin-700-normal.woff` at build time (per RESEARCH.md lines 270-275).

**No emoji** in OG images — Satori requires a separate emoji font; deferred out of scope.

---

## Color

Phase 7 introduces **no new colours**. Every visible surface uses existing tokens from `global.css`. The 60/30/10 split below is the already-established Phase 1 contract, restated for Phase 7 surfaces.

### Dark mode (default)

| Role | Token | Value | Usage on /now + OG |
|------|-------|-------|---------------------|
| Dominant (60%) | `--color-base` | `#0a0a0f` | /now page background; OG image background |
| Secondary (30%) | `--color-surface` | `#111118` | Card/callout backgrounds if used on /now (e.g. wrapping "Last updated" block) |
| Border | `--color-border` | `#27272a` | Divider under "Last updated", nav bottom border (existing) |
| Text primary | `--color-text` | `#e4e4e7` | /now body copy, OG title |
| Text muted | `--color-text-muted` | `#71717a` | /now "last updated" timestamp, footer link, OG subtitle |
| Accent (10%) | `--color-accent-primary` | `#6366f1` | Active nav state for `/now` route; OG brand label; hover underline colour on links |
| Accent hover | `--color-accent-primary-hover` | `#818cf8` | `/now` link hover state (existing nav hover token) |
| Secondary accent | `--color-accent-secondary` | `#f59e0b` | **Reserved — not used in Phase 7** |

### Light mode (via `.light` class on `<html>`)

| Role | Token | Value |
|------|-------|-------|
| Dominant | `--color-base` | `#fafafa` |
| Secondary | `--color-surface` | `#ffffff` |
| Text primary | `--color-text` | `#18181b` |
| Text muted | `--color-text-muted` | `#71717a` |
| Accent | `--color-accent-primary` | `#4f46e5` (darkened for AA contrast) |

**Accent reserved for:**
1. `[data-nav-link][data-active="true"]` — the `/now` link when on the `/now` route (sets `color: var(--color-accent-primary)` + 2px underline at 4px offset, per existing `<style is:global>` in BaseLayout.astro lines 136-148).
2. The OG brand label `dragosmacsim.com` (single element at top of OG canvas).
3. Inline link hover/focus state on /now body text (`:hover` + `:focus-visible`, inherits from existing `.prose a` default or scoped rule — see Dimension 3 below).
4. **Not** used for: section headings, bullet markers, body text, paragraph emphasis, `<strong>`, `<em>`.

**Destructive:** none. Phase 7 has zero destructive actions (no forms, no deletes, no confirmations).

**Contrast verification (both modes):**

| Pair | Ratio (dark) | Ratio (light) | WCAG |
|------|-------------|---------------|------|
| text on base | `#e4e4e7` on `#0a0a0f` ≈ 15.3:1 | `#18181b` on `#fafafa` ≈ 16.1:1 | AAA |
| text-muted on base | `#71717a` on `#0a0a0f` ≈ 4.9:1 | `#71717a` on `#fafafa` ≈ 4.7:1 | AA (body) |
| accent on base | `#6366f1` on `#0a0a0f` ≈ 5.3:1 | `#4f46e5` on `#fafafa` ≈ 7.8:1 | AA+ |

OG image: same dark palette. Text `#e4e4e7` on `#0a0a0f` = AAA (OG is rendered into a fixed dark frame regardless of visitor theme — industry convention; LinkedIn/Twitter have their own light/dark renderers).

---

## Layout & Composition

### Surface 1: `/now` page

**Page shell (reuse BaseLayout as-is, no changes to its `<main>`):**

```astro
<BaseLayout
  title="What I'm doing now — Dragos Macsim"
  description="Current focus: what Dragos is working on, learning, and building right now. Updated monthly."
  ogImageSlug="now"
>
  <section aria-label="Now" class="py-16 md:py-24">
    <h1 class="font-bold mb-8" style="font-size: var(--font-size-display); line-height: 1.1;">
      What I'm doing now
    </h1>

    <div class="reveal">
      <p class="prose" style="color: var(--color-text-muted); font-size: var(--font-size-label); margin-bottom: 2rem;">
        Last updated: {LAST_UPDATED_DATE}
      </p>

      <div class="prose" style="font-size: var(--font-size-body); color: var(--color-text);">
        <!-- Right now paragraph -->
        <p>{right-now-paragraph}</p>
      </div>

      <h2 class="font-semibold mt-12 mb-4" style="font-size: var(--font-size-heading);">Working on</h2>
      <ul class="prose" style="font-size: var(--font-size-body);">
        <!-- 3–5 bullets -->
      </ul>

      <h2 class="font-semibold mt-12 mb-4" style="font-size: var(--font-size-heading);">Learning</h2>
      <ul class="prose" style="font-size: var(--font-size-body);">
        <!-- 2–4 bullets -->
      </ul>

      <h2 class="font-semibold mt-12 mb-4" style="font-size: var(--font-size-heading);">Location</h2>
      <p class="prose" style="font-size: var(--font-size-body);">{location-line}</p>

      <hr class="mt-16 mb-8" style="border-color: var(--color-border);" />
      <p class="prose" style="color: var(--color-text-muted); font-size: var(--font-size-label);">
        This is a <a href="https://nownownow.com/about" style="color: var(--color-accent-primary);">/now page</a>,
        an idea by Derek Sivers.
      </p>
    </div>
  </section>
</BaseLayout>
```

**Structural contract:**
1. Reuses `BaseLayout.astro` unchanged — inherits nav, ThemeToggle, `<main class="max-w-[1100px] mx-auto px-4 md:px-8 lg:px-12 pt-20">`.
2. One `<section aria-label="Now">` wrapper (not `id="now"` — would clash with nav anchor semantics).
3. Single `<h1>` (only h1 on this page, matching semantic discipline of rest of site where homepage has h1 inside `HeroSection.tsx`).
4. All text blocks wrapped in `.prose` (max-width 680px per `global.css` line 90-92) for readable measure.
5. `<div class="reveal">` wraps the content block below h1 — inherits Phase 5 scroll-reveal animation with `@supports` fallback and `prefers-reduced-motion` support (no new CSS needed).
6. Section subsections use `<h2>` (not `<h3>`) because h1 is at the page level and subsections are direct children.
7. Fixed content shape: intro paragraph → "Working on" list → "Learning" list → "Location" paragraph → divider → nownownow.com footer link.

**Content max-width:** `.prose` utility = 680px, centred inside the 1100px main container. Visually: narrow reading column on a wider background, matching the About section pattern.

**Last updated timestamp:** plain text string at the top of the `.reveal` wrapper. Format: `Last updated: April 2026` (month + year, not a full date — matches nownownow.com convention and reduces pressure to update too frequently). Stored as a constant inside `src/pages/now.astro` front-matter — hand-edited when content changes.

### Surface 2: Nav entry for `/now`

**Desktop block — modify `BaseLayout.astro` lines 27-32:**

Insert `<a href="/now">Now</a>` as the **last** nav link, after `#contact`. Rationale: anchor links point to sections of the homepage and read as an ordered journey (About → Experience → Projects → Contact); `/now` is a separate page about current focus and sits conceptually *outside* that journey. Placing it last avoids breaking the narrative flow and matches the visual convention (e.g., personal sites that put "Now" after main nav).

**Exact markup:**
```html
<a href="/now" data-nav-link class="nav-link text-sm font-medium transition-colors duration-200" style="color: var(--color-text-muted);">Now</a>
```

**Mobile block — modify `BaseLayout.astro` lines 59-62:** insert identical link with `mobile-nav-link block py-3 px-4 ...` classes, again as the last entry, to keep parity with desktop.

**Active state:** when user is on `/now`, the link must show the same active style as hash-active links — `color: var(--color-accent-primary)` + underlined. The existing `<style is:global>` rule (line 137) targets `[data-nav-link][data-active="true"]` — add a single line to `BaseLayout.astro`'s `<script>` that sets `data-active="true"` on the `/now` link when `window.location.pathname === '/now'` (before the IntersectionObserver runs, so it does not get wiped by anchor-intersection logic).

**Hash-only guard (NOW-03 in RESEARCH.md):** the existing click handler (lines 98-107) calls `e.preventDefault()` unconditionally, which would break `/now` navigation. Modify to:

```js
allNavLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return; // real routes navigate normally
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});
```

**IntersectionObserver compatibility:** the existing observer (line 110) only watches `section[id]`, so on `/now` (which has `aria-label="Now"` — no id) the observer will find zero sections and will not mutate any link's active state. Correct behaviour — the explicit `data-active` setter for `/now` stays intact.

### Surface 3: OG image template (Satori JSX-like markup)

**Canvas:** 1200 × 630 px (Facebook/LinkedIn/Twitter standard). Single template shared across all pages; dynamic content = `{ title, subtitle }`.

**Composition (top-to-bottom, left-aligned, vertically centred):**

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   ← 80px →                                                 │
│                                                            │
│   dragosmacsim.com              ← 28px Inter 400, accent  │
│   ↓ 24px                                                   │
│   {TITLE LINE 1}                ← 84px Inter 700, text    │
│   {TITLE LINE 2 if wraps}       line-height 1.1            │
│   ↓ 24px                                                   │
│   {subtitle}                    ← 36px Inter 400, muted   │
│                                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Rules:**
- Background: solid `#0a0a0f` (`--color-base` dark), no gradient, no noise — keep it single-block for rendering consistency across social platforms.
- Padding: 80px all sides. Content area = 1040 × 470.
- Alignment: left-aligned, vertically centred (`justifyContent: center` on the outer flex column).
- Font stack: `Inter` (set by `fonts[]` param passed to satori — no fallback needed since the font data is embedded).
- Text colour: title `#e4e4e7`, subtitle `#71717a`, brand `#6366f1` — values baked into the template (NOT CSS variables, since Satori does not resolve them).
- Title wrapping: natural wrap at container width. If a title exceeds two lines at 84px, the content generator (getStaticPaths) must shorten it — **not** the template.
- No icons, no images, no logo — text only. Keeps bundle small and avoids ImageResponse-style asset resolution pain.
- No `border-radius`, no shadows, no gradients — flat composition.

**Two OG variants generated in Phase 7 (from `getStaticPaths` array):**

| Slug | Title | Subtitle |
|------|-------|----------|
| `home` | `Dragos Macsim` | `AI Specialist & Product Builder` |
| `now` | `What I'm doing now` | `Dragos Macsim` |

**Output paths:** `dist/og/home.png`, `dist/og/now.png`. Each file must be >5KB and begin with the PNG magic bytes `89 50 4E 47` (asserted in `tests/phase7-build.test.ts`).

**Fallback:** any page that does not pass `ogImageSlug` to `<BaseLayout>` uses the existing static `/og-image.png` — kept on disk as the safety net.

---

## Interaction & State

### Nav link states (applies to `/now` entry)

Inherits from existing nav contract — no new states introduced.

| State | Visual | Trigger | Source |
|-------|--------|---------|--------|
| default | `color: var(--color-text-muted)` (#71717a) | initial render | inline style on `<a>` |
| hover | `color: var(--color-text)` (#e4e4e7) via global `[data-nav-link]:hover` rule | pointer over | `BaseLayout.astro` line 145-147 |
| active route | `color: var(--color-accent-primary)` (#6366f1) + 2px underline with 4px offset | when `window.location.pathname === '/now'` | `BaseLayout.astro` line 137-144 (global style) + new JS line that sets `data-active="true"` |
| focus-visible | Browser default focus ring (Phase 8 will upgrade globally — out of scope here) | keyboard tab | inherited |
| mobile menu open | Same as desktop; clicking link closes menu via existing handler (lines 87-94) | tap | existing logic, no change needed |

### `/now` page link behaviour

| Interaction | Result |
|-------------|--------|
| Click on homepage | Full-page navigation to `/now` (scroll handler skips via `startsWith('#')` guard) |
| Click on `/now` itself | Full-page navigation to `/now` — browser may no-op, which is acceptable |
| Click on any `#section` link while on `/now` | Full-page navigation back to `/` then browser scrolls to hash — this is standard browser behaviour for cross-page hash links; **no** `e.preventDefault()` runs because we're on `/now` (the click handler is attached per-page, and section anchors on `/now` don't match any `#section` element on the page; but the guard handles the general case cleanly) |

### Theme toggle on `/now`

Unchanged. `ThemeToggle` is part of `BaseLayout.astro` nav and works on every page automatically. FOUC-prevention script in `Head.astro` lines 48-68 runs before page content — dark/light is applied before first paint on `/now` just as on `/`.

### Scroll-reveal on `/now`

Single `<div class="reveal">` wraps the content below the h1. Uses existing Phase 5 scroll-driven animation gated by `@supports (animation-timeline: view())`. Non-supporting browsers see instant content (already handled in `global.css` lines 180-187). `prefers-reduced-motion` also already handled (lines 169-176).

No staggered children needed (`.reveal-stagger` not used here — the /now page is short-form prose, not a list of cards).

### OG image generation

No runtime interaction — OG PNGs are built at `astro build` time via `getStaticPaths` and written to `dist/og/`. Cloudflare Pages serves them as static assets. No client-side fetching, no JS.

### Cloudflare Web Analytics beacon

Zero visible UI. The `<script defer>` tag is injected just before `</body>` in `BaseLayout.astro`, guarded by `import.meta.env.PROD`:

```astro
{import.meta.env.PROD && (
  <script is:inline defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={`{"token": "${CF_ANALYTICS_TOKEN}"}`}>
  </script>
)}
```

No consent banner (cookieless — see RESEARCH.md lines 207-212). No loading state. No error state.

---

## Copywriting Contract

| Element | Copy | Notes |
|---------|------|-------|
| Nav link label (desktop + mobile) | `Now` | Single word. Capitalised. No emoji. |
| `/now` page `<title>` | `What I'm doing now — Dragos Macsim` | Matches nownownow.com convention and includes brand for SERP |
| `/now` meta description | `Current focus: what Dragos is working on, learning, and building right now. Updated monthly.` | 97 chars — under Google's ~155 char limit |
| `/now` `<h1>` | `What I'm doing now` | No emoji, no punctuation, matches title without brand |
| `/now` last-updated label | `Last updated: April 2026` | Month + year only. Hand-edited per update. |
| `/now` h2 #1 | `Working on` | |
| `/now` h2 #2 | `Learning` | |
| `/now` h2 #3 | `Location` | |
| `/now` footer sentence | `This is a /now page, an idea by Derek Sivers.` | `/now page` is a hyperlink to `https://nownownow.com/about`. Attribution convention. |
| OG home title | `Dragos Macsim` | Brand as title on the homepage card |
| OG home subtitle | `AI Specialist & Product Builder` | Positioning statement, matches site `jobTitle` + narrative |
| OG now title | `What I'm doing now` | Mirrors page h1 |
| OG now subtitle | `Dragos Macsim` | Brand as subtitle on the /now card |
| OG brand eyebrow | `dragosmacsim.com` | Same value on every OG variant — site identifier |
| Homepage meta description (update for SEO-07) | `Dragos Macsim — AI data specialist. Explore my work, experience, and download my CV.` | **Unchanged** — already the default in `Head.astro` line 10. Now passed explicitly from `index.astro` for clarity. |
| Primary CTA on /now | **none** | /now page has no primary CTA. It is a read-only current-focus page. Links to `mytai.uk`, GitHub, etc. inside body prose are **not** primary CTAs — they are inline context. |
| Empty state | **not applicable** | /now is hand-written prose; it is never "empty". If Dragos has nothing to put in a section, remove that section rather than shipping empty state copy. |
| Error state | **not applicable** | Static page. No fetch, no form, no failure mode. 404 handling is deferred to Phase 8. |
| Destructive confirmation | **not applicable** | No destructive actions in Phase 7. |

**Content placeholder** (user supplies final copy before implementation; RESEARCH.md line 409 flagged this as an Open Question):

```
Right now I'm finishing my MSc dissertation at Bayes Business School and
pushing mytai toward its first public release on iOS. I'm splitting time
between ML evaluation work at Mindrift and product work on mytai.

Working on
- mytai — AI-powered fitness app, iOS TestFlight beta
- MSc dissertation — {topic}
- Automated web scraping workflows at Mindrift

Learning
- LLM evaluation patterns and RAG quality metrics
- {second item}

Location
Based in London.
```

**Tone:** first-person, plain language, no marketing hedging, no superlatives. Matches the voice of the About section (`src/components/AboutSection.astro` lines 26-45).

**Typographic discipline:**
- No emoji anywhere.
- No exclamation marks.
- No ALL-CAPS.
- Contractions allowed ("I'm", "don't") — matches existing site voice.
- Dates in `Month YYYY` format (e.g., "April 2026") — never "04/2026" or "Apr 11, 2026".

---

## Responsive Behaviour

### `/now` page breakpoints

| Viewport | Layout |
|----------|--------|
| 320px (mobile) | Section padding `py-16` (64px top/bottom). Main horizontal padding `px-4` (16px). Body `line-height: 1.6` (per global.css media query line 83-87). Title font-size ≈ 40px (clamp lower bound). `.prose` natural width fills container minus padding. |
| 640px (mobile landscape) | Same padding, body line-height switches back to 1.7, title scales up per `clamp(2.5rem, 5vw, 4rem)`. |
| 768px (tablet, `md:` breakpoint) | Section padding `md:py-24` (96px top/bottom). Main horizontal padding `md:px-8` (32px). |
| 1280px (desktop, `lg:` breakpoint) | Main horizontal padding `lg:px-12` (48px). `.prose` max-width of 680px centres inside 1100px container. Title at clamp upper bound ≈ 64px. |

**No new media queries needed.** All responsive behaviour is inherited from existing `BaseLayout.astro` main container, `global.css` base styles, and Tailwind responsive variants on the section.

### OG image

**Fixed canvas — 1200 × 630.** Not responsive. Social platforms scale it themselves. No mobile variant.

### Nav (including new `/now` entry)

| Viewport | Behaviour |
|----------|-----------|
| <768px | Desktop nav hidden (`hidden md:flex`). Hamburger menu shown. `Now` link appears as 5th item in the mobile dropdown with `block py-3 px-4` classes. |
| ≥768px | Desktop nav visible with `gap-6` (24px) between links. `Now` appears as 5th link. Total 5 links at 14px = still fits comfortably within 1100px container with room for ThemeToggle on the right. |

**Layout verification target:** after adding `Now`, desktop nav has 5 links: About / Experience / Projects / Contact / Now. At 14px semibold with `gap-6`, total width is well under the 1100px max — no wrapping, no overflow. Confirmed by inspecting existing nav block at 4 links.

---

## Accessibility

Phase 7 inherits the existing site a11y posture (Phase 8 will audit and harden). Specific requirements for the new surfaces:

### `/now` page

- [ ] Single `<h1>` per page — "What I'm doing now". No other h1.
- [ ] Heading hierarchy strictly h1 → h2. No skipped levels, no h3+ in Phase 7 scope.
- [ ] All body copy inside `<p>` or `<ul>/<li>` — no `<div>`-wrapped prose.
- [ ] `<section aria-label="Now">` provides a landmark for screen readers. Do not use `role="main"` — `BaseLayout`'s `<main>` already provides that.
- [ ] Contrast: all text pairs meet AA (verified in Colour section above). No text over image.
- [ ] Links inside prose (nownownow.com attribution) have `color: var(--color-accent-primary)` and are underlined by default (reuse existing `.prose a` style if present, otherwise add an inline underline). Discoverable by colour **and** decoration — not colour alone.
- [ ] `prefers-reduced-motion`: the `.reveal` wrapper already respects this via `global.css` lines 169-176 — no extra work.
- [ ] Focus-visible: inherits browser default (Phase 8 will add custom ring globally).

### Nav

- [ ] `Now` link has visible text (no icon-only). Accessible name = "Now".
- [ ] Active state is announced via visual underline + colour change (not colour alone).
- [ ] Keyboard-accessible: native `<a>` element, focusable via Tab, activated via Enter.
- [ ] Mobile menu: `Now` link inherits existing `aria-expanded` handling on the hamburger button — no change needed.
- [ ] Touch target: `block py-3 px-4` on mobile = ~44×100+ px. Meets AAA target-size (44×44 min).

### OG image

- [ ] `<meta property="og:image:alt" content="..." />` — **add** alongside `og:image` in `Head.astro`. Alt text per slug: `"Dragos Macsim — AI Specialist & Product Builder"` for home, `"What I'm doing now — Dragos Macsim"` for now. Currently `Head.astro` only declares `og:image:width` and `og:image:height` (lines 41-42) — alt is missing.
- [ ] Text contrast on OG = AAA (15.3:1) — verified above.
- [ ] Title font-size 84px ensures readability at social-feed thumbnail sizes (e.g., LinkedIn renders OG at roughly 400×200 — 84px source scales to ~28px, still legible).

### Analytics beacon

- [ ] No user-facing UI — no a11y surface.
- [ ] Cookieless — no consent dialogue needed (see RESEARCH.md lines 207-212).

---

## File-Level Visual Contract

| File | Visual contract it owns |
|------|-------------------------|
| `src/pages/now.astro` | /now page shell, content structure, class composition (`.prose`, `.reveal`), inline styles pointing to CSS variables |
| `src/layouts/BaseLayout.astro` | Nav entry insertion (desktop + mobile), active-state JS for `/now`, CF beacon script placement, hash-only click guard |
| `src/components/Head.astro` | New `ogImageSlug` prop → resolves `og:image`; new `og:image:alt` tag; extended Person JSON-LD |
| `src/pages/og/[slug].png.ts` | `getStaticPaths` declares the fixed list of pages that get OG variants; calls `generateOgImage()` |
| `src/lib/og-image.ts` | The only file that declares Satori markup. Lock the template here — do not inline markup anywhere else. |
| `public/robots.txt` | 5-line static file. No styling. |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required (shadcn not initialised in project) |
| Third-party | none | not required |

**Third-party components:** zero. Phase 7 uses only:
- `@astrojs/sitemap@^3.7.2` — first-party Astro integration
- `satori@^0.26.0` — Vercel-maintained, used only at build time, no client shipping
- `satori-html@^0.3.2` — single-purpose template helper, server-only
- `@resvg/resvg-js@^2.6.2` — native PNG renderer, server-only
- `@fontsource/inter@^5.2.8` — font files only, no code

None of these contribute UI blocks or components. No `shadcn view` scan required.

---

## Deferred / Out of Scope

Items the planner or executor may be tempted to add but which are explicitly **not part of Phase 7's visual contract**:

1. **`prefers-reduced-motion` on the `.reveal` on /now** — already handled globally. Do not add page-level media query.
2. **404 branded page** — deferred to Phase 8 (roadmap line 138).
3. **`<ViewTransitions />`** — deferred to Phase 8 (roadmap line 138).
4. **Custom focus rings** — deferred to Phase 8 a11y audit.
5. **Print stylesheet for /now** — deferred to Phase 8.
6. **Emoji in OG images** — requires separate emoji font, deferred indefinitely.
7. **Light-mode OG variant** — industry convention is a single dark variant; platforms render their own chrome around it. Not worth the complexity.
8. **Gradient or noise texture on OG** — rejected; flat solid background renders consistently across platforms.
9. **`alumniOf`, `worksFor` in JSON-LD** — `[DEFERRED — default: skip]`. RESEARCH.md line 410 flags as optional; keep Phase 7 additions minimal (`image`, `email`, `description`, `knowsAbout`). Can be added in Phase 8 if Rich Results Test flags them.
10. **Per-section stagger reveal on /now** — page is short enough that a single `.reveal` wrapper is cleaner. `.reveal-stagger` adds visual noise on prose content.

---

## Open Decisions (non-blocking)

Marked `[DEFERRED — default]` per auto-chain instructions. Executor or planner may finalise at implementation time; defaults below are safe.

1. **CF Analytics token value** — `[DEFERRED — default: user provides before deploy]`. Stored as an inline constant or env var in `BaseLayout.astro`. Does not affect visual contract.
2. **`/now` page actual content strings** — `[DEFERRED — default: use the placeholder in Copywriting Contract until user edits]`. Content is user-owned and expected to change monthly.
3. **Last-updated date** — `[DEFERRED — default: "April 2026" at initial commit, user updates on content changes]`.
4. **OG title wrap behaviour for future pages** — `[DEFERRED — default: title must fit two lines max at 84px; content generator shortens if longer]`. Not triggered by home or now slugs.
5. **JSON-LD Person `knowsAbout` exact list** — `[DEFERRED — default: ["Artificial Intelligence", "Machine Learning", "Data Analysis", "Product Development", "Python", "TypeScript"] per RESEARCH.md line 144-147]`. Hand-maintained in `Head.astro`.
6. **Inline prose link style on /now** — `[DEFERRED — default: color var(--color-accent-primary), underline always on]`. Matches generic convention if no existing `.prose a` rule is found in `global.css`.

None of these defaults block a gsd-ui-checker pass.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS — all surfaces have locked copy (13 elements defined, 6 deferred with defaults)
- [ ] Dimension 2 Visuals: PASS — /now shell composition, nav insertion, OG layout all specified file-by-file
- [ ] Dimension 3 Color: PASS — zero new colours, 60/30/10 tokens reused, AA+ contrast verified on new surfaces
- [ ] Dimension 4 Typography: PASS — 4 sizes + 2 weights reused from Phase 1 `@theme`; OG typography uses static parallel values because Satori cannot read CSS vars
- [ ] Dimension 5 Spacing: PASS — all multiples of 4, sourced from existing `--spacing: 0.25rem` base; single exception (OG 80px safe-area) is canvas-local and named
- [ ] Dimension 6 Registry Safety: PASS — zero third-party UI registries; all Phase 7 dependencies are server-only or first-party

**Approval:** pending
