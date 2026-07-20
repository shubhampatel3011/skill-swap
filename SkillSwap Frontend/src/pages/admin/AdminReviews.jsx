import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import StarRating from "../../components/StarRating";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ss_token");
      const response = await axios.get(`${BASE_URL}/review`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data?.List ?? []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("ss_token");
        await axios.delete(`${BASE_URL}/review/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews((prev) => prev.filter((r) => (r.reviewId ?? r._id) !== id));
        toast.success("Review deleted successfully.");
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error("Failed to delete review");
      }
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const reviewerName = (r.ReviewerName || "").toLowerCase();
    const reviewedUserName = (r.ReviewedUserName || "").toLowerCase();
    const comment = (r.Comment || r.comment || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      reviewerName.includes(query) ||
      reviewedUserName.includes(query) ||
      comment.includes(query);

    const matchesRating = !ratingFilter || String(r.Rating ?? r.rating) === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.Rating ?? r.rating ?? 0), 0) / totalReviews).toFixed(1)
    : "0.0";
  const positiveReviews = reviews.filter((r) => (r.Rating ?? r.rating ?? 0) >= 4).length;
  const positivePercentage = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;
  const flaggedReviews = reviews.filter((r) => (r.Rating ?? r.rating ?? 0) <= 2).length;

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="mb-4">
          <h3 className="fw-bold mb-0">Manage Reviews</h3>
          <p className="text-muted">Monitor and moderate reviews shared after swap completion</p>
        </div>

        {/* Statistics Widgets */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100 bg-light">
              <div className="text-muted small fw-semibold">Total Reviews</div>
              <div className="fs-2 fw-bold text-dark mt-2">{totalReviews}</div>
              <div className="text-primary small mt-1">Submitted by users</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100 bg-light">
              <div className="text-muted small fw-semibold">Average Rating</div>
              <div className="fs-2 fw-bold text-warning mt-2">
                {avgRating} <i className="bi bi-star-fill text-warning fs-4"></i>
              </div>
              <div className="text-muted small mt-1">Across all completed swaps</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100 bg-light">
              <div className="text-muted small fw-semibold">Positive Reviews</div>
              <div className="fs-2 fw-bold text-success mt-2">{positivePercentage}%</div>
              <div className="text-success small mt-1">{positiveReviews} ratings (4+ ★)</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100 bg-light">
              <div className="text-muted small fw-semibold">Low Ratings (Flagged)</div>
              <div className="fs-2 fw-bold text-danger mt-2">{flaggedReviews}</div>
              <div className="text-danger small mt-1">Requires admin attention</div>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search user or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select border-0 shadow-sm"
            style={{ maxWidth: 180 }}
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
        </div>

        {/* Reviews Grid/Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-3">Loading reviews list...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <i className="bi bi-chat-square-text text-muted fs-1 d-block mb-3"></i>
            <h5 className="fw-bold">No reviews found</h5>
            <p className="text-muted mb-0">Try clearing filters or search terms</p>
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Reviewer</th>
                    <th>Reviewed User</th>
                    <th>Skill Swap Context</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => {
                    const id = review.reviewId ?? review._id;
                    const rRating = review.Rating ?? review.rating ?? 0;
                    return (
                      <tr key={id}>
                        <td className="px-4">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: 32, height: 32, fontSize: "0.85rem" }}
                            >
                              {(review.ReviewerName || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{review.ReviewerName || "Unknown"}</div>
                              <small className="text-muted">ID: {review.ReviewerId}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: 32, height: 32, fontSize: "0.85rem" }}
                            >
                              {(review.ReviewedUserName || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{review.ReviewedUserName || "Unknown"}</div>
                              <small className="text-muted">ID: {review.ReviewedUserId}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          {review.OfferedSkill && review.RequestedSkill ? (
                            <div>
                              <span className="badge bg-success bg-opacity-10 text-success me-1">
                                {review.OfferedSkill}
                              </span>
                              <i className="bi bi-arrow-left-right text-muted small px-1"></i>
                              <span className="badge bg-primary bg-opacity-10 text-primary">
                                {review.RequestedSkill}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted small">Swap ID: {review.SwapId}</span>
                          )}
                        </td>
                        <td>
                          <StarRating value={rRating} size="xs" />
                        </td>
                        <td>
                          <span
                            className="d-inline-block text-truncate text-muted small"
                            style={{ maxWidth: 300 }}
                            title={review.Comment || review.comment}
                          >
                            {review.Comment || review.comment || "No comment provided."}
                          </span>
                        </td>
                        <td className="text-end px-4">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteReview(id)}
                            title="Delete review entry"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
