import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PurchaseRequests.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const rupees = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "REJECTED", label: "Rejected" },
];

// Works out the three progress steps for one request
const getSteps = (product) => {
  const req = product.requestStatus;
  const quoted = product.quotationStatus === "CONFIRMED";

  const placed = { title: "Request placed", note: "Sent", state: "done" };

  if (req === "REJECTED") {
    return [
      placed,
      { title: "Admin review", note: "Rejected", state: "bad" },
      { title: "Quotation", note: "Not needed", state: "todo" },
    ];
  }

  if (req === "CONFIRMED") {
    return [
      placed,
      { title: "Admin review", note: "Confirmed", state: "done" },
      quoted
        ? { title: "Quotation", note: "Confirmed", state: "done" }
        : { title: "Quotation", note: "In progress", state: "active" },
    ];
  }

  return [
    placed,
    { title: "Admin review", note: "Waiting for admin", state: "active" },
    { title: "Quotation", note: "After review", state: "todo" },
  ];
};

const toneOf = (status) =>
  status === "CONFIRMED" ? "ok" : status === "REJECTED" ? "bad" : "";

const PurchaseRequests = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ALL");

  const username = localStorage.getItem("username");

  // =========================================
  // GET PRODUCTS
  // =========================================
  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.log("GET PRODUCTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // =========================================
  // AUTO REFRESH EVERY 5 SECONDS
  // =========================================
  useEffect(() => {
    const interval = setInterval(() => {
      getProducts();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [getProducts]);

  // =========================================
  // REFRESH WHEN PAGE GETS FOCUS
  // =========================================
  useEffect(() => {
    const handleFocus = () => {
      getProducts();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [getProducts]);

  // =========================================
  // MY REQUESTS
  // =========================================
  const myRequests = products.filter(
    (product) =>
      product.requestedBy === username && product.requestStatus !== "NONE"
  );

  const countOf = (key) =>
    key === "ALL"
      ? myRequests.length
      : myRequests.filter((p) => p.requestStatus === key).length;

  const shown =
    tab === "ALL"
      ? myRequests
      : myRequests.filter((p) => p.requestStatus === tab);

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="pr-page">
        <main className="pr-main">
          <h2>Loading requests…</h2>
        </main>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================
  return (
    <div className="pr-page">
      <header className="pr-bar">
        <div className="pr-brand">{BRAND_NAME}</div>
        <div className="pr-user">
          <span className="pr-avatar" aria-hidden="true">
            {(username || "U").charAt(0).toUpperCase()}
          </span>
          <button className="pr-btn" onClick={() => navigate("/vendor")}>
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="pr-main">
        <h1>My Purchase Requests</h1>
        <p className="pr-live">
          <span className="pr-dot" aria-hidden="true" />
          Signed in as <b>{username || "User"}</b>. Updates automatically every
          5 seconds.
        </p>

        <div className="pr-stats">
          <div className="pr-stat total">
            <span>Total</span>
            <strong>{countOf("ALL")}</strong>
          </div>
          <div className="pr-stat pending">
            <span>Pending</span>
            <strong>{countOf("PENDING")}</strong>
          </div>
          <div className="pr-stat ok">
            <span>Confirmed</span>
            <strong>{countOf("CONFIRMED")}</strong>
          </div>
          <div className="pr-stat bad">
            <span>Rejected</span>
            <strong>{countOf("REJECTED")}</strong>
          </div>
        </div>

        {myRequests.length > 0 && (
          <div className="pr-tabs" role="group" aria-label="Filter requests">
            {TABS.map((t) => (
              <button
                key={t.key}
                className="pr-tab"
                aria-pressed={tab === t.key}
                onClick={() => setTab(t.key)}
              >
                {t.label} ({countOf(t.key)})
              </button>
            ))}
          </div>
        )}

        {myRequests.length === 0 ? (
          <div className="pr-empty">You have no purchase requests.</div>
        ) : shown.length === 0 ? (
          <div className="pr-empty">No requests in this group.</div>
        ) : (
          <div className="pr-list">
            {shown.map((product) => {
              const tone = toneOf(product.requestStatus);
              const steps = getSteps(product);

              return (
                <article className={`pr-card ${tone}`} key={product.id}>
                  <div className="pr-card-head">
                    <div>
                      <h2>{product.productName}</h2>
                      <span className="pr-id">Request ID: {product.id}</span>
                    </div>
                    <span className={`pr-pill ${tone}`}>
                      {product.requestStatus}
                    </span>
                  </div>

                  <div className="pr-facts">
                    <div>
                      <span>Requested</span>
                      <strong>{product.requestedQuantity}</strong>
                    </div>
                    <div>
                      <span>Available</span>
                      <strong>{product.quantity}</strong>
                    </div>
                    <div>
                      <span>Price</span>
                      <strong>{rupees(product.price)}</strong>
                    </div>
                  </div>

                  <ol className="pr-track">
                    {steps.map((s, i) => (
                      <li
                        className="pr-step"
                        key={s.title}
                        data-state={s.state}
                        data-done={s.state === "done"}
                      >
                        <span className="pr-node" aria-hidden="true">
                          {s.state === "done" ? "✓" : s.state === "bad" ? "✕" : i + 1}
                        </span>
                        <strong>{s.title}</strong>
                        <span className="note">{s.note}</span>
                      </li>
                    ))}
                  </ol>

                  {product.requestStatus === "CONFIRMED" &&
                    product.quotationStatus === "CONFIRMED" && (
                      <div className="pr-slip">
                        <h3>Quotation Confirmed</h3>
                        <dl>
                          <dt>Supplier</dt>
                          <dd>{product.supplierName}</dd>
                          <dt>Price per item</dt>
                          <dd>{rupees(product.price)}</dd>
                          <dt>Quantity</dt>
                          <dd>{product.requestedQuantity}</dd>
                        </dl>
                        <div className="pr-total">
                          <span>Total amount</span>
                          <strong>{rupees(product.quotationTotal)}</strong>
                        </div>
                      </div>
                    )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchaseRequests;