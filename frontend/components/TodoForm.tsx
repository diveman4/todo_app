type TodoFormProps = {
    newTitle: string;
    setNewTitle: (value: string) => void;
    onAddTodo: (e: React.FormEvent) => void;
  };

  const TodoForm: React.FC<TodoFormProps> = ({ newTitle, setNewTitle, onAddTodo }) => (
    <form onSubmit={onAddTodo} className="flex gap-2 mb-8">
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
  );

  export default TodoForm;