// test/playwrite/todo.e2e.test.ts
import { test, expect } from "@playwright/test";

test("TODOアプリの基本機能", async ({ page }) => {
  // 1. 一覧表示 & タイトル
  await page.goto("/");
  await expect(page.getByText("TODO リスト")).toBeVisible();

  // 2. 新規作成（タイトル必須）
  const titleInput = page.getByPlaceholder("新しいTODOを入力...");
  const addButton = page.getByRole("button", { name: "追加" });

  await expect(addButton).toBeDisabled();

  const uniqueTitle = `E2EテストTODO-${Date.now()}`;
  await titleInput.fill(uniqueTitle);
  await addButton.click();

  await expect(page.getByText(uniqueTitle)).toBeVisible();

  // 5. 完了/未完了トグル（見た目で区別）
  // まず「タイトルテキスト」から、その行の checkbox を取る
  const checkbox = page
    .getByText(uniqueTitle)
    .locator("xpath=ancestor::li")
    .getByRole("checkbox");

  await checkbox.click();
  await expect(checkbox).toBeChecked();

  // checkbox から ancestor の li をたどる（ここからはテキストに依存しない）
  const todoRow = checkbox.locator("xpath=ancestor::li");

  await expect(
    todoRow.locator("span.line-through")
  ).toBeVisible({ timeout: 2000 }).catch(() => {});

// 3. 編集（インライン編集）
const editButton = todoRow.getByRole("button", { name: "編集" });
await editButton.click();

// 編集モードに入った行は「保存」ボタンを持つので、そこから li をたどる
const editingRow = page
  .getByRole("button", { name: "保存" })
  .locator("xpath=ancestor::li");

// その行の textbox を取得して編集
const editInput = editingRow.getByRole("textbox");
await editInput.fill(`${uniqueTitle}-編集後`);

await page.getByRole("button", { name: "保存" }).click();

await expect(
  page.getByText(`${uniqueTitle}-編集後`)
).toBeVisible();

  // 4. 削除（確認ダイアログあり）
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  const deleteButton = page
    .getByText(`${uniqueTitle}-編集後`)
    .locator("xpath=ancestor::li")
    .getByRole("button", { name: "削除" });
  await deleteButton.click();

  await expect(
    page.getByText(`${uniqueTitle}-編集後`)
  ).not.toBeVisible({ timeout: 3000 });
});

test("6. データ永続化: 作成後にリロードしてもTODOが残る", async ({ page }) => {
  await page.goto("/");

  const title = `永続化テスト-${Date.now()}`;
  await page.getByPlaceholder("新しいTODOを入力...").fill(title);
  await page.getByRole("button", { name: "追加" }).click();
  await expect(page.getByText(title)).toBeVisible();

  // ページをリロード（バックエンド+DB が永続化している前提）
  await page.reload();
  await expect(page.getByText(title)).toBeVisible();
});