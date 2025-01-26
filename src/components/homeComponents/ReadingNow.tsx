import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    books.forEach((book) => {
      if (book.startTime) {
        const startTime = book.startTime;
        intervals[book.id] = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
          const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
          setTimers((prev) => ({
            ...prev,
            [book.id]: `${hours}h ${minutes}m`,
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [books]);

  const handleStopReading = async (bookId: string, startTime: number) => {
    const totalTime = Date.now() - startTime;
    const finishedAt = new Date().toISOString();

    if (user) {
      try {
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

        console.log("Book status successfully updated in Firestore.");
      } catch (error) {
        console.error("Failed to update book status in Firestore:", error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBookId && user) {
      try {
        await dispatch(
          removeBookFromFirestore({
            userId: user.uid,
            bookId: selectedBookId,
          })
        ).unwrap();

        console.log(`Book ${selectedBookId} successfully deleted from Firestore.`);
      } catch (error) {
        console.error("Failed to delete the book:", error);
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