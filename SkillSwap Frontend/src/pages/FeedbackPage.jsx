import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MOCK_FEEDBACK } from "../data/mockData";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";
import axios from "axios";

const API = "http://localhost:3000";

const normalizeReview = (r) => ({
  _id: r.reviewId ?? r.ReviewId ?? r._id,
  reviewerId: r.ReviewerId ?? r.reviewerId,
  reviewedUserId: r.ReviewedUserId ?? r.reviewedUserId,
  swapId: r.SwapId ?? r.swapId,
  rating: r.Rating ?? r.rating ?? 0,
  comment: r.Comment ?? r.comment ?? "",
  createdAt: r.CreatedAt ?? r.createdAt ?? new Date().toISOString(),
});

const normalizeUser = (u) => ({
  _id: u.userId ?? u.UserId ?? u._id ?? u.id,
  name: u.Name ?? u.name ?? "Unknown",
  profileImage:
    u.ProfileImage ??
    u.profileImage ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.Name ?? u.name ?? "U")}&background=0d9488&color=fff&size=128`,
});

const FeedbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [reviewRating, setReviewRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedSwap, setSelectedSwap] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [tab, setTab] = useState("received");

  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setReviewsLoading(false);
      return;
    }

    const uid = String(user.userId ?? user._id);

    const fetchAll = async () => {
      setReviewsLoading(true);
      try {
        const [receivedRes, givenRes, swapsRes, usersRes] = await Promise.all([
          axios.get(`${API}/feedback/${uid}`),
          axios.get(`${API}/feedback/reviewer/${uid}`),
          axios.get(`${API}/swap`),
          axios.get(`${API}/users`),
        ]);

        const received = (receivedRes.data?.List ?? []).map(normalizeReview);
        const given = (givenRes.data?.List ?? []).map(normalizeReview);
        setReceivedReviews(received);
        setGivenReviews(given);

        const map = {};
        (usersRes.data?.List ?? []).forEach((u) => {
          const normalized = normalizeUser(u);
          map[String(normalized._id)] = normalized;
        });
        setUsersMap(map);

        const completed = (swapsRes.data?.List ?? []).filter((s) => {
          const senderId = String(s.SenderId ?? s.senderId ?? "");
          const receiverId = String(s.ReceiverId ?? s.receiverId ?? "");
          const status = String(s.Status ?? s.status ?? "").toLowerCase();
          return status === "completed" && (senderId === uid || receiverId === uid);
        });
        setCompletedSwaps(completed);
      } catch (err) {
        console.error("FeedbackPage review fetch error:", err);
        toast.error("Failed to load reviews. Please try again.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  useEffect(() => {
    if (user && !isAnonymous) {
      setName(user.name || "");
      setEmail(user.email || "");
    } else if (isAnonymous) {
      setName("");
      setEmail("");
    }
  }, [user, isAnonymous]);

  const avgRating = receivedReviews.length
    ? (receivedReviews.reduce((sum, review) => sum + review.rating, 0) / receivedReviews.length).toFixed(1)
    : "—";

  const getUserInfo = (id) =>
    usersMap[String(id)] ?? {
      name: "Unknown User",
      profileImage: `https://ui-avatars.com/api/?name=U&background=0d9488&color=fff&size=128`,
    };

  const swapLabel = (swap) => {
    const uid = String(user.userId ?? user._id);
    const senderId = String(swap.SenderId ?? swap.senderId ?? "");
    const partnerId = senderId === uid ? String(swap.ReceiverId ?? swap.receiverId ?? "") : senderId;
    const partnerName = getUserInfo(partnerId).name;
    const swapId = swap.SwapId ?? swap.swapId ?? swap._id;
    const offeredSkill = swap.OfferedSkill ?? swap.offeredSkill ?? "";
    return `${partnerName} — ${offeredSkill} (ID: ${swapId})`;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) {
      toast.error("Please select a rating");
      return;
    }
    if (!selectedSwap) {
      toast.error("Please select a completed swap");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    const uid = String(user.userId ?? user._id);
    const swap = completedSwaps.find((s) => String(s.SwapId ?? s.swapId ?? s._id) === selectedSwap);
    if (!swap) {
      toast.error("Invalid swap selected");
      return;
    }

    const senderId = String(swap.SenderId ?? swap.senderId ?? "");
    const receiverId = String(swap.ReceiverId ?? swap.receiverId ?? "");
    const reviewedUserId = senderId === uid ? receiverId : senderId;

    const alreadyReviewed = givenReviews.some((review) => String(review.swapId) === selectedSwap);
    if (alreadyReviewed) {
      toast.warning("You have already reviewed this swap.");
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(`${API}/feedback`, {
        reviewerId: uid,
        reviewedUserId,
        swapId: selectedSwap,
        rating: reviewRating,
        comment: comment.trim(),
      });

      toast.success("Review submitted successfully!");

      const newReview = normalizeReview({
        reviewId: `temp_${Date.now()}`,
        ReviewerId: uid,
        ReviewedUserId: reviewedUserId,
        SwapId: selectedSwap,
        Rating: reviewRating,
        Comment: comment.trim(),
        CreatedAt: new Date().toISOString(),
      });
      setGivenReviews((prev) => [newReview, ...prev]);

      setReviewRating(0);
      setComment("");
      setSelectedSwap("");
    } catch (err) {
      console.error("Submit review error:", err);
      toast.error(err.response?.data?.error ?? "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const categories = ["Bug Report", "Feature Suggestion", "UI/UX Experience", "General Appreciation", "Other"];

  const ratingTexts = {
    1: "Very Dissatisfied (Poor)",
    2: "Dissatisfied (Fair)",
    3: "Neutral (Good)",
    4: "Satisfied (Very Good)",
    5: "Extremely Satisfied (Excellent!)",
  };

  const validateFeedback = () => {
    const nextErrors = {};
    if (feedbackRating === 0) nextErrors.rating = "Please select a rating of 1 to 5 stars.";
    if (!category) nextErrors.category = "Please select a feedback category.";

    if (!isAnonymous) {
      if (!name.trim()) nextErrors.name = "Name is required (or submit anonymously)";
      if (!email.trim()) nextErrors.email = "Email is required (or submit anonymously)";
      else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = "Please enter a valid email address";
    }

    if (!feedbackComment.trim()) nextErrors.comment = "Please write a comment.";
    else if (feedbackComment.trim().length < 15) nextErrors.comment = "Feedback details must be at least 15 characters long.";

    return nextErrors;
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    const validationErrors = validateFeedback();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    setTimeout(() => {
      try {
        const saved = localStorage.getItem("website_feedback");
        const feedList = saved ? JSON.parse(saved) : MOCK_FEEDBACK;

        const newFeedback = {
          _id: "feed_" + Date.now(),
          userName: isAnonymous ? "Anonymous" : name.trim(),
          userEmail: isAnonymous ? "" : email.trim(),
          rating: feedbackRating,
          category,
          comment: feedbackComment.trim(),
          status: "New",
          adminNotes: "",
          createdAt: new Date().toISOString(),
        };

        const updated = [newFeedback, ...feedList];
        localStorage.setItem("website_feedback", JSON.stringify(updated));

        toast.success("Thank you! Your feedback has been submitted successfully.");

        setFeedbackRating(0);
        setCategory("");
        setFeedbackComment("");
        setIsAnonymous(false);
        setErrors({});

        if (!user) {
          setName("");
          setEmail("");
        }
      } catch (err) {
        toast.error("An error occurred while saving feedback.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const displayList = tab === "received" ? receivedReviews : givenReviews;

  return (
    <div className="container py-5">
      <div className="mb-4 text-center">
        <h2 className="fw-bold mb-1">Reviews &amp; Feedback</h2>
        <p className="text-muted mb-0">Track your swap reviews and submit website feedback from the same place.</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-center mb-4">
            <div className="ss-rating-big fw-bold">{avgRating}</div>
            <StarRating value={parseFloat(avgRating) || 0} />
            <p className="text-muted small mt-2 mb-0">
              {receivedReviews.length} review{receivedReviews.length !== 1 ? "s" : ""} received
            </p>
            <div className="mt-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = receivedReviews.filter((review) => review.rating === star).length;
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

          {user ? (
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-pencil me-2 text-primary"></i>Leave a Review
              </h6>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Select Completed Swap</label>
                  <select className="form-select form-select-sm" value={selectedSwap} onChange={(e) => setSelectedSwap(e.target.value)}>
                    <option value="">Choose from completed swaps…</option>
                    {completedSwaps.map((swap) => {
                      const sid = String(swap.SwapId ?? swap.swapId ?? swap._id);
                      return (
                        <option key={sid} value={sid}>
                          {swapLabel(swap)}
                        </option>
                      );
                    })}
                  </select>
                  {completedSwaps.length === 0 && <small className="text-muted">No completed swaps available yet.</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Your Rating</label>
                  <div>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                    {reviewRating > 0 && (
                      <small className="text-muted ms-2">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][reviewRating]}</small>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Comment</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={3}
                    placeholder="Share your experience…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn ss-btn-primary w-100 btn-sm" disabled={submittingReview}>
                  {submittingReview ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Submitting…</>
                  ) : (
                    <><i className="bi bi-send me-1"></i>Submit Review</>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-bold mb-2">Leave a Review</h6>
              <p className="text-muted small mb-0">Log in to review completed swaps.</p>
            </div>
          )}
        </div>

        <div className="col-lg-8">
          <ul className="nav nav-pills mb-4 gap-1">
            {["received", "given"].map((type) => (
              <li key={type} className="nav-item">
                <button
                  className={`nav-link ${tab === type ? "ss-btn-primary" : "btn-outline-secondary"} btn btn-sm`}
                  onClick={() => setTab(type)}
                >
                  {type === "received" ? `Received (${receivedReviews.length})` : `Given (${givenReviews.length})`}
                </button>
              </li>
            ))}
          </ul>

          {reviewsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-3">Loading reviews…</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-star display-4 text-muted d-block mb-3"></i>
              <p className="text-muted">No {tab} reviews yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {displayList.map((review) => {
                const personId = tab === "received" ? review.reviewerId : review.reviewedUserId;
                const personInfo = getUserInfo(personId);

                return (
                  <div key={review._id} className="card border-0 shadow-sm p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="ss-nav-avatar rounded-circle bg-dark bg-opacity-75 d-flex align-items-center justify-content-center text-light fw-bold shadow flex-shrink-0"
                        style={{ width: 44, height: 44, fontSize: "1.1rem" }}
                      >
                        {personInfo.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                          <h6 className="fw-bold mb-0">{personInfo.name}</h6>
                          <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                        </div>
                        <div className="my-1">
                          <StarRating value={review.rating} size="sm" />
                        </div>
                        <p className="text-muted small fst-italic mb-0">"{review.comment}"</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="mb-4 text-center">
            <h2 className="fw-bold mb-1">Website Feedback</h2>
            <p className="text-muted">Help us improve. Share your thoughts, bugs, and suggestions with us!</p>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4">
            <form onSubmit={handleSubmitFeedback} noValidate>
              <div className="mb-4 text-center">
                <label className="form-label d-block fw-bold mb-2">
                  How would you rate your experience? <span className="text-danger">*</span>
                </label>
                <div className="d-flex justify-content-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn p-0 border-0 bg-transparent"
                      style={{ outline: "none" }}
                      onClick={() => setFeedbackRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <i
                        className={`bi ${star <= (hoverRating || feedbackRating) ? "bi-star-fill text-warning" : "bi-star text-muted"} display-6`}
                        style={{
                          transition: "color 0.15s, transform 0.1s",
                          transform: star === (hoverRating || feedbackRating) ? "scale(1.15)" : "none",
                          cursor: "pointer",
                        }}
                      ></i>
                    </button>
                  ))}
                </div>
                {errors.rating ? (
                  <div className="text-danger small">{errors.rating}</div>
                ) : (
                  <div className="text-muted small" style={{ height: "20px" }}>
                    {(hoverRating || feedbackRating) ? ratingTexts[hoverRating || feedbackRating] : "Select 1 to 5 stars"}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Feedback Category <span className="text-danger">*</span></label>
                <select
                  className={`form-select ${errors.category ? "is-invalid" : ""}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="anonymousSwitch"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <label className="form-check-label fw-semibold" htmlFor="anonymousSwitch">
                  Submit Feedback Anonymously
                </label>
              </div>

              {!isAnonymous && (
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!!user}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!!user}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Your Feedback Details <span className="text-danger">*</span></label>
                <textarea
                  className={`form-control ${errors.comment ? "is-invalid" : ""}`}
                  rows={5}
                  placeholder="Describe your issue, suggestion, or experience in detail (minimum 15 characters)..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
                <div className="d-flex justify-content-between mt-1">
                  {errors.comment ? <div className="invalid-feedback d-block">{errors.comment}</div> : <div />}
                  <small className="text-muted">{feedbackComment.length} characters</small>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn ss-btn-primary px-5 py-2.5 flex-fill"
                  disabled={loading}
                  id="submitFeedbackBtn"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting Feedback…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Submit Feedback
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2.5"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
