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
      "A fitness app with AI-powered video analysis for combat sports technique, food and exercise logging with barcode scanning, mobility drills, and a recovery dashboard pulling data from Apple Health.",
    bullets: [
      "AI video analysis for combat sports form — camera-guided recording with exercise catalogue",
      "Food logging with barcode scanner, exercise tracking, and weight logging",
      "Mobility drills library with guided exercises and progress tracking",
      "Dashboard with recovery scores from Apple Health (HRV, sleep, resting heart rate)",
    ],
    techStack: [
      { label: "React Native" },
      { label: "Expo" },
      { label: "TypeScript" },
      { label: "Apple Health" },
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
