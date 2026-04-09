# Domain Pitfalls: Personal Portfolio / CV Website

**Domain:** Professional portfolio + CV site (AI specialist / product builder targeting hiring managers)
**Project:** Dragos Macsim — Personal Page
**Researched:** 2026-04-09
**Confidence:** HIGH (multiple independent sources, consistent findings across hiring manager surveys and practitioner post-mortems)

---

## Critical Pitfalls

Mistakes that cause the site to fail its core job — communicating professional identity and converting a visitor into a hiring action.

---

### Pitfall 1: Identity Ambiguity — Failing the 5-Second Test

**What goes wrong:** The hero/above-the-fold section does not immediately tell a time-poor hiring manager who this person is and what they do. Visitors leave before scrolling. This is especially dangerous for hybrid professionals (AI + product builder) because the dual identity sounds scattered without deliberate framing.

**Why it happens:** Builders focus on aesthetics or technology choices instead of leading with the clearest possible positioning statement. "I'm a developer" or "Welcome to my portfolio" are common offenders.

**Consequences:** Hiring managers spend an average of under 10 seconds deciding whether to continue. If the identity is unclear in the first viewport, nothing below it gets seen.

**Prevention:**
- Write the hero section headline first, before touching any code or design. Treat it as a one-sentence job advertisement: who you are, what you do, and who it's for.
- For Dragos specifically: anchor on "AI specialist who builds products" — not two separate identities. Example frame: "AI Specialist & Product Builder — I evaluate AI systems professionally and build user-facing AI products."
- Test with someone unfamiliar with the project: can they state what Dragos does within 5 seconds of landing?

**Warning signs:**
- Hero text is vague ("passionate about technology", "building things that matter")
- No explicit role title or specialty visible without scrolling
- About section placed before projects section

**Phase:** Foundation / Design — address in the first implementation phase before any other content.

---

### Pitfall 2: Template-Looking Design — Destroying the "Polished Professional" Requirement

**What goes wrong:** The site uses a recognisable template or component library with default theming (colors, spacing, typography, section structure). Hiring managers have seen hundreds of these. The signal it sends is: "I used a tool, not craft."

**Why it happens:** Component libraries (Chakra UI, Material UI, Tailwind UI default components) are seductive — they are fast and accessible. But their default visual language is instantly recognisable. Using them without deliberate visual differentiation produces a site that looks like every other developer portfolio.

**Consequences:** Directly violates the stated requirement "not template-looking." Undermines the credibility of someone positioning themselves as a polished product builder.

**Prevention:**
- Define a custom design system: 2–3 typefaces with intentional pairing, a bespoke color palette (not default blue/gray), consistent spacing scale, and a visual motif that reflects the AI/data identity.
- Use Tailwind CSS as a utility layer but avoid pre-built component kits. Build components from scratch with the custom system.
- Look at 10 polished personal sites before writing a line of CSS. Identify what makes each feel distinctive — usually it is typography, whitespace proportion, and restraint with color.
- One or two subtle, purposeful animations (e.g., section fade-in on scroll) > zero animations OR animations everywhere.

**Warning signs:**
- Color palette matches any Tailwind, Material, or Chakra default theme
- Section layout is exactly: hero → about → skills → projects → contact (the canonical generic order)
- Card components look identical to a Bootstrap or ShadCN demo
- Font pairing is Inter + Inter, or Roboto + Roboto

**Phase:** Design system definition — must be resolved before building any UI components.

---

### Pitfall 3: Performance Failure — Slow First Load Kills Conversion

**What goes wrong:** The site takes more than 2–3 seconds to become interactive on a mobile connection. Hiring managers reviewing on mobile or from slow office wifi abandon immediately.

**Why it happens:** Unoptimised images (especially hero/project screenshots), large JavaScript bundles from over-using client-side frameworks for a mostly static site, unoptimised web fonts (loading 6+ font weights), or hosting on a cold-start serverless function with no edge caching.

**Consequences:** Bounce before the content is seen. Also signals poor engineering judgment if the subject matter is "AI and product building."

**Prevention:**
- Use Next.js with static site generation (SSG) or a static site generator — do not use client-side rendering for a primarily informational site.
- All images: WebP format, explicit width/height attributes, lazy-loading for below-fold images, eager loading for above-fold hero image.
- Web fonts: load maximum 2 typefaces, 2–3 weights each, use `font-display: swap`, self-host or use a subset from a CDN.
- Target Lighthouse performance score ≥ 90 on mobile before deployment.
- Deploy to an edge CDN (Vercel, Netlify, Cloudflare Pages) — not a origin-only server.

**Warning signs:**
- LCP (Largest Contentful Paint) > 2.5s on PageSpeed Insights
- Total JavaScript bundle > 200KB compressed
- Hero image not compressed or served in legacy JPEG/PNG format
- No caching headers on static assets

**Phase:** Implementation and deployment — verify with Lighthouse before any public launch.

---

### Pitfall 4: CV PDF Download Failure or Friction

**What goes wrong:** The PDF download link is broken, points to an outdated file, opens a new tab instead of downloading, or the PDF itself is poorly formatted or not ATS-compatible. This is the single highest-intent action a hiring manager can take — it must work flawlessly.

**Why it happens:** PDF file is committed to the repo and then updated locally but the repo version is stale. Or the download is hosted on an external service with an unreliable link. Or the developer adds a `target="_blank"` to the anchor but forgets `download` attribute, causing browser-dependent behavior.

**Consequences:** The one hiring action the site is designed to enable fails. There is no recovery from this — the manager won't try again.

**Prevention:**
- Store the PDF in a version-controlled location that gets deployed with the site (e.g., `public/` in Next.js).
- Use the HTML `download` attribute on the anchor tag to force download rather than browser preview.
- Name the file with the candidate's name: `Dragos-Macsim-CV.pdf` — not `cv.pdf` or `resume_final_v3.pdf`.
- Test the download link on mobile (iOS Safari, Android Chrome) before launch — behavior differs from desktop.
- Add a "Last updated: [month year]" note near the download button so managers know the CV is current.

**Warning signs:**
- PDF link returns 404 after deployment
- File is named generically and conflicts with other downloads in a manager's Downloads folder
- PDF was last updated 6+ months before the site launch
- Download opens an in-browser PDF viewer with no obvious download button

**Phase:** Content integration — test in staging before deployment, and again after every CV update.

---

## Moderate Pitfalls

---

### Pitfall 5: Over-Engineering the Stack for a Static Site

**What goes wrong:** Choosing a complex backend, CMS, or data-fetching architecture for what is fundamentally a static informational site. Common examples: adding a headless CMS for a site with no editors, spinning up a database for static content, building a custom API layer.

**Prevention:**
- For v1 (single project, static content), the entire site can be static HTML/CSS/JS generated at build time. Next.js with `output: 'export'` or Astro is sufficient.
- Add complexity only when a concrete requirement demands it (e.g., a contact form needs a small serverless function, not a full backend).
- The stack decision should match the content update frequency: if Dragos updates the site twice a year, a CMS is wasted complexity.

**Phase:** Architecture decision — resolve before implementation starts.

---

### Pitfall 6: Broken or Stale External Links

**What goes wrong:** Links to mytai.uk, LinkedIn, GitHub, or other external properties stop working, point to wrong URLs, or lead to 404s. This happens silently — there is no internal signal.

**Prevention:**
- Verify all external links before launch.
- For mytai.uk specifically, confirm the domain is live and pointing to the intended content.
- Periodically re-check links (at minimum when updating other site content).
- Use `rel="noopener noreferrer"` on all external links for security.

**Warning signs:**
- Any link to an external property not tested on the actual deployed domain
- mytai.uk not yet live at time of portfolio launch

**Phase:** Pre-launch QA.

---

### Pitfall 7: Hybrid Identity Positioning — Appearing Scattered Instead of Versatile

**What goes wrong:** Presenting both the "AI Specialist" professional track and the "product builder / founder" track without a unifying narrative causes hiring managers to be unsure which role to consider Dragos for. This is distinct from identity ambiguity (Pitfall 1) — the identity is stated, but the story doesn't hang together.

**Why it happens:** The site lists accomplishments across both tracks without explaining how they reinforce each other. Skills section shows Python scripts, AI evaluation work, AND a mobile app — without a thread connecting them.

**Consequences:** Hiring managers optimise for pattern recognition. A scattered story fails the pattern match even when the individual items are impressive.

**Prevention:**
- Write a narrative that makes the hybrid identity a strength: "I evaluate AI systems professionally and build AI products independently — each informs the other."
- The About section and hero headline should explicitly frame the intersection, not list two separate personas.
- Order the CV experience entries and project showcase to reinforce this narrative (AI evaluation roles are current and prominent; mytai demonstrates applied AI in product form).

**Phase:** Content strategy — define narrative before writing any copy.

---

### Pitfall 8: Missing or Broken Social Proof / Metadata

**What goes wrong:** When the URL is shared on LinkedIn, Slack, or email, the unfurl preview shows a blank image and generic title. This is an invisible pitfall — the site works fine when visited directly, but looks unprofessional when shared.

**Prevention:**
- Add Open Graph meta tags: `og:title`, `og:description`, `og:image` (1200x628px, WebP/JPEG), `og:url`.
- Add Twitter/X Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- The OG image should be a branded card (name, role, site URL) — not a screenshot of the site, which is often too small to read.
- OG tags must be rendered in the static HTML `<head>`, not injected by JavaScript after load (crawlers do not execute JS reliably).
- Validate with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator) before launch.

**Phase:** Pre-launch polish.

---

## Minor Pitfalls

---

### Pitfall 9: Third-Person Copy

**What goes wrong:** The site refers to "Dragos is an AI specialist" in third person. This creates distance and sounds like a recruiter-written bio, not a person speaking directly to their audience.

**Prevention:** Use first person throughout. "I'm an AI specialist" or "I build AI-powered products." Reserve third person only if the site is explicitly framed as a public professional profile with a formal bio section.

**Phase:** Copywriting — easy fix, large impact on warmth and authenticity.

---

### Pitfall 10: No Contact Affordance Above the Fold or Easy to Find

**What goes wrong:** The contact section is at the bottom of the page with no navigation shortcut. Hiring managers who want to reach out immediately must scroll past all content.

**Prevention:**
- Include a visible "Contact" or "Get in touch" link in the top navigation.
- Consider a sticky header with navigation that includes a CTA button.
- Email address should be clickable (`mailto:`) not just displayed as text.

**Phase:** Navigation and layout — address during design.

---

### Pitfall 11: Forgetting the Deployment Domain Checklist

**What goes wrong:** After deploying to the custom domain, issues appear: missing HTTPS, no www redirect, missing canonical URL, or the domain resolves but Open Graph tags contain the old preview URL.

**Prevention:**
- HTTPS only — redirect all HTTP to HTTPS.
- Redirect `www.` to apex (or vice versa) — pick one canonical form.
- Set canonical `<link>` tags with the final production URL.
- Update OG `og:url` to production URL before final deploy.
- Check DNS propagation with [dnschecker.org](https://dnschecker.org) before announcing the site.

**Phase:** Deployment — final checklist before public announcement.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Design system / visual design | Template-looking output (Pitfall 2) | Define custom palette, typefaces, and visual motifs before building components |
| Hero / above-fold copy | Identity ambiguity (Pitfall 1) | Write and validate the 5-second identity statement before any design work |
| Content strategy | Hybrid identity appearing scattered (Pitfall 7) | Write the narrative thread connecting AI evaluation work and mytai before writing page copy |
| Implementation | Performance regression (Pitfall 3) | Run Lighthouse after every major component addition; fix before proceeding |
| CV integration | PDF download failure (Pitfall 4) | Test download on mobile Safari and Android Chrome in staging |
| Pre-launch | Missing social metadata (Pitfall 8) | Validate OG tags with Facebook Debugger and Twitter Validator |
| Pre-launch | Broken external links (Pitfall 6) | Audit all external URLs from the deployed domain, not localhost |
| Deployment | Domain configuration issues (Pitfall 11) | Use deployment checklist: HTTPS, www redirect, canonical URL |

---

## Sources

- [Don't waste time on a (React) portfolio website — 60+ hiring managers survey](https://profy.dev/article/portfolio-websites-survey) (HIGH confidence — primary research with hiring managers)
- [7 Deadly Sins of Developer Portfolios](https://pesto.tech/resources/7-deadly-sins-of-developer-portfolios-and-how-to-avoid-them) (MEDIUM confidence — practitioner synthesis)
- [5 Mistakes Developers Make in Their Portfolio Websites](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites) (MEDIUM confidence)
- [What I learned after reviewing over 40 developer portfolios](https://dev.to/kethmars/what-i-learned-after-reviewing-over-40-developer-portfolios-9-tips-for-a-better-portfolio-4me7) (MEDIUM confidence — practitioner review)
- [12 Tips To Avoid A Generic UX Design Portfolio](https://designlab.com/blog/avoid-an-identikit-ux-design-portfolio) (MEDIUM confidence)
- [Open Graph meta tag mistakes](https://www.trueanthem.com/meta-tags-for-seo/) (MEDIUM confidence — technical)
- [Rebuilding my UX portfolio for busy hiring managers](https://medium.com/design-bootcamp/rebuilding-my-ux-portfolio-for-busy-hiring-managers-3f90fbd005d1) (MEDIUM confidence — practitioner case study)
- [How to Build an AI Portfolio that gets you hired](https://www.projectpro.io/article/artificial-intelligence-portfolio/1140) (MEDIUM confidence — domain-specific)
- [Portfolio Mistakes Designers Still Make in 2026](https://muz.li/blog/portfolio-mistakes-designers-still-make-in-2026/) (MEDIUM confidence)
