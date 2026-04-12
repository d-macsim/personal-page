import { test, expect } from "@playwright/test";

/**
 * Phase 7 post-fix verification against the LIVE deployed site.
 *
 * Verifies the nav behaviour in both directions:
 *   Homepage → hash anchor: smooth-scrolls in-page (no route change)
 *   /now → hash anchor: navigates back to homepage and lands on anchor
 *   Homepage → /now: real route navigation
 *
 * This covers the bug fixed in commit 5356f48 (was: clicking About from /now
 * did nothing because the scroll handler preventDefault'd on a selector that
 * didn't exist on /now).
 *
 * Runs against the production URL. If the CF Pages deploy is behind, tests
 * may show stale behaviour — set NAV_TEST_BASE to override.
 */

const BASE = process.env.NAV_TEST_BASE ?? "https://dragosmacsim.com";

test.describe("Phase 7 LIVE — nav hash-prefix fix", () => {
  test("homepage: hash links are in-page anchors (no slash prefix)", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    const aboutHref = await page.locator('[data-nav-link]:has-text("About")').first().getAttribute("href");
    expect(aboutHref).toBe("#about");
    const experienceHref = await page.locator('[data-nav-link]:has-text("Experience")').first().getAttribute("href");
    expect(experienceHref).toBe("#experience");
    const nowHref = await page.locator('[data-nav-link]:has-text("Now")').first().getAttribute("href");
    expect(nowHref).toBe("/now");
  });

  test("/now: hash links are prefixed with slash (navigate back to homepage)", async ({ page }) => {
    await page.goto(`${BASE}/now`, { waitUntil: "domcontentloaded" });
    const aboutHref = await page.locator('[data-nav-link]:has-text("About")').first().getAttribute("href");
    expect(aboutHref).toBe("/#about");
    const experienceHref = await page.locator('[data-nav-link]:has-text("Experience")').first().getAttribute("href");
    expect(experienceHref).toBe("/#experience");
    const projectsHref = await page.locator('[data-nav-link]:has-text("Projects")').first().getAttribute("href");
    expect(projectsHref).toBe("/#projects");
    const contactHref = await page.locator('[data-nav-link]:has-text("Contact")').first().getAttribute("href");
    expect(contactHref).toBe("/#contact");
  });

  test("/now: clicking About navigates back to homepage anchor", async ({ page }) => {
    await page.goto(`${BASE}/now`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-nav-link]:has-text("About")').first().click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toBe(`${BASE}/#about`);
    // Confirm we actually landed on the homepage (hero section is present)
    await expect(page.locator("h1").first()).toContainText(/Dragos/);
  });

  test("/now: clicking Experience navigates back to homepage anchor", async ({ page }) => {
    await page.goto(`${BASE}/now`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-nav-link]:has-text("Experience")').first().click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toBe(`${BASE}/#experience`);
  });

  test("/now: clicking Projects navigates back to homepage anchor", async ({ page }) => {
    await page.goto(`${BASE}/now`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-nav-link]:has-text("Projects")').first().click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toBe(`${BASE}/#projects`);
  });

  test("/now: clicking Contact navigates back to homepage anchor", async ({ page }) => {
    await page.goto(`${BASE}/now`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-nav-link]:has-text("Contact")').first().click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toBe(`${BASE}/#contact`);
  });

  test("homepage: clicking Now navigates to /now", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-nav-link]:has-text("Now")').first().click();
    await page.waitForURL(/\/now\/?$/);
    await expect(page.locator("h1")).toContainText(/What I'm doing now/);
  });

  test("homepage: clicking About does NOT change URL path (smooth-scroll in-page)", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-nav-link]:has-text("About")').first().click();
    // After click, the hash may or may not appear in the URL (depends on scrollIntoView),
    // but the path must still be "/"
    const url = new URL(page.url());
    expect(url.pathname).toBe("/");
  });

  test("/now: Now nav link is marked active", async ({ page }) => {
    await page.goto(`${BASE}/now`, { waitUntil: "domcontentloaded" });
    const nowLink = page.locator('[data-nav-link][href="/now"]').first();
    await expect(nowLink).toHaveAttribute("data-active", "true");
  });

  test("/now: manual Cloudflare Analytics beacon with expected token is present (PROD)", async ({ page }) => {
    // Asserts the build-time beacon wired in BaseLayout.astro carries the expected token.
    // We explicitly DO NOT assert total beacon count here: Cloudflare Pages may auto-inject
    // its own beacon at the CDN layer (separate token) unless explicitly disabled in the
    // Pages dashboard. The thing that must be true for ANALYTICS-01 is that OUR build-time
    // beacon (with OUR token) is reaching production — not whether CF auto-inject is on.
    await page.goto(`${BASE}/now`, { waitUntil: "domcontentloaded" });
    const expectedToken = "19ed33f2eacb49aaa4002ed389ee6f6d";
    const beacons = page.locator('script[src*="cloudflareinsights.com/beacon.min.js"]');
    const count = await beacons.count();
    expect(count).toBeGreaterThanOrEqual(1);
    // At least one beacon must carry the expected token from BaseLayout.astro
    let foundExpected = false;
    for (let i = 0; i < count; i++) {
      const dataAttr = await beacons.nth(i).getAttribute("data-cf-beacon");
      if (dataAttr && dataAttr.includes(expectedToken)) {
        foundExpected = true;
        break;
      }
    }
    expect(foundExpected).toBe(true);
  });
});
