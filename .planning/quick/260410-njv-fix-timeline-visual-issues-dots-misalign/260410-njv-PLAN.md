---
phase: quick
plan: 260410-njv
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/TimelineColumn.astro
  - src/components/CVSection.astro
  - src/data/cv.ts
autonomous: true
requirements: []
must_haves:
  truths:
    - "Timeline dots are horizontally centered on the spine bar"
    - "Timeline dots are vertically aligned with the heading text of each entry"
    - "Spine bar starts below the section h3 heading (Experience / Education)"
    - "No descriptions, achievements, or detail text appear below entries"
    - "Education institution shows UCL not University College London (UCL)"
  artifacts:
    - path: "src/components/TimelineColumn.astro"
      provides: "Fixed timeline layout"
    - path: "src/data/cv.ts"
      provides: "UCL institution name"
  key_links:
    - from: "src/components/CVSection.astro"
      to: "src/components/TimelineColumn.astro"
      via: "entries prop"
      pattern: "TimelineColumn"
---

<objective>
Fix four timeline visual issues in the CV section:
1. Dots misaligned horizontally (not centered on spine) and vertically (not aligned with heading text)
2. Spine bar overlaps the "Experience" / "Education" h3 headings
3. Body text (achievements, descriptions, modules) shown under entries — must be removed
4. UCL institution name too long

Purpose: The CV timeline should be clean and well-structured with proper visual alignment.
Output: Updated TimelineColumn.astro, CVSection.astro, and cv.ts with all four issues resolved.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/components/TimelineColumn.astro
@src/components/CVSection.astro
@src/data/cv.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix TimelineColumn spine and dot alignment, remove body rendering</name>
  <files>src/components/TimelineColumn.astro</files>
  <action>
Rewrite TimelineColumn.astro to fix three visual issues:

**Issue 1 — Spine starts at top-0, overlapping the h3 heading.**
Fix: Wrap only the entries list in a separate `relative` div. Move the spine `absolute` div inside that wrapper (not the outer container), so it starts below the h3. The outer container loses `relative`; the inner entries wrapper gets `relative`.

**Issue 2 — Dot not centered on spine / not aligned with heading text.**
The dot is currently `top-2` which aligns it with the date range label (the first rendered element in each entry). The heading text is below the date label. Fix: change dot vertical position to align with the heading `<h3>` element. The date label is `text-xs` (~16px line height), and heading follows with `mt-0.5`. Set dot to `top-[1.25rem]` (approx 20px) to align with the heading's first line, not the date label. The dot is `w-2.5 h-2.5` (10px); it is positioned with `-translate-x-1/2` at `left-4` (16px) which correctly centers it on the 1px spine at left-4. Keep `left-4` and `-translate-x-1/2`.

**Issue 3 — Body items rendered under each entry.**
Remove the entire `<ul>` block that renders `entry.body`. Do not render body items at all. The `body` field can remain in the interface for backward compatibility but is simply not rendered.

The final structure should be:
```
<div class="reveal-stagger">                          ← outer, NOT relative
  <h3>title</h3>
  <div class="relative">                              ← inner wrapper, IS relative
    <div ... spine />                                 ← absolute, top-0 of inner wrapper
    {entries.map(entry => (
      <div class="relative pl-0 sm:pl-12 pb-8 sm:pb-12">
        <div ... dot top-[1.25rem] />
        <span>dateRange</span>
        <h3>heading · subheading</h3>
        // NO body ul
      </div>
    ))}
  </div>
</div>
```
  </action>
  <verify>npm run build 2>&amp;1 | tail -5</verify>
  <done>Build passes; spine starts below h3; dots align with heading text; no body text rendered.</done>
</task>

<task type="auto">
  <name>Task 2: Strip body from CVSection entries and rename UCL in cv.ts</name>
  <files>src/components/CVSection.astro, src/data/cv.ts</files>
  <action>
**CVSection.astro — stop passing body content to TimelineColumn:**

Update `experienceEntries` mapping: pass `body: []` instead of `body: r.achievements`.
Update `educationEntries` mapping: pass `body: []` instead of the detail/modules array.

This ensures no body data is sent to the component even if body rendering is re-enabled later.

```ts
const experienceEntries = roles.map((r) => ({
  heading: r.title,
  subheading: r.company,
  dateRange: r.dateRange,
  body: [],
}));

const educationEntries = education.map((e) => ({
  heading: e.degree,
  subheading: e.institution,
  dateRange: e.dateRange,
  body: [],
}));
```

**cv.ts — rename UCL institution:**

Change:
```ts
institution: "University College London (UCL)",
```
to:
```ts
institution: "UCL",
```
  </action>
  <verify>npm run build 2>&amp;1 | tail -5</verify>
  <done>Build passes; CVSection passes empty body arrays; cv.ts shows "UCL" as institution name.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Static data → render | All content is static TypeScript data — no user input, no external data |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-01 | Information Disclosure | cv.ts static data | accept | Static portfolio data is intentionally public; no PII beyond professional details |
</threat_model>

<verification>
1. `npm run build` completes without errors
2. Dev server: spine bar does not overlap the "Experience" or "Education" h3 headings
3. Dots appear centered on the vertical spine line at each entry
4. Dots are vertically aligned with the heading text row (not the date label above it)
5. No bullet list text appears under any experience or education entry
6. Education column shows "UCL" not "University College London (UCL)"
</verification>

<success_criteria>
- Build passes with zero TypeScript or Astro errors
- Timeline spine starts cleanly below the section h3
- Dot centers on spine bar and aligns with the entry heading text
- No descriptions or body text visible in the timeline
- UCL abbreviated correctly in the education column
</success_criteria>

<output>
After completion, create `.planning/quick/260410-njv-fix-timeline-visual-issues-dots-misalign/260410-njv-SUMMARY.md`
</output>
