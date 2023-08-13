import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./layout/Navbar/Navbar";
import HomePage from "./layout/Home/HomePage";
import Footer from "./layout/Footer/Footer";

function App() {
  return (
    <>
      <NavBar />
      <HomePage />
      <Footer />
    </>
  );
}

export default App;
