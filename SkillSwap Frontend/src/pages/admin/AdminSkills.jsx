import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import StarRating from "../../components/StarRating";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminSkills = () => {
  const { token } = useAuth();
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getSkills();
  }, []);

  const filtered = skills.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.userName || s.name || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || s.category === category;
    return matchSearch && matchCat;
  });

  const categories = [...new Set(skills.map((s) => s.category))];

  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const getSkills = async () => {
    try {
      const authToken = token || localStorage.getItem("ss_token");
      const response = await axios.get("http://localhost:3000/skills", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // setSkills(response.data.List);
      const skillData = response.data;
      setSkills(Array.isArray(skillData) ? skillData : skillData.List || skillData.skills || skillData.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch skills");
    }
  };

  const deleteSkill = async (id) => {
    if (window.confirm("Remove this skill listing?")) {
      try {
        const authToken = token || localStorage.getItem("ss_token");
        await axios.delete(`http://localhost:3000/skills/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setSkills((prev) => prev.filter((s) => s._id !== id));
        toast.success("Skill removed.");
      } catch (error) {
        console.log(error);
        toast.error("Failed to remove skill");
      }
    }
  };

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="mb-4">
          <h3 className="fw-bold mb-0">Moderate Skills</h3>
          <p className="text-muted">{filtered.length} skills listed</p>
        </div>

        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search skills..."
              id="adminSkillSearch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search display-4 text-muted d-block mb-3"></i>
            <h5 className="text-muted">No skills found</h5>
            <p className="text-muted small mb-3">Try adjusting your filters or search term.</p>
            <button className="btn ss-btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
        <div className="row g-3">
          {filtered.map((skill) => (
            <div key={skill._id ?? skill.skillId ?? `${skill.userId}-${skill.title}`} className="col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{skill.title}</h6>
                    <span className="badge bg-primary bg-opacity-10 text-primary small">
                      {skill.category}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="ss-nav-avatar rounded-circle border-2 bg-dark bg-opacity-75 d-flex p-3 fs-5 align-items-center justify-content-center text-light fw-bold shadow">
                      {(skill.name || skill.userName || "U").charAt(0).toUpperCase()}
                    </div>
                    <small className="text-muted">{skill.name || skill.userName || "Unknown"}</small>
                  </div>
                  <p className="text-muted small mb-2">
                    {skill.description.slice(0, 80)}…
                  </p>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <StarRating value={skill.rating} size="xs" />
                    <small className="text-muted">({skill.reviewCount})</small>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary small">
                      {skill.mode}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-warning flex-fill">
                      <i className="bi bi-eye-slash me-1"></i>Hide
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger flex-fill"
                      onClick={() => deleteSkill(skill._id)}
                    >
                      <i className="bi bi-trash me-1"></i>Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          )
        }
      </div>
    </div>
  );
};

export default AdminSkills;
