import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { MOCK_USERS, MOCK_SKILLS, MOCK_REVIEWS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import SkillCard from "../components/SkillCard";
import { toast } from "react-toastify";

const UserProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const profileUser = MOCK_USERS.find((u) => u._id === id);
  const skills = MOCK_SKILLS.filter((s) => s.userId === id);
  const reviews = MOCK_REVIEWS.filter((r) => r.reviewedUserId === id);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [message, setMessage] = useState("");

  if (!profileUser) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-person-x display-1 text-muted"></i>
        <h3 className="mt-3">User not found</h3>
        <Link to="/skills" className="btn ss-btn-primary mt-3">Browse Skills</Link>
      </div>
    );
  }

  const handleRequestSwap = (skill) => {
    if (!user) { toast.warn("Please login to send a swap request"); return; }
    setSelectedSkill(skill);
    setShowModal(true);
  };

  const handleSendRequest = () => {
    setShowModal(false);
    toast.success(`Swap request sent to ${profileUser.name}!`);
    setMessage("");
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="ss-profile-banner card border-0 shadow-sm p-4 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-auto">
            <div className="position-relative">
              <img src={profileUser.profileImage} alt={profileUser.name}
                className="rounded-circle border border-3 border-white shadow" width={100} height={100} />
              {profileUser.rating >= 4.8 && (
                <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-warning text-dark" style={{ fontSize: "10px" }}>
                  <i className="bi bi-patch-check-fill"></i> Top
                </span>
              )}
            </div>
          </div>
          <div className="col">
            <h3 className="fw-bold mb-1">{profileUser.name}</h3>
            <p className="text-muted mb-1"><i className="bi bi-geo-alt me-1"></i>{profileUser.location}</p>
            <div className="d-flex align-items-center gap-2 mb-2">
              <StarRating value={profileUser.rating} />
              <span className="fw-bold">{profileUser.rating}</span>
              <span className="text-muted small">({profileUser.reviewCount} reviews)</span>
            </div>
            <p className="text-muted mb-0">{profileUser.bio}</p>
          </div>
          {user && user._id !== id && (
            <div className="col-auto d-flex flex-column gap-2">
              <button className="btn ss-btn-primary" onClick={() => handleRequestSwap(skills[0])}>
                <i className="bi bi-send me-2"></i>Send Swap Request
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-envelope me-2"></i>Message
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Skills */}
        <div className="col-lg-8">
          <h5 className="fw-bold mb-3"><i className="bi bi-mortarboard me-2 text-primary"></i>Skills Offered ({skills.length})</h5>
          {skills.length === 0 ? (
            <p className="text-muted">No skills listed yet.</p>
          ) : (
            <div className="row g-3">
              {skills.map((skill) => (
                <div key={skill._id} className="col-sm-6">
                  <SkillCard skill={skill} onRequestSwap={user && user._id !== id ? handleRequestSwap : null} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="col-lg-4">
          <h5 className="fw-bold mb-3"><i className="bi bi-star me-2 text-warning"></i>Reviews ({reviews.length})</h5>
          {reviews.length === 0 && <p className="text-muted small">No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="card border-0 shadow-sm mb-3 p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <img src={r.reviewerImage} alt={r.reviewerName} className="rounded-circle" width={32} height={32} />
                <div>
                  <div className="small fw-semibold">{r.reviewerName}</div>
                  <StarRating value={r.rating} size="xs" />
                </div>
              </div>
              <p className="small text-muted mb-0 fst-italic">"{r.comment}"</p>
              <small className="text-muted mt-1">{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Swap Request Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Send Swap Request</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">Requesting: <strong>{selectedSkill?.title}</strong> from <strong>{profileUser.name}</strong></p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">What skill will you offer?</label>
                  <select className="form-select" id="swapOfferedSkill">
                    <option value="">Choose a skill you'll teach...</option>
                    {MOCK_SKILLS.filter((s) => s.userId === user?._id).map((s) => (
                      <option key={s._id} value={s._id}>{s.title}</option>
                    ))}
                    <option value="custom">Other skill (type below)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea className="form-control" rows={3} id="swapMessage"
                    placeholder={`Hi ${profileUser.name.split(" ")[0]}! I'd love to swap skills...`}
                    value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Preferred Timing</label>
                  <input type="datetime-local" className="form-control" id="swapTiming" />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn ss-btn-primary" onClick={handleSendRequest} id="sendSwapBtn">
                  <i className="bi bi-send me-2"></i>Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
