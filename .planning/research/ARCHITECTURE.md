# Architecture Patterns

**Domain:** Personal portfolio / CV website
**Researched:** 2026-04-09
**Confidence:** HIGH (Next.js + single-page anchor approach is well-established, verified via official Next.js docs and multiple practitioner sources)

---

## Recommended Architecture

**Single-page application with anchor-based section navigation**, built with Next.js (App Router), TypeScript, and Tailwind CSS. All primary content lives on one scrollable page (`/`). The CV PDF is served as a static asset with a direct download link. No dynamic routes are needed for v1.

```
Browser
  └── Next.js App (static export or Vercel SSG)
        ├── Single page: / (app/page.tsx)
        │     ├── Section: Hero / Introduction
        │     ├── Section: About
        │     ├── Section: Experience (CV)
        │     ├── Section: Skills
        │     ├── Section: Projects (mytai)
        │     └── Section: Contact
        ├── Layout: app/layout.tsx (Nav + Footer shell)
        └── Static asset: /public/cv.pdf (downloadable)
```

### Why single-page over multi-page

For a portfolio of this scope (one featured project, CV content, contact), a single scrollable page is the industry standard. It eliminates routing complexity, keeps the user experience fluid, and is easier to animate with scroll-triggered reveals. Multi-page routing should only be introduced when a new project warrants its own dedicated case study page.

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `Navbar` | Sticky top nav with anchor links, mobile hamburger menu | Scrolls to `Section` elements via anchor hrefs |
| `HeroSection` | Name, headline, CTA buttons (CV download, contact) | Links to `/public/cv.pdf` and `#contact` anchor |
| `AboutSection` | Bio, professional identity, photo | Self-contained, static content |
| `ExperienceSection` | Timeline of roles and education from CV | Self-contained, static content |
| `SkillsSection` | Tech skills grid / tag list | Self-contained, static content |
| `ProjectsSection` | mytai showcase card(s) with description, visuals, link | External link to mytai.uk |
| `ContactSection` | Email, LinkedIn, GitHub links | External links only (no form server needed) |
| `Footer` | Copyright, social links repeat | Self-contained |
| `AnimationWrapper` | Framer Motion scroll-reveal wrapper (reusable) | Wraps any section or card component |
| `PDFDownloadButton` | `<a href="/cv.pdf" download>` styled button | `HeroSection` and optionally `ExperienceSection` |

### Component hierarchy

```
app/layout.tsx
  ├── Navbar
  └── children (page slot)
        └── app/page.tsx
              ├── HeroSection
              │     └── PDFDownloadButton
              ├── AboutSection
              ├── ExperienceSection
              │     └── PDFDownloadButton (secondary placement)
              ├── SkillsSection
              ├── ProjectsSection
              │     └── ProjectCard (mytai)
              └── ContactSection
Footer (inside layout.tsx)
```

---

## Data Flow

This site has no server-side data fetching and no database. All content is authored directly in component files or a collocated `content/` data layer.

```
Source of truth: TypeScript constant files (content/experience.ts, content/projects.ts, etc.)
        |
        v
Section components read typed data directly (no fetch, no API)
        |
        v
Rendered as static HTML at build time (Next.js static export or ISR)
        |
        v
Browser receives fully-rendered HTML + client-side hydration for animations
```

### PDF flow

```
/public/cv.pdf  (committed to repo or uploaded separately)
        |
        v
<a href="/cv.pdf" download> in PDFDownloadButton
        |
        v
Browser triggers file download — no server logic needed
```

### External link flow

```
ProjectCard (mytai) → href="https://mytai.uk" target="_blank"
ContactSection links → mailto:, linkedin.com, github.com
```

No data flows inward from external services in v1.

---

## Patterns to Follow

### Pattern 1: Content-as-data (typed constants)

Keep content out of JSX. Author experience entries, skill lists, and project metadata as typed TypeScript objects in a `content/` or `lib/data/` directory. Components receive this as props or import it directly.

**Why:** Separates concerns, makes future edits a data change not a component edit, enables easy addition of new projects later without touching layout code.

```typescript
// content/experience.ts
export const experience: ExperienceEntry[] = [
  {
    role: "AI Specialist",
    company: "Mindrift",
    period: "Feb 2026–present",
    bullets: ["Automated web scraping", "AI/human hybrid QA"],
  },
  // ...
]
```

### Pattern 2: Scroll-reveal with Framer Motion `whileInView`

Wrap section content in a `motion.div` with `whileInView` and `viewport={{ once: true }}`. Do not reach for Intersection Observer manually — Framer Motion's `whileInView` is simpler and sufficient.

```typescript
// components/AnimationWrapper.tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {children}
</motion.div>
```

### Pattern 3: Anchor navigation with `scroll={false}`

Navbar links use Next.js `<Link href="#section-id" scroll={false}>` and CSS `scroll-behavior: smooth` on `html`. This avoids Next.js overriding smooth scroll by jumping to top.

```css
/* globals.css */
html {
  scroll-behavior: smooth;
}
```

### Pattern 4: Static asset for PDF

Place `cv.pdf` in `/public/`. Next.js serves everything in `/public/` at the root URL. No API route needed.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Server Components fetching remote content

**What:** Fetching CV data from a CMS, headless API, or Google Docs at build time.
**Why bad:** Adds external dependency, build fragility, and complexity for zero benefit. Content changes rarely; a static file edit and redeploy is faster than a CMS integration.
**Instead:** Static TypeScript data files. Redeploy when content changes.

### Anti-Pattern 2: Separate routes for each CV section

**What:** `/experience`, `/skills`, `/projects` as distinct Next.js pages.
**Why bad:** Breaks the single-page browsing experience, requires managing navigation state between pages, loses smooth scroll storytelling.
**Instead:** Single `app/page.tsx` with anchor IDs on each section.

### Anti-Pattern 3: Heavy animation on every element

**What:** Staggered Framer Motion animations on every list item, heading, paragraph.
**Why bad:** Perceived jank on slower devices, cumulative layout shift risk, distracts from content.
**Instead:** Animate at the section level only. One entrance animation per section. Reserve micro-animations for interactive elements (hover states, button clicks).

### Anti-Pattern 4: Inline `style` for theming

**What:** Hardcoded hex colors or font sizes in component JSX.
**Why bad:** Makes design changes require touching every file.
**Instead:** Use Tailwind CSS design tokens (configured in `tailwind.config.ts`) for all color, spacing, and typography decisions.

---

## Build Order (Phase Dependency Map)

The following order respects component dependencies and enables incremental verification at each step:

```
Phase 1: Project scaffold
  └── Next.js + TypeScript + Tailwind + Framer Motion setup
  └── app/layout.tsx shell (Navbar placeholder + Footer)
  └── app/page.tsx with section stubs and anchor IDs
  └── globals.css with smooth scroll + design tokens

Phase 2: Content data layer
  └── content/experience.ts
  └── content/skills.ts
  └── content/projects.ts (mytai)
  └── TypeScript types for each content shape

Phase 3: Core sections (no animation yet)
  └── HeroSection (depends on: nothing)
  └── AboutSection (depends on: nothing)
  └── ExperienceSection (depends on: content/experience.ts)
  └── SkillsSection (depends on: content/skills.ts)
  └── ProjectsSection + ProjectCard (depends on: content/projects.ts)
  └── ContactSection (depends on: nothing)

Phase 4: Navigation
  └── Navbar with anchor links (depends on: section anchor IDs existing)
  └── Mobile responsive hamburger menu
  └── Active section highlight (optional, via IntersectionObserver)

Phase 5: CV PDF download
  └── /public/cv.pdf placed
  └── PDFDownloadButton component
  └── Integrated into HeroSection and ExperienceSection

Phase 6: Animations and polish
  └── AnimationWrapper component
  └── Applied to each section
  └── Hover states on ProjectCard, buttons, links
  └── Final responsive QA (mobile breakpoints)

Phase 7: Deployment
  └── Vercel project created
  └── Custom domain DNS configured
  └── Environment verified (no secrets needed for static site)
```

**Key dependency rule:** Phases 3–5 can partially overlap. Navigation (Phase 4) only requires anchor IDs to exist, not final section content. PDF download (Phase 5) is entirely independent of Phase 3–4 and can be dropped in at any point.

---

## Scalability Considerations

| Concern | v1 (now) | Future (multiple projects) |
|---------|----------|---------------------------|
| Project showcase | Single `ProjectCard` in `ProjectsSection` | Extract `content/projects.ts` entries; map over array. No layout change needed |
| New CV entries | Edit `content/experience.ts` | Same pattern, no component changes |
| Case study pages | Not needed | Add `app/projects/[slug]/page.tsx` route; link from `ProjectCard` |
| Blog | Out of scope | Add `app/blog/` route group separately; no impact on existing structure |
| Contact form | Links only in v1 | Replace `ContactSection` links with a form component; add API route or use Formspree/Resend |

---

## Sources

- Next.js App Router official docs: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js smooth scroll with anchor links: https://mariogiancini.com/implementing-smooth-scroll-behavior-with-tailwind-css-and-nextjs
- Framer Motion `whileInView` docs: https://motion.dev/docs/react-scroll-animations
- Next.js `scroll={false}` anchor issue: https://github.com/vercel/next.js/issues/51721
- Vercel portfolio templates (reference patterns): https://vercel.com/templates/portfolio
- Portfolio section best practices (2026): https://www.sitebuilderreport.com/inspiration/personal-websites
- Scroll animation patterns 2025-2026: https://blog.logrocket.com/react-scroll-animations-framer-motion/
