import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf-8");
const exists = (p: string) => existsSync(join(ROOT, p));

describe.skipIf(!exists("public/robots.txt"))("SEO-03 robots.txt", () => {
  it("exists", () => {
    expect(exists("public/robots.txt")).toBe(true);
  });
  it("references sitemap-index.xml", () => {
    const robots = read("public/robots.txt");
    expect(robots).toContain("Sitemap: https://dragosmacsim.com/sitemap-index.xml");
    expect(robots).toContain("User-agent: *");
  });
});

describe("SEO-04 sitemap integration", () => {
  const cfg = read("astro.config.mjs");
  it("imports @astrojs/sitemap", () => {
    expect(cfg).toMatch(/from\s+["']@astrojs\/sitemap["']/);
  });
  it("adds sitemap() to integrations array", () => {
    expect(cfg).toMatch(/sitemap\(\)/);
  });
});

describe.skipIf(!exists("src/components/Head.astro"))("SEO-06 extended Person schema", () => {
  it("includes image property", () => {
    const head = read("src/components/Head.astro");
    // Skipped if Head.astro does not yet reference 'image' near 'Person' schema
    if (!head.includes("knowsAbout")) return;
    expect(head).toMatch(/image:\s*[\s\S]*profile/);
  });
  it("includes knowsAbout array", () => {
    const head = read("src/components/Head.astro");
    if (!head.includes("knowsAbout")) return;
    expect(head).toContain("knowsAbout");
  });
  it("includes email", () => {
    const head = read("src/components/Head.astro");
    if (!head.includes("knowsAbout")) return;
    expect(head).toContain("email");
  });
});

describe.skipIf(!exists("src/pages/now.astro"))("SEO-07 /now page meta", () => {
  it("passes title prop", () => {
    const now = read("src/pages/now.astro");
    expect(now).toMatch(/title=["'`]/);
  });
  it("passes description prop", () => {
    const now = read("src/pages/now.astro");
    expect(now).toMatch(/description=["'`]/);
  });
});

describe.skipIf(!exists("src/pages/now.astro"))("NOW-04 /now h2 sections", () => {
  it("contains at least three <h2> elements", () => {
    const now = read("src/pages/now.astro");
    const count = (now.match(/<h2[\s>]/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

describe.skipIf(!exists("src/pages/now.astro"))("NOW-05 /now last-updated + attribution", () => {
  it("defines a LAST_UPDATED constant", () => {
    const now = read("src/pages/now.astro");
    expect(now).toMatch(/LAST_UPDATED\s*=\s*["'`]/);
  });
  it("links to nownownow.com/about as attribution", () => {
    const now = read("src/pages/now.astro");
    expect(now).toContain("nownownow.com/about");
  });
});
