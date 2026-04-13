import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const readFile = (rel: string) =>
  readFileSync(join(ROOT, rel), "utf-8");

// PROJ-01: mytai card with description, tech stack summary, and link to mytai.uk
describe("PROJ-01: mytai project card", () => {
  const projectCard = readFile("src/components/ProjectCard.astro");
  const projectsData = readFile("src/data/projects.ts");

  it("ProjectCard.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/ProjectCard.astro"))).toBe(true);
  });

  it("projects.ts contains mytai title", () => {
    expect(projectsData).toContain('title: "mytai"');
  });

  it("projects.ts contains mytai.uk URL", () => {
    expect(projectsData).toContain("https://mytai.uk");
  });

  it("projects.ts exports typed Project interface", () => {
    expect(projectsData).toContain("export interface Project");
  });

  it("projects.ts uses immutable as const satisfies pattern", () => {
    expect(projectsData).toContain("as const satisfies");
  });

  it("ProjectCard contains project image or preview element", () => {
    expect(projectCard).toContain('aria-label');
  });

  it("ProjectCard contains visual accent element", () => {
    expect(projectCard).toContain("rgba(");
  });

  it("ProjectCard contains tech stack badge styling matching SkillsGrid", () => {
    expect(projectCard).toContain("rounded-full text-sm font-medium");
  });

  it("ProjectCard contains CTA link with target blank and rel", () => {
    expect(projectCard).toContain('target="_blank"');
    expect(projectCard).toContain('rel="noopener noreferrer"');
  });

  it("ProjectCard CTA uses accent-primary background", () => {
    expect(projectCard).toContain("var(--color-accent-primary)");
  });
});

// PROJ-02: Structure allows adding more project cards
describe("PROJ-02: Scalable projects structure", () => {
  const projectsSection = readFile("src/components/ProjectsSection.astro");
  const projectsData = readFile("src/data/projects.ts");

  it("ProjectsSection.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/ProjectsSection.astro"))).toBe(true);
  });

  it("ProjectsSection uses grid layout", () => {
    expect(projectsSection).toContain("grid grid-cols-1");
  });

  it("ProjectsSection maps over projects array", () => {
    expect(projectsSection).toMatch(/projects\.map/);
  });

  it("projects.ts exports a readonly array", () => {
    expect(projectsData).toContain("readonly Project[]");
  });

  it("ProjectsSection has id='projects'", () => {
    expect(projectsSection).toContain('id="projects"');
  });
});

// CONT-01: Contact section with email, LinkedIn, and GitHub links
describe("CONT-01: Contact section", () => {
  const contactSection = readFile("src/components/ContactSection.astro");
  const contactData = readFile("src/data/contact.ts");

  it("ContactSection.astro exists", () => {
    expect(existsSync(join(ROOT, "src/components/ContactSection.astro"))).toBe(true);
  });

  it("contact.ts contains email iconType", () => {
    expect(contactData).toContain('iconType: "email"');
  });

  it("contact.ts contains linkedin iconType", () => {
    expect(contactData).toContain('iconType: "linkedin"');
  });

  it("contact.ts contains github iconType", () => {
    expect(contactData).toContain('iconType: "github"');
  });

  it("contact.ts contains mailto: scheme", () => {
    expect(contactData).toContain("mailto:");
  });

  it("contact.ts uses immutable as const satisfies pattern", () => {
    expect(contactData).toContain("as const satisfies");
  });

  it("ContactSection has id='contact'", () => {
    expect(contactSection).toContain('id="contact"');
  });

  it("ContactSection contains Get in Touch heading", () => {
    expect(contactSection).toContain("Get in Touch");
  });

  it("ContactSection external links have rel noopener noreferrer", () => {
    expect(contactSection).toContain("noopener noreferrer");
  });

  it("ContactSection contains aria-hidden SVG icons", () => {
    expect(contactSection).toContain('aria-hidden="true"');
  });
});

// CONT-02: Contact reachable from any section (persistent nav)
describe("CONT-02: Persistent navigation", () => {
  const layout = readFile("src/layouts/BaseLayout.astro");
  const indexPage = readFile("src/pages/index.astro");

  it("BaseLayout nav has aria-label Main navigation", () => {
    expect(layout).toContain('aria-label="Main navigation"');
  });

  it("Nav contains About anchor link", () => {
    expect(layout).toContain('#about');
  });

  it("Nav contains Experience anchor link", () => {
    expect(layout).toContain('#experience');
  });

  it("Nav contains Projects anchor link", () => {
    expect(layout).toContain('#projects');
  });

  it("Nav contains Contact anchor link", () => {
    expect(layout).toContain('#contact');
  });

  it("Nav has hamburger button with aria-label", () => {
    expect(layout).toContain('aria-label="Open navigation menu"');
  });

  it("Nav has hamburger button with aria-expanded", () => {
    expect(layout).toContain('aria-expanded="false"');
  });

  it("Nav uses Intersection Observer for active state", () => {
    expect(layout).toContain("IntersectionObserver");
  });

  it("Nav uses smooth scrollIntoView (not CSS scroll-behavior)", () => {
    expect(layout).toContain("scrollIntoView");
    expect(layout).not.toContain("scroll-behavior: smooth");
  });

  it("index.astro renders ProjectsSection", () => {
    expect(indexPage).toContain("ProjectsSection");
  });

  it("index.astro renders ContactSection", () => {
    expect(indexPage).toContain("ContactSection");
  });

  it("AboutSection has id='about' for nav anchor", () => {
    const about = readFile("src/components/AboutSection.astro");
    expect(about).toContain('id="about"');
  });
});
