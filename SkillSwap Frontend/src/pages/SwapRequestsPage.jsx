import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import SwapRequestCard from "../components/SwapRequestCard";
import { toast } from "react-toastify";
import axios from "axios";

const SwapRequestsPage = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState("all");

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
      const response = await axios.get("http://localhost:3000/swap");
      const swap = response.data.List.filter(
        (s) => {
          const { senderId, receiverId } = getSwapUsers(s);
          return String(senderId) === String(user.userId) ||
            String(receiverId) === String(user.userId);
        }
      );
      setSwaps(swap);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getSwap();
      getUsers();
    }
  }, [user]);

  const fetchSwaps = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/swap"
      );

      setSwaps(response.data.List);
    } catch (error) {
      console.log(error);
    }
  };

  const getSwapUsers = (swap) => ({
    senderId: swap.senderId ?? swap.SenderId,
    receiverId: swap.receiverId ?? swap.ReceiverId,
  });

  const getSwapStatus = (swap) => {
    const value = String(swap.status ?? swap.Status ?? "Pending").toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const uid = user?.userId;
  const mySwaps = swaps.filter((s) => {
    const { senderId, receiverId } = getSwapUsers(s);
    return String(senderId) === String(uid) || String(receiverId) === String(uid);
  });
  const filtered = filter === "all" ? mySwaps : mySwaps.filter((s) => getSwapStatus(s) === filter);
  const incoming = mySwaps.filter((s) => {
    const { receiverId } = getSwapUsers(s);
    return String(receiverId) === String(uid) && getSwapStatus(s) === "Pending";
  });
  const handleAccept = async (id) => {
    try {

      await axios.put(
        `http://localhost:3000/swap/${id}/status`,
        {
          status: "Accepted",
        }
      );

      fetchSwaps();

      toast.success(
        "Swap request accepted!"
      );

    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id) => {
    try {

      await axios.put(
        `http://localhost:3000/swap/${id}/status`,
        {
          status: "Rejected",
        }
      );

      fetchSwaps();

      toast.info(
        "Swap request declined."
      );

    } catch (error) {
      console.log(error);
    }
  };

  const handleComplete = async (id) => {
    try {

      await axios.put(
        `http://localhost:3000/swap/${id}/status`,
        {
          status: "Completed",
        }
      );

      fetchSwaps();

      toast.success(
        "Swap request completed!"
      );

    } catch (error) {
      console.log(error);
    }
  };

  const counts = {
    all: mySwaps.length,
    Pending: mySwaps.filter((s) => getSwapStatus(s) === "Pending").length,
    Accepted: mySwaps.filter((s) => getSwapStatus(s) === "Accepted").length,
    Completed: mySwaps.filter((s) => getSwapStatus(s) === "Completed").length,
    Rejected: mySwaps.filter((s) => getSwapStatus(s) === "Rejected").length,
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
          {filtered.map((swap) => {
            const swapKey = swap._id ?? swap.swapId ?? swap.SwapId;
            return (
              <SwapRequestCard
                key={swapKey}
                swap={swap}
                currentUserId={user.userId}
                allUsers={allUsers} 
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SwapRequestsPage;
