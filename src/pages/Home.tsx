import React, { useState } from "react";
import ReadingNow from "../components/homeComponents/ReadingNow";
import Finished from "../components/homeComponents/Finished";
import ReadLater from "../components/homeComponents/ReadLater";
import AddBookModal from "../bookUtils/AddBookModal";
import BookSearch from "../bookUtils/BookSearch";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
}

const Home: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleCloseAddBookModal = () => {
    setIsAddBookModalOpen(false);
    setSelectedBook(null);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setIsSearchModalOpen(false);
    setIsAddBookModalOpen(true);
  };

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Your Library!</h1>

      <div className="space-y-8">
        <ReadingNow />
        <Finished />
        <ReadLater />
      </div>

      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600"
        onClick={handleOpenSearchModal}
      >
        +
      </button>

      {isSearchModalOpen && (
        <BookSearch
          onBookSelect={handleBookSelect}
          onClose={handleCloseSearchModal}
        />
      )}

      {isAddBookModalOpen && selectedBook && (
        <AddBookModal
          book={selectedBook}
          onClose={handleCloseAddBookModal}
        />
      )}
    </div>
  );
};

export default Home;