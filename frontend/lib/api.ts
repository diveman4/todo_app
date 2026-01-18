const API_URL = "http://localhost:3000";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

// 全取得
const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/todos`);
  if (!res.ok) throw new Error('取得に失敗しました');
  return res.json();
};

// 作成
const createTodo = async (title: string): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('作成に失敗しました');
  return res.json();
};

// 更新
const updateTodo = async (id: number, data: Partial<Todo>): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('更新に失敗しました');
  return res.json();
};

// 削除
const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('削除に失敗しました');
};

// export
export type { Todo };
export { fetchTodos, createTodo, updateTodo, deleteTodo };