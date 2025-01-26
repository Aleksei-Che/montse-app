// bookUtils/selectors.ts
import { RootState } from "../store";
import { Book } from "./booksSlice";

export const selectFinishedBooks = (state: RootState) =>
  state.books.books.filter((book: Book) => book.status === "finished");