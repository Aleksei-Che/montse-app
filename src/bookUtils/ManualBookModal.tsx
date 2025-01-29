import React, { useState } from "react";

interface ManualBookModalProps {
  onClose: () => void;
  onSave: (title: string, author: string, status: "reading" | "later") => void;
}

const ManualBookModal: React.FC<ManualBookModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Book Details</h2>
        
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border dark:border-gray-600 p-2 mb-4 w-full rounded bg-white dark:bg-gray-700 dark:text-gray-100"
          required
        />
        
        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border dark:border-gray-600 p-2 mb-4 w-full rounded bg-white dark:bg-gray-700 dark:text-gray-100"
          required
        />

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(title, author, "reading")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Read Now
          </button>

          <button
            onClick={() => onSave(title, author, "later")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Read Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualBookModal;