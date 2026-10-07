import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Suppliers.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const EMPTY_SUPPLIER = {
  supplierName: "",
  companyName: "",
  email: "",
  phone: "",
  address: "",
};

const FIELDS = [
  { name: "supplierName", label: "Supplier name", autoComplete: "off" },
  { name: "companyName", label: "Company name", autoComplete: "off" },
  { name: "email", label: "Email", type: "email", autoComplete: "off" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "off" },
  { name: "address", label: "Address", autoComplete: "off" },
];

// Card colours, cycled by position in the list
const COLORS = ["#0e9f8e", "#3347ff", "#7c4dff", "#e08a00", "#e5484d"];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
);

const Suppliers = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState(EMPTY_SUPPLIER);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null); // { type: "ok" | "err", text }

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Unable to load suppliers." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };

  const saveSupplier = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      if (editId) {
        await axios.put(
          `http://localhost:8080/api/suppliers/${editId}`,
          supplier
        );
        setStatus({ type: "ok", text: "Supplier updated." });
      } else {
        await axios.post("http://localhost:8080/api/suppliers", supplier);
        setStatus({ type: "ok", text: "Supplier added." });
      }

      setSupplier(EMPTY_SUPPLIER);
      setEditId(null);
      getSuppliers();
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Operation failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
      setStatus({ type: "ok", text: "Supplier deleted." });
      if (id === editId) cancelEdit();
      getSuppliers();
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Delete failed." });
    }
  };

  const editSupplier = (item) => {
    setEditId(item.id);
    setSupplier({
      supplierName: item.supplierName,
      companyName: item.companyName,
      email: item.email,
      phone: item.phone,
      address: item.address,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setSupplier(EMPTY_SUPPLIER);
  };

  const q = search.trim().toLowerCase();
  const visible = suppliers.filter((s) =>
    `${s.supplierName} ${s.companyName}`.toLowerCase().includes(q)
  );

  return (
    <div className="sp-page">
      <header className="sp-bar">
        <div className="sp-brand">{BRAND_NAME}</div>
        <button className="sp-btn" onClick={() => navigate("/admin")}>
          Back to Admin
        </button>
      </header>

      <main className="sp-main">
        <div className="sp-head">
          <h1>Supplier Management</h1>
          <p>
            {suppliers.length}{" "}
            {suppliers.length === 1 ? "supplier" : "suppliers"}
          </p>
        </div>

        {status && (
          <p className={`sp-status ${status.type}`} role="status">
            {status.text}
          </p>
        )}

        <div className="sp-layout">
          {/* SUPPLIER FORM */}
          <form
            className={`sp-form ${editId ? "editing" : ""}`}
            onSubmit={saveSupplier}
          >
            <h2>{editId ? "Update supplier" : "Add a supplier"}</h2>

            {FIELDS.map((f) => (
              <div className="sp-field" key={f.name}>
                <label htmlFor={f.name}>{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type || "text"}
                  autoComplete={f.autoComplete}
                  value={supplier[f.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div className="sp-form-actions">
              <button className="sp-btn primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editId ? "Update Supplier" : "Add Supplier"}
              </button>
              {editId && (
                <button className="sp-btn" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* SUPPLIER LIST */}
          <section aria-label="Supplier list">
            {suppliers.length > 0 && (
              <input
                className="sp-search"
                type="search"
                placeholder="Search by supplier or company"
                aria-label="Search suppliers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}

            {loading ? (
              <p>Loading suppliers…</p>
            ) : suppliers.length === 0 ? (
              <div className="sp-empty">
                No suppliers yet. Add your first supplier using the form.
              </div>
            ) : visible.length === 0 ? (
              <div className="sp-empty">No suppliers match your search.</div>
            ) : (
              <div className="sp-grid">
                {visible.map((item, i) => (
                  <article
                    key={item.id}
                    className={`sp-card ${item.id === editId ? "selected" : ""}`}
                    style={{ "--c": COLORS[i % COLORS.length] }}
                  >
                    <div className="sp-card-head">
                      <span className="sp-avatar" aria-hidden="true">
                        {initials(item.supplierName)}
                      </span>
                      <div className="sp-title">
                        <h3>{item.supplierName}</h3>
                        <span>{item.companyName}</span>
                      </div>
                    </div>

                    <ul className="sp-contact">
                      <li>
                        <Icon>
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 7l9 6 9-6" />
                        </Icon>
                        <a href={`mailto:${item.email}`}>{item.email}</a>
                      </li>
                      <li>
                        <Icon>
                          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                        </Icon>
                        <a href={`tel:${item.phone}`}>{item.phone}</a>
                      </li>
                      <li>
                        <Icon>
                          <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </Icon>
                        <span>{item.address}</span>
                      </li>
                    </ul>

                    <div className="sp-actions">
                      <button className="sp-btn" onClick={() => editSupplier(item)}>
                        Update
                      </button>
                      <button
                        className="sp-btn danger"
                        onClick={() => deleteSupplier(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Suppliers;