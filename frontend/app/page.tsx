"use client";

import { useEffect, useState } from "react";
import {fetchTodos, createTodo, updateTodo, deleteTodo, Todo, Priority} from "@/lib/api";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";


export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("MEDIUM");
  const [error, setError] = useState<string | null>(null);

  // 編集状態管理用
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // 初期データ取得関数
  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      setError("データの取得に失敗しました");
    }
  };

  // 初期データ取得
  useEffect(() => {
    // 初期ロード用のため、この行に限りルールを無効化
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTodos();
  }, []);

  // 新規TODO作成
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const addedTodo = await createTodo({
        title: newTitle,
        description: newDescription || undefined,
        dueDate: newDueDate || undefined,
        priority: newPriority,
      });
      setTodos([addedTodo, ...todos]);
      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
      setNewPriority("MEDIUM");
    } catch {
      alert("作成に失敗しました");
    }
  };

  // 編集開始
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  // 編集保存
  const handleUpdateTitle = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      const updated = await updateTodo(id, { title: editTitle });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
    } catch {
      alert("更新に失敗しました");
    }
  };

  // 完了トグル
  const handleToggle = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch {
      alert("更新に失敗しました");
    }
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch {
      alert("削除に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          TODO リスト
        </h1>

        <TodoForm
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          newDueDate={newDueDate}
          setNewDueDate={setNewDueDate}
          newPriority={newPriority}
          setNewPriority={setNewPriority}
          onAddTodo={handleAddTodo}
        />

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <TodoList
          todos={todos}
          editingId={editingId}
          editTitle={editTitle}
          onToggle={handleToggle}
          onStartEditing={startEditing}
          onChangeEditTitle={setEditTitle}
          onSaveTitle={handleUpdateTitle}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}