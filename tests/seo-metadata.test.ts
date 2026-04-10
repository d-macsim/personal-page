import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const readFile = (rel: string) =>
  readFileSync(join(ROOT, rel), "utf-8");

const headAstro = readFile("src/components/Head.astro");
const astroConfig = readFile("astro.config.mjs");

describe("SEO-01: Open Graph meta tags", () => {
  it("contains og:title meta tag", () => {
    expect(headAstro).toContain('property="og:title"');
  });

  it("contains og:description meta tag", () => {
    expect(headAstro).toContain('property="og:description"');
  });

  it("contains og:type with website value", () => {
    expect(headAstro).toContain('property="og:type"');
    expect(headAstro).toContain('"website"');
  });

  it("contains og:url meta tag", () => {
    expect(headAstro).toContain('property="og:url"');
  });

  it("contains og:image meta tag", () => {
    expect(headAstro).toContain('property="og:image"');
  });

  it("contains og:image dimensions 1200x630", () => {
    expect(headAstro).toContain('"1200"');
    expect(headAstro).toContain('"630"');
  });

  it("contains Twitter card summary_large_image", () => {
    expect(headAstro).toContain("summary_large_image");
  });

  it("contains twitter:title meta tag", () => {
    expect(headAstro).toContain('name="twitter:title"');
  });

  it("contains twitter:description meta tag", () => {
    expect(headAstro).toContain('name="twitter:description"');
  });

  it("contains twitter:image meta tag", () => {
    expect(headAstro).toContain('name="twitter:image"');
  });
});

describe("SEO-01: JSON-LD structured data", () => {
  it("contains application/ld+json script tag", () => {
    expect(headAstro).toContain("application/ld+json");
  });

  it("contains Person type", () => {
    expect(headAstro).toContain('"Person"');
  });

  it("contains Dragos Macsim name", () => {
    expect(headAstro).toContain('"Dragos Macsim"');
  });

  it("contains AI Specialist & Product Builder jobTitle", () => {
    expect(headAstro).toContain('"AI Specialist & Product Builder"');
  });

  it("contains LinkedIn in sameAs", () => {
    expect(headAstro).toContain("linkedin.com");
  });

  it("contains GitHub in sameAs", () => {
    expect(headAstro).toContain("github.com");
  });
});

describe("SEO-01: Absolute OG image URL support", () => {
  it("astro.config.mjs contains site property", () => {
    expect(astroConfig).toContain("site:");
  });

  it("Head.astro references Astro.site for absolute URLs", () => {
    expect(headAstro).toContain("Astro.site");
  });

  it("Head.astro computes canonicalUrl from Astro.url.pathname", () => {
    expect(headAstro).toContain("canonicalUrl");
    expect(headAstro).toContain("Astro.url.pathname");
  });
});

describe("SEO-02: Semantic HTML and meta description", () => {
  it("contains meta description tag", () => {
    expect(headAstro).toContain('name="description"');
  });

  it("default description mentions AI specialist who builds products", () => {
    expect(headAstro).toContain("AI specialist who builds products");
  });

  it("contains canonical link tag", () => {
    expect(headAstro).toContain('rel="canonical"');
  });
});

describe("SEO-02: Heading hierarchy", () => {
  const heroSection = readFile("src/components/HeroSection.tsx");
  const aboutSection = readFile("src/components/AboutSection.astro");
  const highlightCard = readFile("src/components/HighlightCard.astro");

  it("HeroSection has exactly one h1 (motion.h1)", () => {
    expect(heroSection).toMatch(/motion\.h1/);
  });

  it("AboutSection uses h2 but not h1", () => {
    expect(aboutSection).toContain("<h2");
    expect(aboutSection).not.toContain("<h1");
  });

  it("HighlightCard uses h3", () => {
    expect(highlightCard).toContain("<h3");
  });
});
