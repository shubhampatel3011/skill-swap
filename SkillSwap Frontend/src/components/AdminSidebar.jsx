import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin", icon: "bi-speedometer2", label: "Dashboard", end: true },
  { to: "/admin/users", icon: "bi-people", label: "Users" },
  { to: "/admin/skills", icon: "bi-grid-3x3-gap", label: "Skills" },
  { to: "/admin/swaps", icon: "bi-arrow-left-right", label: "Swaps" },
  { to: "/admin/categories", icon: "bi-folder", label: "Categories" },
  { to: "/admin/sub-categories", icon: "bi-folder-symlink", label: "Sub-categories" },
  { to: "/admin/third-categories", icon: "bi-folder2-open", label: "Third-categories" },
  { to: "/admin/feedback", icon: "bi-chat-left-heart", label: "Feedback" },
  { to: "/admin/reviews", icon: "bi-star", label: "Reviews" },
];

const AdminSidebar = () => {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="ss-admin-sidebar d-flex flex-column p-3 gap-1">
      <div className="ss-admin-sidebar-brand mb-3 px-2 text-center">
        <img src={logo} alt="SkillSwap Logo" className="ss-sidebar-logo mb-3" />
        <div className="fw-bold text-white mt-3">
          <i className="bi bi-shield-check me-2 text-warning"></i>Admin Panel
        </div>
      </div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `ss-admin-nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${isActive ? "active" : ""}`
          }
        >
          <i className={`bi ${l.icon}`}></i>
          {l.label}
        </NavLink>
      ))}
      <div className="mt-auto pt-3 border-top border-white border-opacity-25">
        <button
          id="adminSidebarLogout"
          onClick={handleLogout}
          className="ss-admin-nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none w-100 border-0 bg-transparent text-danger"
        >
          <i className="bi bi-box-arrow-left"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
