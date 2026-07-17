import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setLoading(true);
    try {
      const userData   = {
        Email: form.email,
        Password: form.password,
      };

      console.log("Sending: ", userData);

      const response = await axios.post(
        "http://localhost:3000/users/login",
        userData
      );

      console.log(response.data);

      const loginUser = response.data.User;

      if (!loginUser) {
        console.error("No user data in response:", response.data);
        toast.error("Invalid login response from server");
        return;
      }

      login(loginUser, response.data.Token);
      toast.success(`Welcome back, ${loginUser.name || loginUser.email}`);
      navigate("/dashboard", { replace: true });
    }
    catch (err) {
      console.log(err.response?.data || err);
      toast.error(err.response?.error || "Login failed.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-auth-page d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card ss-auth-card border-0 shadow-lg p-4">
              <div className="text-center mb-4">
                <div className="ss-auth-logo mb-3"><i className="bi bi-arrow-left-right"></i></div>
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted small">Sign in to your SkillSwap account</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input type="email" id="loginEmail" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="you@example.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type={showPass ? "text" : "password"} id="loginPassword"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="••••••••" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass(!showPass)}>
                      <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                <button type="submit" className="btn ss-btn-primary w-100 py-2" disabled={loading} id="loginSubmit">
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</> : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
                </button>
              </form>

              
              {/* Demo hint */}
              <div className="ss-demo-box p-3 mt-4 rounded mb-2">
                <div className="small fw-semibold mb-2 text-muted"><i className="bi bi-info-circle me-1"></i>Demo Accounts</div>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setForm({ email: "aryan@example.com", password: "password" })}>
                    <i className="bi bi-person me-1"></i>User
                  </button>
                  {/* <button className="btn btn-sm btn-outline-warning" onClick={() => setForm({ email: "admin@skillswap.com", password: "admin123" })}>
                    <i className="bi bi-shield me-1"></i>Admin
                  </button> */}
                </div>
              </div>

              <hr className="my-4" />
              <p className="text-center text-muted small mb-3">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary fw-semibold text-decoration-none">Register now</Link>
              </p>
              <p className="text-center text-muted small mb-0">
                Admin?{" "}
                <Link to="/admin/login" className="text-warning fw-semibold text-decoration-none">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
