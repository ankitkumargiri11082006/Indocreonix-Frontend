import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import PasswordResetSuccessPopup from "../components/PasswordResetSuccessPopup";
import { ADMIN_BASE_PATH, adminPath } from "../admin/adminPath";
import { apiBaseUrl } from "../lib/apiClient";
import "./AdminForgotPasswordPage.css";

const API_BASE_URL = apiBaseUrl();

function AdminForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState("email"); // "email", "otp", "password"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setStep("otp");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/verify-forgot-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      setResetToken(data.resetToken);
      setStep("password");
      setError("");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, resetToken, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (step === "otp") {
      setStep("email");
      setOtp("");
    } else if (step === "password") {
      setStep("otp");
      setNewPassword("");
      setConfirmPassword("");
    }
    setError("");
  }

  return (
    <>
      {!location.pathname.startsWith(ADMIN_BASE_PATH) ? (
        <SEO
          title="Forgot Password"
          description="Reset your Indocreonix Admin password"
          noindex={true}
        />
      ) : null}
      <section className="auth-shell">
        <div className="auth-grid">
          <aside className="auth-showcase">
            <div className="auth-brand-row">
              <img
                src="/logo.png"
                alt="Indocreonix"
                className="auth-brand-logo"
              />
              <div>
                <p className="auth-brand-title">Indocreonix</p>
                <p className="auth-brand-tag">Build. Scale. Lead.</p>
              </div>
            </div>

            <h2>Secure Account Recovery</h2>
            <p>
              Quickly regain access to your admin account with our secure OTP-based
              password reset process.
            </p>

            <ul className="auth-feature-list">
              <li>Secure OTP verification</li>
              <li>Fast password reset process</li>
              <li>Instant account access</li>
            </ul>
          </aside>

          <div className="auth-card">
            <div className="forgot-password-header">
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate(adminPath('login'))}
              >
                ← Back to Login
              </button>
            </div>

            <h1>
              {step === "email"
                ? "Forgot Your Password?"
                : step === "otp"
                  ? "Verify OTP"
                  : "Create New Password"}
            </h1>
            <p className="auth-subtitle">
              {step === "email"
                ? "Enter your email address and we'll send you a verification code."
                : step === "otp"
                  ? "Enter the OTP code sent to your email."
                  : "Set a strong password for your account."}
            </p>

            {step === "email" && (
              <form className="auth-form" onSubmit={handleSendOtp}>
                <label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@indocreonix.com"
                    required
                  />
                </label>

                {error ? <p className="auth-error">{error}</p> : null}

                <button
                  type="submit"
                  className="btn btn-primary auth-submit"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <label>
                  OTP Code
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </label>

                <p className="auth-helper-text">
                  Check your email for the 6-digit code. Valid for 10 minutes.
                </p>

                {error ? <p className="auth-error">{error}</p> : null}

                <div className="auth-button-group">
                  <button
                    type="button"
                    className="btn btn-secondary auth-submit"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary auth-submit"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            )}

            {step === "password" && (
              <form className="auth-form" onSubmit={handleResetPassword}>
                <label>
                  New Password
                  <div className="auth-password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d="M4.2 3.2 3 4.4l4.4 4.4C5.4 10.2 4 12 4 12s3 6 8 6c2 0 3.8-.6 5.2-1.6l2.4 2.4 1.2-1.2L4.2 3.2ZM12 16c-2.2 0-4-1.8-4-4 0-.9.3-1.7.8-2.3l1.5 1.5a2 2 0 0 0 2.4 2.4l1.5 1.5A3.9 3.9 0 0 1 12 16Zm0-10c5 0 8 6 8 6s-.8 1.7-2.5 3.2l-1.4-1.4a4 4 0 0 0-4.9-4.9L9.8 7.5A8.7 8.7 0 0 1 12 6Z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d="M12 6c5 0 8 6 8 6s-3 6-8 6-8-6-8-6 3-6 8-6Zm0 2c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>

                <label>
                  Confirm Password
                  <div className="auth-password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </label>

                <p className="auth-helper-text">
                  Password must be at least 6 characters long.
                </p>

                {error ? <p className="auth-error">{error}</p> : null}

                <div className="auth-button-group">
                  <button
                    type="button"
                    className="btn btn-secondary auth-submit"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary auth-submit"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <PasswordResetSuccessPopup
        isOpen={showSuccessPopup}
        isAdminPortal={true}
      />
    </>
  );
}

export default AdminForgotPasswordPage;
