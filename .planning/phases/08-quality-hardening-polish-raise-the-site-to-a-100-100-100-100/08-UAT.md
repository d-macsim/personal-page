---
status: complete
phase: 08-quality-hardening-polish-raise-the-site-to-a-100-100-100-100
source: [08-01-SUMMARY.md, 08-02-SUMMARY.md, 08-03-SUMMARY.md]
started: 2026-04-12T14:21:00Z
updated: 2026-04-12T14:28:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Branded 404 Page
expected: Navigate to a non-existent URL (e.g. /asdfgh). You should see a branded 404 page with an accent-coloured "404" heading, a "Page not found" message, and a "Back to home" button matching the site design.
result: pass

### 2. Print Stylesheet
expected: Open the homepage and trigger Print Preview (Cmd+P). Nav bar, theme toggle, hamburger menu, and glow-pulse animation should be hidden. All colours reset to black on white. External links show their URLs inline. No page breaks inside sections.
result: pass

### 3. View Transitions Between Pages
expected: Click between Home and /now using the nav. Page transitions should be smooth (cross-fade or slide), not hard reloads. The URL changes and content swaps with a visible animation.
result: pass

### 4. Nav Works After Page Transition
expected: After navigating from Home to /now via the nav link, the navigation bar should still be fully functional — hamburger menu works on mobile, scroll-to-section links work, active state highlights correctly.
result: pass

### 5. Playwright Smoke Tests Pass
expected: Run `npx playwright test` from the project root. All 6 tests should pass: homepage a11y, theme toggle, contact scroll, CV download link, /now a11y, and 404 page.
result: pass

### 6. Lighthouse 100/100/100/100
expected: Run `npx lhci autorun --config=lighthouserc.json` from the project root. All four Lighthouse categories (Performance, Accessibility, Best Practices, SEO) should score 100 on both / and /now.
result: issue
reported: "Lighthouse fails assertions. Homepage: Performance 99, Accessibility 96, Best Practices 96. /now: Accessibility 95, Best Practices 96. None hit the required 100."
severity: major

### 7. CI Pipeline Configuration
expected: `.github/workflows/ci.yml` exists with 4 jobs (build, unit-tests, e2e, lighthouse). The build job runs `astro build` and `astro check`. Jobs are correctly wired: e2e and lighthouse depend on build; unit-tests runs in parallel.
result: pass

## Summary

total: 7
passed: 6
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "All four Lighthouse categories score 100 on both / and /now"
  status: failed
  reason: "User reported: Lighthouse fails assertions. Homepage: Performance 99, Accessibility 96, Best Practices 96. /now: Accessibility 95, Best Practices 96. None hit the required 100."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
