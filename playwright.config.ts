import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  use: {
    baseURL: "http://localhost:4321",
  },
  testDir: "./tests",
  testMatch: ["phase8-smoke.spec.ts"],
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
});
