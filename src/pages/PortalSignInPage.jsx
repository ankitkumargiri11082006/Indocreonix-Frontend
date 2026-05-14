import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { getPortalDashboardPath, portalRequest, setPortalSession } from "./portalAuthShared";
import { apiBaseUrl } from "../lib/apiClient";
import "./PortalPages.css";

function PortalSignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = String(window.location.hash || "");
    if (!hash.startsWith("#")) return;

    const params = new URLSearchParams(hash.slice(1));
    const token = params.get("portalToken") || "";
    const userEncoded = params.get("portalUser") || "";
    const oauthError = params.get("portalError") || "";

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }

    if (token && userEncoded) {
      try {
        const json = atob(userEncoded.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(userEncoded.length / 4) * 4, "="));
        const user = JSON.parse(json);
        setPortalSession({ token, user });
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        navigate(getPortalDashboardPath(user));
      } catch {
        setError("Google sign-in completed but could not be processed. Please try again.");
      }
    }
  }, [navigate]);

  function startGoogleSignIn() {
    setError("");
    const base = apiBaseUrl();
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const url = `${base}/portal/auth/google/start?flow=signin&returnTo=${encodeURIComponent(returnTo)}`;
    window.location.assign(url);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await portalRequest("/portal/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setPortalSession({ token: result.token, user: result.user });
      navigate(getPortalDashboardPath(result.user));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Portal Sign In"
        description="Sign in to career and project dashboards."
        noindex={true}
      />
      <section className="portal-shell portal-shell-login">
        <div className="portal-grid">
          <aside className="portal-hero-card">
            <p className="portal-kicker">Candidate + Client Portal</p>
            <h1>One Sign-In For Careers And Projects</h1>
            <p>
              Track applications, check project delivery stages, and stay
              connected with your updates in a single account.
            </p>
            <div className="portal-pill-row" aria-hidden="true">
              <span>Google sign-in ready</span>
              <span>OTP signup path</span>
              <span>Role progress tracking</span>
            </div>
          </aside>

          <article className="portal-auth-card">
            <h2>Sign In</h2>
            <p className="portal-auth-subtitle">
              Use Google for instant access or continue with email and password.
            </p>

            <div className="portal-google-wrap">
              <button
                type="button"
                className="btn btn-primary portal-submit"
                onClick={startGoogleSignIn}
                disabled={loading}
              >
                Continue with Google
              </button>
            </div>

            <div className="portal-auth-divider">
              <span>or sign in with password</span>
            </div>

            <form className="portal-form" onSubmit={handleSubmit}>
              <label>
                Work Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@company.com"
                  required
                />
              </label>

              <label>
                Password
                <div className="portal-password-row">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="portal-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              {error ? <p className="portal-error">{error}</p> : null}

              <button
                type="submit"
                className="btn btn-primary portal-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="portal-auth-footnote">
              New user?{" "}
              <Link to="/portal/signup">
                Create account with Google or OTP verification
              </Link>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default PortalSignInPage;
