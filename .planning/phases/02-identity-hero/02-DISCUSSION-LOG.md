# Phase 2: Identity & Hero - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 02-identity-hero
**Areas discussed:** Hero visual treatment, Hero animation, About section format, OG image & SEO

---

## Hero Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Full viewport (100dvh) | Hero fills the entire screen — maximum impact, cinematic feel | ✓ |
| Tall section (~80dvh) | Prominent but hints at content below the fold | |
| Compact (~60dvh) | Punchy but doesn't dominate — about section visible | |

**User's choice:** Full viewport (100dvh)
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Center-aligned | Classic portfolio hero, works well with gradient glow | ✓ |
| Left-aligned | More editorial, stronger visual hierarchy | |

**User's choice:** Center-aligned
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Indigo glow behind name | Soft radial indigo/violet glow centered behind name | ✓ |
| Dual glow (indigo + amber) | Two overlapping radial gradients, more visual energy | |
| No glow — pure typography | Let display text stand alone against dark background | |

**User's choice:** Indigo glow behind name
**Notes:** Consistent with Phase 1 D-05

| Option | Description | Selected |
|--------|-------------|----------|
| Animated arrow/chevron | Small pulsing down-arrow near bottom of viewport | ✓ |
| No indicator | Clean hero with no extra UI elements | |

**User's choice:** Animated arrow/chevron
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| One-liner tagline | Single positioning statement only | |
| Tagline + CTA buttons | Positioning statement plus "View my work" / "Download CV" | ✓ |
| Tagline + social links | Positioning statement plus LinkedIn/GitHub/email icons | |

**User's choice:** Tagline + CTA buttons
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Primary + ghost | "View my work" solid indigo, "Download CV" outlined | ✓ |
| Both solid | Both filled — indigo primary + amber secondary | |
| Text links only | Styled as underlined text links | |

**User's choice:** Primary + ghost
**Notes:** None

---

## Hero Animation

| Option | Description | Selected |
|--------|-------------|----------|
| Staggered fade-up | Name, title, tagline, CTAs each appear 150ms apart, fading up | ✓ |
| Typing effect on tagline | Name/title instant, tagline types out letter-by-letter | |
| Scale + fade entrance | Elements start at 0.95 scale and transparent, zoom to full | |

**User's choice:** Staggered fade-up
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Slow subtle pulse | Glow gently breathes (opacity oscillates over 3-4s) | ✓ |
| Static glow | Glow appears and stays fixed | |
| You decide | Claude picks | |

**User's choice:** Slow subtle pulse
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Continuous gentle bounce | Arrow bounces on loop until user scrolls | |
| Fade in on load only | Arrow appears as part of staggered entrance, then static | ✓ |

**User's choice:** Fade in on load only
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Motion via React island | Motion v12 in Astro React island, consistent with Phase 5 | ✓ |
| CSS-only (@keyframes) | Pure CSS animations, zero JS for hero | |
| You decide | Claude picks | |

**User's choice:** Motion via React island
**Notes:** Consistent with Phase 5 scroll-reveal approach

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — skip animations | Show everything immediately when reduce-motion enabled | ✓ |
| Yes — simplify only | Replace motion with simple fades | |
| No — always animate | Ignore the preference | |

**User's choice:** Yes — skip animations
**Notes:** Accessibility best practice

---

## About Section Format

| Option | Description | Selected |
|--------|-------------|----------|
| Prose bio + highlight cards | 2-3 paragraph bio + role/education cards below | ✓ |
| Two-column: bio left, highlights right | Classic two-column layout | |
| Full-width prose only | Everything as flowing text | |

**User's choice:** Prose bio + highlight cards
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| No photo | Text-only section | |
| Professional headshot | Small photo alongside the bio | ✓ |
| You decide | Claude decides based on design fit | |

**User's choice:** Professional headshot
**Notes:** Will use placeholder for now

| Option | Description | Selected |
|--------|-------------|----------|
| Professional-warm | First person, conversational but professional | ✓ |
| Third person formal | "Dragos Macsim is an AI specialist..." | |
| Bold and direct | Short punchy sentences | |

**User's choice:** Professional-warm
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Two cards: Current Role + Education | Matches ABOUT-02 exactly | ✓ |
| Three cards: Role + Education + Key Skill | Adds third card for tech area | |
| You decide | Claude picks | |

**User's choice:** Two cards: Current Role + Education
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| I'll provide one | User will supply a headshot file | |
| Use a placeholder for now | Styled placeholder, swap real photo later | ✓ |
| Use initials avatar permanently | "DM" initials circle | |

**User's choice:** Use a placeholder for now
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Top of section, above bio | Centered photo above bio text | ✓ |
| Left of bio text | Photo floated left with bio wrapping | |
| You decide | Claude picks based on responsive needs | |

**User's choice:** Top of section, above bio
**Notes:** None

---

## OG Image & SEO

| Option | Description | Selected |
|--------|-------------|----------|
| Static designed image | 1200x630 PNG with name, title, accent colors | |
| Auto-generated at build time | Programmatic generation | |
| You decide | Claude picks the most practical approach | ✓ |

**User's choice:** You decide
**Notes:** Claude's discretion

| Option | Description | Selected |
|--------|-------------|----------|
| Professional + action-oriented | "Dragos Macsim — AI specialist..." with action words | ✓ |
| Shorter and punchier | Under 120 chars for mobile SERPs | |
| You decide | Claude crafts based on SEO best practices | |

**User's choice:** Professional + action-oriented
**Notes:** Use existing Head.astro default as baseline

| Option | Description | Selected |
|--------|-------------|----------|
| JSON-LD structured data | Person schema markup for rich search results | ✓ |
| Just the basics | OG tags, meta description, proper headings only | |
| You decide | Claude determines if structured data is worth it | |

**User's choice:** JSON-LD structured data
**Notes:** None

---

## Claude's Discretion

- OG image approach (static vs auto-generated)
- OG image content and design
- JSON-LD schema fields and detail level
- Bio paragraph content
- Highlight card visual treatment
- Placeholder headshot design
- Animation easing curves and durations

## Deferred Ideas

None — discussion stayed within phase scope
