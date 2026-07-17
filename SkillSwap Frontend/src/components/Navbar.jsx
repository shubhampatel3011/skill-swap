import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md sticky-top ss-navbar shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="SkillSwap Logo" className="ss-navbar-logo" />
          <span className="ss-brand-text">SkillSwap</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <NavLink className="nav-link ss-nav-link" to="/skills">
                <i className="bi bi-grid-3x3-gap me-1"></i>Browse Skills
              </NavLink>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link ss-nav-link" to="/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link ss-nav-link" to="/swaps">
                    <i className="bi bi-arrow-left-right me-1"></i>Swaps
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link ss-nav-link" to="/chats">
                    <i className="bi bi-chat-dots me-1"></i>Chat
                  </NavLink>
                </li>
                {user.role === "admin" && (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link ss-nav-link ss-admin-link"
                      to="/admin"
                    >
                      <i className="bi bi-shield-check me-1"></i>Admin
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <div className="dropdown">
                  <button
                    className="btn ss-avatar-btn dropdown-toggle d-flex align-items-center gap-2"
                    data-bs-toggle="dropdown"
                    id="userMenuBtn"
                  >
                    <div className="ss-nav-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="d-none d-md-inline fw-semibold">
                      {user?.name?.split(" ")[0] || ""}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end ss-dropdown shadow">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person-circle me-2"></i>My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/skills/add">
                        <i className="bi bi-plus-circle me-2"></i>Add Skill
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/notifications">
                        <i className="bi bi-bell me-2"></i>Notifications
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/feedback">
                        <i className="bi bi-chat-left-text me-2"></i>Give Feedback
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn ss-btn-outline-primary btn-sm px-3"
                >
                  Login
                </Link>
                <Link to="/register" className="btn ss-btn-primary btn-sm px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
