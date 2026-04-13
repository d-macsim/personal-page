import { test, expect } from "@playwright/test";

test.describe("Phase 8 — Smoke + Accessibility", () => {

  test("homepage loads and displays hero content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1")).toBeVisible();
  });

  test("theme toggle switches the HTML class", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");

    // Click the theme toggle button
    await page.locator("#theme-toggle").click();
    await page.waitForTimeout(100);

    const newClass = await html.getAttribute("class");
    expect(newClass).not.toBe(initialClass);

    // Verify it toggled between dark and light
    if (initialClass?.includes("dark")) {
      expect(newClass).toContain("light");
    } else {
      expect(newClass).toContain("dark");
    }
  });

  test("contact section is reachable via nav click", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Click the Contact nav link (desktop)
    await page
      .locator('[data-nav-link][href="#contact"], [data-nav-link][href="/#contact"]')
      .first()
      .click();
    await page.waitForTimeout(600);

    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeInViewport();
  });

  test("CV download link is present and points to a PDF", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const downloadLinks = page.locator("a[download]");
    const count = await downloadLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Every download link must point to a PDF
    for (let i = 0; i < count; i++) {
      const href = await downloadLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/\.pdf$/i);
    }
  });

  test("/now page loads with visible heading", async ({ page }) => {
    await page.goto("/now");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1")).toBeVisible();
  });

  test("experience timeline shows achievement bullets", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const bullets = page.locator("#experience ul.list-disc li");
    const count = await bullets.count();
    // 3 roles with 2+ achievements each = at least 6 bullets
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test("nav hash link from /now navigates to homepage section", async ({ page }) => {
    await page.goto("/now");
    await page.waitForLoadState("domcontentloaded");

    // Click the Contact nav link — should navigate to /#contact
    await page.locator('[data-nav-link][href="#contact"], [data-nav-link][href="/#contact"]').first().click();

    // Wait for navigation to homepage with hash
    await page.waitForURL("**/#contact", { timeout: 5000 });
    await page.waitForLoadState("domcontentloaded");

    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
  });

});
