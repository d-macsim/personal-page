import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://dragosmacsim.com",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    ssr: { external: ["@resvg/resvg-js"] },
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  },
});
