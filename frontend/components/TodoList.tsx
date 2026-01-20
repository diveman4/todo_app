import { Todo } from "@/lib/api";

type TodoListProps = {
    todos: Todo[];
    editingId: number | null;
    editTitle: string;
    onToggle: (todo: Todo) => void;
    onStartEditing: (todo: Todo) => void;
    onChangeEditTitle: (value: string) => void;
    onSaveTitle: (id: number) => void;
    onDelete: (id: number) => void;
  };
  
const formatDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const priorityLabel = (p: Todo["priority"]) => {
  switch (p) {
    case "HIGH":
      return "高";
    case "MEDIUM":
      return "中";
    case "LOW":
    default:
      return "低";
  }
};

const priorityColor = (p: Todo["priority"]) => {
  switch (p) {
    case "HIGH":
      return "bg-red-100 text-red-700 border-red-300";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "LOW":
    default:
      return "bg-green-100 text-green-700 border-green-300";
  }
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  editingId,
  editTitle,
  onToggle,
  onStartEditing,
  onChangeEditTitle,
  onSaveTitle,
  onDelete,
}) => (
  <ul className="space-y-3">
    {todos.map((todo) => (
      <li
        key={todo.id}
        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center gap-3 flex-1">

            {/* 完了チェックボックス */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
            className="w-5 h-5 cursor-pointer"
          />
          
          {/* 編集中かどうか判定して表示変更 */}
          {editingId === todo.id ? (
            // 編集中（タイトル）
            <input
              type="text"
              className="flex-1 border border-blue-400 rounded px-2 py-1 text-gray-700 focus:outline-none bg-white"
              value={editTitle}
              onChange={(e) => onChangeEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSaveTitle(todo.id)}
              autoFocus
            />
          ) : (
            // 通常表示（タイトル）
            <span
              className={`text-lg cursor-pointer flex-1 ${
                todo.completed ? "line-through text-gray-400" : "text-gray-700"
              }`}
              onClick={() => onStartEditing(todo)}
            >
              {todo.title}
            </span>
          )}
        </div>

        {/* メタ情報（優先度・期限日） */}
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full border ${priorityColor(
              todo.priority
            )}`}
          >
            優先度: {priorityLabel(todo.priority)}
          </span>
          {todo.dueDate && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              期限: {formatDate(todo.dueDate)}
            </span>
          )}
        </div>

        {/* 説明 */}
        {todo.description && (
          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
            {todo.description}
          </p>
        )}

        <div className="mt-3 flex gap-2 justify-end">
          {editingId === todo.id ? (
            <button
              onClick={() => onSaveTitle(todo.id)}
              className="text-blue-500 text-sm font-bold"
            >
              保存
            </button>
          ) : (
            <>
              <button
                onClick={() => onStartEditing(todo)}
                className="text-gray-500 hover:text-blue-500 text-sm"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded px-3 py-1 text-sm"
              >
                削除
              </button>
            </>
          )}
        </div>
      </li>
    ))}
    {todos.length === 0 && (
      <p className="text-center text-gray-500 py-10">TODOがありません</p>
    )}
  </ul>
);

export default TodoList;