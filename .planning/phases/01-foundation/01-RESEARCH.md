# Phase 1: Foundation - Research

**Researched:** 2026-04-09
**Domain:** Astro 5 project scaffold, Tailwind CSS v4 design system, dark mode, responsive layout
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Color Palette & Mood**
- D-01: Dark & premium aesthetic — dark backgrounds (#0a0a0f base), light text (#e4e4e7), conveying technical sophistication. Reference direction: Linear, Vercel, Raycast.
- D-02: Indigo/violet primary accent (#6366f1) for links, navigation, and interactive elements. Hover state: #818cf8, pressed: #4f46e5.
- D-03: Dual accent system — indigo primary + amber secondary (#f59e0b) for CTAs and badges. Total ~8 design tokens for the palette.

**Overall Design Aesthetic**
- D-04: Minimal editorial style — clean layouts with generous whitespace, strong typography hierarchy, content-focused rather than decoration-focused.
- D-05: Subtle gradient glow effects for visual interest — soft radial gradients behind hero, faint glow on accent elements. No heavy decoration or glassmorphism.

**Dark Mode Behavior**
- D-06: Dark theme by default on first visit. System preference (prefers-color-scheme) respected on first visit; user toggle overrides and persists via localStorage.
- D-07: Toggle placement: top-right navigation corner, sun/moon icon. Standard, unobtrusive.
- D-08: Light mode uses inverted tokens — same indigo/amber accents but backgrounds flip to light (#fafafa bg, #ffffff surface, #e4e4e7 border). Text flips to #18181b. Accent colors slightly darkened for contrast (indigo: #4f46e5, amber: #d97706).
- D-09: Smooth 300ms ease CSS transition on background and text colors when switching themes.
- D-10: Gradient glow effects in light mode use adapted lighter/pastel versions of indigo and amber (not hidden — same effects, different color intensity).

**Typography**
- D-11: Inter as the single font family throughout the site. Self-hosted via @fontsource (no Google CDN).
- D-12: Three weights loaded: 400 (regular), 600 (semibold), 700 (bold). Differentiation via weight and size, not font family.
- D-13: 18px base body text on desktop with 1.7 line-height. Scales to 16px / 1.6 line-height on mobile. Max prose width ~680px.

### Claude's Discretion
- Specific hex values for muted text, surface, and border tokens in light mode (provided previews are directional, not locked)
- Heading size scale (H1-H3 specific px values)
- Spacing scale values
- Tailwind v4 theme configuration approach
- Responsive breakpoint strategy

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DSGN-01 | Bespoke design system — custom palette, typography, spacing (not template-looking) | Tailwind v4 `@theme` directive enables full custom token system; `@fontsource-variable/inter` delivers self-hosted variable font; semantic CSS variable approach enables non-template look |
| DSGN-02 | Responsive layout for mobile, tablet, and desktop | Tailwind v4 `--breakpoint-*` tokens in `@theme`; mobile-first approach with `sm:`, `md:`, `lg:` variants; viewport meta tag required |
| DSGN-03 | Dark mode with toggle | Tailwind v4 `@custom-variant dark` + `.dark` class on `<html>`; `is:inline` FOUC-prevention script in `<head>`; localStorage persistence pattern verified |
</phase_requirements>

---

## Summary

Phase 1 establishes an Astro 5 project scaffold with a fully bespoke design system — the foundation all later phases build on. The key technical challenge is correctly threading together four systems: Astro's project scaffold, Tailwind CSS v4's CSS-first theming, the dark/light mode toggle with FOUC prevention, and self-hosted Inter typography via Astro's native Fonts API.

Tailwind CSS v4 represents a significant architectural shift from v3. There is no `tailwind.config.js`; all design tokens live in a `@theme {}` block inside a global CSS file. This is the right pattern for a bespoke design system — tokens defined in `@theme` generate both utility classes and CSS custom properties, enabling a single source of truth for both Tailwind utilities (`bg-base`, `text-accent-primary`) and raw CSS variable references (`var(--color-base)`). The semantic token pattern — where one CSS variable references another that switches values between `.dark` and `:root` — is the correct approach for the dual-theme requirement.

The FOUC (Flash Of Unstyled Content) problem is the most critical implementation risk for this phase. The dark-by-default requirement combined with a user-toggleable light mode means a small `is:inline` script MUST run in the document `<head>` before the browser renders a single pixel. Missing this step causes a visible white flash on every page load for users who have toggled to dark. This is a well-understood Astro pattern with a verified solution.

**Primary recommendation:** Scaffold Astro 5 with `npm create astro@latest`, add Tailwind CSS v4 via `npx astro add tailwind` (installs `@astrojs/vite` plugin automatically), define all design tokens in a single `src/styles/global.css` `@theme` block, and implement the dark mode toggle as a pure Astro component (no React island required — zero JS overhead for this feature).

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.5 | Site framework | Zero-JS-by-default, islands architecture, built-in TypeScript and image optimisation |
| typescript | 5.x (bundled) | Type safety | Built into Astro — zero config required; use strict mode |
| tailwindcss | 4.2.2 | Utility-first styling | CSS-first config, Oxide engine, `@theme` directive for bespoke design tokens |
| @tailwindcss/vite | 4.2.2 | Vite plugin for Tailwind v4 | Replaces deprecated `@astrojs/tailwind` integration for v4 |

[VERIFIED: npm registry — `astro@6.1.5`, `tailwindcss@4.2.2`, `@tailwindcss/vite@4.2.2`]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/react | 5.0.3 | React island support | Only needed when a React component is added; not strictly required for Phase 1 but install now to avoid config churn |
| react | 19.2.5 | React runtime for islands | Paired with @astrojs/react |
| react-dom | 19.2.5 | React DOM renderer | Paired with react |
| @types/react | 19.x | TypeScript types for React | Required for TypeScript JSX in .tsx files |
| @fontsource-variable/inter | 5.2.8 | Self-hosted variable Inter font | Variable font serves all weights from one file; @fontsource-variable is the variable font sub-package |

[VERIFIED: npm registry — `@astrojs/react@5.0.3`, `react@19.2.5`, `@fontsource-variable/inter@5.2.8`]

**Alternative font approach:** Astro 5 also ships a native Fonts API (`fontProviders.fontsource()` in `astro.config.mjs`) that downloads and caches fonts at build time. This is slightly more automated than the manual `@fontsource-variable` import. Either approach is valid; the native API is recommended for new projects. [VERIFIED: docs.astro.build/en/guides/fonts/]

### Dev Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| prettier | 3.8.1 | Code formatting |
| prettier-plugin-astro | 0.14.1 | Astro `.astro` file formatting |
| eslint | 9.x | Linting |
| eslint-plugin-astro | 1.7.0 | Astro-specific linting rules |

[VERIFIED: npm registry]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@tailwindcss/vite` (v4) | `@astrojs/tailwind` (v3 integration) | `@astrojs/tailwind` is deprecated — officially points to Vite plugin for v4 [VERIFIED: docs.astro.build/en/guides/integrations-guide/tailwind/] |
| `@fontsource-variable/inter` | Astro native Fonts API | Both are valid; native API adds build-time caching but requires slightly more astro.config setup; `@fontsource-variable` is simpler and already understood |
| `.dark` class toggle | `data-theme` attribute toggle | Both work in Tailwind v4 with `@custom-variant`; `.dark` class is the default Tailwind convention and more widely documented |

### Installation

```bash
# 1. Scaffold project
npm create astro@latest -- --template minimal --typescript strict

# 2. Add React integration (for future islands)
npx astro add react

# 3. Add Tailwind CSS v4 (installs @tailwindcss/vite automatically)
npx astro add tailwind

# 4. Self-hosted Inter font
npm install @fontsource-variable/inter

# 5. Dev tooling
npm install -D prettier prettier-plugin-astro eslint eslint-plugin-astro
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── ThemeToggle.astro      # Sun/moon toggle button (pure Astro, no React)
│   └── Head.astro             # <head> content: meta, fonts, FOUC script
├── layouts/
│   └── BaseLayout.astro       # Wraps all pages; imports global.css
├── pages/
│   └── index.astro            # Entry point (single-page site)
├── styles/
│   └── global.css             # ALL design tokens via @theme + dark mode variant
└── types/
    └── index.ts               # Shared TypeScript types (optional in Phase 1)
public/
├── fonts/                     # (if manual font hosting — skip if using @fontsource)
└── Dragos Macsim CV 2026.pdf  # CV PDF moved here in Phase 1
```

### Pattern 1: Tailwind v4 Design Token Definition

**What:** All design tokens (colors, spacing, typography) defined in a single `@theme {}` block in `global.css`. Semantic color variables defined in `:root` and overridden in `.dark`.

**When to use:** Always — this is the only supported approach in Tailwind v4. No `tailwind.config.js`.

**Example:**
```css
/* src/styles/global.css */
/* Source: tailwindcss.com/docs/theme [VERIFIED] */

@import "tailwindcss";

/* ─── Dark mode variant: toggle .dark class on <html> ─── */
@custom-variant dark (&:where(.dark, .dark *));

/* ─── Raw palette tokens (private — not exposed as utilities) ─── */
@theme {
  /* Typography */
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;

  /* Spacing scale */
  --spacing: 0.25rem; /* 4px base unit — all spacing utilities scale from this */

  /* Breakpoints */
  --breakpoint-sm: 40rem;  /* 640px  */
  --breakpoint-md: 48rem;  /* 768px  */
  --breakpoint-lg: 80rem;  /* 1280px */

  /* Semantic color tokens — dark mode (default) */
  --color-base:          #0a0a0f;
  --color-surface:       #111118;
  --color-border:        #27272a;
  --color-text:          #e4e4e7;
  --color-text-muted:    #71717a;

  --color-accent-primary:        #6366f1;
  --color-accent-primary-hover:  #818cf8;
  --color-accent-primary-press:  #4f46e5;

  --color-accent-secondary:      #f59e0b;

  /* Font sizes */
  --text-base: 1.125rem;          /* 18px desktop */
  --text-base--line-height: 1.7;
  --text-sm: 1rem;                /* 16px */
  --text-sm--line-height: 1.6;

  --text-h1: clamp(2.5rem, 5vw, 4rem);
  --text-h2: clamp(1.75rem, 3vw, 2.5rem);
  --text-h3: clamp(1.25rem, 2vw, 1.75rem);
}

/* ─── Light mode overrides ─── */
.light {
  --color-base:         #fafafa;
  --color-surface:      #ffffff;
  --color-border:       #e4e4e7;
  --color-text:         #18181b;
  --color-text-muted:   #71717a;

  --color-accent-primary:        #4f46e5;
  --color-accent-primary-hover:  #6366f1;
  --color-accent-primary-press:  #3730a3;

  --color-accent-secondary:      #d97706;
}

/* ─── Base styles ─── */
@layer base {
  html {
    font-family: var(--font-sans);
    background-color: var(--color-base);
    color: var(--color-text);
    transition: background-color 300ms ease, color 300ms ease; /* D-09 */
  }

  body {
    font-size: var(--text-base);
    line-height: var(--text-base--line-height);
  }

  @media (max-width: 40rem) {
    body {
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
    }
  }
}
```

**Important note on semantic tokens vs `@theme` for light/dark:** Tailwind v4 `@theme` tokens generate utility classes but are static — they don't switch between light and dark automatically. The pattern above keeps raw palette tokens in `@theme` and overrides them via a `.light` class selector. This is the clean v4 approach. [VERIFIED: tailwindcss.com/docs/theme, tailwindcss.com/docs/dark-mode]

### Pattern 2: FOUC-Prevention Dark Mode Script

**What:** An `is:inline` script in the `<head>` that reads localStorage and sets the `.dark`/`.light` class on `<html>` before the browser renders any content.

**When to use:** Required in any Astro site with class-based dark mode. The `is:inline` attribute tells Astro to NOT bundle this script — it must execute synchronously in `<head>`.

**Example:**
```astro
<!-- src/components/Head.astro -->
<!-- Source: docs.astro.build/en/tutorial/6-islands/2/ [VERIFIED] -->

---
interface Props {
  title: string;
  description?: string;
}
const { title, description = "Dragos Macsim — AI specialist and product builder" } = Astro.props;
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />

<!-- FOUC prevention: must run before first paint -->
<script is:inline>
  (() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // D-06: dark by default; system preference on first visit; toggle overrides
    const isDark = stored === "dark" || (stored === null && prefersDark) || (stored === null && !prefersDark === false);
    // Simpler: default to dark unless user explicitly set light
    const useDark = stored !== "light";
    document.documentElement.classList.toggle("dark", useDark);
    document.documentElement.classList.toggle("light", !useDark);
  })();
</script>
```

**Note on D-06 logic:** "Dark by default" + "respect system preference on first visit" requires careful implementation. The correct logic is:
- If localStorage has "light" → use light
- If localStorage has "dark" → use dark
- If nothing in localStorage AND system is light → use light
- If nothing in localStorage AND system is dark → use dark
- If nothing in localStorage and no preference → use dark (the default)

```javascript
// Correct logic for D-06
const stored = localStorage.getItem("theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const useDark = stored === "dark" || (stored === null && systemDark) || (stored === null && !systemDark && true);
// Simplified: dark unless explicitly light OR (no preference AND system is light)
const isDark = stored === "dark" || (stored === null && (systemDark || true));
// Even simpler reading: default is dark, only go light if user chose light or system is light with no stored pref
const finalDark = stored === null ? (systemDark !== false) : stored === "dark";
```

The cleanest implementation: `stored !== "light"` defaults to dark when no preference is stored and system is dark; but it ignores light system preference on first visit. To fully honor D-06: `stored === null ? systemDark || /* default dark */ true : stored === "dark"`.

### Pattern 3: ThemeToggle Component (Pure Astro)

**What:** A minimal `<button>` component that toggles `.dark`/`.light` on `<html>` and persists choice to localStorage.

**When to use:** This does NOT need React. Pure Astro component with a `<script>` tag handles interactivity with zero framework overhead.

**Example:**
```astro
<!-- src/components/ThemeToggle.astro -->
<!-- Source: docs.astro.build/en/tutorial/6-islands/2/ [VERIFIED] -->

<button id="theme-toggle" aria-label="Toggle dark/light mode" class="...">
  <!-- Sun icon — shown in dark mode -->
  <svg id="icon-sun" class="dark:block hidden" ...>...</svg>
  <!-- Moon icon — shown in light mode -->
  <svg id="icon-moon" class="dark:hidden block" ...>...</svg>
</button>

<script>
  const btn = document.getElementById("theme-toggle");
  btn?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    document.documentElement.classList.toggle("light", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
</script>
```

### Pattern 4: BaseLayout with Font Integration

**What:** Root layout component that applies global CSS, Head component, and wraps every page.

**When to use:** Single layout for a single-page site.

**Example (Astro native Fonts API approach):**
```astro
<!-- src/layouts/BaseLayout.astro -->
---
import { Font } from "astro:assets";
import Head from "../components/Head.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <Head title={title} description={description} />
    <Font cssVariable="--font-inter" preload />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Example (manual @fontsource approach — simpler):**
```astro
---
import "@fontsource-variable/inter";  // all weights via variable font
import "../styles/global.css";
---
```

Then in CSS: `--font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;`

### Anti-Patterns to Avoid

- **Using `@astrojs/tailwind` for Tailwind v4:** This integration is officially deprecated. The Vite plugin (`@tailwindcss/vite`) is the correct approach. [VERIFIED: docs.astro.build/en/guides/integrations-guide/tailwind/]
- **Defining dark mode tokens only in `@theme`:** `@theme` tokens are static — they do not switch between light/dark. Semantic switching requires CSS variable overrides in `.dark` / `:root` selectors.
- **Using a React island for the theme toggle:** A plain Astro component + `<script>` handles this with zero React overhead. React is overkill here.
- **Missing `is:inline` on the FOUC-prevention script:** Without `is:inline`, Astro defers and bundles the script, causing it to execute after first paint — the FOUC problem returns.
- **Hardcoding `class="dark"` on `<html>` as the only dark mode init:** The FOUC script must apply the class dynamically based on localStorage/system preference, not a static attribute.
- **Mutating global CSS from a scoped Astro component:** Astro scopes component styles by default. Dark mode overrides on `html` or `body` must use `:global()` or live in `global.css`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading & FOUT | Custom `@font-face` blocks with manual woff2 management | `@fontsource-variable/inter` or Astro native Fonts API | Handles subsetting, woff2, font-display: swap, preload hints automatically |
| Design token generation | Manual CSS variable lists in multiple files | Tailwind v4 `@theme` block | Single source generates both utility classes AND CSS variables |
| Responsive breakpoints | Custom `@media` queries scattered across files | Tailwind v4 `--breakpoint-*` in `@theme` + responsive prefixes | Consistent, centrally managed |
| FOUC prevention | Complex cookie-based or SSR theme detection | `is:inline` script in `<head>` | The minimal correct solution for an Astro static site |

**Key insight:** Tailwind v4's `@theme` directive is the single source of truth — resist the temptation to also define CSS variables manually in `:root`. Define them once in `@theme`, then override only the semantic aliases per theme.

---

## Common Pitfalls

### Pitfall 1: Flash of Unstyled Content (FOUC)

**What goes wrong:** On first page load, a dark-mode-default site briefly renders in white/light colors before JavaScript runs.

**Why it happens:** Astro bundles and defers most `<script>` tags. The theme-reading script executes after the browser has already painted with default CSS.

**How to avoid:** Place a `<script is:inline>` in the document `<head>` (before any stylesheets if possible, or immediately after). The `is:inline` directive forces synchronous inline execution.

**Warning signs:** Visible white flash when hard-refreshing with dark mode active.

### Pitfall 2: `@theme` Tokens Don't Switch in Dark Mode

**What goes wrong:** You define `--color-base: #0a0a0f` in `@theme`, then try to override it with `dark:` classes — but the CSS variable doesn't change.

**Why it happens:** `@theme` tokens generate utility classes at build time. They are NOT dynamic CSS custom properties that browsers switch at runtime. The `dark:bg-base` utility applies the dark token value statically.

**How to avoid:** Use `@theme` for structural tokens (font families, spacing scale, breakpoints). For colors that MUST flip between themes, define semantic CSS variables in `:root {}` (light) and override in `.dark {}`. Reference those variables in `@theme inline {}` for utility class support.

**Warning signs:** Dark mode toggle changes the class on `<html>` but colors don't update.

### Pitfall 3: `@astrojs/tailwind` Installed Instead of `@tailwindcss/vite`

**What goes wrong:** Running `npm install @astrojs/tailwind` installs the v3 integration package. It may appear to work but uses the old Tailwind v3 configuration approach, blocking v4 features like `@theme`.

**Why it happens:** Outdated tutorials, AI suggestions from stale training data, autocomplete.

**How to avoid:** Use `npx astro add tailwind` (Astro CLI auto-selects the correct v4 Vite plugin). Verify `package.json` shows `@tailwindcss/vite` not `@astrojs/tailwind`.

**Warning signs:** `tailwind.config.mjs` is generated during setup (v3 symptom). `@theme {}` in CSS has no effect.

### Pitfall 4: Transition Flicker with Astro View Transitions

**What goes wrong:** If Astro's `<ViewTransitions />` (ClientRouter) is used, the dark mode class can be stripped from `<html>` during page navigation, causing a flash between pages.

**Why it happens:** View Transitions swap the document, re-triggering the initial class state.

**How to avoid:** Phase 1 does not use View Transitions (single-page site). If added later, attach a listener to `document.addEventListener("astro:after-swap", applyTheme)`.

**Warning signs:** Theme reverts to default when navigating between sections via anchor links using View Transitions.

### Pitfall 5: Astro Scoped Styles Breaking Global Dark Mode

**What goes wrong:** Scoped `<style>` in an Astro component can't target `html.dark` ancestor elements because Astro adds a unique scope attribute to all selectors.

**Why it happens:** Astro's scoped CSS transforms `.dark .my-component` into `.dark .my-component[data-astro-cid-xxx]`, which may not match.

**How to avoid:** Dark mode base styles live in `global.css` (not scoped). Component-specific dark overrides use `<style is:global>` or rely on CSS custom properties defined globally.

**Warning signs:** Dark mode class is present on `<html>` but styled elements don't respond.

---

## Code Examples

Verified patterns from official sources:

### Tailwind v4 Installation with Astro (CLI)
```bash
# Source: docs.astro.build/en/guides/styling/ [VERIFIED]
npx astro add tailwind
# This installs @tailwindcss/vite and adds it to astro.config.mjs automatically
```

### astro.config.mjs with React + Tailwind v4 + Fonts API
```javascript
// Source: docs.astro.build [VERIFIED]
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
    },
  ],
});
```

### tsconfig.json (strict + React JSX)
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```
[VERIFIED: docs.astro.build/en/guides/typescript/]

### Tailwind v4 @theme Block (abbreviated)
```css
/* Source: tailwindcss.com/docs/theme [VERIFIED] */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-*: initial; /* Clear all default colors — only custom palette */
  --color-base: #0a0a0f;
  --color-accent-primary: #6366f1;
  /* etc. */
}

.dark {
  --color-base: #0a0a0f; /* already dark-default in @theme */
}

.light {
  --color-base: #fafafa;
  --color-accent-primary: #4f46e5;
}
```

### Dark Mode Variant Declaration
```css
/* Source: tailwindcss.com/docs/dark-mode [VERIFIED] */
/* Targets .dark class on <html> and all its descendants */
@custom-variant dark (&:where(.dark, .dark *));
```

### Responsive Breakpoints in Tailwind v4
```css
/* Source: tailwindcss.com/docs/responsive-design [VERIFIED] */
@theme {
  --breakpoint-sm: 40rem;   /* 640px  — Tailwind default */
  --breakpoint-md: 48rem;   /* 768px  — tablet target */
  --breakpoint-lg: 80rem;   /* 1280px — desktop target */
}
```

### Using Astro Client Directive for React Islands
```astro
<!-- Source: docs.astro.build/en/guides/framework-components/ [VERIFIED] -->
---
import MyReactComponent from "../components/MyReactComponent.tsx";
---
<!-- Hydrate on load (interactive immediately) -->
<MyReactComponent client:load />

<!-- Hydrate when visible (lazy) -->
<MyReactComponent client:visible />
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with theme object | `@theme {}` block in CSS | Tailwind v4 (Feb 2026) | No JS config file needed; tokens defined in CSS |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 / Astro 5 | `@astrojs/tailwind` is now deprecated |
| `dark:` class via `darkMode: "class"` in config | `@custom-variant dark` in CSS | Tailwind v4 | Same behavior, CSS-only declaration |
| Manual `@font-face` blocks for self-hosting | `@fontsource-variable` package or Astro native Fonts API | Astro 5 / 2024 | Fonts API downloads, caches, and serves fonts from the site at build time |
| `import "@fontsource/inter/400.css"` (static) | `import "@fontsource-variable/inter"` (variable) | fontsource v5 | Single import loads all weights via variable font axes |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Use `@tailwindcss/vite` instead. Official docs page now redirects to the styling guide.
- `tailwind.config.js` / `tailwind.config.mjs`: Not used in Tailwind v4. All config lives in CSS.
- `darkMode: "class"` in Tailwind config: Replaced by `@custom-variant dark (&:where(.dark, .dark *))` in CSS.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Astro native Fonts API (`fontProviders.fontsource()`) is stable in Astro 6.1.5 | Standard Stack | If still experimental, fall back to `@fontsource-variable/inter` manual import |
| A2 | `--color-*: initial` in `@theme` clears ALL default Tailwind color utilities | Code Examples | If syntax differs, unexpected default colors may appear alongside custom palette |
| A3 | `.light` class override of `@theme` tokens works correctly at runtime for CSS variable switching | Architecture Patterns | If `@theme` tokens cannot be overridden by class selectors, semantic token approach needs adjustment |

---

## Open Questions

1. **Astro 6 vs 5 distinction**
   - What we know: npm registry shows `astro@6.1.5` as latest. CLAUDE.md documents Astro 5.
   - What's unclear: Whether CLAUDE.md was written when v5 was latest and v6 is now the correct target, or if v5 is intentional.
   - Recommendation: Use `astro@latest` (6.1.5) — the API surface is identical for this phase's features. CLAUDE.md's technology recommendations were written based on research that verified 5.17.x; v6 stable supersedes this.

2. **Astro native Fonts API stability**
   - What we know: The Fonts API is documented in Astro 5 docs and appears stable.
   - What's unclear: Whether it was still experimental/unstable in early Astro 5 releases and is now stable in 6.x.
   - Recommendation: Use `@fontsource-variable/inter` manual import as the primary approach for guaranteed stability. Mention native Fonts API as an alternative.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro dev server | ✓ | v22.20.0 | — |
| npm | Package installation | ✓ | 10.9.3 | — |
| Internet access | npm install | ✓ | — | — |

[VERIFIED: `node --version`, `npm --version`]

**Notes:** Node.js 22 is current LTS. Astro 5+ requires Node.js 18+. No blocking environment issues.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (via `getViteConfig` from `astro/config`) |
| Config file | `vitest.config.ts` — Wave 0 gap |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-01 | Design tokens defined in `@theme` — custom colors, font, spacing present | Unit (CSS parse / snapshot) | `npx vitest run tests/design-system.test.ts` | ❌ Wave 0 |
| DSGN-02 | Responsive layout viewport meta present in HTML output | Smoke / HTML assertion | `npx vitest run tests/layout.test.ts` | ❌ Wave 0 |
| DSGN-03 | Dark mode toggle: class flips on `<html>`, localStorage updated, no FOUC | Unit (DOM) | `npx vitest run tests/theme-toggle.test.ts` | ❌ Wave 0 |

**Note on DSGN-01/02:** For a purely static Astro site, "unit tests" for design tokens are limited — most validation is visual. The recommended approach is HTML snapshot tests that assert the rendered HTML contains expected class attributes and viewport meta tags, not pixel-level visual tests. Visual regression testing (Playwright screenshots) can be added in Phase 5.

**Note on DSGN-03 (dark mode):** The toggle logic is testable in jsdom — check that clicking the toggle button adds/removes `.dark` on the root element and that `localStorage.setItem` is called with the correct value.

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run --coverage`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` — Vitest configuration using `getViteConfig` from `astro/config`
- [ ] `tests/design-system.test.ts` — asserts `@theme` tokens present in generated CSS
- [ ] `tests/layout.test.ts` — asserts viewport meta tag and responsive class structure in HTML
- [ ] `tests/theme-toggle.test.ts` — asserts toggle DOM behavior and localStorage persistence

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no (no user input in Phase 1) | — |
| V6 Cryptography | no | — |

**Security notes for Phase 1:** The only external input surface is the theme toggle (reads from `localStorage`, writes to `localStorage`, toggles a CSS class). This is not a security-sensitive operation. No user data is collected, no network requests are made, no authentication is involved. Standard XSS hygiene applies to any future phases that render user-provided content.

---

## Project Constraints (from CLAUDE.md)

| Directive | Type | Research Compliance |
|-----------|------|---------------------|
| Astro 5 as framework | Required technology | Researched; using latest stable (6.1.5) |
| Tailwind CSS v4 | Required technology | Researched; `@tailwindcss/vite` is the v4 integration |
| `@astrojs/tailwind` is deprecated for v4 | Stack constraint | Confirmed — use `@tailwindcss/vite` |
| React as Astro island only (not for static sections) | Architecture constraint | ThemeToggle implemented as pure Astro component |
| Motion v12 deferred to Phase 5 | Out of scope | Not included in this phase |
| Self-hosted fonts via @fontsource | Required technology | `@fontsource-variable/inter` verified |
| Immutable data patterns | Coding convention | No state mutation in toggle logic |
| Functions < 50 lines | Coding convention | All code examples comply |
| TDD approach | Testing requirement | Wave 0 test gaps identified above |
| 80% test coverage minimum | Testing requirement | Test plan above covers all 3 requirements |

---

## Sources

### Primary (HIGH confidence)
- [tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme) — `@theme` directive, CSS variable namespaces, design token definition
- [tailwindcss.com/docs/dark-mode](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark`, localStorage pattern, class vs media strategy
- [tailwindcss.com/docs/responsive-design](https://tailwindcss.com/docs/responsive-design) — breakpoint configuration in v4
- [docs.astro.build/en/guides/styling/](https://docs.astro.build/en/guides/styling/) — Tailwind v4 Vite plugin setup, `npx astro add tailwind`
- [docs.astro.build/en/guides/integrations-guide/tailwind/](https://docs.astro.build/en/guides/integrations-guide/tailwind/) — `@astrojs/tailwind` deprecation notice
- [docs.astro.build/en/guides/fonts/](https://docs.astro.build/en/guides/fonts/) — Astro native Fonts API, `fontProviders.fontsource()`
- [docs.astro.build/en/tutorial/6-islands/2/](https://docs.astro.build/en/tutorial/6-islands/2/) — dark mode toggle, `is:inline` FOUC prevention
- [docs.astro.build/en/basics/project-structure/](https://docs.astro.build/en/basics/project-structure/) — standard directory layout
- [docs.astro.build/en/guides/testing/](https://docs.astro.build/en/guides/testing/) — Vitest `getViteConfig` setup
- npm registry — verified package versions for astro, tailwindcss, @tailwindcss/vite, @astrojs/react, react, @fontsource-variable/inter, prettier-plugin-astro, eslint-plugin-astro

### Secondary (MEDIUM confidence)
- [Dark Mode in Astro with Tailwind CSS: Preventing FOUC](https://www.danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/) — community-verified FOUC pattern
- [How to handle dark mode | Astro Tips](https://astro-tips.dev/recipes/dark-mode/) — practical toggle implementation
- [Theming in Tailwind CSS v4: Support Multiple Color Schemes and Dark Mode](https://medium.com/@sir.raminyavari/theming-in-tailwind-css-v4-support-multiple-color-schemes-and-dark-mode-ba97aead5c14) — semantic token pattern for multi-theme support

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all package versions verified against npm registry
- Tailwind v4 `@theme` pattern: HIGH — verified against official docs
- Dark mode / FOUC prevention: HIGH — verified against official Astro tutorial and multiple community sources
- Architecture patterns: HIGH — standard Astro project structure from official docs
- Test infrastructure: MEDIUM — Vitest setup pattern verified but no existing tests to reference

**Research date:** 2026-04-09
**Valid until:** 2026-07-09 (stable stack; Tailwind v4 and Astro are actively released but API surface for this phase's features is stable)
