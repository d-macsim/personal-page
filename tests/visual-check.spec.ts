import { test, expect } from "@playwright/test";

const BASE = "http://localhost:4321";

test.describe("Phase 1 Visual Verification (dark system pref)", () => {
  test.use({ colorScheme: "dark" });

  test("dark mode is default with correct colors", async ({ page }) => {
    await page.goto(BASE);
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    const body = page.locator("body");
    const bgColor = await body.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    // #0a0a0f = rgb(10, 10, 15)
    expect(bgColor).toBe("rgb(10, 10, 15)");

    const textColor = await body.evaluate((el) => getComputedStyle(el).color);
    // #e4e4e7 = rgb(228, 228, 231)
    expect(textColor).toBe("rgb(228, 228, 231)");
  });

  test("Inter font is loaded", async ({ page }) => {
    await page.goto(BASE);
    const fontFamily = await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fontFamily.toLowerCase()).toContain("inter");
  });

  test("theme toggle switches to light mode with transition configured", async ({
    page,
  }) => {
    await page.goto(BASE);
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    // Verify transition property is configured on body
    const body = page.locator("body");
    const transition = await body.evaluate(
      (el) => getComputedStyle(el).transitionProperty
    );
    expect(transition).toContain("color");

    const duration = await body.evaluate(
      (el) => getComputedStyle(el).transitionDuration
    );
    // Should be 300ms = 0.3s
    expect(duration).toContain("0.3s");

    // Click toggle
    await page.click("#theme-toggle");
    await expect(html).toHaveClass(/light/);
    await expect(html).not.toHaveClass(/dark/);

    // Verify light mode colors after transition
    await page.waitForTimeout(350);
    const bgColor = await body.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    // #fafafa = rgb(250, 250, 250)
    expect(bgColor).toBe("rgb(250, 250, 250)");
  });

  test("theme persists across refresh (no FOUC)", async ({ page }) => {
    await page.goto(BASE);
    // Switch to light
    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/light/);

    // Refresh
    await page.reload();
    // Should still be light immediately (FOUC prevention)
    await expect(page.locator("html")).toHaveClass(/light/);
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("clearing localStorage defaults to dark (follows system)", async ({
    page,
  }) => {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Phase 1 Visual Verification (light system pref)", () => {
  test.use({ colorScheme: "light" });

  test("respects system light preference on first visit", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("html")).toHaveClass(/light/);
  });
});

test.describe("Phase 1 Responsive Layout", () => {
  test("320px mobile: 16px padding", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(BASE);
    const padding = await page
      .locator("main")
      .evaluate((el) => getComputedStyle(el).paddingLeft);
    expect(padding).toBe("16px");
  });

  test("768px tablet: 32px padding", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE);
    const padding = await page
      .locator("main")
      .evaluate((el) => getComputedStyle(el).paddingLeft);
    expect(padding).toBe("32px");
  });

  test("1280px desktop: 1100px max-width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE);
    const maxWidth = await page
      .locator("main")
      .evaluate((el) => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe("1100px");
  });
});
