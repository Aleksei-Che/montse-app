import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchBooksFromFirestore } from "../bookUtils/booksSlice";
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  isWithinInterval,
} from "date-fns";
import { RootState } from "../store";
import Goals from "../components/exploreComponents/Goals";

const Explore: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const books = useSelector((state: RootState) => state.books.books);

  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    if (user) {
      console.log("Fetching books for user:", user.uid); 
      dispatch(fetchBooksFromFirestore(user.uid));
    }
  }, [user, dispatch]);

  const filteredBooks = useMemo(() => {
    console.log("Applying filter for period:", selectedPeriod);
    const now = new Date();
    let start: Date, end: Date;

    if (selectedPeriod === "week") {
      start = startOfWeek(now);
      end = endOfWeek(now);
    } else if (selectedPeriod === "month") {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = startOfYear(now);
      end = endOfYear(now);
    }

    const result = books.filter((book) =>
      book.finishedAt && isWithinInterval(new Date(book.finishedAt), { start, end })
    );

    console.log(`Filtered books for ${selectedPeriod}:`, result); 
    return result;
  }, [selectedPeriod, books]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        📊 Explore Your Statistics
      </h1>
  
      <div className="flex justify-center space-x-2 mb-6">
        {["week", "month", "year"].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period as "week" | "month" | "year")}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold shadow-md ${
              selectedPeriod === period
                ? "bg-blue-500 text-white border-2 border-blue-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>
  
      <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 mb-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          📚 Books read this {selectedPeriod}:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <li key={book.id} className="text-gray-700 dark:text-gray-300">
                {book.title}{" "}
                <span className="text-gray-500">
                  (Read on: {book.finishedAt ? new Date(book.finishedAt).toLocaleDateString() : "Unknown date"})
                </span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 italic">
              📖 No books found for this {selectedPeriod}.
            </p>
          )}
        </ul>
      </div>
  
      <Goals />
    </div>
  );
};

export default Explore;