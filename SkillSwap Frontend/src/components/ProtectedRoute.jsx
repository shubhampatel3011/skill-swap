import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* Full-screen spinner shown while localStorage auth is being hydrated */
const AuthLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        border: "4px solid rgba(99,102,241,0.3)",
        borderTop: "4px solid #6366f1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <AuthLoader />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  if (admin.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};
