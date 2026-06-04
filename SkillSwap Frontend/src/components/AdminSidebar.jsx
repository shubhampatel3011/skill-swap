import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", icon: "bi-speedometer2", label: "Dashboard", end: true },
  { to: "/admin/users", icon: "bi-people", label: "Users" },
  { to: "/admin/skills", icon: "bi-grid-3x3-gap", label: "Skills" },
  { to: "/admin/swaps", icon: "bi-arrow-left-right", label: "Swaps" },
];

const AdminSidebar = () => (
  <div className="ss-admin-sidebar d-flex flex-column p-3 gap-1">
    <div className="ss-admin-sidebar-brand mb-3 px-2">
      <span className="fw-bold text-white">
        <i className="bi bi-shield-check me-2 text-warning"></i>Admin Panel
      </span>
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
  </div>
);

export default AdminSidebar;
