import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const readFile = (rel: string) =>
  readFileSync(join(ROOT, rel), "utf-8");

describe("EXP-01: Experience timeline", () => {
  const timeline = readFile("src/components/TimelineColumn.astro");
  const cvData = readFile("src/data/cv.ts");

  it("TimelineColumn.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/TimelineColumn.astro"))).toBe(true);
  });

  it("cv.ts contains AI Specialist role title", () => {
    expect(cvData).toContain("AI Specialist");
  });

  it("cv.ts contains Scale AI company", () => {
    expect(cvData).toContain("Scale AI");
  });

  it("cv.ts contains London House Hotel company", () => {
    expect(cvData).toContain("London House Hotel");
  });

  it("cv.ts contains achievements property", () => {
    expect(cvData).toContain("achievements");
  });

  it("cv.ts roles array has 3 entries", () => {
    const titleMatches = cvData.match(/title:/g);
    expect(titleMatches).not.toBeNull();
    // 3 roles each have a title:
    expect(titleMatches!.length).toBeGreaterThanOrEqual(3);
  });

  it("TimelineColumn.astro renders entry.body as a bullet list", () => {
    expect(timeline).toContain("entry.body.length > 0");
    expect(timeline).toContain("<ul");
    expect(timeline).toContain("<li");
  });

  it("TimelineColumn.astro uses color-accent-primary for dot markers", () => {
    expect(timeline).toContain("color-accent-primary");
  });

  it("TimelineColumn.astro uses color-border for spine line", () => {
    expect(timeline).toContain("color-border");
  });
});

describe("EXP-02: Education section", () => {
  const timeline = readFile("src/components/TimelineColumn.astro");
  const cvData = readFile("src/data/cv.ts");

  it("cv.ts contains MSc Business Analytics", () => {
    expect(cvData).toContain("MSc Business Analytics");
  });

  it("cv.ts contains UCL institution", () => {
    expect(cvData).toContain("UCL");
  });

  it("cv.ts contains On track for distinction", () => {
    expect(cvData).toContain("On track for distinction");
  });

  it("cv.ts contains Upper second class honours", () => {
    expect(cvData).toContain("Upper second class honours");
  });

  it("cv.ts contains modules property", () => {
    expect(cvData).toContain("modules");
  });

  it("TimelineColumn.astro renders entry.body items in list elements", () => {
    expect(timeline).toContain("entry.body.map");
    expect(timeline).toContain("list-disc");
  });
});

describe("EXP-03: Skills display", () => {
  const skillsGrid = readFile("src/components/SkillsGrid.astro");
  const cvData = readFile("src/data/cv.ts");

  it("SkillsGrid.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/SkillsGrid.astro"))).toBe(true);
  });

  it("cv.ts contains Languages & Data category", () => {
    expect(cvData).toContain("Languages & Data");
  });

  it("cv.ts contains AI & ML category", () => {
    expect(cvData).toContain("AI & ML");
  });

  it("cv.ts contains Tools & Infrastructure category", () => {
    expect(cvData).toContain("Tools & Infrastructure");
  });

  it("cv.ts contains Python skill", () => {
    expect(cvData).toContain("Python");
  });

  it("SkillsGrid.astro uses rounded-full for badge shape", () => {
    expect(skillsGrid).toContain("rounded-full");
  });

  it("SkillsGrid.astro does NOT contain <progress element", () => {
    expect(skillsGrid).not.toContain("<progress");
  });

  it("SkillsGrid.astro does NOT contain <meter element", () => {
    expect(skillsGrid).not.toContain("<meter");
  });

  it("SkillsGrid.astro uses color-surface for badge background", () => {
    expect(skillsGrid).toContain("color-surface");
  });
});

describe("EXP-04: CV download", () => {
  const downloadButton = readFile("src/components/CVDownloadButton.astro");

  it("CVDownloadButton.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/CVDownloadButton.astro"))).toBe(true);
  });

  it("contains correct href pointing to PDF", () => {
    expect(downloadButton).toContain('href="/Dragos Macsim CV 2026.pdf"');
  });

  it("contains download attribute with exact filename", () => {
    expect(downloadButton).toContain('download="Dragos Macsim CV 2026.pdf"');
  });

  it("contains aria-label attribute", () => {
    expect(downloadButton).toContain("aria-label");
  });

  it("uses color-accent-primary for solid button style", () => {
    expect(downloadButton).toContain("color-accent-primary");
  });

  it("PDF file exists in public directory", () => {
    expect(existsSync(join(ROOT, "public/Dragos Macsim CV 2026.pdf"))).toBe(true);
  });
});

describe("CV section integration", () => {
  const cvSection = readFile("src/components/CVSection.astro");
  const indexPage = readFile("src/pages/index.astro");

  it("CVSection.astro has id='experience'", () => {
    expect(cvSection).toContain('id="experience"');
  });

  it("CVSection.astro has aria-label='Experience and CV'", () => {
    expect(cvSection).toContain('aria-label="Experience and CV"');
  });

  it("CVSection.astro imports TimelineColumn", () => {
    expect(cvSection).toContain("import TimelineColumn");
  });

  it("CVSection.astro imports SkillsGrid", () => {
    expect(cvSection).toContain("import SkillsGrid");
  });

  it("CVSection.astro imports CVDownloadButton", () => {
    expect(cvSection).toContain("import CVDownloadButton");
  });

  it("CVSection.astro uses two-column grid layout", () => {
    expect(cvSection).toContain("md:grid-cols-2");
  });

  it("CVSection.astro maps roles to TimelineEntry", () => {
    expect(cvSection).toContain("roles.map");
  });

  it("CVSection.astro maps education to TimelineEntry", () => {
    expect(cvSection).toContain("education.map");
  });

  it("index.astro imports CVSection", () => {
    expect(indexPage).toContain("import CVSection");
  });

  it("index.astro renders CVSection", () => {
    expect(indexPage).toContain("<CVSection");
  });

  it("index.astro renders CVSection without React island directive", () => {
    expect(indexPage).not.toMatch(/CVSection\s+client:/);
  });

  it("CVSection.astro passes r.achievements as body for experience", () => {
    expect(cvSection).toContain("body: r.achievements");
  });
});

describe("LAYOUT-02: Dot alignment", () => {
  const timeline = readFile("src/components/TimelineColumn.astro");

  it("dot uses left-4 to align with spine", () => {
    expect(timeline).toContain("left-4");
    expect(timeline).toContain("w-2.5 h-2.5 rounded-full");
  });

  it("dot does NOT use left-3 (the misaligned value)", () => {
    expect(timeline).not.toMatch(/left-3.*rounded-full/);
  });

  it("spine uses left-4 matching dot position", () => {
    expect(timeline).toContain("left-4 top-0 bottom-0 w-px");
  });
});
