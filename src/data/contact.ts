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
    href: "mailto:dragosmacsim@outlook.com",
    isExternal: false,
    iconType: "email",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dragos-macsim/",
    isExternal: true,
    iconType: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/dragos-macsim",
    isExternal: true,
    iconType: "github",
  },
] as const satisfies readonly ContactLink[];
