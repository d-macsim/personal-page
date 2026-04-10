# Phase 4: Projects & Contact - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

mytai project showcase card with visual device mockup, contact section with CTA messaging and icon links, and persistent section navigation in the existing nav bar. Completes the browsable site content before Phase 5 adds animations and deploys.

</domain>

<decisions>
## Implementation Decisions

### mytai Card Presentation
- **D-01:** Feature card layout with device frame mockup on the left and project details on the right. Large, visually prominent — the card IS the section (single featured project).
- **D-02:** Styled device frame placeholder with gradient/brand colors and mytai logo text. Designed to be swapped for a real screenshot later.
- **D-03:** Tech stack displayed as badge chips (same style as skills badges in Phase 3) — React Native, Expo, On-device AI, etc.
- **D-04:** Working link to mytai.uk as a CTA button within the card.
- **D-05:** Structure supports adding more project cards in the future (PROJ-02) — use a grid/list layout that works with one card now and scales to multiple.

### Claude's Discretion (mytai Card)
- Description depth and content (tagline only vs tagline + feature bullets — pick what fits the editorial style and card layout)
- Device frame placeholder design details (gradient colors, dimensions)
- Card background treatment (surface color, subtle border, or transparent)

### Navigation Design
- **D-06:** Nav bar gets section anchor links: About, Experience, Projects, Contact — plus existing ThemeToggle on the right.
- **D-07:** Mobile: hamburger menu collapses all section links into a toggle dropdown/slide-out. ThemeToggle stays visible.
- **D-08:** Active section highlighting — as user scrolls, the nav link for the currently visible section gets a visual indicator (underline, color change, or similar). Requires Intersection Observer or scroll listener.
- **D-09:** Smooth scroll behavior when clicking nav links (scroll-behavior: smooth or Motion-powered).

### Contact Section Style
- **D-10:** Dedicated CTA section with heading ("Get in touch" or similar), a short inviting message, and icon links for email, LinkedIn, and GitHub.
- **D-11:** Center-aligned layout, consistent with the editorial minimal style and hero section alignment.
- **D-12:** External links (LinkedIn, GitHub) open in new tabs with `target="_blank" rel="noopener noreferrer"`. Email uses `mailto:` link.
- **D-13:** Icon links use recognizable icons (envelope for email, LinkedIn logo, GitHub logo) with text labels.

### Claude's Discretion (Contact & Nav)
- Exact CTA message wording
- Icon source (inline SVG, Astro Icon, or similar)
- Nav link typography treatment (weight, size, spacing)
- Active state visual treatment (underline, accent color, opacity)
- Hamburger menu animation and overlay style
- Whether nav includes the name/logo on the left side

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — mytai description, contact details, social links
- `.planning/REQUIREMENTS.md` — PROJ-01, PROJ-02, CONT-01, CONT-02 requirements for this phase
- `.planning/ROADMAP.md` — Phase 4 success criteria (4 criteria to satisfy)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design tokens, color palette, dual accent system, editorial style
- `.planning/phases/02-identity-hero/02-CONTEXT.md` — Hero CTA patterns, HighlightCard component, center-aligned layout
- `.planning/phases/03-cv-experience/03-CONTEXT.md` — Skills badge styling, section structure pattern, timeline component

### Technology
- `CLAUDE.md` — Technology stack: Astro 5, React islands (only for interactive), Tailwind v4, Motion v12

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/HighlightCard.astro` — Card with label/value/detail props, surface bg + border. Reference for card styling patterns.
- `src/components/SkillsGrid.astro` — Badge/chip styling for tech stack tags on the project card.
- `src/components/CVDownloadButton.astro` — CTA button pattern for the project link button.
- `src/layouts/BaseLayout.astro` — Nav bar with ThemeToggle — needs to be extended with section links and hamburger menu.

### Established Patterns
- Astro components for static content, React islands only for interactive/animated content
- Section structure: `<section aria-label="...">` with h2, max-w-[1100px] container, `py-16 md:py-24` padding
- Tailwind v4 with CSS custom properties for all colors and typography
- Dark mode via `.dark`/`.light` class toggle with 300ms ease transition

### Integration Points
- `src/pages/index.astro` — New ProjectsSection and ContactSection slot after `<CVSection />`
- `src/layouts/BaseLayout.astro` — Nav bar needs section links added and mobile hamburger menu
- Hero "View my work" button (Phase 2 D-06) scrolls to projects section — section needs matching `id` attribute
- Each section needs an `id` for nav anchor links (about, experience, projects, contact)

</code_context>

<specifics>
## Specific Ideas

- Feature card with device frame mockup gives mytai visual prominence — it's the main project and deserves showcase treatment
- Styled placeholder for the device frame means no dependency on having a real screenshot — can be swapped later
- Full section nav (About, Experience, Projects, Contact) transforms the site from a scrollable page into a navigable single-page app
- Active section highlighting adds polish and orientation for visitors
- Contact section as a CTA zone (not just footer links) gives the page an intentional ending and clear call to action

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-projects-contact*
*Context gathered: 2026-04-10*
