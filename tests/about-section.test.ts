import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const readFile = (rel: string) =>
  readFileSync(join(ROOT, rel), "utf-8");

describe("ABOUT-01: Professional bio", () => {
  const aboutSection = readFile("src/components/AboutSection.astro");

  it("AboutSection.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/AboutSection.astro"))).toBe(true);
  });

  it("has aria-label='About'", () => {
    expect(aboutSection).toContain('aria-label="About"');
  });

  it("has an h2 section heading", () => {
    expect(aboutSection).toContain("<h2");
  });

  it("contains bio paragraph about AI specialist", () => {
    expect(aboutSection).toContain("AI data specialist");
  });

  it("contains bio paragraph about Mindrift", () => {
    expect(aboutSection).toContain("Currently at Mindrift");
  });

  it("contains bio paragraph about education", () => {
    expect(aboutSection).toContain("MSc in Business Analytics from Bayes Business School");
  });

  it("uses prose class for bio container", () => {
    expect(aboutSection).toContain("prose");
  });
});

describe("ABOUT-01: Photo placeholder", () => {
  it("PhotoPlaceholder.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/PhotoPlaceholder.astro"))).toBe(true);
  });

  it("contains profile image element", () => {
    const photo = readFile("src/components/PhotoPlaceholder.astro");
    expect(photo).toContain("<img");
  });

  it("has alt text for accessibility", () => {
    const photo = readFile("src/components/PhotoPlaceholder.astro");
    expect(photo).toContain("alt=");
  });

  it("has photo dimensions set", () => {
    const photo = readFile("src/components/PhotoPlaceholder.astro");
    expect(photo).toContain("128px");
  });
});

describe("ABOUT-02: Highlight cards", () => {
  const aboutSection = readFile("src/components/AboutSection.astro");
  const highlightCard = readFile("src/components/HighlightCard.astro");

  it("HighlightCard.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/HighlightCard.astro"))).toBe(true);
  });

  it("HighlightCard defines Props interface", () => {
    expect(highlightCard).toContain("interface Props");
  });

  it("HighlightCard uses h3 element for label", () => {
    expect(highlightCard).toContain("<h3");
  });

  it("AboutSection contains Current Role card with Mindrift", () => {
    expect(aboutSection).toContain('label="Current Role"');
    expect(aboutSection).toContain("Mindrift");
  });

  it("AboutSection contains Education card with Bayes and UCL", () => {
    expect(aboutSection).toContain('label="Education"');
    expect(aboutSection).toContain("Bayes");
    expect(aboutSection).toContain("UCL");
  });

  it("uses responsive grid classes for side-by-side on tablet+", () => {
    expect(aboutSection).toContain("grid-cols-1");
    expect(aboutSection).toContain("md:grid-cols-2");
  });
});

describe("About section integration", () => {
  const indexPage = readFile("src/pages/index.astro");

  it("index.astro imports AboutSection", () => {
    expect(indexPage).toContain("import AboutSection");
  });

  it("renders AboutSection without client: directive", () => {
    expect(indexPage).toContain("<AboutSection");
    expect(indexPage).not.toMatch(/AboutSection\s+client:/);
  });
});
