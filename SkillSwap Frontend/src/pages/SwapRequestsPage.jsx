import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_SWAPS } from "../data/mockData";
import SwapRequestCard from "../components/SwapRequestCard";
import { toast } from "react-toastify";

const SwapRequestsPage = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState(MOCK_SWAPS);
  const [filter, setFilter] = useState("all");

  const mySwaps = swaps.filter((s) => s.senderId === user?._id || s.receiverId === user?._id);
  const filtered = filter === "all" ? mySwaps : mySwaps.filter((s) => s.status === filter);
  const incoming = mySwaps.filter((s) => s.receiverId === user?._id && s.status === "Pending");
  const outgoing = mySwaps.filter((s) => s.senderId === user?._id && s.status === "Pending");

  const updateStatus = (id, newStatus) => {
    setSwaps((prev) => prev.map((s) => s._id === id ? { ...s, status: newStatus } : s));
  };

  const handleAccept = (id) => {
    updateStatus(id, "Accepted");
    toast.success("Swap request accepted! Chat is now enabled.");
  };

  const handleReject = (id) => {
    updateStatus(id, "Rejected");
    toast.info("Swap request declined.");
  };

  const handleComplete = (id) => {
    updateStatus(id, "Completed");
    toast.success("Marked as completed! Don't forget to leave a review.");
  };

  const counts = {
    all: mySwaps.length,
    Pending: mySwaps.filter((s) => s.status === "Pending").length,
    Accepted: mySwaps.filter((s) => s.status === "Accepted").length,
    Completed: mySwaps.filter((s) => s.status === "Completed").length,
    Rejected: mySwaps.filter((s) => s.status === "Rejected").length,
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Swap Requests</h2>
          <p className="text-muted mb-0">Manage your skill exchange requests</p>
        </div>
        {incoming.length > 0 && (
          <div className="alert alert-warning d-flex align-items-center gap-2 mb-0 py-2 px-3">
            <i className="bi bi-bell-fill"></i>
            <span className="small"><strong>{incoming.length}</strong> pending request{incoming.length > 1 ? "s" : ""} awaiting your response</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { key: "all", label: "Total", color: "secondary", icon: "bi-list" },
          { key: "Pending", label: "Pending", color: "warning", icon: "bi-clock" },
          { key: "Accepted", label: "Active", color: "success", icon: "bi-check-circle" },
          { key: "Completed", label: "Completed", color: "info", icon: "bi-trophy" },
          { key: "Rejected", label: "Rejected", color: "danger", icon: "bi-x-circle" },
        ].map((s) => (
          <div key={s.key} className="col-6 col-md">
            <button
              className={`card border-0 shadow-sm w-100 text-start p-3 ss-filter-stat-card ${filter === s.key ? `border-${s.color} border-2` : ""}`}
              onClick={() => setFilter(s.key)}
              style={{ cursor: "pointer" }}
            >
              <div className={`d-flex align-items-center gap-2 text-${s.color} mb-1`}>
                <i className={`bi ${s.icon}`}></i>
                <small className="fw-semibold">{s.label}</small>
              </div>
              <div className="fs-3 fw-bold">{counts[s.key]}</div>
            </button>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-pills mb-4 gap-1">
        {["all", "Pending", "Accepted", "Completed", "Rejected"].map((f) => (
          <li key={f} className="nav-item">
            <button
              className={`nav-link ${filter === f ? "ss-btn-primary" : "btn-outline-secondary"} btn btn-sm`}
              onClick={() => setFilter(f)}
              id={`swapTab_${f}`}
            >
              {f === "all" ? "All" : f}
              <span className="badge bg-light text-dark ms-2">{counts[f]}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-arrow-left-right display-4 text-muted d-block mb-3"></i>
          <h5 className="text-muted">No {filter !== "all" ? filter.toLowerCase() : ""} swaps found</h5>
          <p className="text-muted small">Browse skills and send swap requests to get started!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((swap) => (
            <SwapRequestCard
              key={swap._id}
              swap={swap}
              currentUserId={user?._id}
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapRequestsPage;
