import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const layout = readFileSync(
  join(import.meta.dirname, "..", "src/layouts/BaseLayout.astro"),
  "utf-8"
);

describe.skipIf(!layout.includes("cloudflareinsights"))("ANALYTICS-01 CF beacon", () => {
  it("references beacon.min.js", () => {
    expect(layout).toContain("static.cloudflareinsights.com/beacon.min.js");
  });
  it("is guarded by import.meta.env.PROD", () => {
    expect(layout).toContain("import.meta.env.PROD");
  });
  it("references PUBLIC_CF_ANALYTICS_TOKEN", () => {
    expect(layout).toContain("PUBLIC_CF_ANALYTICS_TOKEN");
  });
});
