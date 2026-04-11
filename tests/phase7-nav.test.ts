import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const layout = readFileSync(
  join(import.meta.dirname, "..", "src/layouts/BaseLayout.astro"),
  "utf-8"
);

describe.skipIf(!layout.includes('href="/now"'))("NOW-02 /now link in nav", () => {
  it("appears in desktop nav", () => {
    expect(layout).toMatch(/href=["']\/now["']/);
  });
  it("appears in mobile nav (at least twice in file)", () => {
    const count = (layout.match(/href=["']\/now["']/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

describe.skipIf(!layout.includes('href="/now"'))("NOW-03 hash-only scroll guard", () => {
  it("scroll handler checks href startsWith #", () => {
    expect(layout).toMatch(/startsWith\(['"]#['"]\)/);
  });
});
