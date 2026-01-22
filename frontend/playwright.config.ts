import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Playwright が探すテストファイルの場所指定
  testDir: "test/playwrite",
  testMatch: /.*\.test\.ts/,
  // baseURLを指定
  use: {
    baseURL: "http://localhost:3000",
  },
  // CI環境ではDocker Composeでサーバーを起動するため、webServerは無効化
  // ローカル環境では自動的にサーバーを起動
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        port: 3000,
        reuseExistingServer: true,
      },
});