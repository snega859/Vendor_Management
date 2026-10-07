import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const SECTIONS = [
  {
    title: "Vendor Management",
    text: "Register new vendors and manage existing ones.",
    color: "#3347ff",
    icon: <path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M9 20v-6h6v6M3 9h18" />,
    actions: [
      { label: "Register Vendor", to: "/vendors" },
      { label: "Manage Vendors", to: "/vendor-list" },
    ],
  },
  {
    title: "Supplier Management",
    text: "Keep your supplier details up to date.",
    color: "#0e9f8e",
    icon: (
      <>
        <path d="M2 6h11v10H2zM13 10h5l3 3v3h-8" />
        <circle cx="6.5" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </>
    ),
    actions: [{ label: "Manage Suppliers", to: "/suppliers" }],
  },
  {
    title: "Product Management",
    text: "Maintain your product catalogue.",
    color: "#e08a00",
    icon: <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9zM3 7.5l9 4.5 9-4.5M12 12v9" />,
    actions: [{ label: "Manage Products", to: "/products" }],
  },
  {
    title: "Purchase Management",
    text: "Handle quotations and purchase orders.",
    color: "#7c4dff",
    icon: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />,
    actions: [
      { label: "Quotations", to: "/quotations" },
      { label: "Purchase Orders", to: "/purchase-orders" },
    ],
  },
  {
    title: "Reports",
    text: "Review reports on your operations.",
    color: "#e5484d",
    icon: <path d="M4 20V11M10 20V4M16 20v-6M22 20H2" />,
    actions: [{ label: "View Reports", to: "/reports" }],
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="ad-page">
      <header className="ad-bar">
        <div className="ad-brand">
          {BRAND_NAME}
          <span className="ad-chip">Admin</span>
        </div>
        <button className="ad-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="ad-hero">
        <h1>Welcome, Admin</h1>
        <p>Choose what you want to manage.</p>
      </section>

      <main className="ad-grid">
        {SECTIONS.map((s) => (
          <section className="ad-card" key={s.title} style={{ "--c": s.color }}>
            <div className="ad-card-head">
              <span className="ad-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">{s.icon}</svg>
              </span>
              <h2>{s.title}</h2>
            </div>
            <p>{s.text}</p>
            <div className="ad-actions">
              {s.actions.map((a) => (
                <button
                  key={a.to}
                  className="ad-action"
                  onClick={() => navigate(a.to)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default AdminDashboard;