const DeleteMessageModal = ({ isOpen, onCancel, onConfirm, message, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  backdrop-blur-xs flex items-center justify-center z-50">
      <div
        className={`rounded-xl shadow-lg p-6 max-w-md w-full mx-4 transform transition-all
          ${isDarkMode
          ? "bg-slate-800 border border-slate-700"
          : "bg-white"}`}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={`text-xl font-semibold mb-4
          ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Delete Message
        </h3>

        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Are you sure you want to delete this message? This action cannot be undone.
        </p>

        <div className={`border rounded-lg p-3 mb-6 text-sm
          ${isDarkMode
          ? "bg-slate-700 border-slate-600 text-gray-300"
          : "bg-gray-50 text-gray-600"}`}>
          {message ? message.content : "This message"}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer
              ${isDarkMode
              ? "bg-slate-700 text-gray-300 border border-slate-600 hover:bg-slate-600"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded-lg transition-colors cursor-pointer
              ${isDarkMode
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-500 hover:bg-red-600"}`}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;