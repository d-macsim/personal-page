# Phase 5: Animations & Deploy — Research

**Researched:** 2026-04-10
**Domain:** CSS scroll-driven animations + Cloudflare Pages deployment
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Animation Style**
- D-01: Fade-up scroll-reveal — elements fade in while sliding up slightly, matching the hero entrance pattern (Phase 2 D-07)
- D-02: Subtle intensity — short travel distance (15-20px), fast duration (0.4-0.6s). Professional and minimal
- D-03: Staggered children within sections — timeline items, skill badges, project card elements animate in sequence with small delays (matching hero's 150ms stagger pattern)

**Animation Approach**
- D-04: CSS-only scroll-driven animations using `animation-timeline: view()` and `@keyframes`. Zero JavaScript for scroll-reveals
- D-05: Graceful degradation — browsers without scroll-driven animation support (Firefox as of April 2026) show content immediately with no animation. No polyfill needed
- D-06: `prefers-reduced-motion: reduce` disables all scroll animations — content renders immediately

**Deployment**
- D-07: Cloudflare Pages with GitHub auto-deploy — connect repo, push to main triggers build and deploy
- D-08: Cloudflare account and domain `dragosmacsim.com` already configured — DNS is on Cloudflare, no migration needed
- D-09: Astro static output adapter (default) — no SSR needed. Build command: `npm run build`, output directory: `dist/`

**Performance**
- D-10: Minimal JS budget — CSS animations for scroll-reveal means only the hero React island ships JavaScript. Target total JS under 50KB gzipped
- D-11: Lighthouse targets — reasonable targets for an Astro static site with minimal JS (90+ achievable across the board)

### Claude's Discretion

- Exact `animation-range` values for scroll-triggered reveals
- Which children within each section get individual stagger vs group animation
- Stagger delay timing per section (can vary by content density)
- Cloudflare Pages build configuration details (headers, redirects if needed)
- Lighthouse optimization priorities

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DSGN-04 | Scroll-reveal animations on sections using Motion library | D-04 overrides this to CSS-only via `animation-timeline: view()` — zero JS approach. Research confirms CSS scroll-driven animations can replicate all required fade-up + stagger behavior |
| DEPLOY-01 | Deployed to production on custom domain with HTTPS | Cloudflare Pages auto-provisions HTTPS when domain is in Cloudflare DNS. Steps: connect GitHub repo in CF dashboard, configure build settings, add custom domain — CNAME created automatically |
</phase_requirements>

---

## Summary

Phase 5 delivers two independent but lightweight capabilities: CSS scroll-reveal animations layered onto all non-hero sections, and production deployment to `dragosmacsim.com` via Cloudflare Pages.

The animation approach (D-04) uses native CSS scroll-driven animations — `animation-timeline: view()` with `@keyframes` — meaning no additional JavaScript is shipped. This preserves the zero-JS advantage of Astro's static sections. The technique is supported in Chrome 115+, Edge 115+, and Safari 18+; Firefox does not support it as of April 2026 without a flag. The chosen approach (D-05) makes this irrelevant: `@supports (animation-timeline: view())` wraps all reveal rules so unsupported browsers simply see content immediately with no layout shift or broken state.

The deployment path is straightforward: the project already uses `output: 'static'` (Astro default with no SSR adapter), `site: "https://dragosmacsim.com"` is already set in `astro.config.mjs`, and the domain's DNS is already managed by Cloudflare. The only action is connecting the GitHub repo in the Cloudflare Pages dashboard and adding the custom domain — Cloudflare handles HTTPS certificate provisioning automatically.

**Primary recommendation:** Implement all scroll-reveal rules as a single `@keyframes` + utility class block in `global.css`, gate the entire block with `@supports (animation-timeline: view())`, and handle stagger via `nth-child` `animation-range` offsets on list-like children (timeline items, skill categories). For deployment, use the Cloudflare Pages dashboard to connect the repo — no adapter or config file changes required for static output.

---

## Standard Stack

### Core

| Library / API | Version | Purpose | Why Standard |
|---------------|---------|---------|--------------|
| CSS Scroll-Driven Animations | Native (no package) | Scroll-triggered section reveals | Zero JS. Chrome 115+, Edge 115+, Safari 18+ support. The spec is stable in Chromium/WebKit. [VERIFIED: MDN, caniuse] |
| `@keyframes` + `animation-timeline: view()` | CSS Level 5 | Animate elements as they enter the viewport | Direct spec primitive — no library needed for this use case [VERIFIED: MDN] |
| Cloudflare Pages | Free tier | Static hosting + CDN | Already chosen (CLAUDE.md). Unlimited bandwidth, global edge, automatic HTTPS [VERIFIED: Cloudflare docs] |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `@supports (animation-timeline: view())` | Progressive enhancement guard | Wrap ALL scroll-driven animation CSS — ensures Firefox/old browsers see content immediately [VERIFIED: MDN] |
| `prefers-reduced-motion: reduce` | Accessibility guard | Already in `global.css` for `.glow-pulse`. Extend to cover all new scroll animations [VERIFIED: existing codebase] |
| `.node-version` file or `NODE_VERSION` env var | Pin Node.js version in CF Pages build | Set to `22` to match local environment and Astro 6.x requirement [VERIFIED: Cloudflare Pages docs] |

### No New Packages Needed

The entire animation feature is implemented with native CSS. No `npm install` required for this phase.

---

## Architecture Patterns

### Pattern 1: Reveal Utility Class

**What:** A single `.reveal` class added to each section (or to individual child elements) in the Astro markup. All animation logic lives in `global.css`.

**When to use:** One class to rule section entrance — easy to apply, easy to remove.

```css
/* Source: MDN scroll-driven animations + Chrome Dev docs */

/* 1. Define the keyframe */
@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 2. Gate everything behind @supports */
@supports (animation-timeline: view()) {

  .reveal {
    animation: reveal-up 0.5s ease-out both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }

  /* Reduced motion: disable all scroll animations */
  @media (prefers-reduced-motion: reduce) {
    .reveal {
      animation: none;
    }
  }
}
```

**Explanation of `animation-range: entry 0% entry 60%`:**
- `entry 0%` — animation starts the moment the element's leading edge enters the viewport
- `entry 60%` — animation completes when 60% of the element's height has entered
- This is faster than `entry 100%` (full visibility required) and feels snappier for short sections

**Alternative ranges to consider:**
- `entry 0% entry 80%` — slightly slower, suits taller sections like ExperienceTimeline
- `entry 10% cover 30%` — delays start slightly for sections near the fold

### Pattern 2: Staggered Children via `nth-child` + `animation-range` Offsets

**What:** For list-like sections (timeline items, skill categories), apply `.reveal-stagger` to the parent container. Each direct child gets the base animation, and `nth-child` rules offset the `animation-range` start to create visual stagger.

**Critical note on scroll-driven + animation-delay:** When using `animation-timeline: view()`, `animation-delay` shifts the start point along the scroll timeline (not by time). For stagger with scroll-driven animations, the correct approach is to use `animation-range` offsets per child, NOT `animation-delay`.

```css
/* Source: MDN animation-delay with scroll timelines, CSS-Tricks stagger guide */

@supports (animation-timeline: view()) {

  .reveal-stagger > * {
    animation: reveal-up 0.5s ease-out both;
    animation-timeline: view();
    animation-range: entry 0% entry 50%;
  }

  /* Stagger by shifting animation-range start per nth-child */
  .reveal-stagger > *:nth-child(1) { animation-range: entry 0%  entry 50%; }
  .reveal-stagger > *:nth-child(2) { animation-range: entry 5%  entry 55%; }
  .reveal-stagger > *:nth-child(3) { animation-range: entry 10% entry 60%; }
  .reveal-stagger > *:nth-child(4) { animation-range: entry 15% entry 65%; }
  .reveal-stagger > *:nth-child(5) { animation-range: entry 20% entry 70%; }
  .reveal-stagger > *:nth-child(6) { animation-range: entry 25% entry 75%; }
  .reveal-stagger > *:nth-child(n+7) { animation-range: entry 25% entry 75%; }

  @media (prefers-reduced-motion: reduce) {
    .reveal-stagger > * {
      animation: none;
    }
  }
}
```

**Alternative (simpler) stagger for time-independent feel:**
If the scroll-range stagger feels too dependent on scroll speed, use a standard CSS `animation-delay` with `animation-play-state: paused` trigger via IntersectionObserver — but this requires JavaScript. D-04 rules this out. Stick to range-based stagger.

### Pattern 3: Section-Level Reveal (Group Animation)

For sections where all content enters as one unit (About, Contact), apply `.reveal` to the section's content container rather than individual children.

```astro
<!-- AboutSection.astro -->
<section id="about" aria-label="About" class="py-16 md:py-24">
  <div class="reveal">
    <!-- all content inside -->
  </div>
</section>
```

### Cloudflare Pages: No Config File Changes

**What:** For a static Astro site, Cloudflare Pages requires no `wrangler.json`, no `@astrojs/cloudflare` adapter, and no changes to `astro.config.mjs`. The dashboard build settings are sufficient.

**Dashboard settings to configure:**
| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repo root) |
| Node.js version | `22` (via `NODE_VERSION` env var or `.node-version` file) |

**Custom domain flow:**
1. In CF Pages project: Settings > Custom domains > Add domain: `dragosmacsim.com`
2. Since DNS is already on Cloudflare, CF creates the CNAME automatically
3. HTTPS certificate is provisioned automatically — no action needed
4. Propagation is near-instant when DNS is managed by Cloudflare [VERIFIED: Cloudflare Pages docs]

### Recommended Project Structure Change

No new directories needed. All animation CSS goes into the existing `global.css`. Section components get `.reveal` class added to their root content container or individual animated children.

```
src/
├── styles/
│   └── global.css          ← Add @keyframes + .reveal + @supports block here
├── components/
│   ├── AboutSection.astro   ← Add class="reveal" to content wrapper
│   ├── CVSection.astro      ← Add class="reveal" to content wrapper
│   ├── ExperienceTimeline.astro  ← Add class="reveal-stagger" to root div
│   ├── SkillsGrid.astro     ← Add wrapper div with class="reveal-stagger"
│   ├── ProjectsSection.astro ← Add class="reveal" to section heading + cards
│   ├── ContactSection.astro  ← Add class="reveal" to content wrapper
│   └── HeroSection.tsx      ← NO CHANGES — already animated via Motion v12
```

### Anti-Patterns to Avoid

- **Applying `.reveal` to `<section>` directly:** The section element itself has no meaningful scroll entry — apply to the inner content container so the animation triggers as content enters the viewport.
- **Using `animation-delay` for stagger with scroll timelines:** `animation-delay` shifts the scroll range offset, not wall-clock time. It causes the nth item to only begin animating once the element has scrolled further in — this can mean items never animate if the section is short. Use `animation-range` offsets instead (see Pattern 2).
- **Omitting `@supports` guard:** Without it, browsers that partially support `animation-timeline` may freeze elements at `opacity: 0` in the `from` state. Always gate with `@supports`.
- **Adding the `@astrojs/cloudflare` adapter for a static site:** The adapter is only needed for SSR. Adding it to a static Astro site will change `output` mode and break static generation. D-09 is correct: no adapter needed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll position detection | Custom `scroll` event listener | CSS `animation-timeline: view()` | Native CSS runs off the main thread; JS scroll listeners can block rendering and cause jank |
| In-browser PDF viewer | Custom `<iframe>` + PDF.js init code | (Phase 5 does not include this — deferred to v2) | — |
| HTTPS certificate management | Manual cert provisioning | Cloudflare's automatic cert | Zero maintenance, auto-renews, covers apex + www |
| Stagger with JS | IntersectionObserver + JS delay | `nth-child` + `animation-range` offsets in CSS | No JS needed; supported browsers run the stagger natively |

---

## Common Pitfalls

### Pitfall 1: `opacity: 0` Freeze in Unsupported Browsers

**What goes wrong:** If `@keyframes reveal-up` and `.reveal { animation: reveal-up ... }` are declared outside `@supports`, a browser that parses `animation-timeline` but doesn't fully implement it may apply the keyframe's `from` state (`opacity: 0`) and then stall. Content becomes invisible.

**Why it happens:** Partial spec implementations. Firefox has the property flag but may not complete the animation.

**How to avoid:** Wrap the entire `.reveal` block AND the `@keyframes reveal-up` block inside `@supports (animation-timeline: view())`. The fallback: content is fully visible with no animation.

**Warning signs:** Section content invisible in Firefox; disappears after scroll past a section and doesn't return.

### Pitfall 2: Animation Range Fires Too Early (Section Near Fold)

**What goes wrong:** For sections that are partially visible on load (e.g., the About section on large monitors), `entry 0%` fires immediately on page load before the user scrolls. The animation completes instantly and feels like a page-load flash rather than a scroll reveal.

**Why it happens:** `entry 0%` triggers as soon as any pixel of the element is in the viewport, including on first paint.

**How to avoid:** Use `entry 10% entry 70%` or similar — require the element to be 10% visible before starting. For sections very close to the hero, consider not applying `.reveal` at all (only hero is excluded per D-01, but sections immediately below may need a higher start threshold).

**Warning signs:** About section flashes on page load on desktop.

### Pitfall 3: Cloudflare Pages Builds with Wrong Node.js Version

**What goes wrong:** Cloudflare Pages default build image ships Node.js 22 (current default), but if the project relied on a specific v22 minor or had `engines.node: ">=22.12.0"` in `package.json`, a version mismatch can fail the build with esm or lifecycle script errors.

**Why it happens:** The `package.json` in this project specifies `"node": ">=22.12.0"`. Cloudflare Pages v2 build image may ship a different 22.x patch.

**How to avoid:** Add a `.node-version` file to the repo root with `22` (or a specific version like `22.12.0`). This file is read by Cloudflare Pages and pins the Node.js version used for the build.

**Warning signs:** Build log shows Node.js version mismatch; `npm ci` fails with lifecycle script error.

### Pitfall 4: `animation-delay` Stagger Has No Effect on Scroll Timelines

**What goes wrong:** A developer applies `.reveal:nth-child(n) { animation-delay: calc(n * 100ms) }` expecting items to cascade in with time-based delays. The items do not stagger — they all animate at the same scroll position.

**Why it happens:** When `animation-timeline` is a scroll timeline (not the default time-based document timeline), `animation-delay` shifts the start along the scroll axis, not wall-clock time. For small values (100ms), the offset is negligible on a scroll timeline measured in pixels.

**How to avoid:** Use `animation-range-start` offsets per `nth-child` (see Pattern 2). Shift each child's range start by a small percentage (3-5%) to create visual stagger relative to the section's scroll progress.

**Warning signs:** All `.reveal` children appear at the same moment with no stagger effect.

### Pitfall 5: Forgetting to Exclude the Hero

**What goes wrong:** A blanket `section.reveal` selector or a rule applied to all `.astro` components catches HeroSection and overrides its Motion v12 animation — causing a double-animation or a CSS opacity freeze fighting the JS animation.

**Why it happens:** Hero is a React island — its animation state is controlled by Motion v12, which sets `opacity: 1` via inline style after mount. A CSS `opacity: 0` on the same element from a `.reveal` rule may briefly win (FOUC-style flash).

**How to avoid:** Never apply `.reveal` to `#hero` or `HeroSection`. The CONTEXT.md explicitly excludes hero (D-01). Apply `.reveal` only to About, CV/Experience, Skills, Projects, Contact sections.

---

## Code Examples

### Complete `global.css` Addition

```css
/* Source: MDN scroll-driven animations, Chrome for Developers docs */

/* ---- Scroll-Reveal Animation (Phase 5) ---- */
@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gate ALL scroll-driven animation rules behind @supports */
@supports (animation-timeline: view()) {

  .reveal {
    animation: reveal-up 0.5s ease-out both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }

  /* Staggered children — use animation-range offsets, NOT animation-delay */
  .reveal-stagger > * {
    animation: reveal-up 0.5s ease-out both;
    animation-timeline: view();
    animation-range: entry 0% entry 50%;
  }

  .reveal-stagger > *:nth-child(1) { animation-range: entry 0%  entry 50%; }
  .reveal-stagger > *:nth-child(2) { animation-range: entry 5%  entry 55%; }
  .reveal-stagger > *:nth-child(3) { animation-range: entry 10% entry 60%; }
  .reveal-stagger > *:nth-child(4) { animation-range: entry 15% entry 65%; }
  .reveal-stagger > *:nth-child(5) { animation-range: entry 20% entry 70%; }
  .reveal-stagger > *:nth-child(6) { animation-range: entry 25% entry 75%; }
  .reveal-stagger > *:nth-child(n+7) { animation-range: entry 25% entry 75%; }

  /* Accessibility — disable all scroll animations for reduced-motion users */
  @media (prefers-reduced-motion: reduce) {
    .reveal,
    .reveal-stagger > * {
      animation: none;
    }
  }
}
```

### ExperienceTimeline.astro — Stagger Application

```astro
<!-- Root div gets reveal-stagger; each child entry is targeted by .reveal-stagger > * -->
<div class="relative reveal-stagger">
  {roles.map((role) => (
    <div class="relative pl-0 sm:pl-12 pb-8 sm:pb-12">
      {/* ...existing markup unchanged... */}
    </div>
  ))}
</div>
```

Note: Astro's server-side `map()` renders actual `nth-child` positions in the DOM, so the CSS `nth-child` selector works correctly with no JS.

### Cloudflare Pages Dashboard Build Settings

```
Framework preset: Astro
Build command:    npm run build
Build directory:  dist
Root directory:   /

Environment variables (Production + Preview):
  NODE_VERSION = 22
```

### `.node-version` file (repo root)

```
22
```

This file is read by Cloudflare Pages and pins the Node.js version for all builds.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| IntersectionObserver + JS class toggle | CSS `animation-timeline: view()` | Chrome 115 (Jul 2023), Safari 18 (Sep 2024) | No JS needed for reveal animations in supported browsers |
| `framer-motion` package for animations | `motion` package, import from `motion/react` | v11 rebrand (2024) | Already applied in Phase 2 — relevant context for hero only |
| `@astrojs/cloudflare` adapter required for all CF Pages | Adapter only needed for SSR output | Astro 2+ | Static sites deploy without any adapter |

**Deprecated/outdated:**
- `framer-motion` package name: Replaced by `motion`. The project already uses `motion/react` (Phase 2). Don't reference `framer-motion` in any new code.
- `@astrojs/tailwind` integration: Replaced by `@tailwindcss/vite` Vite plugin for Tailwind v4. Already applied in Phase 1. No change needed.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Firefox does not support `animation-timeline: view()` by default as of April 2026 | Architecture Patterns / Pitfall 1 | If Firefox added default support, the `@supports` guard is still correct — no risk. The fallback is additive, not subtractive. |
| A2 | Safari 18+ supports `animation-timeline: view()` | Standard Stack | If support was reverted or limited in Safari 18.x, some iOS users would see unstyled content. Fallback behavior is still acceptable per D-05. |
| A3 | Cloudflare Pages default Node.js version is v22 as of April 2026 | Common Pitfalls | If CF Pages builds with a lower version (e.g., 18), `npm run build` may fail. Mitigated by adding `.node-version: 22` to repo root. |

---

## Open Questions (RESOLVED)

1. **Safari `animation-range: entry` behavior on short sections** (RESOLVED)
   - What we know: `entry 0% entry 60%` works well for taller sections
   - What's unclear: On sections shorter than ~200px (e.g., ContactSection), `entry 60%` may mean the full animation never completes because the section exits the viewport before 60% is reached
   - Recommendation: Test ContactSection with `animation-range: entry 0% cover 40%` as an alternative, which uses the wider `cover` range for short elements
   - **Resolution:** ContactSection uses `.reveal` with `animation-range: entry 0% entry 40%` (shorter range than taller sections). The 40% entry range completes the animation when 40% of the element has entered the viewport, which is achievable even for short sections. If issues arise during manual testing, the executor can adjust to `entry 0% cover 40%` per this recommendation.

2. **Whether SkillsGrid renders nth-child-accessible markup** (RESOLVED)
   - What we know: `SkillsGrid.astro` renders badge elements in a loop
   - What's unclear: The badges are inside category groups — `nth-child` selectors for `.skill-badge` may count within each category `<div>`, not globally
   - Recommendation: Planner should verify the DOM structure and apply stagger at category level (the grid row) rather than individual badges if nesting prevents nth-child from working as expected
   - **Resolution:** Plan 05-01 Task 2 wraps SkillsGrid output in a `<div class="reveal-stagger">` wrapper. Stagger is applied at the category level (each `<div class="mb-6">` category block is a direct child), not at the individual badge level. The `.reveal-stagger > *` selector targets these direct children, so `nth-child` counts correctly within the wrapper.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | Yes | 22.20.0 | — |
| npm | Package install | Yes | 10.9.3 | — |
| git | GitHub push / CF Pages trigger | Yes | 2.51.0 | — |
| Cloudflare Pages account | DEPLOY-01 | Yes (D-08: already configured) | — | — |
| `dragosmacsim.com` DNS on Cloudflare | Custom domain HTTPS | Yes (D-08) | — | — |
| GitHub repository | CF Pages auto-deploy trigger | [ASSUMED] exists — project is in a working directory | — | Manual upload via CF dashboard |

**Missing dependencies with no fallback:** None identified.

**Missing dependencies with fallback:** None identified.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (unit) + Playwright (E2E) |
| Config file | `vitest.config.ts` (if exists) or `package.json` scripts |
| Quick run command | `npm test` |
| Full suite command | `npm test && npm run test:e2e` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-04 | `.reveal` class present in section markup | Unit (static analysis) | `npm test` | Wave 0 |
| DSGN-04 | `@supports (animation-timeline: view())` wraps animation CSS | Unit (static analysis) | `npm test` | Wave 0 |
| DSGN-04 | `@media (prefers-reduced-motion: reduce)` disables animations | Unit (static analysis) | `npm test` | Wave 0 |
| DEPLOY-01 | Site responds 200 at `https://dragosmacsim.com` | E2E smoke test | `npm run test:e2e` | Wave 0 |
| DEPLOY-01 | No browser security warnings (HTTPS valid) | E2E smoke test | `npm run test:e2e` | Wave 0 |

### Sampling Rate

- Per task commit: `npm test` (static analysis, no browser)
- Per wave merge: `npm test && npm run test:e2e`
- Phase gate: Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/phase5-animations.test.ts` — static analysis of `global.css` for `@supports` guard, `@keyframes reveal-up`, `.reveal` class
- [ ] `tests/phase5-animations.test.ts` — verify `.reveal` class present in all section components (AboutSection, CVSection, ExperienceTimeline, SkillsGrid, ProjectsSection, ContactSection)
- [ ] `tests/phase5-deploy.test.ts` — Playwright smoke test: navigate to production URL, assert 200 response, assert no mixed-content warnings
- [ ] `tests/phase5-reduced-motion.test.ts` — static analysis: `prefers-reduced-motion` block covers both `.reveal` and `.reveal-stagger`

---

## Security Domain

Phase 5 is CSS additions + Cloudflare Pages connection. No new data flows, no user input, no authentication surface. Security domain is not applicable.

| ASVS Category | Applies | Note |
|---------------|---------|------|
| V2 Authentication | No | No auth surfaces added |
| V3 Session Management | No | Static site, no sessions |
| V4 Access Control | No | Public read-only content |
| V5 Input Validation | No | No new user inputs |
| V6 Cryptography | No | HTTPS handled by Cloudflare automatically |

No new threat patterns introduced by this phase.

---

## Sources

### Primary (HIGH confidence)

- [MDN: CSS Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) — browser support, `animation-timeline`, `animation-range`, `view()` syntax
- [MDN: view() function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view) — syntax and parameters
- [Chrome for Developers: Scroll-Driven Animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) — `animation-range: entry` examples, best practices
- [Cloudflare Pages: Deploy an Astro Site](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) — build settings, output directory
- [Cloudflare Pages: Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) — domain setup, automatic HTTPS
- [Cloudflare Pages: Build Configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) — build command, environment variables
- Existing codebase: `global.css`, `HeroSection.tsx`, `astro.config.mjs`, `package.json` — verified directly

### Secondary (MEDIUM confidence)

- [Can I Use: animation-timeline view()](https://caniuse.com/mdn-css_properties_animation-timeline_view) — browser support tables confirming Chrome 115+, Safari 18+, Firefox behind flag
- [Cyd Stumpel: Two approaches to fallback CSS scroll-driven animations](https://cydstumpel.nl/two-approaches-to-fallback-css-scroll-driven-animations/) — `@supports` pattern confirmed
- [Cloudflare Community: Node.js version in Pages](https://www.ubitools.com/cloudflare-pages-nodejs-version-guide/) — `.node-version` file approach, `NODE_VERSION` env var

### Tertiary (LOW confidence)

- Mozilla Connect: Firefox animation-timeline status — community discussion confirming no default support as of Jan 2026 [LOW: community forum, not official docs]

---

## Metadata

**Confidence breakdown:**
- CSS scroll-driven animations API: HIGH — verified against MDN and Chrome Dev docs
- Browser support table: HIGH — caniuse data, corroborated by MDN and community sources
- Cloudflare Pages deployment steps: HIGH — verified against official CF docs
- Stagger via `animation-range` offsets: MEDIUM — technique verified, exact % values are Claude's discretion (D-11)
- `.node-version` file behavior: MEDIUM — verified via Cloudflare community + docs page

**Research date:** 2026-04-10
**Valid until:** 2026-07-10 (90 days — CSS spec is stable; Cloudflare build image docs change slowly)
