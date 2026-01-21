type TodoSearchProps = {
  keyword: string;
  onChangeKeyword: (value: string) => void;
  onSearch: () => void;
};

const TodoSearch: React.FC<TodoSearchProps> = ({
  keyword,
  onChangeKeyword,
  onSearch,
}) => {
  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        placeholder="キーワードで検索（タイトル・説明）"
        className="flex-1 border rounded-md px-3 py-2 text-sm text-gray-700"
      />
      <button
        type="button"
        onClick={onSearch}
        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        検索
      </button>
    </div>
  );
};

export default TodoSearch;

