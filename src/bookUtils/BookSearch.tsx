import React, { useState, useEffect } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
}

interface BookSearchProps {
  onBookSelect: (book: Book) => void; // Коллбэк при выборе книги
  onClose: () => void; // Закрытие модалки
}

const BookSearch: React.FC<BookSearchProps> = ({ onBookSelect, onClose }) => {
  const [queryText, setQueryText] = useState("");
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!queryText.trim()) {
      setSuggestions([]); // Очищаем результаты, если пользователь удаляет текст
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchBooks(queryText);
        setSuggestions(results);
      } catch (err: any) {
        setError(err.message || "Failed to fetch books.");
      } finally {
        setIsLoading(false);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn); // Очищаем таймер при каждом новом вводе
  }, [queryText]);

  const fetchBooks = async (query: string): Promise<Book[]> => {
    const apiKey = import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY;
    if (!apiKey) throw new Error("Google Books API key is missing.");

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching books: ${response.status}`);
    }

    const data = await response.json();
    return data.items.slice(0, 10).map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || "Unknown Author",
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "",
    }));
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
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

        {isLoading && (
          <p className="text-gray-500 text-center mt-2">Searching...</p>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <ul className="mt-4 space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {suggestions.length === 0 && !isLoading && !error && queryText && (
            <p className="text-gray-500 text-center">
              No books found for "{queryText}".
            </p>
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
    </div>
  );
};

export default BookSearch;