# Phase 8: Quality Hardening & Polish - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Raise the site to a measurably high-quality production standard: 100/100/100/100 Lighthouse scores enforced by CI, accessibility audit and fixes, E2E smoke tests in GitHub Actions, prefers-reduced-motion support (already partially done), @media print stylesheet for recruiter printouts, custom branded 404 page, and Astro View Transitions for smooth cross-page navigation.

</domain>

<decisions>
## Implementation Decisions

### Lighthouse strategy
- **D-01:** Hard gate — Lighthouse CI runs in GitHub Actions and PRs fail if any category (Performance, Accessibility, Best Practices, SEO) drops below 100
- **D-02:** Audit both `/` (homepage) and `/now` — covers the main page and the only secondary route

### CI pipeline scope
- **D-03:** GitHub Actions as CI provider
- **D-04:** Four checks run on every push/PR: build+typecheck, vitest unit tests, Playwright E2E smoke, Lighthouse CI
- **D-05:** All four checks run as parallel jobs (not sequential fail-fast) — faster total time, clear per-check status badges

### Print stylesheet
- **D-06:** Clean recruiter printout — hide nav, theme toggle, animations; black text on white; show link URLs inline after anchors; all CV content visible
- **D-07:** Print scope is Claude's discretion — decide whether to print full page or CV-relevant sections based on what serves recruiters best

### Custom 404 page
- **D-08:** 404 tone and design is Claude's discretion — pick between minimal branded or playful personality based on what fits the site's character

### Claude's Discretion
- Print scope: full page vs CV-only (D-07)
- 404 design tone: minimal branded vs playful (D-08)
- Accessibility audit tool choice (axe-core, Pa11y, or Lighthouse a11y alone)
- View Transitions implementation details
- E2E smoke test exact scenarios (must cover: load /, toggle theme, scroll to contact, trigger CV download)
- Exact Lighthouse CI tool (lhci, unlighthouse, or direct CLI)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements are fully captured in decisions above and in ROADMAP.md Phase 8 description.

### Key codebase files
- `src/styles/global.css` — Existing prefers-reduced-motion rules for scroll-reveal and glow-pulse animations (lines 125-176)
- `src/components/HeroSection.tsx` — Uses `useReducedMotion` from Motion/React for hero entrance animations
- `src/layouts/BaseLayout.astro` — Main layout with nav, theme toggle, CF Analytics beacon — print stylesheet targets this
- `src/pages/index.astro` — Homepage (Lighthouse audit target)
- `src/pages/now.astro` — /now page (Lighthouse audit target)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `BaseLayout.astro`: Main layout — 404 page and View Transitions integrate here
- `Head.astro`: Meta tags, OG tags — already well-structured for SEO
- `ThemeToggle.astro`: Dark mode toggle — must be hidden in print
- `global.css`: Already has prefers-reduced-motion for CSS scroll-reveal and glow-pulse

### Established Patterns
- CSS-based scroll-reveal animations (no JS Motion library for scroll — Motion only used in HeroSection React island)
- Astro islands architecture — React only in HeroSection.tsx, everything else is Astro components
- Good aria-label coverage across sections (nav, hero, about, contact)
- Self-hosted fonts via @fontsource

### Integration Points
- `src/pages/404.astro` — new file, uses BaseLayout
- `.github/workflows/ci.yml` — new file, GitHub Actions workflow
- `BaseLayout.astro` — add View Transitions component
- `src/styles/global.css` — add @media print rules
- `package.json` — add Lighthouse CI, axe-core/Pa11y dev dependencies

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. The user wants a comprehensive quality gate that enforces 100/100/100/100 Lighthouse and catches regressions automatically.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-quality-hardening-polish-raise-the-site-to-a-100-100-100-100*
*Context gathered: 2026-04-12*
