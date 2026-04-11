# Deferred items — Phase 07

Pre-existing test failures discovered during Plan 07-01 execution. These are **out of scope** for Phase 7 (see `scope_boundary` in executor rules — only issues directly caused by the current task are auto-fixed) but are tracked here so a later plan or quick task can address them.

## Pre-existing vitest failures (15 tests across 5 files)

All failures originate from commits `accd33e` ("correct bio to match actual CV, change title to AI data specialist") and `5f654d0` ("fix email to protonmail, add currently working on blurb") which updated content strings without updating the assertions in earlier test files.

### Affected files

| File | Likely broken assertions |
|------|--------------------------|
| `tests/about-section.test.ts` | Bio copy assertion (`AI specialist and product builder` → now `AI data specialist`) |
| `tests/cv-section.test.ts` | Likely title/copy drift from same content update |
| `tests/design-system.test.ts` | Possibly token/class drift |
| `tests/hero-section.test.ts` | Hero copy drift (title/subtitle changed) |
| `tests/seo-metadata.test.ts` | Default description / email drift (`AI specialist who builds products` → new copy, protonmail instead of previous email) |

### Verification

With all Phase 7 test files in place and passing:

```
Test Files  5 failed | 5 passed | 3 skipped (13)
     Tests  15 failed | 209 passed | 22 skipped (246)
```

With Phase 7 test files removed (pre-existing baseline):

```
Test Files  5 failed | 3 passed (8)
     Tests  15 failed | 202 passed (217)
```

Exact same 15 failures and 5 failing files — Phase 7 changes introduce **zero** new failures. All 5 Phase 7 test files either pass (2) or gracefully `.skipIf` (3) until downstream Wave 1+ plans land their target artifacts.

### Recommended follow-up

A small quick task to either:
1. Update the assertions in the 5 affected test files to match current copy, OR
2. Delete the now-stale copy assertions (content strings belong in snapshot tests, not hard-coded grep assertions).

Option 2 is probably the right long-term fix — Phase 8 (Quality Hardening) is a natural home for it.
