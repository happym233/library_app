import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./layout/Navbar/Navbar";
import HomePage from "./layout/Home/HomePage";
import Footer from "./layout/Footer/Footer";
import SearchBooksPage from "./layout/SearchBooksPage/SearchBooksPage";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
