import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_REVIEWS, MOCK_SWAPS, MOCK_USERS } from "../data/mockData";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [tab, setTab] = useState("received");

  const receivedReviews = reviews.filter((r) => r.reviewedUserId === user?._id);
  const givenReviews = reviews.filter((r) => r.reviewerId === user?._id);
  const avgRating = receivedReviews.length
    ? (receivedReviews.reduce((s, r) => s + r.rating, 0) / receivedReviews.length).toFixed(1)
    : "—";

  const completedSwaps = MOCK_SWAPS.filter(
    (s) => s.status === "Completed" && (s.senderId === user?._id || s.receiverId === user?._id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating"); return; }
    if (!selectedUser) { toast.error("Please select a user to review"); return; }
    if (comment.length < 10) { toast.error("Comment must be at least 10 characters"); return; }
    const target = MOCK_USERS.find((u) => u._id === selectedUser);
    setReviews((prev) => [
      ...prev,
      {
        _id: `r_${Date.now()}`,
        reviewerId: user._id,
        reviewerName: user.name,
        reviewerImage: user.profileImage,
        reviewedUserId: selectedUser,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      },
    ]);
    toast.success(`Review submitted for ${target?.name}!`);
    setRating(0); setComment(""); setSelectedUser("");
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1">Reviews & Ratings</h2>
      <p className="text-muted mb-4">Build your reputation through honest feedback.</p>

      <div className="row g-4">
        {/* Left: My Rating Summary + Leave Review */}
        <div className="col-lg-4">
          {/* Summary */}
          <div className="card border-0 shadow-sm p-4 text-center mb-4">
            <div className="ss-rating-big fw-bold">{avgRating}</div>
            <StarRating value={parseFloat(avgRating) || 0} />
            <p className="text-muted small mt-2 mb-0">{receivedReviews.length} review{receivedReviews.length !== 1 ? "s" : ""} received</p>
            <div className="mt-3">
              {[5,4,3,2,1].map((star) => {
                const count = receivedReviews.filter((r) => r.rating === star).length;
                const pct = receivedReviews.length ? Math.round((count / receivedReviews.length) * 100) : 0;
                return (
                  <div key={star} className="d-flex align-items-center gap-2 mb-1">
                    <small className="text-muted" style={{ width: 20 }}>{star}</small>
                    <i className="bi bi-star-fill text-warning small"></i>
                    <div className="progress flex-grow-1" style={{ height: 6 }}>
                      <div className="progress-bar bg-warning" style={{ width: `${pct}%` }}></div>
                    </div>
                    <small className="text-muted" style={{ width: 30 }}>{count}</small>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave Review Form */}
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-3"><i className="bi bi-pencil me-2 text-primary"></i>Leave a Review</h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Select User</label>
                <select className="form-select form-select-sm" id="reviewUser" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                  <option value="">Choose from completed swaps...</option>
                  {completedSwaps.map((s) => {
                    const isSender = s.senderId === user?._id;
                    const partnerName = isSender ? s.receiverName : s.senderName;
                    const partnerId = isSender ? s.receiverId : s.senderId;
                    return <option key={s._id} value={partnerId}>{partnerName}</option>;
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Your Rating</label>
                <div>
                  <StarRating value={rating} onChange={setRating} />
                  {rating > 0 && <small className="text-muted ms-2">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}</small>}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Comment</label>
                <textarea className="form-control form-control-sm" id="reviewComment" rows={3}
                  placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <button type="submit" className="btn ss-btn-primary w-100 btn-sm" id="submitReviewBtn">
                <i className="bi bi-send me-1"></i>Submit Review
              </button>
            </form>
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="col-lg-8">
          <ul className="nav nav-pills mb-4 gap-1">
            {["received", "given"].map((t) => (
              <li key={t} className="nav-item">
                <button className={`nav-link ${tab === t ? "ss-btn-primary" : "btn-outline-secondary"} btn btn-sm`}
                  onClick={() => setTab(t)} id={`reviewTab_${t}`}>
                  {t === "received" ? `Received (${receivedReviews.length})` : `Given (${givenReviews.length})`}
                </button>
              </li>
            ))}
          </ul>

          {(tab === "received" ? receivedReviews : givenReviews).length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-star display-4 text-muted d-block mb-3"></i>
              <p className="text-muted">No reviews yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {(tab === "received" ? receivedReviews : givenReviews).map((r) => (
                <div key={r._id} className="card border-0 shadow-sm p-4">
                  <div className="d-flex align-items-start gap-3">
                    <img src={tab === "received" ? r.reviewerImage : MOCK_USERS.find((u) => u._id === r.reviewedUserId)?.profileImage}
                      alt="" className="rounded-circle" width={44} height={44} />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <h6 className="fw-bold mb-0">
                          {tab === "received" ? r.reviewerName : MOCK_USERS.find((u) => u._id === r.reviewedUserId)?.name}
                        </h6>
                        <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="my-1"><StarRating value={r.rating} size="sm" /></div>
                      <p className="text-muted small fst-italic mb-0">"{r.comment}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
