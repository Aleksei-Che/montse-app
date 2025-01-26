import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import BookCard from "./BookCard";

const Finished: React.FC = () => {
  const books = useSelector((state: RootState) =>
    state.books.books.filter((book) => book.status === "finished")
  );

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Finished</h2>
      {books.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <li key={book.id}>
              <BookCard {...book}>
                <p className="text-sm mt-2 text-green-500">
                  Finished on: {new Date(book.finishedAt!).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Total Time: {Math.floor(book.totalTime! / (1000 * 60 * 60))}h{" "}
                  {Math.floor((book.totalTime! % (1000 * 60 * 60)) / (1000 * 60))}m
                </p>
              </BookCard>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You haven't finished any books yet.</p>
      )}
    </section>
  );
};

export default Finished;