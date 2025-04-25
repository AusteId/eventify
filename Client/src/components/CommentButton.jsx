import { Send } from 'lucide-react';

const CommentButton = ({ isDarkMode, newComment, handleSubmit }) => {
  const isDisabled = !newComment || !newComment.trim();

  return (
    <button
      type="submit"
      onClick={handleSubmit}
      disabled={isDisabled}
      className={` flex items-center gap-2 duration-750 px-4 py-3 rounded-lg transition-colors ${
        isDisabled
          ? isDarkMode
            ? "bg-slate-800 border border-[#f59e0b] cursor-not-allowed opacity-50"
            : "bg-gray-200 border border-transparent cursor-not-allowed opacity-50"
          : isDarkMode
            ? "bg-amber-700 hover:bg-amber-600 border border-transparent cursor-pointer"
            : "bg-btn hover:bg-btn-hover border border-transparent text-white cursor-pointer"
      }`}
    >
      <Send
        className={`h-4 w-4 ${
          isDisabled
            ? isDarkMode
              ? "text-[#f59e0b]"
              : "text-gray-500"
            : isDarkMode
              ? "text-gray-200"
              : "text-white"
        }`}
      />
      <span
        className={`duration-750 ${
          isDisabled
            ? isDarkMode
              ? "text-[#f59e0b]"
              : "text-gray-500"
            : isDarkMode
              ? "text-gray-200"
              : "text-white"
        }`}
      >
        Post Comment
      </span>
    </button>
  );
};

export default CommentButton;