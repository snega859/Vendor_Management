import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Quotations.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const rupees = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const Quotations = () => {
  const navigate = useNavigate();
  const slipRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [status, setStatus] = useState(null); // { type: "ok" | "err", text }

  // =========================
  // GET PRODUCTS
  // =========================
  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Failed to load products." });
    } finally {
      setLoadingList(false);
    }
  };

  // =========================
  // GET SUPPLIERS
  // =========================
  const getSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Failed to load suppliers." });
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    getProducts();
    getSuppliers();
  }, []);

  // =========================
  // SUPPLIER NAME
  // =========================
  const getSupplierName = (supplier) => {
    return (
      supplier.supplierName ||
      supplier.name ||
      supplier.companyName ||
      supplier.supplier_name ||
      "Unnamed Supplier"
    );
  };

  // =========================
  // PENDING REQUESTS
  // =========================
  const pendingRequests = products.filter(
    (product) =>
      product.requestStatus === "PENDING" &&
      product.quotationStatus !== "CONFIRMED"
  );

  // =========================
  // SELECT REQUEST
  // =========================
  const selectRequest = (product) => {
    setStatus(null);
    setSelectedProduct(product);
    setSelectedSupplier("");

    // On small screens the slip sits below the list, so bring it into view
    if (window.innerWidth <= 900) {
      setTimeout(
        () => slipRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        50
      );
    }
  };

  const cancelSelection = () => {
    setSelectedProduct(null);
    setSelectedSupplier("");
  };

  // =========================
  // CONFIRM QUOTATION
  // =========================
  const confirmQuotation = async () => {
    if (!selectedSupplier) {
      setStatus({ type: "err", text: "Please select a supplier." });
      return;
    }

    const supplier = suppliers.find(
      (item) => String(item.id) === String(selectedSupplier)
    );

    if (!supplier) {
      setStatus({ type: "err", text: "Supplier not found." });
      return;
    }

    const supplierName = getSupplierName(supplier);

    try {
      setLoading(true);
      setStatus(null);

      const response = await axios.put(
        `http://localhost:8080/api/products/${selectedProduct.id}/quotation-confirm`,
        { supplierName: supplierName }
      );

      // Update product in admin page
      setProducts((oldProducts) =>
        oldProducts.map((product) =>
          product.id === selectedProduct.id ? response.data : product
        )
      );

      setStatus({ type: "ok", text: "Quotation confirmed successfully." });
      cancelSelection();
    } catch (error) {
      console.log(error);
      setStatus({
        type: "err",
        text: error.response?.data?.message || "Failed to confirm quotation.",
      });
    } finally {
      setLoading(false);
    }
  };

  const total = selectedProduct
    ? Number(selectedProduct.price) * Number(selectedProduct.requestedQuantity)
    : 0;

  return (
    <div className="qt-page">
      <header className="qt-bar">
        <div className="qt-brand">{BRAND_NAME}</div>
        <button className="qt-btn" onClick={() => navigate("/admin")}>
          Back to Admin
        </button>
      </header>

      <main className="qt-main">
        <div className="qt-head">
          <h1>Quotation Management</h1>
          {!loadingList && (
            <span className="qt-count">{pendingRequests.length} pending</span>
          )}
        </div>
        <p className="qt-intro">
          Pick a purchase request, choose a supplier and confirm the quotation.
        </p>

        {status && (
          <p className={`qt-status ${status.type}`} role="status">
            {status.text}
          </p>
        )}

        <div className="qt-layout">
          {/* PENDING REQUESTS */}
          <section className="qt-list" aria-label="Pending purchase requests">
            <h2>Pending Purchase Requests</h2>

            {loadingList ? (
              <p>Loading requests…</p>
            ) : pendingRequests.length === 0 ? (
              <div className="qt-empty">
                <strong>All caught up</strong>
                No pending purchase requests.
              </div>
            ) : (
              <div className="qt-rows">
                {pendingRequests.map((product) => (
                  <article
                    key={product.id}
                    className={`qt-row ${
                      selectedProduct?.id === product.id ? "selected" : ""
                    }`}
                  >
                    <div>
                      <h3>{product.productName}</h3>
                      <p className="qt-meta">
                        <span>Request ID: <b>{product.id}</b></span>
                        <span>By: <b>{product.requestedBy}</b></span>
                        <span>Qty: <b>{product.requestedQuantity}</b></span>
                        <span>Price: <b>{rupees(product.price)}</b></span>
                      </p>
                    </div>
                    <button
                      className="qt-btn primary"
                      onClick={() => selectRequest(product)}
                    >
                      Create Quotation
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* QUOTATION SLIP */}
          <aside className="qt-slip" ref={slipRef} aria-live="polite">
            {selectedProduct ? (
              <>
                <h2>Create Quotation</h2>
                <p className="qt-slip-sub">Request ID: {selectedProduct.id}</p>

                <dl className="qt-lines">
                  <dt>Product</dt>
                  <dd>{selectedProduct.productName}</dd>
                  <dt>Requested by</dt>
                  <dd>{selectedProduct.requestedBy}</dd>
                  <dt>Quantity</dt>
                  <dd>{selectedProduct.requestedQuantity}</dd>
                  <dt>Price per item</dt>
                  <dd>{rupees(selectedProduct.price)}</dd>
                </dl>

                <div className="qt-total">
                  <span>Total amount</span>
                  <strong>{rupees(total)}</strong>
                </div>

                <label htmlFor="supplier">Select supplier</label>
                <select
                  id="supplier"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {getSupplierName(supplier)}
                    </option>
                  ))}
                </select>

                <div className="qt-slip-actions">
                  <button
                    className="qt-btn primary"
                    onClick={confirmQuotation}
                    disabled={loading}
                  >
                    {loading ? "Confirming…" : "Confirm Quotation"}
                  </button>
                  <button className="qt-btn" onClick={cancelSelection}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="qt-placeholder">
                <strong>No request selected</strong>
                Choose “Create Quotation” on a request to see its details here.
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Quotations;