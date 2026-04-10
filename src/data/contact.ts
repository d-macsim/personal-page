// src/data/contact.ts — Typed contact link content
// All contact data lives here; components only render structure.

export interface ContactLink {
  readonly label: string;
  readonly href: string;
  readonly isExternal: boolean;
  readonly iconType: "email" | "linkedin" | "github";
}

export const contactLinks: readonly ContactLink[] = [
  {
    label: "Email",
    href: "mailto:dragosmacsim@protonmail.com",
    isExternal: false,
    iconType: "email",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dragosmacsim/",
    isExternal: true,
    iconType: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/d-macsim",
    isExternal: true,
    iconType: "github",
  },
] as const satisfies readonly ContactLink[];
