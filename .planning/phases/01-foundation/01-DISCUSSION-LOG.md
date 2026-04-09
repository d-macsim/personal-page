# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 01-foundation
**Areas discussed:** Color palette & mood, Overall design aesthetic, Dark mode behavior, Typography & font choice

---

## Color Palette & Mood

### Visual Mood

| Option | Description | Selected |
|--------|-------------|----------|
| Dark & premium | Dark backgrounds with subtle accent colors — Linear, Vercel, Raycast aesthetic | ✓ |
| Light & clean | White/light gray backgrounds, strong typography — Apple, Stripe docs |  |
| Warm neutral | Cream/warm grays with earthy accents — Notion, Read.cv |  |
| Bold & vibrant | Strong colors, high contrast — Figma, Framer |  |

**User's choice:** Dark & premium
**Notes:** Strong fit for AI/tech positioning

### Accent Color

| Option | Description | Selected |
|--------|-------------|----------|
| Indigo/violet | Tech-forward, pairs with dark backgrounds — Linear, Vercel | ✓ |
| Cyan/teal | Cool, futuristic — Supabase, GitHub Copilot |  |
| Emerald/green | Growth, energy — Vercel v0 |  |
| You decide | Claude picks |  |

**User's choice:** Indigo/violet
**Notes:** None

### Palette Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Mono + single accent | Grays + indigo only, variety from shades |  |
| Dual accent | Indigo primary + amber secondary for CTAs/badges | ✓ |

**User's choice:** Dual accent
**Notes:** Dynamic, more personality

---

## Overall Design Aesthetic

### Design Style

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal editorial | Clean layouts, generous whitespace, strong type hierarchy — Linear, Rauno Freiberg | ✓ |
| Glassmorphism / frosted | Frosted glass cards, blur effects — Apple Vision Pro marketing |  |
| Bento grid / card-heavy | Asymmetric grid cards, dashboard-like — GitHub profile, Bento.me |  |
| Animated showcase | Heavy scroll animations, parallax — Awwwards sites |  |

**User's choice:** Minimal editorial
**Notes:** Content-focused, not decoration-focused

### Visual Interest / Decoration

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle gradients + glow | Soft radial gradients, faint accent glow — Linear/Vercel style | ✓ |
| Pure typography only | Zero decoration, all impact from type and layout |  |
| Geometric accents | Thin lines, dots, geometric shapes as dividers |  |

**User's choice:** Subtle gradients + glow
**Notes:** None

### Inspiration References

| Option | Description | Selected |
|--------|-------------|----------|
| Linear/Vercel is enough | Clear picture from discussion | ✓ |
| I have specific references | Share URLs or names |  |

**User's choice:** Linear/Vercel is enough
**Notes:** No additional references needed

---

## Dark Mode Behavior

### Default Theme

| Option | Description | Selected |
|--------|-------------|----------|
| Dark by default | Matches premium dark aesthetic, system pref respected on first visit | ✓ |
| Follow system preference | Respects OS setting, could show light mode to many users |  |
| Dark only, no light mode | Skip toggle entirely |  |

**User's choice:** Dark by default
**Notes:** None

### Toggle Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Top-right nav corner | Standard sun/moon icon in navigation | ✓ |
| Floating button | Fixed bottom-right position |  |
| You decide | Claude picks based on nav design |  |

**User's choice:** Top-right nav corner
**Notes:** None

### Light Mode Palette Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Inverted with same tokens | Same accents, backgrounds flip to light grays/whites | ✓ |
| Minimal light mode | Bare-bones, just ensure readability |  |
| You decide | Claude designs light mode |  |

**User's choice:** Inverted with same tokens
**Notes:** Consistent brand across both modes

### Theme Transition

| Option | Description | Selected |
|--------|-------------|----------|
| Smooth CSS transition | 300ms ease on background and text colors | ✓ |
| Instant switch | No transition |  |
| You decide | Claude picks |  |

**User's choice:** Smooth CSS transition
**Notes:** None

### Gradient Glow in Light Mode

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle or hidden in light mode | Reduce opacity or replace with shadows |  |
| Same effects, adapted colors | Keep visible but shift to lighter pastel versions | ✓ |
| You decide | Claude adapts per mode |  |

**User's choice:** Same effects, adapted colors
**Notes:** None

---

## Typography & Font Choice

### Heading Font

| Option | Description | Selected |
|--------|-------------|----------|
| Inter | Clean geometric sans-serif, excellent readability — Linear, Vercel, Figma | ✓ |
| Geist Sans | Vercel's custom font, tighter letter-spacing |  |
| Plus Jakarta Sans | Friendly geometric with rounded terminals |  |
| Serif + sans mix | Serif headings with sans-serif body |  |

**User's choice:** Inter
**Notes:** Self-hosted via @fontsource

### Body Font

| Option | Description | Selected |
|--------|-------------|----------|
| Same font — Inter throughout | Single font family, differentiate via weight/size | ✓ |
| Geist Mono for code/accents | Inter + Geist Mono for tech elements |  |
| You decide | Claude picks |  |

**User's choice:** Inter throughout
**Notes:** One font to load, ~50KB total

### Base Text Size

| Option | Description | Selected |
|--------|-------------|----------|
| 18px | Generous, editorial feel, scales to 16px on mobile | ✓ |
| 16px | Standard default, more compact |  |

**User's choice:** 18px
**Notes:** 1.7 line-height, max prose width ~680px

---

## Claude's Discretion

- Heading size scale (H1-H3 specific px values)
- Spacing scale values
- Tailwind v4 theme configuration approach
- Responsive breakpoint strategy
- Specific light mode muted text/surface/border hex values

## Deferred Ideas

None — discussion stayed within phase scope
