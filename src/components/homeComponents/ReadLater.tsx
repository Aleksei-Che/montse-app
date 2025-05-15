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
    console.log("Opening confirm modal for book:", bookId); 
    setSelectedBookId(bookId);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    console.log("Closing confirm modal"); 
    setSelectedBookId(null);
    setIsConfirmModalOpen(false);
  };

  const handleStartReading = async (bookId: string) => {
    if (!user) {
      console.error("User not logged in."); 
      return;
    }

    console.log("Starting reading for book:", bookId); 
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
      console.log(`Book ${bookId} moved to "reading" in Firestore.`); 
    } catch (error) {
      console.error("Failed to move book to reading:", error); 
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBookId && user) {
      console.log("Attempting to delete book:", selectedBookId); 
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

  console.log("Read later books:", books); 

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Read Later</h2>
        <button
          onClick={() => {
            console.log("Toggling edit mode:", !isEditMode); 
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