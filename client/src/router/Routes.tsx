import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../layout/Home/HomePage";
import SearchBook from "../layout/SearchBooksPage/components/SearchBook";
import SearchBooksPage from "../layout/SearchBooksPage/SearchBooksPage";
import NotFound from "../errors/NotFound";
import BookCheckoutPage from "../layout/BookCheckoutPage/BookCheckoutPage";
import LoginWidget from "../auth/LoginWidget";
import { oktaConfig } from "../lib/oktaConfig";
import { LoginCallback } from "@okta/okta-react";
import ReviewListPage from "../layout/ReviewListPage/ReviewListPage";
import RequiredAuth from "./RequireAuth";
import { ShelfPage } from "../layout/ShelfPage/ShelfPage";
import MessagesPage from "../layout/MessagesPage/MessagesPage";
import ManageLibraryPage from "../layout/ManageLibraryPage/ManageLibraryPage";
import { Children } from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequiredAuth />,
        children: [
          { path: "/shelf", element: <ShelfPage /> },
          { path: "/messages", element: <MessagesPage /> },
        ],
      },
      {
        element: <RequiredAuth admin />,
        children: [{ path: "/admin", element: <ManageLibraryPage /> }],
      },
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/home", element: <HomePage /> },
      { path: "/search", element: <SearchBooksPage /> },
      { path: "/checkout/:bookId", element: <BookCheckoutPage /> },
      { path: "/login", element: <LoginWidget config={oktaConfig} /> },
      { path: "/login/callback", element: <LoginCallback /> },
      { path: "/login/oauth2/code/okta", element: <LoginCallback /> },
      { path: "/reviewlist/:bookId", element: <ReviewListPage /> },
      { path: "/not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
