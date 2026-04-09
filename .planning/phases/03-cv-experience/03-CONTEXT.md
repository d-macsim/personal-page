# Phase 3: CV & Experience - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Full professional history browsable on-page — experience timeline with all three roles, education entries, categorized skills display, and a downloadable CV PDF button within the section. This phase fills the core professional content between the hero/about (Phase 2) and the project showcase (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Experience Timeline Layout
- **D-01:** Vertical timeline with left-aligned line and dot markers at each role. Date range on one side, role details (title, company, achievements) on the other. Classic CV pattern — visually distinct from the About section above.
- **D-02:** Timeline line uses `--color-border` (#27272a dark / #e4e4e7 light). Dot markers use `--color-accent-primary` (indigo). Consistent with Phase 1 design tokens.

### Content Depth
- **D-03:** 2-3 concise bullet achievements per role. No prose summaries — bullets only. Scannable for hiring managers, consistent with editorial minimal style.
- **D-04:** Education entries appear in the same vertical timeline below work experience, with a sub-heading separator (e.g. "Education" label). Keeps everything in one continuous flow rather than a separate section.
- **D-05:** Education entries show degree, institution, dates, and relevant details (classification for BSc, track/distinction status for MSc, key modules if space allows).

### Skills Display
- **D-06:** Skills grouped by category (e.g. Languages, Data & ML, Tools & Infrastructure) with each skill rendered as a small badge/chip. Surface bg + border styling from design system tokens.
- **D-07:** No percentage bars anywhere — per EXP-03 and Out of Scope list in REQUIREMENTS.md. Tags/badges are visual but don't imply proficiency levels.

### CV Download
- **D-08:** Prominent download CTA button at the bottom of the CV section (after skills). Visitors who scroll through the full experience get a clear action point without scrolling back to the hero.
- **D-09:** Button style: solid indigo primary (matching hero "View my work" CTA) or ghost style — Claude's discretion on which feels right in context. Downloads `Dragos Macsim CV 2026.pdf`.

### Claude's Discretion
- Exact timeline dot/line sizing and spacing
- Whether timeline dates sit left-aligned or inline with role title
- Skill category groupings (which skills go in which category)
- Education detail level (key modules vs. just classification)
- Section heading treatment ("Experience" vs "CV & Experience" vs just the timeline)
- Responsive behavior — timeline on mobile (line may be hidden, cards stack)
- Whether the download button gets an icon (download arrow) or text-only

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — All role details, education, skills, and CV content source
- `.planning/REQUIREMENTS.md` — EXP-01, EXP-02, EXP-03, EXP-04 requirements for this phase
- `.planning/ROADMAP.md` — Phase 3 success criteria (4 criteria to satisfy)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design tokens, color palette, typography decisions
- `.planning/phases/02-identity-hero/02-CONTEXT.md` — Hero CTA patterns, HighlightCard pattern, animation approach

### Technology
- `CLAUDE.md` — Technology stack: Astro 5, React islands (only for interactive), Tailwind v4

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/HighlightCard.astro` — Card with label/value/detail props, surface bg + border. Could inspire timeline entry cards or skill category containers.
- `src/components/AboutSection.astro` — Section pattern with h2, prose content, grid layout. Template for the CV section structure.
- `src/styles/global.css` — Full design token system (colors, typography, spacing, breakpoints)

### Established Patterns
- Astro components for static content (no React island needed — no interactivity in this section)
- Tailwind v4 with CSS custom properties for all colors and typography
- Section structure: `<section aria-label="...">` with h2, content, max-w container
- `py-16 md:py-24` section padding pattern

### Integration Points
- `src/pages/index.astro` — New CV section component slots after `<AboutSection />`
- CV PDF at `public/Dragos Macsim CV 2026.pdf` — download link target
- Hero "Download CV" ghost button already links to the PDF — section button is a second access point
- Phase 5 will add scroll-reveal animations to this section later

</code_context>

<specifics>
## Specific Ideas

- Vertical timeline gives the section a distinct visual identity vs. the prose About section and the card-based Projects section (Phase 4)
- Tag badges for skills add visual texture without percentage bars — modern and scannable
- Same-timeline education avoids section fragmentation — one continuous professional story
- Download CTA at section end creates a natural funnel: read experience → download full CV

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-cv-experience*
*Context gathered: 2026-04-09*
