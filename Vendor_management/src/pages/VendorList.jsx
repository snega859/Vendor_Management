import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VendorList.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const EDIT_FIELDS = [
  { name: "vendorName", label: "Vendor name" },
  { name: "companyName", label: "Company name" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "address", label: "Address", wide: true },
  { name: "username", label: "Username" },
];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const VendorList = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [editVendor, setEditVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // { type: "ok" | "err", text }

  useEffect(() => {
    getVendors();
  }, []);

  // Close the edit dialog with Escape
  useEffect(() => {
    if (!editVendor) return;
    const onKey = (e) => e.key === "Escape" && setEditVendor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editVendor]);

  const getVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/vendors");
      setVendors(response.data);
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Unable to load vendors." });
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this vendor?");

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/vendors/${id}`);
      setStatus({ type: "ok", text: "Vendor deleted." });
      getVendors();
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Delete failed." });
    }
  };

  const updateVendor = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8080/api/vendors/${editVendor.id}`,
        editVendor
      );
      setStatus({ type: "ok", text: "Vendor updated." });
      setEditVendor(null);
      getVendors();
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Update failed." });
    }
  };

  return (
    <div className="vl-page">
      <header className="vl-bar">
        <div className="vl-brand">{BRAND_NAME}</div>
        <button className="vl-btn" onClick={() => navigate("/admin")}>
          Back to Admin
        </button>
      </header>

      <main className="vl-main">
        <div className="vl-head">
          <div>
            <h1>Vendor Management</h1>
            <p>
              {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"}
            </p>
          </div>
          <button
            className="vl-btn primary"
            onClick={() => navigate("/vendors")}
          >
            Register Vendor
          </button>
        </div>

        {status && (
          <p className={`vl-status ${status.type}`} role="status">
            {status.text}
          </p>
        )}

        {loading ? (
          <p>Loading vendors…</p>
        ) : vendors.length === 0 ? (
          <div className="vl-empty">
            <p>No vendors found. Register your first vendor to get started.</p>
            <button
              className="vl-btn primary"
              onClick={() => navigate("/vendors")}
            >
              Register Vendor
            </button>
          </div>
        ) : (
          <div className="vl-grid">
            {vendors.map((vendor) => {
              const inactive = vendor.status === "INACTIVE";
              return (
                <article
                  key={vendor.id}
                  className={`vl-card ${inactive ? "inactive" : ""}`}
                >
                  <div className="vl-card-head">
                    <span className="vl-avatar" aria-hidden="true">
                      {initials(vendor.vendorName)}
                    </span>
                    <div className="vl-title">
                      <h2>{vendor.vendorName}</h2>
                      <span>{vendor.companyName}</span>
                    </div>
                    <span className={`vl-pill ${inactive ? "off" : ""}`}>
                      {vendor.status}
                    </span>
                  </div>

                  <dl className="vl-details">
                    <dt>Email</dt>
                    <dd>{vendor.email}</dd>
                    <dt>Phone</dt>
                    <dd>{vendor.phone}</dd>
                    <dt>Address</dt>
                    <dd>{vendor.address}</dd>
                    <dt>Username</dt>
                    <dd>{vendor.username}</dd>
                  </dl>

                  <div className="vl-actions">
                    <button
                      className="vl-btn"
                      onClick={() => setEditVendor(vendor)}
                    >
                      Update
                    </button>
                    <button
                      className="vl-btn danger"
                      onClick={() => deleteVendor(vendor.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {editVendor && (
        <div
          className="vl-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setEditVendor(null)}
        >
          <div
            className="vl-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vl-edit-title"
          >
            <h2 id="vl-edit-title">Update Vendor</h2>

            <form onSubmit={updateVendor}>
              <div className="vl-fields">
                {EDIT_FIELDS.map((f) => (
                  <div
                    key={f.name}
                    className={`vl-field ${f.wide ? "vl-wide" : ""}`}
                  >
                    <label htmlFor={`edit-${f.name}`}>{f.label}</label>
                    <input
                      id={`edit-${f.name}`}
                      type={f.type || "text"}
                      value={editVendor[f.name] ?? ""}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, [f.name]: e.target.value })
                      }
                    />
                  </div>
                ))}

                <div className="vl-field">
                  <label htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    value={editVendor.status}
                    onChange={(e) =>
                      setEditVendor({ ...editVendor, status: e.target.value })
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="vl-dialog-actions">
                <button
                  type="button"
                  className="vl-btn"
                  onClick={() => setEditVendor(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="vl-btn primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;