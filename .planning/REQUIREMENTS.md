# Requirements: Dragos Macsim — Personal Page

**Defined:** 2026-04-09
**Core Value:** Visitors instantly understand who Dragos is — an AI specialist who builds products — and can explore his work and download his CV.

## v1 Requirements

### Identity & Hero

- [ ] **HERO-01**: Hero section displays full name, professional title, and one-line positioning statement
- [ ] **HERO-02**: Hero includes subtle animated micro-interactions
- [ ] **HERO-03**: Hybrid narrative framing — "AI specialist who builds products"

### About

- [ ] **ABOUT-01**: Professional bio summarizing background, current focus, and goals
- [ ] **ABOUT-02**: Current role and education highlights visible

### Experience

- [ ] **EXP-01**: Experience timeline showing roles, companies, dates, and key achievements
- [ ] **EXP-02**: Education section with degrees, institutions, and relevant details
- [ ] **EXP-03**: Skills displayed as categorized lists (no percentage bars)
- [ ] **EXP-04**: Downloadable CV as PDF with candidate-named filename

### Project Showcase

- [ ] **PROJ-01**: mytai card with description, tech stack summary, and link to mytai.uk
- [ ] **PROJ-02**: Structure allows adding more project cards in the future

### Contact

- [ ] **CONT-01**: Contact section with email, LinkedIn, and GitHub links
- [ ] **CONT-02**: Contact reachable from any section (persistent nav or CTA)

### Design System

- [x] **DSGN-01**: Bespoke design system — custom palette, typography, spacing (not template-looking)
- [x] **DSGN-02**: Responsive layout for mobile, tablet, and desktop
- [x] **DSGN-03**: Dark mode with toggle
- [ ] **DSGN-04**: Scroll-reveal animations on sections using Motion library

### SEO & Deployment

- [ ] **SEO-01**: Open Graph meta tags for LinkedIn/social sharing (title, description, image)
- [ ] **SEO-02**: Semantic HTML with proper heading hierarchy and meta description
- [ ] **DEPLOY-01**: Deployed to production on custom domain with HTTPS

## v2 Requirements

### Project Showcase

- **PROJ-03**: Visual mockup or device frame screenshot for mytai
- **PROJ-04**: Case study format (problem → solution → tech → result)

### Content

- **BLOG-01**: Blog or writing section for technical articles
- **BLOG-02**: RSS feed for blog content

### CV Enhancement

- **EXP-05**: Inline PDF viewer using react-pdf (view CV in browser)

### Contact

- **CONT-03**: Contact form with backend (email delivery)

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS or admin panel | Static content is sufficient; no frequent updates needed |
| User accounts / auth | Purely informational site |
| Skills percentage bars | Universally criticized by hiring managers as meaningless |
| AI chatbot | Adds complexity and maintenance burden without value for portfolio |
| Splash screen / loading animation | Delays content access; negative hiring manager perception |
| Multiple pages | Single-page with anchor nav is the correct pattern for this scope |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 1 | Complete |
| DSGN-03 | Phase 1 | Complete |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| ABOUT-01 | Phase 2 | Pending |
| ABOUT-02 | Phase 2 | Pending |
| SEO-01 | Phase 2 | Pending |
| SEO-02 | Phase 2 | Pending |
| EXP-01 | Phase 3 | Pending |
| EXP-02 | Phase 3 | Pending |
| EXP-03 | Phase 3 | Pending |
| EXP-04 | Phase 3 | Pending |
| PROJ-01 | Phase 4 | Pending |
| PROJ-02 | Phase 4 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| DSGN-04 | Phase 5 | Pending |
| DEPLOY-01 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-04-09*
*Last updated: 2026-04-09 after roadmap creation*
