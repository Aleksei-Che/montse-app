import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAuth } from "../hooks/useAuth";
import { addBookToFirestore } from "./booksSlice";
import ManualBookModal from "./ManualBookModal";
import { Book } from "./booksSlice";

const fetchBooks = async (query: string): Promise<Book[]> => {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY;
  if (!apiKey) throw new Error("Google Books API key is missing.");

  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error fetching books: ${response.status}`);

  const data = await response.json();
  return data.items.slice(0, 10).map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0] || "Unknown Author",
    coverImage: item.volumeInfo.imageLinks?.thumbnail || "",
  }));
};

const BookSearch: React.FC<{ onBookSelect: (book: Book) => void; onClose: () => void }> = ({
  onBookSelect,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [queryText, setQueryText] = useState("");
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  useEffect(() => {
    if (!queryText.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchBooks(queryText);
        setSuggestions(results);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch books.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [queryText]);

  const handleSave = useCallback(
    async (title: string, author: string, status: "reading" | "later") => {
      if (!title.trim() || !author.trim()) {
        console.error("Title and author cannot be empty");
        return;
      }

      const newBook: Book = {
        id: crypto.randomUUID(),
        title: title.trim(),
        author: author.trim(),
        coverImage: "/placeholder.jpg",
        status,
        ...(status === "reading" && { startTime: Date.now() }),
      };

      try {
        await dispatch(addBookToFirestore({ userId: user!.uid, book: newBook })).unwrap();
        console.log("Book added:", newBook);
        setIsManualEntryOpen(false);
      } catch (error) {
        console.error("Error adding book:", error);
      }
    },
    [dispatch, user]
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-10">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-xl relative w-full max-w-md md:max-w-lg lg:max-w-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-lg font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Search for a Book</h2>
  
        <input
          type="text"
          placeholder="Enter title or author"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded mb-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <div className="flex items-center justify-center my-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">can’t find it?</span>
        </div>
        <button
          onClick={() => setIsManualEntryOpen(true)}
          className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Manually
        </button>
  
        {isLoading && <p className="text-gray-500 text-center mt-2">Searching...</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
  
        <ul className="mt-4 space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {suggestions.length === 0 && !isLoading && !error && queryText && (
            <p className="text-gray-500 text-center">No books found for "{queryText}".</p>
          )}
          {suggestions.map((book) => (
            <li
              key={book.id}
              onClick={() => onBookSelect(book)}
              className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={book.coverImage || "/placeholder.jpg"}
                alt={book.title}
                className="w-16 h-24 object-cover rounded shadow"
              />
              <div>
                <p className="font-bold text-gray-800">{book.title}</p>
                <p className="text-sm text-gray-500">by {book.author}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
  
  
      {isManualEntryOpen && (
        <ManualBookModal
          onClose={() => setIsManualEntryOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BookSearch;