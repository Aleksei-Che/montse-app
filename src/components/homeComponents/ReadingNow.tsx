import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateBookStatus, updateBookInFirestore, removeBookFromFirestore } from "../../bookUtils/booksSlice";
import ConfirmModal from "./ConfirmModal";
import ScrollButtons from "./ScrollButtons";
import BookCard from "./BookCard";
import { useAuth } from "../../hooks/useAuth";

const ReadingNow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const books = useSelector((state: RootState) =>
    state.books.books.filter((book) => book.status === "reading")
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [timers, setTimers] = useState<{ [key: string]: string }>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Обновляем таймеры чтения
  useEffect(() => {
    console.log("Updating timers for books:", books); // Лог списка книг с таймерами
    const intervals: { [key: string]: NodeJS.Timeout } = {};
  
    books.forEach((book) => {
      if (book.startTime && !timers[book.id]) {
        const startTime = book.startTime;
        intervals[book.id] = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
          const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  
          console.log(`Updating timer for book ${book.id}: ${hours}h ${minutes}m`); // Лог обновления таймера
          setTimers((prev) => ({
            ...prev,
            [book.id]: `${hours}h ${minutes}m`,
          }));
        }, 60000); // Обновляем каждую минуту
      }
    });
  
    return () => {
      console.log("Clearing timers for books:", books); // Лог очистки интервалов
      Object.values(intervals).forEach(clearInterval);
    };
  }, [books, timers]);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleStopReading = useCallback(
  async (bookId: string, startTime: number) => {
    if (isUpdating) return; // Блокируем повторное выполнение
    console.log("Stopping reading for book:", bookId); // Лог начала остановки книги
    setIsUpdating(true);

    const totalTime = Date.now() - startTime;
    const finishedAt = new Date().toISOString();

    if (user) {
      try {
        console.log("Updating Firestore for book:", { bookId, totalTime, finishedAt }); // Лог отправляемых данных
        await dispatch(
          updateBookInFirestore({
            userId: user.uid,
            bookId,
            updates: {
              status: "finished",
              totalTime,
              finishedAt,
            },
          })
        ).unwrap();

        dispatch(
          updateBookStatus({
            id: bookId,
            status: "finished",
            totalTime,
            finishedAt,
          })
        );
      } catch (error) {
        console.error("Failed to update book status:", error);
      } finally {
        setIsUpdating(false); // Сбрасываем блокировку
      }
    }
  },
  [dispatch, user, isUpdating]
);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    console.log("Deleting book:", selectedBookId); // Лог книги на удаление
    setIsDeleting(true);
  
    if (selectedBookId && user) {
      try {
        console.log("Removing from Firestore bookId:", selectedBookId); // Лог перед отправкой запроса на удаление
        await dispatch(
          removeBookFromFirestore({
            userId: user.uid,
            bookId: selectedBookId,
          })
        ).unwrap();
  
        console.log(`Book ${selectedBookId} successfully deleted from Firestore.`);
      } catch (error) {
        console.error("Failed to delete the book:", error);
      } finally {
        setIsDeleting(false);
      }
    }
    handleCloseConfirmModal();
  };
  const handleOpenConfirmModal = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedBookId(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reading Now</h2>
        <button
          onClick={() => setIsEditMode((prev) => !prev)}
          className="text-blue-500 hover:underline"
        >
          {isEditMode ? "Done" : "Edit"}
        </button>
      </div>

      <div
        id="reading-now-container"
        className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      >
        {books.map((book) => (
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
              onActionClick={() => handleStopReading(book.id, book.startTime!)}
              actionLabel="Stop Reading"
            >
              <p className="text-sm mt-2 text-blue-500">
                Reading Time: {timers[book.id] || "0h 0m"}
              </p>
            </BookCard>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <p className="text-gray-500">You have no books in this section yet.</p>
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          message="Are you sure you want to delete this book?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmModal}
        />
      )}

      {books.length > 1 && <ScrollButtons containerId="reading-now-container" />}
    </section>
  );
};

export default ReadingNow;