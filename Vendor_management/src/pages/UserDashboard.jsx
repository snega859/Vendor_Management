import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

// Card colours, cycled by position in the list
const COLORS = ["#3347ff", "#0e9f8e", "#7c4dff", "#e08a00", "#e5484d"];

// Picks a gadget icon from words in the product name
const ICONS = [
  [
    /phone|mobile|iphone|galaxy/,
    <>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>,
  ],
  [
    /watch|band|wear/,
    <>
      <rect x="7" y="6" width="10" height="12" rx="3" />
      <path d="M9 6l.7-3h4.6L15 6M9 18l.7 3h4.6l.7-3" />
    </>,
  ],
  [
    /laptop|notebook|macbook|computer|\bpc\b/,
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </>,
  ],
  [
    /head|ear|buds|speaker|audio|airpod|sound/,
    <>
      <path d="M4 15v-3a8 8 0 0116 0v3" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </>,
  ],
  [
    /camera|\bcam\b|lens/,
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>,
  ],
  [
    /\btv\b|monitor|screen|display/,
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </>,
  ],
  [
    /charger|cable|power|battery|adapter/,
    <path d="M9 3v4M15 3v4M6 7h12v4a6 6 0 01-12 0zM12 17v4" />,
  ],
];

const BOX_ICON = (
  <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9zM3 7.5l9 4.5 9-4.5M12 12v9" />
);

const iconFor = (name = "") => {
  const n = name.toLowerCase();
  const hit = ICONS.find(([re]) => re.test(n));
  return hit ? hit[1] : BOX_ICON;
};

const rupees = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

// Maps a request status to a pill colour
const pillClass = (status = "") => {
  const s = String(status).toUpperCase();
  if (s.includes("PEND")) return "pending";
  if (s.includes("CONFIRM") || s.includes("APPROV")) return "ok";
  if (s.includes("REJECT")) return "bad";
  return "";
};

const UserDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null); // { type: "ok" | "err", text }

  const username = localStorage.getItem("username") || "User";

  // GET PRODUCTS
  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Failed to load products." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // QUANTITY CHANGE
  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: value,
    });
  };

  const stepQuantity = (product, delta) => {
    const current = Number(quantities[product.id]) || 1;
    const next = Math.min(Math.max(1, current + delta), Number(product.quantity) || 1);
    handleQuantityChange(product.id, next);
  };

  // PLACE REQUEST
  const placeRequest = async (product) => {
    const quantity = Number(quantities[product.id]) || 1;

    if (quantity <= 0) {
      setStatus({ type: "err", text: "Please enter a valid quantity." });
      return;
    }

    if (quantity > product.quantity) {
      setStatus({
        type: "err",
        text: `Only ${product.quantity} items are available.`,
      });
      return;
    }

    try {
      setBusyId(product.id);
      setStatus(null);

      const response = await axios.put(
        `http://localhost:8080/api/products/${product.id}/request`,
        {
          requestedQuantity: quantity,
          requestedBy: username,
        }
      );

      // UPDATE IMMEDIATELY
      setProducts((oldProducts) =>
        oldProducts.map((item) => (item.id === product.id ? response.data : item))
      );

      setStatus({
        type: "ok",
        text: `Purchase request placed for ${product.productName}.`,
      });
    } catch (error) {
      console.log(error);
      setStatus({
        type: "err",
        text: error.response?.data?.message || "Failed to place request.",
      });
    } finally {
      setBusyId(null);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // USER'S REQUESTS
  const myRequests = products.filter(
    (product) =>
      product.requestedBy === username && product.requestStatus !== "NONE"
  );

  const pendingCount = myRequests.filter(
    (p) => p.requestStatus === "PENDING"
  ).length;

  const visible = products.filter((p) =>
    (p.productName || "").toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="ud-page">
      <header className="ud-bar">
        <div className="ud-brand">{BRAND_NAME}</div>
        <div className="ud-user">
          <span className="ud-avatar" aria-hidden="true">
            {username.charAt(0).toUpperCase()}
          </span>
          <button className="ud-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="ud-wrap">
        <section className="ud-hero">
          <h1>Welcome, {username}</h1>
          <p>Browse the gadgets in stock and send a purchase request.</p>

          <div className="ud-stats">
            <div className="ud-stat">
              <strong>{products.length}</strong>
              <span>Products</span>
            </div>
            <div className="ud-stat">
              <strong>{myRequests.length}</strong>
              <span>My requests</span>
            </div>
            <div className="ud-stat">
              <strong>{pendingCount}</strong>
              <span>Pending</span>
            </div>
          </div>
        </section>

        {status && (
          <p className={`ud-status ${status.type}`} role="status">
            {status.text}
          </p>
        )}

        <div className="ud-layout">
          {/* PRODUCTS */}
          <section aria-label="Available products">
            <div className="ud-section-head">
              <h2>Available Products</h2>
              {products.length > 0 && (
                <input
                  className="ud-search"
                  type="search"
                  placeholder="Search products"
                  aria-label="Search products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
            </div>

            {loading ? (
              <p>Loading products…</p>
            ) : products.length === 0 ? (
              <div className="ud-empty">No products available.</div>
            ) : visible.length === 0 ? (
              <div className="ud-empty">No products match your search.</div>
            ) : (
              <div className="ud-grid">
                {visible.map((product, i) => {
                  const pending = product.requestStatus === "PENDING";
                  const outOfStock = Number(product.quantity) === 0;
                  const qty = quantities[product.id] ?? 1;
                  const busy = busyId === product.id;

                  return (
                    <article
                      className="ud-card"
                      key={product.id}
                      style={{ "--c": COLORS[i % COLORS.length] }}
                    >
                      <div className="ud-media" aria-hidden="true">
                        <svg viewBox="0 0 24 24">{iconFor(product.productName)}</svg>
                      </div>

                      <div className="ud-body">
                        <h3>{product.productName}</h3>
                        <div className="ud-price">{rupees(product.price)}</div>
                        <span className={`ud-stock ${outOfStock ? "out" : ""}`}>
                          {outOfStock
                            ? "Out of stock"
                            : `${product.quantity} available`}
                        </span>

                        <label
                          className="ud-qty-label"
                          htmlFor={`qty-${product.id}`}
                        >
                          Request quantity
                        </label>
                        <div className="ud-stepper">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={pending || outOfStock}
                            onClick={() => stepQuantity(product, -1)}
                          >
                            −
                          </button>
                          <input
                            id={`qty-${product.id}`}
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={qty}
                            disabled={pending || outOfStock}
                            onChange={(e) =>
                              handleQuantityChange(product.id, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={pending || outOfStock}
                            onClick={() => stepQuantity(product, 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="ud-request"
                          disabled={pending || outOfStock || busy}
                          onClick={() => placeRequest(product)}
                        >
                          {pending
                            ? "Request Pending"
                            : outOfStock
                            ? "Out of stock"
                            : busy
                            ? "Sending…"
                            : "Place Request"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* USER REQUESTS */}
          <aside className="ud-aside" aria-label="My purchase requests">
            <h2>My Purchase Requests</h2>

            {myRequests.length === 0 ? (
              <div className="ud-empty">No purchase requests yet.</div>
            ) : (
              <ul className="ud-reqs">
                {myRequests.map((product) => (
                  <li className="ud-req" key={product.id}>
                    <div>
                      <strong>{product.productName}</strong>
                      <span className="q">
                        Quantity: {product.requestedQuantity}
                      </span>
                    </div>
                    <span className={`ud-pill ${pillClass(product.requestStatus)}`}>
                      {product.requestStatus}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;