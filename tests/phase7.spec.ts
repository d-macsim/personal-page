import { test, expect } from "@playwright/test";
const BASE = "http://localhost:4321";

test.describe("Phase 7 — Discoverability", () => {
  test("NOW-01 /now page renders h1", async ({ page }) => {
    await page.goto(`${BASE}/now`);
    await expect(page.locator("h1")).toContainText(/now/i);
  });

  test("OG-05 /og/home.png endpoint serves PNG", async ({ request }) => {
    const res = await request.get(`${BASE}/og/home.png`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    const body = await res.body();
    expect(body.length).toBeGreaterThan(5_000);
  });

  test("OG-05 /og/unknown.png rejected (T-7-06 slug allowlist)", async ({ request }) => {
    const res = await request.get(`${BASE}/og/unknown.png`);
    expect(res.status()).toBe(404);
  });
});
