import { useState, useEffect } from "react";
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from "../../data/mockData";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("admin_categories");
    return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
  });

  const [subCategories] = useState(() => {
    const saved = localStorage.getItem("admin_subcategories");
    return saved ? JSON.parse(saved) : MOCK_SUBCATEGORIES;
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // null for add, object for edit
  const [form, setForm] = useState({ name: "", icon: "bi-cpu", description: "", status: "Active" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("admin_categories", JSON.stringify(categories));
  }, [categories]);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = categories.filter((c) => c.status === "Active").length;
  const inactiveCount = categories.length - activeCount;

  // Icon suggestions
  const iconSuggestions = [
    "bi-cpu", "bi-palette", "bi-music-note-beamed", "bi-translate",
    "bi-heart-pulse", "bi-briefcase", "bi-mortarboard", "bi-egg-fried",
    "bi-dribbble", "bi-three-dots", "bi-code-slash", "bi-camera-reels",
    "bi-joystick", "bi-book", "bi-tools", "bi-graph-up-arrow"
  ];

  const handleOpenAdd = () => {
    setCurrentCategory(null);
    setForm({ name: "", icon: "bi-cpu", description: "", status: "Active" });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (category) => {
    setCurrentCategory(category);
    setForm({
      name: category.name,
      icon: category.icon || "bi-cpu",
      description: category.description,
      status: category.status || "Active"
    });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    if (currentCategory) {
      // Edit
      setCategories((prev) =>
        prev.map((c) =>
          c._id === currentCategory._id
            ? { ...c, name: form.name, icon: form.icon, description: form.description, status: form.status }
            : c
        )
      );
      toast.success("Category updated successfully.");
    } else {
      // Add
      const newCategory = {
        _id: "cat_" + Date.now(),
        name: form.name,
        icon: form.icon,
        description: form.description,
        status: form.status,
        createdAt: new Date().toISOString()
      };
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Category created successfully.");
    }
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c._id === id) {
          const newStatus = c.status === "Active" ? "Inactive" : "Active";
          toast.info(`Category status set to ${newStatus}`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category? Subcategories under it will remain but lose their active parent status.")) {
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted.");
    }
  };

  // Helper to count subcategories
  const getSubcategoryCount = (categoryId) => {
    return subCategories.filter((sub) => sub.categoryId === categoryId).length;
  };

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-0">Manage Categories</h3>
            <p className="text-muted mb-0">Create and organize top-level skill fields</p>
          </div>
          <button className="btn ss-btn-primary px-4 py-2" onClick={handleOpenAdd}>
            <i className="bi bi-plus-circle me-2"></i>Add Category
          </button>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-primary">
              <div className="d-flex align-items-center gap-2 text-primary mb-1">
                <i className="bi bi-folder-fill"></i>
                <small className="fw-semibold">Total Categories</small>
              </div>
              <div className="display-6 fw-bold">{categories.length}</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-success">
              <div className="d-flex align-items-center gap-2 text-success mb-1">
                <i className="bi bi-check-circle-fill"></i>
                <small className="fw-semibold">Active Categories</small>
              </div>
              <div className="display-6 fw-bold text-success">{activeCount}</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-secondary">
              <div className="d-flex align-items-center gap-2 text-secondary mb-1">
                <i className="bi bi-slash-circle-fill"></i>
                <small className="fw-semibold">Inactive Categories</small>
              </div>
              <div className="display-6 fw-bold text-secondary">{inactiveCount}</div>
            </div>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 350 }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search categories..."
              id="adminCategorySearch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table View */}
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="ss-admin-table-head">
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Subcategories</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-inline-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
                          <i className={`bi ${cat.icon || "bi-folder"} fs-5`}></i>
                        </div>
                        <div>
                          <div className="fw-bold">{cat.name}</div>
                          <small className="text-muted text-uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>ID: {cat._id}</small>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      <p className="text-muted small mb-0 text-truncate" title={cat.description}>
                        {cat.description}
                      </p>
                    </td>
                    <td>
                      <span className="badge bg-info bg-opacity-10 text-info px-2.5 py-1.5 fw-semibold border border-info border-opacity-20">
                        {getSubcategoryCount(cat._id)} Sub-categories
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm border-0 bg-transparent p-0`}
                        onClick={() => toggleStatus(cat._id)}
                        title="Click to toggle status"
                      >
                        <span className={`badge ${cat.status === "Active" ? "bg-success text-white" : "bg-danger text-white"}`}>
                          {cat.status || "Active"}
                        </span>
                      </button>
                    </td>
                    <td className="small text-muted">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit Category"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cat._id)}
                          title="Delete Category"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-folder2-open display-4 d-block mb-3"></i>
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{currentCategory ? "Edit Category" : "Add New Category"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body py-4">
                  {/* Category Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Category Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="e.g. Design, Development..."
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Icon selection */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small d-block">Icon <span className="text-danger">*</span></label>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-inline-flex justify-content-center align-items-center" style={{ width: 44, height: 44 }}>
                        <i className={`bi ${form.icon} fs-4`}></i>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        placeholder="e.g. bi-cpu"
                      />
                    </div>
                    <div className="p-2 border rounded bg-light" style={{ maxHeight: "75px", overflowY: "auto" }}>
                      <div className="d-flex flex-wrap gap-2">
                        {iconSuggestions.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            className={`btn btn-sm p-1 d-inline-flex align-items-center justify-content-center rounded ${form.icon === icon ? "btn-primary" : "btn-outline-secondary"}`}
                            style={{ width: 28, height: 28 }}
                            onClick={() => setForm({ ...form, icon })}
                            title={icon}
                          >
                            <i className={`bi ${icon}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description <span className="text-danger">*</span></label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      rows="3"
                      placeholder="Describe what skills fall under this category..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Status</label>
                    <select
                      className="form-select"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn ss-btn-primary px-4">
                    {currentCategory ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
