import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";
import axios from "axios";


const statusColor = { Pending: "warning", Accepted: "success", Rejected: "danger", Completed: "info" };

const AdminSwaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [authConfig, setAuthConfig] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthConfig({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, []);

  const getSwaps = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/swap/${id}`,
        authConfig
      );
      setSwaps(response.data?.List ?? []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch swaps");
    }
  };

  const swapsData = (response.data.List || []).map((s) => ({
    id: s.swapId || s.SwapId,
    senderName: s.senderName || s.SenderName || "",
    receiverName: s.receiverName || s.ReceiverName || "",
    offeredSkill: s.offeredSkill || s.OfferedSkill || "",
    requestedSkill: s.requestedSkill || s.RequestedSkill || "",
    status: s.status || s.Status || "Pending",
    createdAt: s.createdAt || s.CreatedAt
  }));

  setSwaps(swapsData);

  useEffect(() => {
    getSwaps();
  }, []);

  const filtered = swaps.filter((s) => {

    const matchFilter =
      filter === "all" ||
      s.status === filter;

    const searchText = search.toLowerCase();

    const matchSearch = (s.senderName || "").toLowerCase().includes(searchText) || (s.receiverName || "").toLowerCase().includes(searchText) || (s.offeredSkill || "").toLowerCase().includes(searchText);
    return matchFilter && matchSearch;

  });

  const counts = {
    all: swaps.length,
    Pending: swaps.filter((s) => s.status === "Pending").length,
    Accepted: swaps.filter((s) => s.status === "Accepted").length,
    Completed: swaps.filter((s) => s.status === "Completed").length,
    Rejected: swaps.filter((s) => s.status === "Rejected").length,
  };

  const cancelSwap = async (id) => {
    try {
      await axios.put(`http://localhost:3000/swap/${id}`, {
        status: "Rejected",
        authConfig
      });

      getSwaps();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="mb-4">
          <h3 className="fw-bold mb-0">Monitor Swaps</h3>
          <p className="text-muted">Oversee all skill exchange requests on the platform</p>
        </div>

        {/* Summary */}
        <div className="row g-2 mb-4">
          {Object.entries(counts).map(([key, val]) => (
            <div key={key} className="col">
              <button
                className={`card border-0 shadow-sm w-100 text-start p-3 ss-filter-stat-card ${filter === key ? "border-primary border-2" : ""}`}
                onClick={() => setFilter(key)}
                style={{ cursor: "pointer" }}
              >
                <div className={`small fw-semibold text-${key === "all" ? "secondary" : statusColor[key] || "secondary"} mb-1`}>
                  {key === "all" ? "All" : key}
                </div>
                <div className="fs-4 fw-bold">{val}</div>
              </button>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="input-group mb-4" style={{ maxWidth: 350 }}>
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input type="text" className="form-control" placeholder="Search by user or skill..." id="adminSwapSearch"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="ss-admin-table-head">
                <tr>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((swap) => (
                  <tr key={swap.swapId}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={swap.senderImage} alt={swap.senderName} className="rounded-circle" width={30} height={30} />
                        <small className="fw-semibold">{swap.senderName}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={swap.receiverImage} alt={swap.receiverName} className="rounded-circle" width={30} height={30} />
                        <small className="fw-semibold">{swap.receiverName}</small>
                      </div>
                    </td>
                    <td>
                      <small className="text-primary">{swap.offeredSkill}</small>
                      <small className="text-muted mx-1">↔</small>
                      <small className="text-success">{swap.requestedSkill}</small>
                    </td>
                    <td>
                      <span className={`badge bg-${statusColor[swap.status]} bg-opacity-15 border border-${statusColor[swap.status]}`}>
                        {swap.status}
                      </span>
                    </td>
                    <td className="small text-muted">{new Date(swap.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" title="View Details">
                          <i className="bi bi-eye"></i>
                        </button>
                        {swap.status !== "Rejected" && swap.status !== "Completed" && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => cancelSwap(swap._id)} title="Cancel Swap">
                            <i className="bi bi-x-circle"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSwaps;
