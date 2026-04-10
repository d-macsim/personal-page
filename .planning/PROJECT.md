# Dragos Macsim — Personal Page

## What This Is

A high-quality personal website for Dragos Macsim — AI specialist, data analyst, and product builder. The site serves as both a professional CV and a showcase for projects (primarily mytai), targeting hiring managers and building a public presence. It includes an integrated CV with PDF download, an about section, a project showcase featuring mytai, and contact/social links.

## Core Value

Visitors instantly understand who Dragos is — an AI specialist who builds products — and can explore his work and download his CV.

## Requirements

### Validated

- [x] Project showcase section featuring mytai — Validated in Phase 4: Projects & Contact
- [x] Link to mytai.uk with description and visuals — Validated in Phase 4: Projects & Contact
- [x] Contact information and social links (email, LinkedIn, GitHub) — Validated in Phase 4: Projects & Contact

### Active

- [ ] About me section with professional identity (AI + builder hybrid)
- [ ] Integrated CV display (experience, education, skills from PDF)
- [ ] Downloadable PDF version of CV
- [x] High-quality, polished frontend design — not template-looking — Validated in Phase 5: Animations & Deploy
- [ ] Responsive design (mobile + desktop)
- [x] Domain-ready deployment — Validated in Phase 5: Animations & Deploy (live at dragosmacsim.com)

### Out of Scope

- Blog / writing section — not needed for v1
- CMS or admin panel — static content is fine
- Multiple project pages — mytai is the only project for now
- User accounts or authentication — purely informational site

## Context

- Dragos is based in Mill Hill, London, UK
- Currently AI Specialist at Mindrift (Feb 2026–present) — automated web scraping, data extraction, AI/human hybrid QA
- Previously Data Analyst at Scale AI (Nov 2024–Nov 2025) — benchmarking text-to-image models, RAG techniques, conversational AI evaluation
- Guest Relations Manager at London House Hotel (May 2023–present) — Python automations, Excel reporting, operational efficiency
- MSc Business Analytics at Bayes Business School (Class of 2026) — on track for distinction; network analytics, deep learning, ML, revenue management
- BSc Information Management for Business at UCL (2022–2025) — upper second class honours
- Skills: Python, Tableau, Excel, R, SQL, web scraping (BeautifulSoup, Selenium), Docker, Ubuntu server admin
- Interests: Football, Powerlifting, Cycling
- mytai (mytai.uk) is an all-in-one AI personal trainer app built with React Native / Expo — combat sports form analysis using on-device AI, gym workout logging, calorie tracking, weight tracking, exercise logging, mobility exercises with form feedback. iOS available, Android coming soon. Privacy-first (on-device processing).
- CV PDF available locally: `Dragos Macsim CV 2026.pdf`

## Constraints

- **Design**: Must look professionally crafted — use frontend skills to build to a high standard, not a generic template
- **Tech stack**: No preference stated — research should determine the best approach
- **Domain**: User has a domain available for deployment
- **Content**: Single featured project (mytai) for now, but structure should allow adding more later

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid positioning (AI specialist + builder) | Reflects both professional work and entrepreneurial side projects | — Pending |
| Integrated CV + PDF download | Hiring managers can browse on-page or download for ATS/sharing | — Pending |
| No blog for v1 | Focus on core value — CV and project showcase — without content maintenance burden | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-10 — Phase 5 (Animations & Deploy) complete: CSS scroll-reveal animations on all sections, deployed to dragosmacsim.com via Cloudflare Pages with HTTPS and security headers*
