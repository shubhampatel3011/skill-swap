import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import SkillCard from "../components/SkillCard";
import { toast } from "react-toastify";
import axios from "axios";

const API = "http://localhost:3000";

const UserProfilePage = () => {
  const { id } = useParams();      // id = the profile user's userId
  const { user } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [mySkills, setMySkills] = useState([]);  // logged-in user's skills to offer
  const [pageLoading, setPageLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [offeredSkillId, setOfferedSkillId] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch profile user, their skills, reviews, and the logged-in user's own skills
  useEffect(() => {
    const fetchAll = async () => {
      setPageLoading(true);
      try {
        const [usersRes, skillsRes, reviewsRes] = await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/skills/user/${id}`),
          axios.get(`${API}/review`).catch(() => ({ data: { List: [] } })),
        ]);

        const allUsers = usersRes.data.List || [];
        const found = allUsers.find(
          (u) => String(u.userId || u._id) === String(id)
        );
        setProfileUser(found || null);

        const rawSkills = skillsRes.data.List || [];
        setSkills(rawSkills.map(normalizeSkill));

        const allReviews = reviewsRes.data.List || [];
        setReviews(allReviews.filter((r) => String(r.receiverId ?? r.ReviewedUserId) === String(id)));
      } catch (err) {
        console.error("UserProfilePage fetch error:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // Fetch the logged-in user's skills whenever they open the modal
  const fetchMySkills = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API}/skills/user/${user.userId}`);
      setMySkills((res.data.List || []).map(normalizeSkill));
    } catch (err) {
      console.error("Failed to fetch your skills:", err);
    }
  };


  /** Normalize PascalCase DB skill columns to camelCase */
  const normalizeSkill = (s) => ({
    ...s,
    _id: s.skillId ?? s._id,
    userId: s.userId ?? s.UserId,
    title: s.Title ?? s.title ?? "",
    description: s.Description ?? s.description ?? "",
    category: s.Category ?? s.category ?? "",
    experienceLevel: s.ExperienceLevel ?? s.experienceLevel ?? "",
    availability: s.Availability ?? s.availability ?? "",
    mode: s.Mode ?? s.mode ?? "",
    rating: s.Rating ?? s.rating ?? 0,
    reviewCount: s.ReviewCount ?? s.reviewCount ?? 0,
    userName: s.UserName ?? s.userName ?? "",
    userImage: s.UserImage ?? s.userImage ?? "",
  });

  if (pageLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }


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
    setOfferedSkillId("");
    setMessage("");
    setScheduledDate("");
    fetchMySkills();
    setShowModal(true);
  };

  const handleSendRequest = async () => {
    if (!offeredSkillId) { toast.warn("Please select a skill you'll offer."); return; }
    setSending(true);
    try {
      // 1. Create swap request
      const offeredSkillObj = mySkills.find((s) => String(s._id) === String(offeredSkillId));
      await axios.post(`${API}/swap`, {
        senderId: user.userId,
        receiverId: profileUser.userId ?? id,
        requestedSkillId: selectedSkill?._id ?? null,
        requestedSkill: selectedSkill?.title ?? null,
        offeredSkillId: Number(offeredSkillId),
        offeredSkill: offeredSkillObj?.title ?? null,
        message: message || "",
        scheduledDate: scheduledDate || null,
        status: "Pending",
      });

      // 2. Notify the receiver
      await axios.post(`${API}/notification`, {
        userId: profileUser.userId ?? id,
        title: "New Swap Request",
        message: `${user.name} sent you a swap request for "${selectedSkill?.title || "a skill"}".`,
        type: "swap_request",
      });

      toast.success(`Swap request sent to ${profileUser.name}!`);
      setShowModal(false);
      setMessage("");
      setScheduledDate("");
      setOfferedSkillId("");
    } catch (err) {
      console.error("Swap request failed:", err);
      toast.error("Failed to send swap request. Please try again.");
    } finally {
      setSending(false);
    }
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
                  <select
                    className="form-select"
                    id="swapOfferedSkill"
                    value={offeredSkillId}
                    onChange={(e) => setOfferedSkillId(e.target.value)}
                  >
                    <option value="">Choose a skill you'll teach...</option>
                    {mySkills.map((s) => (
                      <option key={s._id} value={s._id}>{s.title}</option>
                    ))}
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
                  <input type="datetime-local" className="form-control" id="swapTiming"
                    value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)} disabled={sending}>Cancel</button>
                <button
                  className="btn ss-btn-primary"
                  onClick={handleSendRequest}
                  id="sendSwapBtn"
                  disabled={sending}
                >
                  {sending
                    ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Sending…</>
                    : <><i className="bi bi-send me-2"></i>Send Request</>
                  }
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
