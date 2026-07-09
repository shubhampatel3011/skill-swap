import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";
import axios from "axios";

const BASE = "http://localhost:3000";

/** Normalize a raw review row from the DB */
const normalizeReview = (r) => ({
  _id:            r.reviewId  ?? r.ReviewId  ?? r._id,
  reviewerId:     r.ReviewerId    ?? r.reviewerId,
  reviewedUserId: r.ReviewedUserId ?? r.reviewedUserId,
  swapId:         r.SwapId   ?? r.swapId,
  rating:         r.Rating   ?? r.rating ?? 0,
  comment:        r.Comment  ?? r.comment ?? "",
  createdAt:      r.CreatedAt ?? r.createdAt ?? new Date().toISOString(),
});

/** Normalize a raw user row */
const normalizeUser = (u) => ({
  _id:          u.userId ?? u.UserId ?? u._id ?? u.id,
  name:         u.Name   ?? u.name  ?? "Unknown",
  profileImage: u.ProfileImage ?? u.profileImage ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.Name ?? u.name ?? "U")}&background=0d9488&color=fff&size=128`,
});

const ReviewsPage = () => {
  const { user } = useAuth();

  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews,    setGivenReviews]    = useState([]);
  const [completedSwaps,  setCompletedSwaps]  = useState([]);
  const [usersMap,        setUsersMap]        = useState({});   // id → normalizedUser
  const [loading,         setLoading]         = useState(true);

  // Form state
  const [rating,        setRating]       = useState(0);
  const [comment,       setComment]      = useState("");
  const [selectedSwap,  setSelectedSwap] = useState("");  // swapId
  const [submitting,    setSubmitting]   = useState(false);

  const [tab, setTab] = useState("received");

  /* ── Fetch all data on mount ───────────────────────────────────── */
  useEffect(() => {
    if (!user) return;

    const uid = String(user.userId ?? user._id);

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [receivedRes, givenRes, swapsRes, usersRes] = await Promise.all([
          axios.get(`${BASE}/review/${uid}`),
          axios.get(`${BASE}/review/reviewer/${uid}`),
          axios.get(`${BASE}/swap`),
          axios.get(`${BASE}/users`),
        ]);

        // Reviews
        const received = (receivedRes.data?.List ?? []).map(normalizeReview);
        const given    = (givenRes.data?.List    ?? []).map(normalizeReview);
        setReceivedReviews(received);
        setGivenReviews(given);

        // Users lookup map
        const rawUsers = usersRes.data?.List ?? [];
        const map = {};
        rawUsers.forEach((u) => {
          const nu = normalizeUser(u);
          map[String(nu._id)] = nu;
        });
        setUsersMap(map);

        // Completed swaps involving current user (for the review form dropdown)
        const allSwaps = swapsRes.data?.List ?? [];
        const completed = allSwaps.filter((s) => {
          const senderId   = String(s.SenderId   ?? s.senderId   ?? "");
          const receiverId = String(s.ReceiverId ?? s.receiverId ?? "");
          const status     = String(s.Status     ?? s.status     ?? "").toLowerCase();
          return status === "completed" && (senderId === uid || receiverId === uid);
        });
        setCompletedSwaps(completed);
      } catch (err) {
        console.error("ReviewsPage fetch error:", err);
        toast.error("Failed to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  /* ── Derived stats ─────────────────────────────────────────────── */
  const avgRating = receivedReviews.length
    ? (receivedReviews.reduce((s, r) => s + r.rating, 0) / receivedReviews.length).toFixed(1)
    : "—";

  /* ── Submit new review ─────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating)       { toast.error("Please select a rating");         return; }
    if (!selectedSwap) { toast.error("Please select a completed swap"); return; }
    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    const uid = String(user.userId ?? user._id);
    const swap = completedSwaps.find(
      (s) => String(s.SwapId ?? s.swapId ?? s._id) === selectedSwap
    );
    if (!swap) { toast.error("Invalid swap selected"); return; }

    const senderId   = String(swap.SenderId   ?? swap.senderId   ?? "");
    const receiverId = String(swap.ReceiverId ?? swap.receiverId ?? "");
    const reviewedUserId = senderId === uid ? receiverId : senderId;

    // Prevent duplicate reviews for the same swap
    const alreadyReviewed = givenReviews.some(
      (r) => String(r.swapId) === selectedSwap
    );
    if (alreadyReviewed) {
      toast.warning("You have already reviewed this swap.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${BASE}/review`, {
        reviewerId:     uid,
        reviewedUserId: reviewedUserId,
        swapId:         selectedSwap,
        rating:         rating,
        comment:        comment.trim(),
      });

      toast.success("Review submitted successfully!");

      // Optimistically add to given reviews list
      const newReview = normalizeReview({
        reviewId:       `temp_${Date.now()}`,
        ReviewerId:     uid,
        ReviewedUserId: reviewedUserId,
        SwapId:         selectedSwap,
        Rating:         rating,
        Comment:        comment.trim(),
        CreatedAt:      new Date().toISOString(),
      });
      setGivenReviews((prev) => [newReview, ...prev]);

      setRating(0);
      setComment("");
      setSelectedSwap("");
    } catch (err) {
      console.error("Submit review error:", err);
      toast.error(err.response?.data?.error ?? "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Helper: get partner name/image for a review ──────────────── */
  const getUserInfo = (id) =>
    usersMap[String(id)] ?? { name: "Unknown User", profileImage: `https://ui-avatars.com/api/?name=U&background=0d9488&color=fff&size=128` };

  /* ── Swap dropdown option label ────────────────────────────────── */
  const swapLabel = (s) => {
    const uid      = String(user.userId ?? user._id);
    const senderId = String(s.SenderId ?? s.senderId ?? "");
    const partnerId = senderId === uid
      ? String(s.ReceiverId ?? s.receiverId ?? "")
      : senderId;
    const partnerName = getUserInfo(partnerId).name;
    const swapId = s.SwapId ?? s.swapId ?? s._id;
    const offeredSkill = s.OfferedSkill ?? s.offeredSkill ?? "";
    return `${partnerName} — ${offeredSkill} (ID: ${swapId})`;
  };

  /* ── Render ────────────────────────────────────────────────────── */
  const displayList = tab === "received" ? receivedReviews : givenReviews;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1">Reviews &amp; Ratings</h2>
      <p className="text-muted mb-4">Build your reputation through honest feedback.</p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-3">Loading reviews…</p>
        </div>
      ) : (
        <div className="row g-4">
          {/* ── Left: Rating Summary + Leave Review Form ── */}
          <div className="col-lg-4">
            {/* Summary Card */}
            <div className="card border-0 shadow-sm p-4 text-center mb-4">
              <div className="ss-rating-big fw-bold">{avgRating}</div>
              <StarRating value={parseFloat(avgRating) || 0} />
              <p className="text-muted small mt-2 mb-0">
                {receivedReviews.length} review{receivedReviews.length !== 1 ? "s" : ""} received
              </p>
              <div className="mt-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = receivedReviews.filter((r) => r.rating === star).length;
                  const pct   = receivedReviews.length
                    ? Math.round((count / receivedReviews.length) * 100)
                    : 0;
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
              <h6 className="fw-bold mb-3">
                <i className="bi bi-pencil me-2 text-primary"></i>Leave a Review
              </h6>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Select Completed Swap</label>
                  <select
                    className="form-select form-select-sm"
                    id="reviewSwap"
                    value={selectedSwap}
                    onChange={(e) => setSelectedSwap(e.target.value)}
                  >
                    <option value="">Choose from completed swaps…</option>
                    {completedSwaps.map((s) => {
                      const sid = String(s.SwapId ?? s.swapId ?? s._id);
                      return (
                        <option key={sid} value={sid}>
                          {swapLabel(s)}
                        </option>
                      );
                    })}
                  </select>
                  {completedSwaps.length === 0 && (
                    <small className="text-muted">No completed swaps available yet.</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Your Rating</label>
                  <div>
                    <StarRating value={rating} onChange={setRating} />
                    {rating > 0 && (
                      <small className="text-muted ms-2">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                      </small>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Comment</label>
                  <textarea
                    className="form-control form-control-sm"
                    id="reviewComment"
                    rows={3}
                    placeholder="Share your experience…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn ss-btn-primary w-100 btn-sm"
                  id="submitReviewBtn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Submitting…</>
                  ) : (
                    <><i className="bi bi-send me-1"></i>Submit Review</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Reviews List ── */}
          <div className="col-lg-8">
            <ul className="nav nav-pills mb-4 gap-1">
              {["received", "given"].map((t) => (
                <li key={t} className="nav-item">
                  <button
                    className={`nav-link ${tab === t ? "ss-btn-primary" : "btn-outline-secondary"} btn btn-sm`}
                    onClick={() => setTab(t)}
                    id={`reviewTab_${t}`}
                  >
                    {t === "received"
                      ? `Received (${receivedReviews.length})`
                      : `Given (${givenReviews.length})`}
                  </button>
                </li>
              ))}
            </ul>

            {displayList.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-star display-4 text-muted d-block mb-3"></i>
                <p className="text-muted">No {tab} reviews yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {displayList.map((r) => {
                  const personId   = tab === "received" ? r.reviewerId : r.reviewedUserId;
                  const personInfo = getUserInfo(personId);
                  return (
                    <div key={r._id} className="card border-0 shadow-sm p-4">
                      <div className="d-flex align-items-start gap-3">
                        {/* Avatar */}
                        <div
                          className="ss-nav-avatar rounded-circle bg-dark bg-opacity-75 d-flex align-items-center justify-content-center text-light fw-bold shadow flex-shrink-0"
                          style={{ width: 44, height: 44, fontSize: "1.1rem" }}
                        >
                          {personInfo.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                            <h6 className="fw-bold mb-0">{personInfo.name}</h6>
                            <small className="text-muted">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="my-1">
                            <StarRating value={r.rating} size="sm" />
                          </div>
                          <p className="text-muted small fst-italic mb-0">"{r.comment}"</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
