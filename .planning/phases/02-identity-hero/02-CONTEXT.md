# Phase 2: Identity & Hero - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Compelling first impression section — hero with animated entrance, about section with bio and highlights, and SEO metadata (OG tags, structured data, semantic HTML). Communicates "AI specialist who builds products" immediately on load.

</domain>

<decisions>
## Implementation Decisions

### Hero Visual Treatment
- **D-01:** Full viewport hero (100dvh) — fills entire screen, visitors scroll to see more content
- **D-02:** Center-aligned text — name, title, tagline, and CTAs all centered on screen
- **D-03:** Soft indigo radial glow behind the name text — consistent with Phase 1 decision D-05 (subtle gradient glow effects)
- **D-04:** Animated scroll indicator (down arrow/chevron) at bottom of hero viewport
- **D-05:** Hero content stack: Name → Title → Tagline → Two CTA buttons ("View my work" as solid indigo primary, "Download CV" as ghost/outlined button)
- **D-06:** "View my work" scrolls to projects section; "Download CV" triggers PDF download of `Dragos Macsim CV 2026.pdf`

### Hero Animation
- **D-07:** Staggered fade-up entrance — name first, then title (+150ms), tagline (+300ms), CTAs (+450ms). Each element fades in while sliding up slightly.
- **D-08:** Gradient glow has a slow subtle pulse animation — opacity or size oscillates over 3-4 second cycle. Adds life without distraction.
- **D-09:** Scroll indicator arrow fades in as part of the staggered entrance sequence, then stays static (no continuous bouncing).
- **D-10:** Use Motion v12 via React island for hero animations — consistent with Phase 5 scroll-reveal approach. Not CSS-only.
- **D-11:** Respect `prefers-reduced-motion` — if enabled, skip all animations and show everything immediately.

### About Section
- **D-12:** Prose bio (2-3 paragraphs, first person, professional-warm tone) + two highlight cards (Current Role, Education)
- **D-13:** Professional headshot photo — use styled placeholder for now (initials circle or silhouette), swap real photo later
- **D-14:** Photo placement: centered at top of About section, above bio text, with highlight cards below the bio
- **D-15:** Two highlight cards only: Current Role (Mindrift) and Education (MSc Bayes, BSc UCL) — matches ABOUT-02 requirements exactly

### SEO & Open Graph
- **D-16:** Meta description: professional + action-oriented tone. Use the existing default from Head.astro as baseline: "Dragos Macsim — AI specialist who builds products. Explore my projects, experience, and download my CV."
- **D-17:** JSON-LD Person structured data — rich search markup for Google
- **D-18:** Proper heading hierarchy: h1 for name in hero, h2 for section titles (About), h3 for subsections

### Claude's Discretion
- OG image approach (static designed vs auto-generated at build) — pick the most practical
- Specific OG image content and design
- JSON-LD schema fields and detail level
- Bio paragraph content (user provided context in PROJECT.md — synthesize from there)
- Highlight card visual treatment (border, background, icon style)
- Placeholder headshot design (initials circle vs silhouette)
- Exact animation easing curves and duration fine-tuning

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Bio content source: Dragos's roles, education, skills, and mytai project context
- `.planning/REQUIREMENTS.md` — HERO-01, HERO-02, HERO-03, ABOUT-01, ABOUT-02, SEO-01, SEO-02 requirements
- `.planning/ROADMAP.md` — Phase 2 success criteria (5 criteria to satisfy)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Phase 1 design decisions (color palette, typography, glow effects, dark mode)

### Technology
- `CLAUDE.md` — Technology stack: Astro 5, React islands, Motion v12, Tailwind v4

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/BaseLayout.astro` — Layout shell with nav bar (theme toggle), max-w-[1100px] container, pt-20 for nav offset
- `src/components/Head.astro` — Meta tags with title/description props, theme detection script
- `src/components/ThemeToggle.astro` — Dark/light toggle (already working)
- `src/styles/global.css` — Full design token system (colors, typography scale, spacing, breakpoints, dark/light modes)

### Established Patterns
- Astro components for static content, React islands for interactive/animated content
- Tailwind v4 with CSS custom properties (`--color-base`, `--color-accent-primary`, etc.)
- Display font size: `clamp(2.5rem, 5vw, 4rem)` for h1
- Body font: `clamp(1rem, 2vw, 1.125rem)`
- Dark mode via `.dark`/`.light` class on `<html>` with 300ms ease transition

### Integration Points
- `src/pages/index.astro` — Current placeholder content will be replaced with hero + about sections
- BaseLayout nav — Currently has only ThemeToggle; nav links may be added in Phase 4 (CONT-02)
- Head.astro — Needs OG meta tags and JSON-LD script added
- CV PDF at project root: `Dragos Macsim CV 2026.pdf` — "Download CV" CTA links here

</code_context>

<specifics>
## Specific Ideas

- Linear/Vercel/Raycast aesthetic carried forward — dark, minimal, gradient glow behind hero name
- Two CTA buttons in hero give immediate action paths: explore work or download CV
- Professional-warm first person bio tone — "I build..." not "Dragos Macsim is..."
- Highlight cards keep the About section scannable for hiring managers who skim

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-identity-hero*
*Context gathered: 2026-04-09*
