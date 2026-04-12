---
phase: 08-quality-hardening
plan: "03"
subsystem: ci
tags: [lighthouse, github-actions, ci, quality, e2e, lhci]
dependency_graph:
  requires: [08-01, 08-02]
  provides: [ci-pipeline, lighthouse-gate]
  affects: [all-source-files]
tech_stack:
  added: ["@lhci/cli", "GitHub Actions"]
  patterns: [parallel-ci-jobs, lighthouse-static-dist, artifact-sharing]
key_files:
  created:
    - lighthouserc.json
    - .github/workflows/ci.yml
  modified: []
decisions:
  - "Use staticDistDir mode for Lighthouse CI to eliminate network variance in Performance scores"
  - "unit-tests job runs without needs: to maximize parallelism with build job"
  - "LHCI_GITHUB_APP_TOKEN optional — CI still asserts even without it"
  - "All GitHub Actions pinned to @v4 to satisfy T-8-05 tampering mitigation"
metrics:
  duration: "2min"
  completed_date: "2026-04-12"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
---

# Phase 08 Plan 03: CI Pipeline and Lighthouse Gate Summary

## One-liner

GitHub Actions 4-job CI pipeline with Lighthouse CI hard gate enforcing 100/100/100/100 on both / and /now using staticDistDir mode.

## What Was Built

### lighthouserc.json
- Configured `staticDistDir: "./dist"` — lhci spins up its own static server from the built dist artifact, eliminating network/preview-server variance in Performance scores
- Asserts `minScore: 1` (100%) on all four Lighthouse categories: performance, accessibility, best-practices, seo
- Targets both `/index.html` and `/now/index.html`
- Uploads results to `temporary-public-storage` for GitHub Checks integration

### .github/workflows/ci.yml
Four jobs with optimal parallelism:

| Job | Trigger | What it does |
|-----|---------|--------------|
| `build` | Always | `npm ci`, `astro build`, `astro check` (typecheck), uploads dist/ artifact |
| `unit-tests` | Always (parallel to build) | `npm ci`, `vitest run` |
| `e2e` | `needs: build` | Downloads dist/, installs Chromium, runs `npx playwright test` |
| `lighthouse` | `needs: build` | Downloads dist/, runs `npx lhci autorun --config=lighthouserc.json` |

Net parallelism: `build` and `unit-tests` start simultaneously. Once `build` completes, `e2e` and `lighthouse` start in parallel. All 4 jobs use `node-version: "22"`.

Security: All GitHub Actions pinned to `@v4` (T-8-05 mitigation). `LHCI_GITHUB_APP_TOKEN` referenced via `${{ secrets.LHCI_GITHUB_APP_TOKEN }}` — never logged (T-8-04 mitigation).

## Checkpoint Auto-approved

Task 2 (checkpoint:human-verify) was auto-approved in --auto mode. The verification checklist covers:
1. Branded 404 page (from 08-01)
2. Print stylesheet hiding nav/toggle, black on white, link URLs inline (from 08-01)
3. Smooth view transitions between / and /now (from 08-01)
4. Active nav highlighting on section scroll (from existing impl)
5. `npx playwright test` — 6 smoke tests passing (from 08-02)
6. `npx lhci autorun --config=lighthouserc.json` — asserts 100/100/100/100 (this plan)
7. GitHub Actions triggers on push/PR with 4 jobs (this plan)

## Deviations from Plan

None — plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | c62e242 | feat(08-03): add Lighthouse CI config and GitHub Actions 4-job CI pipeline |

## Known Stubs

None.

## Threat Flags

No new security-relevant surface beyond what the plan's threat model covers.

## Self-Check: PASSED

- `lighthouserc.json` exists: FOUND
- `.github/workflows/ci.yml` exists: FOUND
- Commit c62e242 exists: FOUND
