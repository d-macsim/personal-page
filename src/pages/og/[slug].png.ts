import type { APIRoute } from "astro";
import { generateOgImage } from "../../lib/og-image";

/**
 * OG image endpoint - generates branded 1200x630 PNGs at build time.
 *
 * Security (T-7-06): the `slug` URL parameter is an allowlisted literal from
 * the PAGES array below. Any slug not in the array returns a 404 (the dynamic
 * route simply does not exist at that URL because getStaticPaths did not emit it).
 * Never change PAGES to a function of the request - that would allow arbitrary
 * slug values and defeat the allowlist.
 */

// Locked by UI-SPEC Surface 3 table (lines 265-268).
// To add a new OG variant: append a new entry here and rebuild. The new file
// will appear at dist/og/<slug>.png automatically.
const PAGES = [
  {
    slug: "home",
    title: "Dragos Macsim",
    subtitle: "AI Specialist & Product Builder",
  },
  {
    slug: "now",
    title: "What I'm doing now",
    subtitle: "Dragos Macsim",
  },
] as const;

type PageEntry = (typeof PAGES)[number];

export function getStaticPaths() {
  return PAGES.map((p) => ({
    params: { slug: p.slug },
    props: p,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as PageEntry;
  const png = await generateOgImage({ title, subtitle });

  // Astro's Response constructor accepts Buffer directly as BodyInit.
  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
