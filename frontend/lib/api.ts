// backend connection
const API_URL = "http://localhost:3001";

export type Priority = "HIGH" | "MEDIUM" | "LOW";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  description?: string | null;
  dueDate?: string | null; // ISO 文字列（例: "2026-01-20T00:00:00.000Z"）
  priority: Priority;
  createdAt: string;
};

type CreateTodoInput = {
  title: string;
  description?: string;
  /** "YYYY-MM-DD" 形式など Date に変換可能な文字列 */
  dueDate?: string;
  priority?: Priority;
};

type UpdateTodoInput = Partial<CreateTodoInput> & {
  completed?: boolean;
};

// 全取得
const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/todos`);
  if (!res.ok) throw new Error("取得に失敗しました");
  return res.json();
};

// 作成
const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("作成に失敗しました");
  return res.json();
};

// 更新
const updateTodo = async (
  id: number,
  data: UpdateTodoInput
): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("更新に失敗しました");
  return res.json();
};

// 削除
const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("削除に失敗しました");
};

// export
export type { Todo, CreateTodoInput, UpdateTodoInput };
export { fetchTodos, createTodo, updateTodo, deleteTodo };