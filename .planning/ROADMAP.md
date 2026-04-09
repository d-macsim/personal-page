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
- [ ] **Phase 3: CV & Experience** - Experience timeline, education, skills, and downloadable PDF
- [ ] **Phase 4: Projects & Contact** - mytai showcase card and contact section with persistent nav
- [ ] **Phase 5: Animations & Deploy** - Scroll-reveal animations and production deployment on custom domain

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
**Plans**: TBD
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
**Plans**: TBD
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
**Plans**: TBD
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
**Plans**: TBD
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
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/TBD | Not started | - |
| 2. Identity & Hero | 0/TBD | Not started | - |
| 3. CV & Experience | 0/TBD | Not started | - |
| 4. Projects & Contact | 0/TBD | Not started | - |
| 5. Animations & Deploy | 0/TBD | Not started | - |
