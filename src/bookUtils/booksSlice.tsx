import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookStatus = "reading" | "finished" | "later";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: BookStatus;
  startTime?: number; // Время начала чтения (timestamp)
  totalTime?: number; // Общее время чтения (в миллисекундах)
  finishedAt?: string; // Дата завершения
}

interface BooksState {
  books: Book[];
}

const initialState: BooksState = {
  books: [],
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    updateBookStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "reading" | "finished" | "later";
        startTime?: number;
        totalTime?: number;
        finishedAt?: string;
      }>
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.status = action.payload.status;
    
        if (action.payload.status === "reading" && !book.startTime) {
          book.startTime = action.payload.startTime || Date.now(); // Устанавливаем текущее время
        }
    
        if (action.payload.status === "finished") {
          book.totalTime = action.payload.totalTime;
          book.finishedAt = action.payload.finishedAt;
        }
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
    },
  },
});

export const { addBook, updateBookStatus, removeBook } = booksSlice.actions;
export default booksSlice.reducer;