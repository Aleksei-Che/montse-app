import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { removeBookFromFirestore } from "../../bookUtils/booksSlice";
import { selectFinishedBooks } from "../../bookUtils/selectors";
import { useAuth } from "../../hooks/useAuth";
import BookCard from "./BookCard";
import ConfirmModal from "./ConfirmModal";
import ScrollButtons from "./ScrollButtons";

const Finished: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth(); // Получаем текущего пользователя
  const finishedBooks = useSelector(selectFinishedBooks); // Используем готовый селектор

  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleOpenConfirmModal = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedBookId(null);
    setIsConfirmModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedBookId && user) {
      try {
        await dispatch(
          removeBookFromFirestore({
            userId: user.uid,
            bookId: selectedBookId, // Передаём ID книги
          })
        );
        console.log(`Book ${selectedBookId} successfully deleted.`);
      } catch (error) {
        console.error("Failed to delete the book:", error);
      }
    }
    handleCloseConfirmModal();
  };

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Finished</h2>
        <button
          onClick={() => setIsEditMode((prev) => !prev)}
          className="text-blue-500 hover:underline"
        >
          {isEditMode ? "Done" : "Edit"}
        </button>
      </div>

      {finishedBooks.length > 0 ? (
        <div
          id="finished-container"
          className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
        >
          {finishedBooks.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-72 relative">
              {isEditMode && (
                <button
                  onClick={() => handleOpenConfirmModal(book.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                >
                  &minus;
                </button>
              )}
              <BookCard {...book}>
                <p className="text-sm text-gray-500">
                  Finished on: {new Date(book.finishedAt!).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Total Time:{" "}
                  {book.totalTime
                    ? `${Math.floor(book.totalTime / (1000 * 60 * 60))}h ${
                        Math.floor((book.totalTime % (1000 * 60 * 60)) / (1000 * 60))
                      }m`
                    : "0h 0m"}
                </p>
              </BookCard>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No finished books yet.</p>
      )}
      {isConfirmModalOpen && (
        <ConfirmModal
          message="Are you sure you want to move this book?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmModal}
        />
      )}
      <ScrollButtons containerId="finished-container" />
    </section>
  );
};

export default Finished;