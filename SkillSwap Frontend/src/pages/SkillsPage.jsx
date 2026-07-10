import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkillCard from "../components/SkillCard";
import UserCard from "../components/UserCard";
import { toast } from "react-toastify";
import axios from "axios";

const API = "http://localhost:3000";

const getLocalDateTimeMin = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
};

const SkillsPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const currentUserId = user?.userId ?? user?._id;
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("");
  const [level, setLevel] = useState("");
  const [availability, setAvailability] = useState("");
  const [viewMode, setViewMode] = useState("skills");
  const [sortBy, setSortBy] = useState("rating");

  const [categories, setCategories] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Swap Modal state ──────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [mySkills, setMySkills] = useState([]);
  const [offeredSkillId, setOfferedSkillId] = useState("");
  const [swapMessage, setSwapMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [sending, setSending] = useState(false);


  useEffect(() => {
    fetchCategories();
    fetchUsers();
    fetchSkills();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/category`);
      setCategories(response.data.List);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setAllUsers(response.data.List || response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/skills`);
      setAllSkills(response.data.List || response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySkills = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API}/skills/user/${user.userId}`);
      setMySkills(
        (res.data.List || []).map((s) => ({
          ...s,
          _id: s.skillId ?? s._id,
          title: s.Title ?? s.title ?? "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch your skills:", err);
    }
  };


  let skills = [...allSkills];
  // hide logged in user 
  if (user) {
    skills = skills.filter((s) => String(s.userId) !== String(user.userId));
  }

  if (query) skills = skills.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()));
  if (category) skills = skills.filter((s) => s.category === category);
  if (mode) skills = skills.filter((s) => s.mode === mode || s.mode === "Both");
  if (level) skills = skills.filter((s) => s.experienceLevel === level);
  if (availability) skills = skills.filter((s) => s.availability === availability || s.availability === "Flexible");
  if (sortBy === "rating") skills.sort((a, b) => b.rating - a.rating);
  else if (sortBy === "newest") skills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sortBy === "reviews") skills.sort((a, b) => b.reviewCount - a.reviewCount);

  const filteredUsers = allUsers.filter((u) => u.role === "user" &&
    (!query || u.name.toLowerCase().includes(query.toLowerCase()) || u.bio?.toLowerCase().includes(query.toLowerCase())));

  const handleRequestSwap = (skill) => {
    if (!user) { toast.warn("Please login to send a swap request"); return; }
    setSelectedSkill(skill);
    setOfferedSkillId("");
    setSwapMessage("");
    setScheduledDate(getLocalDateTimeMin());
    fetchMySkills();
    setShowModal(true);
  };

  const handleSendRequest = async () => {
    if (!offeredSkillId) { toast.warn("Please select a skill you'll offer."); return; }
    setSending(true);
    try {
      // 1. Create swap record
      const offeredSkillObj = mySkills.find((s) => String(s._id) === String(offeredSkillId));
      await axios.post(`${API}/swap`, {
        senderId: user.userId,
        receiverId: selectedSkill.userId,
        requestedSkillId: selectedSkill._id ?? selectedSkill.skillId,
        requestedSkill: selectedSkill?.title ?? null,
        offeredSkillId: Number(offeredSkillId),
        offeredSkill: offeredSkillObj?.title ?? null,
        message: swapMessage || "",
        scheduledDate: scheduledDate || null,
        status: "Pending",
      });

      // 2. Notify the skill owner
      await axios.post(`${API}/notification`, {
        userId: selectedSkill.userId,
        title: "New Swap Request",
        message: `${user.name} sent you a swap request for "${selectedSkill.title || "a skill"}".`,
        type: "swap_request",
      });

      toast.success(`Swap request sent for "${selectedSkill.title}"!`);
      setShowModal(false);
    } catch (err) {
      console.error("Swap request failed:", err);
      toast.error("Failed to send swap request. Please try again.");
    } finally {
      setSending(false);
    }
  };


  const clearFilters = () => { setQuery(""); setCategory(""); setMode(""); setLevel(""); setAvailability(""); };

  const activeFilters = [category, mode, level, availability].filter(Boolean).length;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Browse Skills</h2>
          <p className="text-muted mb-0">{skills.length} skill{skills.length !== 1 ? "s" : ""} found</p>
        </div>
        <div className="d-flex gap-2">
          <button className={`btn ${viewMode === "skills" ? "ss-btn-primary" : "btn-outline-secondary"} btn-sm`} onClick={() => setViewMode("skills")}>
            <i className="bi bi-grid me-1"></i>Skills
          </button>
          <button className={`btn ${viewMode === "users" ? "ss-btn-primary" : "btn-outline-secondary"} btn-sm`} onClick={() => setViewMode("users")}>
            <i className="bi bi-people me-1"></i>People
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-3 sticky-top" style={{ top: 80 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0"><i className="bi bi-funnel me-2"></i>Filters</h6>
              {activeFilters > 0 && (
                <button className="btn btn-sm btn-outline-danger" onClick={clearFilters}>
                  Clear ({activeFilters})
                </button>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Search</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control" id="skillSearch" placeholder="Keyword..."
                  value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Category</label>
              <select className="form-select form-select-sm" id="categoryFilter" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {
                  categories.map((c) => (
                    <option
                      key={c.categoryId}
                      value={c.categoryName}
                    >
                      {c.categoryName}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Mode</label>
              <select className="form-select form-select-sm" id="modeFilter" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="">Any Mode</option>
                <option>Online</option>
                <option>Offline</option>
                <option>Both</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Experience Level</label>
              <select className="form-select form-select-sm" id="levelFilter" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">Any Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Availability</label>
              <select className="form-select form-select-sm" id="availFilter" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="">Any Time</option>
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>Evenings</option>
                <option>Mornings</option>
                <option>Flexible</option>
              </select>
            </div>

            <div>
              <label className="form-label small fw-semibold">Sort By</label>
              <select className="form-select form-select-sm" id="sortFilter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-lg-9">
          {viewMode === "skills" ? (
            skills.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted d-block mb-3"></i>
                <h5 className="text-muted">No skills found</h5>
                <p className="text-muted small mb-3">Try adjusting your filters or search term.</p>
                <button className="btn ss-btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="row g-3">
                {skills.map((skill) => (
                  <div key={skill.skillId ?? skill._id} className="col-sm-6 col-xl-4">
                    <SkillCard skill={skill} onRequestSwap={user && String(skill.userId) !== String(currentUserId) ? handleRequestSwap : null} />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="row g-3">
              {filteredUsers.map((u) => (
                <div key={u.userId ?? u._id} className="col-sm-6 col-xl-4">
                  <UserCard user={u} onSendRequest={user && (u.userId ?? u._id) !== currentUserId ? () => toast.success(`Swap request sent to ${u.name}!`) : null} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Swap Request Modal */}
      {showModal && selectedSkill && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Send Swap Request</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} disabled={sending}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">
                  Requesting: <strong>{selectedSkill.title}</strong> from{" "}
                  <strong>{allUsers.find((u) => String(u.userId) === String(selectedSkill.userId))?.name || allUsers.find((u) => String(u.userId) === String(selectedSkill.userId))?.Name || "this user"}</strong>
                </p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">What skill will you offer?</label>
                  <select
                    className="form-select"
                    id="skillsPageOfferedSkill"
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
                  <textarea
                    className="form-control"
                    rows={3}
                    id="skillsPageSwapMessage"
                    placeholder={`Hi! I'd love to swap skills with you...`}
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="skillsPageSwapTiming"
                    value={scheduledDate}
                    min={getLocalDateTimeMin()}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  className="btn ss-btn-primary"
                  id="skillsPageSendSwapBtn"
                  onClick={handleSendRequest}
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

export default SkillsPage;
