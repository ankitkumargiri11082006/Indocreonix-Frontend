import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import {
  clearPortalSession,
  getPortalUser,
  portalRequest,
  PORTAL_SESSION_EXPIRES_AT_KEY,
  setPortalSession,
  updatePortalUser,
} from "./portalAuthShared";
import { prepareAvatarDataUrl } from "../lib/avatarImage";
import "./PortalPages.css";

const INITIAL_SIGNIN = { email: "", password: "" };
const INITIAL_SIGNUP = {
  name: "",
  email: "",
  track: "both",
  otp: "",
  password: "",
  confirmPassword: "",
};

function PortalAccessPage({
  embedded = false,
  nextPath = "",
  onAuthenticated,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const googleButtonRef = useRef(null);
  const hasAutoOpenedProfileEditorRef = useRef(false);

  const [mode, setMode] = useState("signin");
  const [currentUser, setCurrentUser] = useState(() => getPortalUser());
  const [sessionRemainingMs, setSessionRemainingMs] = useState(0);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    roleTitle: "",
    location: "",
    bio: "",
    avatarUrl: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [signinForm, setSigninForm] = useState(INITIAL_SIGNIN);
  const [signupForm, setSignupForm] = useState(INITIAL_SIGNUP);
  const [signupStep, setSignupStep] = useState(1);
  const profileFileInputRef = useRef(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const googleClientId = useMemo(
    () => (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim(),
    [],
  );

  useEffect(() => {
    const requestedMode = String(searchParams.get("mode") || "").toLowerCase();
    if (requestedMode === "signin" || requestedMode === "signup") {
      setMode(requestedMode);
      if (requestedMode === "signup") {
        setSignupStep(1);
      }
      setError("");
      setMessage("");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!currentUser) return;
    const shouldOpenProfile =
      String(searchParams.get("profile") || "").toLowerCase() === "edit";
    if (shouldOpenProfile && !hasAutoOpenedProfileEditorRef.current) {
      hasAutoOpenedProfileEditorRef.current = true;
      openProfileEditor();
      return;
    }

    if (!shouldOpenProfile) {
      hasAutoOpenedProfileEditorRef.current = false;
    }
  }, [searchParams, currentUser]);

  function goToPostAuthDestination(user) {
    setCurrentUser(user);
    if (typeof onAuthenticated === "function") {
      onAuthenticated(user);
    }

    if (embedded && !nextPath) {
      return;
    }

    const safeNextPath = String(nextPath || "").trim();
    const safeNextFromProp =
      safeNextPath.startsWith("/") && !safeNextPath.startsWith("//");
    if (safeNextFromProp) {
      navigate(safeNextPath);
      return;
    }

    const requestedNext = String(searchParams.get("next") || "").trim();
    const isSafeNextPath =
      requestedNext.startsWith("/") && !requestedNext.startsWith("//");

    if (isSafeNextPath) {
      if (requestedNext.startsWith("/careers") && !user?.access?.career) {
        navigate(
          user?.defaultDashboard === "project"
            ? "/project/dashboard"
            : "/career/dashboard",
        );
        return;
      }

      if (requestedNext.startsWith("/project") && !user?.access?.project) {
        navigate(
          user?.defaultDashboard === "project"
            ? "/project/dashboard"
            : "/career/dashboard",
        );
        return;
      }

      navigate(requestedNext);
      return;
    }

    navigate(
      user?.defaultDashboard === "project"
        ? "/project/dashboard"
        : "/career/dashboard",
    );
  }

  useEffect(() => {
    if (!currentUser) return undefined;

    const intervalId = window.setInterval(() => {
      const expiresAt = Number(
        localStorage.getItem(PORTAL_SESSION_EXPIRES_AT_KEY) || 0,
      );
      const remaining = Math.max(0, expiresAt - Date.now());
      setSessionRemainingMs(remaining);

      if (remaining <= 0) {
        clearPortalSession();
        setCurrentUser(null);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [currentUser]);

  function switchAuthMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");

    if (nextMode === "signup") {
      setSignupStep(1);
    }

    if (embedded) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("mode", nextMode);
    setSearchParams(nextParams, { replace: true });
  }

  useEffect(() => {
    if (!currentUser) return;

    const expiresAt = Number(
      localStorage.getItem(PORTAL_SESSION_EXPIRES_AT_KEY) || 0,
    );
    setSessionRemainingMs(Math.max(0, expiresAt - Date.now()));
  }, [currentUser]);

  useEffect(() => {
    if (!googleClientId) return;

    let mounted = true;

    const initializeGoogle = () => {
      if (!mounted || !window.google?.accounts?.id || !googleButtonRef.current)
        return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response?.credential) {
            setError("Google authentication failed. Please try again.");
            return;
          }

          setError("");
          setMessage("");
          setGoogleLoading(true);

          try {
            const result = await portalRequest("/portal/auth/google", {
              method: "POST",
              body: JSON.stringify({
                credential: response.credential,
                flow: mode,
                track: signupForm.track,
              }),
            });
            setPortalSession({ token: result.token, user: result.user });
            goToPostAuthDestination(result.user);
          } catch (err) {
            setError(err.message);
          } finally {
            setGoogleLoading(false);
          }
        },
      });

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
        text: mode === "signup" ? "signup_with" : "signin_with",
        shape: "pill",
        width,
        logo_alignment: "left",
      });

      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return () => {
        mounted = false;
      };
    }

    const scriptId = "google-identity-services-script";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle);
      return () => {
        mounted = false;
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", initializeGoogle);
    document.body.appendChild(script);

    return () => {
      mounted = false;
      script.removeEventListener("load", initializeGoogle);
    };
  }, [googleClientId, mode, signupForm.track]);

  async function handleSignInSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await portalRequest("/portal/auth/login", {
        method: "POST",
        body: JSON.stringify(signinForm),
      });
      setPortalSession({ token: result.token, user: result.user });
      goToPostAuthDestination(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!signupForm.name.trim()) {
      setError("Name is required.");
      return;
    }

    setLoading(true);
    try {
      await portalRequest("/portal/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          track: signupForm.track,
        }),
      });
      setMessage("OTP sent to your email. Verify it and set password.");
      setSignupStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    setLoading(true);
    try {
      const result = await portalRequest("/portal/auth/verify-otp-register", {
        method: "POST",
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          otp: signupForm.otp,
          password: signupForm.password,
          track: signupForm.track,
        }),
      });
      setPortalSession({ token: result.token, user: result.user });
      goToPostAuthDestination(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getUserInitials(user) {
    const name = String(user?.name || "").trim();
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }

  function openProfileEditor() {
    if (!currentUser) return;
    setOriginalProfile({ ...currentUser });
    setProfileDraft({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      organization: currentUser.organization || "",
      roleTitle: currentUser.roleTitle || "",
      location: currentUser.location || "",
      bio: currentUser.bio || "",
      avatarUrl: currentUser.avatarUrl || "",
    });
    setIsProfileEditorOpen(true);
  }

  function onProfileFieldChange(event) {
    const { name, value } = event.target;
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  }

  function onAvatarBrowseClick() {
    profileFileInputRef.current?.click();
  }

  async function onAvatarFileChange(event) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Profile photo must be under 2MB.");
      return;
    }

    try {
      const optimizedDataUrl = await prepareAvatarDataUrl(file);
      setProfileDraft((prev) => ({ ...prev, avatarUrl: optimizedDataUrl }));
    } catch (err) {
      setError(
        err.message || "Could not process image. Please try another photo.",
      );
    } finally {
      if (profileFileInputRef.current) {
        profileFileInputRef.current.value = "";
      }
    }
  }

  async function onSaveProfile(event) {
    event.preventDefault();
    if (!currentUser) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await portalRequest("/portal/profile/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: profileDraft.name.trim(),
          phone: profileDraft.phone.trim(),
          organization: profileDraft.organization.trim(),
          roleTitle: profileDraft.roleTitle.trim(),
          location: profileDraft.location.trim(),
          bio: profileDraft.bio.trim(),
          avatarUrl: profileDraft.avatarUrl,
        }),
      });

      const updated = updatePortalUser(result.user || {});
      if (updated) {
        setCurrentUser(updated);
      }

      setMessage("Profile updated successfully.");
      setIsProfileEditorOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!embedded ? (
        <SEO
          title="Portal Access"
          description="Single page access for portal sign in and sign up."
          noindex={true}
        />
      ) : null}
      <section
        className={
          embedded
            ? "portal-shell portal-shell-login portal-shell-embedded"
            : "portal-shell portal-shell-login"
        }
      >
        <div className="portal-grid">
          <aside className="portal-hero-card">
            <p className="portal-kicker">Secure Access</p>
            <h1>One Elegant Gateway For Career And Project Portals</h1>
            <p>
              Continue with Google in seconds, or verify with OTP to create your
              email-password access with enterprise-grade session control.
            </p>
            <div className="portal-pill-row" aria-hidden="true">
              <span>Google Sign-In</span>
              <span>OTP + Password</span>
              <span>30-Min Session Protection</span>
            </div>
          </aside>

          <article className="portal-auth-card">
            {currentUser ? (
              <div className="portal-session-card">
                <div
                  className="portal-session-top-actions"
                  aria-label="Session quick actions"
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/career/dashboard")}
                  >
                    Career Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/project/dashboard")}
                  >
                    Project Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/portal")}
                  >
                    All Dashboards
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      clearPortalSession();
                      setCurrentUser(null);
                    }}
                  >
                    Logout
                  </button>
                </div>

                <div className="portal-session-head">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name || "Profile"}
                      className="portal-session-avatar"
                    />
                  ) : (
                    <span
                      className="portal-session-avatar portal-session-avatar-fallback"
                      aria-hidden="true"
                    >
                      {getUserInitials(currentUser)}
                    </span>
                  )}
                  <div>
                    <h2>Profile Session Active</h2>
                    <p className="portal-auth-subtitle">
                      You are securely signed in. Continue using your dashboards
                      or update profile details from the quick actions below.
                    </p>
                  </div>
                </div>
                <p className="portal-session-user">
                  <strong>Name:</strong> {currentUser.name || "Portal User"}
                </p>
                <p className="portal-session-user">
                  <strong>Email:</strong> {currentUser.email}
                </p>
                <p className="portal-session-user">
                  <strong>Session Remaining:</strong>{" "}
                  {Math.floor(sessionRemainingMs / 60000)}m{" "}
                  {Math.floor((sessionRemainingMs % 60000) / 1000)}s
                </p>
                <div className="portal-session-tags" aria-hidden="true">
                  <span>
                    {currentUser?.access?.career
                      ? "Career Access"
                      : "Career Locked"}
                  </span>
                  <span>
                    {currentUser?.access?.project
                      ? "Project Access"
                      : "Project Locked"}
                  </span>
                </div>
                <div className="portal-action-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={openProfileEditor}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="portal-mode-switch"
                  role="tablist"
                  aria-label="Portal auth modes"
                >
                  <button
                    type="button"
                    className={
                      mode === "signin"
                        ? "portal-mode-btn active"
                        : "portal-mode-btn"
                    }
                    onClick={() => switchAuthMode("signin")}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={
                      mode === "signup"
                        ? "portal-mode-btn active"
                        : "portal-mode-btn"
                    }
                    onClick={() => switchAuthMode("signup")}
                  >
                    Sign Up
                  </button>
                </div>

                <h2>
                  {mode === "signin" ? "Welcome Back" : "Create Your Account"}
                </h2>
                <p className="portal-auth-subtitle">
                  {mode === "signin"
                    ? "Sign in with Google or continue with your verified email credentials."
                    : "Sign up with Google instantly, or complete OTP verification to create your password."}
                </p>

                <div className="portal-google-wrap">
                  {googleClientId ? (
                    <>
                      <div
                        className="portal-google-slot"
                        ref={googleButtonRef}
                      />
                      {!googleReady ? (
                        <p className="portal-inline-note">
                          Loading Google access...
                        </p>
                      ) : null}
                      {googleLoading ? (
                        <p className="portal-inline-note">
                          Processing Google account...
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p className="portal-inline-note portal-inline-warning">
                      Google access is disabled. Add VITE_GOOGLE_CLIENT_ID in
                      frontend env.
                    </p>
                  )}
                </div>

                <div className="portal-auth-divider">
                  <span>or continue with email flow</span>
                </div>

                {mode === "signin" ? (
                  <form className="portal-form" onSubmit={handleSignInSubmit}>
                    <label>
                      Email
                      <input
                        type="email"
                        value={signinForm.email}
                        onChange={(event) =>
                          setSigninForm((prev) => ({
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
                      <input
                        type="password"
                        value={signinForm.password}
                        onChange={(event) =>
                          setSigninForm((prev) => ({
                            ...prev,
                            password: event.target.value,
                          }))
                        }
                        placeholder="Enter your password"
                        required
                      />
                    </label>
                    {error ? <p className="portal-error">{error}</p> : null}
                    {message ? (
                      <p className="portal-success">{message}</p>
                    ) : null}
                    <button
                      type="submit"
                      className="btn btn-primary portal-submit"
                      disabled={loading || googleLoading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                    <p className="portal-forgot-link">
                      <a href="/portal-forgot-password">Forgot Password?</a>
                    </p>
                  </form>
                ) : signupStep === 1 ? (
                  <form className="portal-form" onSubmit={handleSendOtp}>
                    <label>
                      Full Name
                      <input
                        type="text"
                        value={signupForm.name}
                        onChange={(event) =>
                          setSignupForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Your full name"
                        required
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(event) =>
                          setSignupForm((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        placeholder="you@company.com"
                        required
                      />
                    </label>
                    <label>
                      Portal Track
                      <select
                        value={signupForm.track}
                        onChange={(event) =>
                          setSignupForm((prev) => ({
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
                    {message ? (
                      <p className="portal-success">{message}</p>
                    ) : null}
                    <button
                      type="submit"
                      className="btn btn-primary portal-submit"
                      disabled={loading || googleLoading}
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </form>
                ) : (
                  <form className="portal-form" onSubmit={handleVerifyOtp}>
                    <label>
                      OTP Code
                      <input
                        type="text"
                        value={signupForm.otp}
                        onChange={(event) =>
                          setSignupForm((prev) => ({
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
                        value={signupForm.password}
                        onChange={(event) =>
                          setSignupForm((prev) => ({
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
                        value={signupForm.confirmPassword}
                        onChange={(event) =>
                          setSignupForm((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        placeholder="Confirm password"
                        required
                      />
                    </label>
                    {error ? <p className="portal-error">{error}</p> : null}
                    {message ? (
                      <p className="portal-success">{message}</p>
                    ) : null}
                    <div className="portal-action-row">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setSignupStep(1);
                          setError("");
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary portal-submit"
                        disabled={loading}
                      >
                        {loading
                          ? "Verifying..."
                          : "Verify OTP & Create Account"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </article>
        </div>

        {isProfileEditorOpen ? (
          <div
            className="portal-profile-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Edit profile"
          >
            <section className="portal-profile-modal">
              <div className="portal-profile-modal-head">
                <div>
                  <p className="portal-kicker">Profile Studio</p>
                  <h3>Update Profile Details</h3>
                </div>
                <button
                  type="button"
                  className="portal-profile-close"
                  onClick={() => setIsProfileEditorOpen(false)}
                  aria-label="Close profile editor"
                >
                  &times;
                </button>
              </div>

              <form className="portal-form" onSubmit={onSaveProfile}>
                <div className="portal-profile-avatar-row">
                  {profileDraft.avatarUrl ? (
                    <img
                      src={profileDraft.avatarUrl}
                      alt={profileDraft.name || "Profile preview"}
                      className="portal-profile-modal-avatar"
                    />
                  ) : (
                    <span
                      className="portal-profile-modal-avatar portal-session-avatar-fallback"
                      aria-hidden="true"
                    >
                      {getUserInitials(profileDraft)}
                    </span>
                  )}
                  <div className="portal-action-row">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onAvatarBrowseClick}
                    >
                      {profileDraft.avatarUrl ? "Replace Photo" : "Add Photo"}
                    </button>
                    {profileDraft.avatarUrl ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          setProfileDraft((prev) => ({
                            ...prev,
                            avatarUrl: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                    <input
                      ref={profileFileInputRef}
                      type="file"
                      accept="image/*"
                      className="portal-profile-file-input"
                      onChange={onAvatarFileChange}
                    />
                  </div>
                </div>

                <div className="portal-profile-grid">
                  <label>
                    Full Name
                    <input
                      name="name"
                      value={profileDraft.name}
                      onChange={onProfileFieldChange}
                      required
                    />
                  </label>
                  <label>
                    Email (locked)
                    <input
                      name="email"
                      value={profileDraft.email}
                      disabled
                      readOnly
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      name="phone"
                      value={profileDraft.phone}
                      onChange={onProfileFieldChange}
                      placeholder="+91 xxxxxxxxxx"
                    />
                  </label>
                  <label>
                    Organization
                    <input
                      name="organization"
                      value={profileDraft.organization}
                      onChange={onProfileFieldChange}
                      placeholder="Company / College"
                    />
                  </label>
                  <label>
                    Role
                    <input
                      name="roleTitle"
                      value={profileDraft.roleTitle}
                      onChange={onProfileFieldChange}
                      placeholder="Your role"
                    />
                  </label>
                  <label>
                    Location
                    <input
                      name="location"
                      value={profileDraft.location}
                      onChange={onProfileFieldChange}
                      placeholder="City, Country"
                    />
                  </label>
                  <label className="portal-profile-grid-full">
                    Bio
                    <textarea
                      name="bio"
                      value={profileDraft.bio}
                      onChange={onProfileFieldChange}
                      rows={3}
                      placeholder="Share your focus and goals"
                    />
                  </label>
                </div>

                {originalProfile ? (
                  <div className="portal-original-card">
                    <p className="portal-original-title">Original Details</p>
                    <p>Name: {originalProfile.name || "Not available"}</p>
                    <p>Email: {originalProfile.email || "Not available"}</p>
                    <p>Phone: {originalProfile.phone || "Not available"}</p>
                  </div>
                ) : null}

                <div className="portal-action-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsProfileEditorOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Profile
                  </button>
                </div>
              </form>
            </section>
          </div>
        ) : null}
      </section>
    </>
  );
}

export default PortalAccessPage;
