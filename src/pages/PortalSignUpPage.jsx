import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { getPortalDashboardPath, portalRequest, setPortalSession } from "./portalAuthShared";
import { apiBaseUrl } from "../lib/apiClient";
import "./PortalPages.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  track: "both",
  otp: "",
  password: "",
  confirmPassword: "",
};

function PortalSignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        setError("Google sign-up completed but could not be processed. Please try again.");
      }
    }
  }, [navigate]);

  function startGoogleSignUp() {
    setError("");
    setMessage("");
    const base = apiBaseUrl();
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const url = `${base}/portal/auth/google/start?flow=signup&track=${encodeURIComponent(formData.track)}&returnTo=${encodeURIComponent(returnTo)}`;
    window.location.assign(url);
  }

  async function sendOtp(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    setLoading(true);
    try {
      await portalRequest("/portal/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          track: formData.track,
        }),
      });
      setMessage("OTP sent to your email. Verify to complete sign-up.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtpAndCreate(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await portalRequest("/portal/auth/verify-otp-register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
          track: formData.track,
        }),
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
        title="Portal Sign Up"
        description="Create account with Google or email OTP verification."
        noindex={true}
      />
      <section className="portal-shell portal-shell-signup">
        <div className="portal-grid">
          <aside className="portal-hero-card">
            <p className="portal-kicker">Secure Access Setup</p>
            <h1>Create Your Career + Project Account</h1>
            <p>
              Google sign-up is always enabled. If you choose email sign-up, OTP
              verification is required before password setup.
            </p>
            <ol className="portal-step-list" aria-hidden="true">
              <li className={step >= 1 ? "active" : ""}>Account details</li>
              <li className={step >= 2 ? "active" : ""}>
                Verify OTP + set password
              </li>
              <li className={step >= 3 ? "active" : ""}>Access dashboard</li>
            </ol>
          </aside>

          <article className="portal-auth-card">
            <h2>Sign Up</h2>
            <p className="portal-auth-subtitle">
              Choose your preferred onboarding method.
            </p>

            <div className="portal-google-wrap">
              <button
                type="button"
                className="btn btn-primary portal-submit"
                onClick={startGoogleSignUp}
                disabled={loading}
              >
                Continue with Google
              </button>
            </div>

            <div className="portal-auth-divider">
              <span>or register with verified email OTP</span>
            </div>

            {step === 1 ? (
              <form className="portal-form" onSubmit={sendOtp}>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </label>

                <label>
                  Email
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
                  Primary Track
                  <select
                    value={formData.track}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        track: event.target.value,
                      }))
                    }
                  >
                    <option value="both">Career + Project</option>
                    <option value="career">Career only</option>
                    <option value="project">Project only</option>
                  </select>
                </label>

                {error ? <p className="portal-error">{error}</p> : null}
                {message ? <p className="portal-success">{message}</p> : null}

                <button
                  type="submit"
                  className="btn btn-primary portal-submit"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form className="portal-form" onSubmit={verifyOtpAndCreate}>
                <label>
                  OTP Code
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        otp: event.target.value,
                      }))
                    }
                    placeholder="Enter 6 digit OTP"
                    required
                  />
                </label>

                <label>
                  Set Password
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Create password"
                    required
                  />
                </label>

                <label>
                  Confirm Password
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Confirm password"
                    required
                  />
                </label>

                {error ? <p className="portal-error">{error}</p> : null}
                {message ? <p className="portal-success">{message}</p> : null}

                <div className="portal-action-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP & Create Account"}
                  </button>
                </div>
              </form>
            )}

            <p className="portal-auth-footnote">
              Already have an account?{" "}
              <Link to="/portal/signin">Sign in here</Link>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default PortalSignUpPage;
