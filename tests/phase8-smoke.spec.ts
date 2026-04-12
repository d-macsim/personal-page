import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 8 — Smoke + Accessibility", () => {

  test("homepage loads with no critical a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    expect(critical).toEqual([]);
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

  test("/now page loads with no critical a11y violations", async ({ page }) => {
    await page.goto("/now");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    expect(critical).toEqual([]);
  });

  test("404 page renders branded content", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);

    await expect(page.locator("text=Page not found")).toBeVisible();
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });

});
