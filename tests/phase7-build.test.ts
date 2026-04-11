import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");

const pngMagic = (buf: Buffer) =>
  buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;

describe.skipIf(!existsSync(DIST))("SEO-05 sitemap files in dist", () => {
  it("sitemap-index.xml exists and contains site URL", () => {
    const p = join(DIST, "sitemap-index.xml");
    expect(existsSync(p)).toBe(true);
    expect(readFileSync(p, "utf-8")).toContain("dragosmacsim.com");
  });
  it("sitemap-0.xml exists", () => {
    expect(existsSync(join(DIST, "sitemap-0.xml"))).toBe(true);
  });
});

describe.skipIf(!existsSync(join(DIST, "og")))("OG-02/03 generated PNG files", () => {
  for (const slug of ["home", "now"] as const) {
    it(`dist/og/${slug}.png exists, is PNG, >5KB`, () => {
      const p = join(DIST, "og", `${slug}.png`);
      expect(existsSync(p)).toBe(true);
      const buf = readFileSync(p);
      expect(pngMagic(buf)).toBe(true);
      expect(statSync(p).size).toBeGreaterThan(5_000);
    });
  }
});
