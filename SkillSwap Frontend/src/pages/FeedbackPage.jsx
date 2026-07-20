import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MOCK_FEEDBACK } from "../data/mockData";
import { toast } from "react-toastify";
import axios from "axios";

const API = "http://localhost:3000";

const FeedbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Sync user details if authenticated
  useEffect(() => {
    if (user && !isAnonymous) {
      setName(user.name || "");
      setEmail(user.email || "");
    } else if (isAnonymous) {
      setName("");
      setEmail("");
    }
  }, [user, isAnonymous]);

  const ratingTexts = {
    1: "Very Dissatisfied (Poor)",
    2: "Dissatisfied (Fair)",
    3: "Neutral (Good)",
    4: "Satisfied (Very Good)",
    5: "Extremely Satisfied (Excellent!)"
  };

  const categories = [
    "Bug Report",
    "Feature Suggestion",
    "UI/UX Experience",
    "General Appreciation",
    "Other"
  ];

  const validate = () => {
    const e = {};
    if (rating === 0) e.rating = "Please select a rating of 1 to 5 stars.";
    if (!category) e.category = "Please select a feedback category.";
    
    if (!isAnonymous) {
      if (!name.trim()) e.name = "Name is required (or submit anonymously)";
      if (!email.trim()) e.email = "Email is required (or submit anonymously)";
      else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Please enter a valid email address";
    }

    if (!comment.trim()) e.comment = "Please write a comment.";
    else if (comment.trim().length < 15) e.comment = "Feedback details must be at least 15 characters long.";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setLoading(true);
    setErrors({});

    const newFeedback = {
      _id: "feed_" + Date.now(),
      userName: isAnonymous ? "Anonymous" : name.trim(),
      userEmail: isAnonymous ? "" : email.trim(),
      rating,
      category,
      comment: comment.trim(),
      status: "New",
      adminNotes: "",
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${API}/feedback`, {
        userName: newFeedback.userName,
        userEmail: newFeedback.userEmail,
        rating,
        category,
        comment: comment.trim(),
      });

      const saved = localStorage.getItem("website_feedback");
      const feedList = saved ? JSON.parse(saved) : MOCK_FEEDBACK;
      const updated = [newFeedback, ...feedList];
      localStorage.setItem("website_feedback", JSON.stringify(updated));

      toast.success("Thank you! Your feedback has been submitted successfully. 🎉");

      // Reset form
      setRating(0);
      setCategory("");
      setComment("");
      setIsAnonymous(false);
      if (!user) {
        setName("");
        setEmail("");
      }

      // Navigate back or home
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          {/* Header */}
          <div className="mb-4 text-center">
            <h2 className="fw-bold mb-1">Website Feedback</h2>
            <p className="text-muted">Help us improve. Share your thoughts, bugs, and suggestions with us!</p>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4">
            <form onSubmit={handleSubmit} noValidate>
              
              {/* Star Rating Selector */}
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
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <i
                        className={`bi ${
                          star <= (hoverRating || rating) ? "bi-star-fill text-warning" : "bi-star text-muted"
                        } display-6`}
                        style={{
                          transition: "color 0.15s, transform 0.1s",
                          transform: star === (hoverRating || rating) ? "scale(1.15)" : "none",
                          cursor: "pointer"
                        }}
                      ></i>
                    </button>
                  ))}
                </div>
                {errors.rating ? (
                  <div className="text-danger small">{errors.rating}</div>
                ) : (
                  <div className="text-muted small" style={{ height: "20px" }}>
                    {(hoverRating || rating) ? ratingTexts[hoverRating || rating] : "Select 1 to 5 stars"}
                  </div>
                )}
              </div>

              {/* Category */}
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

              {/* Anonymous Checkbox */}
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

              {/* Submitter details */}
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
                      disabled={!!user} // Locked if logged in
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

              {/* Comments */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Your Feedback Details <span className="text-danger">*</span></label>
                <textarea
                  className={`form-control ${errors.comment ? "is-invalid" : ""}`}
                  rows={5}
                  placeholder="Describe your issue, suggestion, or experience in detail (minimum 15 characters)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="d-flex justify-content-between mt-1">
                  {errors.comment ? (
                    <div className="invalid-feedback d-block">{errors.comment}</div>
                  ) : (
                    <div />
                  )}
                  <small className="text-muted">{comment.length} characters</small>
                </div>
              </div>

              {/* Submit Buttons */}
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
