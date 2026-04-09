# Feature Landscape

**Domain:** Personal portfolio / CV website — AI specialist targeting hiring managers
**Subject:** Dragos Macsim (AI specialist, data analyst, product builder)
**Researched:** 2026-04-09

---

## Table Stakes

Features that hiring managers and recruiters expect. Missing any of these makes the site feel
incomplete or unprofessional and will cause visitors to leave or dismiss the candidate.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Above-the-fold identity statement | Visitors decide in 5–8 seconds whether to stay. Name, role, and one-line value prop must be immediate. | Low | "AI specialist who builds products" — hybrid angle is the hook |
| About / bio section | Human context behind the CV. Who you are, not just what you did. | Low | 2–3 paragraphs max; hiring managers skim |
| Integrated CV display (experience timeline) | Hiring managers want to evaluate without downloading. Structured HTML beats PDF-only. | Medium | Cover: Mindrift, Scale AI, Hotel, education at Bayes + UCL |
| Skills section | Quick scannable summary of technical capabilities. | Low | Python, SQL, Tableau, Docker, ML, web scraping, R — group by category |
| Downloadable CV PDF | Standard expectation for ATS submission and offline sharing. | Low | Trigger a download of the existing PDF; no regeneration needed |
| Project showcase (at least one real project) | Proves you build, not just talk. Without it the site is just a formatted CV. | Medium | mytai is the sole project for v1; link to mytai.uk |
| Contact / reach section | The entire site is a funnel — it must end in a reachable action. | Low | Email + LinkedIn + GitHub minimum |
| Responsive design (mobile + desktop) | 60%+ of portfolio views happen on mobile. Broken mobile = immediate credibility loss. | Low–Medium | Mobile-first layout; thumb-friendly nav |
| Fast load time | Slow sites lose visitors before content renders. Also signals code quality. | Low–Medium | Avoid heavy client-side JS frameworks unless justified; optimise images |
| Social / professional links visible | LinkedIn and GitHub are expected checkboxes for any technical candidate. | Low | Header or footer; persistent across sections |

---

## Differentiators

Features that set this portfolio apart from template-built alternatives. Not expected, but create
a strong impression and extend time-on-site.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Custom non-template visual identity | "Template-looking" signals low effort. A crafted design signals the same attention to detail the candidate brings to work. | High | Typography, spacing, colour palette chosen deliberately; avoid Bootstrap defaults |
| Hybrid positioning narrative (AI + builder) | Most AI/data CVs are pure technician. The Mindrift + Scale AI + mytai combination signals rare "AI specialist who ships products" — own that angle explicitly. | Low | Weave into hero, about, and project sections |
| Project case study (not just a link) | A link to mytai.uk alone is weak. A brief case study — problem, what was built, key technical decisions, outcome — demonstrates depth of thinking. | Medium | 3–5 sentences or a structured card: challenge / solution / tech / result |
| On-device AI / privacy angle for mytai | mytai's on-device processing is a genuine differentiator. Calling it out specifically signals understanding of AI deployment tradeoffs, not just "used AI". | Low | One sentence in the project description |
| Subtle motion / micro-interactions | Well-executed scroll animations and hover states signal frontend craft without overwhelming content. Strongly differentiating vs static sites. | Medium | Framer Motion or CSS transitions; keep subtle and purposeful |
| Dark mode | Now broadly expected by technical audiences; absence is noticed negatively in dev/AI circles. Adds polish without much content effort. | Low–Medium | CSS custom properties make toggling straightforward |
| Clear "what I'm available for" signal | Hiring managers want to know: is this person open to opportunities? An unambiguous availability signal (even a single line) increases conversion to contact. | Low | One line in hero or footer: "Open to AI/ML roles" or similar |
| SEO / Open Graph metadata | Ensures the site appears well when shared on LinkedIn or directly linked — name, role, og:image for preview cards. | Low | meta tags only; no content generation work |
| Performance as a statement | A Lighthouse score ≥ 95 on a developer's own site is itself a portfolio signal. | Medium | Achievable with static generation (Next.js/Astro) + image optimisation |

---

## Anti-Features

Features to deliberately NOT build for v1. Each carries real cost and dilutes the core value
proposition of "understand who Dragos is and reach him."

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Blog / writing section | Requires ongoing content commitment. An empty or stale blog is worse than no blog — it signals inactivity. PROJECT.md explicitly excludes this from v1. | Architect the nav/layout so a blog section can be added in v2 without restructuring |
| CMS / admin panel | Unnecessary complexity for a site with one author and static content. Adds attack surface, deployment complexity, and maintenance burden. | Manage content in code (MDX, JSON, or TypeScript data files); update via git |
| Multiple project pages | Only one project exists (mytai). Building a multi-project routing system before having multiple projects is over-engineering. | Build a single, well-crafted project card/section; make it easy to add more cards later |
| User accounts / authentication | Zero use case for a purely informational site. Adds GDPR surface area and login friction with no benefit. | N/A |
| AI chatbot over work history | Trendy in 2026 but high complexity, hosting cost, and latency risk. For a v1 site, a well-written about section outperforms a chatbot that may give wrong answers. | Consider for v2 if the site gains traction; stub an "ask me" section that links to email |
| Visitor analytics dashboard | Not user-facing; overkill for v1. Lightweight analytics (Plausible, Fathom, or Vercel Analytics) are sufficient and privacy-preserving. | Add a single analytics script tag; no dashboard build-out |
| Full-screen intro animations / splash screens | Delay time-to-content, frustrate return visitors, and hurt Core Web Vitals. Over-represented in template portfolios. | Use scroll-triggered animations on content sections instead |
| Skills progress bars (percentage bars) | Universally criticised by hiring managers as meaningless. "Python: 85%" conveys nothing. | Categorise skills by type (languages, tools, ML/AI) and list them plainly |
| Contact form with server-side email | Requires backend infrastructure and spam management for a feature a mailto: link handles equally well at v1 scale. | Use mailto: link; add a form in v2 if email volume warrants it |

---

## Feature Dependencies

```
Identity statement (hero)
  └─ feeds into → About section (expands on identity)
  └─ feeds into → CV section (proves identity with history)
  └─ feeds into → Project showcase (proves identity with work)

CV section
  └─ requires → PDF download (same content, different format)

Project showcase (mytai card)
  └─ requires → Project case study content (problem / solution / tech / result)
  └─ links to → mytai.uk (external dependency, not built here)

Contact / reach section
  └─ requires → all above sections (it is the conversion endpoint of the funnel)

Dark mode
  └─ requires → CSS custom property token system (design system decision)
  └─ should be decided → before any colour implementation begins

Micro-interactions / motion
  └─ requires → page structure finalised (you animate what already exists)
  └─ should be added → after layout is complete, not during
```

---

## MVP Recommendation

**Prioritise for v1:**

1. Hero with identity statement and availability signal (table stakes, low complexity, highest ROI)
2. About section (table stakes, low complexity)
3. CV / experience timeline with PDF download (table stakes, core purpose of the site)
4. Skills section (table stakes, low complexity)
5. mytai project card with case study content (differentiator, medium complexity, unique proof point)
6. Contact section with email + LinkedIn + GitHub (table stakes, required for conversion)
7. Responsive layout and fast load (table stakes, non-negotiable)
8. Custom visual identity — not a template (differentiator, must be baked in from the start)
9. Dark mode (differentiator, low–medium; easiest to implement early via CSS tokens)
10. Subtle micro-interactions (differentiator, medium; add after layout is stable)

**Defer from v1:**

- Blog: No content, adds maintenance burden
- AI chatbot: High complexity, real risk of undermining credibility if it hallucinates
- Contact form with backend: mailto: is sufficient at this scale
- Multi-project routing: Premature; add when a second project exists

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Table stakes | HIGH | Consistent across multiple sources including hiring manager surveys |
| Differentiators | MEDIUM–HIGH | Well-supported by current (2025–2026) portfolio trend research; some (AI chatbot) are trend-driven and may not outlast the hype |
| Anti-features | HIGH | Hiring manager feedback on skills bars and splash screens is unambiguous; contact form vs mailto at v1 scale is a judgement call |
| AI-specific portfolio nuances | MEDIUM | Research confirms "show you understand AI tradeoffs" matters; specific signals (on-device, privacy) inferred from mytai's own features rather than direct external validation |

---

## Sources

- [We Tested 8 Tools to Find the Best Free AI Portfolio Makers in 2026](https://manus.im/blog/best-ai-portfolio-makers)
- [Portfolio Website Must-Have Features vs Differentiators 2025–2026](https://www.zerotwosolutions.com/blogs/how-to-build-a-portfolio-website-that-stands-out-in-2025)
- [What You Need for a Great Developer Website](https://medium.com/career-programming/what-you-need-for-a-great-developer-website-github-and-linkedin-aa42a6e8a018)
- [Don't Waste Time on a Portfolio Website — 60+ Hiring Managers Survey](https://profy.dev/article/portfolio-websites-survey)
- [Junior Dev Resume & Portfolio in the Age of AI — What Recruiters Care About in 2026](https://dev.to/dhruvjoshi9/junior-dev-resume-portfolio-in-the-age-of-ai-what-recruiters-care-about-in-2025-26c7)
- [Common Portfolio Mistakes to Avoid](https://www.wix.com/blog/common-portfolio-mistakes)
- [15 Portfolio Mistakes to Avoid in 2025](https://fueler.io/blog/portfolio-mistakes-to-avoid)
- [12 Things to Remove from Your Portfolio Website](https://mattolpinski.com/articles/fix-your-portfolio/)
- [How to Build a Data Science Portfolio in 2025](https://365datascience.com/career-advice/how-to-build-a-data-science-portfolio/)
- [How to Build a Data Science Portfolio — Complete 2025 Guide](https://www.interviewmaster.ai/content/how-to-build-a-data-science-portfolio-the-complete-2025-guide)
- [19 Best Portfolio Design Trends (2026)](https://colorlib.com/wp/portfolio-design-trends/)
