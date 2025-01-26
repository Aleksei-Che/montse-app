import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { updateBookStatus } from "../../bookUtils/BooksSlice";
import BookCard from "./BookCard";

const ReadLater: React.FC = () => {
  const dispatch = useDispatch();

  // Получаем книги со статусом "later" из состояния Redux
  const books = useSelector((state: RootState) =>
    state.books.books.filter((book) => book.status === "later")
  );

  // Перемещение книги в секцию "ReadingNow"
  const handleStartReading = (bookId: string) => {
    dispatch(updateBookStatus({ id: bookId, status: "reading" }));
    console.log(`Book with ID: ${bookId} moved to Reading Now.`);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Read Later</h2>
      {books.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <li key={book.id}>
              <BookCard
                {...book}
                onActionClick={() => handleStartReading(book.id)}
                actionLabel="Start Reading"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You haven't added any books to read later.</p>
      )}
    </section>
  );
};

export default ReadLater;