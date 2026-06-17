import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";
import axios from "axios";

const AdminThirdCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdCategories, setThirdCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [currentThirdCategory, setCurrentThirdCategory] = useState(null);
  const [form, setForm] = useState({ thirdCategoryName: "", description: "", categoryId: "", subCategoryId: "" });
  const [errors, setErrors] = useState({});

  // Dynamic lists in modal
  const [modalSubCategories, setModalSubCategories] = useState([]);

  useEffect(() => {
    getThirdCategories();
    getSubCategories();
    getCategories();
  }, []);

  const getThirdCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/thirdCategory");
      setThirdCategories(response.data?.List ?? []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch third-categories");
    }
  };

  const getSubCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/subCategory");
      setSubCategories(response.data?.List ?? []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch sub-categories");
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/category");
      setCategories(response.data?.List ?? []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    }
  };

  // Sync subcategories in modal whenever category selection changes
  useEffect(() => {
    if (form.categoryId) {
      const filteredSubs = subCategories.filter(
        (sub) => String(sub.categoryId) === String(form.categoryId)
      );
      setModalSubCategories(filteredSubs);
      // Auto-select first subcategory if current selection is not in list
      if (!filteredSubs.find((sub) => String(sub.subCategoryId) === String(form.subCategoryId))) {
        setForm((f) => ({ ...f, subCategoryId: filteredSubs.length > 0 ? filteredSubs[0].subCategoryId : "" }));
      }
    } else {
      setModalSubCategories([]);
      setForm((f) => ({ ...f, subCategoryId: "" }));
    }
  }, [form.categoryId, subCategories]);

  // Helpers
  const getSubCategory = (subId) => {
    return subCategories.find((s) => String(s.subCategoryId) === String(subId)) || { subCategoryName: "Unknown Sub-category", categoryId: "" };
  };

  const getCategory = (catId) => {
    return categories.find((c) => String(c.categoryId) === String(catId)) || { categoryName: "Unknown Category", icon: "bi-folder" };
  };

  // Cascading Filter lists
  const availableFilterSubs = categoryFilter
    ? subCategories.filter((sub) => String(sub.categoryId) === String(categoryFilter))
    : [];

  // Reset sub-category filter if category filter changes
  const handleCategoryFilterChange = (val) => {
    setCategoryFilter(val);
    setSubCategoryFilter("");
  };

  // Filter Table Results
  const filtered = thirdCategories.filter((third) => {
    const parentSub = getSubCategory(third.subCategoryId);
    const parentCat = getCategory(parentSub.categoryId);

    const name = third.thirdCategoryName ?? "";
    const subName = parentSub.subCategoryName ?? "";
    const catName = parentCat.categoryName ?? "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      subName.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase());

    const matchesCatFilter = !categoryFilter || String(parentSub.categoryId) === String(categoryFilter);
    const matchesSubFilter = !subCategoryFilter || String(third.subCategoryId) === String(subCategoryFilter);

    return matchesSearch && matchesCatFilter && matchesSubFilter;
  });

  const activeCount = thirdCategories.filter((t) => t.status === "Active").length;
  const inactiveCount = thirdCategories.length - activeCount;

  const handleOpenAdd = () => {
    const defaultCatId = categories.length > 0 ? categories[0].categoryId : "";
    const firstSubList = subCategories.filter((sub) => String(sub.categoryId) === String(defaultCatId));
    const defaultSubId = firstSubList.length > 0 ? firstSubList[0].subCategoryId : "";

    setCurrentThirdCategory(null);
    setForm({
      thirdCategoryName: "",
      description: "",
      categoryId: defaultCatId,
      subCategoryId: defaultSubId,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (third) => {
    const parentSub = getSubCategory(third.subCategoryId);
    setCurrentThirdCategory(third);
    setForm({
      thirdCategoryName: third.thirdCategoryName,
      description: third.description || "",
      categoryId: parentSub.categoryId,
      subCategoryId: third.subCategoryId,
    });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.thirdCategoryName.trim()) e.thirdCategoryName = "Third-category name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.categoryId) e.categoryId = "Select parent category";
    if (!form.subCategoryId) e.subCategoryId = "Select parent sub-category";
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    const payload = {
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      thirdCategoryName: form.thirdCategoryName,
      description: form.description,
    };

    if (currentThirdCategory) {
      // Edit — PUT /thirdCategory/:id
      try {
        await axios.put(
          `http://localhost:3000/thirdCategory/${currentThirdCategory.thirdCategoryId}`,
          payload
        );
        toast.success("Third-category updated successfully.");
        getThirdCategories();
      } catch (error) {
        console.log(error);
        toast.error("Failed to update third-category.");
      }
    } else {
      // Add — POST /thirdCategory
      try {
        await axios.post("http://localhost:3000/thirdCategory", payload);
        toast.success("Third-category created successfully.");
        getThirdCategories();
      } catch (error) {
        console.log(error);
        toast.error("Failed to create third-category.");
      }
    }
    setShowModal(false);
  };

  const toggleStatus = async (third) => {
    const newStatus = third.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:3000/thirdCategory/${third.thirdCategoryId}`, {
        categoryId: third.categoryId,
        subCategoryId: third.subCategoryId,
        thirdCategoryName: third.thirdCategoryName,
        status: newStatus,
      });
      toast.info(`Third-category status set to ${newStatus}`);
      getThirdCategories();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this third-level category?")) {
      try {
        await axios.delete(`http://localhost:3000/thirdCategory/${id}`);
        toast.success("Third-category deleted.");
        getThirdCategories();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete third-category.");
      }
    }
  };

  return (
    <div className="d-flex ss-admin-layout">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-0">Manage Third-categories</h3>
            <p className="text-muted mb-0">Define specific, granular skills to be listed on the platform</p>
          </div>
          <button className="btn ss-btn-primary px-4 py-2" onClick={handleOpenAdd}>
            <i className="bi bi-plus-circle me-2"></i>Add Third-category
          </button>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-primary">
              <div className="d-flex align-items-center gap-2 text-primary mb-1">
                <i className="bi bi-folder2-open"></i>
                <small className="fw-semibold">Total Third Categories</small>
              </div>
              <div className="display-6 fw-bold">{thirdCategories.length}</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-success">
              <div className="d-flex align-items-center gap-2 text-success mb-1">
                <i className="bi bi-check-circle-fill"></i>
                <small className="fw-semibold">Active Third Categories</small>
              </div>
              <div className="display-6 fw-bold text-success">{activeCount}</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card border-0 shadow-sm p-3 border-top border-3 border-secondary">
              <div className="d-flex align-items-center gap-2 text-secondary mb-1">
                <i className="bi bi-slash-circle-fill"></i>
                <small className="fw-semibold">Inactive Third Categories</small>
              </div>
              <div className="display-6 fw-bold text-secondary">{inactiveCount}</div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search third-categories..."
              id="adminThirdCategorySearch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select text-muted"
            style={{ maxWidth: 180 }}
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>

          <select
            className="form-select text-muted"
            style={{ maxWidth: 180 }}
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
            disabled={!categoryFilter}
          >
            <option value="">All Sub-categories</option>
            {availableFilterSubs.map((sub) => (
              <option key={sub.subCategoryId} value={sub.subCategoryId}>{sub.subCategoryName}</option>
            ))}
          </select>
        </div>

        {/* Table View */}
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="ss-admin-table-head">
                <tr>
                  <th>Third Category</th>
                  <th>Description</th>
                  <th>Sub-category</th>
                  <th>Main Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((third) => {
                  const parentSub = getSubCategory(third.subCategoryId);
                  const parentCat = getCategory(parentSub.categoryId);
                  return (
                    <tr key={third.thirdCategoryId}>
                      <td>
                        <div>
                          <div className="fw-bold">{third.thirdCategoryName}</div>
                          <small className="text-muted text-uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>ID: {third.thirdCategoryId}</small>
                        </div>
                      </td>
                      <td style={{ maxWidth: 220 }}>
                        <p className="text-muted small mb-0" title={third.description} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {third.description || <span className="text-muted fst-italic">No description</span>}
                        </p>
                      </td>
                      <td>
                        <span className="small fw-semibold text-dark">{parentSub.subCategoryName}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 small text-muted">
                          <i className={`bi ${parentCat.icon || "bi-folder"}`}></i>
                          <span>{parentCat.categoryName}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm border-0 bg-transparent p-0"
                          onClick={() => toggleStatus(third)}
                          title="Click to toggle status"
                        >
                          <span className={`badge ${third.status === "Active" ? "bg-success text-white" : "bg-danger text-white"}`}>
                            {third.status || "Active"}
                          </span>
                        </button>
                      </td>
                      <td className="small text-muted">
                        {third.createdAt ? new Date(third.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenEdit(third)}
                            title="Edit Third Category"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(third.thirdCategoryId)}
                            title="Delete Third Category"
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
                      <i className="bi bi-folder2-open display-4 d-block mb-3"></i>
                      No third-categories found.
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
                <h5 className="modal-title fw-bold">{currentThirdCategory ? "Edit Third-category" : "Add New Third-category"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body py-4">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Third-category Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.thirdCategoryName ? "is-invalid" : ""}`}
                      placeholder="e.g. Frontend Development, Acoustic Guitar..."
                      value={form.thirdCategoryName}
                      onChange={(e) => setForm({ ...form, thirdCategoryName: e.target.value })}
                    />
                    {errors.thirdCategoryName && <div className="invalid-feedback">{errors.thirdCategoryName}</div>}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description <span className="text-danger">*</span></label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      rows="3"
                      placeholder="Describe what skills fall under this third-category..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>

                  {/* Parent Category Selection */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Main Category <span className="text-danger">*</span></label>
                    <select
                      className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    >
                      <option value="">Choose main category...</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                      ))}
                    </select>
                    {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                  </div>

                  {/* Parent Subcategory Selection (Cascading!) */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Sub-category <span className="text-danger">*</span></label>
                    <select
                      className={`form-select ${errors.subCategoryId ? "is-invalid" : ""}`}
                      value={form.subCategoryId}
                      onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}
                      disabled={!form.categoryId}
                    >
                      <option value="">
                        {!form.categoryId ? "Choose main category first..." : "Choose sub-category..."}
                      </option>
                      {modalSubCategories.map((sub) => (
                        <option key={sub.subCategoryId} value={sub.subCategoryId}>{sub.subCategoryName}</option>
                      ))}
                    </select>
                    {errors.subCategoryId && <div className="invalid-feedback">{errors.subCategoryId}</div>}
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn ss-btn-primary px-4">
                    {currentThirdCategory ? "Save Changes" : "Create Third-category"}
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

export default AdminThirdCategories;
