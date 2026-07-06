import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    location: "", bio: "", category: "", skillsWanted: [],
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/category")
      .then((res) => setCategories(res.data.List || []))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone) e.phone = "Phone is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.category) e.category = "Select a category";

    return e;
  };

  const handleNext = () => {
    const v = validateStep1();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    setStep(2);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        Name: form.name,
        Email: form.email,
        Mobile: form.phone,
        Password: form.password,
        Address: form.location,
        Skills: form.skillsOffered.join(", "),
        Bio: form.bio,
        Intrest: form.skillsWanted.join(", "),
      }

      console.log("Sending data:", userData);

      const response = await axios.post(
        "http://localhost:3000/users",
        userData
      );

      toast.success(response.data.Message);
      navigate("/dashboard");

    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-auth-page d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card ss-auth-card border-0 shadow-lg p-4">
              <div className="text-center mb-4">
                <div className="ss-auth-logo mb-3"><i className="bi bi-arrow-left-right"></i></div>
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted small">Join the SkillSwap community</p>
              </div>

              {/* Step indicator */}
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className={`ss-step-dot ${step >= 1 ? "active" : ""}`}>1</div>
                <div className="ss-step-line flex-grow-1"></div>
                <div className={`ss-step-dot ${step >= 2 ? "active" : ""}`}>2</div>
                <div className="ss-step-line flex-grow-1"></div>
                <div className={`ss-step-dot ${step >= 2 ? "active" : ""}`}>✓</div>
              </div>

              {step === 1 && (
                <div>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-person"></i></span>
                        <input type="text" id="regName" className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Aryan Sharma" value={form.name} onChange={(e) => set("name", e.target.value)} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Email</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                        <input type="email" id="regEmail" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-phone"></i></span>
                        <input type="tel" id="regPhone" className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                          placeholder="9876543210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-lock"></i></span>
                        <input type="password" id="regPassword" className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          placeholder="Min 6 chars" value={form.password} onChange={(e) => set("password", e.target.value)} />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                        <input type="password" id="regConfirmPassword" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                          placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                      </div>
                    </div>
                  </div>
                  <button className="btn ss-btn-primary w-100 mt-4 py-2" onClick={handleNext} id="regNextBtn">
                    Next <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Location</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                        <input type="text" id="regLocation" className="form-control"
                          placeholder="Mumbai, India" value={form.location} onChange={(e) => set("location", e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Bio <span className="text-muted fw-normal">(optional)</span></label>
                      <textarea className="form-control" id="regBio" rows={3}
                        placeholder="Tell the community about yourself..."
                        value={form.bio} onChange={(e) => set("bio", e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Skills I Can Teach</label>
                      <select id="skillCategory" className={`form-select ${errors.category ? "is-invalid" : ""}`}
                        value={form.category} onChange={(e) => set("category", e.target.value)}>
                        <option value="">Choose a category...</option>
                        {categories.map((c) => (
                          <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
                        ))}
                      </select>
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Skills I Want to Learn</label>
                      <input type="text" className="form-control" id="regSkillsWant"
                        placeholder="Spanish, Graphic Design (comma separated)"
                        value={form.skillsWanted.join(", ")}
                        onChange={(e) => set("skillsWanted", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary flex-fill py-2" onClick={() => setStep(1)}>
                      <i className="bi bi-arrow-left me-1"></i>Back
                    </button>
                    <button type="submit" className="btn ss-btn-primary flex-fill py-2" disabled={loading} id="regSubmitBtn">
                      {loading ? <span className="spinner-border spinner-border-sm"></span> : "Create Account"}
                    </button>
                  </div>
                </form>
              )}

              <hr className="my-4" />
              <p className="text-center text-muted small mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
