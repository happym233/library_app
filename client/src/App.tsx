import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./layout/Navbar/Navbar";
import HomePage from "./layout/Home/HomePage";
import Footer from "./layout/Footer/Footer";
import SearchBooksPage from "./layout/SearchBooksPage/SearchBooksPage";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { oktaConfig } from "./lib/oktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security } from "@okta/okta-react";

function App() {
  const oktaAuth = new OktaAuth(oktaConfig);
  const navigate = useNavigate();
  const customAuthHandler = () => {
    navigate("/login");
  };

  const restoreOriginUr = async (_oktaAuth: any, originUri: any) => {
    navigate(toRelativeUrl(originUri || "/", window.location.origin));
  };
  return (
    <Security
      oktaAuth={oktaAuth}
      restoreOriginalUri={restoreOriginUr}
      onAuthRequired={customAuthHandler}
    >
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <div className="flex-grow-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </Security>
  );
}

export default App;
