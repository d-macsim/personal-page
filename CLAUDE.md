<!-- GSD:project-start source:PROJECT.md -->
## Project

**Dragos Macsim — Personal Page**

A high-quality personal website for Dragos Macsim — AI specialist, data analyst, and product builder. The site serves as both a professional CV and a showcase for projects (primarily mytai), targeting hiring managers and building a public presence. It includes an integrated CV with PDF download, an about section, a project showcase featuring mytai, and contact/social links.

**Core Value:** Visitors instantly understand who Dragos is — an AI specialist who builds products — and can explore his work and download his CV.

### Constraints

- **Design**: Must look professionally crafted — use frontend skills to build to a high standard, not a generic template
- **Tech stack**: No preference stated — research should determine the best approach
- **Domain**: User has a domain available for deployment
- **Content**: Single featured project (mytai) for now, but structure should allow adding more later
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro | 5.17.x (stable) | Site framework | Zero-JS-by-default ships only the JavaScript you explicitly opt into. Builds ~40% faster-loading pages vs Next.js for static content. Perfect fit: this site is static content with a few interactive islands (CV PDF viewer, animations). No SSR overhead, no React runtime unless needed. |
| TypeScript | 5.x (built into Astro) | Type safety | Ships with Astro — zero configuration required. Astro v3+ requires TS 5.x. Use strict mode. |
| React | 19.x (as Astro island) | Interactive components only | Astro islands let React power the PDF viewer and any animated hero component without shipping React to the whole page. Do NOT use React for static sections. |
### Styling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.2.x | Utility-first styling | v4 is the current stable (released Feb 2026). Oxide engine gives 5x faster full builds, 100x faster incremental. CSS-first config (no tailwind.config.js required). Directly supported by Astro's official `@astrojs/tailwind` integration — though with v4 the integration is handled via the Vite plugin directly. |
### Animation
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Motion (formerly Framer Motion) | 12.36.x | UI animations, scroll reveals, hero entrance | Rebranded from `framer-motion` to `motion` package. v12 runs on Web Animations API for 120fps hardware-accelerated animations. Full React 19 support. Use in Astro React islands for interactive animated sections only. Import from `motion/react`. |
### Component Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Magic UI | Latest | Animated hero + section components | Use for specific high-polish sections (hero gradient, animated skill badges). Copy-paste into your project rather than importing as a dependency — it's a component catalogue, not a package. |
| Aceternity UI | Latest | High-impact visual components | Same copy-paste model as Magic UI. Use sparingly: pick 1–2 components (e.g. a spotlight card for the project showcase) to avoid visual noise. |
### PDF Display
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-pdf | 10.4.x | Render CV PDF in-browser | The standard React PDF renderer, wrapping PDF.js (Mozilla). v10 includes a major PDF.js engine upgrade and improved stability. Renders inside a React island so the rest of the page stays zero-JS. Displays inline on the CV section; a separate `<a download>` link handles PDF download. |
### Deployment & Hosting
| Technology | Purpose | Why |
|------------|---------|-----|
| Cloudflare Pages | Static hosting + CDN | Unlimited bandwidth on the free tier (Vercel caps at 100GB/month). First-class custom domain support. Astro has an official `@astrojs/cloudflare` adapter. Globally distributed edge network with no cold starts for static assets. Zero cost ceiling risk for a portfolio site with variable traffic. |
| Cloudflare DNS | Domain management | If using Cloudflare Pages, managing DNS via Cloudflare eliminates propagation delays and gives instant cert provisioning. |
### Contact Form (Lightweight)
| Technology | Purpose | Why |
|------------|---------|-----|
| Web3Forms or Formspree | Email forwarding for contact links | For a portfolio, the primary contact surface is LinkedIn/email links — a full contact form is optional. If a form is added, Web3Forms has a genuinely free tier (unlimited submissions, no paywalling) and requires no backend. |
### Supporting Tools
| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| Astro Image (`astro:assets`) | Built-in (Astro 5) | Image optimisation | Astro's native image pipeline handles lazy loading, responsive `srcset`, and WebP conversion. No extra package needed. |
| `@fontsource` packages | Latest | Self-hosted web fonts | Load Google Fonts (Inter or Geist) via npm instead of Google CDN — eliminates a third-party request, avoids GDPR/analytics concerns, and loads faster from Cloudflare edge. |
| Prettier + `prettier-plugin-astro` | Latest | Code formatting | Astro's official Prettier plugin. |
| ESLint + `eslint-plugin-astro` | Latest | Linting | Astro's official ESLint plugin. |
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
## Installation
# Bootstrap project (creates Astro 5 project with TypeScript)
# Add React integration (for islands: PDF viewer, animations)
# Tailwind CSS v4 (via Vite plugin)
# Animation
# PDF viewer (React island)
# Self-hosted fonts (example: Inter)
# Dev tooling
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
