import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MOCK_SKILLS, CATEGORIES, EXPERIENCE_LEVELS, AVAILABILITY, MODES } from "../data/mockData";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", bio: user?.bio || "", location: user?.location || "", phone: user?.phone || "",
  });
  const mySkills = MOCK_SKILLS.filter((s) => s.userId === user?._id);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Left: Profile Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4 ss-profile-card">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img src={user?.profileImage} alt={user?.name} className="rounded-circle ss-profile-avatar" width={100} height={100} />
              <label className="ss-avatar-upload-btn" title="Change Photo">
                <i className="bi bi-camera-fill"></i>
                <input type="file" accept="image/*" className="d-none" />
              </label>
            </div>
            <h4 className="fw-bold mb-0">{user?.name}</h4>
            <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{user?.location || "Location not set"}</p>
            <div className="d-flex align-items-center justify-content-center gap-1 mb-3">
              <StarRating value={user?.rating || 0} />
              <span className="small text-muted">({user?.reviewCount || 0} reviews)</span>
            </div>
            <p className="text-muted small mb-3">{user?.bio || "No bio yet. Click Edit to add one."}</p>
            <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-phone me-1"></i>{user?.phone || "—"}
              </span>
              <span className="badge bg-success bg-opacity-10 text-success">
                <i className="bi bi-envelope me-1"></i>{user?.email}
              </span>
            </div>
            <button className="btn ss-btn-primary w-100" onClick={() => setEditing(true)}>
              <i className="bi bi-pencil me-2"></i>Edit Profile
            </button>
          </div>
        </div>

        {/* Right: Edit + Skills */}
        <div className="col-lg-8">
          {editing && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent fw-bold border-0 pt-3">
                <i className="bi bi-pencil-square me-2 text-primary"></i>Edit Profile
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input type="text" className="form-control" id="editName" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    <input type="tel" className="form-control" id="editPhone" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Location</label>
                    <input type="text" className="form-control" id="editLocation" value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Bio</label>
                    <textarea className="form-control" id="editBio" rows={3} value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn ss-btn-primary" onClick={handleSave} id="saveProfileBtn">Save Changes</button>
                  <button className="btn btn-outline-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* My Skills */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent fw-bold border-0 pt-3 d-flex justify-content-between align-items-center">
              <span><i className="bi bi-mortarboard me-2 text-success"></i>My Skills ({mySkills.length})</span>
              <Link to="/skills/add" className="btn ss-btn-primary btn-sm">
                <i className="bi bi-plus me-1"></i>Add Skill
              </Link>
            </div>
            <div className="card-body">
              {mySkills.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-mortarboard display-4 text-muted d-block mb-3"></i>
                  <p className="text-muted mb-3">You haven't added any skills yet.</p>
                  <Link to="/skills/add" className="btn ss-btn-primary">Add Your First Skill</Link>
                </div>
              ) : (
                <div className="row g-3">
                  {mySkills.map((skill) => (
                    <div key={skill._id} className="col-sm-6">
                      <div className="card border shadow-none h-100 p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0">{skill.title}</h6>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-secondary py-0 px-2">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger py-0 px-2">
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                        <span className="badge bg-primary bg-opacity-10 text-primary mb-2">{skill.category}</span>
                        <p className="text-muted small mb-1">{skill.description.slice(0, 60)}…</p>
                        <div className="d-flex align-items-center gap-1 mt-auto">
                          <StarRating value={skill.rating} size="xs" />
                          <small className="text-muted">({skill.reviewCount})</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
