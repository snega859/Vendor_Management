import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Products.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const EMPTY_PRODUCT = { productName: "", price: "", quantity: "" };

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

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: "ok" | "err", text }
  const [search, setSearch] = useState("");

  // Get Products
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Unable to load products." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Input
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update Product
  const saveProduct = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSaving(true);

    const body = {
      productName: product.productName,
      price: Number(product.price),
      quantity: Number(product.quantity),
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/products/${editId}`, body);
        setStatus({ type: "ok", text: "Product updated." });
      } else {
        await axios.post("http://localhost:8080/api/products", body);
        setStatus({ type: "ok", text: "Product added." });
      }

      setProduct(EMPTY_PRODUCT);
      setEditId(null);
      getProducts();
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Operation failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setStatus({ type: "ok", text: "Product deleted." });
      if (id === editId) cancelEdit();
      getProducts();
    } catch (error) {
      console.log(error);
      setStatus({ type: "err", text: "Delete failed." });
    }
  };

  // Edit Product
  const editProduct = (item) => {
    setEditId(item.id);
    setProduct({
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setProduct(EMPTY_PRODUCT);
  };

  const totalUnits = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const stockValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
    0
  );
  const visible = products.filter((p) =>
    (p.productName || "").toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="pm-page">
      <header className="pm-bar">
        <div className="pm-brand">{BRAND_NAME}</div>
        <button className="pm-btn" onClick={() => navigate("/admin")}>
          Back to Admin
        </button>
      </header>

      <main className="pm-main">
        <div className="pm-head">
          <h1>Product Management</h1>
          <p>Add, update and keep track of the gadgets you sell.</p>
        </div>

        <div className="pm-stats">
          <div className="pm-stat">
            <span>Products</span>
            <strong>{products.length}</strong>
          </div>
          <div className="pm-stat">
            <span>Units in stock</span>
            <strong>{totalUnits.toLocaleString("en-IN")}</strong>
          </div>
          <div className="pm-stat">
            <span>Stock value</span>
            <strong>{rupees(stockValue)}</strong>
          </div>
        </div>

        {status && (
          <p className={`pm-status ${status.type}`} role="status">
            {status.text}
          </p>
        )}

        <div className="pm-layout">
          {/* PRODUCT FORM */}
          <form
            className={`pm-form ${editId ? "editing" : ""}`}
            onSubmit={saveProduct}
          >
            <h2>{editId ? "Update product" : "Add a product"}</h2>

            <div className="pm-field">
              <label htmlFor="productName">Product name</label>
              <input
                id="productName"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pm-field">
              <label htmlFor="price">Price</label>
              <div className="pm-money">
                <span aria-hidden="true">₹</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pm-field">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={product.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pm-form-actions">
              <button className="pm-btn primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editId ? "Update Product" : "Add Product"}
              </button>
              {editId && (
                <button className="pm-btn" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* PRODUCT LIST */}
          <section aria-label="Product list">
            {products.length > 0 && (
              <input
                className="pm-search"
                type="search"
                placeholder="Search products"
                aria-label="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}

            {loading ? (
              <p>Loading products…</p>
            ) : products.length === 0 ? (
              <div className="pm-empty">
                No products available. Add your first product using the form.
              </div>
            ) : visible.length === 0 ? (
              <div className="pm-empty">No products match your search.</div>
            ) : (
              <div className="pm-grid">
                {visible.map((item, i) => (
                  <article
                    key={item.id}
                    className={`pm-card ${item.id === editId ? "selected" : ""}`}
                    style={{ "--c": COLORS[i % COLORS.length] }}
                  >
                    <div className="pm-media" aria-hidden="true">
                      <svg viewBox="0 0 24 24">{iconFor(item.productName)}</svg>
                    </div>
                    <div className="pm-body">
                      <h3>{item.productName}</h3>
                      <div className="pm-price">{rupees(item.price)}</div>
                      <span
                        className={`pm-stock ${Number(item.quantity) === 0 ? "out" : ""}`}
                      >
                        {Number(item.quantity) === 0
                          ? "Out of stock"
                          : `Quantity: ${item.quantity}`}
                      </span>
                      <div className="pm-actions">
                        <button className="pm-btn" onClick={() => editProduct(item)}>
                          Update
                        </button>
                        <button
                          className="pm-btn danger"
                          onClick={() => deleteProduct(item.id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default Products;