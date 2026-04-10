// src/data/projects.ts — Typed project content
// All project data lives here; components only render structure.

export interface TechBadge {
  readonly label: string;
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly techStack: readonly TechBadge[];
  readonly url: string;
  readonly urlLabel: string;
}

export const projects: readonly Project[] = [
  {
    id: "mytai",
    title: "mytai",
    tagline: "Your AI personal trainer",
    description:
      "An all-in-one AI personal trainer app built with React Native and Expo. Combat sports form analysis using on-device AI, gym workout logging, calorie tracking, weight tracking, and mobility exercises — privacy-first with on-device processing.",
    bullets: [
      "On-device AI form analysis for combat sports — no data leaves your device",
      "Full workout logging: gym sessions, calorie tracking, weight tracking",
      "iOS available now — Android coming soon",
    ],
    techStack: [
      { label: "React Native" },
      { label: "Expo" },
      { label: "On-device AI" },
      { label: "TypeScript" },
      { label: "iOS" },
    ],
    url: "https://mytai.uk",
    urlLabel: "Visit mytai.uk",
  },
] as const satisfies readonly Project[];
