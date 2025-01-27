import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { updateBookInFirestore, removeBookFromFirestore } from "../../bookUtils/booksSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import BookCard from "./BookCard";
import ScrollButtons from "./ScrollButtons";
import ConfirmModal from "./ConfirmModal";
import { useAuth } from "../../hooks/useAuth";

const ReadLater: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const books = useSelector((state: RootState) =>
    state.books.books.filter((book) => book.status === "later")
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleOpenConfirmModal = (bookId: string) => {
    console.log("Opening confirm modal for book:", bookId); // Лог открытия модалки
    setSelectedBookId(bookId);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    console.log("Closing confirm modal"); // Лог закрытия модалки
    setSelectedBookId(null);
    setIsConfirmModalOpen(false);
  };

  const handleStartReading = async (bookId: string) => {
    if (!user) {
      console.error("User not logged in."); // Лог отсутствия пользователя
      return;
    }

    console.log("Starting reading for book:", bookId); // Лог перед началом перемещения книги
    try {
      await dispatch(
        updateBookInFirestore({
          userId: user.uid,
          bookId,
          updates: {
            status: "reading",
            startTime: Date.now(),
          },
        })
      );
      console.log(`Book ${bookId} moved to "reading" in Firestore.`); // Лог успешного перемещения
    } catch (error) {
      console.error("Failed to move book to reading:", error); // Лог ошибки перемещения
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBookId && user) {
      console.log("Attempting to delete book:", selectedBookId); // Лог перед удалением
      try {
        await dispatch(
          removeBookFromFirestore({
            userId: user.uid,
            bookId: selectedBookId,
          })
        ).unwrap();
        console.log(`Book ${selectedBookId} successfully deleted from Firestore.`); // Лог успешного удаления
      } catch (error) {
        console.error("Failed to delete the book:", error); // Лог ошибки удаления
      }
    }
    handleCloseConfirmModal();
  };

  console.log("Read later books:", books); // Лог списка книг

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Read Later</h2>
        <button
          onClick={() => {
            console.log("Toggling edit mode:", !isEditMode); // Лог переключения режима редактирования
            setIsEditMode((prev) => !prev);
          }}
          className="text-blue-500 hover:underline"
        >
          {isEditMode ? "Done" : "Edit"}
        </button>
      </div>
      <div
        id="read-later-container"
        className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      >
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-72 relative">
              {isEditMode && (
                <button
                  onClick={() => handleOpenConfirmModal(book.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                >
                  &minus;
                </button>
              )}
              <BookCard
                {...book}
                onActionClick={() => handleStartReading(book.id)}
                actionLabel="Start Reading"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No books to read later.</p>
        )}
      </div>
      {isConfirmModalOpen && (
        <ConfirmModal
          message="Are you sure you want to delete this book?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmModal}
        />
      )}
      {books.length > 1 && <ScrollButtons containerId="read-later-container" />}
    </section>
  );
};

export default ReadLater;