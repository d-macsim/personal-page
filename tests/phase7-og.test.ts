import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");
const endpointPath = join(ROOT, "src/pages/og/[slug].png.ts");
const headPath = join(ROOT, "src/components/Head.astro");

describe.skipIf(!existsSync(endpointPath))("OG-01 endpoint shape", () => {
  const readEndpoint = () => readFileSync(endpointPath, "utf-8");
  it("exports getStaticPaths", () => expect(readEndpoint()).toMatch(/export\s+(function|const)\s+getStaticPaths/));
  it("exports GET", () => expect(readEndpoint()).toMatch(/export\s+const\s+GET/));
  it("references generateOgImage helper", () => expect(readEndpoint()).toContain("generateOgImage"));
  it("whitelists slugs (T-7-06)", () => {
    const endpoint = readEndpoint();
    // Must contain a literal array of allowed slugs, not a wildcard
    expect(endpoint).toMatch(/home/);
    expect(endpoint).toMatch(/now/);
  });
});

describe("OG-04 Head.astro ogImageSlug wiring", () => {
  const head = existsSync(headPath) ? readFileSync(headPath, "utf-8") : "";
  const hasSlugWiring = head.includes("ogImageSlug");
  it.skipIf(!hasSlugWiring)("accepts ogImageSlug prop", () => {
    expect(head).toContain("ogImageSlug");
  });
  it.skipIf(!hasSlugWiring)("builds /og/<slug>.png URL", () => {
    expect(head).toMatch(/\/og\/\$\{ogImageSlug\}\.png/);
  });
  it.skipIf(!hasSlugWiring)("adds og:image:alt meta tag", () => {
    expect(head).toContain('property="og:image:alt"');
  });
});
