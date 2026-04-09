# Technology Stack

**Project:** Dragos Macsim — Personal Portfolio / CV Website
**Researched:** 2026-04-09

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro | 5.17.x (stable) | Site framework | Zero-JS-by-default ships only the JavaScript you explicitly opt into. Builds ~40% faster-loading pages vs Next.js for static content. Perfect fit: this site is static content with a few interactive islands (CV PDF viewer, animations). No SSR overhead, no React runtime unless needed. |
| TypeScript | 5.x (built into Astro) | Type safety | Ships with Astro — zero configuration required. Astro v3+ requires TS 5.x. Use strict mode. |
| React | 19.x (as Astro island) | Interactive components only | Astro islands let React power the PDF viewer and any animated hero component without shipping React to the whole page. Do NOT use React for static sections. |

**Note on Astro 6:** Astro 6 is in beta as of April 2026 (v6.1.5 on npm). The stable production choice is **Astro 5.17.x** — it has the Content Layer API, Server Islands, and is fully battle-tested. Astro 6 adds CSP and live content collections; neither is needed for a portfolio. Upgrade later when 6 goes stable.

**Why not Next.js:** Next.js ships 40–50KB of runtime JavaScript minimum even for a static page. It adds SSR complexity, Vercel lock-in pressure, and build overhead — none of which this project needs. A portfolio is a content site, not a SaaS dashboard.

**Why not SvelteKit / Remix:** Both are excellent but optimised for apps. The ecosystem of portfolio-focused components, animation libraries, and deploy adapters is most mature around Astro + React. Less context-switching for a developer already familiar with React from mytai (React Native/Expo).

---

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.2.x | Utility-first styling | v4 is the current stable (released Feb 2026). Oxide engine gives 5x faster full builds, 100x faster incremental. CSS-first config (no tailwind.config.js required). Directly supported by Astro's official `@astrojs/tailwind` integration — though with v4 the integration is handled via the Vite plugin directly. |

**Why not CSS Modules / plain SCSS:** Viable, but Tailwind at v4 is now the default choice for new projects at this scale. It prevents style drift across components, is familiar to any future contributor, and pairs perfectly with component libraries.

**Why not vanilla CSS-in-JS (Emotion, styled-components):** These ship runtime JS, which defeats Astro's zero-JS philosophy.

---

### Animation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Motion (formerly Framer Motion) | 12.36.x | UI animations, scroll reveals, hero entrance | Rebranded from `framer-motion` to `motion` package. v12 runs on Web Animations API for 120fps hardware-accelerated animations. Full React 19 support. Use in Astro React islands for interactive animated sections only. Import from `motion/react`. |

**Scope of animation:** Hero section entrance, section reveal-on-scroll, project card hover effects. Do NOT animate the entire page — keep animations purposeful and fast. Use `prefers-reduced-motion` media query.

**Why not GSAP:** Overkill for a portfolio. GSAP shines for timeline-based storytelling. Motion is simpler, React-native, and smaller for this use case.

**Why not CSS transitions only:** CSS transitions can handle hover states, but scroll-triggered reveals and staggered entrance animations require a JS library. Motion gives both.

---

### Component Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Magic UI | Latest | Animated hero + section components | Use for specific high-polish sections (hero gradient, animated skill badges). Copy-paste into your project rather than importing as a dependency — it's a component catalogue, not a package. |
| Aceternity UI | Latest | High-impact visual components | Same copy-paste model as Magic UI. Use sparingly: pick 1–2 components (e.g. a spotlight card for the project showcase) to avoid visual noise. |

**Important:** Magic UI and Aceternity UI are **not installed as npm packages** — you copy component source into your codebase. They depend on Tailwind CSS + Motion being already present. This keeps the bundle lean and gives full customisation control.

**Why not Shadcn/ui:** Shadcn is excellent for interactive apps (dashboards, forms). A portfolio needs bespoke visual design, not a component system built around data-heavy UI patterns. Use Shadcn only if you add a contact form with complex validation requirements.

---

### PDF Display

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-pdf | 10.4.x | Render CV PDF in-browser | The standard React PDF renderer, wrapping PDF.js (Mozilla). v10 includes a major PDF.js engine upgrade and improved stability. Renders inside a React island so the rest of the page stays zero-JS. Displays inline on the CV section; a separate `<a download>` link handles PDF download. |

**Integration pattern:** The PDF viewer is a React island (`client:visible` directive in Astro) so it lazy-loads only when the user scrolls to the CV section. Static download link works without JS entirely — critical for accessibility and search-engine crawlers.

**Why not embedding via `<iframe>`:** Works but looks generic (browser-default PDF UI), can't be styled, mobile rendering is inconsistent.

**Why not @react-pdf/renderer:** That library *generates* PDFs from React components. This project has an existing CV PDF to *display*, not generate.

---

### Deployment & Hosting

| Technology | Purpose | Why |
|------------|---------|-----|
| Cloudflare Pages | Static hosting + CDN | Unlimited bandwidth on the free tier (Vercel caps at 100GB/month). First-class custom domain support. Astro has an official `@astrojs/cloudflare` adapter. Globally distributed edge network with no cold starts for static assets. Zero cost ceiling risk for a portfolio site with variable traffic. |
| Cloudflare DNS | Domain management | If using Cloudflare Pages, managing DNS via Cloudflare eliminates propagation delays and gives instant cert provisioning. |

**Deployment command:** `astro build` produces `/dist` — point Cloudflare Pages to this directory, no adapter needed for fully static output.

**Why not Vercel:** Excellent platform but free tier has bandwidth limits and nudges Next.js usage. Cloudflare Pages is strictly better for a static Astro site.

**Why not Netlify:** Comparable to Cloudflare Pages. Cloudflare's global edge network is faster for a UK-based personal site serving international hiring managers, and the free tier is more generous.

---

### Contact Form (Lightweight)

| Technology | Purpose | Why |
|------------|---------|-----|
| Web3Forms or Formspree | Email forwarding for contact links | For a portfolio, the primary contact surface is LinkedIn/email links — a full contact form is optional. If a form is added, Web3Forms has a genuinely free tier (unlimited submissions, no paywalling) and requires no backend. |

**Recommendation for v1:** Skip a contact form. Just render email, LinkedIn, and GitHub as styled anchor links. This is correct for this profile — hiring managers prefer direct email. Add a form only if feedback from real visitors shows demand.

---

### Supporting Tools

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| Astro Image (`astro:assets`) | Built-in (Astro 5) | Image optimisation | Astro's native image pipeline handles lazy loading, responsive `srcset`, and WebP conversion. No extra package needed. |
| `@fontsource` packages | Latest | Self-hosted web fonts | Load Google Fonts (Inter or Geist) via npm instead of Google CDN — eliminates a third-party request, avoids GDPR/analytics concerns, and loads faster from Cloudflare edge. |
| Prettier + `prettier-plugin-astro` | Latest | Code formatting | Astro's official Prettier plugin. |
| ESLint + `eslint-plugin-astro` | Latest | Linting | Astro's official ESLint plugin. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Astro 5 | Next.js 15 | Unnecessary runtime JS, SSR overhead for a static site, Vercel lock-in pressure |
| Framework | Astro 5 | SvelteKit | Smaller portfolio-oriented component ecosystem, less synergy with mytai's React Native background |
| Styling | Tailwind v4 | CSS Modules | More verbose for responsive layouts, style drift risk across many small components |
| Styling | Tailwind v4 | Styled Components | Adds runtime JS, breaks Astro's zero-JS model |
| Animation | Motion v12 | GSAP | Overkill; Motion is a React-native API with smaller bundle for standard UI animations |
| Hosting | Cloudflare Pages | Vercel | 100GB/month bandwidth cap on free tier vs. unlimited on Cloudflare Pages |
| Hosting | Cloudflare Pages | Netlify | Cloudflare edge performance advantage, similar free tier but better globally distributed CDN |
| PDF Display | react-pdf 10 | iframe embed | Uncontrollable browser-default UI, poor mobile behaviour |
| PDF Display | react-pdf 10 | @react-pdf/renderer | Generates PDFs; this project needs to display an existing PDF |

---

## Installation

```bash
# Bootstrap project (creates Astro 5 project with TypeScript)
npm create astro@latest -- --template minimal

# Add React integration (for islands: PDF viewer, animations)
npx astro add react

# Tailwind CSS v4 (via Vite plugin)
npx astro add tailwind

# Animation
npm install motion

# PDF viewer (React island)
npm install react-pdf

# Self-hosted fonts (example: Inter)
npm install @fontsource/inter

# Dev tooling
npm install -D prettier prettier-plugin-astro eslint eslint-plugin-astro
```

---

## Confidence Assessment

| Decision | Confidence | Source |
|----------|------------|--------|
| Astro 5 as framework | HIGH | Official Astro blog, year-in-review 2025, npm releases confirming v5.17.x stable |
| Tailwind CSS v4.2 as current | HIGH | Official Tailwind blog, InfoQ news on v4.2 Webpack plugin (Feb 2026) |
| Motion v12.36.x as current | HIGH | npm registry confirmed, motion.dev changelog |
| Cloudflare Pages over Vercel | HIGH | Multiple deployment comparison sources agree; free tier specs verified |
| react-pdf v10.4.x | HIGH | npm registry data confirmed in search results |
| Astro 6 deferral | MEDIUM | Beta status confirmed; stable release timeline not published |
| Magic UI / Aceternity as copy-paste | MEDIUM | Community usage confirmed; official docs endorse this pattern |
| Web3Forms for contact | LOW | Single-source; not tested for this use case |

---

## Sources

- [Astro 5.0 Release](https://astro.build/blog/astro-5/)
- [Astro 2025 Year in Review](https://astro.build/blog/year-in-review-2025/)
- [Astro 6 Beta](https://astro.build/blog/astro-6-beta/)
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4.2 on InfoQ](https://www.infoq.com/news/2026/04/tailwind-css-4-2-webpack/)
- [Motion (Framer Motion) official site](https://motion.dev/)
- [Astro vs Next.js comparison — BetterLink Blog](https://eastondev.com/blog/en/posts/dev/20251202-astro-vs-nextjs-comparison/)
- [Cloudflare Pages vs Vercel — Free Tiers](https://www.freetiers.com/blog/vercel-vs-cloudflare-pages-comparison)
- [react-pdf on npm](https://www.npmjs.com/package/react-pdf)
- [Migrating from Next.js to Astro — DEV Community](https://dev.to/alexcloudstar/i-moved-my-portfolio-website-from-nextjs-to-astro-best-decision-ever-4454)
- [Framer Motion + Tailwind 2025 — DEV Community](https://dev.to/manukumar07/framer-motion-tailwind-the-2025-animation-stack-1801)
