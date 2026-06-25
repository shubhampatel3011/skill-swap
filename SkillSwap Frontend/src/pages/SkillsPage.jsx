import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkillCard from "../components/SkillCard";
import UserCard from "../components/UserCard";
import { toast } from "react-toastify";
import axios from "axios";

const SkillsPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("");
  const [level, setLevel] = useState("");
  const [availability, setAvailability] = useState("");
  const [viewMode, setViewMode] = useState("skills");
  const [sortBy, setSortBy] = useState("rating");

  const [categories, setCategories] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/category"
      );

      setCategories(response.data.List);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setAllUsers(response.data.List || response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  let skills = [];
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
    toast.success(`Swap request sent for "${skill.title}"!`);
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
                  <div key={skill._id} className="col-sm-6 col-xl-4">
                    <SkillCard skill={skill} onRequestSwap={user && skill.userId !== user._id ? handleRequestSwap : null} />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="row g-3">
              {filteredUsers.map((u) => (
                <div key={u._id} className="col-sm-6 col-xl-4">
                  <UserCard user={u} onSendRequest={user && u._id !== user._id ? () => toast.success(`Swap request sent to ${u.name}!`) : null} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
