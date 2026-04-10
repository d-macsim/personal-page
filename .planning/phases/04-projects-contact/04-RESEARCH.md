# Phase 4: Projects & Contact - Research

**Researched:** 2026-04-10
**Domain:** Astro SPA sections — project showcase card, contact CTA section, sticky nav with anchor links and active state
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### mytai Card Presentation
- **D-01:** Feature card layout with device frame mockup on the left and project details on the right. Large, visually prominent — the card IS the section (single featured project).
- **D-02:** Styled device frame placeholder with gradient/brand colors and mytai logo text. Designed to be swapped for a real screenshot later.
- **D-03:** Tech stack displayed as badge chips (same style as skills badges in Phase 3) — React Native, Expo, On-device AI, etc.
- **D-04:** Working link to mytai.uk as a CTA button within the card.
- **D-05:** Structure supports adding more project cards in the future (PROJ-02) — use a grid/list layout that works with one card now and scales to multiple.

#### Navigation Design
- **D-06:** Nav bar gets section anchor links: About, Experience, Projects, Contact — plus existing ThemeToggle on the right.
- **D-07:** Mobile: hamburger menu collapses all section links into a toggle dropdown/slide-out. ThemeToggle stays visible.
- **D-08:** Active section highlighting — as user scrolls, the nav link for the currently visible section gets a visual indicator (underline, color change, or similar). Requires Intersection Observer or scroll listener.
- **D-09:** Smooth scroll behavior when clicking nav links (scroll-behavior: smooth or Motion-powered).

#### Contact Section Style
- **D-10:** Dedicated CTA section with heading ("Get in touch" or similar), a short inviting message, and icon links for email, LinkedIn, and GitHub.
- **D-11:** Center-aligned layout, consistent with the editorial minimal style and hero section alignment.
- **D-12:** External links (LinkedIn, GitHub) open in new tabs with `target="_blank" rel="noopener noreferrer"`. Email uses `mailto:` link.
- **D-13:** Icon links use recognizable icons (envelope for email, LinkedIn logo, GitHub logo) with text labels.

### Claude's Discretion

- Description depth and content on mytai card (tagline only vs tagline + feature bullets)
- Device frame placeholder design details (gradient colors, dimensions)
- Card background treatment (surface color, subtle border, or transparent)
- Exact CTA message wording for contact section
- Icon source (inline SVG, Astro Icon, or similar)
- Nav link typography treatment (weight, size, spacing)
- Active state visual treatment (underline, accent color, opacity)
- Hamburger menu animation and overlay style
- Whether nav includes the name/logo on the left side

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROJ-01 | mytai card with description, tech stack summary, and link to mytai.uk | ProjectCard component with device frame placeholder, badge chips (SkillsGrid pattern), CTA button (CVDownloadButton pattern) |
| PROJ-02 | Structure allows adding more project cards in the future | Grid container that works with 1 card and scales — `grid-cols-1 md:grid-cols-2` pattern deferred by empty space |
| CONT-01 | Contact section with email, LinkedIn, and GitHub links | ContactSection component with mailto + external links, inline SVG icons (established pattern from ThemeToggle) |
| CONT-02 | Contact reachable from any section (persistent nav or CTA) | BaseLayout nav upgrade with anchor links, Intersection Observer active state, hamburger menu for mobile |

</phase_requirements>

---

## Summary

Phase 4 adds three connected features: a mytai project showcase section, a contact CTA section, and a fully navigable sticky nav bar. All three build directly on patterns already established in Phases 1–3. The project is using Astro 6.1.5 (not 5 as CLAUDE.md specifies — the installed version is newer), with Tailwind v4.2.2, Motion v12.38.0, and React 19.2.5 as React islands.

The nav upgrade (D-06 through D-09) is the most technically involved piece: it requires converting the current right-only ThemeToggle bar into a full navigation component with section links, an Intersection Observer for active state, smooth scroll, and a hamburger menu. This is an interactive component and warrants a React island or a pure-Astro approach with `<script>` tags. Given the ThemeToggle is already a pure Astro component using `<script>`, and the nav interactivity (toggle open/close, active tracking) is modest, a pure Astro component with a scoped `<script>` block is the lightest approach — no React needed.

The projects and contact sections are entirely static Astro components following the established section pattern from Phases 2 and 3.

**Primary recommendation:** Three new Astro components (ProjectsSection, ContactSection, and an upgraded Nav in BaseLayout), a `src/data/projects.ts` data file for mytai content, and no new npm packages required.

---

## Standard Stack

### Core — Already Installed

| Library | Installed Version | Purpose | Status |
|---------|-----------------|---------|--------|
| Astro | 6.1.5 [VERIFIED: package.json] | Site framework | In use |
| TypeScript | 5.x (via Astro) [VERIFIED: package.json] | Type safety | In use |
| Tailwind CSS | 4.2.2 [VERIFIED: package.json] | Utility-first styling | In use |
| Motion | 12.38.0 [VERIFIED: package.json] | Animations (React islands only) | In use — Phase 5 will animate this section |
| React | 19.2.5 [VERIFIED: package.json] | React islands | In use |

### No New Packages Required

Phase 4 needs zero new npm installs. All capabilities are already present:
- Icons: inline SVG (established pattern in ThemeToggle and CVDownloadButton — no icon library needed)
- Intersection Observer: native Web API, no library
- Smooth scroll: CSS `scroll-behavior: smooth` or native `scrollIntoView` — no library
- Contact links: plain HTML anchors with `mailto:` and `target="_blank"` — no library

**Installation:**
```bash
# Nothing to install — all dependencies are already in package.json
```

---

## Architecture Patterns

### Recommended Component Structure

```
src/
├── components/
│   ├── ProjectsSection.astro     # Section wrapper + grid container
│   ├── ProjectCard.astro         # Individual project card (device frame + details)
│   ├── ContactSection.astro      # Contact CTA section
│   └── BaseLayout.astro          # MODIFIED: add nav links + hamburger
├── data/
│   ├── cv.ts                     # EXISTING — unchanged
│   └── projects.ts               # NEW: typed project content
└── pages/
    └── index.astro               # MODIFIED: add ProjectsSection + ContactSection
```

### Pattern 1: Section Structure (Established — Must Follow Exactly)

Every section in the codebase follows this pattern [VERIFIED: src/components/CVSection.astro, AboutSection.astro]:

```astro
---
// imports
---
<section
  aria-label="Projects"
  id="projects"
  class="py-16 md:py-24"
>
  <div class="max-w-[1100px] mx-auto">
    <h2>Projects</h2>
    <!-- content -->
  </div>
</section>
```

The `id` attribute is critical — HeroSection already has `href="#projects"` pointing to this section [VERIFIED: src/components/HeroSection.tsx line 74].

Required section `id` attributes for Phase 4:
- `id="projects"` — already referenced by hero CTA
- `id="contact"` — new, for nav anchor
- `id="about"` — must be verified to exist on AboutSection
- `id="experience"` — already exists on CVSection [VERIFIED: src/components/CVSection.astro]

### Pattern 2: TypeScript Data File (Established — Mirror cv.ts)

All content lives in typed data files; components only render structure [VERIFIED: src/data/cv.ts, STATE.md decision log]:

```typescript
// src/data/projects.ts
export interface TechBadge {
  label: string;
}

export interface Project {
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly techStack: readonly TechBadge[];
  readonly url: string;
  readonly urlLabel: string;
}

export const projects: readonly Project[] = [
  {
    title: "mytai",
    tagline: "Your AI personal trainer",
    description: "An all-in-one AI personal trainer app built with React Native and Expo. Combat sports form analysis using on-device AI, gym workout logging, calorie tracking, weight tracking, and mobility exercises — privacy-first with on-device processing.",
    bullets: [
      "On-device AI form analysis for combat sports — no data leaves your device",
      "Full workout logging: gym sessions, calorie tracking, weight tracking",
      "iOS available now — Android coming soon",
    ],
    techStack: [
      { label: "React Native" },
      { label: "Expo" },
      { label: "On-device AI" },
      { label: "TypeScript" },
      { label: "iOS" },
    ],
    url: "https://mytai.uk",
    urlLabel: "Visit mytai.uk",
  },
] as const satisfies readonly Project[];
```

### Pattern 3: Device Frame Placeholder (D-02)

A styled placeholder div that visually communicates "phone/device screen" using gradient and the project brand name. No image dependency, swappable for a real screenshot later:

```astro
<!-- Device frame placeholder — swap inner content for <img> when screenshot available -->
<div
  class="relative w-[240px] h-[480px] rounded-[2.5rem] overflow-hidden flex-shrink-0"
  style="border: 2px solid var(--color-border); background: var(--color-surface);"
  aria-label="mytai app preview"
>
  <!-- gradient background -->
  <div
    class="absolute inset-0"
    style="background: radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.4) 0%, transparent 65%), radial-gradient(ellipse at 70% 70%, rgba(245,158,11,0.25) 0%, transparent 60%);"
    aria-hidden="true"
  />
  <!-- brand text overlay -->
  <div class="absolute inset-0 flex items-center justify-center">
    <span
      class="font-bold tracking-tight"
      style="font-size: 2rem; color: var(--color-text);"
    >mytai</span>
  </div>
</div>
```

The gradient uses the established indigo + amber dual-accent palette from Phase 1 (D-03) [VERIFIED: src/styles/global.css].

### Pattern 4: Nav Anchor Links with Intersection Observer (D-06 through D-09)

The existing BaseLayout nav is right-only with just ThemeToggle [VERIFIED: src/layouts/BaseLayout.astro]. It needs to become a full nav bar.

Key decisions for implementation approach:
- **Pure Astro with `<script>` block** — consistent with ThemeToggle pattern (no React needed for nav interactivity)
- The `<script>` block in an Astro component is bundled once and scoped safely
- Intersection Observer is the correct API for active section detection — avoids scroll event overhead

Nav structure:
```astro
<nav class="fixed top-0 right-0 left-0 z-50 bg-base/80 backdrop-blur-sm border-b border-border transition-colors duration-300 ease-in-out">
  <div class="max-w-[1100px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-14">
    <!-- Left: site name or empty (Claude's discretion) -->
    <div><!-- optional name --></div>

    <!-- Center/right desktop links -->
    <div class="hidden md:flex items-center gap-6">
      <a href="#about" data-nav-link>About</a>
      <a href="#experience" data-nav-link>Experience</a>
      <a href="#projects" data-nav-link>Projects</a>
      <a href="#contact" data-nav-link>Contact</a>
    </div>

    <!-- Right: ThemeToggle + hamburger (mobile only) -->
    <div class="flex items-center gap-2">
      <ThemeToggle />
      <button id="hamburger-btn" class="md:hidden" aria-label="Open navigation menu">
        <!-- SVG hamburger icon -->
      </button>
    </div>
  </div>

  <!-- Mobile dropdown (hidden by default) -->
  <div id="mobile-menu" class="hidden md:hidden">
    <!-- mobile links -->
  </div>
</nav>
```

Intersection Observer pattern for active state [ASSUMED — standard DOM pattern, no library required]:
```javascript
// In Astro <script> block
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('[data-nav-link]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${entry.target.id}`) {
            link.setAttribute('data-active', 'true');
          } else {
            link.removeAttribute('data-active');
          }
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
);

sections.forEach((section) => observer.observe(section));
```

The `rootMargin` of `-40% 0px -55% 0px` activates a link when the section is in the middle band of the viewport — prevents flickering at section boundaries [ASSUMED].

### Pattern 5: Scalable Projects Grid (D-05 / PROJ-02)

The grid must render one card now and expand to multiple without layout restructuring:

```astro
<!-- ProjectsSection.astro -->
<div class="grid grid-cols-1 gap-8">
  {projects.map((project) => (
    <ProjectCard project={project} />
  ))}
</div>
```

With a single card, this renders as a single full-width card. When a second project is added, `md:grid-cols-2` can be added to the grid without touching ProjectCard. This satisfies PROJ-02 without building a multi-column layout prematurely.

### Pattern 6: Contact Icon Links (D-13)

Inline SVG icons (no library dependency) with text labels — consistent with established pattern from ThemeToggle (inline SVG) and CVDownloadButton (inline SVG arrow) [VERIFIED: src/components/ThemeToggle.astro, CVDownloadButton.astro]:

```astro
<a
  href="mailto:dragos@example.com"
  class="inline-flex items-center gap-3 px-6 py-4 rounded-lg transition-colors duration-200"
  style="color: var(--color-text); border: 1px solid var(--color-border);"
  aria-label="Send email to Dragos"
>
  <!-- envelope SVG -->
  <span>Email</span>
</a>
```

External links: `target="_blank" rel="noopener noreferrer"` per D-12 [VERIFIED: Web standard security practice].

### Anti-Patterns to Avoid

- **Importing an icon package** — inline SVG is established project pattern; adding `@iconify/react` or `lucide-react` adds bundle weight and a React island dependency for what are static icons
- **React island for nav** — nav interactivity (hamburger toggle + active state) is handled fine with a `<script>` block, matching ThemeToggle. Using a React island adds React runtime cost to every page load above the fold
- **`scroll` event listener for active state** — use Intersection Observer instead; scroll listeners fire 60+ times/second and require throttling
- **CSS `scroll-behavior: smooth` globally on html** — can conflict with JavaScript-driven scroll in the React HeroSection. Use `scrollIntoView({ behavior: 'smooth' })` per-link for predictable behavior matching the existing hero CTA pattern [VERIFIED: src/components/HeroSection.tsx line 76-79]
- **Section IDs that don't match nav hrefs** — HeroSection already uses `href="#projects"` [VERIFIED: src/components/HeroSection.tsx line 74]; the ProjectsSection MUST use `id="projects"` or the hero CTA breaks

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon SVGs | Custom SVG drawing from scratch | Copy minimal path data from heroicons.dev or similar and inline | Heroicons paths are accessible, optimized, and exactly the style in use (stroke, not fill) |
| Smooth scroll | Custom easing function | Native `scrollIntoView({ behavior: 'smooth' })` | Already used in HeroSection — consistent pattern, no bundle cost |
| Active section detection | Scroll position arithmetic | Intersection Observer API | Browser-native, performant, no polyfill needed in modern browsers |
| Mobile menu animation | CSS keyframe or Motion animation | CSS `transition` on `max-height` or `display` toggle | Hamburger menu is a simple show/hide; Motion v12 is reserved for Phase 5 scroll-reveals |

---

## Common Pitfalls

### Pitfall 1: Missing `id` on AboutSection

**What goes wrong:** Nav link `href="#about"` does not scroll to anything; anchor is dead.
**Why it happens:** Phase 2 built AboutSection but Phase 4 is the first phase to require anchor navigation. The `id` attribute may not have been set.
**How to avoid:** Before writing any nav code, verify `id="about"` exists on `<section>` in `src/components/AboutSection.astro`. If missing, add it as the first task.
**Warning signs:** Clicking "About" in the nav does nothing; hero scroll indicator scrolls past the section.

### Pitfall 2: Intersection Observer Flicker at Section Boundaries

**What goes wrong:** The active nav link flickers rapidly when scrolling through a boundary between two sections.
**Why it happens:** Default `threshold: 0` triggers on any pixel entering the viewport. Adjacent sections can both be visible simultaneously.
**How to avoid:** Use `rootMargin: '-40% 0px -55% 0px'` — this creates a 5% "dead zone" at the center of the viewport that triggers exactly one section at a time. The 40% top + 55% bottom sum exceeds 100% (only 5% active zone), ensuring single-section activation.
**Warning signs:** Active indicator jumps between two adjacent links while scrolling slowly.

### Pitfall 3: Hamburger Menu Not Keyboard Accessible

**What goes wrong:** Keyboard users cannot open the mobile menu; screen readers miss the nav links.
**Why it happens:** A `<div>` with a click handler is used instead of a `<button>`.
**How to avoid:** Use a `<button>` element for the hamburger trigger. Add `aria-expanded` attribute (toggled by script). Hidden menu should use `hidden` class (removes from DOM flow) not `opacity-0` (invisible but still keyboard-reachable).
**Warning signs:** Tab navigation skips the hamburger; VoiceOver does not announce "Open navigation menu".

### Pitfall 4: `target="_blank"` Without `rel="noopener noreferrer"`

**What goes wrong:** External links (LinkedIn, GitHub) have a security vulnerability — the opened tab can access the opener page via `window.opener`.
**Why it happens:** `target="_blank"` without `rel` is a common omission.
**How to avoid:** D-12 explicitly requires `rel="noopener noreferrer"` — treat this as a test assertion, not just a note.
**Warning signs:** Security audit flags the link.

### Pitfall 5: Device Frame Aspect Ratio Breaks on Mobile

**What goes wrong:** The two-column card layout (device frame left, details right) overflows or squishes on narrow screens.
**Why it happens:** Fixed pixel dimensions on the device frame placeholder don't adapt to mobile container width.
**How to avoid:** Set the card to `flex-col` on mobile and `flex-row` (or `md:flex-row`) on desktop. The device frame can use a max-width constraint rather than fixed width: `w-full max-w-[240px] mx-auto` on mobile, `flex-shrink-0 w-[240px]` on desktop.
**Warning signs:** Horizontal scroll appears at 375px viewport width.

### Pitfall 6: Smooth Scroll Conflict with React Hero

**What goes wrong:** Adding `html { scroll-behavior: smooth; }` globally causes double-scroll behavior on the hero "View my work" button, which already calls `scrollIntoView({ behavior: 'smooth' })` programmatically.
**Why it happens:** Both CSS and JS smooth scroll activate simultaneously.
**How to avoid:** Do NOT add global `scroll-behavior: smooth`. Implement smooth scroll per nav link via `element.scrollIntoView({ behavior: 'smooth' })` in the nav `<script>` block — consistent with HeroSection's existing approach [VERIFIED: src/components/HeroSection.tsx line 76-79].

---

## Code Examples

### Verified Patterns from Existing Codebase

#### Section wrapper (from CVSection pattern)
```astro
<!-- Source: src/components/CVSection.astro (verified) -->
<section
  aria-label="Projects"
  id="projects"
  class="py-16 md:py-24"
>
  <div class="max-w-[1100px] mx-auto">
    <h2 class="mb-12" style="font-size: var(--font-size-heading);">Projects</h2>
    <!-- content -->
  </div>
</section>
```

#### Skill badge chip (from SkillsGrid pattern)
```astro
<!-- Source: src/components/SkillsGrid.astro (verified) -->
<span
  class="px-3 py-1 rounded-full text-sm font-medium"
  style="background-color: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"
>
  {skill}
</span>
```

#### CTA button style (from CVDownloadButton pattern)
```astro
<!-- Source: src/components/CVDownloadButton.astro (verified) -->
<a
  href="https://mytai.uk"
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
  style="background-color: var(--color-accent-primary); color: white;"
>
  Visit mytai.uk
</a>
```

#### Nav script block (established ThemeToggle pattern)
```astro
<!-- Source: src/components/ThemeToggle.astro (verified) — pattern for pure Astro <script> interactivity -->
<script>
  // Scoped to component — bundled once — no React needed
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => {
    const isOpen = !menu?.classList.contains('hidden');
    menu?.classList.toggle('hidden', isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
</script>
```

---

## State of the Art

| Old Approach | Current Approach | Impact for Phase 4 |
|--------------|------------------|-------------------|
| `framer-motion` package | `motion` package (import from `motion/react`) | Motion v12 already installed as `motion`; Phase 5 will use it for scroll reveals on this section |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin directly | Already configured in project — no change needed |
| Astro 5 | Astro 6.1.5 (installed) | CLAUDE.md says v5 but v6 is installed; research confirms v6 is stable — no issue |

**Note on Astro version:** CLAUDE.md documents Astro 5 as the recommended stack, but `package.json` shows `astro@^6.1.5` is installed [VERIFIED: package.json]. Astro 6 is the current stable release. This phase should continue using whatever is installed — no downgrade needed.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `id="about"` does not yet exist on AboutSection — needs to be added | Pitfall 1 | If it already exists, the "add id" task is a no-op; low risk |
| A2 | Intersection Observer `rootMargin: '-40% 0px -55% 0px'` gives flicker-free active state | Pattern 4 | May need tuning per section heights; low risk — adjustable in CSS |
| A3 | Hamburger menu with CSS `hidden` class toggle is sufficient animation — no Motion needed | Architecture Patterns | If design review requires animation, Phase 5 can add it; not a blocker |

---

## Open Questions

1. **Does AboutSection already have `id="about"`?**
   - What we know: CVSection has `id="experience"` [VERIFIED]. HeroSection has no section id (it's the top of the page). AboutSection was built in Phase 2.
   - What's unclear: Whether Phase 2 added `id="about"` anticipating Phase 4 nav.
   - Recommendation: First task in Wave 1 — read `src/components/AboutSection.astro` and add `id="about"` if absent.

2. **Contact details — exact email address and social URLs?**
   - What we know: PROJECT.md documents LinkedIn and GitHub as contact surfaces but does not list specific URLs. Email is not listed.
   - What's unclear: Dragos's actual email address, LinkedIn profile URL, GitHub username.
   - Recommendation: Planner should note that ContactSection needs a `src/data/contact.ts` data file (or inline constants in the component) where these values are filled in. Placeholder values work for structure; real values needed before deployment.

---

## Environment Availability

Step 2.6: No new external dependencies. All tools already confirmed available (Node 22.20.0, Astro 6.1.5, Tailwind v4.2.2, Vitest). No new CLI tools, services, databases, or runtimes required for Phase 4.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 [VERIFIED: package.json] |
| Config file | `vitest.config.ts` [VERIFIED: vitest.config.ts] |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |
| Current state | 162 tests passing, 6 test files [VERIFIED: test run output] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PROJ-01 | ProjectCard.astro exists with mytai content and link | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| PROJ-01 | mytai card contains link to mytai.uk | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| PROJ-01 | ProjectCard uses badge chips matching SkillsGrid pattern | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| PROJ-02 | ProjectsSection uses a grid/list container | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| PROJ-02 | projects.ts data file exists and is typed | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| CONT-01 | ContactSection.astro exists with email, LinkedIn, GitHub links | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| CONT-01 | External links have rel="noopener noreferrer" | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| CONT-01 | Email link uses mailto: scheme | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| CONT-02 | BaseLayout nav contains anchor links to all 4 sections | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| CONT-02 | Nav contains hamburger button with aria-label | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |
| CONT-02 | index.astro renders ProjectsSection and ContactSection | unit (static analysis) | `npx vitest run tests/projects-contact.test.ts` | Wave 0 |

All tests follow the established static-file-analysis pattern [VERIFIED: tests/cv-section.test.ts, tests/design-system.test.ts] — read source files and assert on their content. No DOM rendering or browser required.

### Sampling Rate

- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green (currently 162 tests; Phase 4 adds ~20 more) before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/projects-contact.test.ts` — covers PROJ-01, PROJ-02, CONT-01, CONT-02 (new file, follows cv-section.test.ts pattern)

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | static site, no auth |
| V3 Session Management | no | static site, no sessions |
| V4 Access Control | no | static site, no ACL |
| V5 Input Validation | no | no user input in Phase 4 (contact links only, no form) |
| V6 Cryptography | no | no crypto needed |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `target="_blank"` tab hijacking | Tampering | `rel="noopener noreferrer"` on all external links (D-12, locked decision) |
| Open redirect via nav hrefs | Tampering | All hrefs are `#anchor` (same-page) or hardcoded external URLs — no user-controlled redirect |

Phase 4 has a minimal security surface — static anchor links and a mailto. The only mandatory security control is `rel="noopener noreferrer"` on external links, which is a locked decision (D-12).

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 4 |
|-----------|------------------|
| Astro components for static content; React islands only for interactive/animated content | Nav, ProjectsSection, ContactSection = pure Astro. Nav interactivity via `<script>` block (no React). |
| Tailwind v4 via `@tailwindcss/vite` Vite plugin, CSS-first `@theme` config | No tailwind.config.js. All color/spacing via CSS custom properties in global.css. |
| Motion v12 imported from `motion/react` | Phase 5 concern only — no Motion in Phase 4 components |
| Dark mode via `.dark`/`.light` class toggle with 300ms ease transition | Nav and new sections must include `transition-colors duration-300` on color-bearing elements |
| Section structure: `<section aria-label="...">` with h2, max-w-[1100px] container, `py-16 md:py-24` | ProjectsSection and ContactSection MUST follow this pattern exactly |
| Must look professionally crafted — not a generic template | Device frame placeholder should use the dual-accent gradient palette; contact section should be editorial/minimal, not a typical "contact form" box |
| Immutability: always create new objects, never mutate | projects.ts must use `as const satisfies` pattern (matching cv.ts) |
| Files max 800 lines, prefer small focused files | One component per file; no combining ProjectCard into ProjectsSection |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: package.json] — installed versions of all dependencies
- [VERIFIED: src/layouts/BaseLayout.astro] — current nav structure requiring upgrade
- [VERIFIED: src/components/SkillsGrid.astro] — badge chip pattern to reuse
- [VERIFIED: src/components/CVDownloadButton.astro] — CTA button pattern to reuse
- [VERIFIED: src/components/ThemeToggle.astro] — `<script>` block pattern for Astro interactivity
- [VERIFIED: src/components/HeroSection.tsx] — existing `#projects` href and scrollIntoView pattern
- [VERIFIED: src/styles/global.css] — full design token system
- [VERIFIED: src/data/cv.ts] — data file pattern to mirror in projects.ts
- [VERIFIED: tests/cv-section.test.ts] — static file analysis test pattern
- [VERIFIED: vitest run output] — 162 tests passing, confirmed clean baseline

### Secondary (MEDIUM confidence)
- [CITED: CLAUDE.md] — technology stack and design constraints
- [CITED: 04-CONTEXT.md] — all locked decisions D-01 through D-13

### Tertiary (LOW confidence)
- [ASSUMED] — Intersection Observer rootMargin values for flicker-free active state (standard community practice, not verified against an official spec)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from package.json
- Architecture patterns: HIGH — all patterns verified from existing codebase files
- Test strategy: HIGH — test pattern verified from existing test files; framework confirmed running
- Pitfalls: MEDIUM/HIGH — pitfall 1 (missing id) needs verification at task time; others are verified from code review
- Security: HIGH — minimal surface, single requirement (rel attribute) is a locked decision

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (stable stack — Tailwind/Astro/Motion unlikely to change significantly)
