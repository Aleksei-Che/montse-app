import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, addDoc, deleteDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

type BookStatus = "reading" | "finished" | "later";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: BookStatus;
  startTime?: number;
  totalTime?: number;
  finishedAt?: string;
}

interface BooksState {
  books: Book[];
}

const initialState: BooksState = {
  books: [],
};

export const fetchBooksFromFirestore = createAsyncThunk<Book[], string>(
  "books/fetchBooksFromFirestore",
  async (userId, { rejectWithValue }) => {
    try {
      const booksRef = collection(db, "users", userId, "books");
      const querySnapshot = await getDocs(booksRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Book[];
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred while fetching books.");
    }
  }
);

export const addBookToFirestore = createAsyncThunk(
  "books/addBookToFirestore",
  async ({ userId, book }: { userId: string; book: Book }, { rejectWithValue }) => {
    try {
      const { id, ...bookWithoutId } = book;
      const booksRef = collection(db, "users", userId, "books");
      const docRef = await addDoc(booksRef, bookWithoutId);
      return { ...bookWithoutId, id: docRef.id };
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred while adding the book.");
    }
  }
);

export const updateBookInFirestore = createAsyncThunk(
  "books/updateBookInFirestore",
  async ({ userId, bookId, updates }: { userId: string; bookId: string; updates: Partial<Book> }, { rejectWithValue }) => {
    try {
      const bookRef = doc(db, "users", userId, "books", bookId);
      await updateDoc(bookRef, updates);
      return { bookId, updates };
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred while updating the book.");
    }
  }
);

export const removeBookFromFirestore = createAsyncThunk(
  "books/removeBookFromFirestore",
  async ({ userId, bookId }: { userId: string; bookId: string }, { rejectWithValue }) => {
    try {
      const bookRef = doc(db, "users", userId, "books", bookId); // Ссылка на документ книги
      await deleteDoc(bookRef); // Удаляем книгу из Firestore
      console.log(`Book ${bookId} successfully deleted from Firestore.`);
      return bookId; // Возвращаем ID удалённой книги
    } catch (error) {
      console.error("Error deleting book from Firestore:", error);
      return rejectWithValue("Failed to delete the book.");
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    updateBookStatus: (
      state,
      action: PayloadAction<{ id: string; status: BookStatus; startTime?: number; totalTime?: number; finishedAt?: string }>
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        Object.assign(book, action.payload); // Обновляем статус книги и другие поля
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksFromFirestore.fulfilled, (state, action) => {
        state.books = action.payload;
      })
      .addCase(addBookToFirestore.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBookInFirestore.fulfilled, (state, action) => {
        const { bookId, updates } = action.payload;
        const book = state.books.find((b) => b.id === bookId);
        if (book) Object.assign(book, updates);
      })
      .addCase(removeBookFromFirestore.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book.id !== action.payload); // Удаляем книгу из состояния
      });
  },
});

export const { updateBookStatus } = booksSlice.actions;
export default booksSlice.reducer;