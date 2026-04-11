# Roadmap: Dragos Macsim — Personal Page

## Overview

The site is built in five phases: first the design system and project scaffold give every subsequent phase a consistent visual language; then the identity narrative and hero section establish the first impression; the CV content fills the core professional information; the project showcase and contact section complete the browsable site; finally scroll-reveal animations are layered in and the site is deployed to production on a custom domain.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Astro project scaffold and bespoke design system (palette, typography, dark mode)
- [ ] **Phase 2: Identity & Hero** - Narrative framing, hero section, about section, and SEO metadata
- [x] **Phase 3: CV & Experience** - Experience timeline, education, skills, and downloadable PDF (completed 2026-04-09)
- [x] **Phase 4: Projects & Contact** - mytai showcase card and contact section with persistent nav (completed 2026-04-10)
- [x] **Phase 5: Animations & Deploy** - Scroll-reveal animations and production deployment on custom domain (completed 2026-04-10)

## Phase Details

### Phase 1: Foundation
**Goal**: A running Astro project with a bespoke design system is in place and all subsequent phases can build on a consistent visual language
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03
**Success Criteria** (what must be TRUE):
  1. The Astro dev server starts with no errors and renders a blank page using the project's custom font and colour palette
  2. The design system defines custom tokens (colour, spacing, typography) that are applied site-wide via Tailwind CSS v4 theme configuration
  3. A dark mode toggle exists in the UI and switching it changes the site appearance immediately without a page reload
  4. The layout is visually correct on mobile (320px), tablet (768px), and desktop (1280px) viewports
**Plans:** 2 plans
Plans:
- [x] 01-01-PLAN.md — Scaffold Astro project, install dependencies, define complete design token system
- [x] 01-02-PLAN.md — Build layout shell, Head/ThemeToggle components, tests, and visual verification
**UI hint**: yes

### Phase 2: Identity & Hero
**Goal**: Visitors see a compelling first impression that communicates who Dragos is — AI specialist and product builder — with an about section and proper SEO metadata in place
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, ABOUT-01, ABOUT-02, SEO-01, SEO-02
**Success Criteria** (what must be TRUE):
  1. The hero section shows Dragos's full name, professional title, and a one-line positioning statement that frames him as an AI specialist who builds products
  2. The hero includes at least one subtle animated micro-interaction (e.g. text fade-in, cursor blink, or element entrance) that plays on load
  3. The about section contains a professional bio, current role highlight, and education highlight visible without scrolling past it
  4. Pasting the site URL into LinkedIn's post composer surfaces the correct Open Graph title, description, and image
  5. The page HTML has a logical heading hierarchy (h1 → h2 → h3) and a populated meta description tag
**Plans:** 2 plans
Plans:
- [x] 02-01-PLAN.md — Install Motion v12, create animated HeroSection React island with staggered entrance and glow pulse
- [x] 02-02-PLAN.md — Build About section components, extend Head.astro with OG/JSON-LD metadata, visual verification
**UI hint**: yes

### Phase 3: CV & Experience
**Goal**: Visitors can browse Dragos's full professional history on-page and download his CV as a named PDF
**Depends on**: Phase 2
**Requirements**: EXP-01, EXP-02, EXP-03, EXP-04
**Success Criteria** (what must be TRUE):
  1. An experience timeline lists all three roles with company name, date range, and at least two key achievements each
  2. An education section shows both degrees with institution, dates, and relevant details (classification, key modules)
  3. Skills are displayed as categorised lists — no percentage bars anywhere on the page
  4. Clicking the CV download link downloads a file named "Dragos Macsim CV 2026.pdf" directly to the user's device
**Plans:** 2/2 plans complete
Plans:
- [x] 03-01-PLAN.md — CV data file and experience/education timeline component with page integration
- [x] 03-02-PLAN.md — Skills grid, download button, complete CVSection, and static analysis tests
**UI hint**: yes

### Phase 4: Projects & Contact
**Goal**: Visitors can explore the mytai project and reach Dragos through email, LinkedIn, and GitHub from anywhere on the page
**Depends on**: Phase 3
**Requirements**: PROJ-01, PROJ-02, CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. A mytai project card shows a description, tech stack summary, and a working link that opens mytai.uk
  2. The projects section markup supports adding additional project cards without restructuring the layout
  3. A contact section lists email, LinkedIn, and GitHub as clickable links
  4. A persistent navigation element (sticky nav or section CTAs) gives access to the contact section from any scroll position
**Plans:** 2/2 plans complete
Plans:
- [x] 04-01-PLAN.md — Project data files, mytai showcase card, contact CTA section, and page integration
- [x] 04-02-PLAN.md — Nav bar upgrade with section anchors, hamburger menu, active state, tests, and visual verification
**UI hint**: yes

### Phase 5: Animations & Deploy
**Goal**: The finished site is live on a custom domain with HTTPS and scroll-reveal animations make section entrances feel polished
**Depends on**: Phase 4
**Requirements**: DSGN-04, DEPLOY-01
**Success Criteria** (what must be TRUE):
  1. Each major section (hero excluded — it already animates) reveals with a scroll-triggered entrance animation powered by Motion v12
  2. Animations do not block content access — sections are fully readable if JavaScript is disabled or the animation has not yet triggered
  3. The site loads correctly at the custom domain over HTTPS with no browser security warnings
  4. Cloudflare Pages build completes without errors and subsequent pushes to main auto-deploy
**Plans:** 2/2 plans complete
Plans:
- [x] 05-01-PLAN.md — CSS scroll-reveal animations on all non-hero sections with @supports fallback and reduced-motion support
- [x] 05-02-PLAN.md — Cloudflare Pages deployment with .node-version, security headers, and custom domain setup
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Planning complete | - |
| 2. Identity & Hero | 0/2 | Planning complete | - |
| 3. CV & Experience | 2/2 | Complete   | 2026-04-09 |
| 4. Projects & Contact | 2/2 | Complete   | 2026-04-10 |
| 5. Animations & Deploy | 2/2 | Complete   | 2026-04-10 |
| 6. Layout Polish | 1/1 | Complete   | 2026-04-10 |

### Phase 6: Layout polish — side-by-side experience and education, timeline dot and bar alignment fixes

**Goal:** Experience and Education display in a two-column side-by-side layout on desktop with corrected timeline dot-spine alignment
**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03
**Depends on:** Phase 5
**Success Criteria** (what must be TRUE):
  1. Experience and Education render side-by-side in two equal columns on viewports >= 768px
  2. Timeline dots are visually centered on the spine bar (both positioned at left-4 = 16px)
  3. Mobile layout stacks columns vertically with no regression from current behaviour
  4. Each column has its own independent spine bar, dot markers, and stagger animation
**Plans:** 1/1 plans complete

Plans:
- [x] 06-01-PLAN.md — Create TimelineColumn.astro, refactor CVSection to two-column grid, fix dot alignment, update tests

### Phase 7: Discoverability & Social Presence — make the site discoverable and shareable. Scope: (1) SEO fundamentals: add @astrojs/sitemap for sitemap.xml, robots.txt, JSON-LD Person schema on homepage, proper per-page meta description/title. (2) Cloudflare Web Analytics: wire the beacon into BaseLayout (cookieless, no GDPR banner). (3) /now page: lightweight nownownow.com-style current-focus page listing what Dragos is working on right now, linked from nav. (4) Per-page OG images: build-time generation via Satori / @vercel/og so each page (homepage, /now, future case studies) gets a branded social card. Goal: recruiters can Google Dragos, find the site, share it, and see real traffic analytics.

**Goal:** Recruiters can Google Dragos and find the site, share it (branded OG cards on every page), see real cookieless traffic, and visit a /now page describing current focus. SEO fundamentals (sitemap, robots.txt, extended JSON-LD Person), Cloudflare Web Analytics beacon, /now page, and per-page OG image generation are all live in production.
**Requirements**: SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, ANALYTICS-01, NOW-01, NOW-02, NOW-03, NOW-04, NOW-05, OG-01, OG-02, OG-03, OG-04, OG-05, OG-06
**Depends on:** Phase 6
**Plans:** 5 plans

Plans:
- [ ] 07-01-PLAN.md — Wave 0: install sitemap/satori/resvg/non-variable Inter deps, update astro.config.mjs, type PUBLIC_CF_ANALYTICS_TOKEN, scaffold six phase7 test files
- [ ] 07-02-PLAN.md — Wave 1: public/robots.txt + Head.astro extended Person JSON-LD + ogImageSlug prop + og:image:alt meta
- [ ] 07-03-PLAN.md — Wave 1: /now page + BaseLayout nav Now link + hash-only scroll guard + active-route setter + CF Web Analytics beacon (PROD-guarded)
- [ ] 07-04-PLAN.md — Wave 1: src/lib/og-image.ts (Satori+resvg helper) + src/pages/og/[slug].png.ts endpoint with compile-time slug allowlist (T-7-06)
- [ ] 07-05-PLAN.md — Wave 2: wire index.astro ogImageSlug="home", full build+vitest+playwright gate, user visual verification checkpoint

### Phase 8: Quality Hardening & Polish — raise the site to a 100/100/100/100 production standard with CI guardrails. Scope: (1) Accessibility audit and fixes using axe-core or Pa11y: keyboard navigation, visible focus rings, colour contrast on theme toggle, alt text on profile photo and project icons. (2) Performance budget with Lighthouse CI targeting 100/100/100/100 across Performance, Accessibility, Best Practices, SEO — budget file committed to repo. (3) E2E smoke test in CI: Playwright test that loads /, triggers CV download, toggles theme, scrolls to contact section — wired to GitHub Actions on push/PR. (4) prefers-reduced-motion support on hero entrance animation and any Motion islands — honour user setting. (5) @media print stylesheet: hide nav and theme toggle, black text, show URLs — clean recruiter printouts. (6) Custom branded 404 page matching site design instead of Astro default. (7) Astro 5 <ViewTransitions /> for smooth cross-page navigation once additional routes exist. Goal: site is measurably high-quality, accessible, and regression-proof via CI.

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 8 to break down)
