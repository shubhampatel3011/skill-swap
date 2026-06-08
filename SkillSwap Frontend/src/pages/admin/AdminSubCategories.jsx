import { useState, useEffect } from "react";
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES, MOCK_THIRDCATEGORIES } from "../../data/mockData";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";

const AdminSubCategories = () => {
  const [categories] = useState(() => {
    const saved = localStorage.getItem("admin_categories");
    return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
  });

  const [subCategories, setSubCategories] = useState(() => {
    const saved = localStorage.getItem("admin_subcategories");
    return saved ? JSON.parse(saved) : MOCK_SUBCATEGORIES;
  });

  const [thirdCategories] = useState(() => {
    const saved = localStorage.getItem("admin_thirdcategories");
    return saved ? JSON.parse(saved) : MOCK_THIRDCATEGORIES;
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [form, setForm] = useState({ name: "", categoryId: "", description: "", status: "Active" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("admin_subcategories", JSON.stringify(subCategories));
  }, [subCategories]);

  // Find Category helper
  const getCategory = (catId) => {
    return categories.find((c) => c._id === catId) || { name: "Unknown Category", icon: "bi-folder" };
  };

  // Filter logic
  const filtered = subCategories.filter((sub) => {
    const parentCat = getCategory(sub.categoryId);
    const matchesSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.description.toLowerCase().includes(search.toLowerCase()) ||
      parentCat.name.toLowerCase().includes(search.toLowerCase());

    const matchesCatFilter = !categoryFilter || sub.categoryId === categoryFilter;

    return matchesSearch && matchesCatFilter;
  });

  const activeCount = subCategories.filter((s) => s.status === "Active").length;
  const inactiveCount = subCategories.length - activeCount;

  const handleOpenAdd = () => {
    const defaultCatId = categories.length > 0 ? categories[0]._id : "";
    setCurrentSubCategory(null);
    setForm({ name: "", categoryId: defaultCatId, description: "", status: "Active" });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (subCat) => {
    setCurrentSubCategory(subCat);
    setForm({
      name: subCat.name,
      categoryId: subCat.categoryId,
      description: subCat.description,
      status: subCat.status || "Active"
    });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Sub-category name is required";
    if (!form.categoryId) e.categoryId = "Select a parent category";
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

    if (currentSubCategory) {
      // Edit
      setSubCategories((prev) =>
        prev.map((sub) =>
          sub._id === currentSubCategory._id
            ? { ...sub, name: form.name, categoryId: form.categoryId, description: form.description, status: form.status }
            : sub
        )
      );
      toast.success("Sub-category updated successfully.");
    } else {
      // Add
      const newSub = {
        _id: "sub_" + Date.now(),
        name: form.name,
        categoryId: form.categoryId,
        description: form.description,
        status: form.status,
        createdAt: new Date().toISOString()
      };
      setSubCategories((prev) => [...prev, newSub]);
      toast.success("Sub-category created successfully.");
    }
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setSubCategories((prev) =>
      prev.map((sub) => {
        if (sub._id === id) {
          const newStatus = sub.status === "Active" ? "Inactive" : "Active";
          toast.info(`Sub-category status set to ${newStatus}`);
          return { ...sub, status: newStatus };
        }
        return sub;
      })
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sub-category? Third categories under it will remain but lose their active parent structure.")) {
      setSubCategories((prev) => prev.filter((sub) => sub._id !== id));
      toast.success("Sub-category deleted.");
    }
  };

  // Helper to count third categories
  const getThirdcategoryCount = (subId) => {
    return thirdCategories.filter((third) => third.subCategoryId === subId).length;
  };

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-0">Manage Sub-categories</h3>
            <p className="text-muted mb-0">Organize skills within top-level categories</p>
          </div>
          <button className="btn ss-btn-primary px-4 py-2" onClick={handleOpenAdd}>
            <i className="bi bi-plus-circle me-2"></i>Add Sub-category
          </button>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-primary">
              <div className="d-flex align-items-center gap-2 text-primary mb-1">
                <i className="bi bi-folder-symlink-fill"></i>
                <small className="fw-semibold">Total Sub-categories</small>
              </div>
              <div className="display-6 fw-bold">{subCategories.length}</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-success">
              <div className="d-flex align-items-center gap-2 text-success mb-1">
                <i className="bi bi-check-circle-fill"></i>
                <small className="fw-semibold">Active Sub-categories</small>
              </div>
              <div className="display-6 fw-bold text-success">{activeCount}</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-secondary">
              <div className="d-flex align-items-center gap-2 text-secondary mb-1">
                <i className="bi bi-slash-circle-fill"></i>
                <small className="fw-semibold">Inactive Sub-categories</small>
              </div>
              <div className="display-6 fw-bold text-secondary">{inactiveCount}</div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search sub-categories..."
              id="adminSubCategorySearch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select text-muted"
            style={{ maxWidth: 200 }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Table View */}
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="ss-admin-table-head">
                <tr>
                  <th>Sub-category</th>
                  <th>Parent Category</th>
                  <th>Description</th>
                  <th>Third-Level Items</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const parentCat = getCategory(sub.categoryId);
                  return (
                    <tr key={sub._id}>
                      <td>
                        <div>
                          <div className="fw-bold">{sub.name}</div>
                          <small className="text-muted text-uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>ID: {sub._id}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi ${parentCat.icon} text-muted`}></i>
                          <span className="small fw-semibold">{parentCat.name}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: 250 }}>
                        <p className="text-muted small mb-0 text-truncate" title={sub.description}>
                          {sub.description}
                        </p>
                      </td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-2.5 py-1.5 fw-semibold border border-secondary border-opacity-20">
                          {getThirdcategoryCount(sub._id)} Third Categories
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm border-0 bg-transparent p-0"
                          onClick={() => toggleStatus(sub._id)}
                          title="Click to toggle status"
                        >
                          <span className={`badge ${sub.status === "Active" ? "bg-success text-white" : "bg-danger text-white"}`}>
                            {sub.status || "Active"}
                          </span>
                        </button>
                      </td>
                      <td className="small text-muted">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenEdit(sub)}
                            title="Edit Sub-category"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(sub._id)}
                            title="Delete Sub-category"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-folder-symlink display-4 d-block mb-3"></i>
                      No sub-categories found.
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
                <h5 className="modal-title fw-bold">{currentSubCategory ? "Edit Sub-category" : "Add New Sub-category"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body py-4">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Sub-category Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="e.g. Web Development, Portrait Photography..."
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Parent Category selection */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Parent Category <span className="text-danger">*</span></label>
                    <select
                      className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    >
                      <option value="">Choose a parent category...</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description <span className="text-danger">*</span></label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      rows="3"
                      placeholder="Describe what specific skills fall under this sub-category..."
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
                    {currentSubCategory ? "Save Changes" : "Create Sub-category"}
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

export default AdminSubCategories;
