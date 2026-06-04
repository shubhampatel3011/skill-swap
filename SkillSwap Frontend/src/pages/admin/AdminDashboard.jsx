import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { ADMIN_STATS } from "../../data/mockData";

const AdminDashboard = () => {
  const s = ADMIN_STATS;

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="mb-4">
          <h3 className="fw-bold mb-0">Admin Dashboard</h3>
          <p className="text-muted">Platform overview & analytics</p>
        </div>

        {/* Top Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total Users", val: s.totalUsers, icon: "bi-people-fill", color: "primary" },
            { label: "Active Swaps", val: s.activeSwaps, icon: "bi-arrow-left-right", color: "success" },
            { label: "Completed Swaps", val: s.completedSwaps, icon: "bi-trophy-fill", color: "info" },
            { label: "Total Skills", val: s.totalSkills, icon: "bi-grid-3x3-gap-fill", color: "warning" },
            { label: "New Signups (7d)", val: s.recentSignups, icon: "bi-person-plus-fill", color: "secondary" },
            { label: "Pending Reports", val: s.pendingReports, icon: "bi-flag-fill", color: "danger" },
          ].map((stat) => (
            <div key={stat.label} className="col-6 col-md-4 col-xl-2">
              <div className={`card border-0 shadow-sm p-3 border-top border-3 border-${stat.color}`}>
                <div className={`d-flex align-items-center gap-2 text-${stat.color} mb-1`}>
                  <i className={`bi ${stat.icon}`}></i>
                  <small className="fw-semibold">{stat.label}</small>
                </div>
                <div className="display-6 fw-bold">{stat.val.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Top Skills */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent fw-bold border-0 pt-3">
                <i className="bi bi-bar-chart-fill me-2 text-primary"></i>Most Popular Skills
              </div>
              <div className="card-body">
                {s.topSkills.map((skill, i) => {
                  const pct = Math.round((skill.count / s.topSkills[0].count) * 100);
                  return (
                    <div key={skill.name} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-semibold">{skill.name}</span>
                        <span className="small text-muted">{skill.count} listings</span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className={`progress-bar ${["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-danger"][i]}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent fw-bold border-0 pt-3">
                <i className="bi bi-lightning me-2 text-warning"></i>Quick Actions
              </div>
              <div className="card-body d-flex flex-column gap-2">
                <Link to="/admin/users" className="btn btn-outline-primary w-100 text-start">
                  <i className="bi bi-people me-2"></i>Manage Users
                </Link>
                <Link to="/admin/skills" className="btn btn-outline-success w-100 text-start">
                  <i className="bi bi-grid me-2"></i>Review Skills
                </Link>
                <Link to="/admin/swaps" className="btn btn-outline-info w-100 text-start">
                  <i className="bi bi-arrow-left-right me-2"></i>Monitor Swaps
                </Link>
                <button className="btn btn-outline-danger w-100 text-start">
                  <i className="bi bi-flag me-2"></i>View Reports ({s.pendingReports})
                </button>
              </div>
            </div>
          </div>

          {/* Platform Health */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent fw-bold border-0 pt-3">
                <i className="bi bi-heart-pulse me-2 text-danger"></i>Platform Health
              </div>
              <div className="card-body">
                {[
                  { label: "Swap Success Rate", val: Math.round((s.completedSwaps / (s.completedSwaps + s.activeSwaps)) * 100), color: "success" },
                  { label: "User Retention", val: 78, color: "primary" },
                  { label: "Avg. Response Time", val: 85, color: "info" },
                  { label: "Content Quality", val: 92, color: "warning" },
                ].map((m) => (
                  <div key={m.label} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-semibold">{m.label}</small>
                      <small className={`text-${m.color} fw-bold`}>{m.val}%</small>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className={`progress-bar bg-${m.color}`} style={{ width: `${m.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
