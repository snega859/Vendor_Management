import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Change this to rename the brand shown on the login page
const BRAND_NAME = "Voltbay";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "") {
      setError("Please select a role.");
      return;
    }

    // ADMIN LOGIN
    if (role === "ADMIN") {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("username", "admin");
        localStorage.setItem("role", "ADMIN");
        navigate("/admin");
      } else {
        setError("Admin username or password is incorrect.");
      }
      return;
    }

    // VENDOR LOGIN
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password }
      );

      if (response.data.role === "VENDOR") {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", "VENDOR");
        navigate("/vendor");
      } else {
        setError("Vendor username or password is incorrect.");
      }
    } catch (err) {
      console.log(err);
      setError("Can't reach the server. Check that it's running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{BRAND_NAME}</h1>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="VENDOR">Vendor</option>
          </select>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="login-footer">
          New supplier?{" "}
          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/vendors")}
          >
            Register as vendor
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;