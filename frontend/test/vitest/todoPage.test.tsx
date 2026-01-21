import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoPage from "@/app/page";
import * as api from "@/lib/api";

vi.mock("@/components/Drawer", () => ({
  default: () => <div>drawer</div>,
}));
vi.mock("@/components/MaterialMode", () => ({
  default: () => <div>mode</div>,
}));

const mockTodos: api.Todo[] = [
  {
    id: 1,
    title: "買い物に行く",
    completed: false,
    description: "牛乳を買う",
    dueDate: "2026-01-21T00:00:00.000Z",
    priority: "HIGH",
    createdAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: 2,
    title: "勉強する",
    completed: true,
    description: null,
    dueDate: null,
    priority: "LOW",
    createdAt: "2026-01-19T00:00:00.000Z",
  },
];

describe("TodoPage 機能要件", () => {
  const fetchTodosSpy = vi.spyOn(api, "fetchTodos");
  const createTodoSpy = vi.spyOn(api, "createTodo");
  const updateTodoSpy = vi.spyOn(api, "updateTodo");
  const deleteTodoSpy = vi.spyOn(api, "deleteTodo");

  beforeEach(() => {
    vi.resetAllMocks();
    fetchTodosSpy.mockResolvedValue(mockTodos);
  });

  const setup = async () => {
    render(<TodoPage />);
    await waitFor(() => expect(fetchTodosSpy).toHaveBeenCalled());
  };

  it("1. TODO一覧表示: タイトルと完了状態が表示される", async () => {
    await setup();

    expect(screen.getByText("買い物に行く")).toBeInTheDocument();
    expect(screen.getByText("勉強する")).toBeInTheDocument();

    // completed=true のものは取り消し線クラスが付く
    const doneTitle = screen.getByText("勉強する");
    expect(doneTitle.className).toMatch(/line-through/);
  });

  it("2. 新規作成: タイトル必須 + 追加時にAPIが呼ばれ一覧に反映される", async () => {
    await setup();

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    const addButton = screen.getByRole("button", { name: "追加" });

    // 空タイトルのときはボタンが disabled
    expect(addButton).toBeDisabled();

    // タイトル入力で有効化
    fireEvent.change(input, { target: { value: "新しいタスク" } });
    expect(addButton).not.toBeDisabled();

    createTodoSpy.mockResolvedValue({
      ...mockTodos[0],
      id: 3,
      title: "新しいタスク",
    });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(createTodoSpy).toHaveBeenCalledWith({
        title: "新しいタスク",
        description: undefined,
        dueDate: undefined,
        priority: "MEDIUM",
      });
      expect(screen.getByText("新しいタスク")).toBeInTheDocument();
    });
  });

  it("3. 編集: タイトルを編集して保存するとAPIが呼ばれ反映される", async () => {
    await setup();

    updateTodoSpy.mockResolvedValue({
      ...mockTodos[0],
      title: "買い物に行く（編集後）",
    });

    // 「編集」ボタンを押す
    const editButton = screen.getAllByRole("button", { name: "編集" })[0];
    fireEvent.click(editButton);

    // インライン編集用 input に入力
    const editInput = screen.getByDisplayValue("買い物に行く");
    fireEvent.change(editInput, {
      target: { value: "買い物に行く（編集後）" },
    });

    // 保存ボタン押下
    const saveButton = screen.getByRole("button", { name: "保存" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateTodoSpy).toHaveBeenCalledWith(1, {
        title: "買い物に行く（編集後）",
      });
      expect(screen.getByText("買い物に行く（編集後）")).toBeInTheDocument();
    });
  });

  it("4. 削除: 確認ダイアログの後、削除APIが呼ばれリストから消える", async () => {
    await setup();

    const confirmMock = vi
      .spyOn(window, "confirm")
      .mockImplementation(() => true);
    deleteTodoSpy.mockResolvedValue();

    const deleteButton = screen.getAllByRole("button", { name: "削除" })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(confirmMock).toHaveBeenCalledWith("本当に削除しますか？");
      expect(deleteTodoSpy).toHaveBeenCalledWith(1);
    });
  });

  it("5. 完了/未完了トグルでAPI呼び出し & 見た目が変わる", async () => {
    await setup();

    updateTodoSpy.mockResolvedValue({
      ...mockTodos[0],
      completed: true,
    });

    const checkbox = screen.getAllByRole("checkbox")[0];
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(updateTodoSpy).toHaveBeenCalledWith(1, { completed: true });
    });
  });

  it("6. データ永続化: 初期表示時に fetchTodos が呼ばれる（=バックエンドから取得）", async () => {
    await setup();
    expect(fetchTodosSpy).toHaveBeenCalledTimes(1);
  });
});