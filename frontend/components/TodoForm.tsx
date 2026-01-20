import type { Priority } from "@/lib/api";

type TodoFormProps = {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDescription: string;
  setNewDescription: (value: string) => void;
  newDueDate: string;
  setNewDueDate: (value: string) => void;
  newPriority: Priority;
  setNewPriority: (value: Priority) => void;
  onAddTodo: (e: React.FormEvent) => void;
};

const TodoForm: React.FC<TodoFormProps> = ({
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newDueDate,
  setNewDueDate,
  newPriority,
  setNewPriority,
  onAddTodo,
}) => (
  <form onSubmit={onAddTodo} className="space-y-4 mb-8">
    <div className="flex gap-2">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        placeholder="新しいTODOを入力..."
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">説明</label>
      <textarea
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        rows={2}
        placeholder="タスクの詳細やメモを入力..."
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
    </div>

    <div className="flex gap-4 flex-wrap">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">期限日</label>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">優先度</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as Priority)}
        >
          <option value="HIGH">高</option>
          <option value="MEDIUM">中</option>
          <option value="LOW">低</option>
        </select>
      </div>
    </div>

    <div className="pt-2">
      <button
        type="submit"
        disabled={!newTitle.trim()}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        追加
      </button>
    </div>
  </form>
);

export default TodoForm;