import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const toggleContent = readFileSync(join(ROOT, "src/components/ThemeToggle.astro"), "utf-8");
const headContent = readFileSync(join(ROOT, "src/components/Head.astro"), "utf-8");
const layoutContent = readFileSync(join(ROOT, "src/layouts/BaseLayout.astro"), "utf-8");

describe("Theme Toggle Component", () => {
  it("has theme-toggle button id", () => {
    expect(toggleContent).toContain('id="theme-toggle"');
  });

  it("has 44px minimum touch target", () => {
    expect(toggleContent).toContain("min-w-[44px]");
    expect(toggleContent).toContain("min-h-[44px]");
  });

  it("has aria-label for accessibility", () => {
    expect(toggleContent).toContain("aria-label=");
  });

  it("has sun icon for dark mode", () => {
    expect(toggleContent).toContain('id="icon-sun"');
  });

  it("has moon icon for light mode", () => {
    expect(toggleContent).toContain('id="icon-moon"');
  });

  it("persists theme to localStorage", () => {
    expect(toggleContent).toContain('localStorage.setItem("theme"');
  });

  it("toggles classList for theme switching", () => {
    expect(toggleContent).toContain("classList.remove");
    expect(toggleContent).toContain("classList.add");
  });

  it("updates aria-label dynamically", () => {
    expect(toggleContent).toContain("updateAriaLabel");
  });
});

describe("FOUC Prevention Script", () => {
  it("uses is:inline for synchronous execution", () => {
    expect(headContent).toContain("is:inline");
  });

  it("reads theme from localStorage", () => {
    expect(headContent).toContain('localStorage.getItem("theme")');
  });

  it("checks system color-scheme preference", () => {
    expect(headContent).toContain("prefers-color-scheme");
  });

  it("can set dark class on document", () => {
    expect(headContent).toContain('classList.add("dark")');
  });

  it("can set light class on document", () => {
    expect(headContent).toContain('classList.add("light")');
  });

  it("includes viewport meta tag", () => {
    expect(headContent).toContain('name="viewport"');
    expect(headContent).toContain("width=device-width");
  });
});

describe("BaseLayout", () => {
  it("imports global.css", () => {
    expect(layoutContent).toContain("global.css");
  });

  it("imports @fontsource-variable/inter", () => {
    expect(layoutContent).toContain("@fontsource-variable/inter");
  });

  it("includes Head component", () => {
    expect(layoutContent).toContain("Head");
  });

  it("includes ThemeToggle component", () => {
    expect(layoutContent).toContain("ThemeToggle");
  });

  it("uses max-w-[1100px] content constraint", () => {
    expect(layoutContent).toContain("max-w-[1100px]");
  });

  it("has responsive padding (mobile)", () => {
    expect(layoutContent).toContain("px-4");
  });

  it("has responsive padding (tablet)", () => {
    expect(layoutContent).toContain("md:px-8");
  });

  it("has responsive padding (desktop)", () => {
    expect(layoutContent).toContain("lg:px-12");
  });

  it("sets lang attribute to en", () => {
    expect(layoutContent).toContain('lang="en"');
  });

  it("defaults to dark mode class", () => {
    expect(layoutContent).toContain('class="dark"');
  });
});
