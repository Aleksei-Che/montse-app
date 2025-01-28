import React from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { addBookToFirestore } from "./booksSlice";
import { useAuth } from "../hooks/useAuth";

interface AddBookModalProps {
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
  };
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ book, onClose }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleAddBook = async (status: "reading" | "later") => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    if (!book) {
      console.error("No book selected for adding");
      return;
    }

    try {
      console.log("Adding book to Firestore:", book);

      // Убираем `startTime`, если статус не "reading"
      const bookData = {
        ...book,
        status,
        ...(status === "reading" && { startTime: Date.now() }),
      };

      console.log("Dispatching addBookToFirestore with:", {
        userId: user.uid,
        book: bookData,
      });

      const result = await dispatch(
        addBookToFirestore({
          userId: user.uid,
          book: bookData,
        })
      );

      console.log("Result of dispatch:", result);

      console.log(`Book added with status: ${status}`);
      onClose(); 
    } catch (error) {
      console.error("Failed to add book to Firestore:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-sm md:max-w-lg mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>
        {book ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Add "{book.title}"</h2>
            <img
              src={book.coverImage || "/placeholder.jpg"}
              alt={book.title}
              className="w-32 h-48 object-cover rounded mx-auto mb-4"
            />
            <p className="text-gray-700 mb-4 text-center">Author: {book.author}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAddBook("reading")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Read Now
              </button>
              <button
                onClick={() => handleAddBook("later")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Read Later
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No book selected. Use the search to find a book.</p>
        )}
      </div>
    </div>
  );
};

export default AddBookModal;