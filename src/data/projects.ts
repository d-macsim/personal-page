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
  {
    id: "homelab",
    title: "Homelab",
    tagline: "Self-hosted infrastructure",
    description:
      "Built and maintain a personal home server running Linux with Docker containers for self-hosted services. Manages smart home automation, network-wide ad blocking, and various self-hosted applications.",
    bullets: [
      "Home Assistant for smart home automation and device management",
      "AdGuard Home for network-wide DNS-based ad and tracker blocking",
      "Dockerised services on Ubuntu Server with automated backups",
    ],
    techStack: [
      { label: "Linux" },
      { label: "Docker" },
      { label: "Home Assistant" },
      { label: "AdGuard Home" },
      { label: "Networking" },
    ],
    url: "",
    urlLabel: "",
  },
] as const satisfies readonly Project[];
