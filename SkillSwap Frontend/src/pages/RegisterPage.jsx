import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    location: "", bio: "", subCategory: "", skillsWanted: [], profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/subCategory")
      .then((res) => setSubCategories(res.data.List || []))
      .catch((err) => console.error("Failed to load subCategories:", err));
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
    if (!form.confirmPassword) e.confirmPassword = "Confirm your password";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";

    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.subCategory) e.subCategory = "Select a subCategory";
    if (!form.skillsWanted.length) e.skillsWanted = "Select a subCategory";
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
    const v = validateStep2();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Name", form.name);
      formData.append("Email", form.email);
      formData.append("Mobile", form.phone);
      formData.append("Password", form.password);
      formData.append("Address", form.location);
      formData.append("Skills", form.subCategory);
      formData.append("Bio", form.bio);
      formData.append("Intrest", form.skillsWanted.join(", "));
      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }

      console.log("Sending registration data via FormData...");

      const response = await axios.post("http://localhost:3000/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.Message || "Account created successfully! Please log in.");
      navigate("/login", { replace: true });

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
                <div className={`ss-step-dot ${step >= 2 ? "active" : ""}`}>
                  <i className="bi bi-check-lg"></i>
                </div>
              </div>

              {step === 1 && (
                <div>
                  <div className="row g-3">
                    <div className="col-12 text-center mb-2">
                      <div className="position-relative d-inline-block">
                        <div
                          className="rounded-circle border overflow-hidden d-flex align-items-center justify-content-center bg-light shadow-sm"
                          style={{ width: "90px", height: "90px", cursor: "pointer", border: "2px solid #eaeaea" }}
                          onClick={() => document.getElementById("profileImageInput").click()}
                        >
                          {imagePreview ? (
                            <img src={imagePreview} alt="Profile Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <i className="bi bi-camera text-muted fs-3"></i>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-0 d-flex align-items-center justify-content-center"
                          style={{ width: "28px", height: "28px", border: "2px solid white" }}
                          onClick={() => document.getElementById("profileImageInput").click()}
                        >
                          <i className="bi bi-pencil-fill" style={{ fontSize: "10px" }}></i>
                        </button>
                        <input
                          type="file"
                          id="profileImageInput"
                          accept="image/*"
                          className="d-none"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (imagePreview) {
                                URL.revokeObjectURL(imagePreview);
                              }
                              set("profileImage", file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </div>
                      <div className="small text-muted mt-2 fw-semibold">Profile Picture</div>
                    </div>

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
                          placeholder="9876543210" maxLength={10} inputMode="numeric" value={form.phone}
                          onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
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
                <form onSubmit={handleSubmit} noValidate>
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
                      <select id="skillCategory" className={`form-select ${errors.subCategory ? "is-invalid" : ""}`}
                        value={form.subCategory} onChange={(e) => set("subCategory", e.target.value)}>
                        <option value="">Choose a subCategory...</option>
                        {subCategories.map((c) => (
                          <option key={c.subCategoryId} value={c.subCategoryName}>{c.subCategoryName}</option>
                        ))}
                      </select>
                      {errors.subCategory && <div className="invalid-feedback">{errors.subCategory}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Skills I Want to Learn</label>
                      <select id="regSkillsWant" className={`form-select ${errors.skillsWanted ? "is-invalid" : ""}`}
                        value={form.skillsWanted[0] || ""} onChange={(e) => set("skillsWanted", e.target.value ? [e.target.value] : [])}>
                        <option value="">Choose a subCategory...</option>
                        {subCategories.map((c) => (
                          <option key={c.subCategoryId} value={c.subCategoryName}>{c.subCategoryName}</option>
                        ))}
                      </select>
                      {errors.skillsWanted && <div className="invalid-feedback">{errors.skillsWanted}</div>}
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
