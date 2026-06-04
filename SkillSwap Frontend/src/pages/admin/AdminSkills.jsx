import { useState } from "react";
import { MOCK_SKILLS } from "../../data/mockData";
import AdminSidebar from "../../components/AdminSidebar";
import StarRating from "../../components/StarRating";
import { toast } from "react-toastify";

const AdminSkills = () => {
  const [skills, setSkills] = useState(MOCK_SKILLS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = skills.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.userName.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || s.category === category;
    return matchSearch && matchCat;
  });

  const categories = [...new Set(MOCK_SKILLS.map((s) => s.category))];

  const deleteSkill = (id) => {
    if (window.confirm("Remove this skill listing?")) {
      setSkills((prev) => prev.filter((s) => s._id !== id));
      toast.success("Skill removed.");
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
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control" placeholder="Search skills..." id="adminSkillSearch"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 200 }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="row g-3">
          {filtered.map((skill) => (
            <div key={skill._id} className="col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{skill.title}</h6>
                    <span className="badge bg-primary bg-opacity-10 text-primary small">{skill.category}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img src={skill.userImage} alt={skill.userName} className="rounded-circle" width={24} height={24} />
                    <small className="text-muted">{skill.userName}</small>
                  </div>
                  <p className="text-muted small mb-2">{skill.description.slice(0, 80)}…</p>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <StarRating value={skill.rating} size="xs" />
                    <small className="text-muted">({skill.reviewCount})</small>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary small">{skill.mode}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-warning flex-fill">
                      <i className="bi bi-eye-slash me-1"></i>Hide
                    </button>
                    <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => deleteSkill(skill._id)}>
                      <i className="bi bi-trash me-1"></i>Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;
