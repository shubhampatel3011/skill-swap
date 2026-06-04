import { useState } from "react";
import { MOCK_USERS } from "../../data/mockData";
import AdminSidebar from "../../components/AdminSidebar";
import StarRating from "../../components/StarRating";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS.filter((u) => u.role !== "admin"));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "blocked" && u.isBlocked) || (filter === "active" && !u.isBlocked);
    return matchSearch && matchFilter;
  });

  const toggleBlock = (id) => {
    setUsers((prev) => prev.map((u) => {
      if (u._id === id) {
        toast[u.isBlocked ? "success" : "warning"](`User ${u.isBlocked ? "unblocked" : "blocked"} successfully`);
        return { ...u, isBlocked: !u.isBlocked };
      }
      return u;
    }));
  };

  const deleteUser = (id) => {
    if (window.confirm("Delete this user permanently?")) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted.");
    }
  };

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="mb-4">
          <h3 className="fw-bold mb-0">Manage Users</h3>
          <p className="text-muted">{filtered.length} users found</p>
        </div>

        {/* Controls */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control" placeholder="Search users..." id="adminUserSearch"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="d-flex gap-2">
            {["all", "active", "blocked"].map((f) => (
              <button key={f} className={`btn btn-sm ${filter === f ? "ss-btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="ss-admin-table-head">
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={u.profileImage} alt={u.name} className="rounded-circle" width={36} height={36} />
                        <div>
                          <div className="fw-semibold small">{u.name}</div>
                          <small className="text-muted">{u._id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small">{u.email}</div>
                      <div className="small text-muted">{u.phone}</div>
                    </td>
                    <td className="small text-muted">{u.location}</td>
                    <td>
                      <StarRating value={u.rating} size="xs" />
                      <div className="small text-muted">{u.rating} ({u.reviewCount})</div>
                    </td>
                    <td>
                      <span className={`badge ${u.isBlocked ? "bg-danger" : "bg-success"} bg-opacity-15 ${u.isBlocked ? "text-danger" : "text-success"} border ${u.isBlocked ? "border-danger" : "border-success"}`}>
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className={`btn btn-sm ${u.isBlocked ? "btn-outline-success" : "btn-outline-warning"}`}
                          onClick={() => toggleBlock(u._id)}
                          title={u.isBlocked ? "Unblock" : "Block"}
                        >
                          <i className={`bi ${u.isBlocked ? "bi-unlock" : "bi-slash-circle"}`}></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(u._id)} title="Delete">
                          <i className="bi bi-trash"></i>
                        </button>
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

export default AdminUsers;
