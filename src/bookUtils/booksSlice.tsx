import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, addDoc, deleteDoc, updateDoc, getDocs, collection, collectionGroup } from "firebase/firestore";
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
  totalReaders?: number;
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
      const bookRef = doc(db, "users", userId, "books", bookId);
      await deleteDoc(bookRef);
      console.log(`Book ${bookId} successfully deleted from Firestore.`);
      return bookId;
    } catch (error) {
      console.error("Error deleting book from Firestore:", error);
      return rejectWithValue("Failed to delete the book.");
    }
  }
);
export const fetchTotalReaders = createAsyncThunk<{ title: string; totalReaders: number },string> ("books/fetchTotalReaders", async (title, { rejectWithValue }) => {
  try {
    const booksRef = collectionGroup(db, "books");
    const querySnapshot = await getDocs(booksRef);

    const totalReaders = querySnapshot.docs.filter(
      (doc) => doc.data().title === title && doc.data().status === "reading"
    ).length;

    return { title, totalReaders };
  } catch (error) {
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue("Failed to fetch total readers.");
  }
});


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
        Object.assign(book, action.payload);
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
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(fetchTotalReaders.fulfilled, (state, action) => {
        const book = state.books.find((b) => b.title === action.payload.title);
        if (book) {
          book.totalReaders = action.payload.totalReaders;
        }
      });
  },
});

export const { updateBookStatus } = booksSlice.actions;
export default booksSlice.reducer;