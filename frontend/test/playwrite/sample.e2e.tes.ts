import { test, expect } from "@playwright/test";

test("TODO リストのタイトルが表示される", async ({ page }) => {
  await page.goto("/"); // baseURL + '/'
  await expect(page.getByText("TODO リスト")).toBeVisible();
});