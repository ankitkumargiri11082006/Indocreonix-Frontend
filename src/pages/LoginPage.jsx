import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { initializeGoogleIdentity } from "../lib/googleIdentity";

function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const googleClientId = useMemo(
    () => (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim(),
    [],
  );

  useEffect(() => {
    if (!googleClientId) return;

    let mounted = true;
    let resizeObserver = null;

    const renderGoogleButton = () => {
      if (!googleButtonRef.current || !window.google?.accounts?.id) return;

      const containerWidth = googleButtonRef.current.clientWidth || 320;
      const responsiveWidth = Math.max(
        220,
        Math.min(380, Math.floor(containerWidth)),
      );

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        width: responsiveWidth,
        logo_alignment: "left",
      });
    };

    initializeGoogleIdentity(googleClientId, async (response) => {
      if (!response?.credential) {
        setError("Google sign-in failed. Please try again.");
        return;
      }

      setError("");
      setGoogleLoading(true);

      try {
        await loginWithGoogle(response.credential);
        navigate("/admin");
      } catch (err) {
        if (err?.status === 404) {
          setError(
            "Google login endpoint is not configured on backend yet. Please use email/password login for now.",
          );
        } else {
          setError(err.message);
        }
      } finally {
        setGoogleLoading(false);
      }
    })
      .then(() => {
        if (!mounted || !googleButtonRef.current) return;

        renderGoogleButton();

        if (typeof window.ResizeObserver === "function") {
          resizeObserver = new window.ResizeObserver(() => {
            renderGoogleButton();
          });
          resizeObserver.observe(googleButtonRef.current);
        }

        setGoogleReady(true);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
      });

    return () => {
      mounted = false;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [googleClientId, loginWithGoogle, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Login"
        description="Login to Indocreonix Admin Panel"
        noindex={true}
      />
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
              {googleClientId ? (
                <>
                  <div className="auth-google-slot" ref={googleButtonRef} />
                  {!googleReady ? (
                    <p className="auth-inline-note">
                      Loading Google Sign-In...
                    </p>
                  ) : null}
                  {googleLoading ? (
                    <p className="auth-inline-note">
                      Verifying Google account...
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="auth-inline-note auth-inline-note-warning">
                  Google Sign-In is disabled. Add VITE_GOOGLE_CLIENT_ID in
                  frontend .env to enable SSO.
                </p>
              )}
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
                <a href="/forgot-password">Forgot Password?</a>
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
