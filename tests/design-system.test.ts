import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const globalCss = readFileSync(join(ROOT, "src/styles/global.css"), "utf-8");

describe("Design Token System", () => {
  it("contains @theme block", () => {
    expect(globalCss).toContain("@theme {");
  });

  it("imports tailwindcss", () => {
    expect(globalCss).toContain('@import "tailwindcss"');
  });

  it("imports @fontsource-variable/inter", () => {
    expect(globalCss).toContain('@import "@fontsource-variable/inter"');
  });

  it("declares dark mode custom variant", () => {
    expect(globalCss).toContain("@custom-variant dark");
  });
});

describe("Dark mode color tokens (default)", () => {
  it("defines --color-base: #0a0a0f", () => {
    expect(globalCss).toContain("--color-base: #0a0a0f");
  });

  it("defines --color-surface: #111118", () => {
    expect(globalCss).toContain("--color-surface: #111118");
  });

  it("defines --color-border: #27272a", () => {
    expect(globalCss).toContain("--color-border: #27272a");
  });

  it("defines --color-text: #e4e4e7", () => {
    expect(globalCss).toContain("--color-text: #e4e4e7");
  });

  it("defines --color-text-muted: #71717a", () => {
    expect(globalCss).toContain("--color-text-muted: #71717a");
  });

  it("defines --color-accent-primary: #6366f1", () => {
    expect(globalCss).toContain("--color-accent-primary: #6366f1");
  });

  it("defines --color-accent-primary-hover: #818cf8", () => {
    expect(globalCss).toContain("--color-accent-primary-hover: #818cf8");
  });

  it("defines --color-accent-primary-press: #4f46e5", () => {
    expect(globalCss).toContain("--color-accent-primary-press: #4f46e5");
  });

  it("defines --color-accent-secondary: #f59e0b", () => {
    expect(globalCss).toContain("--color-accent-secondary: #f59e0b");
  });
});

describe("Light mode color overrides", () => {
  const lightStart = globalCss.indexOf(".light {");
  const lightBlock = globalCss.slice(lightStart, globalCss.indexOf("}", lightStart) + 1);

  it("contains .light block", () => {
    expect(globalCss).toContain(".light {");
  });

  it("overrides --color-base: #fafafa", () => {
    expect(lightBlock).toContain("--color-base: #fafafa");
  });

  it("overrides --color-surface: #ffffff", () => {
    expect(lightBlock).toContain("--color-surface: #ffffff");
  });

  it("overrides --color-border: #e4e4e7", () => {
    expect(lightBlock).toContain("--color-border: #e4e4e7");
  });

  it("overrides --color-text: #18181b", () => {
    expect(lightBlock).toContain("--color-text: #18181b");
  });

  it("overrides --color-accent-primary: #4f46e5", () => {
    expect(lightBlock).toContain("--color-accent-primary: #4f46e5");
  });

  it("overrides --color-accent-primary-hover: #6366f1", () => {
    expect(lightBlock).toContain("--color-accent-primary-hover: #6366f1");
  });

  it("overrides --color-accent-primary-press: #3730a3", () => {
    expect(lightBlock).toContain("--color-accent-primary-press: #3730a3");
  });

  it("overrides --color-accent-secondary: #d97706", () => {
    expect(lightBlock).toContain("--color-accent-secondary: #d97706");
  });
});

describe("Typography tokens", () => {
  it("uses Inter Variable font family", () => {
    expect(globalCss).toContain('"Inter Variable"');
  });

  it("defines --font-size-label: 0.875rem", () => {
    expect(globalCss).toContain("--font-size-label: 0.875rem");
  });

  it("defines --font-size-body: clamp(1rem, 2vw, 1.125rem)", () => {
    expect(globalCss).toContain("--font-size-body: clamp(1rem, 2vw, 1.125rem)");
  });

  it("defines --font-size-heading: clamp(1.25rem, 3vw, 2.5rem)", () => {
    expect(globalCss).toContain("--font-size-heading: clamp(1.25rem, 3vw, 2.5rem)");
  });

  it("defines --font-size-display: clamp(2.5rem, 5vw, 4rem)", () => {
    expect(globalCss).toContain("--font-size-display: clamp(2.5rem, 5vw, 4rem)");
  });
});

describe("Spacing and breakpoints", () => {
  it("defines --spacing: 0.25rem", () => {
    expect(globalCss).toContain("--spacing: 0.25rem");
  });

  it("defines --breakpoint-sm: 40rem", () => {
    expect(globalCss).toContain("--breakpoint-sm: 40rem");
  });

  it("defines --breakpoint-md: 48rem", () => {
    expect(globalCss).toContain("--breakpoint-md: 48rem");
  });

  it("defines --breakpoint-lg: 80rem", () => {
    expect(globalCss).toContain("--breakpoint-lg: 80rem");
  });
});

describe("Base styles", () => {
  it("applies 300ms ease transition for theme switching", () => {
    expect(globalCss).toContain("transition: background-color 300ms ease, color 300ms ease");
  });

  it("sets desktop body line-height to 1.7", () => {
    expect(globalCss).toContain("line-height: 1.7");
  });

  it("sets mobile body line-height to 1.6", () => {
    expect(globalCss).toContain("line-height: 1.6");
  });

  it("sets prose max-width to 42.5rem (680px)", () => {
    expect(globalCss).toContain("max-width: 42.5rem");
  });
});

describe("No legacy config files", () => {
  it("does not have tailwind.config.js", () => {
    expect(existsSync(join(ROOT, "tailwind.config.js"))).toBe(false);
  });

  it("does not have tailwind.config.mjs", () => {
    expect(existsSync(join(ROOT, "tailwind.config.mjs"))).toBe(false);
  });
});
