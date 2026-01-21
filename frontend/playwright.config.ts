import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Playwright が探すテストファイルの場所指定
  testDir: "test/playwrite",
  testMatch: /.*\.test\.ts/,
  // baseURLを指定
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
  },
});