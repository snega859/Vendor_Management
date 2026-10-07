
import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {

    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // GET VENDORS
    // =========================

    const getVendors = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/api/vendors"
            );

            setVendors(response.data);

        } catch (error) {

            console.log("Vendor Error:", error);

            setError("Failed to load vendor data");

        }
    };


    // =========================
    // GET PRODUCTS
    // =========================

    const getProducts = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/api/products"
            );

            setProducts(response.data);

        } catch (error) {

            console.log("Product Error:", error);

            setError("Failed to load product data");

        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                getVendors(),
                getProducts()
            ]);

            setLoading(false);
        };

        loadData();

    }, []);


    // =========================
    // VENDOR COUNTS
    // =========================

    const totalVendors = vendors.length;

    const activeVendors = vendors.filter(
        (vendor) =>
            vendor.status === "ACTIVE"
    ).length;

    const inactiveVendors = vendors.filter(
        (vendor) =>
            vendor.status === "INACTIVE"
    ).length;


    // =========================
    // PRODUCT COUNTS
    // =========================

    const totalProducts = products.length;


    // =========================
    // PENDING PURCHASES
    // =========================

    const pendingQuantity =
        products
            .filter(
                (product) =>
                    product.requestStatus === "PENDING"
            )
            .reduce(
                (total, product) =>
                    total +
                    Number(product.requestedQuantity || 0),
                0
            );


    // =========================
    // REJECTED PURCHASES
    // =========================

    const rejectedQuantity =
        products
            .filter(
                (product) =>
                    product.requestStatus === "REJECTED"
            )
            .reduce(
                (total, product) =>
                    total +
                    Number(product.requestedQuantity || 0),
                0
            );


    // =========================
    // CURRENT QUANTITY
    // =========================

    const totalQuantity =
        products.reduce(
            (total, product) =>
                total +
                Number(product.quantity || 0),
            0
        );


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="reports-loading">

                <div className="loading-box">

                    <div className="loading-circle"></div>

                    <h2>
                        Loading Reports...
                    </h2>

                    <p>
                        Fetching vendor and product data
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="reports-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="reports-header">

                <div>

                    <span className="header-label">
                        VENDORSPHERE
                    </span>

                    <h1>
                        Reports & Analytics
                    </h1>

                    <p>
                        Track your vendors, products and procurement activity
                        from one place.
                    </p>

                </div>

                <div className="header-icon">
                    📊
                </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="error-message">

                    ⚠️ {error}

                </div>

            )}


            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="summary-grid">


                {/* VENDORS */}

                <div className="summary-card vendor-card">

                    <div className="card-top">

                        <div className="card-icon">
                            👥
                        </div>

                        <span className="card-tag">
                            VENDORS
                        </span>

                    </div>

                    <h2>
                        {totalVendors}
                    </h2>

                    <p>
                        Registered Vendors
                    </p>

                    <div className="card-footer">

                        <span>
                            Active
                        </span>

                        <strong>
                            {activeVendors}
                        </strong>

                    </div>

                </div>


                {/* PRODUCTS */}

                <div className="summary-card product-card">

                    <div className="card-top">

                        <div className="card-icon">
                            📦
                        </div>

                        <span className="card-tag">
                            PRODUCTS
                        </span>

                    </div>

                    <h2>
                        {totalProducts}
                    </h2>

                    <p>
                        Registered Products
                    </p>

                    <div className="card-footer">

                        <span>
                            Total Quantity
                        </span>

                        <strong>
                            {totalQuantity}
                        </strong>

                    </div>

                </div>


                {/* PENDING */}

                <div className="summary-card pending-card">

                    <div className="card-top">

                        <div className="card-icon">
                            ⏳
                        </div>

                        <span className="card-tag">
                            PENDING
                        </span>

                    </div>

                    <h2>
                        {pendingQuantity}
                    </h2>

                    <p>
                        Pending Purchase Quantity
                    </p>

                    <div className="card-footer">

                        <span>
                            Waiting for approval
                        </span>

                    </div>

                </div>


                {/* REJECTED */}

                <div className="summary-card rejected-card">

                    <div className="card-top">

                        <div className="card-icon">
                            ✕
                        </div>

                        <span className="card-tag">
                            REJECTED
                        </span>

                    </div>

                    <h2>
                        {rejectedQuantity}
                    </h2>

                    <p>
                        Rejected Purchase Quantity
                    </p>

                    <div className="card-footer">

                        <span>
                            Purchase requests
                        </span>

                    </div>

                </div>

            </div>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div className="content-grid">


                {/* =========================
                    VENDOR OVERVIEW
                ========================= */}

                <div className="report-card">

                    <div className="section-header">

                        <div>

                            <span className="section-small">
                                OVERVIEW
                            </span>

                            <h2>
                                Vendor Status
                            </h2>

                        </div>

                        <div className="section-icon">
                            👥
                        </div>

                    </div>


                    <div className="vendor-status">


                        {/* ACTIVE */}

                        <div className="status-item">

                            <div className="status-left">

                                <span className="status-dot active-dot"></span>

                                <span>
                                    Active Vendors
                                </span>

                            </div>

                            <strong>
                                {activeVendors}
                            </strong>

                        </div>


                        {/* INACTIVE */}

                        <div className="status-item">

                            <div className="status-left">

                                <span className="status-dot inactive-dot"></span>

                                <span>
                                    Inactive Vendors
                                </span>

                            </div>

                            <strong>
                                {inactiveVendors}
                            </strong>

                        </div>


                        {/* TOTAL */}

                        <div className="status-item total-status">

                            <div className="status-left">

                                <span className="status-dot total-dot"></span>

                                <span>
                                    Total Vendors
                                </span>

                            </div>

                            <strong>
                                {totalVendors}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =========================
                    PURCHASE OVERVIEW
                ========================= */}

                <div className="report-card">

                    <div className="section-header">

                        <div>

                            <span className="section-small">
                                PROCUREMENT
                            </span>

                            <h2>
                                Purchase Overview
                            </h2>

                        </div>

                        <div className="section-icon">
                            🛒
                        </div>

                    </div>


                    <div className="purchase-box">

                        <div className="purchase-number">
                            {pendingQuantity}
                        </div>

                        <div>

                            <h3>
                                Pending Quantity
                            </h3>

                            <p>
                                Items waiting for approval
                            </p>

                        </div>

                    </div>


                    <div className="purchase-box rejected-box">

                        <div className="purchase-number">
                            {rejectedQuantity}
                        </div>

                        <div>

                            <h3>
                                Rejected Quantity
                            </h3>

                            <p>
                                Items rejected from requests
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                PRODUCT TABLE
            ========================= */}

            <div className="report-card product-table-card">

                <div className="section-header">

                    <div>

                        <span className="section-small">
                            INVENTORY
                        </span>

                        <h2>
                            Product Report
                        </h2>

                    </div>

                    <div className="product-count">

                        {totalProducts} Products

                    </div>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Quantity
                                </th>

                                <th>
                                    Requested
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {products.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="empty-row"
                                    >
                                        No products available
                                    </td>

                                </tr>

                            ) : (

                                products.map(
                                    (product) => (

                                        <tr
                                            key={product.id}
                                        >

                                            <td>
                                                <span className="product-id">
                                                    #{product.id}
                                                </span>
                                            </td>

                                            <td>

                                                <div className="product-name">

                                                    <div className="product-avatar">
                                                        {product.productName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {product.productName}
                                                    </strong>

                                                </div>

                                            </td>

                                            <td>

                                                ₹
                                                {Number(
                                                    product.price || 0
                                                ).toLocaleString("en-IN")}

                                            </td>

                                            <td>

                                                <strong>
                                                    {product.quantity}
                                                </strong>

                                            </td>

                                            <td>

                                                {product.requestedQuantity || 0}

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        `status-badge ${
                                                            product.requestStatus ===
                                                            "PENDING"
                                                                ? "pending"
                                                                : product.requestStatus ===
                                                                  "CONFIRMED"
                                                                ? "confirmed"
                                                                : product.requestStatus ===
                                                                  "REJECTED"
                                                                ? "rejected"
                                                                : "normal"
                                                        }`
                                                    }
                                                >

                                                    {product.requestStatus}

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =========================
                FOOTER SUMMARY
            ========================= */}

            <div className="report-footer">

                <div>

                    <span>
                        Total Vendors
                    </span>

                    <strong>
                        {totalVendors}
                    </strong>

                </div>


                <div>

                    <span>
                        Total Products
                    </span>

                    <strong>
                        {totalProducts}
                    </strong>

                </div>


                <div>

                    <span>
                        Current Quantity
                    </span>

                    <strong>
                        {totalQuantity}
                    </strong>

                </div>


                <div>

                    <span>
                        Pending
                    </span>

                    <strong>
                        {pendingQuantity}
                    </strong>

                </div>

            </div>


            {/* =========================
                CSS
            ========================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }


                .reports-page {
                    min-height: 100vh;
                    padding: 30px;
                    background: #f6f8fc;
                    color: #172033;
                    font-family: Arial, sans-serif;
                }


                /* HEADER */

                .reports-header {
                    background: linear-gradient(
                        135deg,
                        #172554,
                        #2563eb
                    );

                    color: white;

                    border-radius: 22px;

                    padding: 32px 35px;

                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    margin-bottom: 25px;

                    box-shadow:
                        0 12px 30px rgba(37, 99, 235, 0.18);
                }


                .header-label {
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    opacity: 0.75;
                }


                .reports-header h1 {
                    margin: 8px 0;
                    font-size: 32px;
                }


                .reports-header p {
                    margin: 0;
                    opacity: 0.8;
                    font-size: 14px;
                }


                .header-icon {
                    width: 70px;
                    height: 70px;

                    border-radius: 18px;

                    background: rgba(255,255,255,0.15);

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 34px;
                }


                /* ERROR */

                .error-message {
                    background: #fff1f2;
                    color: #be123c;
                    padding: 15px 20px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    border: 1px solid #fecdd3;
                }


                /* SUMMARY */

                .summary-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(4, 1fr);

                    gap: 18px;

                    margin-bottom: 25px;
                }


                .summary-card {
                    position: relative;

                    background: white;

                    padding: 23px;

                    border-radius: 18px;

                    overflow: hidden;

                    box-shadow:
                        0 5px 20px rgba(15, 23, 42, 0.06);

                    transition:
                        transform 0.2s ease,
                        box-shadow 0.2s ease;
                }


                .summary-card:hover {
                    transform: translateY(-4px);

                    box-shadow:
                        0 12px 28px rgba(15, 23, 42, 0.10);
                }


                .summary-card::after {
                    content: "";

                    position: absolute;

                    width: 80px;
                    height: 80px;

                    border-radius: 50%;

                    right: -30px;
                    bottom: -30px;

                    opacity: 0.08;
                }


                .vendor-card::after {
                    background: #2563eb;
                }


                .product-card::after {
                    background: #7c3aed;
                }


                .pending-card::after {
                    background: #f59e0b;
                }


                .rejected-card::after {
                    background: #ef4444;
                }


                .card-top {
                    display: flex;

                    justify-content: space-between;

                    align-items: center;
                }


                .card-icon {
                    width: 42px;
                    height: 42px;

                    border-radius: 12px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #f1f5f9;

                    font-size: 20px;
                }


                .card-tag {
                    font-size: 10px;

                    font-weight: bold;

                    letter-spacing: 1px;

                    color: #64748b;
                }


                .summary-card h2 {
                    font-size: 32px;

                    margin: 22px 0 4px;
                }


                .summary-card p {
                    color: #64748b;

                    font-size: 13px;

                    margin: 0;
                }


                .card-footer {
                    margin-top: 20px;

                    padding-top: 13px;

                    border-top: 1px solid #edf0f5;

                    display: flex;

                    justify-content: space-between;

                    color: #64748b;

                    font-size: 12px;
                }


                .card-footer strong {
                    color: #172033;
                }


                /* MAIN GRID */

                .content-grid {
                    display: grid;

                    grid-template-columns: 1fr 1fr;

                    gap: 20px;

                    margin-bottom: 25px;
                }


                .report-card {
                    background: white;

                    border-radius: 18px;

                    padding: 25px;

                    box-shadow:
                        0 5px 20px rgba(15, 23, 42, 0.06);
                }


                .section-header {
                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    margin-bottom: 22px;
                }


                .section-small {
                    font-size: 10px;

                    letter-spacing: 1.5px;

                    font-weight: bold;

                    color: #64748b;
                }


                .section-header h2 {
                    margin: 5px 0 0;

                    font-size: 20px;
                }


                .section-icon {
                    width: 42px;
                    height: 42px;

                    border-radius: 12px;

                    background: #f1f5f9;

                    display: flex;

                    justify-content: center;
                    align-items: center;

                    font-size: 19px;
                }


                /* VENDOR STATUS */

                .vendor-status {
                    display: flex;

                    flex-direction: column;

                    gap: 13px;
                }


                .status-item {
                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    padding: 14px 16px;

                    border-radius: 12px;

                    background: #f8fafc;
                }


                .status-left {
                    display: flex;

                    align-items: center;

                    gap: 10px;

                    font-size: 14px;
                }


                .status-dot {
                    width: 9px;
                    height: 9px;

                    border-radius: 50%;
                }


                .active-dot {
                    background: #22c55e;
                }


                .inactive-dot {
                    background: #94a3b8;
                }


                .total-dot {
                    background: #2563eb;
                }


                .total-status {
                    background: #eff6ff;
                }


                /* PURCHASE */

                .purchase-box {
                    display: flex;

                    align-items: center;

                    gap: 18px;

                    padding: 17px;

                    border-radius: 14px;

                    background: #fffbeb;

                    margin-bottom: 12px;
                }


                .purchase-box.rejected-box {
                    background: #fff1f2;
                }


                .purchase-number {
                    width: 50px;
                    height: 50px;

                    border-radius: 14px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #fef3c7;

                    color: #92400e;

                    font-size: 20px;

                    font-weight: bold;
                }


                .rejected-box .purchase-number {
                    background: #ffe4e6;

                    color: #be123c;
                }


                .purchase-box h3 {
                    margin: 0 0 4px;

                    font-size: 14px;
                }


                .purchase-box p {
                    margin: 0;

                    color: #64748b;

                    font-size: 12px;
                }


                /* PRODUCT TABLE */

                .product-table-card {
                    margin-bottom: 25px;

                    overflow: hidden;
                }


                .product-count {
                    padding: 8px 13px;

                    border-radius: 20px;

                    background: #eff6ff;

                    color: #2563eb;

                    font-size: 12px;

                    font-weight: bold;
                }


                .table-container {
                    overflow-x: auto;
                }


                table {
                    width: 100%;

                    border-collapse: collapse;
                }


                th {
                    text-align: left;

                    padding: 14px;

                    background: #f8fafc;

                    color: #64748b;

                    font-size: 11px;

                    text-transform: uppercase;

                    letter-spacing: 0.5px;
                }


                td {
                    padding: 15px 14px;

                    border-bottom: 1px solid #edf0f5;

                    font-size: 13px;
                }


                tbody tr {
                    transition: background 0.2s ease;
                }


                tbody tr:hover {
                    background: #f8fafc;
                }


                .product-id {
                    color: #64748b;

                    font-size: 12px;
                }


                .product-name {
                    display: flex;

                    align-items: center;

                    gap: 10px;
                }


                .product-avatar {
                    width: 34px;
                    height: 34px;

                    border-radius: 10px;

                    background: #eff6ff;

                    color: #2563eb;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-weight: bold;
                }


                .status-badge {
                    display: inline-block;

                    padding: 6px 10px;

                    border-radius: 20px;

                    font-size: 10px;

                    font-weight: bold;
                }


                .status-badge.pending {
                    background: #fef3c7;

                    color: #92400e;
                }


                .status-badge.confirmed {
                    background: #dcfce7;

                    color: #166534;
                }


                .status-badge.rejected {
                    background: #ffe4e6;

                    color: #be123c;
                }


                .status-badge.normal {
                    background: #e2e8f0;

                    color: #475569;
                }


                .empty-row {
                    text-align: center;

                    padding: 35px;

                    color: #64748b;
                }


                /* FOOTER */

                .report-footer {
                    display: grid;

                    grid-template-columns:
                        repeat(4, 1fr);

                    gap: 15px;
                }


                .report-footer div {
                    background: white;

                    padding: 18px 20px;

                    border-radius: 14px;

                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    box-shadow:
                        0 4px 15px rgba(15, 23, 42, 0.05);
                }


                .report-footer span {
                    color: #64748b;

                    font-size: 12px;
                }


                .report-footer strong {
                    font-size: 18px;
                }


                /* LOADING */

                .reports-loading {
                    min-height: 100vh;

                    background: #f6f8fc;

                    display: flex;

                    align-items: center;

                    justify-content: center;
                }


                .loading-box {
                    text-align: center;
                }


                .loading-circle {
                    width: 45px;
                    height: 45px;

                    border: 4px solid #dbeafe;

                    border-top-color: #2563eb;

                    border-radius: 50%;

                    margin: auto auto 20px;

                    animation:
                        spin 0.8s linear infinite;
                }


                .loading-box h2 {
                    margin-bottom: 5px;
                }


                .loading-box p {
                    color: #64748b;
                }


                @keyframes spin {

                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }

                }


                /* RESPONSIVE */

                @media (max-width: 1000px) {

                    .summary-grid {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .content-grid {
                        grid-template-columns: 1fr;
                    }

                    .report-footer {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                }


                @media (max-width: 600px) {

                    .reports-page {
                        padding: 15px;
                    }

                    .reports-header {
                        padding: 25px;

                        border-radius: 17px;
                    }

                    .reports-header h1 {
                        font-size: 24px;
                    }

                    .header-icon {
                        display: none;
                    }

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .report-footer {
                        grid-template-columns: 1fr;
                    }

                    .report-card {
                        padding: 18px;
                    }

                }

            `}</style>

        </div>
    );
};

export default Reports;
