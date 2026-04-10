# Phase 5: Animations & Deploy - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

The finished site goes live on a custom domain with HTTPS, and scroll-reveal animations are layered onto every major section (except hero, which already animates). This phase delivers two capabilities: polished scroll-triggered entrance animations and production deployment via Cloudflare Pages.

</domain>

<decisions>
## Implementation Decisions

### Animation Style
- **D-01:** Fade-up scroll-reveal — elements fade in while sliding up slightly, matching the hero entrance pattern (Phase 2 D-07). Consistent feel across the entire page.
- **D-02:** Subtle intensity — short travel distance (15-20px), fast duration (0.4-0.6s). Professional and minimal, consistent with the editorial style (Phase 1 D-04).
- **D-03:** Staggered children within sections — timeline items, skill badges, project card elements animate in sequence with small delays (matching hero's 150ms stagger pattern).

### Animation Approach
- **D-04:** CSS-only scroll-driven animations using `animation-timeline: view()` and `@keyframes`. Zero JavaScript for scroll-reveals — preserves Astro's zero-JS advantage for static sections.
- **D-05:** Graceful degradation — browsers without scroll-driven animation support (Firefox as of April 2026) show content immediately with no animation. No polyfill needed.
- **D-06:** `prefers-reduced-motion: reduce` disables all scroll animations — content renders immediately. Consistent with Phase 2 D-11 and existing `global.css` media query.

### Deployment
- **D-07:** Cloudflare Pages with GitHub auto-deploy — connect repo, push to main triggers build and deploy. Standard CI/CD pipeline.
- **D-08:** Cloudflare account and domain `dragosmacsim.com` already configured — DNS is on Cloudflare, no migration needed.
- **D-09:** Astro static output adapter (default) — no SSR needed. Build command: `npm run build`, output directory: `dist/`.

### Performance
- **D-10:** Minimal JS budget — CSS animations for scroll-reveal means only the hero React island ships JavaScript. Target total JS under 50KB gzipped.
- **D-11:** Lighthouse targets — Claude's discretion on specific scores, but reasonable targets for an Astro static site with minimal JS (90+ achievable across the board).

### Claude's Discretion
- Exact `animation-range` values for scroll-triggered reveals
- Which children within each section get individual stagger vs group animation
- Stagger delay timing per section (can vary by content density)
- Cloudflare Pages build configuration details (headers, redirects if needed)
- Lighthouse optimization priorities

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design & Animation
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design tokens, color palette, editorial minimal style (D-04, D-05)
- `.planning/phases/02-identity-hero/02-CONTEXT.md` — Hero animation pattern (D-07 stagger, D-08 glow pulse, D-10 Motion v12, D-11 reduced motion)
- `src/components/HeroSection.tsx` — Existing Motion v12 animation implementation (reference for consistency)
- `src/styles/global.css` — Existing `prefers-reduced-motion` media query

### Deployment
- `CLAUDE.md` — Technology stack decisions (Cloudflare Pages, Astro 5)
- `astro.config.mjs` — Current config with `site: "https://dragosmacsim.com"`

### Prior Phase Context
- `.planning/phases/03-cv-experience/03-CONTEXT.md` — Timeline, skills grid, CV download button (sections needing scroll-reveal)
- `.planning/phases/04-projects-contact/04-CONTEXT.md` — Project card, contact CTA, nav bar (sections needing scroll-reveal)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `HeroSection.tsx` — Motion v12 React island with staggered fade-up (reference pattern, but scroll-reveals will use CSS instead)
- `global.css` — Already has `prefers-reduced-motion: reduce` media query to extend
- `BaseLayout.astro` — Smooth scroll setup already in place (IntersectionObserver for nav active state)

### Established Patterns
- Static `.astro` components for all non-hero sections (AboutSection, CVSection, ExperienceTimeline, SkillsGrid, ProjectsSection, ContactSection)
- Tailwind v4 utility classes for styling
- Design tokens via CSS custom properties

### Integration Points
- Each section component needs CSS reveal classes applied
- `global.css` is the natural home for `@keyframes` and scroll-driven animation rules
- `astro.config.mjs` may need Cloudflare adapter or static output config adjustments
- `package.json` needs build scripts verified for Cloudflare Pages compatibility

</code_context>

<specifics>
## Specific Ideas

No specific requirements — user confirmed recommended approaches for all areas. Key pattern: match the hero's fade-up + stagger feel but implement via CSS instead of Motion v12 to keep sections zero-JS.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-animations-deploy*
*Context gathered: 2026-04-10*
