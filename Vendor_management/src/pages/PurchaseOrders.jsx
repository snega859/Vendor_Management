import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PurchaseOrders.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const PurchaseOrders = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [status, setStatus] = useState(null); // { type: "ok" | "err", text }

  // Get products
  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Unable to load purchase requests." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Confirm or reject a request
  const handleRequest = async (id, action) => {
    const isConfirm = action === "confirm";
    setStatus(null);
    setBusyId(id);

    try {
      await axios.put(`http://localhost:8080/api/products/${id}/${action}`);
      setStatus({
        type: "ok",
        text: isConfirm ? "Request confirmed successfully." : "Request rejected.",
      });
      getProducts();
    } catch (error) {
      console.log(error);
      setStatus({
        type: "err",
        text:
          error.response?.data?.message ||
          (isConfirm ? "Failed to confirm request." : "Failed to reject request."),
      });
    } finally {
      setBusyId(null);
    }
  };

  // Show only pending requests
  const pendingRequests = products.filter(
    (product) => product.requestStatus === "PENDING"
  );

  return (
    <div className="po-page">
      <header className="po-bar">
        <div className="po-brand">{BRAND_NAME}</div>
        <button className="po-btn" onClick={() => navigate("/admin")}>
          Back to Admin
        </button>
      </header>

      <main className="po-main">
        <div className="po-head">
          <h1>Purchase Orders</h1>
          {!loading && (
            <span className="po-count">{pendingRequests.length} pending</span>
          )}
        </div>
        <p className="po-intro">
          Review requests from vendors and confirm or reject them.
        </p>

        {status && (
          <p className={`po-status ${status.type}`} role="status">
            {status.text}
          </p>
        )}

        {loading ? (
          <p>Loading purchase requests…</p>
        ) : pendingRequests.length === 0 ? (
          <div className="po-empty">
            <strong>All caught up</strong>
            No pending purchase requests.
          </div>
        ) : (
          <div className="po-grid">
            {pendingRequests.map((product) => {
              const requested = Number(product.requestedQuantity || 0);
              const available = Number(product.quantity || 0);
              const short = requested > available;
              const pct = available === 0 ? 100 : Math.min(100, (requested / available) * 100);
              const busy = busyId === product.id;

              return (
                <article className="po-card" key={product.id}>
                  <div className="po-card-head">
                    <div>
                      <h2>{product.productName}</h2>
                      <span className="po-id">Product ID: {product.id}</span>
                    </div>
                    <span className="po-pill">{product.requestStatus}</span>
                  </div>

                  <p className="po-by">
                    Requested by <strong>{product.requestedBy}</strong>
                  </p>

                  <div className="po-qty">
                    <div>
                      <span>Requested</span>
                      <strong>{requested}</strong>
                    </div>
                    <div>
                      <span>Available</span>
                      <strong>{available}</strong>
                    </div>
                  </div>

                  <div className="po-bar-track" aria-hidden="true">
                    <div
                      className={`po-bar-fill ${short ? "short" : ""}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className={`po-note ${short ? "short" : ""}`}>
                    {short
                      ? `Short by ${requested - available}`
                      : "Enough stock available"}
                  </p>

                  <div className="po-actions">
                    <button
                      className="po-btn confirm"
                      disabled={busy}
                      onClick={() => handleRequest(product.id, "confirm")}
                    >
                      Confirm
                    </button>
                    <button
                      className="po-btn reject"
                      disabled={busy}
                      onClick={() => handleRequest(product.id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchaseOrders;