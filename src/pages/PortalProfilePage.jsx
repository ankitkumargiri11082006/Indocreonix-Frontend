import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import PortalSidebarLayout from "./PortalSidebarLayout";
import {
  clearPortalSession,
  getPortalUser,
  portalRequest,
  PORTAL_SESSION_EXPIRES_AT_KEY,
  updatePortalUser,
} from "./portalAuthShared";
import SEO from "../components/SEO";
import { useEffect, useMemo, useRef, useState } from "react";
import { prepareAvatarDataUrl } from "../lib/avatarImage";

function PortalProfilePage() {
  const [user, setUser] = useState(() => getPortalUser());
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sessionRemainingMs, setSessionRemainingMs] = useState(0);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
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
  const profileFileInputRef = useRef(null);
  const hasAutoOpenedEditorRef = useRef(false);

  const profileCompletion = useMemo(() => {
    const fields = [
      user?.name,
      user?.phone,
      user?.organization,
      user?.roleTitle,
      user?.location,
      user?.bio,
    ];

    const completed = fields.filter((value) => String(value || "").trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

  const profileHighlights = useMemo(
    () => [
      {
        label: "Profile Completion",
        value: `${profileCompletion}%`,
        detail: profileCompletion >= 80 ? "Great profile depth" : "Add missing details to improve", 
      },
      {
        label: "Career Access",
        value: user?.access?.career ? "Enabled" : "Disabled",
        detail: user?.access?.career ? "You can apply and track applications" : "Request career access from admin",
      },
      {
        label: "Project Access",
        value: user?.access?.project ? "Enabled" : "Disabled",
        detail: user?.access?.project ? "Project dashboard and requests are active" : "Request project access from admin",
      },
    ],
    [profileCompletion, user],
  );

  if (!user) {
    return <Navigate to="/portal" replace />;
  }

  function getUserInitials(profile) {
    const name = String(profile?.name || "").trim();
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }

  function openProfileEditor() {
    if (!user) return;
    setProfileError("");
    setProfileMessage("");
    setOriginalProfile({ ...user });
    setProfileDraft({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      organization: user.organization || "",
      roleTitle: user.roleTitle || "",
      location: user.location || "",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
    });
    setIsProfileEditorOpen(true);
  }

  function closeProfileEditor() {
    setIsProfileEditorOpen(false);
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
  }

  function requestEdit() {
    hasAutoOpenedEditorRef.current = true;
    const next = new URLSearchParams(searchParams);
    next.set("edit", "1");
    setSearchParams(next, { replace: true });
    openProfileEditor();
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
      setProfileError("Profile photo must be under 2MB.");
      return;
    }

    try {
      const optimizedDataUrl = await prepareAvatarDataUrl(file);
      setProfileDraft((prev) => ({ ...prev, avatarUrl: optimizedDataUrl }));
      setProfileError("");
    } finally {
      if (profileFileInputRef.current) {
        profileFileInputRef.current.value = "";
      }
    }
  }

  async function onSaveProfile(event) {
    event.preventDefault();
    if (!user) return;

    setProfileError("");
    setProfileMessage("");
    setProfileSaving(true);

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
      setUser(updated || getPortalUser());
      setProfileMessage("Profile updated successfully.");
      closeProfileEditor();
    } catch (err) {
      setProfileError(err?.message || "Could not update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  useEffect(() => {
    const wantsEdit = String(searchParams.get("edit") || "") === "1";
    if (!wantsEdit) {
      hasAutoOpenedEditorRef.current = false;
      return;
    }

    if (!hasAutoOpenedEditorRef.current) {
      hasAutoOpenedEditorRef.current = true;
      openProfileEditor();
    }
  }, [searchParams]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const expiresAt = Number(
        localStorage.getItem(PORTAL_SESSION_EXPIRES_AT_KEY) || 0,
      );
      const remaining = Math.max(0, expiresAt - Date.now());
      setSessionRemainingMs(remaining);

      if (remaining <= 0) {
        clearPortalSession();
        setUser(null);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const sessionLabel =
    sessionRemainingMs > 0
      ? `${Math.floor(sessionRemainingMs / 60000)}m ${Math.floor(
          (sessionRemainingMs % 60000) / 1000,
        )}s`
      : "Expired";

  return (
    <PortalSidebarLayout
      user={user}
      onEditProfile={() => navigate("/portal/profile?edit=1")}
      onLogout={() => {
        clearPortalSession();
        setUser(null);
      }}
    >
      <section className="portal-dashboard-shell">
        <SEO title="Profile" description="Your account profile." noindex={true} />

        <div className="portal-dashboard-topbar">
          <div>
            <p className="portal-kicker">Profile</p>
            <h1>{user.name || "Portal User"}</h1>
            <p>Review your account details and update them when needed.</p>
          </div>
          <div className="portal-dashboard-actions">
            <button type="button" className="btn btn-primary" onClick={requestEdit}>
              Edit Profile
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                clearPortalSession();
                setUser(null);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="portal-profile-summary-grid">
          <article className="portal-status-card portal-profile-account-card">
            <div className="portal-status-head">
              <p>Account Details</p>
              <span className="portal-status-pill portal-status-screening">Active</span>
            </div>
            <h3>{user.name || "Portal User"}</h3>
            <p className="portal-status-note">{user.email}</p>
            <div className="portal-profile-field-grid">
              <div>
                <p className="portal-profile-field-label">Phone</p>
                <p className="portal-profile-field-value">{user.phone || "Not added"}</p>
              </div>
              <div>
                <p className="portal-profile-field-label">Organization</p>
                <p className="portal-profile-field-value">{user.organization || "Not added"}</p>
              </div>
              <div>
                <p className="portal-profile-field-label">Role Title</p>
                <p className="portal-profile-field-value">{user.roleTitle || "Not added"}</p>
              </div>
              <div>
                <p className="portal-profile-field-label">Location</p>
                <p className="portal-profile-field-value">{user.location || "Not added"}</p>
              </div>
            </div>
            <p className="portal-status-note portal-profile-bio">
              {user.bio || "No bio added yet."}
            </p>
          </article>

          <article className="portal-status-card portal-profile-summary-card">
            <div className="portal-status-head">
              <p>Profile Snapshot</p>
              <span className="portal-status-pill portal-status-delivered">Summary</span>
            </div>
            <h3>Profile Completion</h3>
            <p className="portal-status-note">
              Your current account profile is {profileCompletion}% complete.
            </p>
            <div className="portal-metric-card portal-profile-completion-box">
              <p>Completion</p>
              <strong>{profileCompletion}%</strong>
              <span>{profileCompletion >= 80 ? "Profile looks strong" : "Add more details for a better profile"}</span>
            </div>
            <div className="portal-user-account-chips portal-profile-access-chips">
              <span className={`portal-user-chip ${user?.access?.career ? "is-active" : ""}`}>
                Career {user?.access?.career ? "On" : "Off"}
              </span>
              <span className={`portal-user-chip ${user?.access?.project ? "is-active" : ""}`}>
                Project {user?.access?.project ? "On" : "Off"}
              </span>
            </div>
            <div className="portal-profile-summary-actions">
              <button type="button" className="btn btn-primary" onClick={requestEdit}>
                Edit Profile
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  clearPortalSession();
                  setUser(null);
                }}
              >
                Logout
              </button>
            </div>
          </article>
        </div>

        <div className="portal-metric-grid" aria-label="Profile insights">
          {profileHighlights.map((item) => (
            <article key={item.label} className="portal-metric-card">
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <span>{item.detail}</span>
            </article>
          ))}
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card portal-priority-card-focus">
            <p className="portal-priority-label">Contact Snapshot</p>
            <h2>Professional Details</h2>
            <div className="portal-quick-grid">
              <article className="portal-quick-card">
                <h3>Email</h3>
                <p>{user.email || "Not provided"}</p>
              </article>
              <article className="portal-quick-card">
                <h3>Phone</h3>
                <p>{user.phone || "Add your phone number"}</p>
              </article>
              <article className="portal-quick-card">
                <h3>Organization</h3>
                <p>{user.organization || "Add your organization"}</p>
              </article>
              <article className="portal-quick-card">
                <h3>Role Title</h3>
                <p>{user.roleTitle || "Add your role title"}</p>
              </article>
            </div>
          </article>

          <article className="portal-priority-card">
            <p className="portal-priority-label">Recommended Next Steps</p>
            <h2>Improve Your Portal Experience</h2>
            <div className="portal-quick-grid">
              <button
                type="button"
                className="portal-quick-card portal-quick-card-button"
                onClick={requestEdit}
              >
                <h3>Complete Profile</h3>
                <p>Add bio, role title, and location for better onboarding.</p>
              </button>
              <button
                type="button"
                className="portal-quick-card portal-quick-card-button"
                onClick={() => navigate("/career/applications")}
              >
                <h3>Review Applications</h3>
                <p>Track current statuses and download approved files.</p>
              </button>
              <button
                type="button"
                className="portal-quick-card portal-quick-card-button"
                onClick={() => navigate("/project/dashboard")}
              >
                <h3>Check Projects</h3>
                <p>Monitor pending and delivered project updates.</p>
              </button>
            </div>
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
                  onClick={closeProfileEditor}
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

                {profileError ? <p className="portal-error">{profileError}</p> : null}
                {profileMessage ? (
                  <p className="portal-success">{profileMessage}</p>
                ) : null}

                <div className="portal-action-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeProfileEditor}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={profileSaving}
                  >
                    {profileSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        ) : null}
      </section>
    </PortalSidebarLayout>
  );
}

export default PortalProfilePage;
