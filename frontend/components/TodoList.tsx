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
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3 flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo)}
              className="w-5 h-5 cursor-pointer"
            />
            {editingId === todo.id ? (
              // 編集中
              <input
                type="text"
                className="flex-1 border border-blue-400 rounded px-2 py-1 text-gray-700 focus:outline-none bg-white"
                value={editTitle}
                onChange={(e) => onChangeEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSaveTitle(todo.id)}
                autoFocus
              />
            ) : (
              // 通常
              <span
                className={`text-lg cursor-pointer flex-1 ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-700"
                }`}
                // onClick={() => onStartEditing(todo)}
              >
                {todo.title}
              </span>
            )}
          </div>
  
          <div className="flex gap-2 ml-4">
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