import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const globalCss = readFileSync(join(ROOT, "src/styles/global.css"), "utf-8");

const readComponent = (name: string) =>
  readFileSync(join(ROOT, "src/components", name), "utf-8");

describe("Scroll-Reveal CSS — global.css", () => {
  it("Test 1: contains @keyframes reveal-up with opacity: 0 and translateY(16px) in from block", () => {
    expect(globalCss).toContain("@keyframes reveal-up");
    expect(globalCss).toContain("opacity: 0");
    expect(globalCss).toContain("translateY(16px)");
  });

  it("Test 2: contains .reveal class with animation-timeline: view() and animation-range: entry", () => {
    expect(globalCss).toContain(".reveal");
    expect(globalCss).toContain("animation-timeline: view()");
    expect(globalCss).toContain("animation-range: entry");
  });

  it("Test 3: contains .reveal-stagger class with animation-timeline: view()", () => {
    expect(globalCss).toContain(".reveal-stagger");
    // reveal-stagger children inherit animation-timeline: view() from base rule
    const revealStaggerIdx = globalCss.indexOf(".reveal-stagger");
    expect(revealStaggerIdx).toBeGreaterThan(-1);
    const afterStagger = globalCss.slice(revealStaggerIdx);
    expect(afterStagger).toContain("animation-timeline: view()");
  });

  it("Test 4: contains @supports not (animation-timeline: view()) fallback with opacity: 1 and animation: none", () => {
    expect(globalCss).toContain(
      "@supports not (animation-timeline: view())"
    );
    const fallbackIdx = globalCss.indexOf(
      "@supports not (animation-timeline: view())"
    );
    const fallbackBlock = globalCss.slice(fallbackIdx, fallbackIdx + 300);
    expect(fallbackBlock).toContain("opacity: 1");
    expect(fallbackBlock).toContain("animation: none");
  });

  it("Test 5: contains prefers-reduced-motion: reduce rule covering both .reveal and .reveal-stagger", () => {
    // The reduced-motion block inside @supports covers both classes
    const reducedMotionIdx = globalCss.lastIndexOf(
      "prefers-reduced-motion: reduce"
    );
    const reducedBlock = globalCss.slice(reducedMotionIdx, reducedMotionIdx + 300);
    expect(reducedBlock).toContain(".reveal");
    expect(reducedBlock).toContain(".reveal-stagger");
  });

  it("Test 6: does NOT contain .reveal applied to #hero or HeroSection", () => {
    // No reveal class should be associated with #hero or HeroSection in global.css
    expect(globalCss).not.toContain("#hero.reveal");
    expect(globalCss).not.toContain(".reveal #hero");
    expect(globalCss).not.toContain("HeroSection");
  });

  it("Test 7: stagger rules use animation-range on nth-child selectors (NOT animation-delay)", () => {
    // nth-child stagger rules must use animation-range, not animation-delay
    expect(globalCss).toContain("nth-child");
    // Should contain animation-range with nth-child stagger
    expect(globalCss).toContain(":nth-child(1)");
    expect(globalCss).toContain(":nth-child(2)");
    // Ensure no animation-delay is used for stagger (animation-delay is forbidden per RESEARCH.md Pitfall 4)
    const supportsIdx = globalCss.indexOf("@supports (animation-timeline: view())");
    const supportsBlock = globalCss.slice(supportsIdx);
    // Within the @supports block, nth-child rules should not use animation-delay
    const nthChildIdx = supportsBlock.indexOf(":nth-child(2)");
    const nthChildContext = supportsBlock.slice(nthChildIdx, nthChildIdx + 100);
    expect(nthChildContext).not.toContain("animation-delay");
    expect(nthChildContext).toContain("animation-range");
  });
});

describe("Scroll-Reveal CSS — component classes", () => {
  it("Test 8: AboutSection.astro contains class attribute with reveal", () => {
    const about = readComponent("AboutSection.astro");
    expect(about).toMatch(/class="[^"]*reveal/);
  });

  it("Test 9: TimelineColumn.astro contains class attribute with reveal-stagger", () => {
    const timeline = readComponent("TimelineColumn.astro");
    expect(timeline).toMatch(/class="[^"]*reveal-stagger/);
  });

  it("Test 10: SkillsGrid.astro contains class attribute with reveal-stagger", () => {
    const skills = readComponent("SkillsGrid.astro");
    expect(skills).toMatch(/class="[^"]*reveal-stagger/);
  });

  it("Test 11: ProjectsSection.astro contains class attribute with reveal", () => {
    const projects = readComponent("ProjectsSection.astro");
    expect(projects).toMatch(/class="[^"]*reveal/);
  });

  it("Test 12: ContactSection.astro contains class attribute with reveal", () => {
    const contact = readComponent("ContactSection.astro");
    expect(contact).toMatch(/class="[^"]*reveal/);
  });

  it("Test 13: CVSection.astro contains class attribute with reveal", () => {
    const cv = readComponent("CVSection.astro");
    expect(cv).toMatch(/class="[^"]*reveal/);
  });
});
