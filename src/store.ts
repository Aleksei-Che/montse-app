// store.ts
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./bookUtils/BooksSlice"

const store = configureStore({
  reducer: {
    books: booksReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;