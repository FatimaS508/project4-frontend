import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/sign-in");
  }

  return (
    <nav className="navbar">
      <div className="navbar-logos">
        <Link
          className="logo-link"
          to={
            user?.role === "technician"
              ? "/dashboard2"
              : user
                ? "/dashboard"
                : "/"
          }
        >
          <img
            className="app-logo"
            src="/images/support-logo.png"
            alt="Support application"
          />
        </Link>

        <span className="logo-divider"></span>

        <img
          className="organization-logo"
          src="/images/organization-logo.png"
          alt="Organization"
        />
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            <NavLink
              className="navbar-link"
              to={
                user.role === "technician"
                  ? "/dashboard2"
                  : "/dashboard"
              }
            >
              <svg
                className="navbar-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5 10.5V20h14v-9.5" />
                <path d="M9 20v-6h6v6" />
              </svg>

              <span>Dashboard</span>
            </NavLink>

            {user.role === "employee" && (
              <NavLink className="navbar-link" to="/requests">
                <svg
                  className="navbar-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 3h12v18H6z" />
                  <path d="M9 8h6" />
                  <path d="M9 12h6" />
                  <path d="M9 16h4" />
                </svg>

                <span>All Requests</span>
              </NavLink>
            )}

            <button
              className="navbar-link logout-button"
              type="button"
              onClick={handleLogout}
            >
              <svg
                className="navbar-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M10 5H5v14h5" />
                <path d="M14 8l4 4-4 4" />
                <path d="M8 12h10" />
              </svg>

              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <NavLink className="navbar-link" to="/sign-up">
              <svg
                className="navbar-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="10" cy="8" r="4" />
                <path d="M3 21c0-4 3-7 7-7 2 0 4 .8 5.3 2.2" />
                <path d="M19 14v6" />
                <path d="M16 17h6" />
              </svg>

              <span>Sign Up</span>
            </NavLink>

            <NavLink className="navbar-link" to="/sign-in">
              <svg
                className="navbar-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14 5h5v14h-5" />
                <path d="M10 8l4 4-4 4" />
                <path d="M14 12H3" />
              </svg>

              <span>Sign In</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;