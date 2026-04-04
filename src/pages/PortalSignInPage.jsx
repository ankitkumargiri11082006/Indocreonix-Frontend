import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { portalRequest, setPortalSession } from "./portalAuthShared";
import { initializeGoogleIdentity } from "../lib/googleIdentity";
import "./PortalPages.css";

function PortalSignInPage() {
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

    initializeGoogleIdentity(googleClientId, async (response) => {
      if (!response?.credential) {
        setError("Google sign-in failed. Please try again.");
        return;
      }

      setError("");
      setGoogleLoading(true);

      try {
        const result = await portalRequest("/portal/auth/google", {
          method: "POST",
          body: JSON.stringify({
            credential: response.credential,
            flow: "signin",
          }),
        });
        setPortalSession({ token: result.token, user: result.user });
        navigate(
          result?.user?.defaultDashboard === "project"
            ? "/project/dashboard"
            : "/career/dashboard",
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setGoogleLoading(false);
      }
    })
      .then(() => {
        if (!mounted || !googleButtonRef.current) return;

        googleButtonRef.current.innerHTML = "";
        const containerWidth = Math.floor(
          googleButtonRef.current.getBoundingClientRect().width ||
            googleButtonRef.current.clientWidth ||
            360,
        );
        const width = Math.max(220, containerWidth - 2);
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "filled_blue",
          size: "large",
          text: "signin_with",
          shape: "pill",
          width,
          logo_alignment: "left",
        });

        setGoogleReady(true);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
      });

    return () => {
      mounted = false;
    };
  }, [googleClientId, navigate]);

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
      navigate(
        result?.user?.defaultDashboard === "project"
          ? "/project/dashboard"
          : "/career/dashboard",
      );
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
              {googleClientId ? (
                <>
                  <div className="portal-google-slot" ref={googleButtonRef} />
                  {!googleReady ? (
                    <p className="portal-inline-note">
                      Loading Google sign-in...
                    </p>
                  ) : null}
                  {googleLoading ? (
                    <p className="portal-inline-note">Validating account...</p>
                  ) : null}
                </>
              ) : (
                <p className="portal-inline-note portal-inline-warning">
                  Google sign-in is disabled. Add VITE_GOOGLE_CLIENT_ID in
                  frontend env.
                </p>
              )}
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
                disabled={loading || googleLoading}
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
