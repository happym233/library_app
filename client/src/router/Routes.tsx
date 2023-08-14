import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../layout/Home/HomePage";
import SearchBook from "../layout/SearchBooksPage/components/SearchBook";
import SearchBooksPage from "../layout/SearchBooksPage/SearchBooksPage";
import NotFound from "../errors/NotFound";
import BookCheckoutPage from "../layout/BookCheckoutPage/BookCheckoutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/search", element: <SearchBooksPage /> },
      { path: "/checkout/:bookId", element: <BookCheckoutPage /> },
      { path: "/not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
