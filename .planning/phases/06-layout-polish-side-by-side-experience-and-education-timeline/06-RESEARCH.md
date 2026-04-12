# Phase 6: Layout Polish — Side-by-Side Experience/Education, Timeline Fixes — Research

**Researched:** 2026-04-10
**Domain:** Astro component layout, Tailwind CSS v4 grid/flex, CSS absolute positioning
**Confidence:** HIGH

## Summary

Phase 6 is a pure layout polish pass with two distinct problems to fix:

**Problem 1 — Stacked layout:** `CVSection.astro` renders `ExperienceTimeline` in a single `max-w-2xl` column. The component mixes both `roles` and `education` items into one shared vertical timeline. The goal is to split Experience and Education into two side-by-side columns on desktop (≥md breakpoint), each with its own independent timeline spine.

**Problem 2 — Timeline dot/bar misalignment:** In `ExperienceTimeline.astro`, the vertical spine bar is positioned at `left-4` (16px from the parent left edge) while the dot marker is `absolute left-3 -translate-x-1/2`. The dot's visual centre lands at approximately `12px - 5px = 7px` from left — 9px to the left of the spine. This is a straightforward coordinate mismatch that needs a single corrective change.

Both fixes are contained within `CVSection.astro` and `ExperienceTimeline.astro`. No new dependencies are required. The existing Tailwind v4 utility classes and CSS custom properties cover everything needed.

**Primary recommendation:** Refactor `ExperienceTimeline.astro` into a generic `TimelineColumn.astro` that accepts a typed `entries` array and renders its own spine independently. `CVSection.astro` then places two `TimelineColumn` instances inside a `grid grid-cols-1 md:grid-cols-2 gap-12` wrapper. Fix dot alignment in the same pass.

## Standard Stack

No new packages required. All work uses the existing project stack. [VERIFIED: codebase grep]

| Tool | Version | Role in this phase |
|------|---------|-------------------|
| Astro `.astro` components | 5.17.x | Template refactor — split timeline |
| Tailwind CSS v4 | 4.2.x | `grid`, `gap`, `col-span`, responsive utilities |
| CSS custom properties | n/a | Spine/dot colours already tokenised (`--color-border`, `--color-accent-primary`) |
| TypeScript (strict) | 5.x | Updated prop types for the new component |

## Architecture Patterns

### Current Structure (what exists now)

`CVSection.astro` renders a single `ExperienceTimeline` component that owns both roles and education, with one shared spine:

```
CVSection.astro
  └─ ExperienceTimeline.astro        ← full-width, max-w-2xl
       ├─ Spine bar (absolute left-4, full height of component)
       ├─ roles[] items (dot + content)
       ├─ "Education" separator label
       └─ education[] items (dot + content)
```

### Target Structure (after phase 6)

`CVSection.astro` lays out two independent timeline columns side by side on desktop:

```
CVSection.astro
  └─ div.grid.grid-cols-1.md:grid-cols-2.gap-12
       ├─ TimelineColumn (title="Experience", entries=roles)
       │    ├─ h3 "Experience"
       │    ├─ Spine bar (self-contained, full height of THIS column)
       │    └─ entries[] items (dot aligned to THIS column's spine)
       └─ TimelineColumn (title="Education", entries=education)
            ├─ h3 "Education"
            ├─ Spine bar (self-contained)
            └─ entries[] items
```

### Pattern: Generic TimelineColumn Component

The key insight is that roles and education entries have structurally compatible shapes (title/subtitle/dateRange/body). A single generic component with a discriminated union or a flattened display type avoids code duplication.

**Option A — Shared display type (recommended):**

```typescript
// Source: codebase inspection [VERIFIED: codebase grep]
// Map Role and EducationEntry to a common display shape at the call site in CVSection

interface TimelineEntry {
  heading: string;        // role.title or entry.degree
  subheading: string;     // role.company or entry.institution
  dateRange: string;
  body: string[];         // role.achievements or [entry.detail, ...modules]
}
```

`CVSection.astro` does the mapping from `Role[]` and `EducationEntry[]` to `TimelineEntry[]` before passing props. The `TimelineColumn` component stays free of CV-specific knowledge.

**Option B — Accept the raw union types:**

Pass `roles` or `education` and use Astro's type narrowing inside the template. More tightly coupled; not recommended.

### Dot Alignment Fix

**Root cause (code-verified):** [VERIFIED: codebase grep of ExperienceTimeline.astro]

```
Spine:  class="absolute left-4 ..."       → left offset = 1rem = 16px
Dot:    class="absolute left-3 ... -translate-x-1/2"
        → left-3 = 0.75rem = 12px
        → -translate-x-1/2 shifts by -50% of dot width (w-2.5 = 10px) = -5px
        → effective left edge of dot = 12px - 5px = 7px
        → dot centre = 7px + 5px = 12px   ← 4px left of spine at 16px
```

**Fix:** Change dot `left-3` to `left-4` so dot centre = `16px - 5px + 5px = 16px` — exactly on the spine.

```astro
<!-- Before -->
<div class="absolute left-3 top-2 w-2.5 h-2.5 rounded-full -translate-x-1/2 hidden sm:block" .../>

<!-- After -->
<div class="absolute left-4 top-2 w-2.5 h-2.5 rounded-full -translate-x-1/2 hidden sm:block" .../>
```

One character change. No visual regression risk.

### Spine Bar Containment

When a single `ExperienceTimeline` is split into two independent `TimelineColumn` components, each column's spine bar becomes self-contained and spans only the height of that column's entries. The spine's existing CSS (`absolute left-4 top-0 bottom-0 w-px`) already works correctly per-column once the shared wrapper is removed. No change to the spine itself is needed beyond keeping it inside the new component.

### Responsive Behaviour

- **Mobile (< md = 768px):** Columns stack vertically (`grid-cols-1`). Experience first, Education second. Same visual as current.
- **Tablet / Desktop (≥ md):** Two-column grid (`md:grid-cols-2`). Each column has its own heading (h3), spine, and entry list.

Tailwind v4 breakpoints are already defined: `--breakpoint-md: 48rem` (768px). [VERIFIED: global.css]

```astro
<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
  <TimelineColumn title="Experience" entries={experienceEntries} />
  <TimelineColumn title="Education" entries={educationEntries} />
</div>
```

### Heading Hierarchy

Currently `CVSection.astro` has:
- `<h2>Experience</h2>` as the section heading
- `<h2>Skills</h2>` as a sub-section heading

After splitting, the column headings inside the two-column grid should be `<h3>` to maintain correct hierarchy (h2 for the section, h3 for sub-columns). The existing `<h2>Experience</h2>` section heading can be updated to `<h2>CV</h2>` or kept as-is if the Experience column heading is added as an h3 inside the column. This is a minor semantic decision the planner should make explicit.

### Reveal-Stagger Preservation

`ExperienceTimeline.astro` currently carries `class="relative reveal-stagger"`. After the split, each `TimelineColumn` root element should carry `reveal-stagger` so stagger animations work independently per column. Direct children of `reveal-stagger` are the entry items — this structure is unchanged. [VERIFIED: global.css, Phase 5 decision log]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Side-by-side columns | Custom float or position hacks | Tailwind `grid grid-cols-2` |
| Responsive breakpoint | JS resize listener | Tailwind `md:` responsive prefix |
| Column equal height | JS height sync | CSS Grid auto (native equal heights) |

## Common Pitfalls

### Pitfall 1: Spine bar overflows the column on the last entry
**What goes wrong:** The spine uses `top-0 bottom-0` (full column height). If the last entry has no bottom padding, the spine extends below the last dot into whitespace.
**Why it happens:** `bottom-0` anchors to the container bottom, which includes any trailing padding.
**How to avoid:** Ensure the `TimelineColumn` root has `relative overflow-hidden` or clip the spine with `pb-` on the last entry. The existing entries already use `pb-8 sm:pb-12`, so the spine naturally terminates at the bottom of the container. This is acceptable. Verify visually.

### Pitfall 2: Dot misalignment reintroduced when column gets left padding
**What goes wrong:** If the new `TimelineColumn` component adds container left padding (`pl-`), the spine and dot coordinates shift relative to the viewport but not relative to the container — the fix holds.
**Why it happens:** Absolute positioning is relative to the nearest positioned ancestor.
**How to avoid:** The spine and dot are positioned relative to the `relative` root div inside `TimelineColumn` — not relative to an outer wrapper. Keep this containment intact.

### Pitfall 3: Stagger animation range breaks when column has few entries
**What goes wrong:** With only 2 education entries vs 3 experience entries, the stagger `nth-child` offsets target up to `:nth-child(6)` — extra rules are harmless but the animation may feel abrupt on the short column.
**Why it happens:** Stagger offsets are global to `reveal-stagger > *`.
**How to avoid:** Acceptable as-is. The existing stagger cap at `:nth-child(n+7)` applies uniformly. No fix needed unless it looks wrong on visual review.

### Pitfall 4: h2/h3 heading hierarchy after restructure
**What goes wrong:** If both the section heading and the column headings are `<h2>`, screen readers perceive two equal-level headings with no parent-child relationship.
**How to avoid:** Section anchor heading stays `<h2>`, column headings become `<h3>`.

## Code Examples

### TimelineColumn Props Interface
```typescript
// Source: derived from codebase — cv.ts types [VERIFIED: codebase grep]
interface TimelineEntry {
  heading: string;
  subheading: string;
  dateRange: string;
  body: string[];
}

interface Props {
  title: string;
  entries: readonly TimelineEntry[];
}
```

### CVSection Column Layout
```astro
<!-- Source: Tailwind v4 grid docs pattern [ASSUMED — standard Tailwind API] -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-12 reveal-stagger">
  <TimelineColumn title="Experience" entries={experienceEntries} />
  <TimelineColumn title="Education" entries={educationEntries} />
</div>
```

### TimelineColumn Spine + Dot (corrected alignment)
```astro
<!-- Source: corrected from ExperienceTimeline.astro [VERIFIED: codebase] -->
<div class="relative reveal-stagger">
  <!-- Spine line -->
  <div
    class="absolute left-4 top-0 bottom-0 w-px hidden sm:block"
    style="background-color: var(--color-border);"
  />
  {entries.map((entry) => (
    <div class="relative pl-0 sm:pl-12 pb-8 sm:pb-12">
      <!-- Dot — left-4 matches spine at 16px -->
      <div
        class="absolute left-4 top-2 w-2.5 h-2.5 rounded-full -translate-x-1/2 hidden sm:block"
        style="background-color: var(--color-accent-primary);"
      />
      <!-- content -->
    </div>
  ))}
</div>
```

### Data Mapping in CVSection (Experience)
```typescript
// Source: cv.ts Role type [VERIFIED: codebase]
const experienceEntries = roles.map((r) => ({
  heading: r.title,
  subheading: r.company,
  dateRange: r.dateRange,
  body: r.achievements,
}));
```

### Data Mapping in CVSection (Education)
```typescript
// Source: cv.ts EducationEntry type [VERIFIED: codebase]
const educationEntries = education.map((e) => ({
  heading: e.degree,
  subheading: e.institution,
  dateRange: e.dateRange,
  body: e.modules
    ? [e.detail, `Modules: ${e.modules.join(", ")}`]
    : [e.detail],
}));
```

## Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `src/components/ExperienceTimeline.astro` | Rename / refactor | Rename to `TimelineColumn.astro`, update props to accept `TimelineEntry[]` and a `title` string, fix dot `left-3` → `left-4` |
| `src/components/CVSection.astro` | Edit | Remove `<ExperienceTimeline roles education />`, add two-column grid wrapper, map `roles` and `education` to `TimelineEntry[]`, render two `<TimelineColumn>` instances |

No other files require changes.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `grid grid-cols-1 md:grid-cols-2` renders equal-height columns by default in Tailwind v4/CSS Grid | Architecture Patterns | Low — CSS Grid equal height is a browser-native guarantee, not a Tailwind behaviour |
| A2 | No existing test covers `ExperienceTimeline` component name as a string — rename won't break tests | Files to Change | Low — static analysis tests from Phase 3 test presence of structural HTML, not component names |

## Open Questions

1. **Section heading after split**
   - What we know: Current h2 says "Experience" and covers both experience and education content
   - What's unclear: After splitting into two equal columns, should the section h2 become "Experience & Education", stay as "Experience", or be dropped in favour of column-level h3 headings only?
   - Recommendation: Rename section h2 to "Experience & Education" to accurately label both columns. Planner should confirm.

2. **Skills and download button placement**
   - What we know: `CVSection.astro` renders Skills and the download button after the timeline
   - What's unclear: Should Skills remain full-width below the two-column grid, or move into the layout grid?
   - Recommendation: Keep Skills full-width below the two-column grid — skills are a separate content type and the grid pattern doesn't benefit them.

## Environment Availability

Step 2.6: SKIPPED — no external dependencies. This phase is code/config-only changes within the existing Astro + Tailwind stack.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node assert / custom static analysis (established in Phase 3) |
| Config file | `tests/` directory |
| Quick run command | `node tests/cv-section.test.mjs` (if exists) |
| Full suite command | `npm test` (if configured) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LAYOUT-01 | Two-column grid wrapper present in CVSection | Static analysis | Check for `grid-cols-2` in CVSection.astro | Wave 0 |
| LAYOUT-02 | Dot left-4 used (not left-3) in TimelineColumn | Static analysis | Check for `left-4` on dot element | Wave 0 |
| LAYOUT-03 | TimelineColumn renders heading, dateRange, entries | Static analysis / visual | Manual visual review | Manual |

### Wave 0 Gaps
- [ ] Static assertion: `src/components/CVSection.astro` contains `md:grid-cols-2`
- [ ] Static assertion: `src/components/TimelineColumn.astro` contains `left-4` on the dot element (not `left-3`)

*(Existing Phase 3 tests check for CV HTML structure — they may need a path/import reference update if `ExperienceTimeline` is renamed to `TimelineColumn`)*

## Security Domain

Not applicable — this phase modifies static layout components with no user input, no data fetching, no authentication surface, and no dynamic execution. Security domain skipped.

## Sources

### Primary (HIGH confidence)
- `src/components/ExperienceTimeline.astro` — [VERIFIED: codebase] current spine/dot positioning, class names
- `src/components/CVSection.astro` — [VERIFIED: codebase] current layout wrapper and component usage
- `src/styles/global.css` — [VERIFIED: codebase] breakpoint tokens, reveal-stagger rules
- `src/data/cv.ts` — [VERIFIED: codebase] Role and EducationEntry type shapes

### Secondary (MEDIUM confidence)
- Tailwind CSS v4 grid documentation — `grid-cols-1 md:grid-cols-2` is standard documented behaviour [ASSUMED — standard Tailwind API, not re-verified in this session]

## Metadata

**Confidence breakdown:**
- Current implementation state: HIGH — full codebase read
- Dot alignment root cause: HIGH — calculated from actual class values in source
- Side-by-side layout pattern: HIGH — standard CSS Grid, no ambiguity
- Animation compatibility: HIGH — stagger uses `reveal-stagger > *`, unchanged by column split
- Heading hierarchy recommendation: MEDIUM — design decision, not a technical constraint

**Research date:** 2026-04-10
**Valid until:** Stable — no external dependencies; valid as long as codebase does not change
