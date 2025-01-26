import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { removeBook, updateBookStatus } from "../../bookUtils/BooksSlice";
import BookCard from "./BookCard";
import ConfirmModal from "./ConfirmModal";

const ReadingNow: React.FC = () => {
  const dispatch = useDispatch();

  const books = useSelector((state: RootState) =>
    state.books.books
      .filter((book) => book.status === "reading")
      .map((book) => ({
        ...book,
        startTime: book.startTime || Date.now(), // Гарантируем наличие startTime
      }))
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [timers, setTimers] = useState<{ [key: string]: string }>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    books.forEach((book) => {
      const startTime = book.startTime!;
      intervals[book.id] = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        setTimers((prev) => ({
          ...prev,
          [book.id]: `${hours}h ${minutes}m`,
        }));
      }, 1000);
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [books]);

  const handleStopReading = (bookId: string, startTime: number) => {
    const totalTime = Date.now() - startTime;
    const finishedAt = new Date().toISOString();

    dispatch(
      updateBookStatus({
        id: bookId,
        status: "finished",
        totalTime,
        finishedAt,
      })
    );
  };

  const handleOpenConfirmModal = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedBookId(null);
    setIsConfirmModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedBookId) {
      dispatch(removeBook(selectedBookId));
    }
    handleCloseConfirmModal();
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reading Now</h2>
        <button
          onClick={() => setIsEditMode((prev) => !prev)}
          className="text-blue-500 hover:underline"
        >
          {isEditMode ? "Done" : "Edit"}
        </button>
      </div>
      {books.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <li key={book.id} className="relative">
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You have no books in this section yet.</p>
      )}
      {isConfirmModalOpen && (
        <ConfirmModal
          message="Are you sure you want to delete this book?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmModal}
        />
      )}
    </section>
  );
};

export default ReadingNow;