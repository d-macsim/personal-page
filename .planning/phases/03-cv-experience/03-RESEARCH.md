# Phase 3: CV & Experience - Research

**Researched:** 2026-04-09
**Domain:** Static Astro components — vertical timeline, skill badges, PDF download
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Vertical timeline — left-aligned line with dot markers. Date range one side, role details (title, company, achievements) the other.
- **D-02:** Timeline line color: `--color-border`. Dot markers: `--color-accent-primary` (indigo).
- **D-03:** 2-3 concise bullet achievements per role. No prose summaries.
- **D-04:** Education entries in the same vertical timeline below work, separated by a "Education" sub-heading label.
- **D-05:** Education shows degree, institution, dates, classification/distinction status, key modules if space allows.
- **D-06:** Skills grouped by category, each skill as a small badge/chip using surface bg + border tokens.
- **D-07:** No percentage bars anywhere. Tags/badges are visual only — no proficiency implication.
- **D-08:** Prominent download CTA at bottom of CV section (after skills).
- **D-09:** Button style — solid indigo primary OR ghost: Claude's discretion.

### Claude's Discretion

- Exact timeline dot/line sizing and spacing
- Whether timeline dates sit left-aligned or inline with role title
- Skill category groupings (which skills belong in which category)
- Education detail level (key modules vs. just classification)
- Section heading treatment ("Experience" vs "CV & Experience" vs timeline-only)
- Responsive behavior on mobile (line may be hidden, cards stack)
- Whether download button gets a download-arrow icon or is text-only

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP-01 | Experience timeline — roles, companies, dates, key achievements | Timeline layout pattern; Astro static component; TypeScript data file for roles |
| EXP-02 | Education section — degrees, institutions, relevant details | Same vertical timeline component reused with education data; sub-heading separator pattern |
| EXP-03 | Skills as categorized lists (no percentage bars) | Badge/chip component pattern; grouped display via TypeScript data categories |
| EXP-04 | Downloadable CV PDF with candidate-named filename | `<a href="/Dragos Macsim CV 2026.pdf" download>` — PDF already in `/public/` |
</phase_requirements>

---

## Summary

Phase 3 is entirely static Astro — no React island required. The section consists of three sub-components rendered at build time from a TypeScript data file: a vertical timeline (shared for experience and education entries), a skills badge grid, and a download CTA button. All styling uses the existing design token system from Phase 1 (`--color-border`, `--color-accent-primary`, `--color-surface`).

The PDF download is the simplest requirement: the file `Dragos Macsim CV 2026.pdf` already lives in `/public/`, so a plain `<a href="/Dragos Macsim CV 2026.pdf" download="Dragos Macsim CV 2026.pdf">` handles EXP-04 with zero additional infrastructure. No `react-pdf` is needed here — that is deferred to EXP-05 (v2).

The vertical timeline pattern is pure CSS: a left-side border acting as the spine, positioned `::before` pseudo-element or a simple `<div>` for the dot marker at each entry, and a two-column layout (date | content) that collapses to single-column on mobile. This is a standard, well-understood pattern requiring no external library.

**Primary recommendation:** Build a single `CVSection.astro` containing three child components (`ExperienceTimeline.astro`, `SkillsGrid.astro`, `CVDownloadButton.astro`), fed by a single `src/data/cv.ts` TypeScript data file. No React, no animation library (Phase 5 will add scroll-reveal later).

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.17.x | Static component rendering | Already installed; zero-JS output for static content [VERIFIED: codebase] |
| TypeScript | 5.x (built-in) | Data file type safety | Already configured in project [VERIFIED: codebase] |
| Tailwind CSS v4 | 4.2.x | Utility classes for layout and spacing | Already installed via @tailwindcss/vite [VERIFIED: codebase] |

### No New Dependencies

This phase introduces zero new packages. All three requirements (timeline, skill badges, PDF download) are achievable with:
- HTML/CSS via Tailwind utilities
- Existing design tokens from `global.css`
- An `<a download>` attribute (native browser feature)

[VERIFIED: codebase — PDF already in `/public/Dragos Macsim CV 2026.pdf`]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure CSS timeline | A timeline library (e.g. react-chrono) | No benefit — adds React island + JS weight for a static layout problem |
| `<a download>` | react-pdf (EXP-05) | react-pdf is for inline viewing, deferred to v2; download link is the v1 requirement |
| TypeScript data file | Hardcoded JSX strings | Data file makes content editable without touching component markup |

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── CVSection.astro          # Top-level section wrapper (new)
│   ├── ExperienceTimeline.astro # Vertical timeline — experience + education entries (new)
│   ├── SkillsGrid.astro         # Categorized badge display (new)
│   ├── CVDownloadButton.astro   # Download CTA (new)
│   ├── AboutSection.astro       # Existing — Phase 2
│   ├── HighlightCard.astro      # Existing — reusable card pattern
│   └── HeroSection.tsx          # Existing — Phase 2 React island
├── data/
│   └── cv.ts                    # All CV content: roles, education, skills (new)
├── pages/
│   └── index.astro              # Add <CVSection /> after <AboutSection />
└── styles/
    └── global.css               # Existing — no changes needed
```

### Pattern 1: TypeScript Data File (`src/data/cv.ts`)

**What:** All content (roles, education, skills) defined as typed TypeScript objects. Components import and render from this data. This is the established project architecture (per STATE.md: "content in TypeScript data files").

**When to use:** Any time content is static but structured — avoids hardcoding strings in component markup and keeps content editable without touching layout code.

```typescript
// src/data/cv.ts
// [ASSUMED] — pattern consistent with stated architecture decisions in STATE.md

export interface Role {
  title: string;
  company: string;
  dateRange: string;
  achievements: string[]; // 2-3 items per D-03
}

export interface EducationEntry {
  degree: string;
  institution: string;
  dateRange: string;
  detail: string; // classification or distinction status
  modules?: string[]; // optional key modules per D-05
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const roles: Role[] = [
  {
    title: "AI Specialist",
    company: "Mindrift",
    dateRange: "Feb 2026 – Present",
    achievements: [
      "Automated web scraping and data extraction pipelines for AI training datasets",
      "AI/human hybrid QA workflows for model output evaluation",
      "Cross-functional collaboration on data quality standards",
    ],
  },
  {
    title: "Data Analyst",
    company: "Scale AI",
    dateRange: "Nov 2024 – Nov 2025",
    achievements: [
      "Benchmarked text-to-image models across quality, coherence, and instruction-following metrics",
      "Applied RAG techniques to improve conversational AI evaluation pipelines",
      "Evaluated model outputs for alignment, safety, and factual accuracy",
    ],
  },
  {
    title: "Guest Relations Manager",
    company: "London House Hotel",
    dateRange: "May 2023 – Present",
    achievements: [
      "Built Python automations reducing manual reporting time by significant margin",
      "Maintained Excel-based operational reporting dashboards",
    ],
  },
];

export const education: EducationEntry[] = [
  {
    degree: "MSc Business Analytics",
    institution: "Bayes Business School, City, University of London",
    dateRange: "2024 – 2026",
    detail: "On track for distinction",
    modules: ["Network Analytics", "Deep Learning", "ML", "Revenue Management"],
  },
  {
    degree: "BSc Information Management for Business",
    institution: "University College London (UCL)",
    dateRange: "2022 – 2025",
    detail: "Upper second class honours (2:1)",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages & Data",
    skills: ["Python", "R", "SQL", "Excel"],
  },
  {
    category: "AI & ML",
    skills: ["RAG", "LLM Evaluation", "Deep Learning", "BeautifulSoup", "Selenium"],
  },
  {
    category: "Tools & Infrastructure",
    skills: ["Tableau", "Docker", "Ubuntu Server", "Git"],
  },
];
```

### Pattern 2: Vertical Timeline (Pure CSS)

**What:** A CSS-only vertical timeline using a left-side border as the spine and a pseudo-element or small `<div>` for the dot. No library needed.

**When to use:** Static, non-interactive timeline display where no animation is required at this phase.

```astro
---
// ExperienceTimeline.astro
// [ASSUMED] — standard CSS timeline pattern, no external source needed
import type { Role, EducationEntry } from "../data/cv.ts";

interface Props {
  roles: Role[];
  education: EducationEntry[];
}
const { roles, education } = Astro.props;
---

<div class="relative">
  <!-- Spine line -->
  <div
    class="absolute left-4 top-0 bottom-0 w-px"
    style="background-color: var(--color-border);"
  />

  <!-- Experience entries -->
  {roles.map((role) => (
    <div class="relative pl-12 pb-10">
      <!-- Dot marker -->
      <div
        class="absolute left-3 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-1/2"
        style="background-color: var(--color-accent-primary);"
      />
      <span
        class="text-xs font-medium uppercase tracking-wide"
        style="color: var(--color-text-muted);"
      >
        {role.dateRange}
      </span>
      <h3
        class="font-semibold mt-0.5"
        style="color: var(--color-text);"
      >
        {role.title}
        <span style="color: var(--color-text-muted);" class="font-normal"> · {role.company}</span>
      </h3>
      <ul class="mt-2 space-y-1 list-disc list-inside">
        {role.achievements.map((a) => (
          <li style="color: var(--color-text-muted);" class="text-sm leading-relaxed">
            {a}
          </li>
        ))}
      </ul>
    </div>
  ))}

  <!-- Education sub-heading separator -->
  <div class="relative pl-12 pb-4">
    <h3
      class="text-xs font-semibold uppercase tracking-widest"
      style="color: var(--color-text-muted);"
    >
      Education
    </h3>
  </div>

  <!-- Education entries (same pattern) -->
  {education.map((entry) => (
    <div class="relative pl-12 pb-10">
      <div
        class="absolute left-3 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-1/2"
        style="background-color: var(--color-accent-primary);"
      />
      <span class="text-xs font-medium uppercase tracking-wide" style="color: var(--color-text-muted);">
        {entry.dateRange}
      </span>
      <h3 class="font-semibold mt-0.5" style="color: var(--color-text);">
        {entry.degree}
        <span style="color: var(--color-text-muted);" class="font-normal"> · {entry.institution}</span>
      </h3>
      <p class="text-sm mt-1" style="color: var(--color-text-muted);">{entry.detail}</p>
      {entry.modules && (
        <p class="text-xs mt-1" style="color: var(--color-text-muted);">
          Modules: {entry.modules.join(", ")}
        </p>
      )}
    </div>
  ))}
</div>
```

### Pattern 3: Skill Badge/Chip

**What:** A small pill-shaped `<span>` using surface background and border tokens. Consistent with HighlightCard styling.

```astro
<!-- SkillsGrid.astro — [ASSUMED] pattern -->
{skillCategories.map((cat) => (
  <div class="mb-6">
    <h3 class="text-xs font-semibold uppercase tracking-widest mb-3"
        style="color: var(--color-text-muted);">
      {cat.category}
    </h3>
    <div class="flex flex-wrap gap-2">
      {cat.skills.map((skill) => (
        <span
          class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
          style="background-color: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
))}
```

### Pattern 4: PDF Download Button

**What:** Native `<a>` with `download` attribute — triggers browser save dialog with the specified filename. No JavaScript needed.

```astro
<!-- CVDownloadButton.astro — [VERIFIED: MDN download attribute] -->
<a
  href="/Dragos Macsim CV 2026.pdf"
  download="Dragos Macsim CV 2026.pdf"
  class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
  style="background-color: var(--color-accent-primary); color: white;"
>
  Download CV
</a>
```

The `download` attribute on `<a>` causes the browser to download the file rather than navigate to it. The attribute value sets the suggested filename. This is a Level 4 HTML attribute supported in all modern browsers. [ASSUMED: MDN-documented standard; no verification tool used but this is fundamental HTML]

### Pattern 5: Section Wrapper (`CVSection.astro`)

**What:** Mirrors `AboutSection.astro` structure — `<section aria-label="...">`, h2, max-w container, `py-16 md:py-24` padding.

```astro
<!-- CVSection.astro -->
---
import ExperienceTimeline from "./ExperienceTimeline.astro";
import SkillsGrid from "./SkillsGrid.astro";
import CVDownloadButton from "./CVDownloadButton.astro";
import { roles, education, skillCategories } from "../data/cv.ts";
---

<section id="experience" aria-label="Experience and CV" class="py-16 md:py-24">
  <h2 class="font-semibold mb-12" style="font-size: var(--font-size-heading);">
    Experience
  </h2>

  <div class="max-w-2xl">
    <ExperienceTimeline roles={roles} education={education} />
  </div>

  <div class="max-w-2xl mt-16">
    <h2 class="font-semibold mb-8" style="font-size: var(--font-size-heading);">
      Skills
    </h2>
    <SkillsGrid categories={skillCategories} />
  </div>

  <div class="mt-12">
    <CVDownloadButton />
  </div>
</section>
```

### Anti-Patterns to Avoid

- **React island for static content:** The entire CV section is static markup. No React island is needed or appropriate. Adding `client:load` here would ship unnecessary JavaScript.
- **Percentage skill bars:** Explicitly out of scope per EXP-03 and REQUIREMENTS.md. Any `<progress>`, `<meter>`, or width-percentage `<div>` bar is forbidden.
- **Inline content in component:** All text content must live in `src/data/cv.ts`, not hardcoded in component markup — per established project architecture.
- **Separate Education section:** Education must live in the same timeline flow as experience (D-04), not as a separate `<section>`.
- **New CSS variables:** Phase 1 design tokens cover all needs. Do not introduce new custom properties.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF display in-browser | Custom canvas renderer | react-pdf (v2/EXP-05) | PDF.js complexity is immense; deferred to next version anyway |
| Timeline animation | Custom scroll listener + class toggling | Motion v12 (Phase 5) | Phase 5 explicitly owns scroll-reveal; build layout without it now |
| PDF generation | @react-pdf/renderer | Use existing PDF | The PDF already exists — no generation needed |

**Key insight:** EXP-04 requires download, not inline viewing. The `<a download>` attribute solves the entire requirement in one line of HTML. react-pdf (inline viewing) is EXP-05, explicitly deferred to v2.

---

## Common Pitfalls

### Pitfall 1: Timeline dot misalignment

**What goes wrong:** The dot marker doesn't align with the spine line when using `position: absolute` because the parent's padding affects the offset calculation.

**Why it happens:** The spine `<div>` is positioned relative to the section container, but the dot is positioned relative to the entry `<div>` that has left-padding.

**How to avoid:** Place the spine as an `absolute` child of the outer wrapper (not the entry). Place the dot as `absolute` on the entry but calculate its `left` value relative to the padding edge (e.g. `left-3` with `pl-12` on the entry content, where `left-3` = 12px and the dot is 10px wide with `-translate-x-1/2` to center on the spine).

**Warning signs:** If dots appear left of the line or misaligned at different viewport widths, the offset math is wrong.

### Pitfall 2: PDF download blocked by browser

**What goes wrong:** The browser navigates to the PDF instead of downloading it, especially on iOS Safari.

**Why it happens:** iOS Safari ignores the `download` attribute for cross-origin files. Since the PDF is served from the same origin (Cloudflare Pages), this is not an issue. However, if the PDF path is ever moved to a CDN or different origin, this breaks.

**How to avoid:** Keep the PDF in `/public/` so it is same-origin. Do not move it to an external URL. [ASSUMED — iOS Safari cross-origin behavior is well-documented but not verified via tool in this session]

### Pitfall 3: Timeline mobile collapse

**What goes wrong:** The two-column timeline layout (dates left | content right) breaks on narrow screens.

**Why it happens:** The date column takes horizontal space; on 320px screens there is insufficient width.

**How to avoid:** On mobile, collapse to a single column with the date appearing as a small label above the role title. Use responsive Tailwind classes: `hidden sm:block` for a side-date column, and a visible date `<span>` above the heading on mobile.

### Pitfall 4: Missing `id` anchor for nav linking

**What goes wrong:** Future navigation (Phase 4/5) can't link to `#experience` because no `id` is set on the section.

**How to avoid:** Add `id="experience"` to the `<section>` element in `CVSection.astro` from the start. Costs nothing, prevents rework.

### Pitfall 5: Skill category data drift

**What goes wrong:** Skills listed in PROJECT.md don't match what appears on-screen because they were hardcoded differently in two places.

**How to avoid:** `src/data/cv.ts` is the single source of truth. The content defined there must exactly match PROJECT.md source data. Do not paraphrase skills or add/remove without PROJECT.md as reference.

---

## Code Examples

### Section integration in `index.astro`

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import HeroSection from "../components/HeroSection.tsx";
import AboutSection from "../components/AboutSection.astro";
import CVSection from "../components/CVSection.astro";
---

<BaseLayout title="Dragos Macsim -- AI Specialist & Product Builder">
  <HeroSection client:load />
  <AboutSection />
  <CVSection />
</BaseLayout>
```

[VERIFIED: matches existing `index.astro` pattern — codebase read]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-pdf for PDF download | `<a download>` for download, react-pdf for inline view only | EXP-05 deferred to v2 | No library needed for v1 |
| Framer Motion import | `motion/react` import | 2024 rebrand | Already adopted in Phase 2 — no change here |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `src/data/cv.ts` as a data file matches stated architecture pattern ("content in TypeScript data files" from STATE.md) | Architecture Patterns | Low — this is explicitly stated in STATE.md decisions |
| A2 | iOS Safari `download` attribute only works same-origin | Pitfall 2 | Low for v1 (PDF in /public/ is same-origin); relevant only if PDF ever moves to CDN |
| A3 | Role achievement bullet content is accurate — synthesized from PROJECT.md context | Pattern 1 code example | Medium — actual wording should be reviewed/approved by user. Achievements described in PROJECT.md are high-level and the bullets are Claude's synthesis |
| A4 | Skill category groupings (Languages & Data / AI & ML / Tools & Infrastructure) are reasonable | Pattern 1 code example | Low risk to implementation; exact groupings are Claude's discretion per CONTEXT.md |
| A5 | `<h2>` is appropriate for both "Experience" and "Skills" headings within the CV section | Pattern 5 | Low — heading hierarchy should be reviewed to ensure `<h2>` doesn't duplicate the section-level heading. May need `<h3>` for Skills if Experience is already `<h2>` |

---

## Open Questions (RESOLVED)

1. **Exact achievement bullet wording** — RESOLVED: Synthesized from PROJECT.md; user reviews in `src/data/cv.ts`
   - What we know: PROJECT.md has high-level role descriptions (company, dates, domain)
   - Recommendation: Use synthesized bullets from PROJECT.md content as a draft; user should review and revise in `src/data/cv.ts` before or after first render

2. **Heading hierarchy in CVSection** — RESOLVED: Both Experience and Skills as `<h2>` siblings
   - What we know: `<h2>` is used for section titles throughout the site (AboutSection, HeroSection pattern)
   - Recommendation: Both "Experience" and "Skills" as `<h2>` — they are peer sections within the same page, consistent with the established pattern. "Education" uses a styled `<div>` or `<p>` label (not a heading) to avoid over-heading the timeline.

3. **Download button style (ghost vs solid)** — RESOLVED: Solid indigo primary
   - What we know: D-09 leaves this to Claude's discretion. The hero has solid ("View my work") and ghost ("Download CV") CTA pair.
   - Recommendation: Use solid indigo primary — at the bottom of the experience section, the download is the primary conversion action. Ghost is appropriate in the hero where "View my work" is the primary CTA. Two solid buttons at different points in the page is acceptable.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 3 is purely code/config changes with no external dependencies beyond the already-installed project tooling. The PDF already exists in `/public/`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright or static file analysis (project uses static analysis tests per STATE.md) |
| Config file | Not established for Phase 3 — Wave 0 gap |
| Quick run command | `npx astro build && node tests/phase3-static.mjs` (TBD) |
| Full suite command | Same (no separate slow suite for static analysis) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EXP-01 | Timeline renders all 3 roles with title, company, dates, 2+ achievements | Static HTML analysis | Inspect built HTML for role data strings | Wave 0 gap |
| EXP-02 | Education section shows both degrees with institution + dates | Static HTML analysis | Inspect built HTML for education strings | Wave 0 gap |
| EXP-03 | No `<progress>`, `<meter>`, or width-percentage bar elements | Static HTML analysis (negative assertion) | Grep built HTML for forbidden elements | Wave 0 gap |
| EXP-04 | Download link has correct `href` and `download` attribute with correct filename | Static HTML analysis | Inspect `<a download>` attribute value | Wave 0 gap |

### Sampling Rate

- **Per task commit:** Build check — `npx astro build`
- **Per wave merge:** Full static analysis suite
- **Phase gate:** All 4 requirements verified before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/phase3-static.mjs` — static HTML analysis covering EXP-01 through EXP-04
- [ ] Verify test runner approach matches Phase 1/2 test patterns (STATE.md notes "Static file analysis tests" as the established pattern)

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static page, no auth |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Public content |
| V5 Input Validation | no | No user input in this section |
| V6 Cryptography | no | No secrets |

**No security concerns for this phase.** The CV section is static public content. The PDF is a public file served from `/public/`. No user data is collected, no forms, no APIs.

---

## Sources

### Primary (HIGH confidence)
- Codebase read — `src/styles/global.css`, `src/components/HighlightCard.astro`, `src/components/AboutSection.astro`, `src/pages/index.astro`, `/public/` directory listing
- `.planning/phases/03-cv-experience/03-CONTEXT.md` — locked decisions
- `.planning/STATE.md` — established architecture decisions (TypeScript data files pattern)
- `.planning/PROJECT.md` — CV content source (roles, education, skills)

### Secondary (MEDIUM confidence)
- HTML `download` attribute — MDN-documented standard; not verified via tool but universal browser support is well-established [ASSUMED with high confidence]

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all tools already in project
- Architecture: HIGH — follows established patterns explicitly stated in STATE.md and codebase
- Content accuracy: MEDIUM — role achievements are synthesized from PROJECT.md brief descriptions; exact wording needs user review
- Pitfalls: HIGH — CSS timeline alignment and PDF download gotchas are standard, well-understood problems

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable stack, no fast-moving dependencies)
