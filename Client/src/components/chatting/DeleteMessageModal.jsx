const DeleteMessageModal = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Message</h3>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this message? This action cannot be undone.
        </p>
        
        <div className="border rounded-lg p-3 bg-gray-50 mb-6 text-gray-600 text-sm">
          {message ? message.content : "This message"}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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