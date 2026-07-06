import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
  const { user } = useAuth();
  const [mySwap, setMySwap] = useState([]);
  const [mySkill, setMySkill] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [notification, setNotification] = useState([]);


  const getSkill = async () => {
    try {
      const response = await axios.get("http://localhost:3000/skills");
      const allSkillsList = response.data.List;
      setAllSkills(allSkillsList);
      setMySkill(allSkillsList.filter((skill) => skill.userId === user.userId));
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setAllUsers(response.data.List);
    } catch (error) {
      console.log(error);
    }
  };

  const getSwap = async () => {
    try {

      const response = await axios.get(
        "http://localhost:3000/swap"
      );

      const swap = response.data.List.filter(
        (s) =>
          s.senderId === user.userId ||
          s.receiverId === user.userId
      );

      setMySwap(swap);

    } catch (error) {
      console.log(error);
    }
  };

  const getNotification = async () => {
    try {

      const response = await axios.get(
        `http://localhost:3000/notification/${user.userId}`
      );

      setNotification(response.data.List);

    } catch (error) {
      console.log(error);
    }
  };

  const unreadNotifs = notification.filter(
    (n) => !n.isRead
  );

  const activeSwap = mySwap.filter(
    (s) => s.status === "Accepted"
  );

  const completed = mySwap.filter(
    (s) => s.status === "Completed"
  );

  const pending = mySwap.filter(
    (s) => s.status === "Pending"
  );


  useEffect(() => {
    if (user) {
      getSkill();
      getUsers();
      getSwap();
      getNotification();
    }
  }, [user]);

  // Lookup maps — handle both camelCase (userId) and PascalCase (UserId) from MySQL
  const skillMap = Object.fromEntries(allSkills.map((s) => [s.skillId ?? s.SkillId, s.title ?? s.Title]));
  const userMap  = Object.fromEntries(allUsers.map((u)  => [u.userId ?? u.UserId,  u]));

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
            val: mySkill.length,
            icon: "bi-mortarboard",
            color: "primary",
          },
          {
            label: "Active Swaps",
            val: activeSwap.length,
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
            label: "Unread Notifications",
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
              <span className="text-primary">
                <i className="bi bi-arrow-left-right me-2 text-primary"></i>
                Recent Swaps
              </span>
              <Link to="/swaps" className="btn btn-sm ss-btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {mySwap.length === 0 && (
                <p className="text-muted small text-center py-3">
                  No swaps yet. <Link to="/skills">Browse skills</Link> to
                  start!
                </p>
              )}
              {mySwap.slice(0, 4).map((swap) => {
                // Determine the opponent (partner) — not the logged-in user
                // isSender = true  → current user sent the swap → opponent is the receiver
                // isSender = false → current user received the swap → opponent is the sender
                const isSender = (swap.senderId ?? swap.SenderId) === user?.userId;
                const partnerId = isSender ? swap.receiverId ?? swap.ReceiverId
                                           : swap.senderId   ?? swap.SenderId;
                const partnerUser = userMap[partnerId];
                // Handle both camelCase and PascalCase field names returned by MySQL
                const partner    = partnerUser?.name ?? partnerUser?.Name ?? "Unknown";
                const partnerImg = partnerUser?.profileImage ?? partnerUser?.ProfileImage ?? null;
                const offeredSkillName  = skillMap[swap.offeredSkillId]  || skillMap[swap.OfferedSkillId]  || "—";
                const requestedSkillName = skillMap[swap.requestedSkillId] || skillMap[swap.RequestedSkillId] || "—";
                const statusConfig = {
                  Pending:   { color: "warning", icon: "bi-clock-history" },
                  Accepted:  { color: "success", icon: "bi-check-circle" },
                  Rejected:  { color: "danger", icon: "bi-x-circle" },
                  Completed: { color: "info", icon: "bi-trophy" },
                };
                const cfg = statusConfig[swap.status] || statusConfig.Pending;
                return (
                  <div
                    key={swap.swapId}
                    className="d-flex align-items-center gap-3 mb-3 pb-3 ps-3"
                  >
                    <img
                      src={partnerImg || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={partner || "User"}
                      className="rounded-circle flex-shrink-0 object-fit-cover"
                      style={{ width: 44, height: 44, objectFit: "cover" }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="fw-semibold small text-truncate">{partner || "Unknown"}</div>
                      <div className="text-muted text-truncate" style={{ fontSize: "11px" }}>
                        <span className="text-primary fw-medium">{offeredSkillName}</span>
                        {" "}<i className="bi bi-arrow-left-right mx-1" style={{ fontSize: "10px" }} />{" "}
                        <span className="text-success fw-medium">{requestedSkillName}</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        {isSender ? "You sent" : "Received"}
                      </div>
                    </div>
                    <span
                      className={`badge d-flex align-items-center gap-1 px-2 py-2 bg-${cfg.color} bg-opacity-15 border border-${cfg.color} ${cfg.textClass} flex-shrink-0`}
                      style={{ fontSize: "11px" }}
                    >
                      <i className={`bi ${cfg.icon}`} />
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
              {mySkill.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-plus-circle display-5 text-muted d-block mb-2"></i>
                  <p className="text-muted small mb-3">No skills added yet</p>
                  <Link to="/skills/add" className="btn ss-btn-primary btn-sm">
                    Add Your First Skill
                  </Link>
                </div>
              )}
              {mySkill.map((s) => (
                <div
                  key={s.skillId}
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
