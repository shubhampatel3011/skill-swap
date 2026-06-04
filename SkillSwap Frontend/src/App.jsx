import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { NotifProvider } from "./context/NotifContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import SkillsPage from "./pages/SkillsPage";
import AddSkillPage from "./pages/AddSkillPage";
import SwapRequestsPage from "./pages/SwapRequestsPage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import ReviewsPage from "./pages/ReviewsPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminSwaps from "./pages/admin/AdminSwaps";

const AdminLayout = ({ children }) => (
  <AdminRoute>{children}</AdminRoute>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotifProvider>
          <div className="d-flex flex-column min-vh-100">
            <Routes>
              {/* ── Admin Routes (no Navbar/Footer) ── */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
              <Route path="/admin/skills" element={<AdminLayout><AdminSkills /></AdminLayout>} />
              <Route path="/admin/swaps" element={<AdminLayout><AdminSwaps /></AdminLayout>} />

              {/* ── Public & User Routes ── */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="flex-grow-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/skills" element={<SkillsPage />} />
                      <Route path="/users/:id" element={<UserProfilePage />} />

                      {/* Protected Routes */}
                      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/skills/add" element={<ProtectedRoute><AddSkillPage /></ProtectedRoute>} />
                      <Route path="/swaps" element={<ProtectedRoute><SwapRequestsPage /></ProtectedRoute>} />
                      <Route path="/chat/:swapId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                      <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />

                      {/* 404 */}
                      <Route path="*" element={
                        <div className="container py-5 text-center">
                          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
                          <h2 className="mt-3 fw-bold">404 – Page Not Found</h2>
                          <p className="text-muted">The page you're looking for doesn't exist.</p>
                          <a href="/" className="btn ss-btn-primary mt-2">Go Home</a>
                        </div>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </NotifProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
