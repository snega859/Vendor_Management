import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Vendors.css";

// Change this to rename the brand shown in the top bar
const BRAND_NAME = "Voltbay";

const EMPTY_VENDOR = {
  vendorName: "",
  companyName: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
};

const DETAIL_FIELDS = [
  { name: "vendorName", label: "Vendor name", autoComplete: "name" },
  { name: "companyName", label: "Company name", autoComplete: "organization" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Address", wide: true, autoComplete: "street-address" },
];

// Password rules shown to the user as a live checklist
const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "upper", label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "One number (0-9)", test: (p) => /\d/.test(p) },
  { key: "special", label: "One special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
  {
    key: "nouser",
    label: "Does not contain the username",
    test: (p, username) =>
      !username || !p.toLowerCase().includes(username.trim().toLowerCase()),
  },
];

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

const getStrength = (password, passed) => {
  if (!password) return 0;
  if (passed < PASSWORD_RULES.length) return passed <= 2 ? 1 : 2;
  return password.length >= 12 ? 4 : 3;
};

const Vendors = () => {
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(EMPTY_VENDOR);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null); // { type: "ok" | "err", text }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setVendor({
      ...vendor,
      [e.target.name]: e.target.value,
    });
  };

  // Password checks
  const results = PASSWORD_RULES.map((r) => ({
    ...r,
    ok: r.test(vendor.password, vendor.username),
  }));
  const passedCount = results.filter((r) => r.ok).length;
  const allRulesMet = passedCount === PASSWORD_RULES.length;
  const strength = getStrength(vendor.password, passedCount);
  const passwordsMatch =
    confirmPassword !== "" && confirmPassword === vendor.password;
  const canSubmit = allRulesMet && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!allRulesMet) {
      setStatus({ type: "err", text: "Please choose a stronger password." });
      return;
    }

    if (!passwordsMatch) {
      setStatus({ type: "err", text: "The two passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      // confirmPassword is kept out of this request on purpose
      await axios.post("http://localhost:8080/api/vendors/register", vendor);

      setStatus({ type: "ok", text: "Vendor registered successfully." });
      setVendor(EMPTY_VENDOR);
      setConfirmPassword("");
      setShowPassword(false);
    } catch (error) {
      console.log(error);
      setStatus({
        type: "err",
        text: "Registration failed. Check the details and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (f) => (
    <div className={`vr-field ${f.wide ? "vr-wide" : ""}`} key={f.name}>
      <label htmlFor={f.name}>{f.label}</label>
      <input
        id={f.name}
        name={f.name}
        type={f.type || "text"}
        autoComplete={f.autoComplete}
        value={vendor[f.name]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="vr-page">
      <header className="vr-bar">
        <div className="vr-brand">{BRAND_NAME}</div>
        <button className="vr-back" onClick={() => navigate("/admin")}>
          Back to Admin
        </button>
      </header>

      <main className="vr-main">
        <h1>Vendor Registration</h1>
        <p className="vr-intro">
          Add the vendor's details and create their login.
        </p>

        <form className="vr-card" onSubmit={handleSubmit}>
          <fieldset className="vr-group">
            <legend>
              <span aria-hidden="true">1</span>Vendor details
            </legend>
            <div className="vr-fields">{DETAIL_FIELDS.map(renderField)}</div>
          </fieldset>

          <fieldset className="vr-group">
            <legend>
              <span aria-hidden="true">2</span>Login account
            </legend>

            <div className="vr-fields">
              {/* USERNAME */}
              <div className="vr-field vr-wide">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={vendor.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="vr-field vr-wide">
                <label htmlFor="password">Password</label>
                <div className="vr-pw">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={vendor.password}
                    onChange={handleChange}
                    aria-describedby="pw-rules"
                    required
                  />
                  <button
                    type="button"
                    className="vr-toggle"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="vr-meter" data-level={strength} aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
                <p className="vr-strength" aria-live="polite">
                  {vendor.password
                    ? `Password strength: ${STRENGTH_LABELS[strength]}`
                    : "Choose a strong password"}
                </p>

                <ul className="vr-rules" id="pw-rules">
                  {results.map((r) => (
                    <li key={r.key} className={r.ok ? "ok" : ""}>
                      <span aria-hidden="true">{r.ok ? "✓" : "○"}</span>
                      {r.label}
                      <span className="vr-sr">{r.ok ? " (met)" : " (not met)"}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="vr-field vr-wide">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="vr-pw">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {confirmPassword && (
                  <p
                    className={`vr-hint ${passwordsMatch ? "ok" : "bad"}`}
                    aria-live="polite"
                  >
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {status && (
            <p className={`vr-status ${status.type}`} role="status">
              {status.text}
            </p>
          )}

          <button
            className="vr-submit"
            type="submit"
            disabled={loading || !canSubmit}
          >
            {loading ? "Registering…" : "Register Vendor"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Vendors;