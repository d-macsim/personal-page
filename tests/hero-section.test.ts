import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const heroTsx = readFileSync(
  join(ROOT, "src/components/HeroSection.tsx"),
  "utf-8",
);
const indexAstro = readFileSync(
  join(ROOT, "src/pages/index.astro"),
  "utf-8",
);
const globalCss = readFileSync(
  join(ROOT, "src/styles/global.css"),
  "utf-8",
);

describe("HERO-01: Hero displays name, title, and positioning statement", () => {
  it("contains h1 with full name", () => {
    expect(heroTsx).toContain("Dragos Macsim");
    expect(heroTsx).toMatch(/motion\.h1|<h1/);
  });

  it("contains professional title", () => {
    expect(heroTsx).toContain("AI Data Specialist");
  });

  it("contains positioning tagline", () => {
    expect(heroTsx).toContain(
      "Building intelligent tools at the intersection of AI and product",
    );
  });

  it("has full viewport height (100dvh minus nav offset)", () => {
    expect(heroTsx).toContain("100dvh");
  });

  it("has center-aligned layout", () => {
    expect(heroTsx).toContain("text-center");
    expect(heroTsx).toContain("items-center");
    expect(heroTsx).toContain("justify-center");
  });
});

describe("HERO-01: CTA buttons", () => {
  it("has View my work button linking to #projects", () => {
    expect(heroTsx).toContain('href="#projects"');
    expect(heroTsx).toContain("View my work");
  });

  it("has Download CV button with PDF download", () => {
    expect(heroTsx).toContain('href="/Dragos Macsim CV 2026.pdf"');
    expect(heroTsx).toContain("download");
    expect(heroTsx).toContain("Download CV");
  });
});

describe("HERO-02: Animated micro-interactions via Motion v12", () => {
  it("imports motion from motion/react (not framer-motion)", () => {
    expect(heroTsx).toContain('from "motion/react"');
    expect(heroTsx).not.toContain('from "framer-motion"');
  });

  it("uses motion.h1 or motion.div for animated elements", () => {
    expect(heroTsx).toMatch(/motion\.(h1|div|p)/);
  });

  it("implements staggered delays", () => {
    expect(heroTsx).toContain("0.15");
    expect(heroTsx).toContain("0.3");
    expect(heroTsx).toContain("0.45");
  });

  it("has glow-pulse CSS keyframes in global.css", () => {
    expect(globalCss).toContain("@keyframes glowPulse");
    expect(globalCss).toContain(".glow-pulse");
  });

  it("references glow-pulse class in hero component", () => {
    expect(heroTsx).toContain("glow-pulse");
  });

  it("has scroll indicator with aria-label", () => {
    expect(heroTsx).toContain('aria-label="Scroll to explore"');
  });
});

describe("HERO-02: prefers-reduced-motion support", () => {
  it("uses useReducedMotion hook", () => {
    expect(heroTsx).toContain("useReducedMotion");
  });

  it("has CSS reduced-motion media query for glow", () => {
    expect(globalCss).toContain("prefers-reduced-motion: reduce");
  });
});

describe("HERO-03: Narrative framing", () => {
  it("frames as AI specialist who builds products", () => {
    expect(heroTsx).toContain("AI Data Specialist");
  });
});

describe("Hero island integration", () => {
  it("index.astro imports HeroSection", () => {
    expect(indexAstro).toContain("HeroSection");
  });

  it("index.astro uses client:load directive", () => {
    expect(indexAstro).toContain("client:load");
  });
});
