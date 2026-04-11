/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * Cloudflare Web Analytics beacon token (32-char hex).
   * Obtain from dash.cloudflare.com -> Analytics & Logs -> Web Analytics -> Snippet tab.
   * PUBLIC_ prefix: intentionally shipped to the browser (beacon token is not a secret — it identifies the site in CF's dashboard).
   * Consumed by: src/layouts/BaseLayout.astro (guarded by import.meta.env.PROD).
   */
  readonly PUBLIC_CF_ANALYTICS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
