import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MOCK_SWAPS, MOCK_SKILLS, MOCK_NOTIFICATIONS } from "../data/mockData";
import StarRating from "../components/StarRating";

const DashboardPage = () => {
  const { user } = useAuth();
  const mySwaps = MOCK_SWAPS.filter((s) => s.senderId === user?._id || s.receiverId === user?._id);
  const mySkills = MOCK_SKILLS.filter((s) => s.userId === user?._id);
  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => n.userId === user?._id && !n.isRead);
  const activeSwaps = mySwaps.filter((s) => s.status === "Accepted");
  const completed = mySwaps.filter((s) => s.status === "Completed");
  const pending = mySwaps.filter((s) => s.status === "Pending");

  const quickLinks = [
    { to: "/skills/add", icon: "bi-plus-circle", label: "Add Skill", color: "primary" },
    { to: "/skills", icon: "bi-search", label: "Browse Skills", color: "info" },
    { to: "/swaps", icon: "bi-arrow-left-right", label: "My Swaps", color: "success" },
    { to: "/profile", icon: "bi-person-gear", label: "Edit Profile", color: "warning" },
    { to: "/notifications", icon: "bi-bell", label: "Notifications", color: "danger" },
    { to: "/reviews", icon: "bi-star", label: "Reviews", color: "secondary" },
  ];

  return (
    <div className="container py-5">
      {/* Welcome Banner */}
      <div className="ss-dashboard-banner d-flex align-items-center justify-content-between flex-wrap gap-3 p-4 rounded-4 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="ss-nav-avatar rounded-circle border-2 border-white d-flex p-4 fs-5 align-items-center justify-content-center text-white fw-bold shadow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="fw-bold text-white mb-0">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h4>
            <p className="text-white-50 mb-0 small">
              {user?.location} •{" "}
              {user?.role === "admin" ? "Administrator" : "Community Member"}
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <StarRating value={user?.rating || 0} />
          <span className="text-white fw-bold">{user?.rating || "—"}</span>
          <span className="text-white-50 small">
            ({user?.reviewCount || 0} reviews)
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "My Skills",
            val: mySkills.length,
            icon: "bi-mortarboard",
            color: "primary",
          },
          {
            label: "Active Swaps",
            val: activeSwaps.length,
            icon: "bi-arrow-left-right",
            color: "success",
          },
          {
            label: "Pending Requests",
            val: pending.length,
            icon: "bi-clock",
            color: "warning",
          },
          {
            label: "Completed",
            val: completed.length,
            icon: "bi-trophy",
            color: "info",
          },
          {
            label: "Unread Notifs",
            val: unreadNotifs.length,
            icon: "bi-bell",
            color: "danger",
          },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-4 col-lg">
            <div
              className={`ss-stat-card card border-0 shadow-sm p-3 h-100 border-start border-4 border-${s.color}`}
            >
              <div
                className={`d-flex align-items-center gap-2 text-${s.color} mb-1`}
              >
                <i className={`bi ${s.icon} fs-5`}></i>
                <small className="fw-semibold">{s.label}</small>
              </div>
              <div className="display-6 fw-bold">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Quick Links */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent fw-bold border-0 pt-3 text-warning">
              <i className="bi bi-lightning me-2 text-warning"></i>Quick Actions
            </div>
            <div className="card-body">
              <div className="row g-2">
                {quickLinks.map((l) => (
                  <div key={l.to} className="col-6">
                    <Link
                      to={l.to}
                      className={`btn btn-outline-${l.color} w-100 d-flex flex-column align-items-center py-3 gap-1 ss-quick-link`}
                    >
                      <i className={`bi ${l.icon} fs-5`}></i>
                      <span className="medium fw-bolder">{l.label}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Swaps */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent fw-bold border-0 pt-3 d-flex justify-content-between">
              <span className="">
                <i className="bi bi-arrow-left-right me-2 text-primary"></i>
                Recent Swaps
              </span>
              <Link to="/swaps" className="btn btn-sm ss-btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {mySwaps.length === 0 && (
                <p className="text-muted small text-center py-3">
                  No swaps yet. <Link to="/skills">Browse skills</Link> to
                  start!
                </p>
              )}
              {mySwaps.slice(0, 4).map((swap) => {
                const isSender = swap.senderId === user?._id;
                const partner = isSender ? swap.receiverName : swap.senderName;
                const partnerImg = isSender
                  ? swap.receiverImage
                  : swap.senderImage;
                const statusColor = {
                  Pending: "warning",
                  Accepted: "success",
                  Rejected: "danger",
                  Completed: "info",
                }[swap.status];
                return (
                  <div
                    key={swap._id}
                    className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom"
                  >
                    <img
                      src={partnerImg}
                      alt={partner}
                      className="rounded-circle"
                      width={40}
                      height={40}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{partner}</div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        {swap.offeredSkill} ↔ {swap.requestedSkill}
                      </div>
                    </div>
                    <span
                      className={`badge bg-${statusColor} bg-opacity-15 border border-${statusColor}`}
                    >
                      {swap.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Skills */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent fw-bold border-0 pt-3 d-flex justify-content-between">
              <span className="text-success">
                <i className="bi bi-mortarboard me-2 text-success"></i>My Skills
              </span>
              <Link to="/skills/add" className="btn btn-sm ss-btn-primary">
                + Add
              </Link>
            </div>
            <div className="card-body">
              {mySkills.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-plus-circle display-5 text-muted d-block mb-2"></i>
                  <p className="text-muted small mb-3">No skills added yet</p>
                  <Link to="/skills/add" className="btn ss-btn-primary btn-sm">
                    Add Your First Skill
                  </Link>
                </div>
              )}
              {mySkills.map((s) => (
                <div
                  key={s._id}
                  className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom"
                >
                  <div
                    className="ss-skill-dot bg-primary rounded-circle"
                    style={{ width: 8, height: 8 }}
                  ></div>
                  <div>
                    <div className="small fw-semibold">{s.title}</div>
                    <div className="text-muted" style={{ fontSize: "12px" }}>
                      {s.category} • {s.experienceLevel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
