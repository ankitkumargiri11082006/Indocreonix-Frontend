import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { apiBaseUrl } from "../lib/apiClient";
import { ADMIN_TOKEN_KEY, setAdminSessionExpiry } from "../context/AuthContext";
import { ADMIN_BASE_PATH } from "../admin/adminPath";
import { adminPath } from "../admin/adminPath";

function LoginPage() {
  const { login, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = String(window.location.hash || "");
    if (!hash.startsWith("#")) return;

    const params = new URLSearchParams(hash.slice(1));
    const token = params.get("adminToken") || "";
    const userEncoded = params.get("adminUser") || "";
    const oauthError = params.get("adminError") || "";

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }

    if (token && userEncoded) {
      try {
        const json = atob(
          userEncoded
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(userEncoded.length / 4) * 4, "="),
        );
        const user = JSON.parse(json);
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
        setAdminSessionExpiry();
        setCurrentUser(user);
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
        navigate(ADMIN_BASE_PATH);
      } catch {
        setError(
          "Google sign-in completed but could not be processed. Please try again.",
        );
      }
    }
  }, [navigate, setCurrentUser]);

  function startAdminGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    const base = apiBaseUrl();
    const returnTo = `${window.location.pathname}${window.location.search}`;
    window.location.assign(
      `${base}/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(ADMIN_BASE_PATH);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!location.pathname.startsWith(ADMIN_BASE_PATH) ? (
        <SEO
          title="Login"
          description="Login to Indocreonix Admin Panel"
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

            <h2>Advanced Command Center</h2>
            <p>
              Access your full operations suite with colorful branding, secure
              controls, and real-time management for leads, media, users, and
              settings.
            </p>

            <ul className="auth-feature-list">
              <li>Role-based secure admin access</li>
              <li>Brand customization with live theme controls</li>
              <li>Cloud media and lead pipeline management</li>
            </ul>

            <div className="auth-showcase-metrics" aria-hidden="true">
              <article className="auth-showcase-metric">
                <p>Workspace Health</p>
                <strong>Live Ops Sync</strong>
                <span>
                  Leads, media, users and orders connected in one dashboard.
                </span>
              </article>
              <article className="auth-showcase-metric">
                <p>Command Velocity</p>
                <strong>Faster Admin Cycles</strong>
                <span>
                  Jump from analytics to execution in seconds with role-aware
                  navigation.
                </span>
              </article>
            </div>

            <div className="auth-trust-strip" aria-hidden="true">
              <span>Session protection</span>
              <span>Audit-ready actions</span>
              <span>Permission boundaries</span>
            </div>
          </aside>

          <div className="auth-card">
            <p className="auth-badge">Admin Access</p>
            <h1>Sign in to Admin Control Room</h1>
            <p className="auth-subtitle">
              Manage users, leads, branding, content, media, and operations from
              one secure dashboard.
            </p>

            <ul className="auth-assurance-list" aria-hidden="true">
              <li>
                <strong>Restricted Access:</strong> Only approved team members
                can enter admin workflows.
              </li>
              <li>
                <strong>Controlled Roles:</strong> Permissions define exactly
                what each account can edit.
              </li>
              <li>
                <strong>Safer Sessions:</strong> Auth token sessions are
                validated against backend identity checks.
              </li>
            </ul>

            <div className="auth-meta-grid" aria-hidden="true">
              <p className="auth-meta-card">Role-aware access</p>
              <p className="auth-meta-card">Session-protected API</p>
              <p className="auth-meta-card">Audit-friendly workflows</p>
            </div>

            <div className="auth-sso-panel">
              <p className="auth-sso-title">Quick Sign-In</p>
              <button
                type="button"
                className="auth-google-btn"
                onClick={startAdminGoogleSignIn}
                disabled={googleLoading || loading}
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="auth-google-icon">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>Continue with Google</span>
              </button>
              {googleLoading ? (
                <p className="auth-inline-note">Redirecting to Google...</p>
              ) : null}
            </div>

            <div
              className="auth-divider"
              role="separator"
              aria-label="Alternative login methods"
            >
              <span>or continue with email and password</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="you@indocreonix.com"
                  required
                />
              </label>

              <label>
                Password
                <div className="auth-password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
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
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M4.2 3.2 3 4.4l4.4 4.4C5.4 10.2 4 12 4 12s3 6 8 6c2 0 3.8-.6 5.2-1.6l2.4 2.4 1.2-1.2L4.2 3.2ZM12 16c-2.2 0-4-1.8-4-4 0-.9.3-1.7.8-2.3l1.5 1.5a2 2 0 0 0 2.4 2.4l1.5 1.5A3.9 3.9 0 0 1 12 16Zm0-10c5 0 8 6 8 6s-.8 1.7-2.5 3.2l-1.4-1.4a4 4 0 0 0-4.9-4.9L9.8 7.5A8.7 8.7 0 0 1 12 6Z" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M12 6c5 0 8 6 8 6s-3 6-8 6-8-6-8-6 3-6 8-6Zm0 2c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {error ? <p className="auth-error">{error}</p> : null}

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading || googleLoading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <p className="auth-forgot-link">
                <Link to={adminPath('forgot-password')}>Forgot Password?</Link>
              </p>
            </form>

            <p className="auth-footer">
              Need access? Contact your superadmin to create your account.
            </p>
            <p className="auth-sub-footer">
              For enterprise onboarding, security policies, and role
              provisioning, contact the platform owner.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
