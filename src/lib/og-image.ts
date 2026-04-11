import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

/**
 * Shared OG image template - single source of truth per UI-SPEC Surface 3.
 *
 * Constraints:
 * - Canvas 1200x630 (Facebook/LinkedIn/Twitter standard).
 * - Flat dark background (#0a0a0f) - matches --color-base in global.css.
 * - Inter 400 (subtitle/brand) + Inter 700 (title), loaded from @fontsource/inter
 *   (non-variable package - ships .woff files Satori can parse; the -variable
 *   package ships only .woff2 which Satori CANNOT parse, per vercel/satori#157).
 * - No emoji, no icons, no gradients, no images - pure text per UI-SPEC line 260.
 */

const require = createRequire(import.meta.url);

// Load font bytes once at module init; cached across all getStaticPaths calls in a single build.
const inter400 = readFileSync(
  require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff"),
);
const inter700 = readFileSync(
  require.resolve("@fontsource/inter/files/inter-latin-700-normal.woff"),
);

export interface OgImageOpts {
  /** Main title line - e.g. "Dragos Macsim" or "What I'm doing now". */
  title: string;
  /** Supporting subtitle - e.g. "AI Specialist & Product Builder". */
  subtitle: string;
}

/**
 * Render the OG template to a PNG Buffer.
 * Called from getStaticPaths in src/pages/og/[slug].png.ts.
 */
export async function generateOgImage({ title, subtitle }: OgImageOpts): Promise<Buffer> {
  // Colours baked in - Satori does not resolve CSS variables.
  // Values mirror UI-SPEC Color section "dark mode" column (global.css lines 28-33).
  const markup = html`
    <div
      style="display:flex;flex-direction:column;width:100%;height:100%;background:#0a0a0f;color:#e4e4e7;font-family:Inter;padding:80px;justify-content:center;"
    >
      <div style="display:flex;color:#6366f1;font-size:28px;font-weight:400;margin-bottom:24px;">
        dragosmacsim.com
      </div>
      <div
        style="display:flex;font-size:84px;font-weight:700;line-height:1.1;margin-bottom:24px;color:#e4e4e7;"
      >
        ${title}
      </div>
      <div style="display:flex;font-size:36px;font-weight:400;color:#71717a;">
        ${subtitle}
      </div>
    </div>
  `;

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: inter400, weight: 400, style: "normal" },
      { name: "Inter", data: inter700, weight: 700, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}
