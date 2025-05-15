import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  updateBookStatus,
  updateBookInFirestore,
  removeBookFromFirestore,
  fetchTotalReaders,
} from "../../bookUtils/booksSlice";
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
  const [totalReaders, setTotalReaders] = useState<{ [key: string]: number }>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const timerIntervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    books.forEach((book) => {
      if (book.startTime && !timerIntervalsRef.current[book.id]) {
        const startTime = book.startTime;

        timerIntervalsRef.current[book.id] = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const newDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
          const newHours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

          setTimers((prev) => {
            const newValue = `${newDays}d ${newHours}h`;
            return prev[book.id] !== newValue ? { ...prev, [book.id]: newValue } : prev;
          });
        }, 60000); 

        const elapsedTime = Date.now() - startTime;
        const newDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
        const newHours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        setTimers((prev) => ({
          ...prev,
          [book.id]: `${newDays}d ${newHours}h`,
        }));
      }
    });

    return () => {
      Object.values(timerIntervalsRef.current).forEach(clearInterval);
      timerIntervalsRef.current = {};
    };
  }, [books.length]);

  useEffect(() => {
    const fetchReadersForBooks = async () => {
      const uniqueTitles = Array.from(new Set(books.map((book) => book.title)));
      const updatedReadersMap: { [key: string]: number } = { ...totalReaders };

      for (const title of uniqueTitles) {
        try {
          const response = await dispatch(fetchTotalReaders(title)).unwrap();

          books
            .filter((book) => book.title === title)
            .forEach((book) => {
              if (updatedReadersMap[book.id] !== response.totalReaders) {
                updatedReadersMap[book.id] = response.totalReaders;
              }
            });
        } catch (error) {
          console.error(`Failed to fetch total readers for title "${title}":`, error);
        }
      }

  
      if (JSON.stringify(updatedReadersMap) !== JSON.stringify(totalReaders)) {
        setTotalReaders(updatedReadersMap);
      }
    };

    if (books.length > 0) {
      fetchReadersForBooks();
    }
  }, [books.length, dispatch]); 

  const handleStopReading = useCallback(
    async (bookId: string, startTime: number) => {
      if (isUpdating) return;
      setIsUpdating(true);

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
        } catch (error) {
          console.error("Failed to update book status:", error);
        } finally {
          setIsUpdating(false);
        }
      }
    },
    [dispatch, user, isUpdating]
  );

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    if (selectedBookId && user) {
      try {
        await dispatch(
          removeBookFromFirestore({
            userId: user.uid,
            bookId: selectedBookId,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to delete the book:", error);
      } finally {
        setIsDeleting(false);
        handleCloseConfirmModal();
      }
    }
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
    <section className="relative z-10 mb-8">

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
          <div key={book.id} className="flex-shrink-0 w-72 relative mt-1">
            {isEditMode && (
              <button
                onClick={() => handleOpenConfirmModal(book.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 z-10"
              >
                &minus;
              </button>
            )}
            <BookCard
              {...book}
              totalReaders={totalReaders[book.id]}
              onActionClick={() => handleStopReading(book.id, book.startTime!)}
              actionLabel="Stop Reading"
            >
              <p
                className="text-sm mt-2 text-blue-500 truncate cursor-pointer h-5 flex items-center"
                title={timers[book.id] || "0d 0h"}
              >
  Reading Time: {timers[book.id] || "0d 0h"}
</p>
            </BookCard>
          </div>
        ))}
      </div>

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