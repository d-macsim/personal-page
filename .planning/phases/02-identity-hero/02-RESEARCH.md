# Phase 2: Identity & Hero — Research

**Researched:** 2026-04-09
**Domain:** Hero section, about section, Motion v12 animation, Open Graph / JSON-LD SEO
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Visual Treatment**
- D-01: Full viewport hero (100dvh) — fills entire screen, visitors scroll to see more content
- D-02: Center-aligned text — name, title, tagline, and CTAs all centered on screen
- D-03: Soft indigo radial glow behind the name text — consistent with Phase 1 D-05
- D-04: Animated scroll indicator (down arrow/chevron) at bottom of hero viewport
- D-05: Hero content stack: Name → Title → Tagline → Two CTA buttons ("View my work" solid indigo primary, "Download CV" ghost/outlined amber)
- D-06: "View my work" scrolls to projects section; "Download CV" triggers PDF download of `Dragos Macsim CV 2026.pdf`

**Hero Animation**
- D-07: Staggered fade-up entrance — name first, then title (+150ms), tagline (+300ms), CTAs (+450ms)
- D-08: Gradient glow has a slow subtle pulse animation — opacity oscillates over 3-4 second cycle
- D-09: Scroll indicator fades in as final stagger item, then stays static
- D-10: Use Motion v12 via React island for hero animations
- D-11: Respect `prefers-reduced-motion` — skip all animations and show everything immediately

**About Section**
- D-12: Prose bio (2-3 paragraphs, first person) + two highlight cards (Current Role, Education)
- D-13: Professional headshot photo — use styled placeholder (initials circle "DM") for now
- D-14: Photo placement: centered at top of About section, above bio text, highlight cards below bio
- D-15: Two highlight cards only: Current Role (Mindrift) and Education (MSc Bayes, BSc UCL)

**SEO & Open Graph**
- D-16: Meta description: "Dragos Macsim — AI specialist who builds products. Explore my projects, experience, and download my CV."
- D-17: JSON-LD Person structured data
- D-18: Heading hierarchy: h1 for name in hero, h2 for section titles, h3 for subsections

### Claude's Discretion
- OG image approach (static designed vs auto-generated at build)
- Specific OG image content and design
- JSON-LD schema fields and detail level
- Bio paragraph content (synthesize from PROJECT.md)
- Highlight card visual treatment (border, background, icon style)
- Placeholder headshot design (initials circle vs silhouette)
- Exact animation easing curves and duration fine-tuning

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Hero section displays full name, professional title, and one-line positioning statement | HeroSection.tsx React island with Motion v12 staggered fade-up covers this entirely |
| HERO-02 | Hero includes subtle animated micro-interactions | Motion v12 `motion.div` with `initial/animate/transition` provides staggered entrance + glow pulse |
| HERO-03 | Hybrid narrative framing — "AI specialist who builds products" | Copy contract in UI-SPEC already defines exact hero title and tagline text |
| ABOUT-01 | Professional bio summarizing background, current focus, and goals | Static `AboutSection.astro` with 3-paragraph bio from PROJECT.md context |
| ABOUT-02 | Current role and education highlights visible | Two `HighlightCard.astro` instances (Current Role / Education) |
| SEO-01 | Open Graph meta tags for LinkedIn/social sharing | Extend `Head.astro` with OG/Twitter meta tags + static `/public/og-image.png` |
| SEO-02 | Semantic HTML with proper heading hierarchy and meta description | h1 in hero, h2/h3 in about; `<meta name="description">` already in Head.astro |

</phase_requirements>

---

## Summary

Phase 2 builds on a fully established Phase 1 foundation. The design system, token system, dark/light mode, and BaseLayout are all in place and verified. The phase has two primary surfaces: (1) a React island `HeroSection.tsx` that drives all animated content via Motion v12, and (2) a set of static Astro components for the About section. SEO metadata is applied by extending the existing `Head.astro` component with Open Graph tags and a JSON-LD `<script>` block.

The critical dependency to resolve before writing any animation code is installing the `motion` package — it is specified in CLAUDE.md and the UI-SPEC but is **not yet installed** in `node_modules`. React 19 and `@astrojs/react` are already installed and wired into `astro.config.mjs`. The `motion/react` import path (not `framer-motion`) is the correct path for Motion v12 in React components.

The UI-SPEC (`02-UI-SPEC.md`) is the authoritative visual and interaction contract for this phase. All copy, measurements, color tokens, animation timing, and component names have already been determined. Research confirms that the specified Motion v12 API (`motion.div` with `initial`/`animate`/`transition`), the `useReducedMotion` hook for accessibility compliance, and the OG tag format are all correct and implementable as described.

**Primary recommendation:** Install `motion` package first, then implement `HeroSection.tsx` as a React island using `client:load`, followed by static Astro components for About. Extend `Head.astro` last with OG/JSON-LD before final verification.

---

## Standard Stack

### Core (already installed — verified in package.json)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.5 | Site framework | [VERIFIED: package.json] — Note: installed version is 6.1.5, not 5.x as stated in CLAUDE.md. This is the correct latest stable. |
| @astrojs/react | 5.0.3 | React island integration | [VERIFIED: package.json] — Already wired in astro.config.mjs |
| react + react-dom | 19.2.5 | React runtime for islands | [VERIFIED: package.json + node_modules] |
| tailwindcss + @tailwindcss/vite | 4.2.2 | Utility styling | [VERIFIED: package.json] |
| @fontsource-variable/inter | 5.2.8 | Self-hosted Inter font | [VERIFIED: package.json] |

### Needs Installation

| Library | Version | Purpose | Install Command |
|---------|---------|---------|-----------------|
| motion | 12.38.0 | Hero animations (staggered entrance, glow pulse) | `npm install motion` |

[VERIFIED: npm registry — `npm view motion version` returned `12.38.0`]

### Supporting (Claude's discretion)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None required | — | — | All other phase needs are met by existing packages |

**Installation command (only missing package):**
```bash
npm install motion
```

---

## Architecture Patterns

### Component Structure for Phase 2

```
src/
├── components/
│   ├── Head.astro              ← extend with OG + JSON-LD (already exists)
│   ├── HeroSection.tsx         ← NEW: React island, Motion v12 animations
│   ├── CTAButton.astro         ← NEW: two variants (primary/ghost)
│   ├── AboutSection.astro      ← NEW: static about section shell
│   ├── PhotoPlaceholder.astro  ← NEW: "DM" initials circle
│   └── HighlightCard.astro     ← NEW: reusable card (2 instances)
├── pages/
│   └── index.astro             ← update: replace placeholder with Hero + About
├── styles/
│   └── global.css              ← no changes in Phase 2
└── layouts/
    └── BaseLayout.astro        ← no changes in Phase 2
```

### Pattern 1: React Island for Animated Hero

**What:** `HeroSection.tsx` is a React component rendered as an Astro island with `client:load`. It owns all animation state and Motion v12 `motion.div` elements. Static sections (About) remain as `.astro` files — zero JS shipped for them.

**When to use:** Any component requiring Motion v12 animations, event handlers, or runtime state.

**Example — staggered entrance with prefers-reduced-motion:**
```tsx
// Source: Motion v12 official docs — motion.dev/docs/react-motion-component
// Import path for Motion v12: "motion/react" (NOT "framer-motion")
import { motion, useReducedMotion } from "motion/react";

const shouldReduce = useReducedMotion();

const fadeUp = {
  initial: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

// Each staggered item:
<motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0 }}>
  <h1>Dragos Macsim</h1>
</motion.div>
<motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
  <p>AI Specialist & Product Builder</p>
</motion.div>
```

[VERIFIED: Motion v12 import path `motion/react` confirmed in npm package exports — `motion/react` is the React-specific entry point since rebrand from framer-motion]

### Pattern 2: Astro Island Directive — `client:load`

**What:** Use `client:load` on `HeroSection` so React hydrates immediately on page load. This is correct for above-the-fold interactive content. Use no directive (static) for `AboutSection`, `HighlightCard`, `PhotoPlaceholder`, `CTAButton`.

```astro
<!-- src/pages/index.astro -->
---
import BaseLayout from "../layouts/BaseLayout.astro";
import HeroSection from "../components/HeroSection.tsx";
import AboutSection from "../components/AboutSection.astro";
---

<BaseLayout title="Dragos Macsim — AI Specialist & Product Builder">
  <HeroSection client:load />
  <AboutSection />
</BaseLayout>
```

[ASSUMED: `client:load` is the correct directive for above-fold animated content. `client:visible` is wrong here — the hero is already visible on load so the animation must fire immediately.]

### Pattern 3: Glow Pulse via CSS Keyframes (not Motion)

**What:** The background radial glow pulse (D-08) is purely decorative and does not need React state. Use a CSS `@keyframes` animation defined in a `<style>` block inside HeroSection or in `global.css`. Motion's `animate` prop is suitable too, but CSS keyframes are lighter for an infinite background effect.

**Recommendation:** CSS `@keyframes` approach — avoids JS animation loop overhead for an infinite decorative background:
```css
@keyframes glowPulse {
  0%, 100% { opacity: 0.12; }
  50% { opacity: 0.22; }
}
```

Apply via Tailwind arbitrary value or inline style. Respect `prefers-reduced-motion` with `@media (prefers-reduced-motion: reduce)` that sets the animation to `none`.

[ASSUMED: CSS approach is lighter than Motion for infinite decorative animations with no interactivity]

### Pattern 4: OG Image — Static PNG

**What:** Per Claude's discretion (D, OG image approach), a static pre-designed PNG at `/public/og-image.png` is the most practical approach for a portfolio site. No build-time generation tools needed (Satori, Puppeteer etc. add complexity and dependencies).

**When to use:** Static sites where the OG image never changes per-route.

**Design spec (from UI-SPEC):** 1200×630px, dark background `#0a0a0f`, name "Dragos Macsim" in Inter 700 ~48px white centered, subtitle muted `#71717a` ~24px, soft indigo radial glow. Create with Figma, Canva, or any design tool.

### Pattern 5: JSON-LD Person Schema

```html
<!-- Inside Head.astro — added as static string in frontmatter + set:html -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dragos Macsim",
  "jobTitle": "AI Specialist & Product Builder",
  "url": "https://yourdomain.com",
  "sameAs": [
    "https://linkedin.com/in/dragosmacsim",
    "https://github.com/dragosmacsim"
  ]
})} />
```

[ASSUMED: LinkedIn/GitHub URLs — user must confirm actual profile URLs for sameAs field]

### Anti-Patterns to Avoid

- **`client:visible` on hero:** Hero is above-fold; Motion animations would never fire on initial load since the element is already visible when Astro evaluates intersection
- **Importing from `framer-motion`:** Motion v12 is the `motion` npm package; import from `"motion/react"` not `"framer-motion"` (different package, deprecated)
- **Putting animation logic in `.astro` files:** Astro components are server-rendered; `useState`/`useEffect`/Motion hooks require React runtime — use `.tsx` files with `client:` directive
- **Hero section inside `<main>` container width:** BaseLayout's `<main>` has `max-w-[1100px]` and `pt-20`. The hero must be `100dvh` full-bleed. Either the hero uses negative margins/full-bleed technique or it accepts the container constraint. Decision D-01 specifies 100dvh — verify this is met given BaseLayout's container.

---

## Critical Integration Issue: BaseLayout Container Constraint

**Identified during research:** `BaseLayout.astro` wraps `<slot />` inside `<main class="max-w-[1100px] mx-auto px-4 ... pt-20">`. A full-viewport hero (100dvh) placed inside this container will be constrained to 1100px width, not truly full-bleed.

**Options for planner to address:**
1. Have `HeroSection` break out of the container using negative margins: `-mx-4 md:-mx-8 lg:-mx-12` (matches the padding) and `w-screen` — clunky but avoids changing BaseLayout
2. Move the hero outside `<main>` in `index.astro` by using a layout wrapper that provides the container for non-hero sections only
3. For Phase 2 scope, 100dvh height is honored but max-width constraint means horizontal full-bleed is limited to 1100px — this may be acceptable for a centered design

**Recommendation (Claude's discretion):** The centered, text-only hero design (D-02) does not require horizontal full-bleed — no background image or edge-to-edge visual element that would reveal the constraint. The content centering within 1100px satisfies the design intent. The 100dvh height constraint is implemented via the HeroSection's own CSS (`min-h-[100dvh]`). No layout change needed.

[ASSUMED: the 100dvh design intent is satisfied by applying `min-h-[100dvh]` directly on the hero's outermost element, independent of the parent container's width]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Entrance animations with stagger | Custom CSS animation classes with JS timing | `motion` v12 `motion.div` with `delay` on `transition` | Motion handles RAF scheduling, spring physics, reduced-motion, and browser inconsistencies automatically |
| Reduced motion detection | `window.matchMedia('(prefers-reduced-motion)')` + event listener | `useReducedMotion()` hook from `motion/react` | Built-in, SSR-safe, reactive to OS changes during session |
| OG image generation | Satori / Puppeteer build step | Static pre-designed PNG at `/public/og-image.png` | Zero build complexity for a single static image that never changes |

---

## Common Pitfalls

### Pitfall 1: Wrong Motion Import Path

**What goes wrong:** `import { motion } from "framer-motion"` fails or imports a different package version.
**Why it happens:** Framer Motion was rebranded to `motion` package. `framer-motion` is the old npm package. Both exist on npm but `framer-motion` v12 re-exports from `motion`.
**How to avoid:** Always import from `"motion/react"` — this is the canonical v12 React entry point confirmed in the `motion` package exports.
**Warning signs:** TypeScript type errors on `motion.div`, staggering not working, bundle size unexpectedly large.

### Pitfall 2: React Island Not Hydrating

**What goes wrong:** Animations never fire — page looks like static HTML even though `HeroSection.tsx` is a React component.
**Why it happens:** Forgot `client:load` directive on the component in the `.astro` file.
**How to avoid:** `<HeroSection client:load />` — `client:load` is mandatory for above-fold animated islands.
**Warning signs:** No JS in network tab for the component, React DevTools shows no component tree.

### Pitfall 3: `prefers-reduced-motion` Bypass

**What goes wrong:** Users with vestibular disorders or motion sensitivity still see animations.
**Why it happens:** `useReducedMotion()` is called but its return value is not used to conditionally set `initial` values.
**How to avoid:** When `shouldReduce === true`, set `initial` to the same value as `animate` so no visual change occurs. Test by enabling reduced motion in OS settings.
**Warning signs:** Animations fire even with "Reduce Motion" enabled in macOS/iOS settings.

### Pitfall 4: OG Image Not Surfacing on LinkedIn

**What goes wrong:** LinkedIn post preview shows no image or wrong image.
**Why it happens:** (a) OG image URL is not absolute (must include domain), (b) `og:image:width` / `og:image:height` tags missing, (c) image is not accessible publicly (works locally but fails on LinkedIn's crawler).
**How to avoid:** Use absolute URL for `og:image` — `const ogImageUrl = new URL("/og-image.png", Astro.site).toString()`. Verify `astro.config.mjs` has `site: "https://yourdomain.com"` set. Include width/height meta tags.
**Warning signs:** LinkedIn Card Validator shows no image; OG Debugger shows missing properties.

### Pitfall 5: h1 Appearing Multiple Times

**What goes wrong:** Heading hierarchy validation fails — accessibility tools report multiple `<h1>` elements.
**Why it happens:** `BaseLayout` or `HeroSection` both add an `<h1>` element.
**How to avoid:** Only `HeroSection` contains the `<h1>` (Dragos Macsim). All subsequent section headings use `<h2>`. Verify with browser accessibility tree or `document.querySelectorAll('h1').length`.
**Warning signs:** axe-core accessibility audit reports "Page must contain a level-one heading" violation or multiple h1 detected.

### Pitfall 6: Hero Height Not Full Viewport Due to pt-20 on main

**What goes wrong:** Hero section appears shorter than full viewport because `pt-20` (80px nav offset) is applied to the `<main>` wrapper.
**Why it happens:** BaseLayout sets `pt-20` on `<main>` to prevent content hiding behind the fixed nav. A `min-h-[100dvh]` inside this `<main>` will actually render as `100dvh + 80px` scroll trigger.
**How to avoid:** Apply `min-h-[calc(100dvh-5rem)]` on the hero section (5rem = 80px = pt-20) to account for the nav offset. Or use `min-h-screen` and accept a small visual offset.
**Warning signs:** Scroll indicator is not visible in the initial viewport — user must scroll slightly to see it.

---

## Code Examples

### HeroSection.tsx — Core Structure

```tsx
// Source: Motion v12 docs — motion.dev/docs/react
"use client"; // not needed in Astro islands — omit this

import { motion, useReducedMotion } from "motion/react";

export default function HeroSection() {
  const shouldReduce = useReducedMotion();

  const item = (delay: number) => ({
    initial: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  });

  return (
    <section
      aria-label="Hero"
      className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-5rem)] text-center"
    >
      {/* Glow — CSS animation, not Motion */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="glow-pulse absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%]"
          style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.20) 0%, transparent 70%)" }}
        />
      </div>

      <motion.h1 {...item(0)} className="text-display font-bold">
        Dragos Macsim
      </motion.h1>
      <motion.p {...item(0.15)} className="text-heading text-text-muted mt-4">
        AI Specialist &amp; Product Builder
      </motion.p>
      <motion.p {...item(0.3)} className="text-body max-w-prose mt-4">
        Building intelligent tools at the intersection of AI and product thinking.
      </motion.p>
      <motion.div {...item(0.45)} className="flex gap-4 mt-8 flex-wrap justify-center">
        <a href="#projects" className="btn-primary">View my work</a>
        <a href="/Dragos Macsim CV 2026.pdf" download className="btn-ghost">Download CV</a>
      </motion.div>
      <motion.div {...item(0.6)} aria-label="Scroll to explore" role="img" className="mt-12">
        {/* Chevron-down SVG */}
      </motion.div>
    </section>
  );
}
```

### Head.astro — OG and JSON-LD Extension

```astro
---
// Addition to Head.astro — OG + JSON-LD
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}
const { title, description = "...", ogImage = "/og-image.png" } = Astro.props;
const canonicalUrl = new URL(Astro.url.pathname, Astro.site).toString();
const ogImageAbsolute = new URL(ogImage, Astro.site).toString();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dragos Macsim",
  "jobTitle": "AI Specialist & Product Builder",
  "url": Astro.site?.toString(),
  "sameAs": [
    "https://linkedin.com/in/[CONFIRM_URL]",
    "https://github.com/[CONFIRM_URL]"
  ]
};
---

<!-- Canonical -->
<link rel="canonical" href={canonicalUrl} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:image" content={ogImageAbsolute} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />

<!-- JSON-LD -->
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

Note: `Astro.site` requires `site` property set in `astro.config.mjs`. If not set, OG image URL will be relative and fail LinkedIn's validator.

### CSS Glow Pulse (in global.css or component style)

```css
@keyframes glowPulse {
  0%, 100% { opacity: 0.12; }
  50% { opacity: 0.22; }
}

.glow-pulse {
  animation: glowPulse 4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .glow-pulse {
    animation: none;
    opacity: 0.16; /* static midpoint */
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import from "framer-motion"` | `import from "motion/react"` | Motion v10+ (rebranded) | framer-motion package still works as proxy but motion package is canonical |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin directly | Tailwind v4 / Astro v4+ | No `tailwind.config.js` needed; CSS-first config via `@theme` block — already implemented in Phase 1 |
| Astro `<ViewTransitions />` for animations | Motion v12 per-component | Astro v4→v5 | View Transitions are page-level; Motion handles component-level entrances |
| OG image generation (Satori) | Static PNG | Always valid for portfolio | Satori needed only when OG images are dynamic per-route |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `client:load` is the correct Astro island directive for above-fold animated hero | Architecture Patterns | If wrong: animations may not fire or may be delayed; fix by testing alternative directives |
| A2 | CSS `@keyframes` approach for glow pulse is lighter than Motion animate for infinite decorative animations | Architecture Patterns | If wrong: choose Motion `animate` prop instead — both approaches work, performance difference is minor at this scale |
| A3 | Hero's 100dvh intent is satisfied with `min-h-[calc(100dvh-5rem)]` to account for pt-20 nav offset | Common Pitfalls | If wrong: scroll indicator may be off-screen; adjust calculation |
| A4 | LinkedIn/GitHub sameAs URLs for JSON-LD need confirmation from user | Code Examples | If wrong: structured data points to wrong profiles |
| A5 | `astro.config.mjs` needs `site` property set for absolute OG image URLs | Code Examples | If wrong: OG image will be relative path and fail social crawlers; planner must add `site` config task |

---

## Open Questions

1. **Dragos's social profile URLs for JSON-LD sameAs**
   - What we know: PROJECT.md mentions LinkedIn and GitHub as contact surfaces but does not list URLs
   - What's unclear: Exact LinkedIn/GitHub profile slugs
   - Recommendation: Planner should add a task to confirm URLs and add them as constants in a `src/data/profile.ts` file

2. **`site` property in astro.config.mjs**
   - What we know: `astro.config.mjs` currently has no `site` property set
   - What's unclear: The final production domain to use
   - Recommendation: Add `site: "https://placeholder.com"` for development; update at Phase 5 deployment. OG absolute URL construction depends on this.

3. **OG image creation**
   - What we know: UI-SPEC specifies design: dark bg, centered name, indigo glow, 1200×630px
   - What's unclear: Whether the user wants to create this manually or if a code-generated placeholder is acceptable
   - Recommendation: Create a minimal code-generated placeholder (a simple dark PNG with text) using a one-time Node script, or use Figma to export the spec. Either works for Phase 2.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build system | Yes | >=22.12.0 (engines requirement) | — |
| astro | Framework | Yes | 6.1.5 (in node_modules) | — |
| react / react-dom | React islands | Yes | 19.2.5 (in node_modules) | — |
| @astrojs/react | Astro-React bridge | Yes | 5.0.3 (in node_modules) | — |
| tailwindcss / @tailwindcss/vite | Styling | Yes | 4.2.2 (in node_modules) | — |
| motion | Hero animations | **No** | Not installed | CSS-only animations (partial — loses Motion spring API) |
| `Dragos Macsim CV 2026.pdf` | "Download CV" CTA | Yes | Present in `/public/` | — |
| OG image PNG | SEO-01 | **No** | Needs to be created and placed at `/public/og-image.png` | Omit og:image tag (degrades LinkedIn preview to text-only) |

**Missing dependencies with no fallback:**
- `motion` npm package — hero animation requirement (HERO-02) cannot be met without it

**Missing dependencies with fallback:**
- `og-image.png` — LinkedIn preview degrades to text-only without it, but OG tags still function

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | `vitest.config.ts` (uses `getViteConfig` from astro) |
| Quick run command | `npm test` (runs `vitest run`) |
| Full suite command | `npm test && npm run test:e2e` (Playwright) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-01 | Hero file exists with h1 containing "Dragos Macsim" | unit (static analysis) | `npm test` | No — Wave 0 |
| HERO-02 | HeroSection.tsx imports and uses `motion/react` | unit (static analysis) | `npm test` | No — Wave 0 |
| HERO-03 | Hero file contains "AI Specialist" framing text | unit (static analysis) | `npm test` | No — Wave 0 |
| ABOUT-01 | AboutSection.astro exists with bio paragraph content | unit (static analysis) | `npm test` | No — Wave 0 |
| ABOUT-02 | HighlightCard instances for "Current Role" and "Education" exist | unit (static analysis) | `npm test` | No — Wave 0 |
| SEO-01 | Head.astro contains og:title, og:description, og:image meta tags | unit (static analysis) | `npm test` | No — Wave 0 |
| SEO-02 | index.astro / Head.astro has meta description; h1→h2→h3 hierarchy exists in source | unit (static analysis) | `npm test` | No — Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** `npm test && npm run test:e2e` — all green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/hero-section.test.ts` — covers HERO-01, HERO-02, HERO-03 (static file analysis pattern matching Phase 1 test style)
- [ ] `tests/about-section.test.ts` — covers ABOUT-01, ABOUT-02
- [ ] `tests/seo-metadata.test.ts` — covers SEO-01, SEO-02
- [ ] `motion` package must be installed before any `.tsx` tests that import it
- [ ] `astro.config.mjs` needs `site` property before OG absolute URL tests pass

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in Phase 2 |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | No access control |
| V5 Input Validation | No | No user input — static content only |
| V6 Cryptography | No | No secrets or encryption |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `set:html` XSS via JSON-LD | Tampering | JSON-LD content is hardcoded static string — no user input. `JSON.stringify()` escapes characters. Low risk. |
| PDF download path traversal | Tampering | `href="/Dragos Macsim CV 2026.pdf" download` — static path, no dynamic parameter. No risk. |

**Security assessment:** Phase 2 is static content with no user input, no forms, no auth, no API calls. Security posture is essentially zero attack surface. Only minor XSS consideration in `set:html` usage for JSON-LD is mitigated by static hardcoded content.

---

## Sources

### Primary (HIGH confidence)
- `package.json` (project root) — verified installed packages and versions
- `src/styles/global.css` — verified all design tokens, color values, typography scale, breakpoints
- `src/layouts/BaseLayout.astro` — verified container structure, nav height (h-14 = 3.5rem), padding
- `src/components/Head.astro` — verified existing meta tag structure
- `.planning/phases/02-identity-hero/02-UI-SPEC.md` — authoritative visual/interaction contract
- `.planning/phases/02-identity-hero/02-CONTEXT.md` — all 18 locked decisions
- `npm view motion version` — confirmed Motion 12.38.0 is latest stable

### Secondary (MEDIUM confidence)
- Motion v12 import path `motion/react` — confirmed via npm package exports field structure
- `astro.config.mjs` — verified React integration and Tailwind Vite plugin wiring

### Tertiary (LOW confidence — flagged in Assumptions Log)
- Animation performance comparison (CSS keyframes vs Motion for infinite decorative animations) — training knowledge, not benchmarked

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against package.json and npm registry
- Architecture: HIGH — patterns derived directly from Phase 1 established code and UI-SPEC contract
- Animation API: HIGH — Motion v12 import path verified via npm package structure
- Pitfalls: MEDIUM — baseLayout container constraint identified by code analysis; animation pitfalls from training knowledge
- SEO patterns: HIGH — OG and JSON-LD patterns are well-established web standards

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable stack — Astro, Motion, Tailwind all semver stable)
