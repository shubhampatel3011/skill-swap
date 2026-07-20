import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EXPERIENCE_LEVELS, AVAILABILITY, MODES } from "../data/mockData";
import { toast } from "react-toastify";
import axios from "axios";

const AddSkillPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", category: "", description: "", experienceLevel: "", availability: "", mode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/category")
      .then((res) => setCategories(res.data.List || []))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);
  useEffect(() => {
    axios.get("http://localhost:3000/subCategory")
      .then((res) => setSubCategories(res.data.List || []))
      .catch((err) => console.error("Failed to load subCategories:", err));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    // if (!form.title.trim()) e.title = "Skill title is required";
    if (!form.category) e.category = "Select a category";
    if (!form.description.trim()) e.description = "Description is required";
    else if (form.description.length < 30) e.description = "At least 30 characters";
    if (!form.experienceLevel) e.experienceLevel = "Select experience level";
    if (!form.availability) e.availability = "Select availability";
    if (!form.mode) e.mode = "Select mode";
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

    try{
      const skillData = {
        userId: user.userId,
        name: user.name,
        title: form.title,
        category: form.category,
        description: form.description,
        experienceLevel: form.experienceLevel,
        availability: form.availability,
        mode: form.mode,      
      }
      console.log(skillData);

      const response = await axios.post(
        "http://localhost:3000/skills",
        skillData,
      );

      // toast.success(response.data.Message);
      setTimeout(() => {
        toast.success("Skill listed successfully! 🎉");
        navigate("/profile");
      }, 300);
      
    }
    catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Registration failed");
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Add a New Skill</h2>
            <p className="text-muted">List a skill you can teach to the community.</p>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Skill Title <span className="text-danger">*</span></label>
                <select id="skillTitle" className={`form-select ${errors.title ? "is-invalid" : ""}`}
                  value={form.title || ""} onChange={(e) => set("title", e.target.value ? e.target.value : "")}>
                  <option value="">Choose a skill title...</option>
                  {subCategories.map((c) => (
                    <option key={c.subCategoryId} value={c.subCategoryName}>{c.subCategoryName}</option>
                  ))}
                </select>
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category <span className="text-danger">*</span></label>
                <select id="skillCategory" className={`form-select ${errors.category ? "is-invalid" : ""}`}
                  value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">Choose a category...</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description <span className="text-danger">*</span></label>
                <textarea id="skillDescription" className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  rows={4} placeholder="Describe what you'll teach, your approach, what learners will gain..."
                  value={form.description} onChange={(e) => set("description", e.target.value)} />
                <div className="d-flex justify-content-between">
                  {errors.description ? <div className="invalid-feedback d-block">{errors.description}</div> : <div />}
                  <small className="text-muted">{form.description.length}/500</small>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Experience Level <span className="text-danger">*</span></label>
                  <select id="skillLevel" className={`form-select ${errors.experienceLevel ? "is-invalid" : ""}`}
                    value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)}>
                    <option value="">Select level...</option>
                    {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.experienceLevel && <div className="invalid-feedback">{errors.experienceLevel}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Availability <span className="text-danger">*</span></label>
                  <select id="skillAvailability" className={`form-select ${errors.availability ? "is-invalid" : ""}`}
                    value={form.availability} onChange={(e) => set("availability", e.target.value)}>
                    <option value="">Select availability...</option>
                    {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.availability && <div className="invalid-feedback">{errors.availability}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Mode <span className="text-danger">*</span></label>
                  <select id="skillMode" className={`form-select ${errors.mode ? "is-invalid" : ""}`}
                    value={form.mode} onChange={(e) => set("mode", e.target.value)}>
                    <option value="">Select mode...</option>
                    {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.mode && <div className="invalid-feedback">{errors.mode}</div>}
                </div>
              </div>

              {/* Preview */}
              {form.title && (
                <div className="ss-skill-preview p-3 rounded mb-4">
                  <div className="small fw-semibold text-muted mb-2"><i className="bi bi-eye me-1"></i>Preview</div>
                  <h6 className="fw-bold mb-1">{form.title}</h6>
                  {form.category && <span className="badge bg-primary bg-opacity-10 text-primary me-2">{form.category}</span>}
                  {form.mode && <span className="badge bg-success bg-opacity-10 text-success me-2">{form.mode}</span>}
                  {form.experienceLevel && <span className="badge bg-warning bg-opacity-10 text-warning">{form.experienceLevel}</span>}
                  {form.description && <p className="text-muted small mt-2 mb-0">{form.description.slice(0, 120)}…</p>}
                </div>
              )}

              <div className="d-flex gap-3">
                <button type="submit" className="btn ss-btn-primary px-5 py-2" disabled={loading} id="addSkillSubmit">
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Publishing…</> : <><i className="bi bi-plus-circle me-2"></i>Publish Skill</>}
                </button>
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
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

export default AddSkillPage;
