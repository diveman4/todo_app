"use client";

import { useEffect, useState } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo, Todo } from "@/lib/api";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 編集状態管理
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState(""); 

  // 初期データ取得
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    }
    catch (e) {
      setError("データの取得に失敗しました");
    }
  };

  // 新規TODO作成
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const addedTodo = await createTodo(newTitle);
      setTodos([addedTodo, ...todos]);
      setNewTitle("");
    } 
    catch (e) {
      alert("作成に失敗しました");
    }
  };

  // 編集開始
  const startEditing = (todo:Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  // 編集保存
  const handleUpdateTitle = async (id:number) => {
    if (!editTitle.trim()) return;
    try {
      const updated = await updateTodo(id, {title: editTitle});
      setTodos(todos.map((t)=>(t.id === id ? updated :t)));
      setEditingId(null);
    } 
    catch (e) {
      alert("更新に失敗しました"); 
    }
  };

  // 完了トグル
  const handleToggle = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    }
    catch (e) {
      alert("更新に失敗しました");
    }
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    }
    catch (e) {
      alert("削除に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">TODO リスト</h1>

        {/* 入力フォーム */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="新しいTODOを入力..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            追加
          </button>
        </form>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* TODOリスト */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="w-5 h-5 cursor-pointer"
                />
                {editingId === todo.id ? (
                  // 編集中
                  <input
                  type = "text"
                  className = "flex-1 border border-blue-400 rounded px-2 py-1 text-gray-700 focus:outline-none bg-white"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle(todo.id)}
                  autoFocus
                  />
                ) : (
                  //通常
                  <span
                  className={`text-lg cursor-pointer flex-1 ${
                    todo.completed ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                  onClick={() => startEditing(todo)}
                >
                  {todo.title}
                  </span>
                )
                }
              </div>

              <div className="flex gap-2 ml-4">
                {editingId === todo.id ? (
                  <button onClick={() => handleUpdateTitle(todo.id)} className="text-blue-500 text-sm font-bold">保存</button>
                ) : (
                  <>
                  <button onClick={() => startEditing(todo)} className="text-gray-500 hover:text-blue-500 text-sm">編集</button>
                  <button onClick={() => handleDelete(todo.id)} className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded px-3 py-1 text-sm">削除</button>
                  </>
                )}
              </div>
            </li>
          ))}
          {todos.length === 0 && (
            <p className="text-center text-gray-500 py-10">TODOがありません</p>
          )}
        </ul>
      </div>
    </main>
  );
}