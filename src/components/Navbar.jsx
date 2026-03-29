import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import {
  clearPortalSession,
  getPortalUser,
  portalRequest,
  updatePortalUser,
} from "../pages/portalAuthShared";
import { prepareAvatarDataUrl } from "../lib/avatarImage";

const primaryNavItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Careers", path: "/careers" },
  { label: "Projects We Delivered", path: "/projects-delivered" },
  { label: "Get Quote", path: "/request-quote" },
  { label: "Contact", path: "/contact" },
];

const groupedNavItems = [
  {
    label: "Company",
    items: [
      { label: "Solutions", path: "/solutions" },
      { label: "Clients", path: "/clients" },
      { label: "Terms and Conditions", path: "/terms-and-conditions" },
      { label: "Privacy Policy", path: "/privacy-policy" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Insights", path: "/insights" },
      { label: "FAQ", path: "/faq" },
    ],
  },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const [portalUser, setPortalUser] = useState(() => getPortalUser());
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const location = useLocation();
  const navPanelRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const profileFileInputRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenMobileGroup(null);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen || isProfileEditorOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isProfileEditorOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsProfileEditorOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const syncPortalUser = () => setPortalUser(getPortalUser());

    window.addEventListener("storage", syncPortalUser);
    window.addEventListener("focus", syncPortalUser);
    window.addEventListener("portal-session-updated", syncPortalUser);

    return () => {
      window.removeEventListener("storage", syncPortalUser);
      window.removeEventListener("focus", syncPortalUser);
      window.removeEventListener("portal-session-updated", syncPortalUser);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onPointerDown = (event) => {
      const target = event.target;
      if (
        navPanelRef.current?.contains(target) ||
        navToggleRef.current?.contains(target)
      ) {
        return;
      }
      setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const onPointerDown = (event) => {
      const target = event.target;
      if (
        profileMenuRef.current?.contains(target) ||
        profileTriggerRef.current?.contains(target)
      ) {
        return;
      }
      setIsProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [isProfileMenuOpen]);

  function isPathSelected(path) {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  }

  function isGroupActive(group) {
    return group.items.some((item) => isPathSelected(item.path));
  }

  function onDesktopGroupToggle(groupLabel) {
    setOpenDesktopGroup((prev) => (prev === groupLabel ? null : groupLabel));
  }

  function isMobileGroupOpen(group) {
    if (openMobileGroup) return openMobileGroup === group.label;
    return isGroupActive(group);
  }

  function onMobileGroupToggle(groupLabel) {
    setOpenMobileGroup((prev) => (prev === groupLabel ? null : groupLabel));
  }

  function getPortalAuthMode() {
    if (location.pathname === "/portal-signup") return "signup";
    if (location.pathname === "/portal-signin") return "signin";
    if (location.pathname === "/portal") {
      const mode = new URLSearchParams(location.search).get("mode");
      return mode === "signup" ? "signup" : "signin";
    }
    return "signin";
  }

  function getAuthButtonClass(mode) {
    return mode === getPortalAuthMode()
      ? "nav-auth-btn nav-auth-btn-primary"
      : "nav-auth-btn nav-auth-btn-secondary";
  }

  function getDashboardPath(user) {
    return user?.defaultDashboard === "project"
      ? "/project/dashboard"
      : "/career/dashboard";
  }

  function getUserFirstName(user) {
    const name = String(user?.name || "").trim();
    if (!name) return "Account";
    return name.split(" ")[0];
  }

  function getUserInitials(user) {
    const name = String(user?.name || "").trim();
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }

  function openProfileEditor() {
    if (!portalUser) return;
    setProfileError("");
    setOriginalProfile({ ...portalUser });
    setProfileDraft({
      name: portalUser.name || "",
      email: portalUser.email || "",
      phone: portalUser.phone || "",
      organization: portalUser.organization || "",
      roleTitle: portalUser.roleTitle || "",
      location: portalUser.location || "",
      bio: portalUser.bio || "",
      avatarUrl: portalUser.avatarUrl || "",
    });
    setIsProfileEditorOpen(true);
    setIsProfileMenuOpen(false);
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
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Profile photo must be under 2MB.");
      return;
    }

    setProfileError("");

    try {
      const optimizedDataUrl = await prepareAvatarDataUrl(file);
      setProfileDraft((prev) => ({ ...prev, avatarUrl: optimizedDataUrl }));
    } catch (err) {
      setProfileError(
        err.message || "Could not process image. Please try another photo.",
      );
    } finally {
      if (profileFileInputRef.current) {
        profileFileInputRef.current.value = "";
      }
    }
  }

  function onRemoveAvatar() {
    setProfileDraft((prev) => ({ ...prev, avatarUrl: "" }));
  }

  async function onSaveProfile(event) {
    event.preventDefault();
    if (!portalUser || profileSaving) return;

    setProfileSaving(true);
    setProfileError("");

    try {
      const payload = {
        name: profileDraft.name.trim() || portalUser.name || "Portal User",
        phone: profileDraft.phone.trim(),
        organization: profileDraft.organization.trim(),
        roleTitle: profileDraft.roleTitle.trim(),
        location: profileDraft.location.trim(),
        bio: profileDraft.bio.trim(),
        avatarUrl: profileDraft.avatarUrl,
      };

      const result = await portalRequest("/portal/profile/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const updated = updatePortalUser(result?.user || payload);
      if (updated) {
        setPortalUser(updated);
      }

      setIsProfileEditorOpen(false);
    } catch (err) {
      setProfileError(
        err.message || "Could not save profile. Please try again.",
      );
    } finally {
      setProfileSaving(false);
    }
  }

  function handlePortalLogout() {
    clearPortalSession();
    setPortalUser(null);
    setIsProfileMenuOpen(false);
    setIsProfileEditorOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink className="brand" to="/">
          <img src="/logo.png" alt="Indocreonix logo" className="brand-logo" />
          <span className="brand-text">Indocreonix</span>
        </NavLink>

        <button
          ref={navToggleRef}
          type="button"
          className={isMenuOpen ? "nav-toggle nav-toggle-open" : "nav-toggle"}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="site-mobile-nav"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>

        <div
          className={
            isMenuOpen
              ? "site-nav-backdrop site-nav-backdrop-open"
              : "site-nav-backdrop"
          }
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />

        <nav
          ref={navPanelRef}
          id="site-mobile-nav"
          className={isMenuOpen ? "site-nav site-nav-open" : "site-nav"}
          aria-label="Main navigation"
        >
          <div className="nav-mobile-header">
            <div className="nav-mobile-brand-block">
              <img
                src="/logo.png"
                alt="Indocreonix logo"
                className="nav-mobile-logo"
              />
              <div>
                <p className="nav-mobile-title">Indocreonix</p>
                <p className="nav-mobile-tag">Build. Scale. Lead.</p>
              </div>
            </div>
          </div>

          <div className="nav-mobile-scroll">
            {primaryNavItems.map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
                style={{ "--anim-delay": `${i * 0.04}s` }}
              >
                {item.label}
                <span className="nav-link-arrow">→</span>
              </NavLink>
            ))}

            <div className="nav-group-list">
              {groupedNavItems.map((group) => (
                <div
                  key={group.label}
                  className={
                    isMobileGroupOpen(group)
                      ? "nav-group-block nav-group-block-open"
                      : "nav-group-block"
                  }
                >
                  <button
                    type="button"
                    className="nav-group-title"
                    aria-expanded={isMobileGroupOpen(group)}
                    onClick={() => onMobileGroupToggle(group.label)}
                  >
                    <span className="nav-group-title-copy">
                      <span className="nav-group-label">{group.label}</span>
                      <span className="nav-group-hint">Tap to expand</span>
                    </span>
                    <span className="nav-group-caret">▾</span>
                  </button>
                  <div
                    className={
                      isMobileGroupOpen(group)
                        ? "nav-group-items nav-group-items-open"
                        : "nav-group-items"
                    }
                  >
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          isActive
                            ? "nav-link nav-link-sub nav-link-active"
                            : "nav-link nav-link-sub"
                        }
                      >
                        {item.label}
                        <span className="nav-link-arrow">→</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="nav-mobile-bottom-actions">
              {portalUser ? (
                <div className="nav-mobile-profile-card">
                  <div className="nav-mobile-profile-head">
                    {portalUser.avatarUrl ? (
                      <img
                        src={portalUser.avatarUrl}
                        alt={portalUser.name || "User profile"}
                        className="nav-profile-avatar"
                      />
                    ) : (
                      <span
                        className="nav-profile-avatar nav-profile-avatar-fallback"
                        aria-hidden="true"
                      >
                        {getUserInitials(portalUser)}
                      </span>
                    )}
                    <div>
                      <p className="nav-mobile-profile-name">
                        {portalUser.name || "Portal User"}
                      </p>
                      <p className="nav-mobile-profile-email">
                        {portalUser.email || "No email found"}
                      </p>
                    </div>
                  </div>
                  <NavLink
                    to={getDashboardPath(portalUser)}
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-auth-btn nav-auth-btn-primary"
                  >
                    Open Dashboard
                  </NavLink>
                  <button
                    type="button"
                    className="nav-auth-btn nav-auth-btn-secondary"
                    onClick={openProfileEditor}
                  >
                    Manage Profile
                  </button>
                  <button
                    type="button"
                    className="nav-auth-btn nav-auth-btn-secondary"
                    onClick={handlePortalLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div
                  className="nav-auth-card nav-auth-card-mobile"
                  role="group"
                  aria-label="Sign in and sign up"
                >
                  <NavLink
                    to="/portal?mode=signin"
                    onClick={() => setIsMenuOpen(false)}
                    className={getAuthButtonClass("signin")}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/portal?mode=signup"
                    onClick={() => setIsMenuOpen(false)}
                    className={getAuthButtonClass("signup")}
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          <div
            className="site-nav-desktop-groups"
            aria-label="Secondary navigation"
          >
            {groupedNavItems.map((group) => (
              <div
                className={
                  openDesktopGroup === group.label
                    ? "nav-dropdown nav-dropdown-open"
                    : "nav-dropdown"
                }
                key={group.label}
                onMouseEnter={() => setOpenDesktopGroup(group.label)}
                onMouseLeave={() => setOpenDesktopGroup(null)}
                onFocusCapture={() => setOpenDesktopGroup(group.label)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenDesktopGroup(null);
                  }
                }}
              >
                <button
                  type="button"
                  className={
                    isGroupActive(group)
                      ? "nav-dropdown-trigger nav-dropdown-trigger-active"
                      : "nav-dropdown-trigger"
                  }
                  aria-expanded={openDesktopGroup === group.label}
                  aria-haspopup="true"
                  onClick={() => onDesktopGroupToggle(group.label)}
                >
                  {group.label}
                  <span className="nav-dropdown-caret">▾</span>
                </button>
                <div className="nav-dropdown-menu">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        isActive
                          ? "nav-dropdown-item nav-dropdown-item-active"
                          : "nav-dropdown-item"
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="nav-utility-zone" aria-label="Account actions">
          {portalUser ? (
            <div className="nav-profile-shell">
              <button
                ref={profileTriggerRef}
                type="button"
                className="nav-profile-toggle"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              >
                {portalUser.avatarUrl ? (
                  <img
                    src={portalUser.avatarUrl}
                    alt={portalUser.name || "User profile"}
                    className="nav-profile-avatar"
                  />
                ) : (
                  <span
                    className="nav-profile-avatar nav-profile-avatar-fallback"
                    aria-hidden="true"
                  >
                    {getUserInitials(portalUser)}
                  </span>
                )}
                <span className="nav-profile-text-wrap">
                  <span className="nav-profile-name">
                    {getUserFirstName(portalUser)}
                  </span>
                  <span className="nav-profile-caption">Account</span>
                </span>
              </button>

              <div
                ref={profileMenuRef}
                className={
                  isProfileMenuOpen
                    ? "nav-profile-menu nav-profile-menu-open"
                    : "nav-profile-menu"
                }
                role="menu"
              >
                <p className="nav-profile-menu-title">Signed in as</p>
                <p className="nav-profile-menu-email">{portalUser.email}</p>
                <NavLink
                  to={getDashboardPath(portalUser)}
                  className="nav-profile-menu-item"
                  role="menuitem"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Open Dashboard
                </NavLink>
                <button
                  type="button"
                  className="nav-profile-menu-item"
                  role="menuitem"
                  onClick={openProfileEditor}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="nav-profile-menu-item nav-profile-menu-danger"
                  role="menuitem"
                  onClick={handlePortalLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div
              className="nav-auth-card nav-auth-card-outside"
              role="group"
              aria-label="Sign in and sign up"
            >
              <span className="nav-account-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.31 0-6 1.79-6 4v1h12v-1c0-2.21-2.69-4-6-4z" />
                </svg>
              </span>
              <NavLink
                to="/portal?mode=signin"
                className={getAuthButtonClass("signin")}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/portal?mode=signup"
                className={getAuthButtonClass("signup")}
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {isProfileEditorOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="nav-profile-modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-label="Edit profile"
            >
              <section className="nav-profile-modal">
                <div className="nav-profile-modal-head">
                  <div>
                    <p className="nav-profile-modal-kicker">Profile Studio</p>
                    <h2>Update Your Profile</h2>
                  </div>
                  <button
                    type="button"
                    className="nav-profile-close"
                    aria-label="Close profile editor"
                    onClick={() => setIsProfileEditorOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                <form className="nav-profile-form" onSubmit={onSaveProfile}>
                  <div className="nav-profile-avatar-row">
                    {profileDraft.avatarUrl ? (
                      <img
                        src={profileDraft.avatarUrl}
                        alt={profileDraft.name || "Profile preview"}
                        className="nav-profile-modal-avatar"
                      />
                    ) : (
                      <span
                        className="nav-profile-modal-avatar nav-profile-avatar-fallback"
                        aria-hidden="true"
                      >
                        {getUserInitials(profileDraft)}
                      </span>
                    )}
                    <div className="nav-profile-avatar-actions">
                      <button
                        type="button"
                        className="nav-auth-btn nav-auth-btn-secondary"
                        onClick={onAvatarBrowseClick}
                      >
                        {profileDraft.avatarUrl ? "Replace Photo" : "Add Photo"}
                      </button>
                      {profileDraft.avatarUrl ? (
                        <button
                          type="button"
                          className="nav-auth-btn nav-auth-btn-secondary"
                          onClick={onRemoveAvatar}
                        >
                          Remove
                        </button>
                      ) : null}
                      <input
                        ref={profileFileInputRef}
                        type="file"
                        accept="image/*"
                        className="nav-profile-file-input"
                        onChange={onAvatarFileChange}
                      />
                    </div>
                  </div>

                  <div className="nav-profile-grid">
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
                        readOnly
                        disabled
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        name="phone"
                        value={profileDraft.phone}
                        onChange={onProfileFieldChange}
                        placeholder="+91 98xxxxxx"
                      />
                    </label>
                    <label>
                      Organization
                      <input
                        name="organization"
                        value={profileDraft.organization}
                        onChange={onProfileFieldChange}
                        placeholder="Company name"
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
                    <label className="nav-profile-grid-full">
                      Bio
                      <textarea
                        name="bio"
                        value={profileDraft.bio}
                        onChange={onProfileFieldChange}
                        rows={3}
                        placeholder="Tell us about your work focus"
                      />
                    </label>
                  </div>

                  {originalProfile ? (
                    <div className="nav-profile-original-card">
                      <p className="nav-profile-original-title">
                        Original Details
                      </p>
                      <p>Name: {originalProfile.name || "Not available"}</p>
                      <p>Email: {originalProfile.email || "Not available"}</p>
                      <p>Phone: {originalProfile.phone || "Not available"}</p>
                    </div>
                  ) : null}

                  {profileError ? (
                    <p className="auth-error">{profileError}</p>
                  ) : null}

                  <div className="nav-profile-form-actions">
                    <button
                      type="button"
                      className="nav-auth-btn nav-auth-btn-secondary"
                      onClick={() => setIsProfileEditorOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="nav-auth-btn nav-auth-btn-primary"
                      disabled={profileSaving}
                    >
                      {profileSaving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              </section>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}

export default Navbar;
