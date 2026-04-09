# Phase 1: Foundation - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Astro 5 project scaffold with a bespoke design system: custom color palette, typography tokens, spacing scale, dark/light mode with toggle, and responsive layout foundations. All subsequent phases build on the visual language established here.

</domain>

<decisions>
## Implementation Decisions

### Color Palette & Mood
- **D-01:** Dark & premium aesthetic — dark backgrounds (#0a0a0f base), light text (#e4e4e7), conveying technical sophistication. Reference direction: Linear, Vercel, Raycast.
- **D-02:** Indigo/violet primary accent (#6366f1) for links, navigation, and interactive elements. Hover state: #818cf8, pressed: #4f46e5.
- **D-03:** Dual accent system — indigo primary + amber secondary (#f59e0b) for CTAs and badges. Total ~8 design tokens for the palette.

### Overall Design Aesthetic
- **D-04:** Minimal editorial style — clean layouts with generous whitespace, strong typography hierarchy, content-focused rather than decoration-focused.
- **D-05:** Subtle gradient glow effects for visual interest — soft radial gradients behind hero, faint glow on accent elements. No heavy decoration or glassmorphism.

### Dark Mode Behavior
- **D-06:** Dark theme by default on first visit. System preference (prefers-color-scheme) respected on first visit; user toggle overrides and persists via localStorage.
- **D-07:** Toggle placement: top-right navigation corner, sun/moon icon. Standard, unobtrusive.
- **D-08:** Light mode uses inverted tokens — same indigo/amber accents but backgrounds flip to light (#fafafa bg, #ffffff surface, #e4e4e7 border). Text flips to #18181b. Accent colors slightly darkened for contrast (indigo: #4f46e5, amber: #d97706).
- **D-09:** Smooth 300ms ease CSS transition on background and text colors when switching themes.
- **D-10:** Gradient glow effects in light mode use adapted lighter/pastel versions of indigo and amber (not hidden — same effects, different color intensity).

### Typography
- **D-11:** Inter as the single font family throughout the site. Self-hosted via @fontsource (no Google CDN).
- **D-12:** Three weights loaded: 400 (regular), 600 (semibold), 700 (bold). Differentiation via weight and size, not font family.
- **D-13:** 18px base body text on desktop with 1.7 line-height. Scales to 16px / 1.6 line-height on mobile. Max prose width ~680px.

### Claude's Discretion
- Specific hex values for muted text, surface, and border tokens in light mode (provided previews are directional, not locked)
- Heading size scale (H1-H3 specific px values)
- Spacing scale values
- Tailwind v4 theme configuration approach
- Responsive breakpoint strategy

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above. Key project files:

### Project Context
- `.planning/PROJECT.md` — Project vision, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — Full requirements list with traceability (DSGN-01, DSGN-02, DSGN-03 map to this phase)
- `.planning/ROADMAP.md` — Phase definitions and success criteria
- `CLAUDE.md` — Technology stack decisions (Astro 5, Tailwind v4, React islands, Motion v12, @fontsource)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. All patterns established in this phase.

### Established Patterns
- None yet. This phase ESTABLISHES the patterns all subsequent phases follow.

### Integration Points
- CV PDF exists at project root: `Dragos Macsim CV 2026.pdf` — will need to be placed in a public/assets directory during scaffold.

</code_context>

<specifics>
## Specific Ideas

- Linear/Vercel aesthetic as the reference direction — dark, minimal, gradient glow
- Dual accent (indigo + amber) gives the site more personality than pure monochrome while staying professional
- Editorial minimal layout: content breathes, lots of whitespace, strong type hierarchy does the heavy lifting

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-09*
