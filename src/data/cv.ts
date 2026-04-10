// src/data/cv.ts — Typed CV content for Dragos Macsim
// All CV data lives here; components only render structure.

export interface Role {
  title: string;
  company: string;
  dateRange: string;
  achievements: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  dateRange: string;
  detail: string;
  modules?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const roles: readonly Role[] = [
  {
    title: "AI Specialist",
    company: "Mindrift",
    dateRange: "Feb 2026 -- Present",
    achievements: [
      "Automated web scraping and data extraction pipelines for AI training datasets",
      "AI/human hybrid QA workflows for model output evaluation",
      "Cross-functional collaboration on data quality standards",
    ],
  },
  {
    title: "Data Analyst",
    company: "Scale AI",
    dateRange: "Nov 2024 -- Nov 2025",
    achievements: [
      "Benchmarked text-to-image models across quality, coherence, and instruction-following metrics",
      "Applied RAG techniques to improve conversational AI evaluation pipelines",
      "Evaluated model outputs for alignment, safety, and factual accuracy",
    ],
  },
  {
    title: "Guest Relations Manager",
    company: "London House Hotel",
    dateRange: "May 2023 -- Present",
    achievements: [
      "Built Python automations reducing manual reporting time by significant margin",
      "Maintained Excel-based operational reporting dashboards",
    ],
  },
] as const satisfies readonly Role[];

export const education: readonly EducationEntry[] = [
  {
    degree: "MSc Business Analytics",
    institution: "Bayes Business School, City, University of London",
    dateRange: "2024 -- 2026",
    detail: "On track for distinction",
    modules: ["Network Analytics", "Deep Learning", "ML", "Revenue Management"],
  },
  {
    degree: "BSc Information Management for Business",
    institution: "UCL",
    dateRange: "2022 -- 2025",
    detail: "Upper second class honours (2:1)",
  },
] as const satisfies readonly EducationEntry[];

export const skillCategories: readonly SkillCategory[] = [
  {
    category: "Languages & Data",
    skills: ["Python", "R", "SQL", "Excel"],
  },
  {
    category: "AI & ML",
    skills: ["RAG", "LLM Evaluation", "Deep Learning", "BeautifulSoup", "Selenium"],
  },
  {
    category: "Tools & Infrastructure",
    skills: ["Tableau", "Docker", "Ubuntu Server", "Git"],
  },
] as const satisfies readonly SkillCategory[];
