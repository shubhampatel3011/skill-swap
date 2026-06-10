import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import StarRating from "../../components/StarRating";
import { toast } from "react-toastify";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "blocked" && u.isBlocked) || (filter === "active" && !u.isBlocked);
    return matchSearch && matchFilter;
  });

const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/users");

    const usersData = response.data.List.filter((u) => u.role !== "admin");

    setUsers(usersData);
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch users");
  }
};

  const toggleBlock = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/users/block/${id}`, {
        isBlocked: !currentStatus,
      });

      toast.success(
        currentStatus
          ? "User unblocked successfully"
          : "User blocked successfully",
      );

      getUsers();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user permanently?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        setUsers((prev) => prev.filter((u) => u.userId !== id));
        toast.success("User deleted.");
         getUsers();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete user");
      }
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#4f46e5",
      "#0891b2",
      "#059669",
      "#d97706",
      "#dc2626",
      "#7c3aed",
      "#db2777",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
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
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              id="adminUserSearch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            {["all", "active", "blocked"].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? "ss-btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter(f)}
              >
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
                  <th>ID</th>
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
                  <tr key={u.userId}>
                    <td className="small text-muted">{u.userId}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 30, height: 30, minWidth: 30, backgroundColor: getAvatarColor(u.name), fontSize: 15, textTransform: "uppercase" }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold small">{u.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small">{u.email}</div>
                      <div className="small text-muted">{u.phone}</div>
                    </td>
                    <td className="small text-muted">{u.address}</td>
                    <td>
                      <StarRating value={u.rating} size="xs" />
                      <div className="small text-muted">
                        {u.rating}({u.reviewCount})
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${u.isBlocked ? "bg-danger" : "bg-success"} bg-opacity-15 ${u.isBlocked ? "text" : "text"} border ${u.isBlocked ? "border-danger" : "border-success"}`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className={`btn btn-sm ${u.isBlocked ? "btn-outline-success" : "btn-outline-warning"}`}
                          onClick={() => toggleBlock(u.userId, u.isBlocked)}
                          title={u.isBlocked ? "Unblock" : "Block"}
                        >
                          <i
                            className={`bi ${u.isBlocked ? "bi-unlock" : "bi-slash-circle"}`}
                          ></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteUser(u.userId)}
                          title="Delete"
                        >
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
