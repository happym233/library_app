import { useOktaAuth } from "@okta/okta-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SpinnerLoading from "../../errors/SpinnerLoading";

export default function NavBar() {
  const navigate = useNavigate();
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) {
    return <SpinnerLoading />;
  }

  const handleLogout = async () => oktaAuth.signOut();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
        <div className="container-fluid">
          <span className="navbar-brand">Happy Read</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle Navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/search">
                  Search Book
                </NavLink>
              </li>

              {authState.isAuthenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="shelf">
                    Shelf
                  </NavLink>
                </li>
              )}

              {authState.isAuthenticated &&
                authState.accessToken?.claims.userType && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="admin">
                      Admin
                    </NavLink>
                  </li>
                )}
            </ul>

            <ul className="navbar-nav ms-auto">
              {!authState.isAuthenticated ? (
                <li className="nav-item m-1">
                  <a
                    type="button"
                    className="btn btn-outline-light"
                    href="/login"
                  >
                    Sign in
                  </a>
                </li>
              ) : (
                <li className="nav-item m-1">
                  <button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="App"></div>
    </>
  );
}
