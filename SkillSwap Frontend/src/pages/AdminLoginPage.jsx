import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminLoginPage = () => {
  const { adminLogin, admin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (admin && admin.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [admin, navigate]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      const u = adminLogin(form.email, form.password);
      if (u.role !== "admin") {
        toast.error("Only admin accounts can access this page");
        setLoading(false);
        return;
      }
      toast.success(`Welcome back, Admin ${u.name.split(" ")[0]}!`);
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-auth-page d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ background: "linear-gradient(135deg, #b3c2ff 0%, #d8c6ea 100%)" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card ss-auth-card border-0 shadow-lg p-4">
              <div className="text-center mb-4">
                <div style={{ fontSize: "3rem", color: "#764ba2" }}>
                  <i className="bi bi-shield-lock"></i>
                </div>
                <h2 className="fw-bold">Admin Portal</h2>
                <p className="text-muted small">Sign in to your admin account</p>
              </div>

              {/* Demo hint */}
              <div className="ss-demo-box p-3 rounded mb-4" style={{ background: "#f8f9ff", border: "1px solid #e0e7ff" }}>
                <div className="small fw-semibold mb-2 text-muted"><i className="bi bi-info-circle me-1"></i>Demo Admin Account</div>
                <div>
                  <button 
                    className="btn btn-sm w-100" 
                    style={{ background: "#764ba2", color: "white", border: "none" }}
                    onClick={() => setForm({ email: "admin@skillswap.com", password: "admin123" })}
                  >
                    <i className="bi bi-shield me-1"></i>Load Demo Credentials
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input type="email" id="adminLoginEmail" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="admin@example.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type={showPass ? "text" : "password"} id="adminLoginPassword"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="••••••••" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass(!showPass)}>
                      <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                <button type="submit" className="btn w-100 py-2" style={{ background: "#764ba2", color: "white", border: "none" }} disabled={loading} id="adminLoginSubmit">
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</> : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
                </button>
              </form>

              <hr className="my-4" />
              <p className="text-center text-muted small mb-0">
                <a href="/" className="text-primary fw-semibold text-decoration-none">Back to Home</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
