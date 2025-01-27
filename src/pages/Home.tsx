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
  console.log("Rendering Home component"); // Лог рендера компонента

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleOpenSearchModal = () => {
    console.log("Opening search modal"); // Лог открытия модалки
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    console.log("Closing search modal"); // Лог закрытия модалки
    setIsSearchModalOpen(false);
  };

  const handleCloseAddBookModal = () => {
    console.log("Closing add book modal"); // Лог закрытия модалки добавления книги
    setIsAddBookModalOpen(false);
    setSelectedBook(null);
  };

  const handleBookSelect = (book: Book) => {
    console.log("Book selected:", book); // Лог выбранной книги
    setSelectedBook(book);
    setIsSearchModalOpen(false);
    setIsAddBookModalOpen(true);
  };

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Your Library!</h1>

      <div className="space-y-8">
        <ReadingNow />
        <Finished />
        <ReadLater />
      </div>

      <button
        className="fixed bottom-6 right-2 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 z-50"
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