# Phase 5: Animations & Deploy - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 05-animations-deploy
**Areas discussed:** Animation style, Animation approach, Deploy config, Performance budget

---

## Animation Style

### Scroll-reveal effect

| Option | Description | Selected |
|--------|-------------|----------|
| Fade-up | Same as hero — elements fade in while sliding up slightly. Consistent feel across the whole page. | ✓ |
| Fade only | Elements fade from transparent to opaque, no movement. Subtler and less dramatic. | |
| Slide from sides | Alternate sections slide in from left/right. More dynamic but busier. | |

**User's choice:** Fade-up (Recommended)
**Notes:** Consistency with hero animation was the priority.

### Animation intensity

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle | Short distance (15-20px), fast duration (0.4-0.6s). Professional, not flashy — matches the minimal editorial style. | ✓ |
| Moderate | Medium distance (30-40px), medium duration (0.6-0.8s). More noticeable entrance. | |
| Bold | Larger distance (50px+), slower duration (0.8-1s). Dramatic presence, risks feeling heavy. | |

**User's choice:** Subtle (Recommended)
**Notes:** None.

### Child staggering

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, stagger children | Timeline items, skill badges, project card elements animate in sequence. Adds polish — hero already does this. | ✓ |
| No, section as one unit | Entire section fades in at once. Simpler, fewer animations to manage. | |
| You decide | Claude picks based on what works best per section. | |

**User's choice:** Yes, stagger children
**Notes:** None.

---

## Animation Approach

### Implementation method

| Option | Description | Selected |
|--------|-------------|----------|
| CSS-only with scroll-driven | Use CSS @keyframes + animation-timeline: view(). Zero JS, no React islands needed. Graceful degradation for unsupported browsers. | ✓ |
| Motion v12 React islands | Wrap each section in a React island using Motion's whileInView. Consistent with HeroSection but adds React runtime to every section. | |
| Vanilla JS IntersectionObserver | Small inline script adds CSS classes on scroll. Lightweight, full browser support, but manual setup. | |

**User's choice:** CSS-only with scroll-driven (Recommended)
**Notes:** Preserves Astro's zero-JS advantage for static sections.

---

## Deploy Config

### Cloudflare readiness

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, both ready | Cloudflare account exists and domain DNS is already on Cloudflare. | ✓ |
| Account yes, domain not yet | Have Cloudflare account but domain DNS is elsewhere. | |
| Neither yet | Need to set up both from scratch. | |

**User's choice:** Yes, both ready
**Notes:** None.

### Deploy flow

| Option | Description | Selected |
|--------|-------------|----------|
| Git push auto-deploy | Connect GitHub repo to Cloudflare Pages — every push to main auto-builds and deploys. | ✓ |
| Manual CLI deploy | Use wrangler pages deploy to push builds manually. | |
| You decide | Claude picks the simplest approach. | |

**User's choice:** Git push auto-deploy (Recommended)
**Notes:** None.

---

## Performance Budget

### Lighthouse target

| Option | Description | Selected |
|--------|-------------|----------|
| 90+ across all metrics | Performance, Accessibility, Best Practices, SEO all 90+. | |
| 95+ performance focus | Push for near-perfect performance score. | |
| You decide | Claude targets what's reasonable for the stack. | ✓ |

**User's choice:** You decide
**Notes:** Claude's discretion on specific targets.

### JS bundle size

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal JS is the goal | CSS animations for scroll-reveal means only the hero React island ships JS. Keep total JS under 50KB gzipped. | ✓ |
| Not concerned | Ship whatever's needed. | |
| You decide | Claude balances features vs bundle size. | |

**User's choice:** Minimal JS is the goal (Recommended)
**Notes:** None.

---

## Claude's Discretion

- Exact animation-range values for scroll-triggered reveals
- Which children get individual stagger vs group animation
- Stagger delay timing per section
- Cloudflare Pages build configuration details
- Lighthouse optimization priorities

## Deferred Ideas

None — discussion stayed within phase scope.
