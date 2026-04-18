import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PortalMenuToggle from "../components/PortalMenuToggle";

function getUserInitials(user) {
  const name = String(user?.name || user?.email || "").trim();
  if (!name) return "U";

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function SidebarItem({ item, onNavigate }) {
  if (item.type === "action") {
    return (
      <button type="button" className="portal-user-sidebar-link" onClick={item.onClick}>
        <span className="portal-user-sidebar-link-content">
          <span>{item.label}</span>
        </span>
      </button>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        isActive
          ? "portal-user-sidebar-link active"
          : "portal-user-sidebar-link"
      }
      onClick={onNavigate}
    >
      <span className="portal-user-sidebar-link-content">
        <span>{item.label}</span>
      </span>
    </NavLink>
  );
}

export default function PortalSidebarLayout({
  user,
  children,
  onLogout,
  onEditProfile,
}) {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [menuFilter, setMenuFilter] = useState("");
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 760px)").matches
      : false,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarPinned, setIsDesktopSidebarPinned] = useState(false);
  const [isDesktopSidebarHoverOpen, setIsDesktopSidebarHoverOpen] = useState(false);
  const [isDesktopSidebarDismissed, setIsDesktopSidebarDismissed] = useState(false);
  const isDashboardPage = useMemo(() => {
    const dashboardPaths = [
      "/portal/home",
      "/project/dashboard",
    ];

    return dashboardPaths.includes(location.pathname);
  }, [location.pathname]);
  const shouldKeepSidebarVisible = !isMobileView && isDashboardPage;

  const closeSidebar = useCallback(() => {
    if (isMobileView) {
      setIsMobileMenuOpen(false);
      return;
    }

    if (shouldKeepSidebarVisible) {
      setIsDesktopSidebarDismissed(true);
    }

    setIsDesktopSidebarPinned(false);
    setIsDesktopSidebarHoverOpen(false);
  }, [isMobileView, shouldKeepSidebarVisible]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");

    const syncMode = (event) => {
      const matches = Boolean(event?.matches ?? mediaQuery.matches);
      setIsMobileView(matches);
      setIsMobileMenuOpen(false);
      setIsDesktopSidebarHoverOpen(false);
      setIsDesktopSidebarPinned(false);
      setIsDesktopSidebarDismissed(false);
    };

    syncMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncMode);
      return () => mediaQuery.removeEventListener("change", syncMode);
    }

    mediaQuery.addListener(syncMode);
    return () => mediaQuery.removeListener(syncMode);
  }, []);

  useEffect(() => {
    if (isMobileView) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobileView]);

  useEffect(() => {
    if (!isMobileView && shouldKeepSidebarVisible && !isDesktopSidebarDismissed) {
      return;
    }

    if (!isMobileView && !isDesktopSidebarPinned && !isDesktopSidebarHoverOpen) {
      return;
    }

    if (isMobileView && !isMobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      const sidebarNode = sidebarRef.current;
      if (!sidebarNode) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      if (sidebarNode.contains(target)) return;

      if (target.closest(".portal-user-sidebar-edge-trigger")) return;

      closeSidebar();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [
    closeSidebar,
    isDesktopSidebarDismissed,
    isDesktopSidebarHoverOpen,
    isDesktopSidebarPinned,
    isMobileMenuOpen,
    isMobileView,
    shouldKeepSidebarVisible,
  ]);

  useEffect(() => {
    if (isMobileView) return;

    setIsDesktopSidebarHoverOpen(false);
    setIsDesktopSidebarPinned(isDashboardPage);
    setIsDesktopSidebarDismissed(false);
  }, [isDashboardPage, isMobileView]);

  const menuSections = useMemo(() => {
    const careerItems = [
      user?.access?.career
        ? {
            label: "Career Dashboard",
            to: "/career/dashboard",
            end: true,
          }
        : null,
      user?.access?.career
        ? {
            label: "Applications",
            to: "/career/applications",
            end: false,
          }
        : null,
      user?.access?.career
        ? {
            label: "Documents",
            to: "/career/documents",
            end: false,
          }
        : null,
      {
        label: "Openings",
        to: "/career/openings",
        end: false,
      },
    ].filter(Boolean);

    const projectItems = [
      user?.access?.project
        ? {
            label: "Project Dashboard",
            to: "/project/dashboard",
            end: true,
          }
        : null,
      user?.access?.project
        ? {
            label: "Start New Project",
            to: "/request-quote",
            end: false,
          }
        : null,
    ].filter(Boolean);

    return [
      {
        title: "Account",
        items: [
          {
            label: "Portal Home",
            to: "/portal/home",
            end: true,
          },
          {
            label: "Profile",
            to: "/portal/profile",
            end: false,
          },
          {
            label: "Edit Profile",
            type: "action",
            onClick: onEditProfile,
          },
        ],
      },
      {
        title: "Career",
        items: careerItems,
      },
      {
        title: "Project",
        items: projectItems,
      },
    ].filter((section) => section.items.length);
  }, [onEditProfile, user]);

  const filteredSections = useMemo(() => {
    const query = menuFilter.trim().toLowerCase();
    if (!query) return menuSections;

    return menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.label.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [menuFilter, menuSections]);

  const handleNavigate = () => {
    if (isMobileView) {
      setIsMobileMenuOpen(false);
      return;
    }

    if (shouldKeepSidebarVisible) {
      return;
    }

    setIsDesktopSidebarDismissed(true);

    setIsDesktopSidebarPinned(false);
    setIsDesktopSidebarHoverOpen(false);
  };

  const isSidebarOpen = isMobileView
    ? isMobileMenuOpen
    : (!isDesktopSidebarDismissed && shouldKeepSidebarVisible) || isDesktopSidebarPinned || isDesktopSidebarHoverOpen;

  const handleSidebarClose = closeSidebar;

  const handleSidebarToggle = () => {
    if (isMobileView) {
      setIsMobileMenuOpen((previous) => !previous);
      return;
    }

    if (shouldKeepSidebarVisible && !isDesktopSidebarDismissed) {
      return;
    }

    setIsDesktopSidebarDismissed(false);
    setIsDesktopSidebarPinned((previous) => !previous);
    setIsDesktopSidebarHoverOpen(true);
  };

  return (
    <div
      className={`portal-user-shell${isSidebarOpen ? " portal-user-shell-open" : ""}${
        shouldKeepSidebarVisible ? " portal-user-shell-dashboard-visible" : ""
      }`}
    >
      {!isMobileView && !shouldKeepSidebarVisible ? (
        <button
          type="button"
          className="portal-user-sidebar-edge-trigger"
          onMouseEnter={() => setIsDesktopSidebarHoverOpen(true)}
          onFocus={() => setIsDesktopSidebarHoverOpen(true)}
          aria-label="Reveal portal menu"
        />
      ) : null}

      <aside
        className={`portal-user-sidebar${isMobileMenuOpen ? " mobile-open" : ""}${
          !isMobileView && isSidebarOpen ? " desktop-open" : ""
        }`}
        aria-label="Portal navigation"
        ref={sidebarRef}
        onMouseEnter={() => {
          if (!isMobileView && !shouldKeepSidebarVisible) {
            setIsDesktopSidebarHoverOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobileView && !isDesktopSidebarPinned && !shouldKeepSidebarVisible) {
            setIsDesktopSidebarHoverOpen(false);
          }
        }}
      >
        <div className="portal-user-sidebar-profile" aria-label="User profile summary">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.name || "User avatar"}
              className="portal-user-sidebar-profile-avatar"
            />
          ) : (
            <div className="portal-user-sidebar-profile-avatar portal-user-sidebar-profile-avatar-fallback">
              {getUserInitials(user)}
            </div>
          )}
          <div className="portal-user-sidebar-profile-text">
            <p className="portal-user-sidebar-profile-name">{user?.name || "Portal User"}</p>
            <p className="portal-user-sidebar-profile-email">{user?.email || "No email"}</p>
          </div>
        </div>

        <div className="portal-user-sidebar-tools">
          <input
            className="portal-user-sidebar-search"
            type="text"
            placeholder="Search menu"
            value={menuFilter}
            onChange={(event) => setMenuFilter(event.target.value)}
            aria-label="Search portal menu"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inputMode="search"
            enterKeyHint="search"
          />
        </div>

        <nav className="portal-user-sidebar-nav">
          {filteredSections.length ? filteredSections.map((section) => (
            <section key={section.title} className="portal-user-sidebar-section">
              <p className="portal-user-sidebar-section-title">{section.title}</p>
              <div className="portal-user-sidebar-links">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    item={item}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </section>
          )) : (
            <p className="portal-user-sidebar-empty">No matching modules found.</p>
          )}
        </nav>

        <div className="portal-user-sidebar-footer">
          <button
            type="button"
            className="portal-user-logout-btn"
            onClick={onEditProfile}
          >
            Edit Profile
          </button>
          <button
            type="button"
            className="portal-user-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="portal-user-main">
        {isMobileView ? (
          <div className="portal-user-mobile-bar" aria-label="Portal quick bar">
            <PortalMenuToggle
              onClick={handleSidebarToggle}
              className="portal-user-menu-toggle-inline"
              label={isSidebarOpen ? "Close" : "Menu"}
            />
          </div>
        ) : null}

        {!isMobileView && !isSidebarOpen && !shouldKeepSidebarVisible ? (
          <PortalMenuToggle onClick={handleSidebarToggle} />
        ) : null}

        {isMobileView ? (
          <button
            type="button"
            className={`portal-user-sidebar-backdrop${isSidebarOpen ? " open" : ""}`}
            aria-label="Close portal menu overlay"
            aria-hidden={!isSidebarOpen}
            onClick={handleSidebarClose}
          />
        ) : null}

        <div className="portal-user-content">{children}</div>
      </div>
    </div>
  );
}