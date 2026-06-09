import { useState, useEffect } from "react";
import { MOCK_FEEDBACK } from "../../data/mockData";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem("website_feedback");
    return saved ? JSON.parse(saved) : MOCK_FEEDBACK;
  });

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminNotesText, setAdminNotesText] = useState("");

  useEffect(() => {
    localStorage.setItem("website_feedback", JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Statistics calculation
  const totalCount = feedbacks.length;
  
  const avgRating = totalCount > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalCount).toFixed(1) 
    : "0.0";

  const bugCount = feedbacks.filter((f) => f.category === "Bug Report").length;
  const resolvedCount = feedbacks.filter((f) => f.status === "Resolved").length;

  const bugPercentage = totalCount > 0 ? Math.round((bugCount / totalCount) * 100) : 0;
  const resolvedPercentage = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Filters
  const filtered = feedbacks.filter((f) => {
    const matchesSearch =
      f.userName.toLowerCase().includes(search.toLowerCase()) ||
      f.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      f.comment.toLowerCase().includes(search.toLowerCase());

    const matchesRating = !ratingFilter || f.rating === parseInt(ratingFilter, 10);
    const matchesCategory = !categoryFilter || f.category === categoryFilter;
    const matchesStatus = !statusFilter || f.status === statusFilter;

    return matchesSearch && matchesRating && matchesCategory && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setFeedbacks((prev) =>
      prev.map((f) => {
        if (f._id === id) {
          toast.success(`Feedback status updated to ${newStatus}`);
          return { ...f, status: newStatus };
        }
        return f;
      })
    );
  };

  const handleOpenNotes = (feedback) => {
    setSelectedFeedback(feedback);
    setAdminNotesText(feedback.adminNotes || "");
    setShowNotesModal(true);
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (!selectedFeedback) return;

    setFeedbacks((prev) =>
      prev.map((f) => {
        if (f._id === selectedFeedback._id) {
          toast.success("Admin notes updated successfully.");
          return { ...f, adminNotes: adminNotesText.trim() };
        }
        return f;
      })
    );
    setShowNotesModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this feedback entry?")) {
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      toast.success("Feedback entry deleted.");
    }
  };

  // Helper for category badge classes
  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case "Bug Report": return "bg-danger text-danger border-danger border-opacity-35";
      case "Feature Suggestion": return "bg-warning text-warning border-warning border-opacity-35";
      case "UI/UX Experience": return "bg-primary text-primary border-primary border-opacity-35";
      case "General Appreciation": return "bg-success text-success border-success border-opacity-35";
      default: return "bg-secondary text-secondary border-secondary border-opacity-35";
    }
  };

  // Helper for status badge classes
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "New": return "border-info text-info bg-info";
      case "In Review": return "border-warning text-warning bg-warning";
      case "Resolved": return "border-success text-success bg-success";
      case "Archived": return "border-secondary text-secondary bg-secondary";
      default: return "border-light text-muted bg-light";
    }
  };

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        {/* Header */}
        <div className="mb-4">
          <h3 className="fw-bold mb-0">Website Feedback Moderation</h3>
          <p className="text-muted">Review, catalog, and track feedback submitted by community users</p>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 mb-4">
          {/* Total feedbacks */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-primary h-100">
              <div className="d-flex align-items-center gap-2 text-primary mb-1">
                <i className="bi bi-chat-left-text-fill"></i>
                <small className="fw-semibold">Total Feedbacks</small>
              </div>
              <div className="display-6 fw-bold">{totalCount}</div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-warning h-100">
              <div className="d-flex align-items-center gap-2 text-warning mb-1">
                <i className="bi bi-star-fill"></i>
                <small className="fw-semibold">Average Rating</small>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span className="display-6 fw-bold">{avgRating}</span>
                <span className="text-muted small">/ 5.0</span>
              </div>
              <div className="d-flex gap-1 text-warning mt-1" style={{ fontSize: "12px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className={`bi ${s <= Math.round(parseFloat(avgRating)) ? "bi-star-fill" : "bi-star"}`}></i>
                ))}
              </div>
            </div>
          </div>

          {/* Bug Report breakdown */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-danger h-100">
              <div className="d-flex justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2 text-danger">
                  <i className="bi bi-bug-fill"></i>
                  <small className="fw-semibold">Bug Reports</small>
                </div>
                <small className="text-danger fw-bold">{bugCount}</small>
              </div>
              <div className="display-6 fw-bold mb-1">{bugPercentage}%</div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar bg-danger" style={{ width: `${bugPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Resolved Count */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-success h-100">
              <div className="d-flex justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2 text-success">
                  <i className="bi bi-check-circle-fill"></i>
                  <small className="fw-semibold">Resolved Feedbacks</small>
                </div>
                <small className="text-success fw-bold">{resolvedCount}</small>
              </div>
              <div className="display-6 fw-bold mb-1">{resolvedPercentage}%</div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar bg-success" style={{ width: `${resolvedPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select text-muted"
            style={{ maxWidth: 160 }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Bug Report">Bug Reports</option>
            <option value="Feature Suggestion">Suggestions</option>
            <option value="UI/UX Experience">UI/UX Experience</option>
            <option value="General Appreciation">Appreciations</option>
            <option value="Other">Others</option>
          </select>

          <select
            className="form-select text-muted"
            style={{ maxWidth: 140 }}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            className="form-select text-muted"
            style={{ maxWidth: 140 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Table View */}
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="ss-admin-table-head">
                <tr>
                  <th>Submitter</th>
                  <th>Rating</th>
                  <th>Category</th>
                  <th>Feedback Comment</th>
                  <th>Status</th>
                  <th>Admin Notes</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((feed) => (
                  <tr key={feed._id}>
                    <td>
                      <div>
                        <div className="fw-bold small">{feed.userName}</div>
                        <small className="text-muted">{feed.userEmail || "Anonymous Submission"}</small>
                      </div>
                    </td>
                    <td>
                      <div className="text-warning d-flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`bi ${star <= feed.rating ? "bi-star-fill" : "bi-star"} small`}
                            style={{ fontSize: "12px" }}
                          ></i>
                        ))}
                      </div>
                      <small className="text-muted small">{feed.rating} / 5</small>
                    </td>
                    <td>
                      <span className={`badge bg-opacity-15 border text-white text-uppercase px-2 py-1 fw-bold ${getCategoryBadgeClass(feed.category)}`} style={{ fontSize: "10px", letterSpacing: "0.03em" }}>
                        {feed.category}
                      </span>
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      <p className="text-muted small mb-0 text-truncate" title={feed.comment}>
                        {feed.comment}
                      </p>
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm border bg-opacity-10 py-1 px-2 fw-semibold ${getStatusBadgeClass(feed.status)}`}
                        style={{ fontSize: "11px", minWidth: "105px" }}
                        value={feed.status}
                        onChange={(e) => handleStatusChange(feed._id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      {feed.adminNotes ? (
                        <p className="text-secondary small mb-0 text-truncate" title={feed.adminNotes}>
                          {feed.adminNotes}
                        </p>
                      ) : (
                        <span className="text-muted small italic">None</span>
                      )}
                    </td>
                    <td className="small text-muted">
                      {new Date(feed.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenNotes(feed)}
                          title="Notes / Resolve"
                        >
                          <i className="bi bi-chat-dots"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(feed._id)}
                          title="Delete Feedback"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <i className="bi bi-chat-left display-4 d-block mb-3"></i>
                      No feedbacks found matching current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admin Notes Modal Dialog */}
      {showNotesModal && selectedFeedback && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Feedback Details & Notes</h5>
                <button type="button" className="btn-close" onClick={() => setShowNotesModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSaveNotes}>
                <div className="modal-body py-4">
                  
                  {/* Feedback summary */}
                  <div className="mb-3 p-3 bg-light rounded-3 small">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark">{selectedFeedback.userName}</span>
                      <span className="text-muted" style={{ fontSize: "10px" }}>{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1.5 text-warning mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className={`bi ${s <= selectedFeedback.rating ? "bi-star-fill" : "bi-star"}`}></i>
                      ))}
                      <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-20 ms-2" style={{ fontSize: "9px" }}>{selectedFeedback.category}</span>
                    </div>
                    <div className="text-muted italic border-start ps-2 py-1" style={{ maxHeight: "120px", overflowY: "auto" }}>
                      "{selectedFeedback.comment}"
                    </div>
                  </div>

                  {/* Notes Textarea */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Admin Moderation Notes</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Add investigation details, support actions taken, or replies to issue..."
                      value={adminNotesText}
                      onChange={(e) => setAdminNotesText(e.target.value)}
                    />
                    <small className="text-muted small d-block mt-1">
                      Notes are private to administrators and help track resolutions.
                    </small>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowNotesModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn ss-btn-primary px-4">
                    Save Notes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
