import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Vendors from "./pages/Vendors";
import VendorList from "./pages/VendorList";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";
import PurchaseRequests from "./pages/PurchaseRequests";
import Quotations from "./pages/Quotations";
import PurchaseOrders from "./pages/PurchaseOrders";
import Reports from "./pages/Reports";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/vendor"
                    element={<UserDashboard />}
                />

                <Route
                    path="/vendors"
                    element={<Vendors />}
                />

                <Route
                    path="/vendor-list"
                    element={<VendorList />}
                />

                <Route
                    path="/suppliers"
                    element={<Suppliers />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/purchase-requests"
                    element={<PurchaseRequests />}
                />

                <Route
                    path="/quotations"
                    element={<Quotations />}
                />

                <Route
                    path="/purchase-orders"
                    element={<PurchaseOrders />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;